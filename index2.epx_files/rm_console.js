/*
Console Management Utility
/global/js/rm_platform/utils/rm_console.js
RLC 20101213

TODO: use a dialog box that is draggable and resizable
TODO: update log method if log is visible...
*/
define(['require', 'utils/rm_uniqueId'],
	function(rm_uniqueId) {
		new rmConsole('initialConsole');
	}
);

function rmConsole(id) {
	this.rm_console_log;
	var console_id;
	var console_message;
	var console_opts;
	
	var log_is_visible = false;
	
	function init() {
		if (typeof(id) !== 'undefined') {
			console_id = id;
		} else {
			console_id = rmUniqueId().create(8);
		}
		createShortcut();
	}
	
	function refreshSettings() {
		if (typeof(console_opts.showId) === 'undefined' || console_opts.showId) {
			console_message = console_id + ': ' + console_message;
		}
	}
	
	function private_log(message, opts) {
		console_message = message;
		if (typeof(opts) !== 'undefined') {
			console_opts = opts;
		} else {
			console_opts = {};
		}
		refreshSettings();
		if (typeof(rm_console_log) === 'undefined') {
			rm_console_log = [];
		}
		rm_console_log.push(console_message);
		if (typeof(console) !== 'undefined' && console != null) {
			console.log(console_message);
		}
	}
	
	function createShortcut() {
		if (typeof($(document).data('events')) !== 'undefined' && typeof($(document).data('events').keydown) !== 'undefined') {
			var is_rmConsole = false;
			$.each($(document).data('events').keydown, 
				function(index, value) {
					if (value.type == 'rmConsole') {
						is_rmConsole = true;
					}
					if (!is_rmConsole) {
						$(document).bind('keydown.rmConsole', handleKeydown);
					}
				}
			);
		} else {
			$(document).bind('keydown.rmConsole', handleKeydown);
		}
	}
	
	function handleKeydown(evt) {
		if (evt.shiftKey && evt.altKey && evt.ctrlKey && evt.keyCode == 76) {
			toggleLog();
		}
	}
	
	function toggleLog() {
		if (log_is_visible) {
			hideLog();
		} else {
			showLog();
		}
	}
	
	function showLog() {
		var log_container = $('<div></div>');
		var container_height = .15 * $(window).height();
		var container_top = $(window).height() - container_height;
		log_container.css({
			'height': container_height + 'px',
			'top': container_top + 'px',
			'z-index': '100',
			'position': 'absolute',
			'margin': '0px auto',
			'width': '100%',
			'overflow': 'auto',
			'background-color': '#fff'
		}).attr('id', 'rmLogContainer');
		$.each(rm_console_log, 
			function(index, value) {
				var log_item = $('<div>'+ value + '</div>');
				log_item.attr('id', 'rmLog' + index);
				log_item.css('border-bottom', '1px solid #999');
				if (index % 2) {
					log_item.css('background-color', '#ccc');
				}
				log_container.append(log_item);
			}
		);
		$('body').append(log_container);
		$(window).bind('scroll.rmConsole', scrollLog);
		log_is_visible = true;
	}
	
	function hideLog() {
		$('body').find('#rmLogContainer').remove();
		log_is_visible = false;
	}
	
	function scrollLog() {
		// var new_top = $('#rmLogContainer').position().top + $(document).scrollTop();
		// $('#rmLogContainer').css('top', new_top + 'px');	
	}
	
	this.log = function(message, opts) {
		private_log(message, opts);
	}
	
	this.id = function() {
		return console_id;
	}
	
	init();
}