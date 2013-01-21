/*
Random ID Generator Utility
/global/js/rm_platform/utils/rm_uniqueId.js
RLC 20101213
*/
define(['require', 'utils/rm_indexOf', 'utils/rm_console'], 
	function(rm_console) {
		new rmUniqueId();
	}
);

function rmUniqueId() {
	var rm_uniqueId_console = new rmConsole('uniqueId');
	
	var rm_unique_ids;
	var chars = "0123456789ABCDEFGHIJKLMNOP";
	
	function getRandomNumber(range) {
		return Math.floor(Math.random() * range);
	}
	
	function getRandomChar() {
		return chars.substr(getRandomNumber(chars.length), 1);
	}
	
	function getRandomId(length) {
		var str = "";
		for (var i = 0; i < length; i++) {
			str += getRandomChar();
		}
		if (typeof(rm_unique_ids) === 'undefined') {
			rm_unique_ids = [];
		}
		if (rm_unique_ids.indexOf(str) == -1) {
			rm_unique_ids.push(str);
			return str;
		} else {
			getRandomId(length);
		}
	}
	
	function log(msg, opts) {
		rm_uniqueId_console.log(msg, opts);
	}
	
	this.create = function(length) {
		log('creating id', {showId:true});
		return getRandomId(length);
	}
	
	return this;
}