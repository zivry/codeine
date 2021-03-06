
$(document).ready( function () {
  if (isUserLogged()) {
    console.log("User is " + logged_user);
    var html = "<a href='#' class='dropdown-toggle' data-toggle='dropdown'><i class='fa fa-user'></i> " + logged_user + "<b class='caret'></b></a><ul class='dropdown-menu'>";
    html += "<li><a href='/user-info' ><i class='fa fa-info'></i> User Info</a></li>";
    if (authentication_method === 'Builtin') {
      html += "<li><a href='/logout?from=" + location.pathname + location.search + "' ><i class='fa fa-sign-out'></i> Sign Out</a></li>";
    }    
    html += "</ul>";
    $('#login_user').html(html);
  } else {
    console.log("User is not logged in");
    if (authentication_method === 'Builtin') {
      $('#login_user').html("<a style='color: white;' data-toggle='modal' href='#login_modal'><i class='fa fa-sign-in'></i> Sign in</a>");
    }
  } 
});

function isUserLogged() {
	return (logged_user !== "");
}

$('#deleteProjectMenuItem').click(function() {
	if (confirm("Are you sure you want to delete project " + getProjetcName() +"?") === true) {
		$.ajax( {
		    type: 'DELETE',
		    url: '/delete-project?project=' + getProjetcName() ,
		    success: function(response) {
		      console.log('success');
		      location.href = "/";
		    }, 
		    error: function(err) {
		      console.log('error');
	      
		      toast("error", "Failed to delete project", false);
		    }
	    });
	}
});

$('#codeine_register').click(function() {
  var data = {};
  data["password"] = $('#j_password').val();
  data["username"] = $('#j_username').val();
  $.ajax( 
      {
      	type: 'POST',
      	url: '/register' ,
      	dataType: 'json',
      	data: JSON.stringify(data),
      	success: function(response) {
          console.log('success');
          $('#login_form').submit();
        }, 
        error: function(err) {
            if (err.status === 409) {
              // show user already exists
              showLoginError("User already exists, please select a different username");
            } else {
              // display general error message
              console.log('error:');
              console.dir(err);
              showLoginError("Error registrating user");
            }
         }
    });
});
$('#codeine_login').click(function() {
  $.ajax({
    type: "POST",
    url: "j_security_check",
    // This is the type what you are waiting back from the server
    dataType: "text",
    async: true,
    crossDomain: false,
    data: {
        j_username: $('#j_username').val(),
        j_password: $('#j_password').val()
    },
    success: function(data, textStatus, xhr) {
        window.location.reload();
    },
    error: function(err, textStatus, errorThrown) {
      if (err.status === 404) {
        showLoginError("Could not reach server");
      } else {
        console.log(textStatus, errorThrown);
        showLoginError("Wrong username or password, please try again");
      }
    }
  });
});

function showLoginError(message) {
  $('#login_form').prepend("<div class='alert alert-error' style='display: none;' id='login_alert'>" +
                "<button type='button' class='close' data-dismiss='alert'>&times;</button>" +
                "<span>" + message + "</span> </div>");
  $('#login_alert').fadeIn();
}

function formatTemplatePath(name) {
      return "/resources/html/jsrendertemplates/" + name + ".tmpl.html";
}

function getProjetcName() {
	return getParameterByName('project');
}

function postToUrl(url, postData) {
	var form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", url);
	
	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "data");
	hiddenField.setAttribute("value", JSON.stringify(postData));
	form.appendChild(hiddenField);
	
	document.body.appendChild(form);
	form.submit();
}

function toast(type, msg, autoClose) {
	if (autoClose === undefined)
		autoClose = true;
	$('.top-right').notify({
	    message: 
	    { 
	    	text: msg
	    },
		type: type,
		fadeOut: { enabled: autoClose}
	  }).show(); 
}

function getInputValues(container) {
	var parameters = {};
	$(container).find(':input').each( function() {
		if ((this.id !== '') && ($(this).val() !== '')) {
			if (this.type === 'checkbox') {
				parameters[this.id] = this.checked;
			} else  { 
				parameters[this.id] = $(this).val();
			}
		}
		else if (($(this).data('id') !== '') && ($(this).val() !== '')) {
			if (this.type === 'checkbox') {
				parameters[$(this).data('id')] = this.checked;
			} else  { 
				var val = $(this).val();
				if ($(this).data('separator') !== undefined) {
					val = val.split($(this).data('separator'));
				}
				parameters[$(this).data('id')] = val;
			}
		}
	});
	return parameters;
}

function displayAlert(txt, type) {
	if (type === undefined) {
		type = 'info';
	}
	$('#mainContainer').prepend('<div class="row"><div class="span12">' +
	    		'<div id="alertContainer" class="alert alert-' + type + ' fade in">' +
	            '<button type="button" class="close" data-dismiss="alert">&times;</button>'+ txt
	            	 + '</div></div>');
	
	$('#alertMessage').alert();
}

function dismissAlert() {
	$("#alertContainer").alert('close');
}

function getParameterByName(name) {
   name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
   var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
       results = regex.exec(location.search);
   return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
 
function renderTemplate(tmplName, targetSelector, data, callback) {
      var file = formatTemplatePath(tmplName);
      $.get(file, null, function (template) {
        var tmpl = $.templates(template);
        var htmlString = tmpl.render(data);
        if (targetSelector) {
          $(targetSelector).html(htmlString);
        }
        if (callback)
          callback();
        return htmlString;
      });
}

$("#projectSearch").click( function() {
	  var val = $("#searchValue").val();
	  console.log("Will search for " + val);
	  location.href = "/?projectSearch=" +  val;
}); 

function escapeSelector(selector) {
    return selector.replace(/(!|"|#|\$|%|\'|\(|\)|\*|\+|\,|\.|\/|\:|\;|\?|@)/g, function($1, $2) {
        return "\\" + $2;
    });
}