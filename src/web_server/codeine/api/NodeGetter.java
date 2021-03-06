package codeine.api;

import java.util.Collection;
import java.util.List;

import codeine.jsons.labels.LabelJsonProvider;
import codeine.jsons.peer_status.PeerStatusJsonV2;
import codeine.jsons.peer_status.PeersProjectsStatus;
import codeine.jsons.peer_status.ProjectStatus;
import codeine.model.Constants;
import codeine.version.ViewNodesFilter;

import com.google.common.base.Predicate;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import com.google.inject.Inject;

public class NodeGetter {
	@Inject	private PeersProjectsStatus peersProjectsStatus;
	@Inject	private LabelJsonProvider versionLabelJsonProvider;
	
	
	public NodeWithMonitorsInfo getNodeByName(String projectName, String nodeName){
		List<NodeWithMonitorsInfo> nodes = getNodes(projectName);
		for (NodeWithMonitorsInfo nodeWithMonitorsInfo : nodes) 
		{
			if (nodeWithMonitorsInfo.name().equals(nodeName)) 
				return nodeWithMonitorsInfo;
		}
		throw new IllegalArgumentException("Node " + nodeName + " not found in project " + projectName);
	}

	public List<PeerStatusJsonV2> peers() {
		return Lists.newArrayList(peersProjectsStatus.peer_to_projects().values());
	}

	public List<NodeWithMonitorsInfo> getNodes(String projectName) {
		return getNodes(projectName, Constants.ALL_VERSION);
	}

	public List<NodeWithMonitorsInfo> getNodes(String projectName, String versionName) {
		versionName = versionLabelJsonProvider.versionForLabel(versionName, projectName);
		ViewNodesFilter versionFilter = new ViewNodesFilter(versionName, Integer.MAX_VALUE, "", 0);
		Collection<PeerStatusJsonV2> allPeers = peersProjectsStatus.peer_to_projects().values();
		List<NodeWithMonitorsInfo> $ = Lists.newArrayList();
		for (PeerStatusJsonV2 peerStatusJsonV2 : allPeers) {
			ProjectStatus project = peerStatusJsonV2.project_name_to_status().get(projectName);
			if (project == null) {
				continue;
			}
			for (NodeWithMonitorsInfo node : project.nodes_info()) {
				String alias = node.alias();
				if ((versionName.equals(Constants.ALL_VERSION)) || (!versionFilter.filter(node.version(), alias))) {
					$.add(node);
				} 
			}
		}
		return $;
	}

	public List<NodeWithMonitorsInfo> getNodes(String projectName, final List<NodeWithPeerInfo> filterNodes) {
		Predicate<NodeWithMonitorsInfo> predicate = new Predicate<NodeWithMonitorsInfo>() {
			@Override
			public boolean apply(NodeWithMonitorsInfo n){
				for (NodeWithPeerInfo NodeWithPeerInfo : filterNodes) {
					if (NodeWithPeerInfo.name().equals(n.name())){
						return true;
					}
				}
				return false;
			}
		};
		return Lists.newArrayList(Iterables.filter(getNodes(projectName), predicate ));
	}
	
	

	
}
