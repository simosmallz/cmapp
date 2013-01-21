/*
common.js

Version: 09.28.12

Edited:

03.14.12 - added c_select_bypass for the country selector for C.Siwinski stuff
04.27.12 - added .promo-module to initPromoRotate for the new BUYNOW template.
09.12.12 - added .promoL for the left promos
09.28.12 - added call to bump vs. country-selector.epx
10.09.12 - *VL* added .promoRotate for Sublevel Feature Hero promo-rotate
		 - *VL* added .promoRotatePhoto for Sublevel Feature Hero Photo promo-photo-rotate

*/


/* ==== GLOBAL VARS ==== */
var currhref = location.href;
var currpath = location.pathname;
var hasquery = currhref.indexOf('?');

var FORM_COMPLETED_COOKIE_NAME = "FormCompleted";

// prevent caching
$.ajaxSetup({ cache: false });

// cookie
function get_cookie(name) {
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var nvp = cookies[i].split("=");
        if (name == nvp[0])
            return nvp[1];
    }

    return null;
}

function getCookie(c_name) { //additional cookie getter (this one won't strip out "=" if it exists in the value of the cookie itself)
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function set_cookie(name, value, expdays) {
    var domain = "";

    if (typeof CookieDomain != "undefined")
        domain = CookieDomain;

    if (domain == "" && location.hostname.indexOf("sap.com") > -1)
        domain = "";

    var cv = name + "=" + value + "; path=/";

    if (domain != "")
        cv += "; domain=" + domain;

    var expdate = new Date();
    expdate.setDate(expdate.getDate() + expdays);
    cv += ((expdays == null) ? "" : "; expires=" + expdate.toUTCString());

    document.cookie = cv;
}

function get_subCookie(Cookie, subCookie) {
    try {
        var siteCookie, pName, pValue;
        siteCookie = getCookie(Cookie);
        if (siteCookie != null) {
            var oCookie = siteCookie.split("&");
            for (iCookie = 0; iCookie < oCookie.length; iCookie++) {
                pName = oCookie[iCookie].substr(0, oCookie[iCookie].indexOf("="));
                pValue = oCookie[iCookie].substr(oCookie[iCookie].indexOf("=") + 1);
                if (pName == subCookie) {
                    return pValue;
                }
            }
        }
        return "";
    }
    catch (e) {
        return "";
    }
}


function deleteCookie(name) { set_cookie(name, '', -1); }


var COUNTRY_SELECTOR_COOKIE_NAME = "SelectedCountryUrl";
var ENTRY_URL_COOKIE_NAME = "EntryUrl";
var COUNTRY_REDIRECT_FLAG = "CountryRedirectFlag";
var HB_REFERRER_COOKIE_NAME = "HBReferrerUrl";

function get_current_country() { return get_cookie(COUNTRY_SELECTOR_COOKIE_NAME); }
function set_current_country(country) { set_cookie(COUNTRY_SELECTOR_COOKIE_NAME, country, 365); }
function get_entry_url() { return getCookie(ENTRY_URL_COOKIE_NAME); }
function set_entry_url(url) { set_cookie(ENTRY_URL_COOKIE_NAME, url, null); }

function have_country_redirect_flag() {
    var v = get_cookie(COUNTRY_REDIRECT_FLAG);
    return v && v.length > 0;
}

function set_country_redirect_flag() {
    set_cookie(COUNTRY_REDIRECT_FLAG, "1");
}

/* ---- check if the registration form was submitted successfully  ----  */
function checkRegCompletion(flag) {
    var completed = false;
    var cookie = get_cookie(FORM_COMPLETED_COOKIE_NAME);
    if (cookie != null && cookie == 1) {
        completed = true;
        if (flag)
            deleteCookie(FORM_COMPLETED_COOKIE_NAME);
    }
    return completed;
}


/* ==== Cookie Check ==== */
if (location.pathname.split('/')[1].toUpperCase() == 'INDEX.EPX') { //if we are on the global homepage

	var cBypass = currhref.indexOf('c_select_bypass=true');
	if (cBypass > 0) {
		// we're bypassing the country selector - do nothing here...
			
	} else {

		if (!have_country_redirect_flag()) {
			var cs_cookie = get_current_country();
			if (!cs_cookie) {
				//location.href = '/country-selector.epx'; //redirect to country selector page
				var bumpTime=setTimeout("doBump()",1000);
			}
			else if (cs_cookie != currpath) {
				set_country_redirect_flag();
				location.href = cs_cookie;
			}
		}
		
	}
	
}
else if (!have_country_redirect_flag())
    set_country_redirect_flag(); // value not used?



//----------check permission -------------------

function is_logged_in() {

    var v = get_cookie("SSO");

    return (v != null) && (v.length > 0);
}

var site_service_url = "siteservice.epx?kNtBzmUK9zU=1&BHEQK=1";

//***** CDRP Logic
var cdrphref;
function auth_link(targ, flagcdrp) {
    cdrphref = $(targ).attr('href');
    if (flagcdrp)
        check_cdrpv2_permission(cdrphref, cdrp_okhandler, cdrpv2_not_okhandler);
    else 
        check_cdrp_permission(cdrphref, cdrp_okhandler, cdrp_not_okhandler);
}

$(document).ready(function (event) {
    $("a.cdrp").unbind("click");
    $("a.cdrp").bind("click", function (e) {
        auth_link(this, false);
        return false;
    });
});
$(document).ready(function (event) {
    $("a.cdrpv2").unbind("click");
    $("a.cdrpv2").bind("click", function (e) {
        auth_link(this, true);
        return false;
    });
});

var last_window; // block double open

var cdrp_okhandler = function (asseturl) {
    // hack to prevent double popup issue
    var curTime = new Date();
    curTime = curTime / 2000;
    testurl = asseturl + curTime;
    if (last_window != testurl)
    {
        last_window = testurl;
        window.open(asseturl);
    }
}

var cdrpv2_not_okhandler = function (regurl) {
    var handler = function () {
        if (is_logged_in()) {
            check_cdrpv2_permission(cdrphref, cdrp_okhandler, null);
            reload_header();
            return false;
        }
    }
    start_registration_session(regurl, handler);
}
var cdrp_not_okhandler = function (regurl) {
    var handler = function () {
        if (is_logged_in()) {
            check_cdrp_permission(cdrphref, cdrp_okhandler, null);
            reload_header();
            return false;
        }
    }
    if (typeof __cdrp_regurl != "undefined") {
        if (__cdrp_regurl.length > 0) {
            regurl = __cdrp_regurl;
        }
    }
    start_registration_session(regurl, handler);
}

function check_cdrpv2_permission(payload, ok_handler, not_ok_handler) {
    $.post(
            site_service_url,
            "cdrpv2:" + payload,
            function (data) {
                check_cdrp_permission_callback(data, ok_handler, not_ok_handler);
            },
            function (e) {
                alert(e);
            }
        );
}
function check_cdrp_permission(payload, ok_handler, not_ok_handler) {
    $.post(
            site_service_url,
            "cdrp:" + payload,
            function (data) {
                check_cdrp_permission_callback(data, ok_handler, not_ok_handler);
            },
            function (e) {
                alert(e);
            }
        );
}

function check_cdrp_permission_callback(data, ok_handler, not_ok_handler) {

    var index = data.indexOf(';');

    if (index <= 0) {
        alert("failed:" + data);
        return;
    }

    var status = data.substring(0, index);
    var url = data.substring(index + 1);

    if (status == "1" && ok_handler)
        ok_handler(url);
    else if (status == "0" && not_ok_handler)
        not_ok_handler(url);

}
//******End CDRP Logic

function get_suggestions(payload, ok_handler) {
    $.post(
            site_service_url,
            "suggest:" + payload,
            function (data) {
                if (ok_handler) ok_handler(data);
            },
            function (e) {
                alert(e);
            }
        );
}

function check_permission(payload, ok_handler, not_ok_handler) {
    $.post(
            site_service_url,
            "checkpermission:" + payload,
            function (data) {
                check_permission_callback(data, ok_handler, not_ok_handler);
            },
            function (e) {
                alert(e);
            }
        );
}

function submit_save(payload, ok_handler) {
    $.post(
            site_service_url,
            "save:" + payload,
            function (data) {
                if (ok_handler) ok_handler(data);
            },
            function (e) {
                alert(e);
            }
        );
}

function get_country_by_region(payload, ok_handler) {
    $.post(
            site_service_url,
            "regioncountry:" + payload,
            function (data) {
                if (ok_handler) ok_handler(data);
            },
            function (e) {
                alert(e);
            }
        );
}

function get_states_by_country(payload, ok_handler) {
    $.post(
        site_service_url,
        "countrystate:" + payload,
        function (data) {
            if (ok_handler) ok_handler(data);
        },
        function (e) {
            alert(e);
        }
    );
}

function check_permission_callback(data, ok_handler, not_ok_handler) {

    var index = data.indexOf(';');

    if (index <= 0) {
        alert("failed:" + data);
        return;
    }

    var status = data.substring(0, index);
    var url = data.substring(index + 1);

    if (status == "1" && ok_handler)
        ok_handler(url);
    else if (not_ok_handler)
        not_ok_handler(url);

}

function check_have_premium(ok_handler, not_ok_handler) {
    check_permission("havepremium", ok_handler, not_ok_handler);
}

function run_url(url, handler) {
    $.get(url,
           function (data) { if (handler) handler(data); },
           function (e) { }
          );
}

function npc_log_out() {
    $.post(
            site_service_url,
            "logout:1",
            function (data) {
                do_logout(); // top.location.reload();
            },
            function (e) {
            }
        );
}

var FIELD_DELIMITER = "[]";

var save_check_permission_payload = "action=save";

function do_logout() {
    // do Nurture logout
    do_NurtureLogout(false);
    //need check if the page is in /profile/ folder, it yes, need go to home page
    var url = top.window.location.href;

    if (url.toUpperCase().indexOf("/YOURSAPCOM/") > 0)
        top.window.location.reload();
    else if (url.toUpperCase().indexOf("/PROFILE/") < 0)
        top.window.location.reload();
    else {

        var hostname = "";

        if (typeof HOST_NAME != "undefined")
            hostname = HOST_NAME;

        top.window.location.href = hostname + "/index.epx";

    }
}

// do Nurture logout
function do_NurtureLogout(isReferesh) {
    deleteCookie("Nurture");
    try {
        $.ajax({
            type: "POST",
            url: "/nurturejson/utility/nurturelogout?kNtBzmUK9zU=1",
            contentType: "application/json; charset=utf-8",
            error: function (xhr, status, error) {

            },
            success: function (data) {
                if (data != null) {
                    if (isReferesh)
                        location.href = location.pathname;
                }
                else {
                    // Do nothing  
                }
            }
        });
    }
    catch (e) { }
}

/*

Search Pages:

Type: SearchTerms
Name: newid() or null (not used)
Description: key words
SubType: SearchTerms
Value: complete URL (e.g: http://localhost:2011/search/search-results.epx?querytext=byd)

Resources:

Name: Resources
Name: Title of the asset/page
Description: Any description
SubType: Videos/Documents/Pages
Value: Complete Url (e.g: http://usphldvm3.phl.sap.corp:2011/asset/index.epx?id=2d4bf146-4f71-46c2-9a4d-670dbbb2e455&name=Build-and-Manage-Strong-Customer-Relationships)


*/

var default_save_link_type = "Resources";

function pack_saved_data(type, name, value, desc, subType) {
    var data = [1, type, encodeURIComponent(name), encodeURIComponent(value), encodeURIComponent(desc), subType];
    //var data = [1, type, encodeURIComponent(escape(name)), encodeURIComponent(escape(value)), encodeURIComponent(escape(desc)), subType];
    return data.join(FIELD_DELIMITER);
}


function save_resource(type, name, value, desc, subType, ok_handler) {

    if (!desc)
        desc = name;

    var payload = pack_saved_data(type, name, value, desc, subType);
    submit_save(payload, ok_handler);

    // Tracking Code added by Chandu to track all save click
//    if (type == "SearchTerms")
//        TrackLink("", "Save Search", desc);
//    else
//        TrackLink(value, "Save:" + type, "");
    
    // Commented below to fix JIRA#SAPCOM-591
    //if (type != "SearchTerms")
    //    TrackLink(value, "Save:" + type, "");
}

function checked_save_resource(type, name, value, desc, subType, not_ok_handler) {

    var payload = pack_saved_data(type, name, value, desc, subType);

    check_permission(save_check_permission_payload,
        function () { submit_save(payload); },
        not_ok_handler);
    // Commented below to fix JIRA#SAPCOM-591
    // TrackLink(value, "Save:" + type, "");
}

function save_search(search_term_url, search_query_term, ok_handler) {
    save_resource("SearchTerms", "", search_term_url, search_query_term, "SearchTerms", ok_handler);
    // Tracking Code added by Chandu to track the saved Searches
    //TrackLink("", "Save Search", search_query_term);
}

function save_link(resource, onsave) {

    //var type = "Links";

    //if (url.toUpperCase().indexOf("/ASSET/") > 0)
    //type = "Resources";
    //alert(resource);
    if (is_logged_in()) {
        save_resource(resource.type, resource.title, resource.url, resource.description, resource.subtype, onsave);
    }
    else
        checked_save_resource(resource.type, resource.title, resource.url, resource.description, resource.subtype,
        function (login_url) {
            var handler = function () {
                //alert("in handler");
                if (is_logged_in()) {
                    save_resource(resource.type, resource.title, resource.url, resource.description, resource.subtype, onsave);
                }
            };

            //call your method here with login_url (or hard-coded it to be “profile/login.epx”) and handler
            start_registration_session(login_url, handler);
        });
}

function save_bydresource(Assets, ok_handler) {
    var data = [Assets.length];
    for (var i = 0; i < Assets.length; i++) {
        data.push("Resources");
        data.push(Assets[i].Title);
        data.push(Assets[i].Url);
        data.push(Assets[i].Title);
        data.push(Assets[i].Type);
    }

    var packed_data = data.join(FIELD_DELIMITER);

    check_permission(save_check_permission_payload,
        function () { submit_save(packed_data, ok_handler); },
    //function () { alert("I am supposed to display a registration form in a layer here:"); }
        function (login_url) {
            var handler = function () {
                //alert("in handler");
                if (is_logged_in()) {
                    submit_save(packed_data, ok_handler);
                }
            };
            start_registration_session(login_url, handler);
        }
    );
}

//save button handler

//$(document).ready(function () {
    $("li.save a").live("click", function () {

        var link = $(this);

        var title = link.attr("save-title");

        if (!title)
            title = document.title;

        var url = link.attr("href");

        if (!url || url == "")
            url = window.location.href;

        var resourceType = link.attr("resource-type") || default_save_link_type;
        var resourceSubtype = link.attr("resource-subtype") || "Pages";
        var description = link.attr("description") || "";

        var resource = { title: title, url: url, type: resourceType, subtype: resourceSubtype, description: description };

        save_link(resource, function () { link.parent().attr("class", "saved"); });

        return false;
    });

    $("li.saved a").live("click", function () {
        return false;
    });

//});


//legacy save

//$(document).ready(function () {

    $("#legacysavelink").live("click", function () {

        var title = document.title;

        var url = window.location.href;

        save_link({ title: title, url: url, type: default_save_link_type, subtype: "Pages", description: "" }, function () { $("#legacysaved").show(); $("#legacysave").hide(); });

        return false;
    });
//});

//login/logout

//$(document).ready(function () { -- removed...can be loaded before document.ready and was causing problems...
    //if ($(".logout").length) {

    // $(".login").hide();
    $("#utilitynav-myprofile-logout").live("click", function () {
        //log_out();
        saml_logout();
        //            $(".login").show();
        //            $(".logout").hide();
        //window.location.href = window.location.href;

        return false;
    });
    // }
    // Commented out due to issue with logout and also change to jqury - PRM - 07/15/2011
    //if ($(".btn-cta-sm").length) {    
    //$(".login").hide();
    //$("#btn-logout").click(function () {
    $("#btn-logout").live("click", function () {
        //log_out();
        saml_logout();
        return false;
    });
    //}
//});

//$(document).ready(function () {

    $("#utilitynav-myprofile-firstname").live("click", function () {

        if ($("#utilitynav-myprofile-menu").is(':visible'))
            $("#utilitynav-myprofile-menu").hide();
        else
            $("#utilitynav-myprofile-menu").show();

        return false;
    });

//});

//----Events----------
//Functions to populate Country/State dropdowns in Events
function PopulateCountry(RegionID) {
    var ddlCountry = document.getElementById("selectcountry");
    ResetCountryState(ddlCountry);
    var ddlState = document.getElementById("selectstate");
    ResetCountryState(ddlState);

    if (RegionID.length > 0) {
        get_country_by_region(RegionID, countryhandler);
        document.getElementById('hddefaultflag').value = '';
    }
    else {
        document.getElementById('hddefaultflag').value = 'true';
    }

}

var countryhandler = function (args) {
    var ddlCountry = document.getElementById("selectcountry");
    if (args.length > 0) {
        var CountryList = args.split("|");
        ResetCountryState(ddlCountry);
        ddlCountry.disabled = false;
        for (i = 0; i < CountryList.length; i++) {
            var Country = CountryList[i].split("=");

            var optionCountry = document.createElement("option");
            optionCountry.text = Country[1];
            optionCountry.value = Country[0];
            ddlCountry.options.add(optionCountry);
        }
    }
}

function PopulateState(CountryID) {
    var ddlState = document.getElementById("selectstate");
    ResetCountryState(ddlState);
    if (CountryID.length > 0) {
        get_states_by_country(CountryID, statehandler);
    }
}

var statehandler = function (args) {

    var ddlState = document.getElementById("selectstate");
    if (args.length > 0) {
        var StateList = args.split("|");
        ResetCountryState(ddlState);
        ddlState.disabled = false;
        for (i = 0; i < StateList.length; i++) {
            var State = StateList[i].split("=");

            var optionState = document.createElement("option");
            optionState.text = State[1];
            optionState.value = State[0];
            ddlState.options.add(optionState);
        }
    }
}

function ResetCountryState(ddl) {
    if (ddl.length > 0)
    {
        var i;
        for (i = ddl.options.length - 1; i > 0; i--) {
            ddl.remove(i);
        }
    }
    ddl.disabled = true;
}

//Functions to get scoring cookie

$(document).ready(function () {
    if (typeof need_call_cookie_service != "undefined" && need_call_cookie_service) {
        setTimeout(function () { call_cookie_service(scoring_url); }, 1000);
    }

});



function call_cookie_service(payload) {
    $.post(
            "/gwtservices/" + site_service_url,
            "SCORINGENGINE-GET-COOKIE:" + payload,
            function (data) {
                set_scoring_cookie(data);
            },
            function (e) {
                alert(e);
            });

}

function set_scoring_cookie(data) {
    set_cookie(scoring_cookie_name, data, 365);
}

//End functions to get scoring cookie


// Functions to get scoring cookie HTML

function call_cookie_html_service(payload) {
    $.post(
		"/gwtservices/" + site_service_url,
		"SCORINGENGINE-GETHTML:" + payload,
		function (data) {
		    display_html_scoring(data);
		},
		function (e) {
		    alert(e);
		});

}

function display_html_scoring(data) {
    var seDiv = document.createElement('div');
    seDiv.id = "seDiv";
    seDiv.innerHTML = data;
    seDiv.className = 'floatStyle';
    document.body.appendChild(seDiv);
}

$(document).ready(function () {
    if (typeof need_call_cookie_html_service != "undefined" && need_call_cookie_html_service) {
        setTimeout(function () { call_cookie_html_service(scoring_cookie_name); }, 1000);
    }

});

//End Scoring Cookie HTML functions

//Premium Asset Registration
function DoRegistrationForPremiumAssets(url, success, fail, assetid) {
    // Commented below to fix JIRA#SAPCOM-568.
    // Making use of one common function for download process.
    GetDownload(url, success, fail, assetid);
//    check_permission(url,
//		    function (login_url) {
//		        window.open(url, 'resizable', 'scrollbars');
//		    },
//		    function (login_url) {
//		        set_cookie("SAP_DOWNLOAD_TRACKING", assetid, 365);
//		        var handler = function () {
//		            //alert("In handler");
//		            if (is_logged_in()) {
//		                check_permission(url,
//					            function (download_url) {
//					                deleteCookie("SAP_DOWNLOAD_TRACKING");
//					                window.open(download_url, 'resizable', 'scrollbars');
//					            },
//					            function () {
//					                //user doesn't have permissions, do nothing
//					            }
//                        );
//		            }
//		        };
//		        start_registration_session(login_url, handler);
//		    }
//	    );
}

//End Premium Asset Registration


//Reload header:

function reload_header() {

    var clicktochat=null;
    var callmenow=null;

    if ($("#lpChatButtonDiv1")) {
        clicktochat = $("#lpChatButtonDiv1").html();
    }
    if ($("#lpVoiceButtonDiv1")) {
        callmenow = $("#lpVoiceButtonDiv1").html();
    }

    $.get(top.window.location.href, function (res) { 
    
    	  change_header(res); 
    	  
    	  if (clicktochat != null)
    	  	UpdateLP('#lpChatButtonDiv1',clicktochat);
    	  
    	  if(callmenow != null)
    	  	UpdateLP('#lpVoiceButtonDiv1',callmenow);
        	
    	}, function (e) { });
    
}

function UpdateLP(object, strHtml) {
    if ($(object)) {
        $(object).html(strHtml);
    }
}

var header_start_marker = "<!--begin header content-->";
var header_end_marker = "<!--end header content-->";

function change_header(res) {
    var startIndex = res.indexOf(header_start_marker);
    var endIndex = res.indexOf(header_end_marker);
    if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex + header_start_marker.length) {
        $("#headercontent").replaceWith(res.substring(startIndex + header_start_marker.length, endIndex));
    }
    //added by Chandu,
    //call back to Logout DropDown initialilzer
    if ((is_logged_in()) && (typeof lDropDown.initalize() != "undefined")) {
        lDropDown.initalize();
    }
}

