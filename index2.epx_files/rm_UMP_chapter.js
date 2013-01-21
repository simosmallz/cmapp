/*
This is Chaptering routines JS file for the Universal Media Player
/global/js/rm_platform/projects/UMP/rm_UMP_chapter.js
Version: 02.22.11 - VS
*/

/*
Rich Media JavaScript: 
Rich Media Chaptering routines for the UMP

Created:	02.04.11 - VS
Last Edit:  

02.04.11 - this totally needs to be reworked... it's just a copy of the CCs for now
02.15.11 - Made work correctly. Still needs work. (Some colors and styles need to be pulled into their own folder.
02.22.11 - tweaked display to not push the control bar around.
03.03.11 - Uses UMPconfig.cssFileLocation - dah


Description:
Display the inline chaptering of a video

*/


var UMPchaptering = {
	
	
	
	tempVar: 0,
	
	init: function() {
		rmGetCSS.load_CSS(UMPconfig.cssFileLocation + "UMP/rm_UMP_chaptering_css.css");
		//Get Required Scripts and CSS
		/*require(["/global/js/rm_platform2/utils/swfobject.js"], function() {																																								
			//JS finished loading. Load CSS
			rmGetCSS.load_CSS("/global/css/rm_css/rm_UMP_chaptering_css.css");
			
			//All Done, perform stuff...
		});*/
		
	},
	

	
	showChaptering: function(vidID) {
		
		numOfChapters = UMP.embedDataArray[vidID]['chapters'].length;
		UMP.UMPconsole.log('numOfChapters ' + numOfChapters);
		
		if (!$('#' + vidID + '_chapters').html()) {
			
			theHTML = "";
			
			//This is the part that needs to be dynamic. will need to get the current time and parse out the proper sentence.
			chptHTML = "This chapter Title need to be dynamic" ;
			
			theHTML += '<div id="' + vidID + '_chapters">';
			theHTML += '<div style="position: absolute; top: -29px; margins:0px; left: 460px;" class="chapterCloseButton">&nbsp;</div>'
			theHTML += '<div id="theChptrbg" class="UMP_CHPTR_BG">&nbsp;</div>';
			
			theHTML += '<div id="chptOverlay" class="chapterContainer">';
			theHTML += '<div id="chptLength" class="chapterTotalTime">' + 'Total Length: 4:50' + '</div>';
			
			for (a=0; a < numOfChapters; a++) {
				theHTML += '<div id="chapter_' + a + '" class="singleChapterDiv"><span class="chapterTitles">' + UMP.embedDataArray[vidID]['chapters'][a] + '</span><span class="chapterTimes">' + UMP.embedDataArray[vidID]['chaptersTime'][a] + '</span></div>';
			}

		 	theHTML += '</div>';
			theHTML += '</div>';
			
			
			h = 170;
			w = $('#' +  vidID + '_videoDiv').width();
			t = h * -1;
			
			
			$('#' +  vidID + '_videoDiv').append(theHTML);
			$('#' + vidID + '_chapters').css({'z-index' : '110', 'position' : 'relative', 'top' : t + 'px', 'width' : w + 'px', 'height' : h + 'px'});
			$('#' + vidID + '_chapters #chptOverlay').css({'z-index' : '105', 'position' : 'relative'});
			$('#' + vidID + '_chapters #theChptrbg').css({'z-index' : '103', 'position' : 'absolute', 'width' : w + 'px', 'height' : h + 'px'});
			
			
			//Assign Button Actions:
			$('.singleChapterDiv').hover(
				function () {
				UMPchaptering.chapterHoverOver($(this));
			  },
			  function () {
				UMPchaptering.chapterHoverOut($(this));
			});

			$('.singleChapterDiv').click( function() {
				UMPchaptering.chapterClick($(this));
			});
			
			$('.chapterCloseButton').click( function() {
				thisVidID = $(this).parent().attr('id'); //returns something like video_one_chapters
				thisVidID = thisVidID.substr(0,thisVidID.length - 9); // -9 to remove '_chapters'
				UMP.hideChaptering(thisVidID);
			});
			
			//UMP.UMPconsole.log('UMP DEBUG: (Chapters) ' + theHTML);
			
		} else {
			
			//CC div is already open...
			UMP.UMPconsole.log('UMP: Chapters for ' + vidID + ' already built.');
			
		}
		
	},
	
	
	chapterHoverOver: function(me) {
		myID = $(me).attr('id');
		//UMP.UMPconsole.log('UMP DEBUG: (chapterHoverOver :' + myID);
		//$(me).css({'background-color' : '#FF3344'});
		highLightHTML = '<div id="highlight" class="ChapterHighlight">&nbsp;</div>';
		$(me).append(highLightHTML);
		
	},
	
	chapterHoverOut: function (me) {
		myID = $(me).attr('id');
		$(me).find('#highlight').remove();
		//UMP.UMPconsole.log('UMP DEBUG: (chapterHoverOut :' + $(me).find('#hightlight').html());
	},
	
	chapterClick: function (me) {
		myID = $(me).attr('id');
		
		cptrNum = myID.split('_'); //div's are named chapter_0; chapter_1 - so cptrNum[1] is the chapter ID number
		thisVidID = $(me).parent().parent().attr('id'); //returns something like video_one_chapters
		thisVidID = thisVidID.substr(0,thisVidID.length - 9); // -9 to remove '_chapters'
		
		seekToTime = UMP.embedDataArray[thisVidID]['chaptersTime'][cptrNum[1]];
	
		UMP.seekTo(thisVidID, seekToTime);
		UMP.hideChaptering(thisVidID);
		
	},
	
	hideChaptering: function(vidID) {	
		$('#' + vidID + '_chapters').remove();
		UMP.UMPconsole.log('UMP: Chapters removed from ' + vidID);
	},
	
	getCurrentChapterText: function(vidID) {
		theTime = UMP.embedDataArray[vidID]['currenttime'];
		theChapterIndex = 0;
		for (c=0; c<UMP.embedDataArray[vidID]['chapters'].length; c++) {
			checkedTime =  UMP.stringToTime(UMP.embedDataArray[vidID]['chaptersTime'][c]);
			if (checkedTime < theTime) {
				theChapterIndex = c;
			}
		}
		
		return (theChapterIndex);
	}
	

}

