#!/usr/intel/bin/perl
use strict;
die "Usage: startYamiClient <rsync user> <client port> <server port> <client install dir> <conf file name>  <rsync source>\n" if (@ARGV < 6);
die "Should be run by root\n" if ($>);
#
my $user = shift;
my $client_port = shift; 
my $server_port = shift;
my $client_install = shift;
my $conf_file = shift;
my $rsync_source = shift;
#
my $PS ="/bin/ps";
my $RSYNC = "/usr/intel/pkgs/rsync/3.0.6//bin/rsync";
my $FLAGS = "-avz --delete --delete-before --exclude .svn/";
my $java = "/usr/intel/pkgs/java/1.7.0.09-64/bin/java";
my $rsync_cmd = "/bin/su - $user -c \"$RSYNC $FLAGS $rsync_source $client_install/\"";

if (not -e $client_install){
  `mkdir -p $client_install`;
}
`chown -R $user:root $client_install`;

print "DEBUG: will run ($rsync_cmd)\n";
`$rsync_cmd`;
warn "SCRIPT ERROR: Failed to run ($rsync_cmd)(exit code $?)\n" if ($?);
my $pid_cmd = "$PS -eo pid,cmd | grep java | grep yami | grep yami.conf=$client_install/conf/$conf_file |grep 'yami.YamiClientBootstrap\$'| awk '{print \$1}'";
print "DEBUG: will run ($pid_cmd)\n";
my @pids = `$pid_cmd`;
if (scalar @pids > 0){
  if (scalar @pids == 1){
    print "DEBUG: going to kill previous instance $pids[0]\n";
    kill(9,@pids);
    sleep 5;
  }else{
    print "ERROR: found more than 1 previous instance of this yami monitor\n";
  }
}else{
  print "DEBUG: didn't find previous instances for this monitor\n";
}
my $java_cmd = "/usr/bin/nohup $java -Ddebug=true -Dyami.conf=$client_install/conf/$conf_file -DinstallDir=$client_install -Dport=$client_port -cp $client_install/bin/yami.jar yami.YamiClientBootstrap >> /tmp/yami_start 2>&1 < /dev/null &";
print "DEBUG: will run ($java_cmd)\n";
`$java_cmd`;
sleep 2;
@pids = `$pid_cmd`;
if (not scalar @pids){
  print "Failed to start yami client, check /tmp/yami_start for more information\n";
}else{
  print "Yami Client started successfully as @pids\n";
}