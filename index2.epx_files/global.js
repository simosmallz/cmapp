/* 
global.js
Version: 11.19.12

Edits:
11.22.11 - fix for customer A to Z 
11.23.11 - add hashbang link tracking
12.05.11 - added fix for corporate language selection
12.12.11 - added a if/then to prevent the on class from being applied to the news page on the corporate site.
12.20.11 - fixed console.logs
01.23.12 - Locatization of more/less
01.24.12 - new A to Z using named anchors (Chrome and mobile fix)
01.25.12 - tweaked customer testimonials search
01.31.12 - fixed missing arrows in localization of more/less
02.03.12 - AUTO OPEN Expandable Lists If there's ONLY 1 Item. 
02.10.12 - made the addthis_widget.js scripts load for all pages (to fix for addthis on search)
02.27.12 - Added Events Agenda code...
03.16.12 - tweaked agenda code to work in IE
04.17.12 - added the facbook_2012.js call.
		 - added div.expandable-list-wrapper-full to the expandable list auto open code.
04.27.12 - added .promo-module to the initPromoRotate(); for the new BUYNOW template
06.27.12 - added adjustToolTip function for Test N Target
		 - added corporate site language selector hide code - <headdata><![CDATA[<script type="text/javascript">var corpNoTranslation = true;</script>]]></headdata>
07.09.12 - hasbang fix fix - vs (solved for (pgHash.substring(0, 2) != "#/") )
08.16.12 - added return false for expand collapse issues in IE7 & 8
09.12.12 - added ('#subleftcol .promo').length > 0 to  initPromoRotate(); call for left promos
09.28.12 - added Country Selector Bump code
10.03.12 - Close Timer removed for BUMP
10.09.12 - *VL* added ('.quote-module .promo-rotate').length > 0 to  initPromoRotate(); call for Sublevel Feature Hero promo-rotate
		 - *VL* added ('.promo-module .promo-photo-rotate').length > 0 to  initPromoRotate(); call for Sublevel Feature Hero Photo promo-rotate
10.15.12 - turned off the old addthis.js scripts.
11.12-12 - turned on the NEW addthis.js scripts - added addthis clean up scripts
11.19.12 - adjusted addthis for mutliple addthis's on the screen. (Remove click on bubble count)
11.23.12 - change http only addthis link - has to work http/https
*/


var pgHash = location.hash;
var pgHost = location.host;
var pgHref = location.href;
var pgPath = location.pathname;
var pgTitle = document.title;

var referrer = '';
var ajaxHash = '';
var inPrintView = false;

var winH = window.innerHeight;
var winW = window.innerWidth;
var uA = navigator.userAgent.toLowerCase();
var userAgent;
var currentSelectedEvent;

var addthis_cnt = 0;


//Check For #! - do it as SOON AS POSSIBLE. no need to wait for loading.
//08.17.11 - VS
//Modified by Chandu on Jan 12 to address JIRA# NPC-380
if (pgHash) {
    isHashBang = pgHash.indexOf('.epx');
    if (isHashBang) {
		if (pgHash.substring(0, 2) == "#_") {
			//Events Agenda hash. Do nothing...			
		} else if (pgHash.substring(0, 2) != "#/") {
           // window.location = 'http://' + pgHost;
		   //do nothing. It's a normal hash/anchor link (07.09.12 - VS);
        } else {
            TrackHBRedir(document.referrer);
            set_cookie(HB_REFERRER_COOKIE_NAME, document.referrer);
            newPath = pgHash.substring(1);
            window.location = 'http://' + pgHost + newPath;
        }
    }
}
deleteCookie(HB_REFERRER_COOKIE_NAME);

//By Chandu  on July 5th,2011

/* ==function to remove Host Name from the HASH URL's  ==*/
function getHashedURL(hash_URL) {

    if (hash_URL.indexOf(location.host) >= 0) {
        hash_URL = hash_URL.replace("http://" + location.host, "");
    }
    return hash_URL;
}

function IsValidHashedUrl(hash_URL) {
    if ((hash_URL.toUpperCase().indexOf("HTTP://") >= 0) || (hash_URL.toUpperCase().indexOf("HTTPS://") >= 0)) {
        var sapHost = location.hostname.toUpperCase();
        var hashHost = hash_URL.slice(hash_URL.indexOf("://") + 3, hash_URL.indexOf("/", 8) + 1).toUpperCase();
        if (sapHost == hashHost)
            return true;
        else
            return false;
    }
    else
        return true;
}

//End Change By Chandu






$(window).load(function () {
		
	//Check for country selection
	//Already working? - 08.17.11
		
	//Events Agenda (day 1, day 2, day 3 schedule display)
	initEventsButtons();

	//corporate site language hider:
	if (typeof corpNoTranslation !== 'undefined') {
		if (corpNoTranslation) {
			$('#corporate-headerright').hide();
		}
	}
	
});


