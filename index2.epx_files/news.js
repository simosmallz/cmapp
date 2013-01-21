/* 
news.js
Version: 05.14.12 - VS

Create: 08.11.11

Edit: 

12.05.11 - Removed Console Calls (Fixes IE9 error)
12.15.11 - fixed sap-news-bottom from being removed instead of hidden
12.21.11 - changed news behavior (added class = 'rm_newsExpand') and added sapNEWS.openNewsWidget();
05.14.12 - added if(newsCtr == 0) to prevent total failure of newsfeed (and throwing JS errors.)


*/

var sapNEWS = {
	
	newRotationTime: 4000,
	
	W_newsCtr: 1,
	isNews: 1,
	W_newsHt: 1,
	W_newsMax: 0,
	W_newsCrnt: 0,
	
	init: function() {
		//NEWSconsole.log('sapNEWS init');
		
		
		//Get news heights and starting points
		sapNEWS.W_newsCtr = $('#sap-news ul li').size();
		sapNEWS.isNews = $('#sap-news-wrapper');
		
		if (sapNEWS.isNews[0]) {
			sapNEWS.W_newsHt = parseInt($('#sap-news-wrapper ul li').css('height').substring(0, $('#sap-news-wrapper ul li').css('height').indexOf('px'))) + 2;
		}
		sapNEWS.W_newsMax = ((sapNEWS.W_newsCtr - 1) * sapNEWS.W_newsHt) * -1;
		sapNEWS.W_newsCrnt = 0;
		
	},
	
	openNewsWidget: function(newsObject) {
		//getClass = $(newsObject).attr('class');	
        //if (getClass === "on") {
			
		if ($(newsObject).hasClass('on')) {
            closeOverlayNews();
        } else {
            $(newsObject).addClass('on');
            $('#sap-news-bottom').removeClass('hide').addClass('show');
            $('#sap-news-wrapper').addClass('sap-news-wrapper-on');
            $('#sap-news').addClass('on');
        }
	}
}


$(window).load(function () {
	
	
 /*===== NEWS WIDGET  =====*/
    var isNews = $('#sap-news-wrapper');
    var newsCtr = $('#sap-news ul li').size();
	if(newsCtr == 0)
    {
		$('#sap-news-wrapper').html('<ul><li>No News For This Country</li><ul>');
    }
    else
    {
		if (isNews[0]) {
			var newsHt = parseInt($('#sap-news-wrapper ul li').css('height').substring(0, $('#sap-news-wrapper ul li').css('height').indexOf('px'))) + 2;
		}
		var newsMax = ((newsCtr - 3) * newsHt) * -1;
		var newsCrnt = 0;
	
		$('.rm_newsExpand a').bind('click', function (e) {
			e.preventDefault();
			sapNEWS.openNewsWidget($(this).parent());
		});
		
		$('#sap-news h2 a').bind('click', function (e) {
			e.preventDefault();
			sapNEWS.openNewsWidget($(this));
		});
	}
	
    /*$('#sap-news h2 a').bind('click', function (e) {
        getClass = $(this).attr('class');
        if (getClass === "on") {
            closeOverlayNews();
        } else {
            $(this).addClass('on');
            $('#sap-news-bottom').removeClass('hide').addClass('show');
            $('#sap-news-wrapper').addClass('sap-news-wrapper-on');
            $('#sap-news').addClass('on');
        }
        e.preventDefault();
    });*/

    $('.btn-news-down', $('#sap-news')[0]).live('click', function () {
        if (newsCrnt !== newsMax) { newsCrnt = newsCrnt - newsHt; $('#sap-news ul').animate({ top: newsCrnt }, 400); }
        else { newsCrnt = 0; $('#sap-news ul').animate({ top: newsCrnt }, 1000); }
        TrackLink('', 'News-Down', 'ClickArea=NewsWidget');
		return false;
    });

    $('.btn-news-up', $('#sap-news')[0]).live('click', function () {
        if (newsCrnt !== 0) { newsCrnt = newsCrnt + newsHt; $('#sap-news ul').animate({ top: newsCrnt }, 400); }
        TrackLink('', 'News-Up', 'ClickArea=NewsWidget');
        return false;
    });

	
	if (isNews[0]) {
		//NEWSconsole = new rmConsole('NEWS_Console');
		sapNEWS.init();
	
		newsTimer = window.setInterval('startNewsRotation();', sapNEWS.newRotationTime);
	}
});





function startNewsRotation() {
    if ($('.sap-news-wrapper-on').length == 0) { //News widget is closed
        //$('.btn-news-down').click();
        if (sapNEWS.W_newsCrnt !== sapNEWS.W_newsMax) {
			sapNEWS.W_newsCrnt = sapNEWS.W_newsCrnt - sapNEWS.W_newsHt;
			$('#sap-news ul').animate({ top: sapNEWS.W_newsCrnt }, 400);
		} else { 
			sapNEWS.W_newsCrnt = 0;
			$('#sap-news ul').animate({ top: sapNEWS.W_newsCrnt }, 1000);
		}
    }
}




// CLOSE OVERLAY NEWS
function closeOverlayNews() {
    if ($('.sap-news-wrapper-on').length > 0) {
        $('#sap-news ul').css('top', '0');
        $('#sap-news h2 a.on').removeClass('on');
        $('#sap-news').removeClass('on');
        $('#sap-news-wrapper').removeClass('sap-news-wrapper-on');
		$('.rm_newsExpand').removeClass('on');
		$('#sap-news-bottom').removeClass('show').addClass('hide');
    }
}


