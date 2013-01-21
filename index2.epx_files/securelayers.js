
var frame_id = "layer-frame";
var _callback_handler = null;
var _warning_dialog = null;
var dialog_id = "layer-dialog";


/* ===== DIALOG HANDLERS ===== */


// NO DIALOG
function no_dialog() {
    //alert('layer closed!');  
    closeLayer();
}
// GENERIC CLOSE DIALOG
function on_close_layer() {
    //alert('layer closed!');  
    closeLayer();
}

// CLOSE AND REFRESH PARENT DIALOG
function on_close_refresh() {
    //alert('layer closed!');  
    closeLayer();
    location.reload(true);
}

// CLOSE AND RELOCATE
function close_and_relocate(url) {
    //alert('layer closed!');  
    closeLayer();
    location.href = url;
}




/* ===== OPEN LAYER ===== */

// PARAMS: 1) URL TO OPEN IN NEW LAYER, 2) URL TO DIALOG TO DISPLAY UPON CLOSE, 3)DIALOG HANDLER CALLBACK FUNCTION TO USE, 4)CSS CLASS TO ADD TO LAYER DIV
function openLayer(url, warning_dialog, callback, layer_class) {

    // SET VARS
    var ifr = document.createElement("iframe");
    var lblackout = document.createElement("div");
    var lwrap = document.createElement("div");
    var pgcontent = document.getElementById('page-content');

    // SET ELEMENT ATTRIBUTES
    ifr.id = frame_id;
    ifr.src = url;
    ifr.scrolling = "no";
    ifr.frameBorder = "0";
    ifr.allowTransparency = "true";
    lblackout.id = "layer-blackout"
    lwrap.id = "layer-wrap"
    lwrap.className = layer_class;

    // APPEND TO DOM
    //pgcontent.appendChild(lblackout);
    //pgcontent.appendChild(lwrap);
	
	//Append to BODY in the DOM (10.12.11 - VS)
	var bContent = document.getElementsByTagName('body')[0];
	bContent.appendChild(lblackout);
    bContent.appendChild(lwrap);

    // ADD CLOSE BUTTONS TO LAYER. IF NO DIALOG URL WAS PASSED, ALLOW IT TO CLOSE WITH NO DIALOG. OTHERWISE, SHOW DIALOG UPON CLOSING.
    if (warning_dialog === "") { lwrap.innerHTML = '<a href="javascript:void(closeLayer())" id="btn-close-layer" class="btn-close-layer"><span>X</span></a>'; }
    else { lwrap.innerHTML = '<a href="javascript:void(tryCloseLayer())" id="btn-close-layer" class="btn-close-layer"><span>X</span></a>'; }

    // NOW APPEND IFRAME TO LAYER
    lwrap.appendChild(ifr);

    // SHOW THE LAYER BLACKOUT AND LAYER DIVS	
    lblackout.style.display = "block";
    lwrap.style.display = "block";

    // SET VARS
    _warning_dialog = warning_dialog;
    _callback_handler = callback;

    layerVis();

}

function replaceLayer(url, warning_dialog, callback, layer_class) {
    lWrap = document.getElementById('layer-wrap');
    lClose = document.getElementById('')
    ifr = document.getElementById('layer-frame');
    closeBtn = document.getElementById('btn-close-layer');
    ifr.style.display = 'none';
    ifr.src = url;
    lWrap.className = layer_class;
    ifr.style.display = 'block';
    ifr.allowTransparency = 'true';
    closeBtn.href = 'javascript:void(tryCloseLayer())';
    _warning_dialog = warning_dialog;
    _callback_handler = callback;
}





/* ===== OPEN REGISTRATION ===== */

function openReg() {

    window.top.replaceLayer('https://usphldvm2.phl.sap.corp/profile/login.epx?pmelayer=true', '/profile/formAbandonWarning.epx', '', 'lw-registration');


}


/* ===== CHANGE CLOSE BUTTON ACTION TO GENERIC CLOSE LAYER ===== */

function makeCloseGeneric() {
    var layerCloseBtn = window.top.document.getElementById('btn-close-layer');
    layerCloseBtn.href = "javascript:void(closeLayer())";
}




/* ===== TRY CLOSE LAYER (SHOW DIALOG) ===== */