$(document).ready(function () {
    /*===== CLICK EVENT - BACK BUTTON (HISTORY.GO)  =====*/
    $('.backBtn').live('click', function (e) {
        if (history.length > 1) {
            history.go(-1);
        }
        else { location.replace('/index.epx'); }
        e.preventDefault();
    });

    /*===== CLICK EVENT - EMPTY ANCHORS  =====*/
    $('a[href=""]').live('click', function () { return false; });



    /* ===== CLICK/HOVER EVENTS - EXPANDABLE LISTS ===== */

    $('a#btn-expandall-subright.off').live('click', function () {
        var el = $(this);
        var elRel = $(this).attr('rel');
        var elMarkup = $(this).html();
        if (elRel == "" || elRel == null) { elRel = 'Collapse All'; }
        $(el).next().find('li:not(.on) a.btn-expanditem-subright').click();
        $(el).removeClass('off').addClass('on').html(elRel).attr('rel', elMarkup);
        return false;
    });
    $('a#btn-expandall-subright.on').live('click', function () {
        var el = $(this);
        var elRel = $(this).attr('rel');
        var elMarkup = $(this).html();
        if (elRel == "" || elRel == null) { elRel = 'Expand All'; }
        $(el).next().find('li.on a.btn-expanditem-subright').click();
        $(el).removeClass('on').addClass('off').html(elRel).attr('rel', elMarkup);
        return false;
    });

    $('a.btn-expanditem-subright').live('click', function () {
        var el = $(this);
        var elP = $(el).parent();
        var elRel = $(this).attr('rel');
        var elMarkup = $(this).html();

        if (elRel == "" || elRel == null) { elRel = 'Less'; }
        $(el).attr('rel', elMarkup);
        $(el).html(elRel);

        if ($(elP).is('.on')) { $(elP).removeClass('on'); }
        else { $(elP).addClass('on'); }
        return false;
    });
    $('.expandable-list li').live('click', function () {
        $(this).find('a.btn-expanditem-subright').click();
    });
    $('ul.expandable-list > li > *').find('a').live('click', function (e) { e.stopPropagation(); });


    // HOVERS
    $('.expandable-list li h4').not('.expandable-list li.on h4').live('mouseover mouseout', function (event) {
        if (event.type == 'mouseover') {
            $(this).parent('li').css('background', '#FFFFFF none');
        } else {
            $(this).parent('li').css('background', 'transparent none');
        }
    });
    $('.expandable-list li.on h4').live('mouseover mouseout', function (event) {
        if (event.type == 'mouseover') {
            $(this).parent('li').css('background', '#FFFFFF url(/global/ui/images/backgrounds/bkg-expandablelist-hover.png) repeat-x top;');
        } else {
            $(this).parent('li').css('background', '#FFFFFF none');
        }
    });


    // Secondary > subbottom > expandable > set variable Height with 'collapseSize'
    // 08.09.11 - *VL*
    $('ul.expandable-list').children('li').each(function () {
        if ($(this).hasClass('heading')) {
            $(this).next();
        }
        else {
            var collapsedHeight = $(this).attr('collapseSize');
            $(this).css({ 'height': collapsedHeight + 'px' });
        }
    });


    // Secondary > subbottom > expandable
    $('a#btn-expandall-subbottom.off').live('click', function () {
        var el = $(this);
		var elRel = $(this).attr('rel');
		var elMarkup = $(this).html();
		if (elRel == "" || elRel == null) { elRel = 'Collapse All <span>&raquo;</span>'; }
		$(el).attr('rel', elMarkup);
        $(el).next().find('li:not(.on) a.btn-expanditem-subbottom').click();
		$(el).removeClass('off').addClass('on').html(elRel);
		if ($(el).find('span').length == 0) {
			$(el).html(elRel + ' <span>&raquo;</span>');	
		}
		//08.16.12 - IE7 & 8 fixed?
		return false;
    });
    $('a#btn-expandall-subbottom.on').live('click', function () {
        var el = $(this);
		var elRel = $(this).attr('rel');
		var elMarkup = $(this).html();
		if (elRel == "" || elRel == null) { elRel = 'Expand All <span>&raquo;</span>'; }
		$(el).attr('rel', elMarkup);
        $(el).removeClass('on').addClass('off').html(elRel);
        $(el).next().find('li.on a.btn-expanditem-subbottom').click();
		if ($(el).find('span').length == 0) {
			$(el).html(elRel + ' <span>&raquo;</span>');	
		}
		//08.16.12 - IE7 & 8 fixed?
		return false;
    });

    // Edited 08.09.11 - *VL*
    $('a.btn-expanditem-subbottom').live('click', function () {
        var el = $(this);
        var elP = $(el).parent();
		var elRel = $(this).attr('rel');
        var defaultHeight = 60
		
		//Locatization of more/less - 01.23.12
		var elMarkup = $(this).html();
		if (elRel == "" || elRel == null) { elRel = 'Less'; }
        $(el).attr('rel', elMarkup);
        $(el).html(elRel);
		//Add a double arrow if it's not there.
		if ($(el).find('span').length == 0) {
			$(el).html(elRel + ' <span>&raquo;</span>');	
		}
		
        if ($(elP).is('.on')) {
            $(elP).find('.rm_expand-pictogram').hide();
            $(elP).removeClass('on');
            $(elP).height(function () {
                //if the collapesed height exist, set to the height
                if ($(elP).attr('collapseSize')) {
                    var collapsedHeight = $(elP).attr('collapseSize');
                    $(elP).css({ 'height': collapsedHeight + 'px' });
                }
                //else set to default
                else {
                    $(elP).css({ 'height': defaultHeight + 'px' });
                }
            });
        }
        else {
            $(elP).find('.rm_expand-pictogram').show();
            $(elP).addClass('on');  // 07.07.11 - *VS*
            $(elP).css({ 'height': 'auto' });
        }
    });

    $('.expandable-list li').live('click', function () {
        var el = $(this);
        $(el).find('a.btn-expanditem-subbottom').click();
    });





    $('.leftnav-expandable-list .btnToggle').live('click', function () {
        var currClass = $(this).attr('class');
        if (currClass == "btnToggle open") {
            $(this).attr('class', 'btnToggle');
        }
        else {
            $(this).addClass('open');
        }
        //$(this).parent().find('li.leftnav-li-hide').stop(true, true).toggle(1000);
        $(this).parent().find('li.leftnav-li-hide').stop(true, true).toggle();
    });

    subPathInt = currpath.indexOf('/', 1);
    subPath = currpath.substring(1, subPathInt);

    //SubNav:
    $('#subleftcol ul li').each(function (index) {
        theLink = $(this).find('a').attr('href');
        if (theLink == currpath) {
            //alert('ding ding ding');	
            $(this).find('a').addClass('on');
        }
    });

    //initialize leftnav expandable functionality
    if ($('.leftnav-expandable-list').length > 0) {
        if ($('.btnToggle').length == 0) {
            $('.leftnav-expandable-list').each(function () {
                var totalItems = $(this).find('li');
                var linkArray = $(this).find('li a');

                //determine whether to build a collapseable list
                if (totalItems.length > 5) { //if there are more than 5 items in the list, apply a toggle button
                    $.each(totalItems, function (index, value) {
                        if (index > 4) {
                            $(this).addClass('leftnav-li-hide');
                        }
                    });
                    $(this).append('<li class="btnToggle"></li>');
                }

                //This below doesn't really work. Since on refresh the item does NOT have an on value.
                //determine whether the list should 'open' or stay 'collapsed' on pageload
                $.each(linkArray, function (index, value) { //iterate thru anchors and look for the 'on' state
                    //console.log(index+' : '+value);

                    isOn = $(this).hasClass('on');
                    if (isOn == true) { //if 'on' state is present determine the index of that item in the array
                        if (index >= 5) { //if the 'on' anchor is 5 or greater... open the leftnav menu
                            $(this).parent().siblings('.btnToggle').trigger('click');
                        }
                    }
                });
            });
        }
    }



	//AUTO OPEN Expandable Lists If there's ONLY 1 Item. (02.03.12)
	if ($('ul.expandable-list > li').length == 1) {
		$('div.expandable-list-wrapper > a#btn-expandall-subbottom').trigger('click');
		$('div.expandable-list-wrapper > a#btn-expandall-subright').trigger('click');
		$('div.expandable-list-wrapper-full > a#btn-expandall-subbottom').trigger('click'); //added 04.17.12
	}
	
	


    /*==== INITIALIZE A TO Z PAGES =====*/
    $('#atoz-menu a.disabled').each(function () {
        letter = $(this).html().toLowerCase();
        $('#atoz-' + letter).hide();
    });
	
	//Make the links point the named anchor:
	$('#atoz-menu a').each(function () {
        letter = $(this).html().toLowerCase();
        $(this).attr('href', '#' + letter);
    });
	
	
	//Add a named anchor before each letter in the list: 
	$('#atoz-list-wrapper li').each(function() {
		myLetter = $(this).find('h3').html().toLowerCase();
		$(this).prepend('<a name="' + myLetter + '" id="' + myLetter + '"></a>');
	});



    /*===== CLICK EVENTS - CUSTOMER TESTIMONIALS/CUSTOMER AT0Z =======*/
    $('#form-customertestimonials-filter').live('submit', function (e) {
        e.preventDefault();
        srchParam = 'Region=' + $('#filter-region').val() + '&Country=' + $('#filter-country').val() + '&CompanySize=' + $('#filter-companysize').val() + '&Brochure=' + $('#Brochure').is(':checked') + '&Video=' + $('#Video').is(':checked');
        location.replace('http://' + location.host + location.pathname + '?' + srchParam);
        //$('#form-customertestimonials-filter').attr('action', '?' + srchParam);
        //this.submit();
    });
	


    $('#page-content #atoz-menu a').live('click', function (e) {
        if ($('#atoz-menu').hasClass('customerAZ')) { //if "customer testimonials a-z"
			if ($(this).attr('class') != 'disabled') {
				//If we're in a startsWith or has the search then adjust the menu links to go to the page properly
                if ((pgHref.indexOf('startsWith') > 0) || (pgHref.indexOf('search=') > 0)) {
					theLetter = $(this).attr('href');
					appendToURL = '?startsWith=' + theLetter.substr(1).toUpperCase();
					window.location = pgPath + appendToURL;
					return false;
				}
			}
        }
    });


    $('#page-content #form-atoz-search').live('submit', function (e) {
        getHref = $(this).attr('action');
        srchParam = 'search=' + $('#atoz-input').val();
		window.location = getHref + '?' + srchParam;
        e.preventDefault();
    });



    /*===== CLICK EVENT - MY SAP ACCOUNT EXPAND/EDIT TOGGLES  =====*/

    // 'Edit' link
    $('a.editexpand').live('click', function () {
        $(this).parent().parent().parent('.thicktopborder').addClass('on');
        return false;
    });
    // 'Close' link
    $('a.editclose').live('click', function () {
        $(this).parent().parent().parent('.thicktopborder').removeClass('on');
        return false;
    });
    // 'Cancel' link
    $('a.cancellink').live('click', function () {
        $(this).parent().parent('.thicktopborder').removeClass('on');
        return false;
    });
    // 'Save' button
    $('.axshawnbuttons a.btn-cta').live('click', function () {
        $(this).parent().parent('.thicktopborder').removeClass('on');
        return false;
    });




    /*===== CLICK EVENT - MY SAP ACCOUNT > MY SUBCRIPTIONS  =====*/

    var relatedChkbx; //global var use
    $('.newslettertable a.infoicon').live('click', function () {
        var el = $(this);
        var jpgURL = $(el).attr('href');
        var title = $(el).siblings('.NLTitle').html();
        var pos = ($(el).position().top + 200);
        relatedChkbx = $(el).parent().siblings('.col-one').children('input:first');
        applyBlackout('newslettertable');
        $('body').append('<div id="previewContainer" style="position:absolute; top:' + pos + 'px; left:30%; z-index:9999;"><a id="myModalClose"><span>Close</span></a><div id="previewInner"><h3>' + title + '</h3><p><a class="btn-cta" id="subscribeNow" href="javascript:;"><span>Subscribe</span></a></p><img src="' + jpgURL + '" /></div></div>');
        return false;
    });

    $('#subscribeNow').live('click', function () {
        $(relatedChkbx).attr('checked', true);
        closePreviewOverlay();
    });

    $('#myModalClose').live('click', function () {
        closePreviewOverlay();
    });




    /*===== CLICK EVENT - LIST TOGGLES  =====*/
    $('.atoz-list dl').addClass('clearfix');
    $('a.list-toggle', $('#subbottom')[0]).live('click', function () { if ($(this).parent().attr('class') === "on") { $(this).parent().removeClass('on'); } else { $(this).parent().addClass('on'); } return false; });
    $('.atoz-list dl dt a').live('click', function () { if ($(this).attr('class') !== "on") { $(this).addClass('on').parent().parent().addClass('on'); } else { $(this).removeClass('on').parent().parent().removeClass('on'); } return false; }); //bugfix 1/10/11_sk
    $('#subright-more-toggle a').live('click', function () { if ($(this).attr('class') !== "on") { $('#subright-top-flexible').attr('class', ''); $(this).addClass('on').html('Minimize -').parents('#subright').addClass('on'); } else { $('#subright-top-flexible').attr('class', currSubRghtTopFlexClass); $(this).removeClass('on').html('More +').parents('#subright').removeClass('on'); } return false; }); //revisited "more" toggle  skiernan_1/5/11
    $('a.expand-all', $('#subright-toggles')[0]).live('click', function () { $('#subright-listB li').addClass('on'); return false; });
    $('a.close-all', $('#subright-toggles')[0]).live('click', function () { $('#subright-listB li').removeClass('on'); return false; });
    $('a.expand-all', $('#atoz-toggle')[0]).live('click', function () { $('#atoz-list-wrapper li dl dt a').each(function () { $(this).addClass('on').parent().parent().addClass('on'); }); return false; });
    $('a.close-all', $('#atoz-toggle')[0]).live('click', function () { $('#atoz-list-wrapper li dl dt a.on').removeClass('on').parent().parent().removeClass('on'); ; return false; });



    /* ===== CORPORATE SITE ======= */
    if ($('#corporate').length > 0) {
        //console.log('corporate site detected');
        var currPath = window.location.pathname;
        var currDir = currPath.substr(1).split('/', 1);
        var currSubDir = currPath.substr(1).split('/', 2);
        currSubDir = currSubDir[1];

        if (currSubDir != 'index.epx') {
            $('#nav-main a[href*="' + currSubDir + '"]').addClass('on');
        }
        // if we're on the news page, then DON'T apply the on class.
        if ($('#subleftcol').find('.news-group').length == 0) {
            $('#subleftcol a[href*="' + currPath + '"]').addClass('on');
        }


        //swap 'en' and 'de' directories in the URL accordingly 
        $('#corporate-headerright a').click(function (e) {
            //console.log('corporate-headerright a clicked!');
            var targSelector = $(this).attr('href').substr(1);
            if (targSelector == 'country-selector.epx') {
                if (currDir == 'corporate-de') {
                    location.href = currPath.replace('corporate-de', 'corporate-en');
                }
            }
            if (targSelector == "country-selector-de.epx") {
                if (currDir == 'corporate-en') {
                    location.href = currPath.replace('corporate-en', 'corporate-de');
                }
            }
            e.preventDefault();
        });
    }
	
	// corporate investor relation
	if ($('#secondary').length > 0) {
        //console.log('corporate site detected');
        var currPath = window.location.pathname;
        var currDir = currPath.substr(1).split('/', 1);
       
        //swap 'en' and 'de' directories in the URL accordingly 
        $('#corporate-headerright a').click(function (e) {
            //console.log('corporate-headerright a clicked!');
            var targSelector = $(this).attr('href').substr(1);
            if (targSelector == 'country-selector.epx') {
                if (currDir == 'corporate-de') {
                    location.href = currPath.replace('corporate-de', 'corporate-en');
                }
            }
            if (targSelector == "country-selector-de.epx") {
                if (currDir == 'corporate-en') {
                    location.href = currPath.replace('corporate-en', 'corporate-de');
                }
            }
            e.preventDefault();
        });
    }



    /*==== INITIALIZE SOCIAL MEDIA SCRIPTS ====*/

    //if "Facebook Like" button is present, load proper scripts
    if ($('.fbLikeButton').length > 0) {
        $.getScript('/global/ui/js/facebook.js');
    }
	
	if ($('.like_2012').length > 0) {
        $.getScript('/global/ui/js/facebook_2012.js');
    }



    //Always Load AddThis - 11.12.12
    if (addthis_cnt == 0) {
        $.getScript('//s7.addthis.com/js/300/addthis_widget.js#pubid=sapglobalmarketing', function () {
            addthis.addEventListener('addthis.ready', addthisReady);
            addthis_cnt++;
        });
    }



    //Highlight the BUY NOW Button if we're on a buy now page.
    if (pgPath.indexOf('buy-now') > 0) {
        $('#utilitynav-buy').addClass('on');
    }

    initInputs();

    //Check for floating footer:
    footerFix();

    //initialize multi-promo rotation
    if (
		$('body').find('#subrightcol-promo').length > 0 || 
		$('body').find('#htb-highlight-right').length > 0 || 
		$('body').find('#htb-highlight').length > 0 || 
		$('body').find('.promo-module').length > 0 || 
		$('body').find('#subleftcol .promo').length > 0 || 
		$('body').find('.quote-module .promo-rotate').length > 0 || 
		$('body').find('.promo-module .promo-photo-rotate').length > 0
		) {
        initPromoRotate(); //This function exists in common.js
    	}
});



function doBump() {
	
	$('#bump_closeButton').click(function (e) {
		closeBump();
	});
	
	positionBump();
	
	$('#bumper').animate({ 
			height: 67
		}, { 
			duration: 600, 
			easing: 'linear',
			queue: true,
			complete: function() { 
				//Close Timer removed - 10.03.12
				//bumpTime=setTimeout("closeBump()",10000);
			}
	});	
	
	//easeOutExpo
	
	window.onresize = function() {
		positionBump();
	}
	
}


function positionBump() {
	nW = $(window).width();
	nL = $('#page').offset().left * -1;
	arrowOffset = $('#utilitynav-locationselect').offset().left + ($('#utilitynav-locationselect').width() / 2);
	
	arrowRightW = nW - (arrowOffset + $('#bumper_arrow').width());
	
	$('#bumper').css({'left' : nL + 'px','width' : nW + 'px', 'margin-right' : nL + 'px'});
	$('#bumper_bg').css({'height' : 55+'px'});
	$('#bumper_arrow').css({'left' : arrowOffset + 'px'});
	$('#bumper_arrow_left').css({'width' : arrowOffset +  'px'});
	$('#bumper_arrow_right').css({'width' : arrowRightW +  'px'});

}

function closeBump() {
	if (typeof bumpTime !== "undefined") {
		clearTimeout(bumpTime);
	}
	$('#bumper').animate({ 
			height: 0
		}, { 
			duration: 600, 
			easing: 'linear',
			queue: true,
			complete: function() { 
				//Do something
			}
	});
}	







