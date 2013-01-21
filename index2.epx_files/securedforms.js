
//---------login/registration------

var _on_layer_close_handler = null;
var _anonymous_registration_url = '';
var _registration_url = '';
var _registration_dialog = '/common/formAbandonWarning.epx?kNtBzmUK9zU=1';
var _contactsap_dialog = '/contactsap/ContactsapAbandonWarning_nx.epx?kNtBzmUK9zU=1';
var _interstitial_abandon_warning = '/common/interstitialAbandonWarning.epx?kNtBzmUK9zU=1';
var _https_query_magic = "kNtBzmUK9zU";
var _https_query_magic_value = "=1";
var _pme_layer = 'pmelayer';
var _pme_layer_value = '=true';
var _start_login_session_success_handler = null;

function wcms_enabled() {
    return typeof _wcms_enabled != "undefined" && _wcms_enabled == true;
}

var _layer_css = {
contactsap : 'lw-contact',
registration: 'lw-registration',
login: 'lw-myprofile',
none : ''
};

var _layer_mode = {
    newLayer: 'new',
    replaceLayer: 'replace',
    none: ''
};

var _http_bridge_url = '/gwtservices/httpBridge.epx';

var _host_url_for_bridge_and_warning = null;

//////////////////////////////
//URL manipulation functions
/////////////////////////////
function set_host_for_bridge_and_warning_url()
{
    try {
        var url = top.window.location.href;
        if (url.toUpperCase().indexOf('HTTPS') > -1)
            _host_url_for_bridge_and_warning = SECURE_HOST_NAME; //if can access the top, means reg and top are in same domain
        else
            _host_url_for_bridge_and_warning = HOST_NAME;
    }
    catch (ex) {
        _host_url_for_bridge_and_warning = HOST_NAME;   //if cannot access the top, means reg and top are in different domain
    }
    /*
    if (typeof countryPath != "undefined") {
        if (_host_url_for_bridge_and_warning.toUpperCase().indexOf(countryPath) == -1)
            _host_url_for_bridge_and_warning = _host_url_for_bridge_and_warning + countryPath;
    }*/
}

function get_path(url) {
    var newURL = url;
    if ((newURL.toUpperCase().indexOf('HTTP://') > -1) || ((newURL.toUpperCase().indexOf('HTTPS://') > -1))) {
        var newURL = newURL.substring(newURL.indexOf('://') + 3);
        newURL = newURL.substring(newURL.indexOf('/'));
    }
    var index = newURL.indexOf('/');
    if ((index > 0) || (index < 0))
        newURL = '/' + newURL;

    if ((url.toUpperCase().indexOf("GWTSERVICE.EPX") < 0) && (url.toUpperCase().indexOf("CHECKSECURITY.EPX") < 0) && (typeof countryPath != "undefined")) {
        if (newURL.toUpperCase().indexOf(countryPath.toUpperCase()) == -1) {
            if (newURL.indexOf('/') == 0)
                newURL = newURL.substring(1, newURL.length);
            newURL = countryPath + newURL;
        }
    }

    return newURL;
}

function get_bridge_or_warning_url(url) {
    if ((typeof _host_url_for_bridge_and_warning == "undefined") || (_host_url_for_bridge_and_warning == '') || (_host_url_for_bridge_and_warning == null))
        set_host_for_bridge_and_warning_url();

    url = _host_url_for_bridge_and_warning + get_path(url);
    
    if (url.toUpperCase().indexOf('HTTPS') > -1) {
        var sep = get_separator(url);

        if (url.indexOf(_https_query_magic) < 0) {
            url = url + sep + _https_query_magic + _https_query_magic_value;
        }
    }

    return url;
}

function get_separator(url) {
    var sep = "?";

    if (url.indexOf("?") > 0)
        sep = "&";

    return sep;
}

function build_secure_pme_url(url) {
    if ((typeof url == "undefined") || (url == '') || (url == null)) {
        return url;
    }

    var newURL = get_path(url);
    var sep = get_separator(newURL);

    if (newURL.indexOf(_https_query_magic) < 0) {
        newURL = newURL + sep + _https_query_magic + _https_query_magic_value;
        sep = "&";
    }

    if (newURL.toUpperCase().indexOf('PMELAYER') < 0)
        newURL = newURL + sep + _pme_layer + _pme_layer_value;

    return SECURE_HOST_NAME + newURL;
}

