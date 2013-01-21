function TrackPage(pageLabel, contextVals) {
    ShowEventInteraction(encodeURIComponent(window.location.href), "PAGE", pageLabel, "", contextVals);
}

function TrackInput(fieldLabel, fieldValue, fieldParent) {
    ShowEventInteraction(encodeURIComponent(window.location.href), "INPUT", fieldLabel, fieldValue, fieldParent);
}

function TrackAsset(assetID, area) {
    ShowEventInteraction(encodeURIComponent(window.location.href), "ASSET", "Asset", assetID, area);
}

function TrackLink(targetURL, targetLabel, contextVals) {
    ShowEventInteraction(encodeURIComponent(window.location.href), "CLICK", targetLabel, targetURL, contextVals);
}

function TrackHBRedir(referrerURL) {
    TrackEventInteraction(encodeURIComponent(window.location.href), "HBREDIRECT", "Hashbang Redirect", referrerURL, "");
}

function TrackFBRec(targetURL) {
    //ShowEventInteraction(window.location.href, "SHARE", "Facebook Recommend", targetURL, "");
    ShowEventInteraction(targetURL, "SHARE", "", "Facebook Recommend", "");
}


function TrackCTABtn(thisBtn, trackLabel) {
    var contextVals = "ClickArea=CTA";
    var targetLabel;
    
    if ((trackLabel != null) && (trackLabel.length > 0))
        targetLabel = trackLabel;
    else {
        if (thisBtn.text)
            targetLabel = thisBtn.text;
        else
            targetLabel = thisBtn.innerText;
    }
    
    if (thisBtn.attributes["vieworder"]!=undefined)
        contextVals += "_p" + thisBtn.attributes["vieworder"].value;
    var targetURL = thisBtn.href;
    ShowEventInteraction(encodeURIComponent(window.location.href), "CLICK", targetLabel, targetURL, contextVals);
}

function TrackTNTRecipe(RecipeName) {
    //PAGESOURCE = "TNT";  -- Please dont modify the value in JS file, if needed modify this value on the page that needs to be identified for tracking .  by Chandu
    var SrvCall = "current:s_t";
    ShowEventInteraction(encodeURIComponent(window.location.href), "TNT", "Recipe", RecipeName, SrvCall);
}

function TrackUMP(assetID, actionType, contextVals) {
    var Context = "new:s_tl";
    if (contextVals != null)
        Context += ";" + contextVals;
    ShowEventInteraction(encodeURIComponent(window.location.href), "UMP", actionType, assetID, Context);
}

function TrackAssetView(assetID, area) {
    TrackEventInteraction(encodeURIComponent(window.location.href), "ASSETCLICK", "Asset", assetID, area);
}

function TrackFormSubmit(targetURL, targetLabel) {
    TrackEventInteraction(encodeURIComponent(window.location.href), "FORMSUBMIT", targetLabel, targetURL, "");
}

function ShowEventInteraction(url, eventType, label, value, context) {
    var _writetodb = "false";
    var _isUserTrackingEnabled = "true";

    if (typeof writeToDB != "undefined")
        _writetodb = writeToDB;

    if (typeof isUserTrackingEnabled != "undefined")
        _isUserTrackingEnabled = isUserTrackingEnabled;

    if (_isUserTrackingEnabled == false)
        url = RemoveQueryString(url);

    _coreTrackEventInteraction(url, eventType, label, value, context, "", _writetodb, _isUserTrackingEnabled);
}

function TrackEventInteraction(url, eventType, label, value, context) {
    var _isUserTrackingEnabled = "true";

    if (typeof isUserTrackingEnabled != "undefined")
        _isUserTrackingEnabled = isUserTrackingEnabled;

    if (_isUserTrackingEnabled == false)
        url = RemoveQueryString(url);

    _coreTrackEventInteraction(url, eventType, label, value, context, "", "true", _isUserTrackingEnabled);
}