var header_start_marker_phone = "<!--begin phone content-->";
var header_end_marker_phone = "<!--end phone content-->";

function change_phone(res) {
    var startIndex = res.indexOf(header_start_marker_phone);
    var endIndex = res.indexOf(header_end_marker_phone);
    if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex + header_start_marker_phone.length) {
        $("#phone").replaceWith(res.substring(startIndex + header_start_marker_phone.length, endIndex));
    }
}

var header_start_marker_liveperson_script = "<!--begin liveperson content script-->";
var header_end_marker_liveperson_script = "<!--end liveperson content script-->";

function change_liveperson(res) {
    var startIndex = res.indexOf(header_start_marker_liveperson_script);
    var endIndex = res.indexOf(header_end_marker_liveperson_script);
    if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex + header_start_marker_liveperson_script.length) {
        $("#livepersonscript").replaceWith(res.substring(startIndex + header_start_marker_liveperson_script.length, endIndex));
    }

    //set liveperson buttons
    $(document).ready(function () {

        if (typeof allowclicktochat != "undefined" && allowclicktochat != null) {
            if (allowclicktochat == "false")
                $('#lpChatButtonDiv1').hide();
            else
                $('#lpChatButtonDiv1').show();
        }

        if (typeof allowclicktocall != "undefined" && allowclicktocall != null) {
            if (allowclicktocall == "false")
                $('#lpVoiceButtonDiv1').hide();
            else
                $('#lpVoiceButtonDiv1').show()
        }

    });
}

