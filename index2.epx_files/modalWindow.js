if (!window.console) {
    console = { log: function () { } };
}

var SAP = SAP || {};
SAP.wcms = SAP.wcms || {};
SAP.wcms.registrationWindow = {

    //showRegistrationPageUrl: '/bin/sapcom/register/show.html?',
    // for legacy site full path
    showRegistrationPageUrl: RegistrationPageUrl,

    show: function (type, onClose, onOpen, params) {

        this.onCloseFunction = onClose;

        // pass external params to registration page
        params.type = type;

        // pass parent window url for postMessage plugin
        params.targetUrl = window.location.href;

        var url = this.showRegistrationPageUrl + jQuery.param(params);

        // create div for popup
        // TODO opens incorrectly first time need to check
        //		if (jQuery('#wcms_popup_window').length == 0) {
        //			jQuery('<div/>', {
        //			    id: 'wcms_popup_window',
        //			}).appendTo('body');
        //			jQuery('#wcms_popup_window').css('min-width', '667px').css('margin-left','auto').css('margin-right', 'auto');
        //			jQuery('<div/>', {
        //                class: 'popup_content',
        //            }).appendTo('#wcms_popup_window');
        //		}
        this.scrollTop();
        jQuery('#wcms_popup_window').bPopup({
            modalClose: false,
            loadUrl: url,
            escClose: false,
            position: [30, 'auto'],
            content: 'iframe',
            iframeid: 'modal-window',
            follow: [false, false]
        });
        console.log('Open registration popup at url ' + url);

        // Setup a callback to handle the dispatched MessageEvent event. In cases where
        // window.postMessage is supported, the passed event will have .data, .origin and
        // .source properties. Otherwise, this will only have the .data property.
        jQuery.receiveMessage(function (e) {
            console.log('receiveMessage on parent window ' + e.data);
            SAP.wcms.registrationWindow.processCallBack(e.data);
        }, function (e) { return true; });

    },

    type: {
        BASIC: 'BASIC',
        PREMIUM: 'PREMIUM',
        CONTACT_US: 'CONTACT_US',
        UPGRADE: 'UPGRADE',
        LOGIN: 'LOGIN',
        NEWSLETTER: 'NEWSLETTER'
    },

    resize: function (width, height, centerH) {
        //jQuery('iframe', jQuery('#wcms_popup_window')).animate({width : width, height : height}, 300);
        jQuery('iframe', jQuery('#wcms_popup_window')).css({ width: width, height: height });
        if (centerH) {
            console.log('SAP.wcms.registrationWindow.resize: center hor.');
            var cp = this.getCenterPosition(jQuery('#wcms_popup_window'));
            var d = jQuery(document);
            var hPos = cp[1];
            var left = d.scrollLeft() + hPos;
            jQuery('#wcms_popup_window').css({ 'left': left });
        }

    },

    scrollTop: function () {
        jQuery('html,body').animate({ scrollTop: 0 }, 'slow');
    },

    processCallBack: function (callbackParametersQueryString) {
        callbackParameters = this.getObjectFromQueryString(callbackParametersQueryString);
        console.log('SAP.wcms.registrationWindow.processCallBack on original page ', callbackParameters);
        if (callbackParameters.action == 'resize') {
            this.resize(callbackParameters.width, callbackParameters.height, callbackParameters.centerH);
        } else if (callbackParameters.action == 'scrollTop') {
            this.scrollTop();
        } else if (callbackParameters.action == 'close') {
            if (this.onCloseFunction) {
                this.onCloseFunction(callbackParameters);
            }
            jQuery('#wcms_popup_window').bPopup().close();
        }
    },

    getObjectFromQueryString: function (queryString) {
        var result = {};
        var pairs = queryString.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            result[pair[0]] = pair[1];
        }
        return result;
    },

    getCenterPosition: function (s) {
        // Above Mean Sea Level. Vertical distance from the middle of the window, + = above, - = under.
        var a = 50;
        var w = jQuery(window);
        var vertical = ((w.height() - s.outerHeight(true)) / 2) - a;
        var horizontal = ((w.width() - s.outerWidth(true)) / 2) + this.getDistanceToBodyFromLeft();
        return [vertical < 20 ? 20 : vertical, horizontal];
    },

    getDistanceToBodyFromLeft: function () {
        var w = jQuery(window);
        return (w.width() < jQuery('body').width()) ? 0 : (jQuery('body').width() - w.width()) / 2;
    }
};