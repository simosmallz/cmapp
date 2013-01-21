/* 
hero.js
Version: 09.18.12

Built: 09.24.11 - AS

Edited:
11.03.11 - tweaked to NOT use _pg if ajax_wrapper isn't there.
11.04.11 - increased maximum window height to 1091
11.10.11 - reworked the data gathering and rendering to fix multiple P tags and whatnot
11.17.11 - tweaked the close button to go to country/index.epx if required
11.28.11 - added a new reset condition to prevent errors when the hero has more/less than 5 heros
12.07.11 - added the  class="rm_randomizer" functions
12.15.11 - adjusted the resize so if the height is larger than 745, then ALWAYS the large image.
12.19.11 - commented out the black fade background per Design's request.
12.22.11 - commented out the CORRECT black fade background per Design's request. (That was very silly.)
12.23.11 - these console.log errors in IE are getting old
03.08.12 - changed window.location.hostname to HOST_NAME per J.Humphry's request (works better this way - vs)
04.25.12 - removed blackout.png (again?)
05.07.12 - tweaked and commented out MORE of the blackout.png stuff. 
05.31.12 - added function to change hero URL from sapvideo.edgesuite.net to www.sap.com for L2 pages.
06.21.12 - changed from sapvideo.edgesuite.net to sapimages.edgesuite.net 
07.31.12 - removed calls _renderHeading(), _renderCaption(), and _renderButton() - just displaying entire LI html content now. Fix for new Links and extra content
09.10.12 - removed content fade in after leaving the homepage
09.18.19 - (re)added vieworder back into the hero href.

*/