function build_warning_url(warning_url) {
    if ((typeof warning_url == "undefined") || (warning_url == '') || (warning_url == null)) {
        return warning_url;
    }

    var newURL = get_path(warning_url);

    newURL = get_bridge_or_warning_url(newURL);
    return newURL;
}

/////////////////////////
function get_home_page() {
    var homePage = HOST_NAME;
    if (typeof countryPath != "undefined") {
        if (homePage.toUpperCase().indexOf(countryPath) == -1)
            homePage = homePage + countryPath;
    }
    else
        homePage = homePage + "/";

    homePage = homePage + "index.epx";
    return homePage;
}

/////////////////////////
// Start a session for ContactSAP or registration
// These functions are called from host.ascx, Save, and Asset pages
////////////////////////

function start_new_session(url, dialog, on_layer_close_handler) {
    scrolltotop();
    if ((url.toUpperCase().indexOf('PROFILE/LOGIN.EPX') > -1) || (url.toUpperCase().indexOf('PROFILE/UPGRADE.EPX') > -1) || (url.toUpperCase().indexOf('/NEWSLETTER/') > -1))
        start_registration_session(url, on_layer_close_handler);
    else if (url.toUpperCase().indexOf('/CONTACTSAP') > -1)
        start_contact_session(url, on_layer_close_handler);
    else
        start_session(url, dialog, on_layer_close_handler);
}

////////////////////////
// this method will be invoked to open campaign registration in a layer
///////////////////////
function start_session(url, warning_url, on_layer_close_handler) {
    if ((typeof url == "undefined") || (url == '') || (url == null)) {
        return url;
    }

    url = build_secure_pme_url(url);

    if ((typeof warning_url == "undefined") || (warning_url == '') || (warning_url == null))
        warning_url = _registration_dialog;

    warning_url = build_warning_url(warning_url);
    start_layer_session(url, warning_url, on_layer_close_handler, _layer_css.registration, _layer_mode.newLayer);
}

function start_contact_session(url, on_layer_close_handler) {
    if (wcms_enabled())
        wcms_start_contact_session(on_layer_close_handler);
    else
        nx_start_contact_session(url, on_layer_close_handler);
}

function nx_start_contact_session(url, on_layer_close_handler) {
    if ((typeof url == "undefined") || (url == '') || (url == null)) {
        return url;
    }

    url = build_secure_pme_url(url);

    var dialog = build_warning_url(_contactsap_dialog);
    start_layer_session(url, dialog, on_layer_close_handler, _layer_css.contactsap, _layer_mode.newLayer);
}

function start_registration_session(url, on_layer_close_handler) {
    if (wcms_enabled())
        wcms_start_registration_session(url, on_layer_close_handler);
    else
        nx_start_registration_session(url, on_layer_close_handler);
}

function nx_start_registration_session(url, on_layer_close_handler) {
    if ((typeof url == "undefined") || (url == '') || (url == null)) {
        return url;
    }

    url = build_secure_pme_url(url);

    if (url.toUpperCase().indexOf('LOGIN.EPX') > 0)
        url = url + '&level=3';

    var dialog = build_warning_url(_registration_dialog);
    start_layer_session(url, dialog, on_layer_close_handler, _layer_css.registration, _layer_mode.newLayer);
}

function start_login_session(url) {
    if (wcms_enabled())
        wcms_start_login_session(url);
    else
        nx_start_login_session(url);
}

function nx_start_login_session(url) {

    var autologin;
    autologin = tryAutoLogin("idmautologin");
    if (autologin == true) {
    	// Save off the URL in a cookie in case autologin doesn't succeed; we need to restart this function.
    	if (!(typeof url == "undefined") || (url == '') || (url == null)) {
    		set_saml_session_cookie("LOGIN_URL", url, 1);
    	}
    	createIframe();
    	trycpsLogin();
    }
    else {
    	if ((typeof url == "undefined") || (url == '') || (url == null)) {
    		return url;
    	}

    	url = build_secure_pme_url(url);

    	start_layer_session(url, '', _start_login_session_success_handler, _layer_css.login, _layer_mode.newLayer);
    }
}