/* Events Agenda Code */
function initEventsButtons() {
	if (pgHash.substring(0, 5) == "#_day") {
		
		$('#day1').removeClass('selectedEvent');
		$('#day2').removeClass('selectedEvent');
		$('#day3').removeClass('selectedEvent');
		theDay = pgHash.substring(2, 6);
		$('#' + theDay).addClass('selectedEvent');
		$('#dayAgendas').find('#day1').hide();
		$('#dayAgendas').find('#day2').hide();
		$('#dayAgendas').find('#day3').hide();
		
		$('#dayAgendas').find('#' + theDay).show();
		
	} 

	//set CURRENT:
	currentSelectedEvent = $('.selectedEvent').attr('id');
	
	
	$('.eventDayButton').click(function (e) {
		e.preventDefault();
		clickedID = $(this).attr('id');
		if (clickedID != currentSelectedEvent) {
			swapEvents(clickedID);
		}
		return false;
	});
}

function swapEvents(myID) {	
	$('#' + currentSelectedEvent).removeClass('selectedEvent');
	$('#' + myID).addClass('selectedEvent');
	
	window.location.hash = "_" + myID;
	
	//var newH = $('#dayAgendas > #' + myID).height();
	var newH = $('#dayAgendas').find('#' + myID).height();
	$('#dayAgendas').css({'height' : newH + 'px'});
		
	//$('#dayAgendas > #' + currentSelectedEvent).fadeOut(400, function() {
	$('#dayAgendas').find('#' + currentSelectedEvent).fadeOut(400, function() {	
        // Animation complete
		 //$('#dayAgendas > #' + myID).fadeIn(400, function() {
		 $('#dayAgendas').find('#' + myID).fadeIn(400, function() {
			currentSelectedEvent = myID;
	 	});
     });
}
/* END OF Events Agenda Code */


/*function GetAddThisScriptPath() {
    if (typeof addthis_js != 'undefined') {
        if (addthis_js.length > 0)
            return addthis_js;
    }
    return '/global/js/addthis_widget.js';
}*/


/*=== INIT - SEARCH INPUTS - HIDE AND SHOW LABEL APPROPRIATELY ===*/

function initInputs() {
	//alert('initInputs');
    var elmArr = $('.focusClear');
    elmArr.each(function () {
        $(this).focus('click', function () { $(this).siblings('label:first').hide(); });
        $(this).blur(function () { if ($(this).attr('value') === "") { $(this).siblings('label:first').show(); } });
        if ($(this).attr('value') !== "") { $(this).siblings('label:first').hide(); }
    });
}





// ====== EVENTS SEARCH FORM FUNCTIONS ======== //
function initSearchEventsForm() {
    //---- 'Focus Area' section
    $('fieldset.radios input').each(function () {
        if ($(this).is(':checked')) {
            $(this).siblings('select').removeClass('disabled').attr('disabled', false);
        }
    });

    $('fieldset.radios input').change(function () {
        if ($(this).is(':checked')) {
            //$('fieldset.radios select').addClass('disabled').attr('disabled', true).val('');
            $(this).siblings('select').removeClass('disabled').attr('disabled', false);
        }
        $('#selectsolution').removeClass('disabled').attr('disabled', false);
    });

    //---- 'Location' section
    $('#selectregion').change(function () {
        if ($('#selectregion option:selected').val() == '') {
            $('#selectcountry').addClass('disabled').attr('disabled', true);
            $('#selectstate').addClass('disabled').attr('disabled', true);
        }
        else { $('#selectcountry').removeClass('disabled').attr('disabled', false); }
    });

    $('#selectcountry').change(function () {
        if ($('#selectcountry option:selected').val() == '') {
            $('#selectstate').addClass('disabled').attr('disabled', true);
        }
        else { $('#selectstate').removeClass('disabled').attr('disabled', false); }
    });

    if ($('#selectregion').val() != '') {
        $('#selectcountry').removeClass('disabled').attr('disabled', false);
        if ($('#selectcountry').val() != '') {
            $('#selectstate').removeClass('disabled').attr('disabled', false);
        }
    }

    //---- 'Date' section
    if ($('#event-startdate').val() != '') {
        $('label[for="startdate"]').hide();
    }
    if ($('#event-enddate').val() != '') {
        $('label[for="enddate"]').hide();
    }

    /* No longer a need for reset functionality. We now redirect back to the /events/index.epx page.
    //---- 'Reset' button  
    $('.resetbtn').click(function () {
    //-- reset 'Focus Area'
    $('fieldset.radios input').attr('checked', false);
    $('fieldset.radios select').addClass('disabled').attr('disabled', true).val('');
    //-- reset 'Location'
    $('#selectregion').val('');
    $('#selectcountry').addClass('disabled').attr('disabled', true).val('');
    $('#selectstate').addClass('disabled').attr('disabled', true).val('');
    //-- reset 'Date'
    $('#event-startdate').val('');
    $('label[for="startdate"]').show();
    $('#event-enddate').val('');
    $('label[for="enddate"]').show();
    //-- reset 'Type'
    $('input[type=checkbox]').attr('checked', true);
    });
    */

    $('#events-submit').live('click', function (e) {
        //showLoadAnim('subbottom');
        $('#eventssearch').submit();
        e.preventDefault();
    });
}






/*=== DATE/CALENDAR (requires jquery ui) ===*/
/*-- Initialize "EVENTS" date picker --*/
function initEventDatePicker() {
    LocalizeDatePicker();
    var dates = $("#event-startdate, #event-enddate").datepicker({
        numberOfMonths: 2,
        minDate: -365,
        beforeShow: function (input, inst) { $(this).siblings('label:first').hide(); },
        onSelect: function (selectedDate) {
            $(this).siblings('label:first').hide();
            var option = this.id == "event-startdate" ? "minDate" : "maxDate", instance = $(this).data('datepicker');
            date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
            dates.not(this).datepicker('option', option, date);
        },
        onClose: function (dateText, inst) { if ($(this).val() == "") { $(this).siblings('label:first').show(); } }
    });
}

function LocalizeDatePicker() {
    var Lang = $('meta');

    for (var i = 0; i < Lang.length; i++) {
        if (Lang[i].httpEquiv == "Content-Language") {
            Lang = Lang.eq(i).attr("content");
            break;
        }
    }

    if (Lang != null) {
        if ((Lang != "") && (Lang.toUpperCase() != 'EN-US')) {
            var DatePickerScriptFile = '/global/ui/js/datepicker/jquery.ui.datepicker-' + Lang + '.js';
            $.ajax({ url: DatePickerScriptFile,
                type: 'HEAD',
                error: function () {
                    GetDatePickerScriptFile(Lang);
                },
                success: function (data) {
                    if (data.indexOf("<html") > -1) {
                        GetDatePickerScriptFile(Lang);
                    }
                    else {
                            $.getScript(DatePickerScriptFile);
                            $.datepicker.setDefaults($.datepicker.regional[Lang]);
                    }
                }
            });

        }
    }
}

function GetDatePickerScriptFile(Lang) {
    var DatePickerScriptFile = "";
    var tst = Lang.split("-");
    if (tst.length == 2) {
        Lang = tst[0];
        
        DatePickerScriptFile = '/global/ui/js/datepicker/jquery.ui.datepicker-' + Lang + '.js';
        $.getScript(DatePickerScriptFile);
        $.datepicker.setDefaults($.datepicker.regional[Lang]);
    }
}

$(document).ready(function() {
	
	/* ===== INITIALIZE EVENTS PAGE =========== */
    if ($('.searchevents').length > 0) {
        initSearchEventsForm(); // initialize eventsLeftNav Search Form
        if ($('.datepicker').length > 0) { initEventDatePicker(); } // initialize datepicker object
    }
    if ($('.event-results').length > 0) { //if events search results page
        $('.user-actions').hide(); //don't display save/share buttons
    }
	
	
	var currPath = location.pathname.substring(1);
	var targStr = currPath.split('/');

	if (targStr[2] == 'sap-bydesign') { //confirm we are in ByDesign
		var navArray = $('#nav-main ul li a');
		switch (targStr[3]) {
			case 'what-is-sap-business-bydesign': $(navArray[0]).addClass('on'); break;
			case 'delivery': $(navArray[1]).addClass('on'); break;
			case 'customer-testimonials': $(navArray[2]).addClass('on'); break;
			case 'buy-now': $(navArray[3]).addClass('on'); break;
			case 'see-it-in-action': $(navArray[4]).addClass('on'); break;
			case 'resources': $(navArray[5]).addClass('on'); break;
		}
	}

	if (targStr[2] == 'sales-on-demand') { //confirm we are in SalesOnDemand
		var navArray = $('#nav-main ul li a');
		switch (targStr[3]) {
			case 'see-it-in-action': $(navArray[0]).addClass('on'); break;
			case 'try-and-buy': $(navArray[1]).addClass('on'); break;
			case 'delivery': $(navArray[2]).addClass('on'); break;
		}
	}
	
	 if ((targStr[0] == 'solutions') & (targStr[1] == 'sme')) { //confirm we are in SME
		var navArray = $('#nav-main ul li a');
		switch (targStr[2]) {
			case 'sme-portfolio-strategy': $(navArray[0]).addClass('on'); break;
			case 'business-analytics': $(navArray[1]).addClass('on'); break;
			case 'business-process': $(navArray[2]).addClass('on'); break;
			case 'mobility': $(navArray[3]).addClass('on'); break;
		}
	}
	
});





//TnT Stuff (06.27.12)

function activateToolTip() {

//Declare e as a window event to normalize in all browsers
	
	if (!e) var e = window.event;	
	
	floatingToolTip = "";
	var p = $(".user-actions");
	var offset = p.offset();
	var offsetLeft = offset.left;
	

	//Select all tags with rel attribute set to tooltip
	$('[rel=tooltip]').mouseover(function(e) {			
		//Declare a variable for the title attribute
		
		offset = p.offset();
		
		//08.06.12 - tweaked to include rightcolbox - VS
		if (($('#newDesignModal').length > 0) || ($('#rightcolbox').length > 0)) {
			offsetLeft = offset.left -345;
		} else {
			//Asset Details page (probably)
			offsetLeft = offset.left;
		}
			
		if (floatingToolTip == ""){
			var tip = $(this).attr('title');
			floatingToolTip = tip;
		}
		
		//Remove the title attribute's to avoid the native tooltip from the browser
		$(this).attr('title','');
		
		//Append and build the tooltip HTML structure
		//$(this).append('<div id="tooltip"><div class="tipHeader"></div><div class="tipBody">' + tip + '</div><div class="tipFooter"></div></div>');	
		$('#page').append('<div id="tooltip"><div class="tipHeader"></div><div class="tipBody">' + floatingToolTip + '</div><div class="tipFooter"></div></div>');	
		
		//Position the tooltip with fadeIn effect
		//whereas e.pageX and e.pageY are coordinates of the mouse pointer
		//relative to the top edge of the document
		$('#tooltip').css('top', e.pageY - 80 );
		$('#tooltip').css('left', e.pageX - offsetLeft );

		$('#tooltip').fadeIn(300);
		$('#tooltip').fadeTo('10',0.9);
		
	}).mousemove(function(e) {
		
		//Keep changing the X and Y axis for the tooltip, thus, the tooltip move along with the mouse
		$('#tooltip').css('top', e.pageY - 80 );
		$('#tooltip').css('left', e.pageX - offsetLeft );
		
	}).mouseout(function(e) {
	
		//Put back the title attribute's value
		$(this).attr('title',$('.tipBody').html());
	
		//Remove the appended tooltip template
		$('div#tooltip').remove();
		
	});	
}




//AddThis Functions:
var addthis_config = {
    "data_track_addressbar":false,
    "ui_open_windows":true
};


//These four things remove the click event on the bubble with the count to prevent all the extra add this stuff from displaying.
$(window).load(function () {
    // Listen for the ready event
    //addthis.addEventListener('addthis.ready', addthisReady);
});