//////////////////////////
//the following two functions are getting called from the winbacks and abandon warnings
function _s_action(actionnumber) {
    try {
        ACTION = actionnumber;
        var tracking_obj = parent.window.createITT();
        tracking_obj.ACTION = actionnumber;
        tracking_obj.submit_action();
    }
    catch (e) { }

}

var initial_login_status = null;

$(document).ready(function () {
    //invoke the following function only on pages that have do-black_out variable set like the abandon warnings
    if (typeof do_black_out != "undefined")
        $('#dialog-blackout').css({ opacity: 0.6 });

    try {
        if (typeof (parent.initial_login_status) == "undefined")
            parent.initial_login_status = is_logged_in();
    }
    catch (err) { }
});

function on_abandon_warning_close(returnValue) {
    if ((parent.initial_login_status != null) && (is_logged_in() != parent.initial_login_status)) {
        parent.reload_header();
    }

    parent.setReturnValueAndClose(returnValue);
}
///////////////////////////
function BuyNowClick() {
    var t = window.setInterval(SetLivePerson, 1000);
	return true;
}
function SetLivePerson() {
                if (typeof (lpMTagConfig.pluginCode) != "undefined") {
                var button1 = document.getElementById("livePersonVoice");
                var button2 = document.getElementById("livePersonChat");
				if(button1)
                button1.id = "lpVoiceButtonDivDynamic2";
                if(button2)
				button2.id = "lpChatButtonDivDynamic2";

                lpMTagConfig.pluginCode.deployDynButton.deployDynamicButton('lpVoiceButtonDivDynamic2');
                lpMTagConfig.pluginCode.deployDynButton.deployDynamicButton('lpChatButtonDivDynamic2');
                //clearTimeout(t);
                }
}