function tryCloseLayer() {
    if (checkRegCompletion(false)) {
        on_abandon_warning_close(true);
    }
    else {
        displayDialog(_warning_dialog);
    }
    return false;
}



/* ===== CLOSE LAYER (NO DIALOG) ===== */

function closeLayer() {
    $('#layer-blackout, #layer-wrap').remove();
    $('#footer').show().css({ opacity: 1, visibility: "visible" });
    checkRegCompletion(true);
    if (typeof _callback_handler == 'function') {
        _callback_handler();
    }
}


/* ===== DISPLAY DIALOG ===== */

function displayDialog(url) {
    var ifr = document.createElement("iframe");
    ifr.id = dialog_id;
    ifr.src = url;
    ifr.allowTransparency = "true";
    document.getElementById('layer-wrap').appendChild(ifr);
    $('#layer-blackout').css({ opacity: 0.6 });
}


/* ===== CLOSE WINDOW ===== */

function closeWindow(id, do_call_back) {

    var c = document.getElementById(id);

    if (c != null)
        document.getElementById('layer-wrap').removeChild(c);
}


/* ===== SET RETURN VALUE AND CLOSE ===== */

function setReturnValueAndClose(value) {
    var handler_called = false;
    closeWindow(dialog_id);
    if (value) {
        closeWindow(frame_id, true);
        closeLayer();
        handler_called = true;
    }

    if (is_logged_in()) {
        if (!handler_called && value && typeof _callback_handler == 'function') {
            _callback_handler();
        }
    }
}


/* ===== SET RETURN VALUE AND CLOSE #2 ===== */

function setReturnValueAndClose2(value) {
    closeWindow(frame_id, value);
}


/* ===== DISPLAY OPENED LAYERS APPROPRIATELY VISUALLY ===== */

function layerVis() {
    var winH = ($(window).height());
    var layerH = ($('#layer-wrap').height());
    $('#layer-frame').attr('frameborder', '0').attr('framespacing', '0');
    $('#layer-blackout').css({ opacity: 0.6 });
    $('#footer').css({ opacity: 0, visibility: "hidden" });
}


/* ===== OPEN LAYER WINDOWS - MOVED FROM TEMPLATE ===== */
// Added CheckSecurityURL check if url from download and url is null - 06/09/2012 - PRM

function openWindowLayerHandlerRedirect(redirecturl) {
    var url = "";
    if (!is_logged_in()) // PRM - 08/24/2011
        url = GetSSOOnUrl('SingleSignOnURL')
    if (url == "")
        url = get_cookie("pmereturnurl");
    url = decodeURIComponent(url);
    if (!url || (url.toUpperCase().indexOf("/HOST") > -1))
        url = get_home_page(); //"/index.epx";
    // Fix for hard coded download url registration form cancle button - PRM - 01/04/2012
    else if (!url || (url.toUpperCase().indexOf("/CHECKSECURITY.EPX") > -1)) {
        var org_url = get_cookie('OriginatingURL');
        if (org_url != null)
            url = decodeURIComponent(org_url);
        else {
            org_url = GetSSOOnUrl('CheckSecurityURL');
            if (org_url != null)
                url = decodeURIComponent(org_url);
        }
    }
    else {
        var urlhostname = getHostname(url);
        if ((urlhostname == "") || (window.location.hostname == urlhostname))
            url = get_bridge_or_warning_url(url);
    }

    if ((url == null) || (url.toUpperCase().indexOf("DOWNLOAD.EPD") > -1))
        url = get_home_page();

    window.location.href = url;
}

/* ===== GET SINGLE SIGN ON REDIRECT URL FROM COOKIE ===== */
function GetSSOOnUrl(cookieName) {
    var url = "";
    if (cookieName == null)
        cookieName = 'SingleSignOnURL';

    var cookie = get_cookie(cookieName);
    var items = new Array();
    if (cookie != null) {
        items = cookie.split("|");
        if (items.length > 2) {
            // temporary fix
            var length = items.length - 1;
            if (items.length == 6)
                length = items.length - 2;
            if (length != '') {
                url = unescape(items[length]);
                if (url.substring(0, 4) != 'http') {
                    url = "";
                }
            }
        }
    }
    return url;
}

/* ===== GET HOST NAME ===== */
function getHostname(url) {
    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
    if (url.match(re) != null)
        return url.match(re)[1].toString();
    else
        return "";
}			
			
			