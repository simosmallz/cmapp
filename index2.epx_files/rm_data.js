/*
Data reading and manipulation scripts...
/global/ui/richemdia/js/utils/rm_data.js
Version: 05.09.11 - VS
*/


/*
Created:	01.04.11 - VS
Last Edit: 

03.14.11 - added liToXML function to solve for the IE errors (where it was dropping the LI close tags... so annoying.)
03.28.11 - tweaked the qs() function to handle hash marks (#) in the URL.
05.09.11 - added and then removed the ajax data parser: stringToData()
12.19.12 - reTweaked the qs() function to STRIP hash marks out.

*/


var rmData  = {
	
	qsParm:new Array(),
	
	init: function() {
		rmData.qs();
	},

	parseString: function(theString) {
		//parses a comma seperated string (key=val,key2=val)
		//returns an array
		//usage:
		//var parsedParm = parseString(dataString);
		parsedParm = new Array();
	
		if (typeof theString != 'undefined') {
			
			var params = theString.split(',');
			for (var i=0; i<params.length; i++) {
				var pos = params[i].indexOf('=');
				if (pos > 0) {
					var key = params[i].substring(0,pos).trim();
					var val = params[i].substring(pos+1);
					parsedParm[key] = val;
				}
			}
			
		} else {
			//theString is undefined, return just 1 parm...
			parsedParm['none'] = 'nothing';
		}
		
		return parsedParm;
	},


	//Might not need this function: (Chenzo - 12.16.10)
	parseArray: function(theArray) {
		
		//alert(parseArray);
		
	}, 

	

	qs: function() {
		//var query = window.location.search.substring(1);
		//Tweaked for HASH marks in the URL. 03.28.11 - VS

		//Stripped out the HASH marks again - 12.19.12 - VS
		var noHashWinLoc = window.location.href.split('#')[0];
		//var winLoc = window.location.toString();
		var winLoc = noHashWinLoc.toString();
		var qpos = winLoc.indexOf('?');
		var query = winLoc.substring(qpos + 1);

		var parms = query.split('&');
		for (var i=0; i<parms.length; i++) {
			var pos = parms[i].indexOf('=');
			if (pos > 0) {
				var key = parms[i].substring(0,pos);
				var val = parms[i].substring(pos+1);
				rmData.qsParm[key] = val;
			}
		}
	},
	
	
	liToXML: function(theData) {
		//alert(theData);
		theXML = "";
		theXML += "<theXML>";
		
		$(theData).find('li').each(function(index) {
			theXML += '<li';
			
			//Get the LI's value:
			//UMP.UMPconsole.log($(this).html());
			val = $(this).html();
			
			//Get the attributes and their data
			var arr = $(this).get(0).attributes, attributes = [];
			for(var i = 0; i < arr.length; i++) {
			 // UMP.UMPconsole.log(arr[i].name + ' - ' + arr[i].value);
			 arrName = arr[i].name;
			 arrValue = arr[i].value;
			 theXML += ' ' + arrName + '="'+arrValue+'"';
			}	
			theXML += '>';
			theXML += val;
			theXML += '</li>';
		});
		
		theXML += "</theXML>";
		
		return(theXML);
	},
	
	
	
	//This function is no longer needed. To do this more simply just do this:
	//theTrueData = $('<div>' + data + '</div>').find('.UMP_div');
	//Where data is the AJAX return
	//VS - 05.09.11	
	stringToData: function(theHTMLstring, jQobject) {
		//This function take a string that contains HTML and puts it in a temp DIV and then returns the object requested
		//jQobject is a jQuery request, like '.UMP_div' or '#myLayerID', etc...
		
		//Make Temp Div
		tempDiv = "<div id='tempDiv' style='visibility:hidden;width=0;height=0;display:none;'>" + theHTMLstring + "</div>";
			
		//Make Temp Div for data then remove it
		$('body').append(tempDiv);
		theTrueData = $('#tempDiv').find(jQobject);
		$('#tempDiv').remove(); 	
			
		return(theTrueData);	
		
	}
	

}



