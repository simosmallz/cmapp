/*
This is the On Rollover (Buttons) routines JS file for the Universal Media Player
/global/js/rm_platform/projects/UMP/rm_UMP_rollover.js
Version: 03.09.11
*/

/*
Rich Media JavaScript: 
Rich Media On Rollover routines for the UMP

Created:	02.25.11 - VL
Last Edit: 
03.02.11 - removed the timestamp from this - it's now in the controls.js
03.03.11 - removed the on hover actions for the buttons from this - it's now in the rm_UMP.js (rm_UMP.js) - VL
03.04.11 - Adjust and set the top positioning correctly - VL
03.07.11 - swapped 'video_one' for [me] in the hover functions (was always calling video_one even if the div was named differently. - VS
03.09.11 - switched the .APPEND to .PREPEND - to solve for a mysterious 3 pixel discrepincy with the VML site (a conflict with their CSS, perhaps?)
		 - plus you don't have to worry about the CC div. It's margins are always a negative height

Description:
Display the modal grey box and Share/Recommend buttons on rollover of video.

*/


var UMPbuttons = {
	
	tempVar: 0,
	
	init: function(vidID) {
		//Get Required Scripts and CSS
		/*require(["/global/js/rm_platform2/utils/swfobject.js"], function() {																																								
			//JS finished loading. Load CSS
			//rmGetCSS.load_CSS("/global/css/sap_flash_css.css");
			
			//All Done, perform stuff...
		});*/
		
	},
	
	showButtons: function(vidID) {
		
		if (!$('#' + vidID + '_rollover').html()) {
		
			theHTML = "";
			ctaHTML = UMP.embedDataArray[vidID]['buttons']
			
			
			theHTML += '<div id="' + vidID + '_rollover" class="UMP_Buttons">';
			theHTML += '<div id="theoverlaybg" class="UMP_Buttons_BG">&nbsp;</div>';
			theHTML += '<div id="thebuttons">';
			theHTML += '<div class="recommend">&nbsp;</div>';
			theHTML += '<div class="share">&nbsp;</div>';

			theHTML += '</div>'; //thebuttons
			theHTML += '</div>'; //UMP_Buttons
			
			h = $('#' +  vidID + '_videoDiv').height();
			w = $('#' +  vidID + '_videoDiv').width();
			t = h * -1; //The top is the negative of the height of the video
			//newt = t + (-70);
			
			//$('#' +  vidID + '_videoDiv').append(theHTML); //03.09.11
			$('#' +  vidID + '_videoDiv').prepend(theHTML);
			
			$('#' + vidID + '_rollover').css({'z-index' : '1000', 'position' : 'relative', 'overflow' : 'hidden', 'width' : w + 'px', 'height' : h + 'px', 'margin-bottom' : t + 'px'});
			$('#' + vidID + '_rollover #theoverlaybg').css({'z-index' : '1002', 'position' : 'absolute', 'width' : w + 'px', 'height' : h + 'px'});
			$('#' + vidID + '_rollover #thebuttons').css({'z-index' : '1003', 'position' : 'absolute', 'width' : w + 'px', 'height' : h + 'px'});
			
			//Adjust and set the top positioning correctly
			/*if (UMP.embedDataArray[vidID]['ccsOpen']) {
				$('#' + vidID + '_rollover').css({'top' : newt + 'px'});
			} else {
				$('#' + vidID + '_rollover').css({'top' : t + 'px'});
			}*/

			
			//UMP.UMPconsole.log('UMP DEBUG: (buttons) ' + theHTML);

		
		} else {
			
			//Button div is open already - do nothing...
			//UMP.UMPconsole.log('UMP: Buttons for ' + vidID + ' is already built.');
		}
	},
	
	
	removeButtons: function(vidID) {
		$('#' + vidID + '_rollover').remove();
		//UMP.UMPconsole.log('UMP: Buttons removed from ' + vidID);
	},
	

	onHoverOver: function(me) {
		//thisVidID = $(me).parent().parent().attr('id'); //returns something like video_one_chapters
		//thisVidID = thisVidID.substr(0,thisVidID.length - 9); // -9 to remove '_chapters'
		UMP.showButtons(me);
	},
	
	onHoverOut: function (me) {
		UMP.removeButtons(me);
	}
	
	
}