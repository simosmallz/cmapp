/* 
header.js
Version: 11.13.12


Edited:
02.21.12 - fixes Leyra's BLANK main nav HREFS (and thereby makes her templates work - theLink NEEDS to have a / in it.)
03.22.12 - added in nav-slider; made navSlider object - VS
03.23.12 - moved navSlider.init() to window.load so it fires correctly
06.07.12 - added code to make sure we highlight and move to the proper slide in the tertiary navigation.
11.12.12 - added the code for the dropdown
11.13.12 - tweaked the dropdown position to take into account the country selector bump
*/




$(window).load(function () {
	//Get country site: 
	cSite = $('#utilitynav-locationselect').text(); //United States(change Country/Language)
	cSite = cSite.substr(0,cSite.indexOf('(')); //Strip "(change Country/Language)"
	//Set Country Site Path (if nessessary - United States does not have a sub path
	if (cSite == "United States") {
		hasCountryPath = false;
	} else {
		hasCountryPath = true;	
	}

	subPathInt = currpath.indexOf('/', 1);
	if (hasCountryPath) {
		//If a country site find the SECOND slash to ignore the /uk/ or whatever
		subPathInt = currpath.indexOf('/', subPathInt + 1);
	} 
	
	subPath = currpath.substring(1, subPathInt);
	
	var currPath = location.pathname.substring(1);
	var targStr = currPath.split('/');
	
	//Main Nav
	if (targStr[2] != 'sap-bydesign') {
		var navMarked = false;
		$('#nav-main ul li').each(function(index) {
			theLink = $(this).find('a').attr('href');
			if (theLink == currpath) {
				//Highlight THIS menu item
				$(this).find('a').addClass('on');
				navMarked = true;
			}
		});
		
		if (!navMarked) {
			checkCount = 0; //This is to make sure we don't turn ALL of them on (if more than one is marked, we don't mark any.)
			$('#nav-main ul li').each(function(index) {
				//theLink = $(this).find('a').attr('href');
				//02.21.12 - this fixes Leyra's BLANK main nav HREFS (and thereby makes her templates work - theLink NEEDS to have a / in it.)
				theLink = ($(this).find('a').attr('href')) ? $(this).find('a').attr('href') : "/services-and-support/index.epx";
				if (theLink != "#") {
					slashCount = theLink.match(/[\/]/g, "").length;
					subPathInt = theLink.indexOf('/', 1);
					if (hasCountryPath) {
						//If a country site find the SECOND slash to ignore the /uk/ or whatever
						subPathInt = theLink.indexOf('/', subPathInt + 1);
					} 
					linkPath = theLink.substring(1, subPathInt); 
					
					initialSlash = linkPath.indexOf('/');
					if (initialSlash > -1 && !hasCountryPath) {
						linkPath = theLink.substring(0); 
					} 
					//alert('linkPath: ' + linkPath + ' <-> subpath: ' +  subPath);
					
					if (linkPath === subPath) {
						//Highlight THIS menu item
						checkCount++;
						//$(this).find('a').addClass('on');
						tempVar = $(this).find('a');
					}
				}
			});
			
			//alert(checkCount + ' ! - ' + $(tempVar).html());
			
			if (checkCount == 1) {
				$(tempVar).addClass('on');
			}
		}
	}
	
		
	//Activate the nav slider if required:
	navSlider.init();
	

	//Activate the login/username dropdown:
	lDropDown.initalize();

});


$(document).ready(function() {
	/*====== SITE SEARCH INIT  ======*/
    $('#searchsite-input').live("focus", function () {
        initInputs();
        $(this).autocomplete({ //header site search input
            minLength: 0,
            delay: 0,
            source: function (request, respond) {
                get_suggestions(request.term, function (response) {
                    respond(eval(response));
                });
            },
            minWidth: 146,
            width: '100%',
            zIndex: 9999,
            select: function (event, ui) {
                $('#searchsite-input').val(ui.item.value);
                $('#searchsite').submit();
            }
        });
    });


    $('#QueryText').autocomplete({
        minLength: 0,
        delay: 0,
        source: function (request, respond) {
            get_suggestions(request.term, function (response) {
                respond(eval(response))
            });
        },
        minWidth: 186,
        width: '100%',
        zIndex: 9999,
        select: function (event, ui) {
            $('#QueryText').val(ui.item.value);
            $('#searchresults').submit();
        }
    });

	
});






// ======================== HORIZONTAL NAVIGATION SLIDER ========================= //
// Rich Media JavaScript:	
// Created:	05.23.11 - VL
// Revised: 09.07.11 - VL -added slider indicator buttons
// Revised: 03.22.12 - VS - made an object; moved from nav-slider.js to header.js


