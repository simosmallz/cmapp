/*
Data reading and manipulation scripts...
/global/ui/richmedia/js/utils/rm_dhtml.js
Version: 03.26.12 - VS
*/

/*
05.09.11 - adjusting and adding the fullscreen blackoverlay controls - VS
06.14.11 - added Rich Media Modal stuff
08.01.11 - tweaked modal windows
		 - added preloader functions
09.22.11 - added modal auto_open event listener.
09.29.11 - added modal autoopen attribute checker
		 - added search for rm_warning to autoopen
10.05.11 - added all the openRMlogin (rm_login class) functions - VS
10.07.11 - tweaked zIndexes and the var content for IE errors
10.11.11 - change the zIndexes of the layers so the registration layers appear on TOP - vs.
01.31.12 - tweaked the hasWarning variable per Bill Boyle's request - VS (Just checking for a different warning window.)
02.28.12 - adjusted the makePositionedWindow function have an extra attribute to hide the close button (For the new thoughtleadership page.)
03.02.12 - adjusted the makePositionWindow function to be on a layer ABOVE #page so it works in IE.
03.13.12 - added back in the NX hasWarning stuff.
03.26.12 - changed closeButtonSRC to inlcude UMPconfig.imageFileLocation + "UMP/skins/default/btn_close_vert.png";

*/


