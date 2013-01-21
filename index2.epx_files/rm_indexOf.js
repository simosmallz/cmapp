/*
indexOf Utility for IE
/global/js/rm_platform/utils/rm_indexOf.js
RLC 20110107
*/
define(function() {
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function(elt /*, from*/) {
				var len = this.length;
				var from = Number(arguments[1]) || 0;
				from = (from < 0) ? Math.ceil(from) : Math.floor(from);
				if (from < 0) {
					from += len;
				}
				for (; from < len; from++) {
					if (from in this && this[from] === elt) {
						return from;
					}
				}
				return -1;
			};
		}
	}
);