function tryAutoLogin(varAutoLogin){
try{
	var siteCookie, pName, pValue;
	siteCookie = get_saml_cookie("SAP.SITE.COOKIE");
	if(siteCookie != null){
		var oCookie = siteCookie.split("&");
		for(iCookie=0;iCookie<oCookie.length;iCookie++){
			pName = oCookie[iCookie].substr(0,oCookie[iCookie].indexOf("="));
			pValue = oCookie[iCookie].substr(oCookie[iCookie].indexOf("=")+1);
			if(pName == varAutoLogin)
			{
				if(pValue == "true"){
					return true;
				}
				else{ return false; }
			}
		}
	}
	return true;
}
catch(e)
{
	return false;
}
}

function replace_with_registration_session(url, dialog, on_layer_close_handler) {
    if ((typeof url == "undefined") || (url == '') || (url == null)) {
        return url;
    }

    url = build_secure_pme_url(url);
    dialog = build_warning_url(dialog);
    start_layer_session(url, dialog, on_layer_close_handler, _layer_css.registration, _layer_mode.replaceLayer);
}

// TO DO: abandon warning is hardcoded
function replace_with_new_session(url, on_layer_close_handler) {
    if ((typeof url == "undefined") || (url == '') || (url == null)) {
        return url;
    }

    start_layer_session(url, _interstitial_abandon_warning, on_layer_close_handler, _layer_css.registration, _layer_mode.replaceLayer);
}

function start_layer_session(url, warning_url, on_layer_close_handler, layer_css, layer_mode) {
    //open url in a layer
    //warning_url can have defauts
    scrolltotop();
    if(layer_mode == _layer_mode.replaceLayer)
        parent.replaceLayer(url, warning_url, on_layer_close_handler, layer_css);
    else
        parent.openLayer(url, warning_url, on_layer_close_handler, layer_css);
}

/*
function close_layer_session(refresh) {
    //close the layer
    //call on_close_handler if it is set
    //if refresh is set, refresh current page
    window.opener.top.location.reload();self.close(); alert('bktest');
    if (this._on_layer_close_handler != null)
        this._on_layer_close_handler();

    if (refresh)
        parent.location.reload();
}
*/

function open_in_layer(url, warning_url, layer_css) {
    //close the current layer
    //open url in a new layer
    scrolltotop();
    if ((typeof url == "undefined") || (url == '') || (url == null)) {
        return url;
    }

    url = build_secure_pme_url(url);
    warning_url = build_warning_url(warning_url);
    parent.openLayer(url, warning_url, '', layer_css);
}

var childPage = false;

function closeDialogAndRefresh() {
    var httpBridge = get_bridge_or_warning_url(_http_bridge_url);
    var sep = get_separator(httpBridge);
    var url = httpBridge + sep + "action=close&refresh=true";
    window.location.href = url;
}
/*
// modified to handle login being opened when e-mail entered on the reg page already exists
function closeDialogAndRefresh() {
// is the dialog opened by the reg page?
if (parent.childPage == true) {
parent.closeChildWindow();
}
else {
var httpBridge = get_bridge_or_warning_url(_http_bridge_url);
var sep = get_separator(httpBridge);
var url = httpBridge + sep + "action=close&refresh=true";
window.location.href = url;
}
}
*/
// called from login control (https) so as to invoke a call on (http) to render interstitial in a layer
// TO DO : abandon warning?
function closeDialogOpenFrame(url) {
    var redirect = encodeURIComponent(url);
    var httpBridge = get_bridge_or_warning_url(_http_bridge_url);
    var sep = get_separator(httpBridge);
    var url = httpBridge + sep + 'action=replaceLayer&refresh=false&redirect=' + redirect;
    window.location.href = url;
}

// called from slogin.epx (https) to invoke a call on (http) to render registration in a layer
function on_create_sap_account() {
    scrolltotop();
    var redirect = encodeURIComponent(_registration_url);
    var httpBridge = get_bridge_or_warning_url(_http_bridge_url);
    var sep = get_separator(httpBridge);
    var url = httpBridge + sep + 'action=registrationLayer&refresh=false&redirect=' + redirect + '&dialog=' + _registration_dialog;
    window.location.href = url;
}