//Customer Testimonial Grid
var filter_list_items = [];
function FilterOneOnChange(ddlFilter1, ddlTempFilter, ddlFilter2) {

    if (filter_list_items == null || filter_list_items.length == 0) {
        $("#" + ddlTempFilter + " option").each(function (i) {
            filter_list_items[i] = $(this).text() + ":" + $(this).val();
        });
    }

    if (filter_list_items != null && filter_list_items.length > 0) {
        $("#" + ddlFilter2).html("");
        var selRegion = $("#" + ddlFilter1).val().split("|")[0];

        $.each(filter_list_items, function (key, value) {
            var result = value.split(":");
            var temp1 = result[1].split("|");
            if (selRegion != 'ALL') {
                if (temp1[0] == selRegion || result[1] == 'ALL') {
                    $("#" + ddlFilter2).append("<option value='" + result[1] + "'>" + result[0] + "</option>");
                }
            }
            else {
                $("#" + ddlFilter2).append("<option value='" + result[1] + "'>" + result[0] + "</option>");
            }
        });

    }
}

//Asset Download

$("a").live('click', function () {
    var url = $(this).attr('href');
    var isNurturePage = false;
    if ((typeof PAGESOURCE != "undefined")) {
        if (PAGESOURCE.length > 0)
            isNurturePage = true;
    }
    if (url && (url.toUpperCase().indexOf('DOWNLOAD.EPD') > 0) && (!isNurturePage)) {
        if (url.toUpperCase().indexOf('URL_ID') > 0) {
            //            GetDownloadWithTrackID(url, '', '', '');
            //        } else {
            //            GetDownload(url, '', '', '');
            //        }

            //If campaign code exists, create a tracking call.
            var qsVal = "";
            qsVal = getQueryVariable('URL_ID', url);
            if (qsVal != null)
                qsVal = 'url_id=' + qsVal;
            TrackEventInteraction(url, 'intcmp', qsVal, '', '');
            url = url.substring(0, url.lastIndexOf('&'));
        }
        GetDownload(url, '', '', '');
        return false;
    }
});