/*
Written by Steve Tucker, 2006, http://www.stevetucker.co.uk
Full documentation can be found at http://www.stevetucker.co.uk/page-innerxhtml.php
Released under the Creative Commons Attribution-Share Alike 3.0  License, http://creativecommons.org/licenses/by-sa/3.0/

Change Log
----------
15/10/2006	v0.3	innerXHTML official release.
21/03/2007	v0.4	1. Third argument $appendage added (Steve Tucker & Stef Dawson, www.stefdawson.com)
			2. $source argument accepts string ID (Stef Dawson)
			3. IE6 'on' functions work (Stef Dawson & Steve Tucker)
*/
innerXHTML = function($source,$string,$appendage) {
	// (v0.4) Written 2006 by Steve Tucker, http://www.stevetucker.co.uk
	if (typeof($source) == 'string') $source = document.getElementById($source);
	if (!($source.nodeType == 1)) return false;
	var $children = $source.childNodes;
	var $xhtml = '';
	if (!$string) {
		for (var $i=0; $i<$children.length; $i++) {
			if ($children[$i].nodeType == 3) {
				var $text_content = $children[$i].nodeValue;
				$text_content = $text_content.replace(/</g,'&lt;');
				$text_content = $text_content.replace(/>/g,'&gt;');
				$xhtml += $text_content;
			}
			else if ($children[$i].nodeType == 8) {
				$xhtml += '<!--'+$children[$i].nodeValue+'-->';
			}
			else {
				$xhtml += '<'+$children[$i].nodeName.toLowerCase();
				var $attributes = $children[$i].attributes;
 				for (var $j=0; $j<$attributes.length; $j++) {
					var $attName = $attributes[$j].nodeName.toLowerCase();
					var $attValue = $attributes[$j].nodeValue;
					if ($attName == 'style' && $children[$i].style.cssText) {
						$xhtml += ' style="'+$children[$i].style.cssText.toLowerCase()+'"';
					}
					else if ($attValue && $attName != 'contenteditable') {
						$xhtml += ' '+$attName+'="'+$attValue+'"';
					}
				}
				$xhtml += '>'+innerXHTML($children[$i]);
				$xhtml += '</'+$children[$i].nodeName.toLowerCase()+'>';
			}
		}
	}
	else {
		if (!$appendage) {
			while ($children.length>0) {
				$source.removeChild($children[0]);
			}
			$appendage = false;
		}
		$xhtml = $string;
		while ($string) {
			var $returned = translateXHTML($string);
			var $elements = $returned[0];
			$string = $returned[1];
			if ($elements) {
				if (typeof($appendage) == 'string') $appendage = document.getElementById($appendage);
				if (!($appendage.nodeType == 1)) $source.appendChild($elements);
				else $source.insertBefore($elements,$appendage);
			}
		}
	}
	return $xhtml;
}
function translateXHTML($string) {
	var $match = /^<\/[a-z0-9]{1,}>/i.test($string);
	if ($match) {
		var $return = Array;
		$return[0] = false;
		$return[1] = $string.replace(/^<\/[a-z0-9]{1,}>/i,'');
		return $return;
	}
	$match = /^<[a-z]{1,}/i.test($string);
	if ($match) {
		$string = $string.replace(/^</,'');
		var $element = $string.match(/[a-z0-9]{1,}/i);
		if ($element) {
			var $new_element = document.createElement($element[0]);
			$string = $string.replace(/[a-z0-9]{1,}/i,'');
			var $attribute = true;
			while ($attribute) {
				$string = $string.replace(/^\s{1,}/,'');
				$attribute = $string.match(/^[a-z1-9_-]{1,}="[^"]{0,}"/i);
				if ($attribute) {
					$attribute = $attribute[0];
					$string = $string.replace(/^[a-z1-9_-]{1,}="[^"]{0,}"/i,'');
					var $attName = $attribute.match(/^[a-z1-9_-]{1,}/i);
					$attribute = $attribute.replace(/^[a-z1-9_-]{1,}="/i,'');
					$attribute = $attribute.replace(/;{0,1}"$/,'');
					if ($attribute) {
						var $attValue = $attribute;
						if ($attName == 'value') $new_element.value = $attValue;
						else if ($attName == 'class') $new_element.className = $attValue;
						else if ($attName == 'style') {
							var $style = $attValue.split(';');
							for (var $i=0; $i<$style.length; $i++) {
								var $this_style = $style[$i].split(':');
								$this_style[0] = $this_style[0].toLowerCase().replace(/(^\s{0,})|(\s{0,1}$)/,'');
								$this_style[1] = $this_style[1].toLowerCase().replace(/(^\s{0,})|(\s{0,1}$)/,'');
								if (/-{1,}/g.test($this_style[0])) {
									var $this_style_words = $this_style[0].split(/-/g);
									$this_style[0] = '';
									for (var $j=0; $j<$this_style_words.length; $j++) {
										if ($j==0) {
											$this_style[0] = $this_style_words[0];
											continue;
										}
										var $first_letter = $this_style_words[$j].toUpperCase().match(/^[a-z]{1,1}/i);
										$this_style[0] += $first_letter+$this_style_words[$j].replace(/^[a-z]{1,1}/,'');
									}
								}
								$new_element.style[$this_style[0]] = $this_style[1];
							}
						}
						else if (/^on/.test($attName)) $new_element[$attName] = function() { eval($attValue) };
						else $new_element.setAttribute($attName,$attValue);
					}
					else $attribute = true;
				}
			}
			$match = /^>/.test($string);
			if ($match) {
				$string = $string.replace(/^>/,'');
				var $child = true;
				while ($child) {
					var $returned = translateXHTML($string,false);
					$child = $returned[0];
					if ($child) $new_element.appendChild($child);
					$string = $returned[1];
				}
			}
			$string = $string.replace(/^\/>/,'');
		}
	}
	$match = /^[^<>]{1,}/i.test($string);
	if ($match && !$new_element) {
		var $text_content = $string.match(/^[^<>]{1,}/i)[0];
		$text_content = $text_content.replace(/&lt;/g,'<');
		$text_content = $text_content.replace(/&gt;/g,'>');
		var $new_element = document.createTextNode($text_content);
		$string = $string.replace(/^[^<>]{1,}/i,'');
	}
	$match = /^<!--[^<>]{1,}-->/i.test($string);
	if ($match && !$new_element) {
		if (document.createComment) {
			$string = $string.replace(/^<!--/i,'');
			var $text_content = $string.match(/^[^<>]{0,}-->{1,}/i);
			$text_content = $text_content[0].replace(/-->{1,1}$/,'');			
			var $new_element = document.createComment($text_content);
			$string = $string.replace(/^[^<>]{1,}-->/i,'');
		}
		else $string = $string.replace(/^<!--[^<>]{1,}-->/i,'');
	}
	var $return = Array;
	$return[0] = $new_element;
	$return[1] = $string;
	return $return;
}
