/*
Browser stuff scripts...
/global/js/rm_platform/utils/rm_browser.js
Version: 01.11.11 - VS

Edited:

01.11.11 - Creation
02.15.12 - tweaked var s; var ua; var ss; for omniture scoping issues. - vs

*/


var rmBrowser  = {

	Name:'other',
	Version:'other',
	OS:'other',
	
	init: function() {
		rmBrowser.setBrowser();
	},

	setBrowser: function() {
		
		var s;
		var ua = navigator.userAgent;
		var ss;
		
		if (ua.indexOf("Firefox") >= 0) {
			rmBrowser.Name = "Firefox";	
			//Version:
			s = ua.indexOf("/", ua.indexOf("Firefox"));
			ss = ua.indexOf(" ", s);
			//if SS is -1, then it's at the end of the string
			if (ss > 0) {
				rmBrowser.Version = ua.substring(s + 1, ss);
			} else {
				rmBrowser.Version = ua.substring(s + 1);
			}
		} else if (ua.indexOf('Chrome') >= 0) {
			rmBrowser.Name = "Chrome";
			//Version:
			s = ua.indexOf("/", ua.indexOf("Chrome"));
			ss = ua.indexOf(" ", s);
			//if SS is -1, then it's at the end of the string
			if (ss > 0) {
				rmBrowser.Version = ua.substring(s + 1, ss);
			} else {
				rmBrowser.Version = ua.substring(s + 1);
			}
		} else if (ua.indexOf('Safari') >= 0) {
			rmBrowser.Name = "Safari";	
			//Version:
			s = ua.indexOf("/", ua.indexOf("Safari"));
			ss = ua.indexOf(" ", s);
			//if SS is -1, then it's at the end of the string
			if (ss > 0) {
				rmBrowser.Version = ua.substring(s + 1, ss);
			} else {
				rmBrowser.Version = ua.substring(s + 1);
			}
		} else if (ua.indexOf('MSIE') >= 0) {
			rmBrowser.Name = "IE";	
			//Version:
			s = ua.indexOf(" ", ua.indexOf("MSIE"));
			ss = ua.indexOf(";", s);
			//if SS is -1, then it's at the end of the string
			if (ss > 0) {
				rmBrowser.Version = ua.substring(s + 1, ss);
			} else {
				rmBrowser.Version = ua.substring(s + 1);
			}
		} else if (ua.indexOf('Opera') >= 0) {
			rmBrowser.Name = "Opera";
			s = ua.indexOf("/", ua.indexOf("Opera"));
			ss = ua.indexOf(" ", s);
			//if SS is -1, then it's at the end of the string
			if (ss > 0) {
				rmBrowser.Version = ua.substring(s + 1, ss);
			} else {
				rmBrowser.Version = ua.substring(s + 1);
			}
		} else {
			//Not one of the main 5. Get userAgent Browser (i.e. webkit)
			rmBrowser.Name = $.uaMatch(navigator.userAgent).browser;
		}
	
		//Get OS
		if ((ua.indexOf("iPad") >= 0) || (rmData.qsParm['rm_ipad_toggle'] == 'true')) {
			rmBrowser.OS = "iPad";
		} else if ((ua.indexOf("iPhone") >= 0) || (rmData.qsParm['rm_iphone_toggle'] == 'true')) {
			rmBrowser.OS = "iPhone";
		} else if ((ua.indexOf("Android") >= 0) || (rmData.qsParm['rm_droid_toggle'] == 'true')) {
			rmBrowser.OS = "Android";
		} else if ((ua.indexOf("webOS") >= 0) || (rmData.qsParm['rm_palm_toggle'] == 'true')) {
			rmBrowser.OS = "Palm";
		} else if ((ua.indexOf("BlackBerry") >= 0) || (rmData.qsParm['rm_bb_toggle'] == 'true')) {
			rmBrowser.OS = "BlackBerry";
		} else if (ua.indexOf("Windows") >= 0) {
			rmBrowser.OS = "Windows";
		} else if (ua.indexOf("Macintosh") >= 0) {
			rmBrowser.OS = "Macintosh";
		} 


	}
}