function GetDownload(url, success, fail, assetid) {
    check_permission(url,
		    function (download_url) {
		        window.location = download_url;
		    },
		    function (login_url) {
		        if (assetid.length > 0) {
		            set_cookie("SAP_DOWNLOAD_TRACKING", assetid, 365);
		        }
		        var handler = function () {
		            if (is_logged_in()) {
		                check_permission(url,
					            function (download_url) {
					                deleteCookie("SAP_DOWNLOAD_TRACKING");
					                window.location = download_url;
					            },
					            function () {
					                //user doesn't have permissions, do nothing
					            }
                        );
		            }
		        };
		        start_registration_session(login_url, handler);
		    }
	    );
}


function GetDownloadWithTrackID(url, success, fail, assetid) {
    var service_url = getServiceUrl(url);
    url = url.substring(0, url.lastIndexOf('&'));
    check_download_permission(url,
		    function (download_url) {
		        window.location = download_url;
		    },
		    function (login_url) {
		        if (assetid.length > 0) {
		            set_cookie("SAP_DOWNLOAD_TRACKING", assetid, 365);
		        }
		        var handler = function () {
		            if (is_logged_in()) {
		                check_permission(url,
					            function (download_url) {
					                deleteCookie("SAP_DOWNLOAD_TRACKING");
					                window.location = download_url;
					            },
					            function () {
					                //user doesn't have permissions, do nothing
					            }
                        );
		            }
		        };
		        start_registration_session(login_url, handler);
		    },
            service_url //Passing the Service URL to track the "url_id" code.
	    );
}