function _coreTrackEventInteraction(url, eventType, label, value, context, omniCode, writetoDB) {
    var pageSource = "";
    if (typeof PAGESOURCE != "undefined")
        pageSource = PAGESOURCE;

    if (eventType == "TNT")
        pageSource = "TNT";
    var market = "";
    if (typeof MARKET != "undefined")
        market = MARKET;

    var t_r = "";
    if (typeof T_R != "undefined")
        t_r = T_R;

    var t_c = "";
    if (typeof T_C != "undefined")
        t_c = T_C;

    try {
        var track = new RemoteMethod('Tracking.epi?kNtBzmUK9zU' + omniCode);
        track.MethodName = 'TrackEventInteraction';
        track.AddArguments(url, t_r, eventType, label, value, t_c, context, pageSource, market, writetoDB);
        track.Invoke();
    }
    catch (err) { }
}

function _coreTrackEventInteraction(url, eventType, label, value, context, omniCode, writetoDB, isUserTrackingEnabled) {
    var pageSource = "";
    if (typeof PAGESOURCE != "undefined")
        pageSource = PAGESOURCE;

    var market = "";
    if (typeof MARKET != "undefined")
        market = MARKET;

    var t_r = "";
    if (typeof T_R != "undefined")
        t_r = T_R;

    var t_c = "";
    if (typeof T_C != "undefined")
        t_c = T_C;

    try {
        var track = new RemoteMethod('Tracking.epi?kNtBzmUK9zU' + omniCode);
        track.MethodName = 'TrackEventInteraction';
        track.AddArguments(url, t_r, eventType, label, value, t_c, context, pageSource, market, writetoDB, isUserTrackingEnabled);
        track.Invoke();
    }
    catch (err) {
    }
}

// ********************************************************************************
// JIRA SAPCOM-513 - Enable AddThis tracking for Omniture
// 3/9/2012 C5148110
// Code supplied by Omniture.
/*** START addthis omn:pion tracking ***/
// Last Updated : 2012.01.26
function s_pionShareEventHandler(evt) {
    try {
        // current addthis (evt is an object)  
        if (typeof (addthis) == 'object') {
            if (evt.type == 'addthis.menu.share')
                var value = evt.data.service;
            console.log("OMN: addthis (current): SHARE|" + value);
            // legacy addthis (evt is string)
        } else {
            var value = evt;
            console.log("OMN: addthis (legacy):SHARE|" + value);
        }
        // make the request to Tracking.epi
        if (typeof (TrackEventInteraction) == 'function') {
            TrackEventInteraction(encodeURIComponent(window.location.href), "SHARE", "addthis", value, "");
            console.log("OMN: Tracking.epi called");
        }
    } catch (error) { console.log("OMN: " + error); }
} // end s_pionShareEventHandler

// Wrap initialization in function to ensure it is called *after* the addThis control is loaded.
function ShareEventTrackingInit() {
    // Listen for the share event
    try {
        if (typeof (console) == 'undefined') console = { log: function () { } }

        // make sure omn s object doesn't exist...if it does, page is a JS imp; let it do its own thing
        if ((typeof (s) != 'object') || !s.prop50) {
            // if current addthis version...
            if (typeof (addthis) == 'object') {
                addthis.addEventListener('addthis.menu.share', s_pionShareEventHandler);
                console.log("OMN: addthis object listener added");
            } else {
                // look for and attempt to piggyback off previous addthis version
                if (typeof (addthis_sendto) == 'function') {
                    window.o_addthis_sendto = addthis_sendto;
                    window.addthis_sendto = function () {
                        s_pionShareEventHandler(arguments[0]);
                        o_addthis_sendto.apply(this, arguments);
                    }
                    console.log("OMN: addthis legacy function appended");
                } else {
                    console.log("OMN: no addthis widget detected");
                }
            }
            console.log("OMN: omn s object not detected");
        } else {
            console.log("OMN: omn s object detected");
        }
    } catch (error) { console.log("OMN: " + error); }
}
/*** END addthis omn:pion tracking ***/
// ********************************************************************************

function RemoveQueryString(url) {
    if ((typeof url != "undefined") && (url.length > 0)) {
        var querystring = url.split("?");
        url = querystring[0];
    }

    return url;
}