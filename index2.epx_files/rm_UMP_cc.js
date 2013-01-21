/*
This is CC (Closed Captioning) routines JS file for the Universal Media Player
/global/ui/richmedia/js/projects/rm_UMP/rm_UMP_cc.js
Version: 03.21.11 - VS
*/

/*
Rich Media JavaScript: 
Rich Media CC routines for the UMP

Created:	02.04.11 - VS
Last Edit: 
02.21.11	-	made the CC's function. There's probably going to be an issue when the CC's don't have for the time.
02.23.11	-	made the CC button the controls work
			- 	added the no controls/swf player code
03.21.11	-	tweaked Dave's .load function to check for time or timecode.


Description:
Display the Closed Captioning (CC) of a video

*/


var UMPcc = {
	
	tempVar: 0,
	
	init: function(vidID) {
		//Get Required Scripts and CSS
		/*require(["/global/js/rm_platform2/utils/swfobject.js"], function() {																																								
			//JS finished loading. Load CSS
			//rmGetCSS.load_CSS("/global/css/sap_flash_css.css");
			
			//All Done, perform stuff...
		});*/
		
	},
	
	showCC: function(vidID) {
		
		if (!$('#' + vidID + '_cc').html()) {
			
			theHTML = "";
			
			//This is the part that needs to be dynamic. will need to get the current time and parse out the proper sentence.
			ccHTML = "";
			
			theHTML += '<div id="' + vidID + '_cc">';
			theHTML += '<div id="theccbg" class="UMP_CTA_BG">&nbsp;</div>';
			theHTML += '<div id="thecc" class="UMP_CC_thecc"><span class="UMP_CC_span">';
			theHTML += ccHTML;
			theHTML += '</span></div></div>';
			
			h = 70;
			w = $('#' +  vidID + '_videoDiv').width();
			t = h * -1;
			
			//if no controls then remove 29 pixels (why 29, beats me... gonna have to solve that one.)
			//This generally only happens if it's the SWF player
			if ($("#" + vidID + "_controlsDiv").html() === null) {
				t = t -29;
			}
			
			$('#' +  vidID + '_videoDiv').append(theHTML);
			
			$('#' + vidID + '_cc').css({'z-index' : '2000', 'position' : 'relative', 'top' : t + 'px',  'width' : w + 'px', 'height' : h + 'px', 'overflow' : 'hidden'});
			$('#' + vidID + '_cc #theccbg').css({'z-index' : '2002', 'position' : 'absolute', 'width' : w + 'px', 'height' : h + 'px'});
			$('#' + vidID + '_cc #thecc').css({'z-index' : '2003', 'position' : 'absolute'});
			
			
			//UMP.UMPconsole.log('UMP DEBUG: (CC) ' + theHTML);
			
			
			$("#ump_controller").bind("interval_event.ccs", function(e, vidID, myValue){
				if (UMP.embedDataArray[vidID]) {
					thisIsTheCC = UMPcc.getTheCC(vidID);
					$('#' + vidID + '_cc').find('.UMP_CC_span').html(thisIsTheCC);
				}
			});
			
		} else {
			
			//CC div is already open...
			UMP.UMPconsole.log('UMP: CCs for ' + vidID + ' already built.');
			
		}
		
	},
	
	
	
	getTheCC: function(vidID) {
		
		var cT = UMP.embedDataArray[vidID]['currenttime'];
		var checking = true;
		var theCC = 0;
		while (checking) {
			var ccTime = UMP.embedDataArray[vidID]['ccTime'][theCC]; //if ccTime is -1, the time is undefined...
			if (cT > ccTime && ccTime !== -1) {
				theCC++;	
			} else {
				checking = false;	
			}
				
		}
		
		theCC--; //It's the one BEFORE the one we're on.
		//UMP.UMPconsole.log('UMP DEBUG: (CCs) ' + cT + ' - ' + ccTime + ' - ' + theCC);
		//UMP.UMPconsole.log('UMP DEBUG: (CCs) ' + UMP.stringToTime(UMP.embedDataArray[vidID]['ccTime'][1]) + ' - ' + cT);
		
		return(UMP.embedDataArray[vidID]['cc'][theCC]);
			
	},
	
	
	removeCC: function(vidID) {	
		$('#' + vidID + '_cc').remove();
		UMP.UMPconsole.log('UMP: CCs removed from ' + vidID);
		$("#ump_controller").unbind("interval_event.ccs");
		
	}, 
	
	
	loadCCs: function(vidID, uthis) {
		if (!UMP.embedDataArray[vidID]['cc']) {
			UMP.embedDataArray[vidID]['cc'] = new Array();
			UMP.embedDataArray[vidID]['ccTime'] = new Array();
			UMP.embedDataArray[vidID]['ccData'] = $(uthis).html();
		}
		

		
		
		var tottime = 0;
		$(uthis).find('li').each(function(idx) {
			
		//Check if it's old style time codes.
		var newOrOld = $(this).attr('timecode');

			// For some browsers, `attr` is undefined; for others,
			// `attr` is false.  Check for both.
			if (typeof newOrOld !== 'undefined' && newOrOld !== false) {
				timecode = $(this).attr('timecode');
				theText = $(this).html();
				UMP.embedDataArray[vidID]['cc'][idx] = theText;
				UMP.embedDataArray[vidID]['ccTime'][idx] = UMP.stringToTime(timecode);
				//UMP.UMPconsole.log('UMP DEBUG: (CCs) ' + UMP.embedDataArray[vidID]['ccTime'][idx]);
			} else {
				//Get the CCs and Time in the OLD method (reversed times)
				var tehtime = UMP.stringToTime($(this).attr('time'));
				if(idx == 0)
				{
					tottime = tehtime;
				}
				tehtime = tottime - tehtime;
				//UMP.UMPconsole.log('UMP DEBUG: (CCs) ' + idx + ":" + tottime + ":" + tehtime);
				UMP.embedDataArray[vidID]['cc'][idx] = $(this).html();
				UMP.embedDataArray[vidID]['ccTime'][idx] = tehtime;		
				
			}
			
		});
		
		
	}
	

}