function getServiceUrl(url) {
    var service_url;
    var qsVal = getQueryVariable('URL_ID', url);
    if (qsVal != null)
        service_url = site_service_url + '&URL_ID=' + qsVal;
    return service_url;
}

//Query String
function getQueryVariable(variable, url) {
    var query;
    if (url != null) {
        query = url.substring(1).toUpperCase();
    } else {
        query = window.location.search.substring(1).toUpperCase();
    }

    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable.toUpperCase()) {
            return pair[1].toLowerCase();
        }
    }
    return null;
}

function check_download_permission(payload, ok_handler, not_ok_handler, service_url) {
    $.post(
        service_url,
        "checkpermission:" + payload,
        function (data) {
            check_permission_callback(data, ok_handler, not_ok_handler);
        },
        function (e) {
            alert(e);
        }
    );
}

/*=== SEARCH FILTERS ===*/
function updateFilter(url_ref, elemID) {
    location.href = url_ref;
//    if ($('body#secondary').length > 0)
//        location.href = url_ref;
//    else {
//        location.hash = url_ref;
//        $('#' + elemID).css('opacity', '0.3');
//        $.get(url_ref, function (data) {
//            getFilterHTML = $(data).find('#' + elemID).html();
//            $('#' + elemID).css('opacity', '1');
//            $('#' + elemID).html(getFilterHTML);
//        });
//    }
}

