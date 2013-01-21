/*
This is the Video Control Bar routines JS file for the Universal Media Player
/global/ui/richmedia/js/projects/rm_UMP/rm_UMP_controls.js
Version: 10.23.12 - VS
*/

/*
Rich Media JavaScript: 
Rich Media scripts to make and control the video's control bar

Created:	05.12.11 - VS
Last Edit: 
01.18.11 - removed controls HTML
02.07.11 - added skins CSS
02.15.11 - added play/pause and chaptering functionality.
02.16.11 - added fullscreen visible on/off functionality.
02.16.11 - progress load bar.  click now go to invisible progress layer.
02.17.11 - hide chapter button/bar if there's no chaptering.
02.22.11 - tweaked everything. Made Drag work, made set progress width function correctly.
02.23.11 - Made the CC button work (and swap styles)
02.23.11 - mute and unmute - dah
03.01.11 - totally fixed the drag. No seriously. It works good now on all browsers. Had to fill the space with an inivisble gif and add a mouse event to it.
		 - tweaked the getMouseX function that was not working correctly in the webkit browsers
		 - tweaked it again. Have to use offset.left to get the position of the drag div. Should be fixed, probably.
		 - made the CC button not open CC div if there's no CCs defined.
03.02.11 - added preview video code.
		 - added timeStamp code.
03.03.11 - Moved global paths to UMPconfig - dah
03.03.11 - Added support for Safari fullscreen - dah
03.04.11 - Check status of inDrag flag before seeking in stopDrag - dah
		 - made the timestamp handle the right edge of the screen - vs
		 - removed fullscreen button in Chrome - VL
03.07.11 - fixed preview time - vs
03.08.11 - tweaked the timestamp with chaptering (was missing chaptering width)
03.15.11 - added removeCTRLbinds() to fix IE vs. FLASH
04.04.11 - tweaked preview text CSS - VS
04.07.11 - added preview register button thing. - vs
04.08.11 - IE fix for register button - vs
05.12.11 - added dynamic preview BUTTON text - vs
05.17.12 - adjusted the $('#' + vidID + '_prev #buttons p').cssto account for VML cascading styles...
10.22.12 - new Preview mode: Full for T&T

Description:

*/



