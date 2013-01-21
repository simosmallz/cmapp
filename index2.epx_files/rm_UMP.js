/*
This is the master JS file for the Universal Media Player
/global/ui/richmedia/js/projects/rm_UMP/rm_UMP.js
Version: 11.19.12 - VS
*/

/*
Rich Media JavaScript: 
Rich Media Universal Media Player Master Controller JS

Created:	12.06.10 - VS
Last Edit: 
01.05.11 - changed to require.js includes
02.01.11 - switching to new version...
02.02.11 - more cleaning up - does this comment even need to be here?
02.07.11 - added removeControlsDiv() for SWF (since the controls are contained INSIDE the SWF) - vs
02.09.11 - adjusted iPad to go to HTML5_iPad instead of QuickTime - vs
		 - added defaultControlSize var and switched the controls height from 29 to 20 - vs
02.11.11 - added -mob to mobile file name
02.14.11 - added timeToString and stringToTime
		 - added seekTo Event
		 - added interval Event
		 - added reInit();
02.15.11 - added Chaptering Controls and Functions.
02.21.11 - added CC data gathering functions
02.22.11 - controls and chaptering tweaks
02.23.11 - added mute, unmute, volume - dah
02.23.11 - mute and unmute - dah
02.25.11 - added share/recommend buttons on modal window - VL
**************************************************************************
03.31.11 - adjusted the interval to deduce the vid div ID tag... this needs more work.
****************************************************************************
03.31.11 - [object ProgressEvent] detection added on HTML5 error. If [object ProgressEvent] use SWF, ignore other errors.
03.02.11 - added preview video code.
		 - added timeStamp code.
03.03.11 - moved global paths to UMPconfig - dah
03.03.11 - added Enable/Disable Rollover functions for share/recommend - VL
		 - shut off rollover functionality when chapter layer OR CTA layer is shown - VL
		 - trigger 'end_event' when video is ended (called from base layer js) - dah
		 - added the CTA layer at end of video - VL
03.07.11 - shut off rollover functionality when chapter layer is shown AND seeking is clicked (made change to seekTo) - VL
		 - shut off all rollover functionality when CTA layer is shown AND chaptering is clicked/unclicked (made change to hideChaptering) - VL 
		 - Added seekTo param to startVideo() - dah
		 - change video's "pause" button to become a "play" button when at CTA. Remove CTA layer when user click 'play' - VL
03.15.11 - minor tweaks - VS
03.18.11 - Moved CC load functionality to UMPcc.js - dah
		 - added RMTP detection - vs
03.22.11 - added loadIntoMovie
		 - added UMP.embedDataArray[vidID]['source-flv'] detection
		 - added (rmBrowser.Name === 'Firefox' && parseInt(rmBrowser.Version) >= 4) to browserDetect to force the SWF player in FF4+
03.23.11 - added makeThumbnail() and tweaked the loadIntoMovie function to account for undefined objects.
03.24.11 - added trackThis function place holder.
		 - tweaked the iPadHTML to remove all our extra binds.
		 - added playbutton to PauseImage layer - VL
03.25.11 - added getMobilePath() - VS
		 - added noMobile() - VS
03.28.11 - fixed a tracking issue
		 - changed the pause image height - made it always display video height + 20 for the controls (to prevent the mini image problem)
03.29.11 - maked trackThis and TrackUMP() function - VS
03.30.11 - cleaned the no flash error text - vs
04.01.11 - oops. Fixed trackThis passing a string instead the variable.
04.04.11 - made ALL browsers go to the SWF version in UMP.getPlayerType() function - VS
04.06.11 - trackThis tweaks, added rm_try()
		 - removed someData from trackThis, ONLY CHECKING for mp4 or RTMP
04.07.11 - tweaked the learnMore node data - VS
04.12.11 - added if (typeof UMPswf !== 'undefined') { to teh FF3.5 fix - vs
04.13.11 - mobile detection for FLVs
06.15.11 - added tweak for sapphire11 mobile and iPad stuff
08.01.11 - added modal window and asset modal window stuff
		 - added calls to the DHTML preloader functions
08.09.11 - added PDF (document) checking to the openUMP asset code...
08.10.11 - removed Z-index applied style from the play button on the pause image
10.07.11 - removed 'content' var for IE?
		 - correct swfName for removeSWF();
10.13.11 - adjusting the getMobilePath URL
11.09.11 - made the JS playVideo function remove the pause image if it's there.
11.15.11 - preventing reinitialization (Added initalized boolean var.) / Made sure all pause buttons show up on ALL videos

02.13.12 - added adjustAddThis() function to keep the addthis popup layer in a fixed position - VS (Only fires for openModalWindowAsset() )
02.28.12 - added UMP_open_absolute functions
04.16.12 - added UMP.embedDataArray[vidID]['CTA_MAP'];
		 - added getNewData() function
05.04.12 - added UMP.currentVideoID to make sure the RIP videos load
06.07.12 - added like_2012 call for new Facebook button
06.22.12 - mBox Tracking - if($('#sap_glo_asset_viewer').length > 0)
06.29.12 - tweaked the 'Add Related Files' code
07.19.12 - added mbox hook before the gather data functions for test and target | $('#sap_glo_asset_viewer_preview').length 
07.23.12 - mbox tweaks
07.31.12 - Once T&T is done, REVERT BACK. 
08.08.12 - 4:3 Ratio Correction
08.28.12 - ADvertisement Work + (09.05.12 + 09.27.12)
10.05.12 - added tweak for sapphire 2012 videos (sapvod.edgesuite.net)
10.11.12 - sapphire 12 check fix (removed for RTMP streams)
10.16.12 - fixed var w
		 - adding new FULL preview window codes
11.05.12 - added mbox full preview codes: #sap_glo_asset_viewer_largepreview
11.12.12 - added AddThis function calls
11.19.12 - added rmData.qsParm['tp'] != 'y' check to preview for fm.sap.com

*/


