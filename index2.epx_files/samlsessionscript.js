function postToSAMLsession(path, params, method) {
	method = method || "post";
	// Set method to post by default, if not specified.      
	var form = document.createElement("form");
	form.setAttribute("method", method);
	form.setAttribute("action", path);
	form.setAttribute("target", "_samlSessionIFrame");

	for (var key in params) {
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", key);
		hiddenField.setAttribute("value", params[key]);
		form.appendChild(hiddenField);
	}

	document.body.appendChild(form);
        //alert('postToSAMLsession submiting:' + form);
	form.submit();
}

//***************************************************************
// Callback functions

// Callback from auto login with https parent
function saml_callback(AuthStatus) {
	autoLoginCallback(AuthStatus);
}

// Callback from auto login with http parent
function saml_http_callback(AuthStatus) {
	autoLoginCallback(AuthStatus);
}

function autoLoginCallback(AuthStatus) {
    if (wcms_enabled())
        wcms_autoLoginCallback(AuthStatus);
    else
        nx_autoLoginCallback(AuthStatus);
}

function nx_autoLoginCallback(AuthStatus) {
	if (AuthStatus == "true") {
		//Refresh parent window if auto-login attempt was successful
		reloadParent();
	}
	else {
		// Start explicit login after failed auto-login attempt
		restartLogin();
	}
}

//after the user is logged in
function wcms_autoLoginCallback(AuthStatus) {
    //alert(AuthStatus);
    if (AuthStatus == "true") {
        //reloadParent();
        
        log_login();

        if (wcms_on_layer_close_handler != null)
            wcms_on_layer_close_handler();

        window.top.reload_header();
    }
    else {
        // Start explicit login after failed auto-login attempt
        //alert('restartLogin');
        restartLogin();
    }
};

var site_service_url = "siteservice.epx?kNtBzmUK9zU=1&BHEQK=1";

function log_login() {
    $.post(
            site_service_url,
            "LOG-ACTIVITY:"
        );
}

//***************************************************************
//LogOut
function saml_logout() {
	try {
		var u = parent.document.URL;
		var a = u.substring(u.indexOf('?') + 1, u.length);

		var samlUrl = "/profile/samllogoutrequest.epx?";
		if (window.location.protocol != "https:") {
			if (typeof SECURE_HOST_NAME != 'undefined') {
				samlUrl = SECURE_HOST_NAME + samlUrl;
			}
		}

		var samluid = new Array();
		createIframe();
		postToSAMLsession(samlUrl + a + "&BHEQK=1", samluid, "post");
		return true;
	}
	catch (e) {
		alert(e.Message);
	}
}

function saml_logout_callback(saml_npc_message) {
	try {
		if (typeof npc_log_out != 'undefined') {
			npc_log_out();
		}
	}
	catch (e) {
		alert(e.Message);
		if (typeof npc_log_out != 'undefined') {
			npc_log_out();
		}
	}
}

//***************************************************************
//Check Session: Step 1
function verifyCpsLogin(force) {
	var cps_Login_Cookie = null;
	try {
		cps_Login_Cookie = get_saml_cookie("NPC_CPS_SESSION");
		if (cps_Login_Cookie == null || force) {
			//Make SAML call
			set_saml_session_cookie("NPC_CPS_SESSION", "xxxxxx", 1);
			createIframe();
			trycpsLogin();
		}
	}
	catch (e) {
		alert(e.InnerException);
	}
}

//Check Session: Step 2:
function trycpsLogin() {
	var samlupwd = new Array();
	samlupwd["userid"] = "";
	samlupwd["password"] = "";
	var samlUrl = "/profile/samlverifylogin.epx?kNtBzmUK9zU=1&BHEQK=1";
	if (typeof SECURE_HOST_NAME != 'undefined') {
		samlUrl = SECURE_HOST_NAME + samlUrl;
	}
	postToSAMLsession(samlUrl, samlupwd, "post");
	return true;
}


function userLoggedInWCMS() {
   var wcms_cookie = get_saml_cookie("WCMS_IDS_SESSION");
   return wcms_cookie != null && wcms_cookie.length > 0 && wcms_cookie.toUpperCase() != "XXXXXX";
}


////Call Begins here upon every page load -- auto-check if the user is logged in IDS
$(document).ready(function () {
    if (!is_logged_in() && userLoggedInWCMS()) {
	var current_url = window.location.href.toLowerCase();
        if (current_url.indexOf("country-selector.epx") == -1 && current_url.indexOf("logout.epx") == -1 && current_url.indexOf("overlayhost.epx") == -1) {
            verifyCpsLogin();
        }
    }
});

////**************************************************************************************************
////Utility Functions
function reloadParent() {
	parent.location.reload();
}

function restartLogin() {
	LoginUrlCookieVal = get_saml_cookie("LOGIN_URL");
	if (LoginUrlCookieVal != null) {
		start_login_session(LoginUrlCookieVal);
	}
}

function add_session_input_field(form_object, field_type, field_name, field_value) {
	if (form_object) {
		var input = document.createElement('INPUT');
		if (document.all) {
			input.type = field_type;
			input.name = field_name;
			input.value = field_value;
		}
		else if (document.getElementById) {
			input.setAttribute('type', field_type);
			input.setAttribute('name', field_name);
			input.setAttribute('value', field_value);
			input.setAttribute('id', field_name);
		}
		form_object.appendChild(input);
	}
}

function set_saml_session_cookie(name, value, expdays) {
	var domain = "";

	if (typeof CookieDomain != "undefined")
		domain = CookieDomain;

	if (domain == "" && location.hostname.indexOf("sap.com") > -1)
		domain = "";

	var cv = name + "=" + value + "; path=/";

	if (domain != "")
		cv += "; domain=" + domain;

	document.cookie = cv;
}

function get_saml_cookie(name) {
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	while (i < clen) {
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg) {
			return getCookieVal(j);
		}
		i = document.cookie.indexOf(" ", i) + 1;
		if (i == 0) break;
	}
	return null;
}

function getCookieVal(offset) {
	var endstr = document.cookie.indexOf(";", offset);
	if (endstr == -1) { endstr = document.cookie.length; }
	return unescape(document.cookie.substring(offset, endstr));
}

function createIframe() {
	try {
		if($('#_samlSessionIFrame').length ==0)
			$('<iframe width="0px" height="0px" border="0px" id="_samlSessionIFrame" name="_samlSessionIFrame"></iframe>').appendTo('body');
	}
	catch (e) {
		alert(e.Message);
	}
}

//End: Utility Functions
//**************************************************************************************************