var UMPcontrols = {
	
	controlsHTML: '',
	inDrag: false,
	inDragV: false,
	playButtonWidth: 10,
	volumeButtonWidth: 10,
	chapterButtonWidth: 10,
	areDisabled: false,
	
	
	init: function(vidID) {
		
		rmGetCSS.load_CSS(UMPconfig.cssFileLocation + "UMP/skins/ump_default_skin.css");
		
		//Leave this blank or commented out if not needed...		
		
		//Get Required Scripts and CSS
		//require(["/global/js/rm_platform/utils/swfobject.js"], function() {																																									
				//JS finished loading. Load CSS
				//rmGetCSS.load_CSS("/global/css/sap_flash_css.css");
				
				//All Done, perform stuff...
		//});
		//Bind Events:
		$("#ump_controller").bind("play_event.CTRL", function(e, vidID, myValue){
			//Play Video: vidID
			$("#pause").show();
			$("#play").hide();
		});
		
		$("#ump_controller").bind("pause_event.CTRL", function(e, vidID, myValue){
			//Pause Video: vidID
			$("#pause").hide();
			$("#play").show();
		});
		
		$("#ump_controller").bind("mute_event.CTRL", function(e, vidID, myValue){
			$("#unmute").show();
			$("#mute").hide();
		});
		
		$("#ump_controller").bind("unmute_event.CTRL", function(e, vidID, myValue){
			$("#mute").show();
			$("#unmute").hide();
		});
		
		
		$("#ump_controller").bind("hoverOver_event.CTRL", function(e, vidID, myValue){
			//UMP.UMPconsole.log('UMP: hovering: ' + vidID);
			$('#timeStamp').show();
		});
		
		$("#ump_controller").bind("hoverOut_event.CTRL", function(e, vidID, myValue){
			//UMP.UMPconsole.log('UMP: HOVER OUT: ' + vidID);
			$('#timeStamp').hide();
		});


		$("#ump_controller").bind("interval_event.CTRL", function(e, vidID, myValue){
			//This is the global interval event.
			
			//do actions based on current video time
			//UMP.embedDataArray[vidID]['totaltime'];
			//UMP.embedDataArray[vidID]['currenttime'];
			if ( UMP.embedDataArray[vidID]) {
				var tmprat = UMP.embedDataArray[vidID]['currenttime'] / UMP.embedDataArray[vidID]['totaltime'];
				if(tmprat > 0)
				{
					
					if (UMP.embedDataArray[vidID]['preview']['enabled']) {
						//UMP.UMPconsole.log("UMP: " + parseInt(tmprat * 100) + " - " + UMP.stringToTime(UMP.embedDataArray[vidID]['preview']['time']));
						//UMP.UMPconsole.log(UMP.stringToTime(UMP.embedDataArray[vidID]['currenttime']) );
						if (parseInt(UMP.embedDataArray[vidID]['currenttime']) > UMP.stringToTime(UMP.embedDataArray[vidID]['preview']['time'])) {
							
							//UMP.UMPconsole.log('UMP: previewFound. Stop Video: ' + vidID);
							if (!UMPcontrols.areDisabled) {
								UMP.pauseVideo(vidID);
								UMPcontrols.disable(vidID);
								UMP.disableRollover(vidID);
								
								//This seems to go too far back?
								//UMP.seekTo(vidID, UMP.embedDataArray[vidID]['preview']['time']);
								UMPcontrols.displayPreviewMessage(vidID);
								
							}
							
						}
					}
					
					var tmpx = $('#progressbg').width() * tmprat;
					$('#progress').width(tmpx);
					
					if(UMPcontrols.inDrag == false)
					{
						$('#scrubber').css({'left': (tmpx - 4) + "px"});
						UMPcontrols.moveTimeStamp(vidID, UMP.timeToString(UMP.embedDataArray[vidID]['currenttime']), UMP.timeToString(UMP.embedDataArray[vidID]['totaltime']));
					}				
					
				}
				
				if (UMP.embedDataArray[vidID]['chapters']) {
					
					chapterIndex = UMPchaptering.getCurrentChapterText(vidID);
					chapterName = UMP.embedDataArray[vidID]['chapters'][chapterIndex];
	
					$("#" + vidID + "_controlsDiv #ump_controls").find('h3').html(chapterName);
					
					theText = $("#" + vidID + "_controlsDiv #ump_controls").find('h3').text();
					//UMP.UMPconsole.log('UMP: chapterName - ' + theText.length);
					
					//Check the length, if it's too long, make it shorter and add ... to the end.
					if (theText.length > 25) {
						theText = theText.substr(0, 23) + "...";	
						$("#" + vidID + "_controlsDiv #ump_controls").find('h3').html(theText);
					}
					
				}
			
			}
			
		});
		
	},
		
	seekTo: function(e) {
		
		if(UMPcontrols.inDrag == true)
		{
			
			UMPcontrols.seekToScrub();
			UMPcontrols.inDrag = false;
		}
	},
	
	seekToScrub: function() {
		//var p = $("#scrubber").position().left / $('#progressbg').width();
		var p = parseInt($("#scrubber").css("left")) / $('#progressbg').width();
		x = $('#progressbg').width() * p;
		$('#progress').animate({ width: x }, 1 );
		$('#scrubber').animate({ left: (x - 4) + "px"}, 1);
		var stm = UMP.timeToString(UMP.embedDataArray[vidID]['totaltime'] * p) ;

		UMP.seekTo(vidID, stm);
	},
	
	clickPlay: function(e) {
		UMP.playVideo(vidID);
	}, 
	
	clickPause: function(e) {
		UMP.pauseVideo(vidID);
	}, 
	
	fullscreen: function(e) {
		UMP.fullscreenVideo(vidID);
	}, 
	
	clickCC: function(e) {
		UMPcontrols.toggleCCs(vidID);
	},
	
	clickMute: function(e) {
		UMP.mute(vidID);
	},
	
	clickUnmute: function(e) {
		UMP.unmute(vidID);
	},
	
	hoverSound: function(e) {
		$('#volumebar').show();
	},
	
	unhoverSound: function(e) {
		$('#volumebar').hide();
	},
	
	getvolumescrubpos: function(e, y) {
		var ret = (y - ($("#volumescrub").height() / 2));
		ret = Math.max(ret, 0);
		ret = Math.min(ret, $('#volumeclick').height() - 15);
		//UMP.UMPconsole.log('y = ' + ret);
		return ret + "px";
	},
	
	clickVolume: function(e) {
		var y = UMPcontrols.getMouseY('volumeclick', e);
		$("#volumescrub").css({"top" : UMPcontrols.getvolumescrubpos(e, y)});
		y = $('#volumeclick').height() - y;
		y = y / $('#volumeclick').height();
		UMP.volume(vidID, y);
	},
	
	startDragV: function(event) {
		//UMP.UMPconsole.log('UMP: startDragV - volume?');
		$("body").mousemove(function(e){
			//var clientCoords = "( " + e.clientX + ", " + e.clientY + " )";

			UMPcontrols.inDragV = true;
			var y = UMPcontrols.getMouseY('volumeclick', e);
			$("#volumescrub").css({"top" : UMPcontrols.getvolumescrubpos(e, y)});
		});
		
		$('body').mouseup(function(e){
		 	UMPcontrols.stopDragV();
		});
		
		$('body').mouseout(function(e){
		 	UMPcontrols.stopDragV();
		});

	},
	
	stopDragV: function() {
		//UMP.UMPconsole.log('UMP: stopDrag - mouse up on body');
		$('body').unbind('mouseup');
		$('body').unbind('mouseout');
		$('body').unbind('mousemove');
		UMPcontrols.seekTo('no-event');

	},
	
	getMouseX: function(thing, e)
	{
		return (e.offsetX == undefined) ? (e.pageX - $('#' + thing).offset().left) : e.offsetX;
	},
	
	getMouseY: function(thing, e)
	{
		return (e.offsetY == undefined) ? (e.pageY - $('#' + thing).offset().top) : e.offsetY;
	},

	makeControlsHTML: function(vidID) {
		
		controlsHTML = "";
		controlsHTML += '<div id="ump_controls">';
		
		controlsHTML += '<div class="playPause">';
		controlsHTML += '<div id="play" class="play" onclick="javascript:UMPcontrols.clickPlay(event);"></div>';
	    controlsHTML += '<div id="pause" class="pause" onclick="javascript:UMPcontrols.clickPause(event);"></div>';
		controlsHTML += '</div>';
		
		if (rmBrowser.OS === 'iPad') {
			controlsHTML += '<div class="volume">';
			controlsHTML += '<div id="novol" class="novol"></div>';
			controlsHTML += '</div>';
		}
		else
		{
			controlsHTML += '<div class="volume" onmouseover="javascript:UMPcontrols.hoverSound(event);"';
			controlsHTML += ' onmouseover="javascript:UMPcontrols.hoverSound(event);"';
			controlsHTML += ' onmouseout="javascript:UMPcontrols.unhoverSound(event);">';
			controlsHTML += '<div id="mute" class="mute" onclick="javascript:UMPcontrols.clickMute(event);"></div>';
			controlsHTML += '<div id="unmute" class="unmute" onclick="javascript:UMPcontrols.clickUnmute(event);"></div>';
			
			controlsHTML += '<div id="volumeclick" class="volumeclick" onmousedown="UMPcontrols.startDragV(event);" onclick="UMPcontrols.clickVolume(event);"><img src="' + UMPconfig.imageFileLocation + 'UMP/spacer.gif" width="1"/></div>'; //Invisible Click Space
			controlsHTML += '<div id="volumebar" class="volumebar">';
			controlsHTML += '<div id="volumescrub" class="volumescrub"></div>'; //Scrub Bar only
			controlsHTML += '</div></div>';
		}
		
		if (UMP.embedDataArray[vidID]['chapters']) {
			//If Chapters, then put the chapter bar
			controlsHTML += '<div class="chapterInclusion"><div id="cTitle"><h3>Part 1: Introduction</h3></div><div class="cButton_down">&nbsp;</div></div>';
		}
		
		
		if (rmBrowser.Name === 'Opera' || rmBrowser.Name === 'Safari') {
			controlsHTML += '<div id="fullscreen" class="fullscreen" onclick="javascript:UMPcontrols.fullscreen(event);">' + '</div>';
		}
		
		controlsHTML += '<div id="ccButton" class="closedcaption" onclick="javascript:UMPcontrols.clickCC(event);">' + '</div>';
		
		controlsHTML += '<div id="progressbg" class="progressbg">';
		
		controlsHTML += '<div id="progress" class="progress"></div>'; //Yellow Bar
		//controlsHTML += '<div id="progressclick" class="progressclick" onmousedown="UMPcontrols.startDrag(event);" onclick="UMPcontrols.clickSeek(event);"><img src="/global/ui/richmedia/images/UMP/solid_blue.gif" width="400" onmousedown="return false;"/></div>'; //Invisible Click Space
		controlsHTML += '<div id="progressclick" class="progressclick" onmousedown="UMPcontrols.startDrag(event, this);" onclick="UMPcontrols.clickSeek(event, this);"><img src="' + UMPconfig.imageFileLocation + 'UMP/spacer.gif" width="400" onmousedown="if (event.preventDefault) event.preventDefault();"/></div>'; //Invisible Click Space
				controlsHTML += '<div id="scrubber" class="scrubber" onmousedown="if (event.preventDefault) event.preventDefault();">' + '</div>'; //Scrub Bar only
		controlsHTML += '<div id="progressload" class="progressload"></div>'; //Solid colored bar to tween width to make load progress
		
		controlsHTML += '</div>';	//progressbg*/
		
		controlsHTML += '</div>';	//ump_controls		
		
		
		//UMP.UMPconsole.log('UMP: controlsHTML: ' + controlsHTML);
		
	
		return(controlsHTML);
		
	},

	startDrag: function(e, theObj) {
		//UMP.UMPconsole.log('UMP: startDrag - mouse move on body');
		$("body").mousemove(function(e){
			//var clientCoords = "( " + e.clientX + ", " + e.clientY + " )";

			UMPcontrols.inDrag = true;
			//var x = UMPcontrols.getMouseX('progressbg', e); //This is wonky in Chrome returns a vaule of 1 for every other pixel position
			//var x = e.pageX - UMPcontrols.playButtonWidth - UMPcontrols.volumeButtonWidth - UMPcontrols.chapterButtonWidth - 6; //-6 should be half the width of the dragger
			var offset = $(theObj).offset();
			var x = e.pageX - offset.left;
			
			$("#scrubber").css({"left" : x + "px"});	
			
			//Get the timeStamp Drag time....
			var p = parseInt($("#scrubber").css("left")) / $('#progressbg').width();
			x = $('#progressbg').width() * p;
			var stm = UMP.timeToString(UMP.embedDataArray[vidID]['totaltime'] * p) ;			
			UMPcontrols.moveTimeStamp(vidID, stm, UMP.timeToString(UMP.embedDataArray[vidID]['totaltime']));
					
			//UMP.UMPconsole.log('UMP: clientCoords: ' + x);
		});
		
		$('body').mouseup(function(e){
			//UMP.UMPconsole.log('up!');
		 	UMPcontrols.stopDrag();
		});
		
		/*$('body').mouseout(function(e){
			//UMP.UMPconsole.log('out!');
		 	UMPcontrols.stopDrag();
		});*/
	},
	
	stopDrag: function() {
		//UMP.UMPconsole.log('UMP: stopDrag - mouse up on body');
		$('body').unbind('mouseup');
		$('body').unbind('mouseout');
		$('body').unbind('mousemove');
		//UMPcontrols.seekTo('no-event');
		//UMPcontrols.clickSeek('no-event');
		if(UMPcontrols.inDrag)
		{
			UMPcontrols.seekToScrub();
		}
		UMPcontrols.inDrag = false;
	},
	
	clickSeek: function(e, theObj) {
		//var x = UMPcontrols.getMouseX('progressbg', e);
		//var x = e.pageX - UMPcontrols.playButtonWidth - UMPcontrols.volumeButtonWidth - UMPcontrols.chapterButtonWidth - 6; //-6 should be half the width of the dragger
		//UMP.UMPconsole.log('UMP: clickSeek!!!!: ' + x);
		
		var offset = $(theObj).offset();
		var x = e.pageX - offset.left;
		
		$("#scrubber").css({"left" : x + "px"});
		UMPcontrols.seekToScrub();
		UMPcontrols.inDrag = false;
	},
	
	getMyVidID: function(obj) {
		vidID = $(obj).parent().parent().parent().attr('id');
		return(vidID);
	},
		
	
	toggleChap: function(openOrClose) {
		if (openOrClose === 'open') {
			$('.cButton_down').toggleClass('cButton_down').toggleClass('cButton_up');
			$('.chapterInclusion').css({'background-color' : '#222222'});
		} else {
			$('.cButton_up').toggleClass('cButton_up').toggleClass('cButton_down');
			$('.chapterInclusion').css({'background-color' : '#555555'});
		}
	}, 
	
	
	setProgressWidth: function(vidID) {
		
		// calculate progress bar width	
		
		tW = parseInt(UMP.embedDataArray[vidID]['width']);
		UMPcontrols.playButtonWidth = pW = parseInt($("#" + vidID + "_controlsDiv").find(".playPause").width());
		UMPcontrols.volumeButtonWidth = vW = parseInt($("#" + vidID + "_controlsDiv").find(".volume").width());
		ccW = parseInt($("#" + vidID + "_controlsDiv").find(".closedcaption").width());
		fsW = ($("#" + vidID + "_controlsDiv").find(".fullscreen").is(":visible")) ? parseInt($("#" + vidID + "_controlsDiv").find(".fullscreen").width()) : 0;
		UMPcontrols.chapterButtonWidth = cptW = (parseInt($("#" + vidID + "_controlsDiv").find(".chapterInclusion").width())) ? parseInt($("#" + vidID + "_controlsDiv").find(".chapterInclusion").width()) : 0;
		
		newWidth = tW - (pW + vW + ccW + fsW + cptW);
		
		//UMP.UMPconsole.log('UMP: setProgressWidth tW - ' + tW);
		//UMP.UMPconsole.log('UMP: setProgressWidth pW - ' + pW);
		//UMP.UMPconsole.log('UMP: setProgressWidth vW - ' + vW);
		//UMP.UMPconsole.log('UMP: setProgressWidth ccW - ' + ccW);
		//UMP.UMPconsole.log('UMP: setProgressWidth fsW - ' + fsW);
		//UMP.UMPconsole.log('UMP: setProgressWidth cptW - ' + cptW);
		
		UMP.UMPconsole.log('UMP: setProgressWidth newWidth - ' + newWidth);
		
		if (newWidth < 0) {
			//reset
			setTimeout('UMPcontrols.setProgressWidth("' + vidID + '")', 500);
			
		} else {
			
			$('.progressbg').width(newWidth);
			$('.progressload').width(newWidth);
			$('.progressclick').width(newWidth);
			$('.progressclick img').width(newWidth);
			
			
			//This needs to be moved somewhere else:
			$("#pause").show();
			$("#play").hide();
			
			
			UMP.postControlsPlacement(vidID);
		}
	},
	
	
	toggleCCs: function(vidID) {
		UMP.UMPconsole.log('UMP: toggleCCs - ' + vidID);
		if (UMP.embedDataArray[vidID]['cc']) {
			if (UMP.embedDataArray[vidID]['ccsOpen']) {
				//CCs are open. Close them:
				UMP.removeCC(vidID);
				UMP.embedDataArray[vidID]['ccsOpen'] = false;
				$('.closedCaptionOn').toggleClass('closedCaptionOn').toggleClass('closedcaption');
			} else {
				//CCs are closed, open them.
				UMP.showCC(vidID);
				UMP.embedDataArray[vidID]['ccsOpen'] = true;
				$('.closedcaption').toggleClass('closedcaption').toggleClass('closedCaptionOn');
				
			}
		} else {
			//CC's not defined
			UMP.UMPconsole.log("UMP *ERROR*: Closed Captions Button Pressed, but no CC's defined");
		}
	},
	
	disable: function(vidID) {
		if (!UMPcontrols.areDisabled) {
			UMP.UMPconsole.log('UMP: disable controls - ' + vidID);
			
			var blockerHTML = '<div id="disabler" style="left:0px; top:0px; height:20px; position:relative; z-index: 434343; background-color: #55FF00; margin-bottom: -20px; opacity:0.0;">&nbsp;</div>';
			$("#" + vidID + "_controlsDiv #ump_controls").prepend(blockerHTML);
			
			UMPcontrols.areDisabled = true;
		}
	},
	
	enable: function(vidID) {
		if (UMPcontrols.areDisabled) {
			$("#" + vidID + "_controlsDiv #ump_controls #disabler").remove();
			UMPcontrols.removePreviewMessage(vidID);
			UMPcontrols.areDisabled = false;
			UMP.playVideo(vidID);
		}
	},
	
	displayPreviewMessage: function(vidID) {
		theHTML = "";
		//This is the part that needs to be dynamic. will need to get the current time and parse out the proper sentence.
		ccHTML = UMP.embedDataArray[vidID]['preview']['text'];
		if (UMP.embedDataArray[vidID]['preview']['button']) {
			bText = UMP.embedDataArray[vidID]['preview']['button'];
		} else {
			bText = 'Begin Registration';
		}
		
		previewTitle = UMP.embedDataArray[vidID]['preview']['title'];
		previewBullets = UMP.embedDataArray[vidID]['preview']['bullets'];
		
		
		
		theHTML += '<div id="' + vidID + '_prev">';
		theHTML += '<div id="theprevBG" class="UMP_CTA_BG">&nbsp;</div>';
		if (typeof previewTitle !== 'undefined') {
			theHTML += '<div id="prevText" class="UMP_Prev_Full_Div">';

			theHTML += '<div class="UMP_Prev_Title">';
			theHTML += previewTitle;
			theHTML += '</div>';

			theHTML += '<span class="UMP_Prev_Text">';
			theHTML += ccHTML;
			theHTML += '</span>';

			theHTML += '<div class="UMP_Prev_Bullets">';
			theHTML += previewBullets;
			theHTML += '</div>';

			theHTML += '<div class="buttons" id="buttons"><p class="UMP_Prev_But_P"><span>'+bText+'</span></p></div>';
			theHTML += '</div>';

		} else {

			theHTML += '<div id="prevText" class="UMP_Prev_Text_Div">';
			theHTML += '<div class="UMP_Prev_Text">';
			theHTML += ccHTML;
			theHTML += '</div>';
			theHTML += '<div class="buttons" id="buttons"><p class="UMP_Prev_But_P"><span>'+bText+'</span></p></div>';
			theHTML += '</div>';

		}

		
		theHTML += '</div>';
		
		
		var h;
		var w;
		
		
		if (typeof previewTitle !== 'undefined') {
			/* new preview mode - full height */
			h = $('#' +  vidID + '_videoDiv').height();
			w = $('#' +  vidID + '_videoDiv').width();
			var textW = w - 30;
			t = 0;	
			$('#' +  vidID + '_videoDiv').prepend(theHTML);
			$('#' + vidID + '_prev').css({'z-index' : '10', 'top' : t + 'px',  'width' : w + 'px', 'height' : h + 'px', 'position' : 'relative', 'overflow' : 'hidden', 'cursor' : 'pointer', 'margin-bottom' : '-' + h + 'px'});
			$('#' + vidID + '_prev #prevText').css({'position' : 'absolute', 'z-index' : '5', 'width' : textW + 'px'});
			var newHeight = (h / 2) - ($('#' + vidID + '_prev #prevText').height() / 2);
			$('#' + vidID + '_prev #prevText').css({'top' : newHeight + 'px'});

		} else {
			h = 150;
			w = $('#' +  vidID + '_videoDiv').width();
			t = h * -1;	
			$('#' +  vidID + '_videoDiv').append(theHTML);
			$('#' + vidID + '_prev').css({'z-index' : '10', 'top' : t + 'px',  'width' : w + 'px', 'height' : h + 'px', 'position' : 'relative', 'overflow' : 'hidden', 'cursor' : 'pointer'});
			$('#' + vidID + '_prev #prevText').css({'position' : 'absolute', 'z-index' : '5', 'width' : w + 'px', 'padding-top' : '16px'});



			/*$('#' + vidID + '_prev #prevText').css({'display' : 'table-cell', 'vertical-align' : 'middle'});
			$('#' + vidID + '_prev #buttons').css({'position' : 'relative', 'display' : 'inline-block', 'margin' : '15px auto'});*/

			theW = $('#' + vidID + '_prev #buttons p').width() + 38;
			$('#' + vidID + '_prev #buttons').css({'display' : 'inline-block', 'margin' : '15px auto', 'width' : theW + 'px'});
			

			/*theW = $('#' + vidID + '_prev #buttons span').width() + 20;
			$('#' + vidID + '_prev #buttons').css({'text-align' : 'center', 'position' : 'relative', 'margin' : '5px auto 0 auto', 'width' : theW + 'px', 'height' : '30px', 'cursor' : 'pointer', 'font' : 'bold'});	
*/

		}
		
		
		$('#' + vidID + '_prev #theprevBG').css({'width' : w + 'px', 'height' : h + 'px', 'position' : 'absolute', 'z-index' : '3'});
		/*$('#' + vidID + '_prev #buttons p').css({'float':'left', 'margin' : '', 'padding' : '0 0 0 10px', 'background' : 'url(/global/ui/richmedia/images/UMP/skins/default/btn_yellow_left.png) no-repeat', 'color' : '#FFFFFF', 'text-align' : 'left', 'width' : 'auto'});
		$('#' + vidID + '_prev #buttons span').css({'float':'right', 'padding' : '8px 10px 0 0', 'height' : '22px', 'background' : 'url(/global/ui/richmedia/images/UMP/skins/default/btn_yellow_right.png) top right no-repeat'});
		
		*/
		
		
		$('#' + vidID + '_prev').click(function() {
			//20110406 - RLC - Moved into the click action.
			//But they don't need this to be tracked.vidSrc = UMP.embedDataArray[vidID]['source-mp4'];
/* 			if (!vidSrc) {
				vidSrc = UMP.embedDataArray[vidID]['source-rtmp'];
			}
 */			// UMP.trackThis(vidSrc, "registrationRequired", "someData");
			theAction = UMP.embedDataArray[vidID]['preview']['link'];
			eval(theAction);
		});
		
		//you might be asking why is this here? It's to prevent the preview text from being selected when the user just clicks on the srubbar.
		document.getSelection().removeAllRanges();

		

	},
	
	removePreviewMessage: function(vidID) {
		$("#" + vidID + "_videoDiv #" + vidID + "_prev").remove();
	},
	
	makeTimeDiv: function(vidID) {
		newDIVhtml = '<div id="timeStamp" class="timeStamp_BG">';
		newDIVhtml += '<div class="times"><span id="ts_current">00:00</span> / <span id="ts_total">00:00</span></div>';
		newDIVhtml += '</div>';	
		$('#' +  vidID + '_videoDiv').prepend(newDIVhtml);
		$('#timeStamp').hide();
		t = $('#' +  vidID + '_videoDiv').height() - 30;
		$('#timeStamp').css({'z-index' : '5000', 'position' : 'relative', 'top' : t + 'px', 'left' : '10px', 'width' : '90px', 'height' : '32px', 'margin-bottom' : '-33px'});
		UMP.UMPconsole.log('UMP: makeTimeDiv: ' + vidID);
	},
	
	moveTimeStamp: function(vidID, ct, tt) {
		theX = parseFloat($("#" + vidID + "_controlsDiv").find("#scrubber").css('left')) + UMPcontrols.chapterButtonWidth;
		if (theX > ($("#" + vidID + "_controlsDiv #progressbg").width()+ UMPcontrols.chapterButtonWidth) - 50) {
			//If it's close to the right edge, flip it and move it back a bit...
			theX-= 59;
			$('#timeStamp .times').toggleClass('times').toggleClass('timesalt');
		} else {
			$('#timeStamp .timesalt').toggleClass('timesalt').toggleClass('times');
		}
		$('#timeStamp').css({'left': (theX + 42) + "px"}); //+42 for moving it to the arrow
		$('#timeStamp #ts_current').html(ct);
		$('#timeStamp #ts_total').html(tt);

	},
	
	removeCTRLbinds: function(vidID) {
		$("#ump_controller").unbind("play_event.CTRL");
		$("#ump_controller").unbind("pause_event.CTRL");
		$("#ump_controller").unbind("mute_event.CTRL");
		$("#ump_controller").unbind("unmute_event.CTRL");		
		$("#ump_controller").unbind("hoverOver_event.CTRL");
		$("#ump_controller").unbind("hoverOut_event.CTRL");
		$("#ump_controller").unbind("interval_event.CTRL");	
		
	}
		
	
}