var NUMBEROFHEROS; //New Global Var for hero count. To allow for more/less than 5 heros.
var theHeroArray = [];


		var HeroView = (function () {
			/* Hero HTML View
			 * 
			 * heroID = represents the current Hero screen
			 * 
			 * 
			 */
			var heroID;
			//var heroClientBrowser;
			var heroDOM = document.getElementById('hero') || null;
			var heroWidth = 475;
			var heroElementName;
			var heroElements = [];
			var heroNavBtns = [];
			var animationDuration = (_isIE()) ? 300 : 400 ;
			var clientWindowHeight;
			var windowSize;
			var _pause;
			var newData = [];
			var holdArray = [];
			
			/* Hero Internal Private Methods */
			function _generateHeroData() {					
					
					//11.10.11 - NewData build - Vince
					$.each($('#hero').find('li'), function() {
						var fC = $(this).html();
						var theH2 = $('<div>').append($(this).find('h2').clone()).remove().html();
						var thePs = "";
						$.each($(this).find('p'), function() {
							thePs+= $('<div>').append($(this).clone()).remove().html(); //Get P tags - even if there's more than one.
						});
						var fullaHref = $('<div>').append($(this).find('a').clone()).remove().html();
						var IMG = $(this).attr('rel');
						var isItRandom = $(this).hasClass('rm_randomizer');
						currentIndex = newData.push({
							heading : theH2,
							caption : thePs, 
							button : fullaHref,
							image : IMG,
							isRandom : isItRandom,
							fullContent: fC
						});
						
						if (!isItRandom) {
							holdArray.push({
								myIndex: currentIndex - 1,
								myItems: newData[currentIndex -1]
							});
						}
						
					});
					
					//Remove stationary heros
					deCount = 0; //For every item we remove, the length of the original array is one less, and therefore the slice ID is one less.
					for (var aa = 0; aa < holdArray.length; aa++) {
						sliceIndex =  parseInt(holdArray[aa].myIndex) - deCount
						newData.splice(sliceIndex, 1);
						deCount++;
					}
					
					
					//Shake the array
					newData.sort(function() {return 0.5 - Math.random()});
					
					//insert the stationary heros BACK into the array:
					for (var bb = 0; bb < holdArray.length; bb++) {
						var slice1=newData.slice(0,parseInt(holdArray[bb].myIndex));
						var slice2=newData.slice(parseInt(holdArray[bb].myIndex));
						
						newData = [];
						newData = slice1.concat(holdArray[bb].myItems, slice2);
						
					}
					
					NUMBEROFHEROS = newData.length; //set a global var to the number of HEROs so we can have more or less than 5
					theHeroArray = newData;
					return newData.length;
					
					
			}
			
			function _isIE() {
				var heroClientBrowser = (window.addEventListener !== undefined) ? 'W3C' :  'IE';
 				return (heroClientBrowser.indexOf('IE') !== -1) ? true : false;
 			}
			
			function _renderHeading() {
 				//TODO: Possible create a hash key/value accessor for the heroElements
 				/*var h2 = heroElements[0]; //H2
 					h2.innerHTML = data[heroID].heading;
 				//	if(_isIE()){h2.style.paddingTop = '4px';}
 					$(h2).hide();
 					$(h2).fadeIn(animationDuration);*/
				
				$('#hero1 h2').replaceWith(newData[heroID].heading);
				$('#hero1 h2').hide();
 				$('#hero1 h2').fadeIn(animationDuration);
 			}
 				
 			function _renderCaption() {
 				/*var p = heroElements[1]; //P
 					p.innerHTML = data[heroID].caption;
 					$(p).hide();
 					$(p).fadeIn(animationDuration);*/
					
				//remove extra P's but one:
				$.each($('#hero1').find('p'), function(index, value) {
					if(index > 0) {
						$(this).remove();	
					}
				});
				$('#hero1 p').replaceWith(newData[heroID].caption);
				$('#hero1 p').hide();
				$('#hero1 p').fadeIn(animationDuration);
 			}
 			
 			function _renderButton() {
 				/*var button = heroElements[2]; //A
 				var _label = data[heroID].button.label;
 					if(data[heroID].button.label.indexOf('<span>') > -1) {
 						_label = _label.substring(_label.length - '</span>'.length, ('<span>'.length));
 					}
 					button.childNodes[0].innerHTML = _label;
 					button.setAttribute('href', data[heroID].button.href);*/
					
				$('#hero1 a').replaceWith(newData[heroID].button);
				$('#hero1 a').attr('vieworder', parseInt(heroID) + 1);
					
 			}
 			
 			function _heroNavigation() {
 				var a, btnContainer;  //DOM Elements
 				var fadeto = (_isIE()) ? 100 : 200 ;  // Tweak the animation runtime clock for IE
 				
 				function _genNav() {
 					if(document.getElementById('hero-btns') === null) {
 						btnContainer = document.createElement("div");
 						btnContainer.setAttribute("id", "hero-btns");
 						heroDOM.appendChild(btnContainer);
	 			
 						return btnContainer;
 					}
 				}
 				
 				if(_genNav()) {
 					for(var i=0; i < NUMBEROFHEROS; i++) {
 						a = document.createElement("a");
	 					heroNavBtns.push(a);
	 					heroNavBtns[i].setAttribute('href', '');
	 					heroNavBtns[i].setAttribute('rel', i);
	 					heroNavBtns[i].className = '';
	 					
	 					if(_isIE()) {
 								//IE Event Bug FIX
 								heroNavBtns[i].onclick = function() {HeroEvent.clickHero({heroID:this.getAttribute('rel'),clock:clockReference}); return false;};
 						} else {
								heroNavBtns[i].onclick = function(evt) {HeroEvent.clickHero({heroID:evt.target.rel, clock:clockReference}); return false;};
 						}
	 					btnContainer.appendChild(heroNavBtns[i]);
	 				}
	 				for(var i=0; i < NUMBEROFHEROS; i++) {
	 					$(heroNavBtns[i]).hide();
	 					$(heroNavBtns[i]).fadeIn((fadeto) * i);
	 				}
	 			}
	 			
	 			return {
	 				enable : function() {
		 				heroNavBtns[heroID].style.backgroundPosition = '0px 0px';
		 				heroNavBtns[heroID].className = 'on';
		 			},
		 			reset : function() {
		 				for(var i=0; i < NUMBEROFHEROS; i++) {
	 						heroNavBtns[i].className = '';
	 						heroNavBtns[i].innerHTML = '';
	 						heroNavBtns[i].style.opacity = '1.0';
	 						
	 					}
		 			}
	 			}
	 		}
 			
 			/* JS Public Methods */
 			return {
 				isIE : function(){
 					return _isIE();
 				},
 				navReset : function() {
 					_pause = false;
 					_heroNavigation().reset();
 				},
 				setHeroID : function(id) { 
 					heroID = id;
 				},
 				getHeroID : function() { 
 					return heroID;
 				},
 				setWidth : function(value) { 
 				/* Sets the HeroWidth in pixels */
 				
 					if (heroDOM !== undefined) {
    					heroDOM.style.width = value + 'px';
  					} else {
    					throw "Hero object was not properly initialized with a DOM element.";
					}
 				},
 				/*setHeroData : function(dHero) {
 					newData = dHero;
 				},*/
 				heroData : (function() { //Gets the Hero Data Object. Value is immutable.
 					return newData;	
 				})(),
 				navLength : (function() { //Gets the Hero Navigation Button count. Value is immutable.
 					return NUMBEROFHEROS;	
 				})(),
 				getHeroDOM : function() {
 					return heroDOM;
 				},
 				getHeroNav : function() {
 					return heroNavBtns;
 				},
 				bgAnimateProgress : function (pos) {
 					//Refers to the Hero mini chiclet animation
 					//var heroNavHeight = 20;
 					heroNavBtns[heroID].style.backgroundPosition = '0px '+ -(pos/100 * 20) +'px'; // 20 = Hero nav height
 				},
 				pause : function (id) {
 					var heroID = id;
 					_pause = true;
 					var a = heroNavBtns;
 					
 					for (var i=0; i < a.length; i++) {
						if (i != id) {
							a[i].style.opacity = '0.25';
						}
					}
 					a[id].innerHTML = '| |';
 				},
 				unpause : function () {
 					_pause = false;
 				},
 				isPaused : function () {
 					return _pause;
 				},
 				isClicked : function (id) {
 					return (HeroView.getHeroID() == id) ? true : false ;
 				},
 				init : function (element) {
 					var _hID;
 					windowSize = {'width':$(window).width() , 'height': $(window).height()} ;
					
 					if(HeroEvent.heroCookie.id !== null) {
 						heroID = (isNaN(parseInt(HeroEvent.heroCookie.id))) ? 0 : parseInt(HeroEvent.heroCookie.id) ;
 					}
 					
 					heroElementName = element || 'hero';
 					heroDOM = document.getElementById(heroElementName) || null;
 					
 					if(heroDOM !== null) {
						NUMBEROFHEROS = _generateHeroData();
						//heroNavLen = data.length || 0;	
					}
					
					if(document.getElementById('hero') == null) {
	 					_hID = (HeroEvent.heroCookie.id > 0) ? HeroEvent.heroCookie.id : Math.floor(Math.random()*5);
						//console.log('_hID: ' + _hID);
	 					HeroBG.render(_hID);
						HeroBG.blackout();
						HeroEvent.saveDimState(1);
					} 
					 					
 					window.onresize = function() {
 						/*  Recalculate window dimensions */
 						windowSize.height = $(window).height();
 						windowSize.width = $(window).width();
						
 						/* Dynamically strecth the top gradient */
 						$('#top-gradient').width(windowSize.width);
 						
 						/* Set the Master BG on ClientWindow resize */
 						HeroBG.toggleBackground(heroID, windowSize.height);
 					}
 
 					/* Set the Master BG on first init */
 					HeroBG.toggleBackground(heroID, windowSize.height);
 					
				},
				 generate : function() {
				 	
				 	if(arguments.length > 0) {
				 		clockReference = arguments[0].clock
				 	}
					
				 	HeroBG.render(heroID); // Sets the Current Hero Background
				 	if (!_isIE()) {
						//removed 09.10.12
				 		//HeroBG.bright(); // This is the fade magic
				 	}
				 	
				 	if(heroDOM !== null) {
				 		//_renderHeading();
 						//_renderCaption();
 						//_renderButton();
						
						//07.31.12 
						$('#hero1').html(newData[heroID].fullContent);
						$('#hero1 a').attr('vieworder', parseInt(heroID) + 1); //09.19.12 - missing this since we removed _renderButton()
						$('#hero1').hide();
						$('#hero1').fadeIn(animationDuration);
 					
 						_heroNavigation().enable();
 						HeroEvent.save(heroID +'|'+ newData[heroID].image);
				 	}
				},
				setWindowSizeType : function(id) {
					/* Sets the Background image type 
					* 0 = Small
					* 1 = Large
					* */
					clientWindowHeight = id;
				},
				getWindowSizeType : function() {
					return clientWindowHeight;
				},
				getWindowSize : function() {
					return windowSize;
				}
			}
		})();
			
	var HeroBG = (function() {
		var _body;
		var _blackout, _bgContainer, _bg;
		var _gradient;
		var defaultImage = '/global/ui/images/photos/1920x1200/272788_l_srgb_s_gl_1920_1200_rl_00_00.jpg';
		
		_body = document.getElementsByTagName("body")[0]; //Store a local reference to the DOM element for the Background
		
		function _generateBlackout() {
			if(document.getElementById('blackout') === null) { 
				_blackout = document.createElement("div");
				_blackout.setAttribute('id', 'blackout');
	 			/*_blackout.style.width = '2000px';
	 			_blackout.style.height = '2000px';
	 			_blackout.style.display = 'none';
	 			_blackout.style.zIndex = -9999;
	 			_blackout.style.background = "url(/global/ui/images/home/bkg-blackout.png)";*/  //removed on 05.07.12 - per design's request
	 			_body.appendChild(_blackout);
	 			return _blackout;
	 		}
		}
		
		
		function _generateTopGradient() {
			if(document.getElementById('top-gradient') === null) { 
				_gradient = document.createElement("div");
				_gradient.setAttribute('id', 'top-gradient');
	 			/*_gradient.style.height = '150px';
	 			_gradient.style.width = 'auto';
	 			_gradient.style.display = 'block';
	 			_gradient.style.zIndex = -9999;
	 			_gradient.style.background = "url(/global/ui/images/backgrounds/bkg-top-gradient.png) repeat left top";*/  //removed on 05.07.12 - per design's request
	 			_gradient.style.position="fixed";
	 			_body.appendChild(_gradient);
	 			return _gradient;
	 		}
		}
		
		return {
			render :  function(heroID) {
				/*  TODO: Fine-tune the loading of this function */
				var bg_gradient;
				var bg_style = 'rgb(34, 34, 34) url(BACKGROUND-IMAGE) no-repeat fixed center top';
				
				
				//console.log('HeroView.heroData[heroID]: ' + HeroView.heroData[heroID]);
				//console.log('HeroView.heroData.length: ' + HeroView.heroData.length);
				if (typeof theHeroArray[heroID]=="undefined") {
					//HeroView.init('hero'); 
					HeroView.setHeroID(0);
					heroID = 0;
				}
				var bg_image = (HeroView.getHeroDOM() !== null) ? theHeroArray[heroID].image : HeroEvent.heroCookie.src;
				
				
				//_generateTopGradient();
				
				if(HeroView.getWindowSizeType() == 1){
					bg_image = bg_image.replace('-sm', '-lg');
				}
				
				//If no Cookie is defined, use the defaultImage - 11.18.11
				if (bg_image.indexOf('.jpg') < 0) {
					bg_image = defaultImage;
				}
		
				
				_body.style.background = bg_style.replace('BACKGROUND-IMAGE', bg_image);
			
			},
 			blackout : function(heroID) {
 				var _fadeto, _fadeDuration;
 				_generateBlackout();
 				
				//add an X button
	 			var _a = document.createElement("a");
	 			var _pg = document.getElementById("ajax-content-wrapper");

				if (typeof(countryPath) != 'undefined') {
				    //_a.setAttribute('href', 'http://' + window.location.hostname + countryPath + 'index.epx'); //Just get the current country root;
					_a.setAttribute('href', HOST_NAME + countryPath + 'index.epx'); //Just get the current country root;
				} else {
					//_a.setAttribute('href',  'http://' + window.location.hostname + '/index.epx'); //Defaults to the Root page
					_a.setAttribute('href', HOST_NAME + '/index.epx'); //Defaults to the Root page
				}
	 			//_a.setAttribute('href','index.html'); // REMOVE PRIOR TO LIVE
	 			$(_a).addClass('btn-close-overlay');
	 			//_a.style.top = '145px';
	 			
				if (_pg != null) {
	 				_pg.appendChild(_a);
				}
 				//$(_blackout).hide();
 				
 				//Adjust the fade properties for IE
 				var isIE = HeroView.isIE();
 				_fadeto = (isIE) ? 0.4 : 1; 
 				_fadeDuration = (isIE) ? 500 : 800; 
 				
 				
 				/* This condition detects the state of the Dim Fade Effect on second level pages */
 				if(HeroEvent.getDimState() == 0) {
 					$(_blackout).fadeTo(_fadeDuration/2, _fadeto) 
 					$(_pg).hide();
 				}
 				
 				
 				if(!isIE) {
 					$(_pg).fadeTo(_fadeDuration, 1);
 				} else {
 					$(_pg).fadeIn();
 				}
 				
 				
 			},
 			bright : function() {
 				if(_generateBlackout()){
	 				_fadeDuration = (HeroView.isIE()) ? 300 : 600; 
	 				$(_blackout).fadeTo(_fadeDuration, 0.0, function() {
	 					document.body.removeChild(_blackout);
	 					HeroEvent.saveDimState(0);
	 					
	 				});
	 				
	 			}
 			},
 			toggleBackground : function(hid, wHeight) {
 				var windowHeight = wHeight;
				var windowWidth = $(window).width();
 				if(windowHeight < 744 && windowHeight > 500 && windowWidth < 1500) { //added widnowWidth since 1600x900 monitors need a large 
					HeroView.setWindowSizeType(0);
					this.render(hid);
				} else if(windowHeight > 745) { //If it's larger that 745, then ALWAYS the large image.
				//} else if(windowHeight > 745 && windowHeight < 1091) { //Increased windowHeight < from 1050 to 1091 <-- this is still erroring on LARGE monitors.
					HeroView.setWindowSizeType(1);
					this.render(hid);
				} else {
					//everything else is large - this is the fix for 1600x900 width monitors - VS
					HeroView.setWindowSizeType(1);
					this.render(hid);
				}
 			}
		}
	})();
	
	var HeroEvent = (function() {
			var _currentHeroID;
			var _timeout;
			var oExpDate = new Date();
			
			function _saveHeroCookie(id){
				var time = oExpDate.getTime() + (600 * 1000); // 10 minutes
				oExpDate.setTime(time);
				//alert('cookie ID: ' + id);
				document.cookie = 'heroID='+ id +';expires=' + oExpDate.toGMTString() +'; path=/';
			}
			
			function _saveDimState(state){
				var time = oExpDate.getTime() + (3600 * 1000); // 1 hour
				oExpDate.setTime(time);
				document.cookie = 'dimState='+ state +';expires=' + oExpDate.toGMTString() +'; path=/';
			}
			
			function _getHeroCookie(key){
				var sKey = key;
    			return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
  			}
				
			//function _setCloseButton() {}
						
			function _switchHero() {
				/* Switch to the next Hero screen sequence 
				 *	
				 ==> A Hero switch event is triggered upon 1 of 2 events:
				 		a. Once a Timer count limit is reached
				 					- or  - 
				 		b. Click Event
				 * */
				
				var id = _currentHeroID;
				var timer = 1;
				var clicked = null;
				
				if (arguments.length > 0 ) {
					id =  arguments[0].heroID;
					_clock = arguments[0].clock;
					
					if (arguments[0].clicked) {
						// Simulate a clock pause event by setting the interval to almost infinite ** HACK ** 
						if (!HeroView.isPaused()) {
							timer = 99999;
							clicked = true;
							// Pause the Hero GUI on the currently selected Hero ID
							HeroView.pause(id);	
						} else {
							HeroView.unpause();
						}
					} 
					
					if(_timeout) {
						clearTimeout(_timeout);
					}
						_timeout = setTimeout(function(){_clock.start()}, timer * 1000);  // Restart the clock after N seconds.
				}
					
					HeroView.setHeroID(id);
					if (clicked == null) {
						HeroView.navReset();
						HeroView.generate();		
					}
					
				
			}
			return {
				heroCookie : (function() {
					var hid = _getHeroCookie('heroID');
					return {id:hid.substring(0,1), src:hid.substring(2,hid.length)};
				})(),
				getDimState : function() {
					var dim = _getHeroCookie('dimState');
					return dim;
				},
				save : function(id) {
					//Akamai Fix. Remove Edge SUITE from hero - 05.31.12 (06.21.12 - changed from sapvideo to sapimages)
					/*
					id looks like this:
							2|http://sapimages.edgesuite.net/global/ui/images/home/heros/273704-sm.jpg
						swap out sapimages.edgesuite.net for www.sap.com 
					*/
					id = id.replace('sapimages.edgesuite.net' , 'www.sap.com');
					
					_saveHeroCookie(id);  //Auto saves the current Hero ID as a cookie
				},
				saveDimState : function(id) {
					_saveDimState(id);
				},
				setID : function(data) {
					_currentHeroID = data;
				},
				getID : function() {
					return _currentHeroID;
				},
				exec : function() {
					var currHeroScreen = _currentHeroID;
					
					//if(currHeroScreen <= HeroView.navLength) {
					if(currHeroScreen <= NUMBEROFHEROS) { //New condition 11.28.11
						_currentHeroID++;  //Increment to the next HeroID
						//if(currHeroScreen == HeroView.navLength-1) { //OLD ONE
						if(_currentHeroID == NUMBEROFHEROS) { //New Reset condition 11.28.11
							// Reset Counter
							HeroView.setHeroID(0)
							_currentHeroID = HeroView.getHeroID();
						}
					}  
					_switchHero();
				},
				clickHero : function() {
					var isClicked;
					if(arguments.length > 0) {
						_currentHeroID = arguments[0].heroID;
						var _clock = arguments[0].clock;
					}
					if(_clock.stop()) {
						isClicked = HeroView.isClicked(_currentHeroID);
						_switchHero({heroID:_currentHeroID, clicked: isClicked, clock:_clock});
					} 
				},
				pauseHero : function(e) {
					if(e.paused == true && e.target.getAttribute('id') !== 'hero') {
						var hID = HeroView.getHeroID();
						HeroView.pause(hID);
					}
				}
			}
		})();
	
	
	 function HeroTimeController(time) {
	  /* Global HeroTimeController */
			var _tick;
			var _duration = time;
			
			HeroEvent.setID(HeroView.getHeroID()); //Passes a reference of the current Hero ID to the Hero Event Handler
			
			this.start = function() {
				//when the HeroTimeController duration is reached, dispatch a switch event
				_tick = 0;
				var _clock = setInterval(function() {
				
						if(_tick <= _duration) {
							HeroView.bgAnimateProgress(_tick * _duration);
							if(_tick == _duration) {
								_tick = 0; // reset internal clock
								HeroEvent.exec();
							} else {
								_tick = _tick + 1;
							}
						}
					}, 1000);
					this.clock = _clock;
				}
			this.stop = function() {
				clearInterval(this.clock);
				_clock = undefined;
				_tick = 0;
				if(!_clock) {
					return true;
				}
			}
		}




$(window).load(function () {
			
			var currPath = location.pathname.substring(1);
			var targStr = currPath.split('/');
		
			if (targStr[2] == 'sap-bydesign') {
				//No hero in sap-bydesign
			
			} else {
				/* Initialize the Hero Widget and Render the background */
				HeroView.init('hero'); 
				
				/* Start the main loop timer */
				if(window.heroTimer === undefined && HeroView.getHeroDOM() !== null ) {
					/* Initialize and Start the Hero Clock */
					var heroTimer = new HeroTimeController(10); //Time in seconds
					heroTimer.start();
					
					/* Generate the Hero View UI */
					HeroView.generate({clock:heroTimer}); /* Pass in a Clock Hero Timer object */
				}
			}
	
});