var close_legacy_window = false;
function closeWindowLayerAndGotoURL(url) {
    //if(-1 < this.location.href.toLowerCase().indexOf("yourinfo"))
/*    if (-1 < window.opener.location.href.toLowerCase().indexOf("yourinfo")) {
        var cookieName = "pmewtaupdate";
        var cookieValue = "save";
        
        setCookie(cookieName, cookieValue);
    }
    
    var newUrl = url;
    if (newUrl == null || newUrl == "")
       newUrl = window.opener.location.href;
*/

    try {
        if (parent.close_legacy_window == true) {
            if (-1 < parent.window.location.href.toLowerCase().indexOf("yourinfo")) {
                var cookieName = "pmewtaupdate";
                var cookieValue = "save";

                setCookie(cookieName, cookieValue);
            }

            var newUrl = url;
            if (newUrl == null || newUrl == "")
                newUrl = parent.window.location.href;

            parent.window.rm_fadeOutIframe_2("true", newUrl);
        } 
    }
    catch (e) { }

    var redirect = encodeURIComponent(url);
    var httpBridge = get_bridge_or_warning_url(_http_bridge_url);
    var sep = get_separator(httpBridge);
    var url = httpBridge + sep + 'action=redirect&redirect=' + redirect;
    window.location.href = url;
    /*  
    parent.window.rm_fadeOutIframe_2("true", newUrl);
    parent.window.rm_fadeOutIframe();
    if (url == null || url == "")
        parent.window.location.href = parent.window.location.reload(); //parent.window.location.href;
    else
        parent.window.location = url; //.href = url;*/
}

///////////////////////////
// functions for httpBridge
///////////////////////////

function getQueryParameters() {
    /////////////////////
    //action=close&redirect=/abc.epx&refresh=true
    /*source: "Kevin Boudloche's blog - tentonaxe.com" */
    var queryObj = {};
    var querystring = location.search.replace("?", "").split("&");
    for (var i = 0; i < querystring.length; i++) {
        var name = querystring[i].split("=")[0];
        var value = querystring[i].split("=")[1];
        queryObj[name] = value;
    }
    return queryObj;
}

function doBridgeAction() {
    if ((typeof executeDoAction != "undefined") && (executeDoAction == true)) {
        var queryObj = getQueryParameters();
	    if (typeof queryObj.action != "undefined") {
	        if (queryObj.action == 'close') {
	            if (typeof queryObj.refresh != "undefined") {
	                if (queryObj.refresh == 'true')
	                    window.top.reload_header();
	            }
	            window.top.setReturnValueAndClose(true);
	        }
	        else if (queryObj.action == 'redirect') {
	            if (typeof queryObj.redirect != "undefined") {
	                var redirectURL = decodeURIComponent(queryObj.redirect);
	                if (redirectURL != '') {
	                    if ((redirectURL.toUpperCase().indexOf("/HOST") > -1))
	                        redirectURL = get_home_page();
	                    else
	                        redirectURL = get_bridge_or_warning_url(redirectURL);

	                    parent.reload_header();
	                    parent.location.href = redirectURL;
	                    //close_and_relocate(decodeURIComponent(queryObj.redirect)). 
	                    return;
	                }
	            }

	            parent.reload_header();
	            parent.setReturnValueAndClose(true);
	        }
	        else if (queryObj.action == 'registrationLayer') {
	            var layer_url = '';
	            var layer_warning = '';
	            if (typeof queryObj.redirect != "undefined") {
	                layer_url = decodeURIComponent(queryObj.redirect);
	                if (typeof queryObj.dialog != "undefined") {
	                    layer_warning = decodeURIComponent(queryObj.dialog);
	                }
	                parent.replace_with_registration_session(layer_url, layer_warning, '');
	            }
	        }
	        else if (queryObj.action == 'replaceLayer') {
	            var layer_url = '';
	            var layer_warning = '';
	            if (typeof queryObj.redirect != "undefined") {
	                layer_url = decodeURIComponent(queryObj.redirect);
	                if (typeof queryObj.dialog != "undefined") {
	                    layer_warning = decodeURIComponent(queryObj.dialog);
	                }
	                parent.replace_with_new_session(layer_url, layer_warning, '');
	            }
	        }
	    }
	}
}
//scroll the window to top
function scrolltotop() {
    try {
        top.scrollTo(0, 0);
        return false;
    }
    catch (ex) { }
}

