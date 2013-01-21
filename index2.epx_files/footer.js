/* 
footer.js
Version: 12.19.11


Edit: 11.23.11 - fixed buynow page, and iFrame issues
12.07.11 - fixed the #htb-bottom-short detection.
12.19.11 - forgot to remove a console.log command - broke IE

*/


$(window).load(function () {
	
//$(document).ready(function () {
	
	//FootConsole = new rmConsole('Foot_Console');
	//FootConsole.log('Footer init...');
	
	/*===== CLICK EVENT - FOOTER QUICKLINK =====*/
	$('#quick-links a').bind('click', function () {
		getClass = $(this).attr('class');
		if (getClass === 'on') { closeOverlayQuicklinks(); }
		else {
			$('ul#footer-lefttop li#quick-links ul').slideDown(300, function () { buildQLshadow(); }).children('li:first').children('a').css('border', 'none');
			$(this).parent().addClass('on');
			$(this).addClass('on');
		}
		//return false;
	});


	/*===== CLICK EVENT - QUICKLINK CHILDREN ANCHORS  =====*/
	$('#quick-links ul li a').bind('click', function () {
		$('#QLshadow').remove();
		closeOverlayQuicklinks();
	});
	
	 /*===== FOOTER PRINT/TEXT CLICK EVENTS =====*/

    var isTextView = $('#footer-textview');
    var isPrintView = $('#footer-printview');
    if (isTextView[0]) { $(isTextView).click(function () { showText(); }) }
    if (isPrintView[0]) { $(isPrintView).click(function () { showPrint(); }) }
	
	
	if($('iframe')) {
		//alert('found iFrame');		
		setInterval("footerFix()", 2000);
	}
	
	
	//Add ICP number to footer for CHINA
	if (pgHref.indexOf('/china/') > 0) {
		chinaICPnumber = "沪ICP备09046015号-2";
		icpHTML = '<li class="ICP_style"><a href="http://www.miibeian.gov.cn/" target="_blank">' + chinaICPnumber + '</a></li>';
		$('#footer-lefttop').append(icpHTML);
	}
});

 
 
$(window).resize(function() {
  footerFix();
});
 

// CLOSE OVERLAY QUICKLINKS
function closeOverlayQuicklinks() {
	if ($('#footer #quick-links.on').length > 0) {
		removeQLshadow();
		$('ul#footer-lefttop li#quick-links ul').slideUp(300);
		$('#quick-links.on').removeClass('on');
		$('#quick-links a.on').removeClass('on');
	}
}





function footerFix() {
	//hCheck = $('#page').height() + 35 + 50; //Page Height is always 100% for some reason?
	
	var defMarginTop = '35px';
	var p = $("#page-content");
	var offset = p.offset();
	hCheck = offset.top + $("#page-content").height() + 35 + 50;;

    /*
	buyNowCheck = $("#htb-bottom-short").height();
	//alert(buyNowCheck + ' - buyNowCheck');
	if (buyNowCheck != null) {
		hCheck -= buyNowCheck;	
		alert('buyNowCheck'+  buyNowCheck);
	}
	*/
	
	//Buy Now Check. 
	if ($('#htb-bottom-short').length > 0) {
		//console.log('#htb-bottom-short detected');
		hCheck += $("#htb-bottom-short").height();
		defMarginTop = '140px';
	}
	
	//console.log('offset.top: ' + offset.top + ' | $("#page-content").height(): ' + $("#page-content").height() + ' | hCheck: ' + hCheck + ' - ' +  $(window).height());

	if (hCheck < parseInt($(window).height())) {
		//console.log("setting footer to absolute position");
		footerHeight = $('#footer').height(); //Need to get the height of the footer for different sizes (i.e. country selector)
		//alert(footerHeight + ' - footerHeight');
		//nHeight = $(window).height() - 50; // 50 - height of footer
		nHeight = $(window).height() - footerHeight;
		$('#footer').css({'position' : 'absolute', 'top' : nHeight + 'px', 'margin-top' : '0px'});
	} else {
		//Default Footer CSS	
		//console.log('default footer');
		$('#footer').css({'position' : 'relative', 'margin-top' : defMarginTop, 'top' : 'auto'});
	}
}





// SHADOW EFFECTS
function buildQLshadow() {
	$('#quick-links').prepend('<div id="QLshadow"></div>');
	$('#QLshadow').css({ 'width': ($('#quick-links ul').outerWidth() - 1), 'height': ($('#quick-links ul').outerHeight() - 1) });
}

function removeQLshadow() {
	$('#QLshadow').remove();
}


// FOOTER TEXT AND PRINT LINKS
function showBrowserView() {
    $('link[href=/global/ui/css/print.css]').attr('media', 'print');
    $('#BrowserView').delay(300).animate({ height: '0px' }, 400, function () { $('#BrowserView').remove(); });
    inPrintView = false; //set global var to false
}
function CreateBrowserViewButton(clickFunc) {
    if ($.browser.msie && $.browser.version == "6.0")
        $('body').append("<div id=\"BrowserView\" style=\"background-image: url('/global/ui/images/buttons/btn-browser-view.png') !important; width: 208px; height: 0px; zoom: 1; cursor: pointer; position: absolute; right: 0px; bottom: 0px; z-index: 100;\"></div>");
    else
        $('body').append("<div id=\"BrowserView\" style=\"background-image: url('/global/ui/images/buttons/btn-browser-view.png') !important; width: 208px; height: 0px; zoom: 1; cursor: pointer; position: fixed; right: 0px; bottom: 0px; z-index: 100;\"></div>");
    $('#BrowserView').delay(300).animate({ height: '23px' }, 400).click(clickFunc);
}
function showText() {
    $('link[href=/global/ui/css/sapcom.css]').attr('media', 'none');
    $('*').attr('style', '');
    CreateBrowserViewButton(function () { window.location.reload(); });
}
function showPrint() {
    $('link[href=/global/ui/css/print.css]').attr('media', 'all');
    CreateBrowserViewButton(showBrowserView);
    setTimeout(function () { inPrintView = true }, 1000); //set global var to true 1 second after click event
}