var rmDHTML  = {
	
	makeBlackOverlay: function(overLayName, clickFunction) {
		//alert('openModalWindow: ' + theSource);
		bName = overLayName;
		
		theLayerCode = "";
		theLayerCode += '<div id="' + bName + '" onclick="' + clickFunction +'" style="cursor: pointer;">&nbsp;</div>';
		
		
		//Check if page is bigger than the window:
		bHeight = $(window).height();   // returns height of the BROWSER
		pHeight = $(document).height(); // returns the height of the PAGE 

		overlayHeight = (bHeight > pHeight) ? bHeight : pHeight;
		
		//Set the Styles
		theLayerCode += '<style type="text/css">';
		theLayerCode +='#' + bName + ' {position:absolute;opacity: .6;-moz-opacity: .6;top: 0px;left: 0px;filter: alpha(opacity=60);height:' + overlayHeight + 'px;width: 100%;background-color: #000000;z-index: 290;}'; //visibility: hidden;
		theLayerCode += '</style>';
		
		$('body').append(theLayerCode);
		
				
		$(window).resize(function() {
		  rmDHTML.adjustBlackness(bName);
		});

		
	},
	
	removeBlackOverlay: function(layerName) {
		$('#' + layerName).remove();
	},
	
	makeCenteredWindow: function(name, width, height, content, cButtonAction) {
		
		videoLayer = "";
		//closeButtonSRC = "/global/ui/richmedia/images/UMP/skins/default/btn_close_vert.png";
		closeButtonSRC = UMPconfig.imageFileLocation + "UMP/skins/default/btn_close_vert.png";
		
		
		if (arguments[5]) {
			cButtonTop = height - 10;
			cButtonLeft = width;
		} else {
			cButtonTop = height + 10;
			cButtonLeft = width + 20;
		}
		
		
		closeButtonLayer = "<div id='modalClose' style='margin:0px;height:0px;position:relative;top:-" + cButtonTop + "px;left:" + cButtonLeft + "px;cursor: pointer;'><img src='" + closeButtonSRC + "' border='0' /></div>";
		
		
		videoLayer += "<div id='" + name + "'>" + content + closeButtonLayer + "</div>";
		
		
		videoLayer += '<style type="text/css">';
		videoLayer += '#' + name + ' {position:fixed;top: 50%;left: 50%;margin-top: -' + height/2 + 'px;  margin-left: -' + width/2 + 'px; background-color: #FFFFFF; padding:0px; z-index: 292; width:' + width + 'px;}'
		videoLayer += '</style>';
		
		$('body').append(videoLayer);
		
		$('#modalClose').click(function() {
			 eval(cButtonAction);
		});
		
		//IE6 fix...
		if (rmBrowser.Name === 'IE' && parseInt(rmBrowser.Version) == 6) {
			$("#"+name).css({'position' : 'absolute'});
			//$("#up_left").css({'display' : 'inline'});
			//ie6inter = window.setInterval(ie6divMove, 200);
		}
				
	},
	
	removeCenteredWindow: function(lName) {
		if($('#' + lName).length > 0) {
			//Only remove it if it exists...
			$('#' + lName).remove();
		}
	},
	
	makePositionedWindow: function(name, wwidth, height, top, left, content, cButtonAction) {
		
		//Should we use the close button? If it's not set to anything, yes.
		var useCbutton = ( typeof arguments[7] !="undefined") ? arguments[7] : true;
		
		videoLayer = "";
		//closeButtonSRC = "/global/ui/richmedia/images/UMP/skins/default/btn_close_vert.png";
		closeButtonSRC = UMPconfig.imageFileLocation + "UMP/skins/default/btn_close_vert.png";
		
		xWid = wwidth + 20;
				
		videoLayer += "<div id='" + name + "'>";
		videoLayer += "<div id='" + name + "_01'>" + content + "</div>";
		if (useCbutton) {
			videoLayer += "<div id='modalClose' style='margin:0px;position:relative;top:10px;cursor: pointer;float:right;'><img src='" + closeButtonSRC + "' border='0' /></div>";
		}
		videoLayer += "</div>";
		
		videoLayer += '<style type="text/css">';
		videoLayer += '#' + name + ' {position:relative ;top:' + top + 'px; left:' + left + 'px; padding:0px; z-index: 292; width:' + xWid + 'px; height:' + height + 'px; overflow:hidden;float:left; margin-bottom:-'+height+ 'px;}';

		videoLayer += '#' + name + '_01 {overflow:hidden; background-color: #FFFFFF; width:' + wwidth + 'px; height:' + height + 'px; margin:0px;float:left;}';
		videoLayer += '</style>';
		
		umpPage = "";
		umpPage = '<div id="umpPage" style="display: block; position: absolute; width:950px; left: 50%; margin-left: -425px; z-index: 300;"></div>';
		$('body').prepend(umpPage);
		$('#umpPage').prepend(videoLayer);


		//this doesn't work if there's a black layer. The black layer is on the body, the page layer is ALWAYS below that in IE.
		//$('#page').prepend(videoLayer);
		
		
		$('#modalClose').click(function() {
			 eval(cButtonAction);
		});
		
		
	},
	
	removePositionedWindow: function(lName) {
		$('#' + lName).remove();
	},
	
	adjustBlackness: function(bName) {
		$('#' + bName).hide();
		
		//Check if page is bigger than the window:
		bHeight = $(window).height();   // returns height of the BROWSER
		pHeight = $(document).height(); // returns the height of the PAGE 

		//UMP.UMPconsole.log('UMP DEBUG: bHeight: ' + bHeight + ' | pHeight: ' + pHeight);
		overlayHeight = (bHeight > pHeight) ? bHeight : pHeight;
		
		$('#' + bName).show();
		$('#' + bName).css({'height' : overlayHeight + 'px'});
	},
	
	
	
	//Modal Window Code:
	//Alt Data <div id='id2' data='{"color":"brown","location":"earth","iq":"low"}'></div>
	
	
	init_modal_link: function() {
		require([UMPconfig.jsFileLocation + "utils/rm_data.js", UMPconfig.jsFileLocation + "utils/rm_browser.js"], function() {
			rm_try(function() {
				//All JS is loaded...
				rmData.init();
				rmBrowser.init();
				
				rmDHTML.findModalHrefs();
			});
		});
		//rmDHTML.findModalHrefs();
	},
	
	findModalHrefs: function() {
		$('.rm_modal').each(function(index) {			
			//Set Function
			$(this).attr('href', '');
			//$(this).attr('onclick', 'rmDHTML.open_rm_modal(this);return false;');
			$(this).click(function() {
			  rmDHTML.open_rm_modal($(this)); return false;
			});
			
			//Check for auto open:
			checkID = $(this).attr('datadiv');
			hasWarning = $("#"+checkID).find('.rm_warning').length;
			if (hasWarning == 0) {
				hasWarning = $("#" + checkID).find('img[id$=cpt_mimg]').length;
			}
			if (hasWarning == 0) {  // password reset confirmation on nx campaigns
                hasWarning = $("#" + checkID).find('h6.confirmation').length;
            }
			if ($("#"+checkID).attr("autoopen") === "true" || hasWarning > 0) {
				//alert('auto open this: ' + $("#"+checkID).attr("autoopen"));
				rmDHTML.open_rm_modal($(this));
			}
		});
		
		//Shouldn't use this method... it fails.
		//We should remove all this (09.29.11 - VS):
		$('#rm_modal_controller').trigger('auto_open');
		
		/*
		add this to the page to make the modal AUTO open - VS -09.22.11
		
		cDivHTML = "<div id='rm_modal_controller'></div>";
		$('body').append(cDivHTML);
		$("#rm_modal_controller").bind("auto_open", function(e){
			$('.rm_modal').trigger('click');
		});
		*/
		
	},
	
	open_rm_modal: function(whoAmI) {
		//Get all attributes
		//alert(this);
		//$me = whoAmI;
		//alert($(whoAmI).attr('width'));
		
		var attrs = $(whoAmI)[0].attributes;
		var dArray = new Array();
		for(var i=0;i<attrs.length;i++) {
			//alert(attrs[i].nodeName + " => " + attrs[i].nodeValue);
			nName = attrs[i].nodeName
			dArray[nName.toLowerCase()] = attrs[i].nodeValue;
		}
		
		
		rmDHTML.makeBlackOverlay('rm_modal_backness', 'rmDHTML.remove_rm_modal()');
		
		modalWidth = dArray['width'];
		modalHeight = dArray['height'];
		modalHTML = $("#" + dArray['datadiv']).html();
		
		simpleContent = "";
		//simpleContent += "<div id='newDesignModal' style='width:"+400+"px;height:"+400+"px;background:#ffffff;padding:10px;'>";
		///simpleContent += cTent;
		simpleContent += "<div id='modalData' style='width:"+modalWidth+"px;height:"+modalHeight+"px;'>" + modalHTML + "</div>";
		///simpleContent += "</div>";
		
		rmDHTML.makeCenteredWindow('rm_modal_window', modalWidth, modalHeight, simpleContent, 'rmDHTML.remove_rm_modal()', true);
		
	},
	
	remove_rm_modal: function() {
		//alert('remove it');
		rmDHTML.removeBlackOverlay('rm_modal_backness');
		rmDHTML.removeCenteredWindow('rm_modal_window');
		rmDHTML.removePositionedWindow('rm_login_window');
	},
	
	
	placePreloader: function() {	
		imgcontent = "<img src='/global/ui/images/ux/bkg-loading-wheel.gif' border='0' /><br/>Loading";
		height = 50;
		width = 70;
		
		plContent = "";
		plContent += "<div id='rm_ploader' style='width: 70px; height: 50px; text-align: center; padding-top: 10px;'>" + imgcontent + "</div>";
		
		
		plContent += '<style type="text/css">';
		plContent += '#rm_ploader {position:fixed;top: 50%;left: 50%;margin-top: -' + height/2 + 'px;  margin-left: -' + width/2 + 'px; background-color: #FFFFFF; padding:0px; z-index: 292; width:' + width + 'px;}'
		plContent += '</style>';
		
		$('body').append(plContent);
		
		
		
	},
	
	removePreloader: function() {
		$('#rm_ploader').remove();
	},
	
	init_rm_login: function() {
		//alert('found one login link...');	
		require([UMPconfig.jsFileLocation + "utils/rm_data.js", UMPconfig.jsFileLocation + "utils/rm_browser.js"], function() {
			rm_try(function() {
				//All JS is loaded...
				rmData.init();
				rmBrowser.init();
				
				rmDHTML.findRMlogins();
			});
		});
	},
	
	findRMlogins: function() {
		$('.rm_login').each(function(index) {	
		
			loginPage = $(this).attr('href');
			//alert(loginPage);
			$(this).attr('href', '');
			$(this).click(function() {
			  rmDHTML.openRMlogin(loginPage); return false;
			});
				
		});
	},
	
	openRMlogin: function(loginPage) {
		
		rmDHTML.makeBlackOverlay('rm_modal_backness', 'rmDHTML.remove_rm_modal()');
		
		//<iframe id="layer-frame" scrolling="no" frameborder="0" src="http://usphlvm1015.phl.sap.corp:6060/profile/slogin.epx?pmelayer=true&kNtBzmUK9zU=1" framespacing="0">
		
		
		loginIframeHTML = '<iframe id="layer-frame" scrolling="no" frameborder="0" width ="500" height="337" src="'+loginPage+'" framespacing="0"><p>Your Browser Does not support frames</p></iframe>';
		//loginIframeHTML = "<div>sdfjsdh jksdfh sdjkfh sdjkfh sdjkf hsdjkf hsdjkf hsdjkf sdhf </div>";
		
		simpleContent = "<div id='modalData' style='width:500px;height:337px;'>" + loginIframeHTML + "</div>";		
		rmDHTML.makePositionedWindow('rm_login_window', 500, 337, 32, 475, simpleContent, 'rmDHTML.remove_rm_modal()', true);
	}
	

}