addthis_attempts = 4;
function addthisReady(evt) {
    var at=setTimeout(addthis_checkForExpanded,1000);
    
}

function addthis_checkForExpanded() {
    addthis_attempts--;
    if ($('.addthis_button_expanded').length > 0) {
        addthis_removeBookmarks();
    } else {
        if (addthis_attempts > 0) {
            at=setTimeout(addthis_checkForExpanded,1000);
        }
    }
}

function addthis_removeBookmarks() {

    $('.addthis_counter').each(function () {
        if ($(this).find('.addthis_button_expanded').length > 0) {
            newVal = $(this).find('.addthis_button_expanded').html();
            theCount = $(this).find('.addthis_button_expanded').html();
            $(this).find('.addthis_button_expanded').unbind();
            $(this).find('.addthis_button_expanded').remove();
            var newHTML = '<a href="" onclick="return false;" style="font-size: 11px; margin-bottom: 3px; padding-bottom: 4px; line-height: 16px; color: #000000;">' + newVal + '</a>';
            $(this).html(newHTML);
        }
    });

    /*newVal = $('.addthis_button_expanded').html();
    theCount = $('.addthis_button_expanded').html()
    $('.addthis_button_expanded').unbind();
    $('.addthis_button_expanded').remove();
    var newHTML = '<a href="" onclick="return false;" style="font-size: 11px; margin-bottom: 3px; padding-bottom: 4px; line-height: 16px; color: #000000;">' + newVal + '</a>';
    $('.addthis_counter').html(newHTML);*/
    
    //Disable click event
   $('.addthis_counter').click(function (e) {
        e.preventDefault();
   });
}








$(window).unload(function () {
    if (typeof checkExitSurvey != "undefined")
        checkExitSurvey();
});


//Global 3rd Party Functions:


/*-- jQuery UI 1.8.9 --*/
(function(c,j){function k(a){return!c(a).parents().andSelf().filter(function(){return c.curCSS(this,"visibility")==="hidden"||c.expr.filters.hidden(this)}).length}c.ui=c.ui||{};if(!c.ui.version){c.extend(c.ui,{version:"1.8.9",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});c.fn.extend({_focus:c.fn.focus,focus:function(a,b){return typeof a==="number"?this.each(function(){var d=this;setTimeout(function(){c(d).focus();b&&b.call(d)},a)}):this._focus.apply(this,arguments)},scrollParent:function(){var a;a=c.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(c.curCSS(this,"position",1))&&/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!a.length?c(document):a},zIndex:function(a){if(a!==j)return this.css("zIndex",a);if(this.length){a=c(this[0]);for(var b;a.length&&a[0]!==document;){b=a.css("position");if(b==="absolute"||b==="relative"||b==="fixed"){b=parseInt(a.css("zIndex"),10);if(!isNaN(b)&&b!==0)return b}a=a.parent()}}return 0},disableSelection:function(){return this.bind((c.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});c.each(["Width","Height"],function(a,b){function d(f,g,l,m){c.each(e,function(){g-=parseFloat(c.curCSS(f,"padding"+this,true))||0;if(l)g-=parseFloat(c.curCSS(f,"border"+this+"Width",true))||0;if(m)g-=parseFloat(c.curCSS(f,"margin"+this,true))||0});return g}var e=b==="Width"?["Left","Right"]:["Top","Bottom"],h=b.toLowerCase(),i={innerWidth:c.fn.innerWidth,innerHeight:c.fn.innerHeight,outerWidth:c.fn.outerWidth,outerHeight:c.fn.outerHeight};c.fn["inner"+b]=function(f){if(f===j)return i["inner"+b].call(this);return this.each(function(){c(this).css(h,d(this,f)+"px")})};c.fn["outer"+b]=function(f,g){if(typeof f!=="number")return i["outer"+b].call(this,f);return this.each(function(){c(this).css(h,d(this,f,true,g)+"px")})}});c.extend(c.expr[":"],{data:function(a,b,d){return!!c.data(a,d[3])},focusable:function(a){var b=a.nodeName.toLowerCase(),d=c.attr(a,"tabindex");if("area"===b){b=a.parentNode;d=b.name;if(!a.href||!d||b.nodeName.toLowerCase()!=="map")return false;a=c("img[usemap=#"+d+"]")[0];return!!a&&k(a)}return(/input|select|textarea|button|object/.test(b)?!a.disabled:"a"==b?a.href||!isNaN(d):!isNaN(d))&&k(a)},tabbable:function(a){var b=c.attr(a,"tabindex");return(isNaN(b)||b>=0)&&c(a).is(":focusable")}});c(function(){var a=document.body,b=a.appendChild(b=document.createElement("div"));c.extend(b.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});c.support.minHeight=b.offsetHeight===100;c.support.selectstart="onselectstart"in b;a.removeChild(b).style.display="none"});c.extend(c.ui,{plugin:{add:function(a,b,d){a=c.ui[a].prototype;for(var e in d){a.plugins[e]=a.plugins[e]||[];a.plugins[e].push([b,d[e]])}},call:function(a,b,d){if((b=a.plugins[b])&&a.element[0].parentNode)for(var e=0;e<b.length;e++)a.options[b[e][0]]&&b[e][1].apply(a.element,d)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(a,b){if(c(a).css("overflow")==="hidden")return false;b=b&&b==="left"?"scrollLeft":"scrollTop";var d=false;if(a[b]>0)return true;a[b]=1;d=a[b]>0;a[b]=0;return d},isOverAxis:function(a,b,d){return a>b&&a<b+d},isOver:function(a,b,d,e,h,i){return c.ui.isOverAxis(a,d,h)&&c.ui.isOverAxis(b,e,i)}})}})(jQuery);


/*-- jQuery UI Datepicker 1.8.9 --*/
(function (d, G) { function K() { this.debug = false; this._curInst = null; this._keyEvent = false; this._disabledInputs = []; this._inDialog = this._datepickerShowing = false; this._mainDivId = "ui-datepicker-div"; this._inlineClass = "ui-datepicker-inline"; this._appendClass = "ui-datepicker-append"; this._triggerClass = "ui-datepicker-trigger"; this._dialogClass = "ui-datepicker-dialog"; this._disableClass = "ui-datepicker-disabled"; this._unselectableClass = "ui-datepicker-unselectable"; this._currentClass = "ui-datepicker-current-day"; this._dayOverClass = "ui-datepicker-days-cell-over"; this.regional = []; this.regional[""] = { closeText: "Done", prevText: "Prev", nextText: "Next", currentText: "Today", monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], weekHeader: "Wk", dateFormat: "mm/dd/yy", firstDay: 0, isRTL: false, showMonthAfterYear: false, yearSuffix: "" }; this._defaults = { showOn: "focus", showAnim: "fadeIn", showOptions: {}, defaultDate: null, appendText: "", buttonText: "...", buttonImage: "", buttonImageOnly: false, hideIfNoPrevNext: false, navigationAsDateFormat: false, gotoCurrent: false, changeMonth: false, changeYear: false, yearRange: "c-10:c+10", showOtherMonths: false, selectOtherMonths: false, showWeek: false, calculateWeek: this.iso8601Week, shortYearCutoff: "+10", minDate: null, maxDate: null, duration: "fast", beforeShowDay: null, beforeShow: null, onSelect: null, onChangeMonthYear: null, onClose: null, numberOfMonths: 1, showCurrentAtPos: 0, stepMonths: 1, stepBigMonths: 12, altField: "", altFormat: "", constrainInput: true, showButtonPanel: false, autoSize: false }; d.extend(this._defaults, this.regional[""]); this.dpDiv = d('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>') } function E(a, b) { d.extend(a, b); for (var c in b) if (b[c] == null || b[c] == G) a[c] = b[c]; return a } d.extend(d.ui, { datepicker: { version: "1.8.9"} }); var y = (new Date).getTime(); d.extend(K.prototype, { markerClassName: "hasDatepicker", log: function () { this.debug && console.log.apply("", arguments) }, _widgetDatepicker: function () { return this.dpDiv }, setDefaults: function (a) { E(this._defaults, a || {}); return this }, _attachDatepicker: function (a, b) { var c = null; for (var e in this._defaults) { var f = a.getAttribute("date:" + e); if (f) { c = c || {}; try { c[e] = eval(f) } catch (h) { c[e] = f } } } e = a.nodeName.toLowerCase(); f = e == "div" || e == "span"; if (!a.id) { this.uuid += 1; a.id = "dp" + this.uuid } var i = this._newInst(d(a), f); i.settings = d.extend({}, b || {}, c || {}); if (e == "input") this._connectDatepicker(a, i); else f && this._inlineDatepicker(a, i) }, _newInst: function (a, b) { return { id: a[0].id.replace(/([^A-Za-z0-9_-])/g, "\\\\$1"), input: a, selectedDay: 0, selectedMonth: 0, selectedYear: 0, drawMonth: 0, drawYear: 0, inline: b, dpDiv: !b ? this.dpDiv : d('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')} }, _connectDatepicker: function (a, b) { var c = d(a); b.append = d([]); b.trigger = d([]); if (!c.hasClass(this.markerClassName)) { this._attachments(c, b); c.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker", function (e, f, h) { b.settings[f] = h }).bind("getData.datepicker", function (e, f) { return this._get(b, f) }); this._autoSize(b); d.data(a, "datepicker", b) } }, _attachments: function (a, b) { var c = this._get(b, "appendText"), e = this._get(b, "isRTL"); b.append && b.append.remove(); if (c) { b.append = d('<span class="' + this._appendClass + '">' + c + "</span>"); a[e ? "before" : "after"](b.append) } a.unbind("focus", this._showDatepicker); b.trigger && b.trigger.remove(); c = this._get(b, "showOn"); if (c == "focus" || c == "both") a.focus(this._showDatepicker); if (c == "button" || c == "both") { c = this._get(b, "buttonText"); var f = this._get(b, "buttonImage"); b.trigger = d(this._get(b, "buttonImageOnly") ? d("<img/>").addClass(this._triggerClass).attr({ src: f, alt: c, title: c }) : d('<button type="button"></button>').addClass(this._triggerClass).html(f == "" ? c : d("<img/>").attr({ src: f, alt: c, title: c }))); a[e ? "before" : "after"](b.trigger); b.trigger.click(function () { d.datepicker._datepickerShowing && d.datepicker._lastInput == a[0] ? d.datepicker._hideDatepicker() : d.datepicker._showDatepicker(a[0]); return false }) } }, _autoSize: function (a) { if (this._get(a, "autoSize") && !a.inline) { var b = new Date(2009, 11, 20), c = this._get(a, "dateFormat"); if (c.match(/[DM]/)) { var e = function (f) { for (var h = 0, i = 0, g = 0; g < f.length; g++) if (f[g].length > h) { h = f[g].length; i = g } return i }; b.setMonth(e(this._get(a, c.match(/MM/) ? "monthNames" : "monthNamesShort"))); b.setDate(e(this._get(a, c.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - b.getDay()) } a.input.attr("size", this._formatDate(a, b).length) } }, _inlineDatepicker: function (a, b) { var c = d(a); if (!c.hasClass(this.markerClassName)) { c.addClass(this.markerClassName).append(b.dpDiv).bind("setData.datepicker", function (e, f, h) { b.settings[f] = h }).bind("getData.datepicker", function (e, f) { return this._get(b, f) }); d.data(a, "datepicker", b); this._setDate(b, this._getDefaultDate(b), true); this._updateDatepicker(b); this._updateAlternate(b); b.dpDiv.show() } }, _dialogDatepicker: function (a, b, c, e, f) { a = this._dialogInst; if (!a) { this.uuid += 1; this._dialogInput = d('<input type="text" id="' + ("dp" + this.uuid) + '" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>'); this._dialogInput.keydown(this._doKeyDown); d("body").append(this._dialogInput); a = this._dialogInst = this._newInst(this._dialogInput, false); a.settings = {}; d.data(this._dialogInput[0], "datepicker", a) } E(a.settings, e || {}); b = b && b.constructor == Date ? this._formatDate(a, b) : b; this._dialogInput.val(b); this._pos = f ? f.length ? f : [f.pageX, f.pageY] : null; if (!this._pos) this._pos = [document.documentElement.clientWidth / 2 - 100 + (document.documentElement.scrollLeft || document.body.scrollLeft), document.documentElement.clientHeight / 2 - 150 + (document.documentElement.scrollTop || document.body.scrollTop)]; this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"); a.settings.onSelect = c; this._inDialog = true; this.dpDiv.addClass(this._dialogClass); this._showDatepicker(this._dialogInput[0]); d.blockUI && d.blockUI(this.dpDiv); d.data(this._dialogInput[0], "datepicker", a); return this }, _destroyDatepicker: function (a) { var b = d(a), c = d.data(a, "datepicker"); if (b.hasClass(this.markerClassName)) { var e = a.nodeName.toLowerCase(); d.removeData(a, "datepicker"); if (e == "input") { c.append.remove(); c.trigger.remove(); b.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp) } else if (e == "div" || e == "span") b.removeClass(this.markerClassName).empty() } }, _enableDatepicker: function (a) { var b = d(a), c = d.data(a, "datepicker"); if (b.hasClass(this.markerClassName)) { var e = a.nodeName.toLowerCase(); if (e == "input") { a.disabled = false; c.trigger.filter("button").each(function () { this.disabled = false }).end().filter("img").css({ opacity: "1.0", cursor: "" }) } else if (e == "div" || e == "span") b.children("." + this._inlineClass).children().removeClass("ui-state-disabled"); this._disabledInputs = d.map(this._disabledInputs, function (f) { return f == a ? null : f }) } }, _disableDatepicker: function (a) { var b = d(a), c = d.data(a, "datepicker"); if (b.hasClass(this.markerClassName)) { var e = a.nodeName.toLowerCase(); if (e == "input") { a.disabled = true; c.trigger.filter("button").each(function () { this.disabled = true }).end().filter("img").css({ opacity: "0.5", cursor: "default" }) } else if (e == "div" || e == "span") b.children("." + this._inlineClass).children().addClass("ui-state-disabled"); this._disabledInputs = d.map(this._disabledInputs, function (f) { return f == a ? null : f }); this._disabledInputs[this._disabledInputs.length] = a } }, _isDisabledDatepicker: function (a) { if (!a) return false; for (var b = 0; b < this._disabledInputs.length; b++) if (this._disabledInputs[b] == a) return true; return false }, _getInst: function (a) { try { return d.data(a, "datepicker") } catch (b) { throw "Missing instance data for this datepicker"; } }, _optionDatepicker: function (a, b, c) { var e = this._getInst(a); if (arguments.length == 2 && typeof b == "string") return b == "defaults" ? d.extend({}, d.datepicker._defaults) : e ? b == "all" ? d.extend({}, e.settings) : this._get(e, b) : null; var f = b || {}; if (typeof b == "string") { f = {}; f[b] = c } if (e) { this._curInst == e && this._hideDatepicker(); var h = this._getDateDatepicker(a, true); E(e.settings, f); this._attachments(d(a), e); this._autoSize(e); this._setDateDatepicker(a, h); this._updateDatepicker(e) } }, _changeDatepicker: function (a, b, c) { this._optionDatepicker(a, b, c) }, _refreshDatepicker: function (a) { (a = this._getInst(a)) && this._updateDatepicker(a) }, _setDateDatepicker: function (a, b) { if (a = this._getInst(a)) { this._setDate(a, b); this._updateDatepicker(a); this._updateAlternate(a) } }, _getDateDatepicker: function (a, b) { (a = this._getInst(a)) && !a.inline && this._setDateFromField(a, b); return a ? this._getDate(a) : null }, _doKeyDown: function (a) { var b = d.datepicker._getInst(a.target), c = true, e = b.dpDiv.is(".ui-datepicker-rtl"); b._keyEvent = true; if (d.datepicker._datepickerShowing) switch (a.keyCode) { case 9: d.datepicker._hideDatepicker(); c = false; break; case 13: c = d("td." + d.datepicker._dayOverClass + ":not(." + d.datepicker._currentClass + ")", b.dpDiv); c[0] ? d.datepicker._selectDay(a.target, b.selectedMonth, b.selectedYear, c[0]) : d.datepicker._hideDatepicker(); return false; case 27: d.datepicker._hideDatepicker(); break; case 33: d.datepicker._adjustDate(a.target, a.ctrlKey ? -d.datepicker._get(b, "stepBigMonths") : -d.datepicker._get(b, "stepMonths"), "M"); break; case 34: d.datepicker._adjustDate(a.target, a.ctrlKey ? +d.datepicker._get(b, "stepBigMonths") : +d.datepicker._get(b, "stepMonths"), "M"); break; case 35: if (a.ctrlKey || a.metaKey) d.datepicker._clearDate(a.target); c = a.ctrlKey || a.metaKey; break; case 36: if (a.ctrlKey || a.metaKey) d.datepicker._gotoToday(a.target); c = a.ctrlKey || a.metaKey; break; case 37: if (a.ctrlKey || a.metaKey) d.datepicker._adjustDate(a.target, e ? +1 : -1, "D"); c = a.ctrlKey || a.metaKey; if (a.originalEvent.altKey) d.datepicker._adjustDate(a.target, a.ctrlKey ? -d.datepicker._get(b, "stepBigMonths") : -d.datepicker._get(b, "stepMonths"), "M"); break; case 38: if (a.ctrlKey || a.metaKey) d.datepicker._adjustDate(a.target, -7, "D"); c = a.ctrlKey || a.metaKey; break; case 39: if (a.ctrlKey || a.metaKey) d.datepicker._adjustDate(a.target, e ? -1 : +1, "D"); c = a.ctrlKey || a.metaKey; if (a.originalEvent.altKey) d.datepicker._adjustDate(a.target, a.ctrlKey ? +d.datepicker._get(b, "stepBigMonths") : +d.datepicker._get(b, "stepMonths"), "M"); break; case 40: if (a.ctrlKey || a.metaKey) d.datepicker._adjustDate(a.target, +7, "D"); c = a.ctrlKey || a.metaKey; break; default: c = false } else if (a.keyCode == 36 && a.ctrlKey) d.datepicker._showDatepicker(this); else c = false; if (c) { a.preventDefault(); a.stopPropagation() } }, _doKeyPress: function (a) { var b = d.datepicker._getInst(a.target); if (d.datepicker._get(b, "constrainInput")) { b = d.datepicker._possibleChars(d.datepicker._get(b, "dateFormat")); var c = String.fromCharCode(a.charCode == G ? a.keyCode : a.charCode); return a.ctrlKey || a.metaKey || c < " " || !b || b.indexOf(c) > -1 } }, _doKeyUp: function (a) { a = d.datepicker._getInst(a.target); if (a.input.val() != a.lastVal) try { if (d.datepicker.parseDate(d.datepicker._get(a, "dateFormat"), a.input ? a.input.val() : null, d.datepicker._getFormatConfig(a))) { d.datepicker._setDateFromField(a); d.datepicker._updateAlternate(a); d.datepicker._updateDatepicker(a) } } catch (b) { d.datepicker.log(b) } return true }, _showDatepicker: function (a) { a = a.target || a; if (a.nodeName.toLowerCase() != "input") a = d("input", a.parentNode)[0]; if (!(d.datepicker._isDisabledDatepicker(a) || d.datepicker._lastInput == a)) { var b = d.datepicker._getInst(a); d.datepicker._curInst && d.datepicker._curInst != b && d.datepicker._curInst.dpDiv.stop(true, true); var c = d.datepicker._get(b, "beforeShow"); E(b.settings, c ? c.apply(a, [a, b]) : {}); b.lastVal = null; d.datepicker._lastInput = a; d.datepicker._setDateFromField(b); if (d.datepicker._inDialog) a.value = ""; if (!d.datepicker._pos) { d.datepicker._pos = d.datepicker._findPos(a); d.datepicker._pos[1] += a.offsetHeight } var e = false; d(a).parents().each(function () { e |= d(this).css("position") == "fixed"; return !e }); if (e && d.browser.opera) { d.datepicker._pos[0] -= document.documentElement.scrollLeft; d.datepicker._pos[1] -= document.documentElement.scrollTop } c = { left: d.datepicker._pos[0], top: d.datepicker._pos[1] }; d.datepicker._pos = null; b.dpDiv.empty(); b.dpDiv.css({ position: "absolute", display: "block", top: "-1000px" }); d.datepicker._updateDatepicker(b); c = d.datepicker._checkOffset(b, c, e); b.dpDiv.css({ position: d.datepicker._inDialog && d.blockUI ? "static" : e ? "fixed" : "absolute", display: "none", left: c.left + "px", top: c.top + "px" }); if (!b.inline) { c = d.datepicker._get(b, "showAnim"); var f = d.datepicker._get(b, "duration"), h = function () { d.datepicker._datepickerShowing = true; var i = b.dpDiv.find("iframe.ui-datepicker-cover"); if (i.length) { var g = d.datepicker._getBorders(b.dpDiv); i.css({ left: -g[0], top: -g[1], width: b.dpDiv.outerWidth(), height: b.dpDiv.outerHeight() }) } }; b.dpDiv.zIndex(d(a).zIndex() + 1); d.effects && d.effects[c] ? b.dpDiv.show(c, d.datepicker._get(b, "showOptions"), f, h) : b.dpDiv[c || "show"](c ? f : null, h); if (!c || !f) h(); b.input.is(":visible") && !b.input.is(":disabled") && b.input.focus(); d.datepicker._curInst = b } } }, _updateDatepicker: function (a) { var b = this, c = d.datepicker._getBorders(a.dpDiv); a.dpDiv.empty().append(this._generateHTML(a)); var e = a.dpDiv.find("iframe.ui-datepicker-cover"); e.length && e.css({ left: -c[0], top: -c[1], width: a.dpDiv.outerWidth(), height: a.dpDiv.outerHeight() }); a.dpDiv.find("button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a").bind("mouseout", function () { d(this).removeClass("ui-state-hover"); this.className.indexOf("ui-datepicker-prev") != -1 && d(this).removeClass("ui-datepicker-prev-hover"); this.className.indexOf("ui-datepicker-next") != -1 && d(this).removeClass("ui-datepicker-next-hover") }).bind("mouseover", function () { if (!b._isDisabledDatepicker(a.inline ? a.dpDiv.parent()[0] : a.input[0])) { d(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"); d(this).addClass("ui-state-hover"); this.className.indexOf("ui-datepicker-prev") != -1 && d(this).addClass("ui-datepicker-prev-hover"); this.className.indexOf("ui-datepicker-next") != -1 && d(this).addClass("ui-datepicker-next-hover") } }).end().find("." + this._dayOverClass + " a").trigger("mouseover").end(); c = this._getNumberOfMonths(a); e = c[1]; e > 1 ? a.dpDiv.addClass("ui-datepicker-multi-" + e).css("width", 17 * e + "em") : a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""); a.dpDiv[(c[0] != 1 || c[1] != 1 ? "add" : "remove") + "Class"]("ui-datepicker-multi"); a.dpDiv[(this._get(a, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"); a == d.datepicker._curInst && d.datepicker._datepickerShowing && a.input && a.input.is(":visible") && !a.input.is(":disabled") && a.input.focus(); if (a.yearshtml) { var f = a.yearshtml; setTimeout(function () { f === a.yearshtml && a.dpDiv.find("select.ui-datepicker-year:first").replaceWith(a.yearshtml); f = a.yearshtml = null }, 0) } }, _getBorders: function (a) { var b = function (c) { return { thin: 1, medium: 2, thick: 3}[c] || c }; return [parseFloat(b(a.css("border-left-width"))), parseFloat(b(a.css("border-top-width")))] }, _checkOffset: function (a, b, c) { var e = a.dpDiv.outerWidth(), f = a.dpDiv.outerHeight(), h = a.input ? a.input.outerWidth() : 0, i = a.input ? a.input.outerHeight() : 0, g = document.documentElement.clientWidth + d(document).scrollLeft(), j = document.documentElement.clientHeight + d(document).scrollTop(); b.left -= this._get(a, "isRTL") ? e - h : 0; b.left -= c && b.left == a.input.offset().left ? d(document).scrollLeft() : 0; b.top -= c && b.top == a.input.offset().top + i ? d(document).scrollTop() : 0; b.left -= Math.min(b.left, b.left + e > g && g > e ? Math.abs(b.left + e - g) : 0); b.top -= Math.min(b.top, b.top + f > j && j > f ? Math.abs(f + i) : 0); return b }, _findPos: function (a) { for (var b = this._get(this._getInst(a), "isRTL"); a && (a.type == "hidden" || a.nodeType != 1); ) a = a[b ? "previousSibling" : "nextSibling"]; a = d(a).offset(); return [a.left, a.top] }, _hideDatepicker: function (a) { var b = this._curInst; if (!(!b || a && b != d.data(a, "datepicker"))) if (this._datepickerShowing) { a = this._get(b, "showAnim"); var c = this._get(b, "duration"), e = function () { d.datepicker._tidyDialog(b); this._curInst = null }; d.effects && d.effects[a] ? b.dpDiv.hide(a, d.datepicker._get(b, "showOptions"), c, e) : b.dpDiv[a == "slideDown" ? "slideUp" : a == "fadeIn" ? "fadeOut" : "hide"](a ? c : null, e); a || e(); if (a = this._get(b, "onClose")) a.apply(b.input ? b.input[0] : null, [b.input ? b.input.val() : "", b]); this._datepickerShowing = false; this._lastInput = null; if (this._inDialog) { this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" }); if (d.blockUI) { d.unblockUI(); d("body").append(this.dpDiv) } } this._inDialog = false } }, _tidyDialog: function (a) { a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar") }, _checkExternalClick: function (a) { if (d.datepicker._curInst) { a = d(a.target); a[0].id != d.datepicker._mainDivId && a.parents("#" + d.datepicker._mainDivId).length == 0 && !a.hasClass(d.datepicker.markerClassName) && !a.hasClass(d.datepicker._triggerClass) && d.datepicker._datepickerShowing && !(d.datepicker._inDialog && d.blockUI) && d.datepicker._hideDatepicker() } }, _adjustDate: function (a, b, c) { a = d(a); var e = this._getInst(a[0]); if (!this._isDisabledDatepicker(a[0])) { this._adjustInstDate(e, b + (c == "M" ? this._get(e, "showCurrentAtPos") : 0), c); this._updateDatepicker(e) } }, _gotoToday: function (a) { a = d(a); var b = this._getInst(a[0]); if (this._get(b, "gotoCurrent") && b.currentDay) { b.selectedDay = b.currentDay; b.drawMonth = b.selectedMonth = b.currentMonth; b.drawYear = b.selectedYear = b.currentYear } else { var c = new Date; b.selectedDay = c.getDate(); b.drawMonth = b.selectedMonth = c.getMonth(); b.drawYear = b.selectedYear = c.getFullYear() } this._notifyChange(b); this._adjustDate(a) }, _selectMonthYear: function (a, b, c) { a = d(a); var e = this._getInst(a[0]); e._selectingMonthYear = false; e["selected" + (c == "M" ? "Month" : "Year")] = e["draw" + (c == "M" ? "Month" : "Year")] = parseInt(b.options[b.selectedIndex].value, 10); this._notifyChange(e); this._adjustDate(a) }, _clickMonthYear: function (a) { var b = this._getInst(d(a)[0]); b.input && b._selectingMonthYear && setTimeout(function () { b.input.focus() }, 0); b._selectingMonthYear = !b._selectingMonthYear }, _selectDay: function (a, b, c, e) { var f = d(a); if (!(d(e).hasClass(this._unselectableClass) || this._isDisabledDatepicker(f[0]))) { f = this._getInst(f[0]); f.selectedDay = f.currentDay = d("a", e).html(); f.selectedMonth = f.currentMonth = b; f.selectedYear = f.currentYear = c; this._selectDate(a, this._formatDate(f, f.currentDay, f.currentMonth, f.currentYear)) } }, _clearDate: function (a) { a = d(a); this._getInst(a[0]); this._selectDate(a, "") }, _selectDate: function (a, b) { a = this._getInst(d(a)[0]); b = b != null ? b : this._formatDate(a); a.input && a.input.val(b); this._updateAlternate(a); var c = this._get(a, "onSelect"); if (c) c.apply(a.input ? a.input[0] : null, [b, a]); else a.input && a.input.trigger("change"); if (a.inline) this._updateDatepicker(a); else { this._hideDatepicker(); this._lastInput = a.input[0]; typeof a.input[0] != "object" && a.input.focus(); this._lastInput = null } }, _updateAlternate: function (a) { var b = this._get(a, "altField"); if (b) { var c = this._get(a, "altFormat") || this._get(a, "dateFormat"), e = this._getDate(a), f = this.formatDate(c, e, this._getFormatConfig(a)); d(b).each(function () { d(this).val(f) }) } }, noWeekends: function (a) { a = a.getDay(); return [a > 0 && a < 6, ""] }, iso8601Week: function (a) { a = new Date(a.getTime()); a.setDate(a.getDate() + 4 - (a.getDay() || 7)); var b = a.getTime(); a.setMonth(0); a.setDate(1); return Math.floor(Math.round((b - a) / 864E5) / 7) + 1 }, parseDate: function (a, b, c) { if (a == null || b == null) throw "Invalid arguments"; b = typeof b == "object" ? b.toString() : b + ""; if (b == "") return null; var e = (c ? c.shortYearCutoff : null) || this._defaults.shortYearCutoff; e = typeof e != "string" ? e : (new Date).getFullYear() % 100 + parseInt(e, 10); for (var f = (c ? c.dayNamesShort : null) || this._defaults.dayNamesShort, h = (c ? c.dayNames : null) || this._defaults.dayNames, i = (c ? c.monthNamesShort : null) || this._defaults.monthNamesShort, g = (c ? c.monthNames : null) || this._defaults.monthNames, j = c = -1, l = -1, u = -1, k = false, o = function (p) { (p = z + 1 < a.length && a.charAt(z + 1) == p) && z++; return p }, m = function (p) { var v = o(p); p = new RegExp("^\\d{1," + (p == "@" ? 14 : p == "!" ? 20 : p == "y" && v ? 4 : p == "o" ? 3 : 2) + "}"); p = b.substring(s).match(p); if (!p) throw "Missing number at position " + s; s += p[0].length; return parseInt(p[0], 10) }, n = function (p, v, H) { p = o(p) ? H : v; for (v = 0; v < p.length; v++) if (b.substr(s, p[v].length).toLowerCase() == p[v].toLowerCase()) { s += p[v].length; return v + 1 } throw "Unknown name at position " + s; }, r = function () { if (b.charAt(s) != a.charAt(z)) throw "Unexpected literal at position " + s; s++ }, s = 0, z = 0; z < a.length; z++) if (k) if (a.charAt(z) == "'" && !o("'")) k = false; else r(); else switch (a.charAt(z)) { case "d": l = m("d"); break; case "D": n("D", f, h); break; case "o": u = m("o"); break; case "m": j = m("m"); break; case "M": j = n("M", i, g); break; case "y": c = m("y"); break; case "@": var w = new Date(m("@")); c = w.getFullYear(); j = w.getMonth() + 1; l = w.getDate(); break; case "!": w = new Date((m("!") - this._ticksTo1970) / 1E4); c = w.getFullYear(); j = w.getMonth() + 1; l = w.getDate(); break; case "'": if (o("'")) r(); else k = true; break; default: r() } if (c == -1) c = (new Date).getFullYear(); else if (c < 100) c += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (c <= e ? 0 : -100); if (u > -1) { j = 1; l = u; do { e = this._getDaysInMonth(c, j - 1); if (l <= e) break; j++; l -= e } while (1) } w = this._daylightSavingAdjust(new Date(c, j - 1, l)); if (w.getFullYear() != c || w.getMonth() + 1 != j || w.getDate() != l) throw "Invalid date"; return w }, ATOM: "yy-mm-dd", COOKIE: "D, dd M yy", ISO_8601: "yy-mm-dd", RFC_822: "D, d M y", RFC_850: "DD, dd-M-y", RFC_1036: "D, d M y", RFC_1123: "D, d M yy", RFC_2822: "D, d M yy", RSS: "D, d M y", TICKS: "!", TIMESTAMP: "@", W3C: "yy-mm-dd", _ticksTo1970: (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 24 * 60 * 60 * 1E7, formatDate: function (a, b, c) { if (!b) return ""; var e = (c ? c.dayNamesShort : null) || this._defaults.dayNamesShort, f = (c ? c.dayNames : null) || this._defaults.dayNames, h = (c ? c.monthNamesShort : null) || this._defaults.monthNamesShort; c = (c ? c.monthNames : null) || this._defaults.monthNames; var i = function (o) { (o = k + 1 < a.length && a.charAt(k + 1) == o) && k++; return o }, g = function (o, m, n) { m = "" + m; if (i(o)) for (; m.length < n; ) m = "0" + m; return m }, j = function (o, m, n, r) { return i(o) ? r[m] : n[m] }, l = "", u = false; if (b) for (var k = 0; k < a.length; k++) if (u) if (a.charAt(k) == "'" && !i("'")) u = false; else l += a.charAt(k); else switch (a.charAt(k)) { case "d": l += g("d", b.getDate(), 2); break; case "D": l += j("D", b.getDay(), e, f); break; case "o": l += g("o", (b.getTime() - (new Date(b.getFullYear(), 0, 0)).getTime()) / 864E5, 3); break; case "m": l += g("m", b.getMonth() + 1, 2); break; case "M": l += j("M", b.getMonth(), h, c); break; case "y": l += i("y") ? b.getFullYear() : (b.getYear() % 100 < 10 ? "0" : "") + b.getYear() % 100; break; case "@": l += b.getTime(); break; case "!": l += b.getTime() * 1E4 + this._ticksTo1970; break; case "'": if (i("'")) l += "'"; else u = true; break; default: l += a.charAt(k) } return l }, _possibleChars: function (a) { for (var b = "", c = false, e = function (h) { (h = f + 1 < a.length && a.charAt(f + 1) == h) && f++; return h }, f = 0; f < a.length; f++) if (c) if (a.charAt(f) == "'" && !e("'")) c = false; else b += a.charAt(f); else switch (a.charAt(f)) { case "d": case "m": case "y": case "@": b += "0123456789"; break; case "D": case "M": return null; case "'": if (e("'")) b += "'"; else c = true; break; default: b += a.charAt(f) } return b }, _get: function (a, b) { return a.settings[b] !== G ? a.settings[b] : this._defaults[b] }, _setDateFromField: function (a, b) { if (a.input.val() != a.lastVal) { var c = this._get(a, "dateFormat"), e = a.lastVal = a.input ? a.input.val() : null, f, h; f = h = this._getDefaultDate(a); var i = this._getFormatConfig(a); try { f = this.parseDate(c, e, i) || h } catch (g) { this.log(g); e = b ? "" : e } a.selectedDay = f.getDate(); a.drawMonth = a.selectedMonth = f.getMonth(); a.drawYear = a.selectedYear = f.getFullYear(); a.currentDay = e ? f.getDate() : 0; a.currentMonth = e ? f.getMonth() : 0; a.currentYear = e ? f.getFullYear() : 0; this._adjustInstDate(a) } }, _getDefaultDate: function (a) { return this._restrictMinMax(a, this._determineDate(a, this._get(a, "defaultDate"), new Date)) }, _determineDate: function (a, b, c) { var e = function (h) { var i = new Date; i.setDate(i.getDate() + h); return i }, f = function (h) { try { return d.datepicker.parseDate(d.datepicker._get(a, "dateFormat"), h, d.datepicker._getFormatConfig(a)) } catch (i) { } var g = (h.toLowerCase().match(/^c/) ? d.datepicker._getDate(a) : null) || new Date, j = g.getFullYear(), l = g.getMonth(); g = g.getDate(); for (var u = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, k = u.exec(h); k; ) { switch (k[2] || "d") { case "d": case "D": g += parseInt(k[1], 10); break; case "w": case "W": g += parseInt(k[1], 10) * 7; break; case "m": case "M": l += parseInt(k[1], 10); g = Math.min(g, d.datepicker._getDaysInMonth(j, l)); break; case "y": case "Y": j += parseInt(k[1], 10); g = Math.min(g, d.datepicker._getDaysInMonth(j, l)); break } k = u.exec(h) } return new Date(j, l, g) }; if (b = (b = b == null || b === "" ? c : typeof b == "string" ? f(b) : typeof b == "number" ? isNaN(b) ? c : e(b) : new Date(b.getTime())) && b.toString() == "Invalid Date" ? c : b) { b.setHours(0); b.setMinutes(0); b.setSeconds(0); b.setMilliseconds(0) } return this._daylightSavingAdjust(b) }, _daylightSavingAdjust: function (a) { if (!a) return null; a.setHours(a.getHours() > 12 ? a.getHours() + 2 : 0); return a }, _setDate: function (a, b, c) { var e = !b, f = a.selectedMonth, h = a.selectedYear; b = this._restrictMinMax(a, this._determineDate(a, b, new Date)); a.selectedDay = a.currentDay = b.getDate(); a.drawMonth = a.selectedMonth = a.currentMonth = b.getMonth(); a.drawYear = a.selectedYear = a.currentYear = b.getFullYear(); if ((f != a.selectedMonth || h != a.selectedYear) && !c) this._notifyChange(a); this._adjustInstDate(a); if (a.input) a.input.val(e ? "" : this._formatDate(a)) }, _getDate: function (a) { return !a.currentYear || a.input && a.input.val() == "" ? null : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay)) }, _generateHTML: function (a) { var b = new Date; b = this._daylightSavingAdjust(new Date(b.getFullYear(), b.getMonth(), b.getDate())); var c = this._get(a, "isRTL"), e = this._get(a, "showButtonPanel"), f = this._get(a, "hideIfNoPrevNext"), h = this._get(a, "navigationAsDateFormat"), i = this._getNumberOfMonths(a), g = this._get(a, "showCurrentAtPos"), j = this._get(a, "stepMonths"), l = i[0] != 1 || i[1] != 1, u = this._daylightSavingAdjust(!a.currentDay ? new Date(9999, 9, 9) : new Date(a.currentYear, a.currentMonth, a.currentDay)), k = this._getMinMaxDate(a, "min"), o = this._getMinMaxDate(a, "max"); g = a.drawMonth - g; var m = a.drawYear; if (g < 0) { g += 12; m-- } if (o) { var n = this._daylightSavingAdjust(new Date(o.getFullYear(), o.getMonth() - i[0] * i[1] + 1, o.getDate())); for (n = k && n < k ? k : n; this._daylightSavingAdjust(new Date(m, g, 1)) > n; ) { g--; if (g < 0) { g = 11; m-- } } } a.drawMonth = g; a.drawYear = m; n = this._get(a, "prevText"); n = !h ? n : this.formatDate(n, this._daylightSavingAdjust(new Date(m, g - j, 1)), this._getFormatConfig(a)); n = this._canAdjustMonth(a, -1, m, g) ? '<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_' + y + ".datepicker._adjustDate('#" + a.id + "', -" + j + ", 'M');\" title=\"" + n + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "e" : "w") + '">' + n + "</span></a>" : f ? "" : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="' + n + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "e" : "w") + '">' + n + "</span></a>"; var r = this._get(a, "nextText"); r = !h ? r : this.formatDate(r, this._daylightSavingAdjust(new Date(m, g + j, 1)), this._getFormatConfig(a)); f = this._canAdjustMonth(a, +1, m, g) ? '<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_' + y + ".datepicker._adjustDate('#" + a.id + "', +" + j + ", 'M');\" title=\"" + r + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "w" : "e") + '">' + r + "</span></a>" : f ? "" : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="' + r + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "w" : "e") + '">' + r + "</span></a>"; j = this._get(a, "currentText"); r = this._get(a, "gotoCurrent") && a.currentDay ? u : b; j = !h ? j : this.formatDate(j, r, this._getFormatConfig(a)); h = !a.inline ? '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' + y + '.datepicker._hideDatepicker();">' + this._get(a, "closeText") + "</button>" : ""; e = e ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (c ? h : "") + (this._isInRange(a, r) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_' + y + ".datepicker._gotoToday('#" + a.id + "');\">" + j + "</button>" : "") + (c ? "" : h) + "</div>" : ""; h = parseInt(this._get(a, "firstDay"), 10); h = isNaN(h) ? 0 : h; j = this._get(a, "showWeek"); r = this._get(a, "dayNames"); this._get(a, "dayNamesShort"); var s = this._get(a, "dayNamesMin"), z = this._get(a, "monthNames"), w = this._get(a, "monthNamesShort"), p = this._get(a, "beforeShowDay"), v = this._get(a, "showOtherMonths"), H = this._get(a, "selectOtherMonths"); this._get(a, "calculateWeek"); for (var L = this._getDefaultDate(a), I = "", C = 0; C < i[0]; C++) { for (var M = "", D = 0; D < i[1]; D++) { var N = this._daylightSavingAdjust(new Date(m, g, a.selectedDay)), t = " ui-corner-all", x = ""; if (l) { x += '<div class="ui-datepicker-group'; if (i[1] > 1) switch (D) { case 0: x += " ui-datepicker-group-first"; t = " ui-corner-" + (c ? "right" : "left"); break; case i[1] - 1: x += " ui-datepicker-group-last"; t = " ui-corner-" + (c ? "left" : "right"); break; default: x += " ui-datepicker-group-middle"; t = ""; break } x += '">' } x += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + t + '">' + (/all|left/.test(t) && C == 0 ? c ? f : n : "") + (/all|right/.test(t) && C == 0 ? c ? n : f : "") + this._generateMonthYearHeader(a, g, m, k, o, C > 0 || D > 0, z, w) + '</div><table class="ui-datepicker-calendar"><thead><tr>'; var A = j ? '<th class="ui-datepicker-week-col">' + this._get(a, "weekHeader") + "</th>" : ""; for (t = 0; t < 7; t++) { var q = (t + h) % 7; A += "<th" + ((t + h + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : "") + '><span title="' + r[q] + '">' + s[q] + "</span></th>" } x += A + "</tr></thead><tbody>"; A = this._getDaysInMonth(m, g); if (m == a.selectedYear && g == a.selectedMonth) a.selectedDay = Math.min(a.selectedDay, A); t = (this._getFirstDayOfMonth(m, g) - h + 7) % 7; A = l ? 6 : Math.ceil((t + A) / 7); q = this._daylightSavingAdjust(new Date(m, g, 1 - t)); for (var O = 0; O < A; O++) { x += "<tr>"; var P = !j ? "" : '<td class="ui-datepicker-week-col">' + this._get(a, "calculateWeek")(q) + "</td>"; for (t = 0; t < 7; t++) { var F = p ? p.apply(a.input ? a.input[0] : null, [q]) : [true, ""], B = q.getMonth() != g, J = B && !H || !F[0] || k && q < k || o && q > o; P += '<td class="' + ((t + h + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (B ? " ui-datepicker-other-month" : "") + (q.getTime() == N.getTime() && g == a.selectedMonth && a._keyEvent || L.getTime() == q.getTime() && L.getTime() == N.getTime() ? " " + this._dayOverClass : "") + (J ? " " + this._unselectableClass + " ui-state-disabled" : "") + (B && !v ? "" : " " + F[1] + (q.getTime() == u.getTime() ? " " + this._currentClass : "") + (q.getTime() == b.getTime() ? " ui-datepicker-today" : "")) + '"' + ((!B || v) && F[2] ? ' title="' + F[2] + '"' : "") + (J ? "" : ' onclick="DP_jQuery_' + y + ".datepicker._selectDay('#" + a.id + "'," + q.getMonth() + "," + q.getFullYear() + ', this);return false;"') + ">" + (B && !v ? "&#xa0;" : J ? '<span class="ui-state-default">' + q.getDate() + "</span>" : '<a class="ui-state-default' + (q.getTime() == b.getTime() ? " ui-state-highlight" : "") + (q.getTime() == u.getTime() ? " ui-state-active" : "") + (B ? " ui-priority-secondary" : "") + '" href="#">' + q.getDate() + "</a>") + "</td>"; q.setDate(q.getDate() + 1); q = this._daylightSavingAdjust(q) } x += P + "</tr>" } g++; if (g > 11) { g = 0; m++ } x += "</tbody></table>" + (l ? "</div>" + (i[0] > 0 && D == i[1] - 1 ? '<div class="ui-datepicker-row-break"></div>' : "") : ""); M += x } I += M } I += e + (d.browser.msie && parseInt(d.browser.version, 10) < 7 && !a.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : ""); a._keyEvent = false; return I }, _generateMonthYearHeader: function (a, b, c, e, f, h, i, g) { var j = this._get(a, "changeMonth"), l = this._get(a, "changeYear"), u = this._get(a, "showMonthAfterYear"), k = '<div class="ui-datepicker-title">', o = ""; if (h || !j) o += '<span class="ui-datepicker-month">' + i[b] + "</span>"; else { i = e && e.getFullYear() == c; var m = f && f.getFullYear() == c; o += '<select class="ui-datepicker-month" onchange="DP_jQuery_' + y + ".datepicker._selectMonthYear('#" + a.id + "', this, 'M');\" onclick=\"DP_jQuery_" + y + ".datepicker._clickMonthYear('#" + a.id + "');\">"; for (var n = 0; n < 12; n++) if ((!i || n >= e.getMonth()) && (!m || n <= f.getMonth())) o += '<option value="' + n + '"' + (n == b ? ' selected="selected"' : "") + ">" + g[n] + "</option>"; o += "</select>" } u || (k += o + (h || !(j && l) ? "&#xa0;" : "")); a.yearshtml = ""; if (h || !l) k += '<span class="ui-datepicker-year">' + c + "</span>"; else { g = this._get(a, "yearRange").split(":"); var r = (new Date).getFullYear(); i = function (s) { s = s.match(/c[+-].*/) ? c + parseInt(s.substring(1), 10) : s.match(/[+-].*/) ? r + parseInt(s, 10) : parseInt(s, 10); return isNaN(s) ? r : s }; b = i(g[0]); g = Math.max(b, i(g[1] || "")); b = e ? Math.max(b, e.getFullYear()) : b; g = f ? Math.min(g, f.getFullYear()) : g; for (a.yearshtml += '<select class="ui-datepicker-year" onchange="DP_jQuery_' + y + ".datepicker._selectMonthYear('#" + a.id + "', this, 'Y');\" onclick=\"DP_jQuery_" + y + ".datepicker._clickMonthYear('#" + a.id + "');\">"; b <= g; b++) a.yearshtml += '<option value="' + b + '"' + (b == c ? ' selected="selected"' : "") + ">" + b + "</option>"; a.yearshtml += "</select>"; if (d.browser.mozilla) k += '<select class="ui-datepicker-year"><option value="' + c + '" selected="selected">' + c + "</option></select>"; else { k += a.yearshtml; a.yearshtml = null } } k += this._get(a, "yearSuffix"); if (u) k += (h || !(j && l) ? "&#xa0;" : "") + o; k += "</div>"; return k }, _adjustInstDate: function (a, b, c) { var e = a.drawYear + (c == "Y" ? b : 0), f = a.drawMonth + (c == "M" ? b : 0); b = Math.min(a.selectedDay, this._getDaysInMonth(e, f)) + (c == "D" ? b : 0); e = this._restrictMinMax(a, this._daylightSavingAdjust(new Date(e, f, b))); a.selectedDay = e.getDate(); a.drawMonth = a.selectedMonth = e.getMonth(); a.drawYear = a.selectedYear = e.getFullYear(); if (c == "M" || c == "Y") this._notifyChange(a) }, _restrictMinMax: function (a, b) { var c = this._getMinMaxDate(a, "min"); a = this._getMinMaxDate(a, "max"); b = c && b < c ? c : b; return b = a && b > a ? a : b }, _notifyChange: function (a) { var b = this._get(a, "onChangeMonthYear"); if (b) b.apply(a.input ? a.input[0] : null, [a.selectedYear, a.selectedMonth + 1, a]) }, _getNumberOfMonths: function (a) { a = this._get(a, "numberOfMonths"); return a == null ? [1, 1] : typeof a == "number" ? [1, a] : a }, _getMinMaxDate: function (a, b) { return this._determineDate(a, this._get(a, b + "Date"), null) }, _getDaysInMonth: function (a, b) { return 32 - (new Date(a, b, 32)).getDate() }, _getFirstDayOfMonth: function (a, b) { return (new Date(a, b, 1)).getDay() }, _canAdjustMonth: function (a, b, c, e) { var f = this._getNumberOfMonths(a); c = this._daylightSavingAdjust(new Date(c, e + (b < 0 ? b : f[0] * f[1]), 1)); b < 0 && c.setDate(this._getDaysInMonth(c.getFullYear(), c.getMonth())); return this._isInRange(a, c) }, _isInRange: function (a, b) { var c = this._getMinMaxDate(a, "min"); a = this._getMinMaxDate(a, "max"); return (!c || b.getTime() >= c.getTime()) && (!a || b.getTime() <= a.getTime()) }, _getFormatConfig: function (a) { var b = this._get(a, "shortYearCutoff"); b = typeof b != "string" ? b : (new Date).getFullYear() % 100 + parseInt(b, 10); return { shortYearCutoff: b, dayNamesShort: this._get(a, "dayNamesShort"), dayNames: this._get(a, "dayNames"), monthNamesShort: this._get(a, "monthNamesShort"), monthNames: this._get(a, "monthNames")} }, _formatDate: function (a, b, c, e) { if (!b) { a.currentDay = a.selectedDay; a.currentMonth = a.selectedMonth; a.currentYear = a.selectedYear } b = b ? typeof b == "object" ? b : this._daylightSavingAdjust(new Date(e, c, b)) : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay)); return this.formatDate(this._get(a, "dateFormat"), b, this._getFormatConfig(a)) } }); d.fn.datepicker = function (a) { if (!d.datepicker.initialized) { d(document).mousedown(d.datepicker._checkExternalClick).find("body").append(d.datepicker.dpDiv); d.datepicker.initialized = true } var b = Array.prototype.slice.call(arguments, 1); if (typeof a == "string" && (a == "isDisabled" || a == "getDate" || a == "widget")) return d.datepicker["_" + a + "Datepicker"].apply(d.datepicker, [this[0]].concat(b)); if (a == "option" && arguments.length == 2 && typeof arguments[1] == "string") return d.datepicker["_" + a + "Datepicker"].apply(d.datepicker, [this[0]].concat(b)); return this.each(function () { typeof a == "string" ? d.datepicker["_" + a + "Datepicker"].apply(d.datepicker, [this].concat(b)) : d.datepicker._attachDatepicker(this, a) }) }; d.datepicker = new K; d.datepicker.initialized = false; d.datepicker.uuid = (new Date).getTime(); d.datepicker.version = "1.8.9"; window["DP_jQuery_" + y] = d })(jQuery);




/*-- Ajax Autocomplete for jQuery, version 1.1.3 > URL: http://www.devbridge.com/projects/autocomplete/ --*/
(function(d){function l(b,a,c){a="("+c.replace(m,"\\$1")+")";return b.replace(new RegExp(a,"gi"),"<strong>$1</strong>")}function i(b,a){this.el=d(b);this.el.attr("autocomplete","off");this.suggestions=[];this.data=[];this.badQueries=[];this.selectedIndex=-1;this.currentValue=this.el.val();this.intervalId=0;this.cachedResponse=[];this.onChangeInterval=null;this.ignoreValueChange=false;this.serviceUrl=a.serviceUrl;this.isLocal=false;this.options={autoSubmit:false,minChars:1,maxHeight:300,deferRequestBy:0, width:0,highlight:true,params:{},fnFormatResult:l,delimiter:null,zIndex:9999};this.initialize();this.setOptions(a)}var m=new RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\)","g");d.fn.autocomplete=function(b){return new i(this.get(0)||d("<input />"),b)};i.prototype={killerFn:null,initialize:function(){var b,a,c;b=this;a=Math.floor(Math.random()*1048576).toString(16);c="Autocomplete_"+a;this.killerFn=function(e){if(d(e.target).parents(".autocomplete").size()===0){b.killSuggestions(); b.disableKillerFn()}};if(!this.options.width)this.options.width=this.el.width();this.mainContainerId="AutocompleteContainter_"+a;d('<div id="'+this.mainContainerId+'" style="position:absolute;z-index:9999;"><div class="autocomplete-w1"><div class="autocomplete" id="'+c+'" style="display:none; width:300px;"></div></div></div>').appendTo("body");this.container=d("#"+c);this.fixPosition();window.opera?this.el.keypress(function(e){b.onKeyPress(e)}):this.el.keydown(function(e){b.onKeyPress(e)});this.el.keyup(function(e){b.onKeyUp(e)}); this.el.blur(function(){b.enableKillerFn()});this.el.focus(function(){b.fixPosition()})},setOptions:function(b){var a=this.options;d.extend(a,b);if(a.lookup){this.isLocal=true;if(d.isArray(a.lookup))a.lookup={suggestions:a.lookup,data:[]}}d("#"+this.mainContainerId).css({zIndex:a.zIndex});this.container.css({maxHeight:a.maxHeight+"px",width:a.width,minWidth:a.minWidth+"px"})},clearCache:function(){this.cachedResponse=[];this.badQueries=[]},disable:function(){this.disabled=true},enable:function(){this.disabled=false},fixPosition:function(){var b= this.el.offset();d("#"+this.mainContainerId).css({top:b.top+this.el.innerHeight()+"px",left:b.left+"px"})},enableKillerFn:function(){d(document).bind("click",this.killerFn)},disableKillerFn:function(){d(document).unbind("click",this.killerFn)},killSuggestions:function(){var b=this;this.stopKillSuggestions();this.intervalId=window.setInterval(function(){b.hide();b.stopKillSuggestions()},300)},stopKillSuggestions:function(){window.clearInterval(this.intervalId)},onKeyPress:function(b){if(!(this.disabled|| !this.enabled)){switch(b.keyCode){case 27:this.el.val(this.currentValue);this.hide();break;case 9:case 13:if(this.selectedIndex===-1){this.hide();return}this.select(this.selectedIndex);if(b.keyCode===9)return;break;case 38:this.moveUp();break;case 40:this.moveDown();break;default:return}b.stopImmediatePropagation();b.preventDefault()}},onKeyUp:function(b){if(!this.disabled){switch(b.keyCode){case 38:case 40:return}clearInterval(this.onChangeInterval);if(this.currentValue!==this.el.val())if(this.options.deferRequestBy> 0){var a=this;this.onChangeInterval=setInterval(function(){a.onValueChange()},this.options.deferRequestBy)}else this.onValueChange()}},onValueChange:function(){clearInterval(this.onChangeInterval);this.currentValue=this.el.val();var b=this.getQuery(this.currentValue);this.selectedIndex=-1;if(this.ignoreValueChange)this.ignoreValueChange=false;else b===""||b.length<this.options.minChars?this.hide():this.getSuggestions(b)},getQuery:function(b){var a;a=this.options.delimiter;if(!a)return d.trim(b);b= b.split(a);return d.trim(b[b.length-1])},getSuggestionsLocal:function(b){var a,c,e,g,f;c=this.options.lookup;e=c.suggestions.length;a={suggestions:[],data:[]};b=b.toLowerCase();for(f=0;f<e;f++){g=c.suggestions[f];if(g.toLowerCase().indexOf(b)===0){a.suggestions.push(g);a.data.push(c.data[f])}}return a},getSuggestions:function(b){var a,c;if((a=this.isLocal?this.getSuggestionsLocal(b):this.cachedResponse[b])&&d.isArray(a.suggestions)){this.suggestions=a.suggestions;this.data=a.data;this.suggest()}else if(!this.isBadQuery(b)){c= this;c.options.params.query=b;/*d.get(this.serviceUrl,c.options.params,function(e){c.processResponse(e)},"text")}*/d.ajax({type:'GET', url:this.serviceUrl, data:c.options.params, success:function(e){c.processResponse(e)}, dataType:'text', global:false});}},isBadQuery:function(b){for(var a=this.badQueries.length;a--;)if(b.indexOf(this.badQueries[a])===0)return true;return false},hide:function(){this.enabled=false;this.selectedIndex=-1;this.container.hide()},suggest:function(){if(this.suggestions.length===0)this.hide();else{var b,a,c,e,g,f,j,k;b=this;a=this.suggestions.length;e=this.options.fnFormatResult;g=this.getQuery(this.currentValue); j=function(h){return function(){b.activate(h)}};k=function(h){return function(){b.select(h)}};this.container.hide().empty();for(f=0;f<a;f++){c=this.suggestions[f];c=d((b.selectedIndex===f?'<div class="selected"':"<div")+' title="'+c+'">'+e(c,this.data[f],g)+"</div>");c.mouseover(j(f));c.click(k(f));this.container.append(c)}this.enabled=true;this.container.show()}},processResponse:function(b){var a;try{a=eval("("+b+")")}catch(c){return}if(!d.isArray(a.data))a.data=[];if(!this.options.noCache){this.cachedResponse[a.query]= a;a.suggestions.length===0&&this.badQueries.push(a.query)}if(a.query===this.getQuery(this.currentValue)){this.suggestions=a.suggestions;this.data=a.data;this.suggest()}},activate:function(b){var a,c;a=this.container.children();this.selectedIndex!==-1&&a.length>this.selectedIndex&&d(a.get(this.selectedIndex)).removeClass();this.selectedIndex=b;if(this.selectedIndex!==-1&&a.length>this.selectedIndex){c=a.get(this.selectedIndex);d(c).addClass("selected")}return c},deactivate:function(b,a){b.className= "";if(this.selectedIndex===a)this.selectedIndex=-1},select:function(b){var a;if(a=this.suggestions[b]){this.el.val(a);if(this.options.autoSubmit){a=this.el.parents("form");a.length>0&&a.get(0).submit()}this.ignoreValueChange=true;this.hide();this.onSelect(b)}},moveUp:function(){if(this.selectedIndex!==-1)if(this.selectedIndex===0){this.container.children().get(0).className="";this.selectedIndex=-1;this.el.val(this.currentValue)}else this.adjustScroll(this.selectedIndex-1)},moveDown:function(){this.selectedIndex!== this.suggestions.length-1&&this.adjustScroll(this.selectedIndex+1)},adjustScroll:function(b){var a,c,e;a=this.activate(b).offsetTop;c=this.container.scrollTop();e=c+this.options.maxHeight-25;if(a<c)this.container.scrollTop(a);else a>e&&this.container.scrollTop(a-this.options.maxHeight+25);this.el.val(this.getValue(this.suggestions[b]))},onSelect:function(b){var a,c;a=this.options.onSelect;c=this.suggestions[b];b=this.data[b];this.el.val(this.getValue(c));d.isFunction(a)&&a(c,b,this.el)},getValue:function(b){var a, c;a=this.options.delimiter;if(!a)return b;c=this.currentValue;a=c.split(a);if(a.length===1)return b;return c.substr(0,c.length-a[a.length-1].length)+b}}})(jQuery);

