/*
This is the master JS file for the Universal Media Player
/global/ui/richmedia/js/utils/rm_UMP_config.js
Version: 05.25.12 (2)

Rich Media JavaScript: 
Rich Media Universal Media Player Configuration JS

Created:	03.03.11 - DAH
Last Edit: 
03.03.11 - put in some paths
03.23.12 - tweaked for remoteCalls - added flagForRemote();
03.26.12 - added isDVM and TSX and UAT checks.	
04.03.12 - adjusting remote paths
04.11.12 - commented out window.console cause it throws an error STILL in IE8 w/ IE7 compat mode.
05.25.12 - added window.location.protocol to make sure we're HTTP vs HTTPS

 */


	
var UMPconfig = {
	
	jsFileLocation: '/global/ui/richmedia/js/',
	cssFileLocation: '/global/ui/richmedia/css/',
	imageFileLocation: '/global/ui/richmedia/images/',
	swfFileLocation: '/global/ui/richmedia/swf/',
	
	flagForRemote: function() {
		
			isDVM = location.host.indexOf('.sap.corp');
			
			UMPconfig.tempLog('UMPconf: isDVM: ' + isDVM);
			UMPconfig.tempLog('UMPconf: location.host: ' + location.host);
			//if(location.host == "www.wackedusa.com" || location.host == "localhost:4242") {
			if(location.host != "wwwtsx.sap.com" && location.host != "wwwuat.sap.com" && isDVM < 1) {
			
				//window.location.protocol
			
				//var absolutePath = "http://www.sap.com";
				var absolutePath = window.location.protocol + "//www.sap.com";
				UMPconfig.tempLog('UMPconf: absolutePath: ' + absolutePath);
				
				UMPconfig.jsFileLocation = absolutePath + UMPconfig.jsFileLocation;
				UMPconfig.cssFileLocation = absolutePath + UMPconfig.cssFileLocation;
				UMPconfig.imageFileLocation = absolutePath + UMPconfig.imageFileLocation;
				UMPconfig.swfFileLocation = absolutePath + UMPconfig.swfFileLocation;
				
			}
			
	},
	
	tempLog: function(){
		// tLog('some value:', someVar, int); // can be any number of ARGS
		  if(window.console) {
			//console.log.apply(console, arguments);
		  }
	}

}
	