/////////////////////////////
// wcms logic
/////////////////////////////
    var wcms_on_layer_close_handler = null;

    function dumpResults(resultParams) {
        var s = "onclose:\n";
        for (var k in resultParams) {
            s += k + "=" + resultParams[k] + "\n";
        }
        //alert(s);

        console.log(s);
    }

    //alert(start_registration_session);

    function wcms_start_registration_session(url, on_layer_close_handler) {

        wcms_on_layer_close_handler = on_layer_close_handler;

        var wcms_frm = null;

        var is_login0 = false;

        var inputparams = { "CurrentURL": window.location.href };

        if (url.toUpperCase().indexOf("PROFILE/LOGIN0.EPX") >= 0) {
            is_login0 = true;
            wcms_frm = SAP.wcms.registrationWindow.type.BASIC;
        }
        else if ((url.toUpperCase().indexOf("PROFILE/LOGIN.EPX") >= 0) || (url.toUpperCase().indexOf("PROFILE/UPGRADE.EPX") >= 0)) {

            inputparams["requiredAction"] = "viewPremiumAsset";

            if (is_logged_in())
                wcms_frm = SAP.wcms.registrationWindow.type.UPGRADE;
            else
                wcms_frm = SAP.wcms.registrationWindow.type.PREMIUM;
        }
        else if (url.toUpperCase().indexOf("/NEWSLETTER/") >= 0) {
            wcms_frm = SAP.wcms.registrationWindow.type.NEWSLETTER;
        }

        var on_close_handler = function (resultParams) {
            dumpResults(resultParams);

            if (!resultParams["redirect"] && is_login0 && (resultParams["formSubmitted"] == "true" && resultParams["userWasLoggedIn"] == "true")) {
                resultParams["redirect"] = "/profile/resources.epx";
            }

            if (resultParams["redirect"] && resultParams["redirect"].length > 0) {
                wcms_on_layer_close_handler = function () {
                    if (is_login0 && on_layer_close_handler != null)
                        on_layer_close_handler();

                    if (resultParams["redirect"].toUpperCase().indexOf("PROFILE") == 0) {
                        resultParams["redirect"] = '/' + resultParams["redirect"];
                    }

                    // delay added so that save resources is given a chance to finish.
                    delay_call(function () {
                        window.location.href = decodeURIComponent(resultParams["redirect"]);
                    });
                }
            }

            if (!is_logged_in() && (resultParams["formSubmitted"] == "true" || resultParams["userWasLoggedIn"] == "true")) {
                //alert('starting auto login');
                verifyCpsLogin(true);  //from samlsessionscript.js
            }
            else {
                if (is_logged_in()) {
                    refresh_info(function () {
                        window.top.reload_header();
                        if (wcms_on_layer_close_handler != null) {
                            wcms_on_layer_close_handler();
                        }
                    });
                }
                else if (wcms_on_layer_close_handler != null) {
                    wcms_on_layer_close_handler();
                }
            }
        };

        if (wcms_frm != null) {
            //alert('opening...:' + SAP.wcms.registrationWindow.show);
            SAP.wcms.registrationWindow.show(wcms_frm, on_close_handler, null, inputparams);
        }
        else {
            nx_start_registration_session(url, on_layer_close_handler);
        }

    };


    function wcms_start_contact_session(on_layer_close_handler) {

        if (on_layer_close_handler && (typeof on_layer_close_handler === 'function')) {
            wcms_on_layer_close_handler = on_layer_close_handler;
        }
        
        var on_close_handler = function (resultParams) {

            //dumpResults(resultParams);

            var redirectURL = "/profile/yoursapcom/recommendation/yourrecommended";
            // redirect to the url passed as parameter
            if (on_layer_close_handler && (typeof on_layer_close_handler === 'string'))
                redirectURL = on_layer_close_handler;
                
            var defaulturl = true;

            if (resultParams["redirect"] && resultParams["redirect"].length > 0) {
                redirectURL = decodeURIComponent(resultParams["redirect"]);
                defaulturl = false;
            }

            wcms_on_layer_close_handler = function () {
                if (redirectURL.toUpperCase().indexOf("profile".toUpperCase()) == 0) {
                    redirectURL = '/' + decodeURIComponent(resultParams["redirect"]);
                }

                if (!is_logged_in() && redirectURL &&
                ((redirectURL.toUpperCase().indexOf("profile/yourinfo.epx".toUpperCase()) > 0) ||
                (redirectURL.toUpperCase().indexOf("profile/subscriptions.epx".toUpperCase()) > 0) ||
                (redirectURL.toUpperCase().indexOf("profile/resources.epx".toUpperCase()) > 0))) {
                    redirectURL = "/profile/yoursapcom/recommendation/yourrecommended";
                }

                var continues = true;
                if (on_layer_close_handler && (typeof on_layer_close_handler === 'function')) {
                    continues = on_layer_close_handler();
                }

                if (defaulturl && (continues === false)) { }
                else
                    window.location.href = redirectURL;
            }

            if (!is_logged_in() && resultParams["userWasLoggedIn"] == "true") {
                verifyCpsLogin(true);  //from samlsessionscript.js
            }
            else {
                if (is_logged_in())
                    window.top.reload_header();

                if (wcms_on_layer_close_handler != null) {
                    wcms_on_layer_close_handler();
                }
            }
        };

        SAP.wcms.registrationWindow.show(SAP.wcms.registrationWindow.type.CONTACT_US, on_close_handler, null, { "CurrentURL": window.location.href });

    };

    function wcms_start_login_session(url) {

        var autologin;
        autologin = tryAutoLogin("idmautologin");
        if (autologin == true) {
            wcms_on_layer_close_handler = _start_login_session_success_handler;
            // Save off the URL in a cookie in case autologin doesn't succeed; we need to restart this function.
            if (!(typeof url == "undefined") || (url == '') || (url == null)) {
                set_saml_session_cookie("LOGIN_URL", url, 1);
            }
            createIframe();
            trycpsLogin();
        }
        else if (url.toUpperCase().indexOf("profile/slogin.epx".toUpperCase()) >= 0) {

            wcms_on_layer_close_handler = _start_login_session_success_handler;

            var on_close_handler = function (resultParams) {

                dumpResults(resultParams);

                if (resultParams["redirect"] && resultParams["redirect"].length > 0) {
                    wcms_on_layer_close_handler = function () {
                        window.location.href = decodeURIComponent(resultParams["redirect"]);
                    }
                }

                if (!is_logged_in() && (resultParams["formSubmitted"] == "true" || resultParams["userWasLoggedIn"] == "true")) {
                    //alert('starting auto login');
                    verifyCpsLogin(true);  //from samlsessionscript.js
                }
                else {
                    if (wcms_on_layer_close_handler != null) {
                        wcms_on_layer_close_handler();
                    }
                }
            };

            SAP.wcms.registrationWindow.show(SAP.wcms.registrationWindow.type.LOGIN, on_close_handler, null, { "CurrentURL": window.location.href });

        }
        else {
            nx_start_login_session(url);
        }
    };
    
    function refresh_info(handler) {
        if ((typeof PAGESOURCE != "undefined") && (PAGESOURCE == "Nurture"))
            refreshNurtureUser();

        $.post(
            site_service_url,
            "refreshinfo=1",
            function () {
                if (handler != null)
                    handler();
            },
            function (e) {
            }
        );
    }

    function delay_call(func) {
        setTimeout(func, 200);
    }

    function redirect_to_destination(url) {
        if (!is_logged_in() && userLoggedInWCMS()) {
            wcms_on_layer_close_handler = function () {
                delay_call(function () {
                    // validate login status once again before redirecting
                    window.location.href = get_host(url) + get_redirect_path(url);
                });
            }

            if (!is_logged_in())
                verifyCpsLogin(true);
        }
        else {
            // validate login status before redirecting
            window.location.href = get_host() + get_redirect_path(url);
        }
    }

    function get_redirect_path(url) {
        var redirectpath = '';

        if (url && url.length > 0)
            redirectpath = decodeURIComponent(url);

        // if not logged in redirect to Content Highlights page
        if (!is_logged_in() && redirectpath &&
                ((redirectpath.toUpperCase().indexOf("profile/yourinfo.epx".toUpperCase()) > 0) ||
                (redirectpath.toUpperCase().indexOf("profile/subscriptions.epx".toUpperCase()) > 0) ||
                (redirectpath.toUpperCase().indexOf("profile/resources.epx".toUpperCase()) > 0))) {
            redirectpath = "/profile/yoursapcom/recommendation/yourrecommended";
        }

        //this method will prepend country to the path if this is a subsidiary site
        return get_path(redirectpath);
    }

    function get_host() {
        var host = HOST_NAME;

        try {
            var url = window.location.href;
            if (url.toUpperCase().indexOf('HTTPS') > -1)
                host = SECURE_HOST_NAME; //if can access the top, means reg and top are in same domain
        }
        catch (ex) {
            host = HOST_NAME;   //if cannot access the top, means reg and top are in different domain
        }

        return host;
    }


// end wcms logic
/////////////////////////////////// 