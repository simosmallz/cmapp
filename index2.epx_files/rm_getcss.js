/*
This is the master controller for all Rich Media elements.
/global/js/rm_platform/rm_getcss.js
Version: 12.05.11 - VS
*/

/*
Rich Media JavaScript: 
Rich Media Controller rm_controller.js

Created:	12.05.11 - VS
Last Edit: 
12.05.11 - created...


*/



var rmGetCSS = {
	returnFunction: "",
	numOfJSfiles: 0,
	numOfLoaded: 0,
	fileList: new Array(),
	
	load_CSS: function() {
		numOfJSfiles = arguments.length;
		
		for (q=0; q<numOfJSfiles; q++) {
			//Add CSS class:			
			$("head").append("<link>");
			css = $("head").children(":last");
			css.attr({
			  rel:  "stylesheet",
			  type: "text/css",
			  href: arguments[q]
			});
		}
	}
	
};