var navSlider = {
	
	currentPosition: 0,
  	slideWidth: 910,
 	slides: $('.slide'),
  	numberOfSlides: 0,
	
	
	init: function() {
		navSlider.numberOfSlides = $('.slide').length;
		
	  // Removing the scrollbar
	  $('#slidesContainer').css('overflow', 'hidden');
	
	  // Wrap all .slides with #slideInner div
	 // navSlider.slides.wrapAll('<div id="slideInner"></div>')
	  // Float left to display horizontally, readjust .slides width
	 // .css({'float' : 'left','width' :  navSlider.slideWidth});
	  $('.slide').wrapAll('<div id="slideInner"></div>').css({'float' : 'left','width' :  navSlider.slideWidth});
	  
	
	  // Set #slideInner width equal to total width of all slides
	  $('#slideInner').css('width', navSlider.slideWidth * navSlider.numberOfSlides);
	
	  // Insert next/previous controls in the DOM
	  $('#slider-navigation #slidesContainer')
		.prepend('<div class="control" id="prevControl">Click to slide left</div>')
		.append('<div class="control" id="nextControl">Click to slide right</div>');
	
	  // Initial position is set to 0,
	  // therefore disabling/hiding previous arrow control on first load
	  navSlider.manageControls(navSlider.currentPosition);
	
	  // Create event listeners for next/previous controls clicks
	  $('.control').bind('click', function(){
			// Determine new position
			navSlider.currentPosition = ($(this).attr('id')=='nextControl') ? navSlider.currentPosition+1 : navSlider.currentPosition-1;
			navSlider.activateSlider();
		});
	  
	  // Create event listeners for indicator button clicks
	  $('#slider-btns').delegate('a', 'click', function() {
			var btnId = $(this).attr('id');
			switch(btnId)
			{
				case 'btn0':
				navSlider.currentPosition = 0;
				navSlider.activateSlider();
				break;
			   
				case 'btn1':
				navSlider.currentPosition = 1;
				navSlider.activateSlider();
				break;
			   
				case 'btn2':
				navSlider.currentPosition = 2;
				navSlider.activateSlider();
				break;
			   
				case 'btn3':
				navSlider.currentPosition = 3;
				navSlider.activateSlider();
				break;
				
				case 'btn4':
				navSlider.currentPosition = 4;
				navSlider.activateSlider();
				break;
				
				case 'btn5':
				navSlider.currentPosition = 5;
				navSlider.activateSlider();
				break;
				
				case 'btn6':
				navSlider.currentPosition = 6;
				navSlider.activateSlider();
				break;
				
				case 'btn7':
				navSlider.currentPosition = 7;
				navSlider.activateSlider();
				break;
				
				case 'btn8':
				navSlider.currentPosition = 8;
				navSlider.activateSlider();
				break;
				
				case 'btn9':
				navSlider.currentPosition = 9;
				navSlider.activateSlider();
				break;
			}
		}).css('cursor', 'pointer');	
		
		
		//Count the number of .slide div's still we're on the one that has the 'on' class and then click the button to move us to that slide
		slideNavActiveNum = 0;
		clickThisOne = 0;
		$('#slider-navigation #slidesContainer .slide').each(function(index) {
			if ($(this).find('.on').html() !== null) {
				clickThisOne = slideNavActiveNum;
			}
			slideNavActiveNum++;
		});
		
		navSlider.currentPosition = clickThisOne;
		navSlider.activateSlider();
	},
	
	
	
	 // activateSlider: Start scrolling the slider to the proper position
	  activateSlider: function(){
		  //alert('This is slide number' + ' ' + (currentPosition+1));
		  // Set controls (hide/show) again based on new slide position
		  navSlider.manageControls(navSlider.currentPosition);
		  
		  // Set indicator buttons position
		  navSlider.manageIndicatorControls(navSlider.currentPosition);
		  
		  // Slide to the proper slide position
		  navSlider.manageSlider();
		},
		
		
	  // manageSlider: Move slideInner using margin-left to correct slide
	  manageSlider: function(){
			var newPos = navSlider.slideWidth*(-navSlider.currentPosition);
			$('#slideInner').animate({'marginLeft' : newPos});
	  },
	
	
	  // manageIndicatorControls: Activate indicator buttons depending on currentPosition
	  manageIndicatorControls: function(){
		 var currCount=navSlider.currentPosition+1
		 for(var i=0;i<currCount;i++){
				var currentButton = document.getElementById("btn" + i);
					$('#slider-btns a').removeClass("on");
					$(currentButton).addClass("on");
			}
		},
		
			 
	  // manageControls: Hides and Shows controls depending on currentPosition
	 manageControls:  function(position){
		// Hide left arrow if position is first slide
		if(position==0){ 
			  $('#prevControl').hide();
			  $('#subtop #slider-navigation #slidesContainer').prepend('<div id="prevOff">Controller is Off</div>');
			} 

		else{ 
			$('#prevOff').remove();
			$('#prevControl').show();
			}
		// Hide right arrow if position is last slide
		if(position==navSlider.numberOfSlides-1){ 
			  $('#nextControl').hide();
			  $('#subtop #slider-navigation #slidesContainer').append('<div id="nextOff">Controller is Off</div>')
			}
		else{
			  $('#nextOff').remove();
			  $('#nextControl').show();
			}
	  }
}






//login-dropdown
var lDropDown = {

	ddIsOpen: false,
	
	initalize: function() {
		
		//$('.login-dropdown').css({'background-color' : '#FFFFFF'});
		
		$('.login-dropdown').click(function (e) {
			e.preventDefault();
			
			if (lDropDown.ddIsOpen) {
				lDropDown.removeDD($(this));
			} else {
				lDropDown.displayDD($(this));
			}			
			
		});
		
	},
	
	displayDD: function(mObj) {
		$(mObj).addClass('dropdown-li');
		$(mObj).find('a').addClass('dropdown-a');
		
		floatDiv = "<div id='login-dropdown'>" + $('#dropdown-content').html() + "</div>";
		
		cW = $('.login-dropdown').width();
		cT = ($('.login-dropdown').offset().top + $('.login-dropdown').height()) - $('#bumper').height();
		cL = $('.login-dropdown').position().left + $('#nav-utilitytop').position().left;		
		
		$('#header').append(floatDiv);
		$('#login-dropdown').css({'top' : cT + 'px', 'left' : cL + 'px', 'width' : cW + 'px'});
		
		lDropDown.ddIsOpen = true;
	},
	
	removeDD: function(mObj) {
		$('#login-dropdown').remove();
		$(mObj).removeClass('dropdown-li');
		$(mObj).find('a').removeClass('dropdown-a');
		lDropDown.ddIsOpen = false;
	}
	
	
	
}