function clearSiteSearchFilters() { //used to uncheck all site-search filters
    $('.srch_filter').attr('checked', false);
}




/* ===== MY PROFILE MENU =============================================================================================== */
var myProfileMenu = '#utilitynav-myprofile-menu';
if ($(myProfileMenu).length > 0) { moveMyProfile(); }
function moveMyProfile() {
    myProfileMarkup = '<div style="" id="utilitynav-myprofile-menu" class="utility-dropdown">' + $(myProfileMenu).html() + '</div>';
    $(myProfileMenu).remove();
    $('#page-content').append(myProfileMarkup);
}



/* ===== PROMO ROTATION ================================================================================================ */

function initPromoRotate() {

    var promoA_length = $('#subrightcol-promo .promoA').length;
    var promoB_length = $('#htb-highlight-right .promoB').length;
	var promoB_length2 = $('#htb-highlight .promoB').length;
	var promoArea_length = $('.promo-module .promo-area').length;
	var promoLeft_length = $('#subleftcol .promo .promoL').length;
	var promoRotate_length = $('#hero-bulleted .content-right .quote-module .promo-rotate').length;
	var promoRotatePhoto_length = $('#hero-bulleted .content-right .promo-module .promo-photo-rotate').length;
    var promoType = '';
    var promoCount = 0;
    var promoOn = 0;
    var autoPromoRotate;

    if (promoA_length > 0) { promoCount = promoA_length; promoType = 'promoA'; }
    else if (promoB_length > 0) { promoCount = promoB_length; promoType = 'promoB' }
	else if (promoB_length2 > 0) { promoCount = promoB_length2; promoType = 'promoB2' }
	else if (promoArea_length > 0) { promoCount = promoArea_length; promoType = 'promoArea'; }
	else if (promoLeft_length > 0) { promoCount = promoLeft_length; promoType = 'promoLeft'; }
	else if (promoRotate_length > 0) { promoCount = promoRotate_length; promoType = 'promoRotate'; }
	else if (promoRotatePhoto_length > 0) { promoCount = promoRotatePhoto_length; promoType = 'promoRotatePhoto'; }

    //console.log('promoCount: '+promoCount);

    if (promoCount > 1) { //if more than one promo exists
        if (promoType == 'promoA') {
            $('#subrightcol-promo').append('<div id="promo-btns"></div>'); //add promo navigation button container
            $('#subrightcol-promo .promoA').each(function (index) { //iterate thru promos
                //$(this).addClass('promo' + (index));
                if ($(this).find('.cta-video').length > 0) { //if promo is a video
                    $('.cta-video', this).wrapInner('<span />'); //apply formatting needed for css rules
                }
                $('#promo-btns').append('<a href="" rel="' + (index) + '"></a>'); //append anchor to promo nav container with unique 'rel' attribute
                if (index == 0) { $('#promo-btns a:first').addClass('on'); } //add class="on" to first promo nav anchor
            });
        }
        if (promoType == 'promoB') {
            $('#htb-highlight-right').append('<div id="promo-btns"></div>'); //add promo navigation button container
            $('#htb-highlight-right .promoB').each(function (index) { //iterate thru promos
                //$(this).addClass('promo' + (index));
                /*
                if ($(this).find('.cta-video').length > 0) { //if promo is a video
                $('.cta-video', this).wrapInner('<span />'); //apply formatting needed for css rules
                }
                */
                $('#promo-btns').append('<a href="" rel="' + (index) + '"></a>'); //append anchor to promo nav container with unique 'rel' attribute
                if (index == 0) { $('#promo-btns a:first').addClass('on'); } //add class="on" to first promo nav anchor
            });
        }
		if (promoType == 'promoB2') {
            $('#htb-highlight').append('<div id="promo-btns"></div>'); //add promo navigation button container
            $('#htb-highlight .promoB').each(function (index) { //iterate thru promos
                //$(this).addClass('promo' + (index));
                /*
                if ($(this).find('.cta-video').length > 0) { //if promo is a video
                $('.cta-video', this).wrapInner('<span />'); //apply formatting needed for css rules
                }
                */
                $('#promo-btns').append('<a href="" rel="' + (index) + '"></a>'); //append anchor to promo nav container with unique 'rel' attribute
                if (index == 0) { $('#promo-btns a:first').addClass('on'); } //add class="on" to first promo nav anchor
            });
        }
		if (promoType == 'promoArea') {
            $('.promo-module').append('<div id="promo-btns"></div>'); //add promo navigation button container
            $('.promo-module .promo-area').each(function (index) { //iterate thru promos
                $('#promo-btns').append('<a href="" rel="' + (index) + '"></a>'); //append anchor to promo nav container with unique 'rel' attribute
                if (index == 0) { $('#promo-btns a:first').addClass('on'); } //add class="on" to first promo nav anchor
            });
        }
		if (promoType == 'promoLeft') {
            $('#subleftcol .promo').append('<div id="promo-btns"></div>'); //add promo navigation button container
            $('#subleftcol .promo .promoL').each(function (index) { //iterate thru promos
                $('#promo-btns').append('<a href="" rel="' + (index) + '"></a>'); //append anchor to promo nav container with unique 'rel' attribute
                if (index == 0) { $('#promo-btns a:first').addClass('on'); } //add class="on" to first promo nav anchor
            });
        }
		if (promoType == 'promoRotate') {
            $('#hero-bulleted .content-right .quote-module').append('<div id="promo-btns"></div>'); //add promo navigation button container
            $('#hero-bulleted .content-right .quote-module .promo-rotate').each(function (index) { //iterate thru promos
                $('#promo-btns').append('<a href="" rel="' + (index) + '"></a>'); //append anchor to promo nav container with unique 'rel' attribute
                if (index == 0) { $('#promo-btns a:first').addClass('on'); } //add class="on" to first promo nav anchor
            });
        }
		if (promoType == 'promoRotatePhoto') {
            $('#hero-bulleted .content-right .promo-module').append('<div id="promo-btns"></div>'); //add promo navigation button container
            $('#hero-bulleted .content-right .promo-module .promo-photo-rotate').each(function (index) { //iterate thru promos
                $('#promo-btns').append('<a href="" rel="' + (index) + '"></a>'); //append anchor to promo nav container with unique 'rel' attribute
                if (index == 0) { $('#promo-btns a:first').addClass('on'); } //add class="on" to first promo nav anchor
            });
        }
        rotatePromo();
    }

    function rotatePromo() { //start promo rotation timer
        autoPromoRotate = window.setInterval(function () { //set 10 second rotation interval
            promoOn++; //increment "promoOn" variable by 1
            if (promoOn == promoCount) { promoOn = 0; } //if we reach the last promo, reset the "promoOn" variable back to beginning
            $('#promo-btns a:eq(' + promoOn + ')').click(); //trigger click event
        }, 10000);
    }

    function clearPromoInterval() { //clear promo rotation timer
        if (autoPromoRotate != "undefined") { //if the promo rotation timer is defined
            window.clearInterval(autoPromoRotate); //remove the timer
        }
    }

    $('#promo-btns a').live('click', function () { //promo navigation click event listener
        clearPromoInterval(); //clear previously set timer
        rotatePromo(); //start new timer
        getRel = $(this).attr('rel'); //get the current "rel" attribute
        promoOn = getRel; //update the "promoOn" variable
        if (!$(this).hasClass('on')) { //if clicked element does not have a class attribute of "on"
            getRel = parseInt(getRel); //get the value of the "rel" attribute and convert it to an integer
            $('#promo-btns a.on').removeClass('on'); //clear any promo nav items that currently have a class attribute of "on"
            $(this).addClass('on'); //add class attribute of "on" to the clicked element
            if (promoType == 'promoA') {
                $('#subrightcol-promo .promoA').hide(); //hide promos
                $('#subrightcol-promo .promoA:eq(' + getRel + ')').fadeIn(400); //fade in corresponding promo
            }
            if (promoType == 'promoB') {
                $('#htb-highlight-right .promoB').hide(); //hide promos
                $('#htb-highlight-right .promoB:eq(' + getRel + ')').css('display', 'block'); //show corresponding promo
            }
			if (promoType == 'promoB2') {
                $('#htb-highlight .promoB').hide(); //hide promos
                $('#htb-highlight .promoB:eq(' + getRel + ')').css('display', 'block'); //show corresponding promo
            }
			if (promoType == 'promoArea') {
                $('.promo-module .promo-area').hide(); //hide promos
                $('.promo-module .promo-area:eq(' + getRel + ')').css('display', 'block'); //show corresponding promo
            }
			if (promoType == 'promoLeft') {
                $('#subleftcol .promo .promoL').hide(); //hide promos
                $('#subleftcol .promo .promoL:eq(' + getRel + ')').css('display', 'block'); //show corresponding promo
            }
			if (promoType == 'promoRotate') {
                $('#hero-bulleted .content-right .quote-module .promo-rotate').hide(); //hide promos
                $('#hero-bulleted .content-right .quote-module .promo-rotate:eq(' + getRel + ')').css('display', 'block'); //show corresponding promo
            }
			if (promoType == 'promoRotatePhoto') {
                $('#hero-bulleted .content-right .promo-module .promo-photo-rotate').hide(); //hide promos
                $('#hero-bulleted .content-right .promo-module .promo-photo-rotate:eq(' + getRel + ')').css('display', 'block'); //show corresponding promo
            }
        }
    });

}

//needed by legacy pages on a new experience site
function log_out() {
    saml_logout();
    return false;
}

function checkinput() {
    var searchObj = $('#searchsite-input');
    if (searchObj.length > 0) {
        var term = searchObj.val();
        if ($.trim(term) == "") {
            return false;
        }
    }
}
function checkinput2() {
    var searchObj = $('#QueryText');
    if (searchObj.length > 0) {
        var term = searchObj.val();
        if ($.trim(term) == "") {
            return false;
        }
    }
}