var UMP = {
	
	embedDataArray: new Array(),
	playingVideo: "none",
	playerObject: new Object(),
	UMPconsole: new rmConsole('UMP_Console'),
	defaultControlSize: 20,
	currentVideoID: 'none',
	initalized: false,
	adjustingAddThis: false,
	mboxTimeOut: 0,
	mboxPreviewTime: 15,
	mboxPreviewText: 'this is the defualt text',
	mboxPreviewButton: 'click here',
	mboxPreview: false,
	mboxAjax: false,
	mboxAjaxData: "",
	
	
	init: function() {		
		if (!UMP.initialized) {
			UMP.initialized = true;
			UMP.UMPconsole.log('UMP: Universal Media Player Initialized...');
			require([UMPconfig.jsFileLocation + "utils/rm_data.js", UMPconfig.jsFileLocation + "utils/rm_browser.js", UMPconfig.jsFileLocation + "utils/rm_getcss.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_controls.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_cta.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_rollover.js",UMPconfig.jsFileLocation + "utils/rm_dhtml.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_chapter.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_cc.js"], function() {
				
				rm_try(function() {
					//All JS is loaded... get CSS:
					rmGetCSS.load_CSS(UMPconfig.cssFileLocation + 'UMP/rm_UMP_supplimental_css.css');
		
					//INIT calls
					UMPchaptering.init();
					
					//Set up the UMPs
					UMP.setup();
				});
				
				
				/*require.ready(function(){
				
					//All JS is loaded... get CSS:
					rmGetCSS.load_CSS(UMPconfig.cssFileLocation + 'UMP/rm_UMP_supplimental_css.css');
		
					//INIT calls
					UMPchaptering.init();
					
					//Set up the UMPs
					UMP.setup();
				});*/
			});
		} else {
			UMP.UMPconsole.log('UMP: UMP.initialized = true - Skipping UMP.init();');
		}
	},
	
		
	openINIT: function() {
		UMP.UMPconsole.log('UMP: openINIT() called.');
		
		//All this is not required at the moment. (It's throwing an error in IE.)
		
		/*require([UMPconfig.jsFileLocation + "utils/rm_data.js", UMPconfig.jsFileLocation + "utils/rm_browser.js", UMPconfig.jsFileLocation + "utils/rm_getcss.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_controls.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_cta.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_rollover.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_cc.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_chapter.js"], function() {
			//All JS is loaded... get CSS:
			rmGetCSS.load_CSS(UMPconfig.cssFileLocation + 'UMP/rm_UMP_supplimental_css.css');
			
			//INIT calls
			UMPchaptering.init();

			//Set up the UMPs
			UMP.openSetup();
		});*/
	},
	
	openLinkClean: function() {
		$('.UMP_open_asset').each(function(index) {
			$(this).click(function(e) {
				e.preventDefault();
				//do other stuff when a click happens
			});
		});	
	},
	
	
	
	setup: function() {
		UMP.UMPconsole.log('UMP: setup() called...');
		//Initalize Utilities
		rmData.init();
		rmBrowser.init();
		
		//Make controller div:
		UMP.makeControllerDiv();
		
		
		if ($('#sap_glo_asset_viewer_preview').length > 0) {
			UMP.UMPconsole.log('UMP: sap_glo_asset_viewer_preview div detected - calling mbox');
			//mbox - test and target check. | Don't do anything yet, let them tweak the data.
			//startTimeout
			if(typeof mboxDefine == 'function') {
				mboxDefine('sap_glo_asset_viewer_preview','sap_glo_asset_viewer_preview');
				mboxUpdate('sap_glo_asset_viewer_preview');
				UMP.UMPconsole.log('UMP: mbox functions called');
				
				UMP.openLinkClean();
				
				UMP.mboxTimeOut=setTimeout(UMP.mboxFail,15000);
			} else {
				//mbox functions undefined	
				UMP.UMPconsole.log('UMP: mbox functions undefined');
				UMP.checkEmbeds();
				
				//Find Opens
				UMP.findOpens();
			}
		} else if ($('#sap_glo_asset_viewer_largepreview').length > 0) {
			//11.05.12 - new mbox.
			UMP.UMPconsole.log('UMP: sap_glo_asset_viewer_largepreview div detected - calling mbox');
			if(typeof mboxDefine == 'function') {
				mboxDefine('sap_glo_asset_viewer_largepreview','sap_glo_asset_viewer_largepreview');
				mboxUpdate('sap_glo_asset_viewer_largepreview');
				UMP.UMPconsole.log('UMP: mbox functions called - Large Preview');
				
				UMP.openLinkClean();
				
				UMP.mboxTimeOut=setTimeout(UMP.mboxFail,15000);
			} else {
				//mbox functions undefined	
				UMP.UMPconsole.log('UMP: mbox functions undefined');
				UMP.checkEmbeds();
				
				//Find Opens
				UMP.findOpens();
			}

		} else {
			//Get the embeds
			UMP.checkEmbeds();
			
			//Find Opens
			UMP.findOpens();
		}
		
	},
	
	mboxFail: function() {
		UMP.UMPconsole.log('UMP: mbox timed out. Intializing...');
		//Get the embeds
		UMP.checkEmbeds();
		
		//Find Opens
		UMP.findOpens();
	},
	
	mboxPreviewAdjust: function(Mtime, Mtext, Mbutton) {
		UMP.UMPconsole.log('UMP: mboxPreviewAdjust fired');
		clearTimeout(UMP.mboxTimeOut);
		
		UMP.mboxPreview = true;
		
		UMP.mboxPreviewTime = Mtime,
		UMP.mboxPreviewText = Mtext,
		UMP.mboxPreviewButton = Mbutton
		
		
		if (UMP.mboxAjax) {
			UMP.UMPconsole.log('UMP: mboxAjax = true');					
			UMP.openAjaxSuccess(UMP.mboxAjaxData);
		} else {
			//Get the embeds
			UMP.checkEmbeds();
			
			//Find Opens
			UMP.findOpens();
		}
	},

	mboxActivateLargePreview: function(Mtime, Mtitle, Mtext, Mbullets, Mbutton) {
		UMP.UMPconsole.log('UMP: mboxActivateLargePreview fired.');
		clearTimeout(UMP.mboxTimeOut);
		
		UMP.mboxLargePreview = true;
		
		UMP.mboxPreviewTime = Mtime;
		UMP.mboxPreviewText = Mtext;
		UMP.mboxPreviewButton = Mbutton;
		UMP.mboxPreviewTitle = Mtitle;
		UMP.mboxPreviewBullets = Mbullets;

		if (UMP.mboxAjax) {
			UMP.UMPconsole.log('UMP: mboxAjax = true');					
			UMP.openAjaxSuccess(UMP.mboxAjaxData);
		} else {
			//Get the embeds
			UMP.checkEmbeds();
			
			//Find Opens
			UMP.findOpens();
		}

	},
	
	openSetup: function() {
		UMP.UMPconsole.log('UMP: setup() called.');
		//Initalize Utilities
		rmData.init();
		rmBrowser.init();
		
		
		if ($('#sap_glo_asset_viewer_preview').length > 0) {
			UMP.UMPconsole.log('UMP: sap_glo_asset_viewer_preview div detected - calling mbox');
			//mbox - test and target check. | Don't do anything yet, let them tweak the data.
			//startTimeout
			if(typeof mboxDefine == 'function') {
				mboxDefine('sap_glo_asset_viewer_preview','sap_glo_asset_viewer_preview');
				mboxUpdate('sap_glo_asset_viewer_preview');
				UMP.UMPconsole.log('UMP: mbox functions called');
				
				UMP.mmboxTimeOut=setTimeout(UMP.mboxFail,15000);
			} else {
				//mbox functions undefined	
				UMP.UMPconsole.log('UMP: mbox functions undefined');
				UMP.reInit();
			}

		} else if ($('#sap_glo_asset_viewer_largepreview').length > 0) {
			//11.05.12 - new mbox.
			UMP.UMPconsole.log('UMP: sap_glo_asset_viewer_largepreview div detected - calling mbox');
			if(typeof mboxDefine == 'function') {
				mboxDefine('sap_glo_asset_viewer_largepreview','sap_glo_asset_viewer_largepreview');
				mboxUpdate('sap_glo_asset_viewer_largepreview');
				UMP.UMPconsole.log('UMP: mbox functions called - Large Preview');
				
				UMP.mboxTimeOut=setTimeout(UMP.mboxFail,15000);
			} else {
				//mbox functions undefined	
				UMP.UMPconsole.log('UMP: mbox functions undefined');
				UMP.reInit();
			}

		} else {			
			//Find Opens
			UMP.findOpens();
		}
	},
	
	
	reInit: function() {
		//This function needs to exist for the AJAX calls where the DOM doesn't refresh.		
		UMP.checkEmbeds();
		UMP.findOpens();
	},

	checkEmbeds: function(asset) {
		
		$('.UMP_div').each(function(index) {
			
			//Gather Data from each UMP_div and make the div's ID the array's name
			vidID = $(this).attr('id');
			if (!UMP.embedDataArray[vidID]) {
				//If the vidID has already been indexed, don't REindex it. 
				//This can happen if there's an embed AND a open
				UMP.embedDataArray[vidID] = new Array();
			}
				UMP.gatherData(vidID, $(this));
		});
		
		UMP.UMPconsole.log('UMP: Page UMP_Div Data Gathered.');
		
		$('.UMP_div').each(function(index) {
			vidID = $(this).attr('id');
			//Apply Pause Images:
			if (UMP.embedDataArray[vidID]['status'] === "dataParsed") {
				//Only place the pauseImage if we've just parsed the data
				if (UMP.embedDataArray[vidID]['waitForAPI'] !== 'true') {
					
					if(rmData.qsParm['rm_autoStart'] == 'true') {
						//rm_autoStart defined in the query string just play teh video
						//UMP.UMPconsole.log("trackUMP(" + aas + ");");
						UMP.setUpVideo(vidID);
					} else {
						if (UMP.embedDataArray[vidID]['pauseImage'] !== undefined) {
							UMP.makePauseImage(vidID);
						}  else {
							//no pause image defined. Just play the video
							UMP.setUpVideo(vidID);	
						}
					}
					
				}
				
				UMP.addRelatedFilesList(vidID);
				
			}
			
		});
		
		$('.UMP_makeThumb').each(function(index) {
			thumbID = $(this).attr('id');
			UMP.makeThumbnail(thumbID);
		});
		
	},
	
	findOpens: function() {
		$('.UMP_open').each(function(index) {
			//alert('!' + $(this).attr('href'));
			
			var theSource = $(this).attr('href');
			if (theSource != "") {
				$(this).attr('href', "");
				$(this).click(function() {
				  UMP.openModalWindow(theSource);
				  return false;
				});
			}
		});
		
		$('.UMP_open_asset').each(function(index) {
			var theSource = $(this).attr('href');
			if (theSource != "") {
				$(this).attr('href', "");
				$(this).click(function() {
				  UMP.openModalWindowAsset(theSource);
				  UMP.pauseHero();
				  return false;
				});
			}
		});
		
		$('.UMP_open_absolute').each(function(index) {
			var theSource = $(this).attr('href');
			var tt = $(this).attr('top');
			var ll = $(this).attr('left');
			if (theSource != "") {
				$(this).attr('href', "");
				$(this).click(function() {
				  UMP.openModalAbsolute(theSource, tt, ll);
				  $('#page').trigger('UMP_openModalAbsolute', [theSource, 'unmute']);
				  return false;
				});
			}
		});
		
		
		
		UMP.UMPconsole.log('UMP: Page UMP_open links adjusted.');
	},
	
	open: function() {
		openSRC = arguments[0];
		
		floatID = 'popped_video'; //This is the ID of the modal window's video
		floatHTML = "";
		//RLC - 20110208 - instantiate and load modal using rmDialog
		//floatID here was redundant so it is no longer needed. 
		//(openSRC should return a div.UniqueId.UMP_div)
		require(['ui/rm_dialog'], function(rm_dialog) {
			var ump_dialog = new rmDialog();
			ump_dialog.load(openSRC, {
				'callback': UMP.checkEmbeds,
				'destroy': true
			});
		});
		
		/* $('<div></div>').load(openSRC + ' .UMP_div', null, 
			function (responseText, textStatus, XMLHttpRequest) {
				if (textStatus == 'success') {
					//alert($('.UMP_div', this).html());
					floatHTML = $('.UMP_div', this).html();
					UMP.makeFloatLayer(floatID, floatHTML);
				}
			}
		); */
		
	},
	
	makeFloatLayer: function(vidID, vidData) {
		//This is faked... just to see if this will work:
		//This should perhaps be pulled into a different file. 
		//This also requires the modal window stuff - which might need to get the WIdth/height... I dunno
		//RLC - 20110208 - If, UMP.open is the only method that uses this, it is depricated and should be rem'd.
		fakeHTML = "";
		fakeHTML += '<div id="' + vidID +'" class="UMP_div">';
		fakeHTML += vidData;
		fakeHTML += '</div>';
		
		// $('body').append(fakeHTML);
		UMP.UMPconsole.log('UMP: popped_video div created.');
		
		UMP.checkEmbeds(); //This perhaps needs a check single embed to preven it from running over embeded videos on the page itself
	},
	
	makePauseImage: function(vidID) {
		if (UMP.embedDataArray[vidID]['pauseImage'] !== null) {
			newDIVhtml = "";
			newDIVhtml += '<a href="" onclick="UMP.setUpVideo(\'' + vidID + '\'); UMP.pauseHero(); return false;">';
			
			//If playbutton does not equal to "false", then create the play button
			if (UMP.embedDataArray[vidID]['playbutton'] != 'false' ) {
				newDIVhtml += '<span class="btnPlay" id="play"></span>'
			}
			
			newDIVhtml += UMP.embedDataArray[vidID]['pauseImage'];
			newDIVhtml += '</a>';
			
			
			$('#' + vidID).html(newDIVhtml);

			
			//03.28.11 - changing the height BACK from the image height to the video height plus control height.
			//			this is failing sometimes on the live site - the image only partially loads before these scripts run. - VS
			//pImageHeight = $('#' + vidID).height();
			pImageHeight = parseInt(UMP.embedDataArray[vidID]['height']) + 20;
			
			$('#' + vidID).css({
				'width' : UMP.embedDataArray[vidID]['width'], 
				//'height': UMP.embedDataArray[vidID]['height'],
				'height': pImageHeight,
				'display': 'block' //added since show doesn't quite work.
			});
			//RLC - 20110208 - .show() doesn't seem to work with rmDialog. display:block; is same.
			//see also: http://api.jquery.com/show/
			//$('#' + vidID).show();
			
			var w = $('#' + vidID).width();
			playWidth = $('#play').width(); //This returns the entire video width in IE
			playHeight = $('#play').height(); //This returns the entire video width in IE
			lplay = (w - playWidth) / 2
			tplay = (pImageHeight - playHeight) / 2
			
			//Position needs work - not correctly adjusted yet
			//08.10.11 - removed this |  'z-index' : '100',   | to fix floating play button
			//$('#play').css({'position' : 'absolute', 'top' : tplay + 'px', 'left' : lplay + 'px'});
			$('#' + vidID).find('#play').css({'position' : 'absolute', 'top' : tplay + 'px', 'left' : lplay + 'px'}); //11.15.11 - make sure the play button shows on ALL embeded videos
			
			UMP.embedDataArray[vidID]['status'] = "pauseImage";
			
			UMP.UMPconsole.log('UMP: Pause Image created for: "' + vidID + '".');
			
		}
	},
	
	gatherData: function(vidID, vidData) {		
		//Loop thru all LI's and set the array id = value
		UMP.embedDataArray[vidID]['preview'] = new Array();
		UMP.embedDataArray[vidID]['preview']['enabled'] = false;
		
		$(vidData).find('li').each(function(index) {
			tID = $(this).attr('id');
			
			if (tID === 'chapters') {
				//If chapters exist, parse them:
				
				UMP.UMPconsole.log('UMP: Chapters Found for "' + vidID + '".');
				if (!UMP.embedDataArray[vidID]['chapters']) {
					UMP.embedDataArray[vidID]['chapters'] = new Array();
					UMP.embedDataArray[vidID]['chaptersTime'] = new Array();
				}
				$(this).find('li').each(function(index) {
					startTime = $(this).attr('starttime');
					theText = $(this).html();
					UMP.embedDataArray[vidID]['chapters'][index] = theText;
					UMP.embedDataArray[vidID]['chaptersTime'][index] = startTime;
				});
				UMP.embedDataArray[vidID]['chaptersOpen'] = false;
				
			} else if (tID ==='ad') {
				
				if (!UMP.embedDataArray[vidID]['ad']) {
					UMP.embedDataArray[vidID]['ad'] = new Array();
				}
				adType = $(this).attr('action');
				startTime = $(this).attr('starttime');
				UMP.embedDataArray[vidID]['ad']['action'] = adType;
				UMP.embedDataArray[vidID]['ad']['startTime'] = startTime;
				if (adType == "save") {
					tDATA = $(this).html();
					UMP.embedDataArray[vidID]['ad']['words'] = tDATA;
				} else if (adType == "link") {
					UMP.UMPconsole.log('UMP SWF: ' + UMP.embedDataArray[vidID]['ad']['action']);
					
					linkText = $(this).find('a').html();
					linkHREF = $(this).find('a').attr('href');
					linkTarget = $(this).find('a').attr('target');
					starttime = $(this).attr('starttime');

					UMP.embedDataArray[vidID]['ad']['linkText'] = linkText;
					UMP.embedDataArray[vidID]['ad']['linkHREF'] = linkHREF;
					UMP.embedDataArray[vidID]['ad']['linkTarget'] = linkTarget;
					UMP.embedDataArray[vidID]['ad']['starttime'] = starttime;
					
				}
				
			} else if (tID ==='cta_learnMore') {
				if (!UMP.embedDataArray[vidID]['cta_learnMore']) {
					UMP.embedDataArray[vidID]['cta_learnMore'] = new Array();
				}
				$(this).find('li').each(function(index) {
					liID = $(this).attr('id');
					tDATA = $(this).html();
					UMP.embedDataArray[vidID]['cta_learnMore'][liID] = tDATA;
				});
			
			} else if (tID === 'cc') {
				//Closed Captioning Defined:
				//alert(getLayer(tID).innerHTML);
				
				UMP.UMPconsole.log('UMP: Closed Captioning Found for "' + vidID + '".');	
				UMPcc.loadCCs(vidID, this);
				UMP.embedDataArray[vidID]['ccsOpen'] = false;
				
			} else if (tID === 'preview' && rmData.qsParm['tp'] != 'y') {
				
				//UMP.mboxPreview
				
				
				//20110329 - RLC :: added rm_registration.js to UMP system
				require(['utils/rm_registration'],
					function() {
						UMP.UMPconsole.log('registration js loaded');
					}
				);
				//Get Preview Information and Links if avaiable.
				previewTime = $(this).attr('time');
				//if (!UMP.embedDataArray[vidID]['preview']) {
					UMP.embedDataArray[vidID]['preview']['enabled'] = true;
				//}
				UMP.embedDataArray[vidID]['preview']['time'] = previewTime;
				$(this).find('li').each(function(index) {
					tID2 = $(this).attr('id');
					UMP.embedDataArray[vidID]['preview'][tID2] = $(this).html();
					UMP.UMPconsole.log('UMP: "' + tID2 + '": ' + $(this).html());	
				});
				
				
				
				
				/*previewType = $(this).attr('type');
				if (previewType == "full") {
					alert('preview type: ' + previewType);
				}*/
				
				if (UMP.mboxPreview) {
					//Readjust for mbox:
					UMP.UMPconsole.log('UMP.mboxPreview is true. Adjusting Preview Info');	
					UMP.embedDataArray[vidID]['preview']['time'] = UMP.mboxPreviewTime;
					UMP.embedDataArray[vidID]['preview']['text'] =  UMP.mboxPreviewText;
					UMP.embedDataArray[vidID]['preview']['button'] = UMP.mboxPreviewButton;
				}

				if (UMP.mboxLargePreview) {
					//Readjust for mbox:
					UMP.UMPconsole.log('UMP.mboxLargePreview is true. Adjusting Preview Info');	
					UMP.embedDataArray[vidID]['preview']['time'] = UMP.mboxPreviewTime;
					UMP.embedDataArray[vidID]['preview']['text'] =  UMP.mboxPreviewText;
					UMP.embedDataArray[vidID]['preview']['button'] = UMP.mboxPreviewButton;
					UMP.embedDataArray[vidID]['preview']['title'] =  UMP.mboxPreviewTitle;
					UMP.embedDataArray[vidID]['preview']['bullets'] = UMP.mboxPreviewBullets;
				}
				
			} else if (tID === 'source-rtmp') {
				tDATA = $(this).html();
				UMP.embedDataArray[vidID][tID] = tDATA;	
				UMP.embedDataArray[vidID]['isStream'] = true;
			} else if (tID === 'source-flv') {
				tDATA = $(this).html();
				UMP.embedDataArray[vidID][tID] = tDATA;	
				UMP.embedDataArray[vidID]['isFLV'] = true;
			} else if (tID === 'pauseImage') {
				tDATA = $(this).html();
				UMP.embedDataArray[vidID][tID] = tDATA;
				UMP.embedDataArray[vidID]['playbutton'] = $(this).attr('playbutton');
			} else if (tID === 'hotspots') {
				tDATA = $(this).html();				
				//str.replace(/microsoft/gi, "W3Schools"));
				//tDATA = tDATA.replace(/class=popup/gi, "class='popup'");
				//alert(tDATA);
				
				UMP.embedDataArray[vidID][tID] = tDATA;	
				mapHTML = "";
				$(this).find('li').each(function(index) {
					//alert("!: " + $(this).attr('startTime'));
					if ($(this).attr('startTime') == "CTA") {
						var xa = $(this).attr('xa');
						var xb = $(this).attr('xb');
						var ya= $(this).attr('ya');
						var yb = $(this).attr('yb');
						var theURL = $(this).find('a').attr('href')
						
						mapHTML += '<area shape="rect" coords="' + xa + ',' + ya + ',' + xb + ',' + yb + '" href="' + theURL + '" style="cursor: pointer; cursor: hand"/>';
					}
				});
				if (mapHTML != "") {
					UMP.embedDataArray[vidID]['CTA_MAP'] = mapHTML;
					//alert(UMP.embedDataArray[vidID]['CTA_MAP']);
				}
			} else {
				tDATA = $(this).html();
				UMP.embedDataArray[vidID][tID] = tDATA;	
			} 
		});
		
		//Set PlayerType:
		UMP.embedDataArray[vidID]['ptype'] = UMP.getPlayerType();
		
		//Set video's status:
		UMP.embedDataArray[vidID]['status'] = "dataParsed";
		
		//Set video's timeCodes:
		UMP.embedDataArray[vidID]['totaltime'] = 0;
		UMP.embedDataArray[vidID]['currenttime'] = 0;
			
		//Set video's isPlaying:
		UMP.embedDataArray[vidID]['isPlaying'] = false;

		//Set mute toggle:
		UMP.embedDataArray[vidID]['isMuted'] = false;
		
		UMP.embedDataArray[vidID]['mobileSource'] = UMP.getMobilePath(vidID);
		
		
		//4:3 Ratio Video Correction here: (08.08.12)
		if (UMP.embedDataArray[vidID]['vid_ratio'] === '4x3') {
			UMP.embedDataArray[vidID]['height'] = 384;	
			UMP.UMPconsole.log('four by three');
		}
		
		
	},
	
	getPlayerType: function() {
		ptype = "";
		if (rmBrowser.OS === 'iPad' && UMP.embedDataArray[vidID]['specialFlag'] !== "sapphire11") {
			ptype = "html5_ipad";
		} else if (rmBrowser.OS === 'iPad' && UMP.embedDataArray[vidID]['specialFlag'] === "sapphire11") {
			//Special Case for Sapphire11 videos and IPads
			ptype = 'videoonly';
		} else if (rmBrowser.OS === 'iPhone' || rmBrowser.OS === 'Android' || rmBrowser.OS === 'webOS') {
			ptype = 'videoonly';
		} else if (rmBrowser.OS === 'BlackBerry') {
			//we're gonna need a specific type of handling for the BB since it's so weird.
			ptype = 'blackberry';	
		} else if (rmBrowser.Name === 'Firefox' && parseInt(rmBrowser.Version) >= 4) {
			UMP.embedDataArray[vidID]['forcePlayer'] = 'SWF';
			ptype = "default";
		} else {
			//04.04.11 - added ALL browsers get swf
			UMP.embedDataArray[vidID]['forcePlayer'] = 'SWF';
			ptype = "default";
		}
		
		return(ptype);
	},
	
	
	
	makeControllerDiv: function() {
		cDivHTML = "<div id='ump_controller'></div>";
		$('body').append(cDivHTML);
		
		$("#ump_controller").bind("play_event", function(e, vidID, myValue){
			UMP.embedDataArray[vidID]['isPlaying'] = true;
			//UMP.UMPconsole.log('ump_controller event:' + e + ' - vidID: ' + vidID + ' - myValue: ' + myValue);
		});
		
		$("#ump_controller").bind("pause_event", function(e, vidID, myValue){
			UMP.embedDataArray[vidID]['isPlaying'] = false;
			//UMP.UMPconsole.log('ump_controller event:' + e + ' - vidID: ' + vidID + ' - myValue: ' + myValue);
		});
		
		
		$("#ump_controller").bind("seekTo_event", function(e, vidID, myValue){
			//alert('e:' + e + ' - vidID: ' + vidID + ' - myValue: ' + myValue);
			//UMP.seekToVideo(vidID, myValue);
		});
		
		
		$("#ump_controller").bind("interval_event", function(e, vidID, myValue){
			//UMP.UMPconsole.log('ump_controller event:' + e + ' - vidID: ' + vidID + ' - myValue: ' + myValue);
		});
				
		$('.UMP_div').each(function(index) {
				//This could possibly be tweaked. Plus, we should REMOVE this controller div when the user leaves the page
				vidID = $(this).attr('id');
				controllerInterval = setInterval(function() {
					// Do something every 1 second
					$('#ump_controller').trigger('interval_event', [vidID, 'intervalFired']);
				}, 1000);
					
		});
		
		
		UMP.UMPconsole.log('UMP: Controller Div Created');
		
	},
	
	
	setUpVideo: function(vidID) {
		if (UMP.currentVideoID == "none") {
			//Set this once, cause the page exists. This is totally the wrong way to do this. (If there's more than one video on the page this will fail)
			UMP.currentVideoID = vidID;
			UMP.UMPconsole.log('UMP: set UMP.currentVideoID: ' + UMP.currentVideoID);
		}
		if (UMP.embedDataArray[vidID]['ptype'] === 'videoonly' ) {
			//For mobile devices we just push the video.
			//This will probably need a proxy and filename/location change. - VS 02.02.11
			//var splitArray = UMP.embedDataArray[vidID]['source-mp4'].split('.');
			//mobileFile = splitArray[0] + '-mob.' + splitArray[1];
			//alert(mobileFile);
			//window.location.href = mobileFile;
			//window.location.href = 'http://download.sap.com/mobile/media/skullcandy-mob.mp4';
			//window.location.href = 'http://10.5.10.66/demos/rm_dev2/projects/UMP/content/videos/skullcandy-mob.mp4'
			//window.location = UMP.embedDataArray[vidID]['source-mp4']; 
			
			//mobileFL = UMP.getMobilePath(vidID);
			UMP.trackThis("Play", UMP.embedDataArray[vidID]['mobileSource']);
			window.location.href = UMP.embedDataArray[vidID]['mobileSource'];
			
		} else {
		
			//Create the divs
			UMP.makeUMPdiv(vidID);
			
			
			if (UMP.embedDataArray[vidID]['ptype'] === 'qt') {
				//Quicktime has been removed for this version... (02.09.11 - vs)
				require([UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_qt.js", "/global/js/rm_js/AC_Quicktime.js"], function() {
					//All JS is loaded... get CSS:
					//rmGetCSS.load_CSS('/global/css/rm_css/rm_testCSS.css');
					
					UMPqt.init(); //no controls for QT now, put in later
					//UMPcontrols.init();
					
					//UMP.placeControls(vidID);
					UMP.placeVideo(vidID);
				});
				
			} else if (UMP.embedDataArray[vidID]['ptype'] === 'html5_ipad') {
				//For iPad we're doing simple HTML5 (instead of quicktime.)
				require([UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_html_iPad.js"], function() {
					//All JS is loaded... get CSS:
					//rmGetCSS.load_CSS('/global/css/rm_css/rm_testCSS.css');
					UMPhtmlIpad.init();
					
					//UMP.placeControls(vidID); //No controls for iPAD_html5
					UMP.placeVideo(vidID);
					UMPhtmlIpad.startVideo();
					UMP.embedDataArray[vidID]['isPlaying'] = true;
					UMP.embedDataArray[vidID]['isMuted'] = false;
					UMP.trackThis("Play", UMP.embedDataArray[vidID]['mobileSource']);
				});
				
			} else if (UMP.embedDataArray[vidID]['forcePlayer'] === 'SWF' || UMP.embedDataArray[vidID]['isStream'] === true || UMP.embedDataArray[vidID]['isFLV'] === true) {
				require([UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_html.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_controls.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_swf.js", UMPconfig.jsFileLocation + "utils/swfobject.js"], function() {
					
					
					rm_try(function() {
						UMPhtml.init();
						UMPswf.init();
						UMP.placeVideo(vidID);
						
						if (UMP.embedDataArray[vidID]['source-rtmp']) {
							swfRTMP = UMP.embedDataArray[vidID]['source-rtmp'];
						} else {
							swfRTMP = UMP.embedDataArray[vidID]['source-mp4'];
						}
						
						//Check For Preview
						//04.06.11
						if (UMP.embedDataArray[vidID]['preview']['enabled']) {
							UMP.trackThis("Preview", swfRTMP);	
						} else {	
							UMP.trackThis("Play", swfRTMP);	
						}

					});
					
					
					/*UMPhtml.init();
					UMPswf.init();
					UMP.placeVideo(vidID);
					
					if (UMP.embedDataArray[vidID]['source-rtmp']) {
						swfRTMP = UMP.embedDataArray[vidID]['source-rtmp'];
					} else {
						
						swfRTMP = UMP.embedDataArray[vidID]['source-mp4'];
					}
					
					UMP.trackThis("Play", swfRTMP);*/
				});
			} else {
				
				
			
				//Load the all the required video player scripts and make it go...
				require([UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_html.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_controls.js", UMPconfig.jsFileLocation + "projects/rm_UMP/rm_UMP_swf.js", UMPconfig.jsFileLocation + "utils/swfobject.js"], function() {
					//All JS is loaded... get CSS:
					//rmGetCSS.load_CSS('/global/css/rm_css/rm_testCSS.css');
					UMPhtml.init();
					UMPswf.init();
					UMPcontrols.init();
					
					if(UMP.embedDataArray[vidID]['hideControls'] === "true") {
						//This isn't good enough. It's still placing the controls div....
						UMP.placeVideo(vidID);
					} else {
						UMP.placeControls(vidID);
					}
					//UMP.placeVideo(vidID);
					//UMPhtml.startVideo();
					//UMP.embedDataArray[vidID]['isPlaying'] = true;
					
					UMP.trackThis("Play", UMP.embedDataArray[vidID]['source-mp4']);
				});
			
			}
		
		}
		
	},
	
	makeUMPdiv: function(vidID) {
		//Replace div's HTML, show it, set it's CSS width and Height
		
		newDIVhtml = "<div id='" + vidID + "_videoDiv' class='ump_videoSpace'></div>";
		
		if (UMP.embedDataArray[vidID]['ptype'] !== 'html5_ipad') {
			//No controls for Ipad. Just the Quicktime player
			newDIVhtml += "<div id='" + vidID + "_controlsDiv' class='ump_controlsSpace'></div>";
		}
		$('#' + vidID).html(newDIVhtml);
		$('#' + vidID).show();
		
		//Figure out the controls Height
		if (rmBrowser.OS !== 'iPad') {
			controlsHeight = UMP.defaultControlSize;
		} else {
			controlsHeight = 0;
		}
		
		
		nH = parseInt(UMP.embedDataArray[vidID]['height']) + controlsHeight;
		oH = parseInt(UMP.embedDataArray[vidID]['height']);
		var w = parseInt(UMP.embedDataArray[vidID]['width']); //need to parse these for IE
		
		//Set the main video container DIV
		$('#' + vidID).css({'width' : w + 'px', 'height': nH + 'px'});
		//Set the video DIV
		$('#' + vidID + "_videoDiv").css({'width' : w + 'px', 'height': oH + 'px'});
		//Set the controls DIV
		if (UMP.embedDataArray[vidID]['ptype'] !== 'html5_ipad' || UMP.embedDataArray[vidID]['forcePlayer'] !== 'SWF') {
			//I don't know if this needs to be prevented from firing. It fails gracefully and throws no errors.
			$('#' + vidID + "_controlsDiv").css({'width' : w + 'px', 'height': controlsHeight + 'px'}); //29 pixels tall (should probably get a height somehow
		}
		UMP.embedDataArray[vidID]['status'] = "divSet";
		
		
		
		//Set the hover event of the timeStamp 
		$('#' + vidID).hover(
		  function () {
			//Hover Over
			$('#ump_controller').trigger('hoverOver_event', [vidID, 'hovering']);
		  }, 
		  function () {
			//Hover Out
			$('#ump_controller').trigger('hoverOut_event', [vidID, 'hovering']);
		  }
		);
		
		
		if(UMP.embedDataArray[vidID]['forcePlayer'] !== 'SWF') {
			//Set the on rollover functionality of the
			//Share / Recommend buttons
			UMP.enableRollover(vidID);
		}
		
		UMP.UMPconsole.log('UMP: main video divs built');
	},
	
	placeVideo: function(vidID) {
		UMP.UMPconsole.log('UMP: Placing Video: ' + vidID);
		
		theHTML = "";
		
		if (UMP.embedDataArray[vidID]['ptype'] === 'html5_ipad') {
			
			//iPad gets only the Quicktime Player
			theHTML += UMPhtmlIpad.makeOpenVideoTag(vidID);
			theHTML += UMPhtmlIpad.makeCloseVideoTag(vidID);
			theHTML += '<script language="javascript" type="text/javascript">';
			theHTML += "$('#" + vidID + "').unbind('mouseenter').unbind('mouseleave');";
            theHTML += "$('.ump_videoSpace').unbind('mouseenter').unbind('mouseleave');";
			theHTML += "UMPbuttons.removeButtons('" + vidID + "');";
			theHTML += "</script>";		
			
		} else if (UMP.embedDataArray[vidID]['forcePlayer'] === 'SWF' || UMP.embedDataArray[vidID]['isStream'] === true || UMP.embedDataArray[vidID]['isFLV'] === true) {
			UMP.UMPconsole.log('UMP: SWF PLAYER ONLY: ' + vidID);
			theHTML += '<div id="swfPlayer">';
			theHTML += '<script language="javascript" type="text/javascript">';
			theHTML += 'UMP.removeControlDIV("' + vidID + '");';
			//theHTML += "$('#" + vidID + "').unbind('mouseenter').unbind('mouseleave');";
           // theHTML += "$('.ump_videoSpace').unbind('mouseenter').unbind('mouseleave');";
			theHTML += "UMP.embedDataArray[vidID]['ptype'] = 'SWF';";
			theHTML += UMPswf.makeOpenSWFTag(vidID);
			theHTML += "</script>";
			//This is what shows up when there's no HTML5 nor Flash:
			theHTML += '<div class="UMP_NoFlash"><p class="UMP_NoFlash_text">Flash Not Detected...</p><p class="UMP_NoFlash_text">Please go to<br /><a href="http://get.adobe.com/flashplayer/" style="color: #CCCCCC">http://get.adobe.com/flashplayer/</a><br />to download and install the latest Flash Player</p></div>';			
			theHTML += '</div>';
			//UMP.UMPconsole.log('UMP: SWF theHTML: ' + theHTML);
		} else {
			
			
			//Except for above, everything gets the HTML5 graceful fallback stuff
			theHTML += '<div id="swfPlayer">';
			theHTML += UMPhtml.makeOpenVideoTag(vidID);
		
			theHTML += '<script language="javascript" type="text/javascript" >';
			
			//This line catches any error in the HTML5 video which prevents play black. 
			//If there's an error, make the SWF player
			theHTML += '$("#UMP_' + vidID + '_html5_video").bind("error", function (e) {';	
			theHTML += "UMP.UMPconsole.log('*** UMP HTML5 Video Tag Error - e: ' + e);";
			
			//theHTML += "for (var key in e) {";
			//theHTML += "UMP.UMPconsole.log(key + ' -> ' + e[key]);";
			//theHTML += " }";
			
			
			//theHTML += "UMP.UMPconsole.log(' -> ' + e.originalEvent.toString());";
			//theHTML += "for (var key in e.originalEvent) {";
			//theHTML += "UMP.UMPconsole.log(key + ' -> ' + e.originalEvent[key]);";
			//theHTML += " }";
			
			theHTML += "if (e.originalEvent.toString() === '[object ProgressEvent]') {";
			theHTML += "UMP.UMPconsole.log('UMP HTML5 Video Tag Error - originalEvent = ProgressEvent - make swf');";
			theHTML += 'UMP.removeControlDIV("' + vidID + '");';
			theHTML += "$('#" + vidID + "').unbind('mouseenter').unbind('mouseleave');";
            theHTML += "$('.ump_videoSpace').unbind('mouseenter').unbind('mouseleave');";
			theHTML += "UMPbuttons.removeButtons('" + vidID + "');";
			theHTML += "$('#timeStamp').hide();";
			theHTML += "UMP.embedDataArray[vidID]['ptype'] = 'SWF';";
			theHTML += UMPswf.makeOpenSWFTag(vidID);	
			theHTML += "}";
				
			theHTML += "});";
			
			
			//This line is there to over write the entire VIDEO tag with the SWF object if HTML5 Video isn't supported.
			theHTML += 'if (rmBrowser.Name == "IE") {';
			theHTML += 'UMP.removeControlDIV("' + vidID + '");';
			theHTML += "$('#" + vidID + "').unbind('mouseenter').unbind('mouseleave');";
            theHTML += "$('.ump_videoSpace').unbind('mouseenter').unbind('mouseleave');";
			theHTML += "UMPbuttons.removeButtons('" + vidID + "');";
			theHTML += "$('#timeStamp').hide();";
			theHTML += "UMP.embedDataArray[vidID]['ptype'] = 'SWF';";
			theHTML += UMPswf.makeOpenSWFTag(vidID);
			theHTML += '}';
			
			theHTML += "</script>";
			
			//This is what shows up when there's no HTML5 nor Flash:
			theHTML += '<p>No Flash and no HTML 5</p>';
			
			theHTML += UMPhtml.makeCloseVideoTag(vidID);
			
			theHTML += '</div>';
		
		}
		
		
		//Write it to the page and the console
		//UMP.UMPconsole.log('UMP DEBUG: (player) ' + theHTML);
		$("#" + vidID + "_videoDiv").html(theHTML);
		
		if (typeof UMPswf !== 'undefined') {
			//FF 3.5 fix:
			if (UMPswf.checkForOldFF()) {
				UMPswf.oldFireFoxEmbed();
			}
		}
		
	},
	
	placeControls: function(vidID) {
		
		theHTML = "";
		theHTML += UMPcontrols.makeControlsHTML(vidID);
		
		//UMP.UMPconsole.log('UMP DEBUG: (controls) ' + theHTML);
		$("#" + vidID + "_controlsDiv").html(theHTML);
		
		//Need to apply this function to the chapterInclusion button. Perhaps this doesn't need to be here?
		//Perhaps added a CONTROLS 2ndInit()? To call after it's written to the page?
		
		$('.chapterInclusion').click( function() {
			//UMPcontrols.openChapters($(this));
			UMP.toggleChaptering(UMPcontrols.getMyVidID($(this)));
		});
		
		//Set the width of Progress bar 
		//after the controls have have been placed 
		UMPcontrols.setProgressWidth(vidID);
			
		
	},
	
	postControlsPlacement: function(vidID) {
		UMP.placeVideo(vidID);
		UMPhtml.startVideo(rmData.qsParm['seekTo']);
		UMP.embedDataArray[vidID]['isPlaying'] = true;
		UMPcontrols.makeTimeDiv(vidID);
	},
	
	
	removeControlDIV: function(vidID) {
		$("#" + vidID + "_controlsDiv").remove();
		newH = $("#" + vidID + "_videoDiv").height() + UMP.defaultControlSize;
		$("#" + vidID + "_videoDiv").css({"height" : newH + "px"});
	},
	
	
	
	
	//Call To Action Functions (CTA)
	//These functions are contained in rm_UMP_cta.js (rm_UMP_cta.js)
	showCTA: function(vidID) {
		UMPcta.showCTA(vidID);
		UMP.disableRollover(vidID);
	},
	
	removeCTA: function(vidID) {
		UMPcta.removeCTA(vidID);
		//When removing CTA
		//if chaptering is opened/on, then disable rollover
		//else enable rollover
		if (UMP.embedDataArray[vidID]['chaptersOpen']) {
			UMP.disableRollover(vidID);
		} else {
			UMP.enableRollover(vidID);
		}
	},
	
	
	//Share and Recommend Buttons Functions
	//These functions are contained in rm_UMP_rollover.js (rm_UMP_rollover.js)
	showButtons: function(vidID) {
		UMPbuttons.showButtons(vidID);
	},
	
	removeButtons: function(vidID) {
		UMPbuttons.removeButtons(vidID);
	},
	
	//On Rollover Functions for Share & Recommend Buttons 
	enableRollover: function(vidID) {
		if(UMP.embedDataArray[vidID]['ptype'] !== 'SWF') {
		$('#' + vidID + '_videoDiv').hover(
			function () {
				UMPbuttons.onHoverOver(vidID);
			 },
		  function () {
				UMPbuttons.onHoverOut(vidID);
			});
		}
	},

	disableRollover: function(vidID) {
		UMP.UMPconsole.log('UMPdisableRollover');
		$('#' + vidID + '_videoDiv').unbind('mouseenter').unbind('mouseleave');
	},
	
	
	
	//Closed Captioning Functions (CCs)
	//These functions are contained in rm_UMP_cc.js (rm_UMP_cc.js)
	showCC: function(vidID) {
		UMPcc.showCC(vidID);
	},
	
	
	removeCC: function(vidID) {	
		UMPcc.removeCC(vidID);
	},
	
	
	//INLINE (and perhaps outline) Chaptering Functions
	//These functions are contained in rm_UMP_cc.js (rm_UMP_chapter.js)
	showChaptering: function(vidID) {
		UMPchaptering.showChaptering(vidID);
		UMPcontrols.toggleChap('open');
		UMP.embedDataArray[vidID]['chaptersOpen'] = true;
		UMP.disableRollover(vidID);
	},
	
	
	hideChaptering: function(vidID) {
		UMPchaptering.hideChaptering(vidID);
		UMPcontrols.toggleChap('close');
		UMP.embedDataArray[vidID]['chaptersOpen'] = false;
		//When hiding Chapters
		//if CTA is active/showned, then disable rollover
		//else reactivate/enable rollover
		if ($('#' + vidID + '_cta').html()) {
			UMP.disableRollover(vidID);
		} else {
			UMP.enableRollover(vidID);
		}
	},
	
	toggleChaptering: function(vidID) {
		if(UMP.embedDataArray[vidID]['chaptersOpen']) {
			UMP.hideChaptering(vidID);
		} else {
			UMP.showChaptering(vidID);
		}
	},
	
	
	
	
	timeToString: function(time) {
		//Changes seconds into the time format (FLOAT to formatted STRING);
		var tm = time;
		var m = Math.floor(tm / 60);
		var s = Math.floor(tm - (m * 60));
		timeString = "" + (m < 10 ? ("0" + m) : m) + ":" + (s < 10 ? ("0" + s) : s);
		return(timeString);
	},
	
	stringToTime: function(time) {
		//Changes the STRING time into seconds;
		if (time) {
		gotime = time.split(":");
		t1 = ((parseInt(gotime[0]) * 60) + (parseInt(gotime[1])));
		} else {
			t1 = -1;	
		}		
		return(t1);
	},
	
	
	
	continueFromPreview: function(vidID) {
		UMP.UMPconsole.log('continueFromPreview - vidID: ' + vidID);
		UMP.embedDataArray[vidID]['preview']['enabled'] = false;
		if (UMP.embedDataArray[vidID]['ptype'] === 'SWF' ||UMP.embedDataArray[vidID]['ptype'] === 'default' ) {
			UMPcontrols.removePreviewMessage(vidID);
			UMPswf.removePreview(vidID);
		} else {
			UMPcontrols.enable(vidID);	
		}

		if (UMP.embedDataArray[vidID]['source-rtmp']) {
			swfRTMP = UMP.embedDataArray[vidID]['source-rtmp'];
		} else {
			swfRTMP = UMP.embedDataArray[vidID]['source-mp4'];
		}


		UMP.trackThis("ContinueFromPreview", swfRTMP);
	},
	
	
	getNewMovie: function(vidDataURL) {
		
	},
	
	getNewData: function(vidDataURL, replacementDivID) {
		//This function replaces the videodiv (replacementDivID) with the div from vidDataURL		
		//Check for modal first...
		var replaceThisOne;
		if($('#modalData').length > 0) {
			replaceThisOne = 'modalData';
		} else {
			//replaceThisOne = replacementDivID;
			replaceThisOne = UMP.currentVideoID; //currentVideoID is only set once.
		}
		
		
		//blackout the video - add the preloader as we get the data.
		rmDHTML.placePreloader();
		
		$.ajax({
			type: 'GET',
        	global: true,
		  	url: vidDataURL,
			error:function(xhr, status, errorThrown) {
                alert(errorThrown+'\n'+status+'\n'+xhr.statusText);
        	},
		  	success: function(data) {
				rmDHTML.removePreloader();
				
				//delete data from original array:
				delete UMP.embedDataArray[replacementDivID];

				//Replace all the data
				var theNewData = $('<div>' + data + '</div>').find('.UMP_div');
				$('#' + replaceThisOne).html(theNewData);
				
				
				//Always set it to autoPlay:
				rmData.qsParm['rm_autoStart'] = 'true';
				
				//FIND IT AGAIN
				UMP.checkEmbeds();
								
			}
		});
		
		
	},
	
	
	loadIntoMovie: function(vidID, dataID) {
		//Loads movie data (dataID) into div (vidID)
		UMP.UMPconsole.log('UMP DEBUG: (loadIntoVideo) vidID: ' + vidID + ' dataID: ' + dataID);
		
		pushHTML = $("#" + dataID).html();
		$("#" + vidID).html(pushHTML);
		
		//Remove all running UMP stuff:
		delete UMP.embedDataArray[vidID];

		if (typeof UMPhtml !== 'undefined') {
			UMPhtml.removeHTMLbinds();
		}
		if (typeof UMPswf !== 'undefined') {
			UMPswf.removeSWFbinds();
		}
		
		//GO GO GO!
		UMP.checkEmbeds();
		
	},
	
	makeThumbnail: function(thumbID) {
		thumbImage = $('#' + thumbID).find("#thumbnailImage").html();
		thumbTarget = $('#' + thumbID).find("#thumbnailImage").attr('target');
		thumbDataID = "tData_" + thumbID;
		
		
		thumbData = $('#' + thumbID).html();
		newDataDiv = '<div id="' + thumbDataID + '" class="UMP_data">';
		newDataDiv += thumbData;
		newDataDiv += '</div>';
		$('body').append(newDataDiv);
		
		thumbHTML = '<a href="" onclick="UMP.loadIntoMovie(\'' + thumbTarget + '\', \'' + thumbDataID + '\');return false;">' + thumbImage + '</a>';
		
		$('#' + thumbID).html(thumbHTML);
		$('#' + thumbID).show();
		$('#' + thumbID).removeClass('UMP_makeThumb');
	},
	
	openModalAbsolute: function(theSource, tt, ll) {
		rmDHTML.makeBlackOverlay('UMPblackLayer', 'UMP.removeModalWindow();');
		
		//Add Preloader?
		rmDHTML.placePreloader();
		
		var windowWidth;
		var windowHeight;
		
		var xtraW;
		var xtraH;

		//Get the data:
		$.ajax({
			type: 'GET',
        	global: true,
		  	url: theSource,
			error:function(xhr, status, errorThrown) {
                alert(errorThrown+'\n'+status+'\n'+xhr.statusText);
        	},
		  	success: function(data) {
				rmDHTML.removePreloader();
				
				var theTrueDataX = $('<div>' + data + '</div>').find('.UMP_div');
				
				//Gather the data
				//vidID = $('<div>' + data + '</div>').find('.UMP_div').attr('id');
				vidID = 'modalDataAbsolute';
				
				UMP.embedDataArray[vidID] = new Array();
				UMP.gatherData(vidID, theTrueDataX);
				
				//Make video space?
				windowWidth = UMP.embedDataArray[vidID]['width'];
				windowHeight = UMP.embedDataArray[vidID]['height'];
				
				xtraW = parseInt(windowWidth);
				xtraH = parseInt(windowHeight) + 20;
				
				content = "&nbsp;";
				
				simpleContent = "";
				simpleContent += "<div id='" + vidID + "' style='width:"+windowWidth+"px;height:"+windowHeight+"px;z-index: 200;'>" + content + "</div>";		
				
				videoLayerHTML = rmDHTML.makePositionedWindow('modalWindowPopUpAbs', xtraW, xtraH, tt, ll, simpleContent, 'UMP.removeModalWindow();', false);
	
				UMP.setUpVideo(vidID);
				
			}
		});
	},
	
	
	openModalWindowAsset: function(theSource) {
		rmDHTML.makeBlackOverlay('UMPblackLayer', 'UMP.removeModalWindow();');
		
		
		//addthis tweak. Change the settings of the addthis window ONLY if opening a modal window
		UMP.adjustingAddThis = true;
		//setTimeout(UMP.adjustAddThis, 1000);
		//setTimeout(UMP.reInitAddThis, 1000);



		
		//Add Preloader?
		rmDHTML.placePreloader();
		
		//Get the data:
		$.ajax({
			type: 'GET',
        	global: true,
		  	url: theSource,
			error:function(xhr, status, errorThrown) {
                alert(errorThrown+'\n'+status+'\n'+xhr.statusText);
        	},
		  	success: function(data) {
				UMP.UMPconsole.log('UMP: AJAX SUCCESS! Check for MBOX');
				//11.06.12 - changed 'sap_glo_asset_viewer_preview' to 'sap_glo_asset_viewer_largepreview'
				if ($(data).find('#sap_glo_asset_viewer_largepreview').length > 0) {
					UMP.UMPconsole.log('UMP: sap_glo_asset_viewer_largepreview div detected - calling mbox');
					//mbox - test and target check. | Don't do anything yet, let them tweak the data.
					//startTimeout
					//UMP.UMPconsole.log('UMP: !!!!!!!!!!!!!!!!!!!!!!!!!!!!' + $('#sap_glo_asset_viewer_preview').length);
					
					if (!UMP.mboxAjax) {
						UMP.UMPconsole.log('UMP: added sap_glo_asset_viewer_largepreview to body');
						$('#page').append("<div id='sap_glo_asset_viewer_largepreview'></div>");
					}
					
					if(typeof mboxDefine == 'function') {
						mboxDefine('sap_glo_asset_viewer_largepreview','sap_glo_asset_viewer_largepreview');
						mboxUpdate('sap_glo_asset_viewer_largepreview');
						UMP.UMPconsole.log('UMP: mbox functions called');
						//UMP.mboxTimeOut=setTimeout(UMP.mboxAjaxFail(data),15000);
						UMP.mboxAjax = true;
						UMP.mboxAjaxData = data;
						UMP.mboxTimeOut=setTimeout(function(){ 
							UMP.mboxAjaxFail(data)
						},15000);

					} else {
						//mbox functions undefined	
						UMP.UMPconsole.log('UMP: mbox functions undefined');
						
						UMP.openAjaxSuccess(data);
						
					}
				} else {
					//no Mbox.
					UMP.openAjaxSuccess(data);	
				}
			}
		});
		
	},
	
	mboxAjaxFail: function(Tdata) {
		UMP.UMPconsole.log('UMP: mbox timed out. Intializing...');
		//Get the embeds
		UMP.openAjaxSuccess(Tdata);	
	},
	
	

	
	openAjaxSuccess: function(theData) {
		var windowWidth = 0;
		var windowHeight = 0;
		
		var xtraW = 0;
		var xtraH = 0;
		
		
		rmDHTML.removePreloader();
		
		
		isUMP = $(theData).find('.UMP_div').length; //1 = UMP; 0 = no UMP

		if (isUMP == 1) {
			//Content IS a UMP Div.

			fullData = $('<div>' + theData + '</div>').find('.UMP_div').parent('#video-right-col').parent('#videoPanel').parent('.clearfix');
			theTrueData = $('<div>' + theData + '</div>').find('.UMP_div');
			//alert($(theTrueData).html());
			vidID = $('<div>' + theData + '</div>').find('.UMP_div').attr('id');
			//alert('vidID: ' + vidID);
			//Gather the data
			//vidID = 'modalData';
			UMP.embedDataArray[vidID] = new Array();
			
			
			UMP.gatherData(vidID, theTrueData);
			
			//Make video space?
			windowWidth = UMP.embedDataArray[vidID]['width'];
			windowHeight = UMP.embedDataArray[vidID]['height'];
			
			xtraW = parseInt(windowWidth);
			xtraH = parseInt(windowHeight) + 20;
			
			windowWidth = xtraW = 950;
			windowHeight = xtraH = 390;
		
		} else {
			//assume it's a PDF	
			fullData = $('<div>' + theData + '</div>').find('#documentPanel').parent('.clearfix');
			
			windowWidth = xtraW = 950;
			windowHeight = xtraH = 310;
		}
		

		insideContent = $(fullData).html() + "<div id='fb-root'></div>";
		
		simpleContent = "<div id='newDesignModal' style='width:"+xtraW+"px;height:"+xtraH+"px;background:#ffffff'>"; //;padding:10px;
		simpleContent += "<div id='modalData' style='width:"+windowWidth+"px;height:"+windowHeight+"px;'>" + insideContent + "</div>"; // overflow:hidden;
		
		
		simpleContent += "</div>";
						
		videoLayerHTML = rmDHTML.makeCenteredWindow('modalWindowPopUp', xtraW, xtraH, simpleContent, 'UMP.removeModalWindow();', 'moveCloseButton');

		


		if (isUMP == 1) {
			UMP.setUpVideo(vidID);
		}
		
		
		
		//if "Facebook Like" button is present, load appropriate script
		if ($('#newDesignModal').find('.fbLikeButton').length > 0) {
			$.getScript('/global/ui/js/facebook.js');					
		} 
		
		
		if ($('#newDesignModal').find('.like_2012').length > 0) {
			if (typeof FB !== "undefined") {
				
				FB.XFBML.parse();
			} else {
				$.getScript('/global/ui/js/facebook_2012.js');
			}
		}
		
		
		//Add Related Files (PDF link to layer):
		if (typeof vidID !== "undefined") {
			UMP.addRelatedFilesList(vidID);
		}
		
		//mBox Tracking - 06.22.12
		//if($('#sap_glo_asset_viewer').length > 0)
		if($(theData).find('#sap_glo_asset_viewer').length > 0)
		{
			UMP.UMPconsole.log("UMP - Mbox: sap_glo_asset_viewer found. Calling activateToolTip()");
			mboxDefine('sap_glo_asset_viewer','sap_glo_asset_viewer');
			mboxUpdate('sap_glo_asset_viewer','location='+location.href);
			//activateToolTip();
		}


		//AddThis reinitialize: 11.12.12
		UMP.reInitAddThis();
	},
	

	
	openModalWindow: function(theSource){
		//Make the Black Overlay
		rmDHTML.makeBlackOverlay('UMPblackLayer', 'UMP.removeModalWindow();');
		
		//Add preloaded for ajax call delay?
		
		
		//Get the data:
		$.ajax({
			type: 'GET',
        	global: true,
		  	url: theSource,
			error:function(xhr, status, errorThrown) {
                alert(errorThrown+'\n'+status+'\n'+xhr.statusText);
        	},
		  	success: function(data) {
				
				//Check Embeds On data...
				//theTrueData = rmData.stringToData(data, '.UMP_div');
				//removed for the better method of this:
				
				theTrueData = $('<div>' + data + '</div>').find('.UMP_div');
				
				//Gather the data
				vidID = 'modalData';
				UMP.embedDataArray[vidID] = new Array();
				UMP.gatherData(vidID, theTrueData);
				
				//Make video space?
				windowWidth = UMP.embedDataArray['modalData']['width'];
				windowHeight = UMP.embedDataArray['modalData']['height'];
				
				xtraW = parseInt(windowWidth);
				xtraH = parseInt(windowHeight) + 20;
				
				content = "&nbsp;";
				
				simpleContent = "<div id='newDesignModal' style='width:"+xtraW+"px;height:"+xtraH+"px;background:#000000;padding:10px;'>";
				simpleContent += "<div id='modalData' style='width:"+windowWidth+"px;height:"+windowHeight+"px;'>" + content + "</div>";
				simpleContent += "</div>";
								
				videoLayerHTML = rmDHTML.makeCenteredWindow('modalWindowPopUp', xtraW, xtraH, simpleContent, 'UMP.removeModalWindow();');
	
				
				UMP.setUpVideo('modalData');
			
			  }
		});
		
	},
	
	removeModalWindow: function() {
		
		if (typeof UMPswf !== 'undefined') {
			UMPswf.removeSWFbinds();
			swfID = $('#modalData').find('.UMP_div').attr('id');
			//modalDataAbsolute
			if (typeof swfID === 'undefined') {
				//swfID = $('#modalDataAbsolute').find('.UMP_div').attr('id');
				//The code above SHOULD work, but doesn't... In fact, this is kinda totally borked... VS 03.12.12
				swfID = 'modalDataAbsolute';
			}			
			//UMPswf.removeSWF('modalData'); //modalData is NOT the name of the SWF
			if (typeof swfID !== 'undefined') {
				UMPswf.removeSWF(swfID);
			}
		}
		
		rmDHTML.removeBlackOverlay('UMPblackLayer');
		rmDHTML.removeCenteredWindow('modalWindowPopUp');
		rmDHTML.removeCenteredWindow('modalWindowPopUpAbs');
		UMP.adjustingAddThis = false;
		$('#page').trigger('UMP_closeModal', ['', 'UMP_closeModal']);
	},
	
	
	
	trackThis: function() {
		//Needs more work, obviously:
		aLength = arguments.length;
		aas = "";
		
		if (UMP.embedDataArray[vidID]['assetId']) {
			aas = "'" + UMP.embedDataArray[vidID]['assetId'] + "', ";
		} else {
			vidSrc = UMP.embedDataArray[vidID]['source-mp4'];
			if (!vidSrc) {
				vidSrc = UMP.embedDataArray[vidID]['source-rtmp'];
			}
			aas = "'" + vidSrc + "', ";
				
		}
				
		for (a=0; a<aLength; a++) {
			aas += "'" + arguments[a] + "'";	
			if (a <aLength - 1) {
				aas += ", ";	
			}
		}
		
		//alert("trackUMP(" + aas + ");");
		UMP.UMPconsole.log("CALLING: TrackUMP(" + aas + ");");
		
		if ( window.TrackUMP ) {
			eval('TrackUMP(' + aas + ')');
		} else {
			UMP.UMPconsole.log("TrackUMP() not detected;");
		}
	},
	
	getMobilePath: function(vidID) {
		//alert('get mobile video for ' + vidID);
		
		if (UMP.embedDataArray[vidID]['source-mp4']) {
			//mSource = UMP.embedDataArray[vidID]['source-mp4'];
			startingSource = UMP.embedDataArray[vidID]['source-mp4'].toLowerCase();
			slicedSource = startingSource.substring(startingSource.indexOf("/mmov/") + 6);
		} else if (UMP.embedDataArray[vidID]['source-flv']) {
			startingSource = UMP.embedDataArray[vidID]['source-flv'].toLowerCase();
			slicedSource = startingSource.substring(startingSource.indexOf("/mmov/") + 6);
		} else if (UMP.embedDataArray[vidID]['source-rtmp']) {
			startingSource = UMP.embedDataArray[vidID]['source-rtmp'].toLowerCase();	
			slicedSource = startingSource.substring(startingSource.indexOf("/vod/") + 5);
		} 
		
		if ((slicedSource.indexOf("videos/") || (slicedSource.indexOf("videos/") >= 0)) >= 0) {
			mobilePath = 'http://sapvideo.edgesuite.net/mobile/videos/';
			extension = 'mp4';
			theRestStart = slicedSource.indexOf("videos/") + 7;
		} else if ((slicedSource.indexOf("demos/") || (slicedSource.indexOf("demos/") >= 0)) >= 0) {
			mobilePath = 'http://sapvideo.edgesuite.net/mobile/demos/';
			extension = 'mp4';
			theRestStart = slicedSource.indexOf("demos/") + 6;
		} else {
			mobilePath = 'http://sapvideo.edgesuite.net/mobile/';
			extension = 'mp4';
			theRestStart = 0;
		}
		
		
		
		file = slicedSource.substring(theRestStart, slicedSource.length - 4);
		file = file + '-mob.' + extension;
		mSource = mobilePath + file;
		
		if (UMP.embedDataArray[vidID]['specialFlag'] === "sapphire11") {
			UMP.UMPconsole.log("UMP Mobile Path: Sapphire11 Flag");
			mSource = UMP.embedDataArray[vidID]['source-mp4'];
		}
		
		if (UMP.embedDataArray[vidID]['source-mp4']) {
			if (UMP.embedDataArray[vidID]['source-mp4'].indexOf("sapvod.edgesuite.net") > 0) {
				UMP.UMPconsole.log("UMP Mobile Path: Sapphire 2012 vid detected!");
				mSource = UMP.embedDataArray[vidID]['source-mp4'];
			}
		}
		
		
		UMP.UMPconsole.log("UMP Mobile Path Adjustment: " + mSource);
		return (mSource);
	},
	
	noMobile: function(vidID) {
		$('#' + vidID).html("We're sorry, this video has not yet been converted for mobile devices.");
	},
	
	
	//These are the API calls
	playVideo: function(vidID) {
		//It's paused, play it:
		//callPauseFuntion();
		if (UMP.embedDataArray[vidID]['isPlaying'] != true) {
			//if there's a pause image:
			if (UMP.embedDataArray[vidID]['status'] == "pauseImage") {
				UMP.setUpVideo(vidID);
			} else {		
				$('#ump_controller').trigger('play_event', [vidID, 'play']);
				UMP.removeCTA(vidID);
			}
		}
	},
	
	pauseVideo: function(vidID) {
		//It's playing, pause it:
		//callPlayFunction();
		if (UMP.embedDataArray[vidID]['isPlaying'] != false) {
			$('#ump_controller').trigger('pause_event', [vidID, 'pause']);
		}
	},
	
	videoEnded: function(vidID) {
		$('#ump_controller').trigger('end_event', [vidID, 'end']);
		UMP.hideChaptering(vidID);
		UMP.removeButtons(vidID);
		UMP.showCTA(vidID);
		$("#play").show();
		$("#pause").hide();
	},
	
	fullscreenVideo: function(vidID) {
		$('#ump_controller').trigger('fullscreen_event', [vidID, 'fullscreen']);

	},
	
	seekTo: function(vidID, toTime) {
		$('#ump_controller').trigger('seek_event', [vidID, toTime]);
		UMP.removeCTA(vidID);
		if (UMP.embedDataArray[vidID]['chaptersOpen']) {
			UMP.disableRollover(vidID);
		}
		if (UMP.embedDataArray[vidID]['isPlaying']) {
			$("#pause").show();
			$("#play").hide();
		}
	},
	
	mute: function(vidID) {
		UMP.embedDataArray[vidID]['isMuted'] = true;
		$('#ump_controller').trigger('mute_event', [vidID, 'mute']);

	},
	
	volume: function(vidID, theVol) {
		$('#ump_controller').trigger('volume_event', [vidID, theVol]);
	},
	
	unmute: function(vidID) {
		UMP.embedDataArray[vidID]['isMuted'] = false;
		$('#ump_controller').trigger('unmute_event', [vidID, 'unmute']);
	},
	
	
	//adjustAddThis can be removed I think... removing the call to it
	/*adjustAddThis: function() {
		//This is to move the addthis pop up window when a modal is open cause addthis doesn't work with fixed position stuff
		$('#addthis_dropdown15').css({
			'position': 'fixed'
		});

		if (UMP.adjustingAddThis) {
			setTimeout(UMP.adjustAddThis, 1000);
		} else {
			$('#addthis_dropdown15').css({
				'position': 'absolute'
			});
		}
	},*/

	reInitAddThis: function() {
		if (typeof addthis != "undefined") {
			UMP.UMPconsole.log('UMP: ADDTHIS reInitAddThis');

		    addthis.toolbox("#atDiv_UMP_Modal");
		    addthis.counter("#atC_UMP_Modal");

		    addthis_attempts = 4;
			var at=setTimeout(addthis_checkForExpanded,1000);
		}
	},


	
	addRelatedFilesList: function(vidID) {
		if (UMP.embedDataArray[vidID]['related_files'] !== undefined) {
			//alert('related_files: ' + UMP.embedDataArray[vidID]['related_files'] );
			relatedHTML = "<ul><li>Related Files:<ul>" + UMP.embedDataArray[vidID]['related_files'] + "</ul></li></ul>";
			$('#video-left-col .no-chapter').append(relatedHTML);
		}	
	},
	
	advertisementAction: function(vidID) {
		alert('do banner action for vidID: ' + vidID);	
	},
	
	pauseHero: function() {
		//Presses the pause button on the hero for hero videos
		$('#hero-btns .on').click();
	}
	
}