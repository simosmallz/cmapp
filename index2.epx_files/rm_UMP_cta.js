/*
Rich Media JavaScript: 
Rich Media CTA routines for the UMP
Version: 05.09.12

Created:	02.04.11 - VS
Last Edit: 
03.03.11 - added CTA content to the div - VL
03.04.11 - made text dynamic (or default to 'play again?') - centered button - vs
03.09.11 - adjust and set the top positioning correctly - VL
03.10.11 - adjust and set the top positioning correctly for the flash player - VL
 		 - set dynamic CTA image (and centered)- VL
03.16.11 - adjusted CTA button width and height (was failing in IE and SWFs) - VS
04.07.11 - fancied the CTA - VS
06.07.11 - added replay call to trackThis (on clickRePlay function.) - VS
03.13.12 - adjusted the CTA layers from z-index 3000 to 300 - vs
04.16.12 - added UMP.embedDataArray[vidID]['CTA_MAP'] to display RIP on HTML CTA.
05.03.12 - flipped if cta_image else cta_replay_text
05.09.12 - added $('area').hover() to make sure the 'finger'/pointer cursor shows up in IE for RIP Image Map CTA's

Description:
Display the call to action (CTA) that happens at the end of the videos

*/


var UMPcta = {
	
	replayText: 'Play Again?',
	
	init: function(vidID) {
		//Get Required Scripts and CSS
		/*require(["/global/js/rm_platform2/utils/swfobject.js"], function() {																																								
			//JS finished loading. Load CSS
			//rmGetCSS.load_CSS("/global/css/sap_flash_css.css");
			
			//All Done, perform stuff...
		});*/
		
	},
	
	showCTA: function(vidID) {
		
		// if cta_image exist, overwrite with image
		if (UMP.embedDataArray[vidID]['cta_image']) {
			UMPcta.replayText = UMP.embedDataArray[vidID]['cta_image'];
		} // if cta_replay_text exist, overwrite with text
		else if (UMP.embedDataArray[vidID]['cta_replay_text']) {
			UMPcta.replayText = UMP.embedDataArray[vidID]['cta_replay_text'];
		}
		
		if (!$('#' + vidID + '_cta').html()) {
		
			theHTML = "";
			//ctaHTML =  "<h1>This is the CTA, that gets placed over at the end of the movie!";
			
			theHTML += '<div id="' + vidID + '_cta" class="UMP_CTA">';
			theHTML += '<div id="thectabg" class="UMP_CTA_BG">&nbsp;</div>';
			theHTML += '<div id="thecta">';
			//theHTML += ctaHTML;
			
			if (UMP.embedDataArray[vidID]['cta_image']) 
			{
				if (UMP.embedDataArray[vidID]['CTA_MAP']) {
					theHTML += '<map name="CTA_MAP">' + UMP.embedDataArray[vidID]['CTA_MAP'] + '</map>';
					//alert('added image map');
				} 
					theHTML += '<div class="image" id="image">' + UMPcta.replayText + '</div>';
			}
			else 
			{
				theHTML += '<div class="buttons" id="buttons"><p class="replay" onclick="javascript:UMPcta.clickRePlay(event);"><span>' + UMPcta.replayText + '</span></p></div>';
			}
			
			theHTML += '</div></div>';
			
			h = $('#' +  vidID + '_videoDiv').height();
			if (UMP.embedDataArray[vidID]['ptype'] === 'SWF' ) {
				//The DIV is 20 pixels smaller
				h -= 20;
			}
			
			w = $('#' +  vidID + '_videoDiv').width();
			t = h * -1; //The top is the negative of the height of the video
			newt = t + (-70); //add the height of the CC layer
			swft = t + (-29); //add the height of player control for swf player
			
			$('#' +  vidID + '_videoDiv').append(theHTML);
			
			if (UMP.embedDataArray[vidID]['CTA_MAP']) {
				$('#' + vidID + '_cta #image').find('img').attr('usemap', '#CTA_MAP');
				$('#' + vidID + '_cta #image').html($('#' + vidID + '_cta #image a').html()); //Remove the A from around teh CTA (since there's CTA rips)
				//$('#' + vidID + '_cta #image').css({'cursor' : 'default'});
			}
			
			
			
			$('#' + vidID + '_cta').css({'z-index' : '300', 'position' : 'relative', 'overflow' : 'hidden', 'width' : w + 'px', 'height' : h + 'px'});
			$('#' + vidID + '_cta #thectabg').css({'z-index' : '302', 'position' : 'absolute', 'width' : w + 'px', 'height' : h + 'px'});
			$('#' + vidID + '_cta #thecta').css({'z-index' : '303', 'position' : 'absolute'});
			
			//Adjust and set the top positioning correctly
			//if the CC layer is shown
			if ($('#' + vidID + '_cc').html()) {
				$('#' + vidID + '_cta').css({'top' : newt + 'px'});
			}
			//if the video player is the SWF player
			else if (UMP.embedDataArray[vidID]['ptype'] === 'SWF' ) {
				$('#' + vidID + '_cta').css({'top' : swft + 'px'});
			}
			//else just position the CTA layer normally
			else {
				$('#' + vidID + '_cta').css({'top' : t + 'px'});
			}
			
			
			//Positioning the Replay button			
			//butWidth = $('#' + vidID + '_cta #buttons').width(); //This returns the entire video width in IE
			butWidth = $('#' + vidID + '_cta #buttons p span').width() + 43; //Just get the width of the text, and add 33 for the left, and 10 for the padding
			butHeight = $('#' + vidID + '_cta #buttons').height();
			lb = (w - butWidth) / 2
			tb = (h - butHeight) / 2
			tbswf = tb + 10;
			
			//if the video player is the SWF player
			if (UMP.embedDataArray[vidID]['ptype'] === 'SWF' ) {
				$('#' + vidID + '_cta #buttons').css({'left' : lb + 'px', 'top' : tbswf + 'px', 'width' : butWidth + 'px'});
			}
			//else just position the button normally
			else {
				$('#' + vidID + '_cta #buttons').css({'left' : lb + 'px', 'top' : tb + 'px'});
			}
			
			
			
			//Positioning the Image
			imgWidth = $('#' + vidID + '_cta #image').width();
			imgHeight = $('#' + vidID + '_cta #image').height();
			li = (w - imgWidth) / 2
			ti = (h - imgHeight) / 2
			tiswf = ti + 10
			
			//if the video player is the SWF player
			if (UMP.embedDataArray[vidID]['ptype'] === 'SWF' ) {
				//removed on 04.16.12 - not sure the reason behind adding 10 pixels to this. Might need to re add this due to VML cascading shenanigins.
				//$('#' + vidID + '_cta #image').css({'left' : li + 'px', 'top' : tiswf + 'px'});
			}
			//else just position the image normally
			else {
				$('#' + vidID + '_cta #image').css({'left' : li + 'px', 'top' : ti + 'px'});
			}
			
			
			if (UMP.embedDataArray[vidID]['cta_learnMore']) {
				//Learn More Enabled.	
				
				lmtheHTML = '<div id="lmBG" class="UMP_CTA_BG">&nbsp;</div>';
				$('#' +  vidID + '_cta').append(lmtheHTML);
				$('#' + vidID + '_cta #lmBG').css({'z-index' : '3009', 'position' : 'absolute', 'width' : w + 'px', 'height' : h + 'px'});
				
				lmtheHTML = '<div id="learnMoreDiv" class="learnMoreDiv">';
				lmtheHTML += '<p class="lmP">' +  UMP.embedDataArray[vidID]['cta_learnMore']['text'] + '</p>';
				lmtheHTML += '<div class="lm_buttons" id="buttons"><p class="lmButtonL"><span class="lmButtonR">' + UMP.embedDataArray[vidID]['cta_learnMore']['learnMore'] + '</span></p></div>';
     			lmtheHTML += '<p id="replayButton">Replay Video</p>';
 				lmtheHTML += '</div>';
				$('#' +  vidID + '_cta').append(lmtheHTML);
				$('#' + vidID + '_cta #learnMoreDiv').css({'z-index' : '3010', 'position' : 'absolute', 'width' : w + 'px', 'height' : h + 'px'});
				$('#' + vidID + '_cta #learnMoreDiv').css({'font' : '13px/15px Arial, Helvetica, sans-serif', 'text-align' : 'center', 'color' : '#FFFFFF', 'padding-top' : '70px'});

				
				theLink = $('#' + vidID + '_cta #buttons').find('a').attr('href');
				theText = $('#' + vidID + '_cta #buttons').find('a').html();

				$('#' + vidID + '_cta #buttons span').html(theText);
				
				$('#' + vidID + '_cta #buttons').click(function() {
  					window.location = theLink;
				});
				
				$('#' + vidID + '_cta #replayButton').click(UMPcta.clickRePlay);

				//Don't ask me why the style sheets .css won't work, but they won't. - VS 04.07.11
				$('.lmP').css({'font-weight' : 'bold'});
				$('.lmButtonL').css({'float':'left', 'margin':'0 0 16px 215px', 'padding-left':'10px', 'background':'url("/global/ui/richmedia/images/UMP/skins/default/btn_yellow_left.png") no-repeat', 'font':'bold 16px/16px Arial, Helvetica, sans-serif', 'color':'#FFFFFF', 	'text-align' : 'left', 'cursor':'pointer'});
				
				$('.lmButtonR').css({'float':'right', 'padding' : '8px 10px 0 0', 'height' : '22px', 'background' : 'url(/global/ui/richmedia/images/UMP/skins/default/btn_yellow_right.png) top right no-repeat'});
				
				$('#replayButton').css({'clear' : 'left', 'color' : '#FCB913', 'font-weight' : 'bold', 'cursor' : 'pointer'});

			}
			
			$('area').hover(function() { $('#thecta').parent().addClass('mapHover'); }, function() {  $('#thecta').parent().removeClass('mapHover'); });

			
			//UMP.UMPconsole.log('UMP DEBUG: (cta) ' + theHTML);
		
		} else {
			
			//CTA div is open already - do nothing...
			//UMP.UMPconsole.log('UMP: CTA for ' + vidID + ' is already built.');
			
		}
	},
	
	removeCTA: function(vidID) {
		$('#' + vidID + '_cta').remove();
		//UMP.UMPconsole.log('UMP: CTA removed from ' + vidID);
	},
	
     clickRePlay: function(e) {
		 UMPcta.removeCTA(vidID);
		 UMP.playVideo(vidID);
		 //Track REPLAY!
		 if (UMP.embedDataArray[vidID]['source-rtmp']) {
			swfRTMP = UMP.embedDataArray[vidID]['source-rtmp'];
		} else {
			swfRTMP = UMP.embedDataArray[vidID]['source-mp4'];
		}


		UMP.trackThis("Replay", swfRTMP);
		 //UMP.enableRollover(vidID);
	} 
}

