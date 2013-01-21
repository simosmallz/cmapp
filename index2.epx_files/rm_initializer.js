/*
rmInitializer and rmInitData classes
/global/ui/richmedia/js/utils/rm_initializer.js
Last Edit: 03.23.12 - VS
*/

/*
02.01.11 - Added UMP case - vs
02.03.11 - Added UMP_open case - vs (This might need to change.)
03.03.11 - Added require for utils/rm_UMP_config - dah
03.15.11 - Added require.ready to the UMP and main scripts (didn't touch the others, since I dunno what's going on with them.) - VS
04.05.11 - added rm_try() - VS
05.11.11 - added UMP_open and UMP_open_asset events
07.18.11 - reworked for sap.master changes - VS
07.21.11 - added UMP_open - VS 
09.22.11 - compiled all changes from all servers
		 - UMP_modal becomes UMP_open and UMP_asset
10.04.11 - added rm_login - VS
02.28.12 - added UMP_open_absolute - VS
03.23.12 - added rm_try(UMPconfig.flagForRemote) 

*/


function rm_try(doFunc) {
	//This function is the fix for Firefox 3.5.10 and lower. 
	//This fixes the require.ready not firing correctly with ajax and hashbangs
	//04.05.11 - VS
	/*try { 
		doFunc();
	} catch(e) {
		require.ready(function(){
			doFunc();
		});
	}*/
		
	//Above removed on 7.18.11 - seems to be causing a fail with the new methods. Don't have ff3.5 to test... - VS
	
	//07.18.11
	require.ready(function(){
		doFunc();
	});
}


require(['utils/rm_console', 'utils/rm_UMP_config'], 
	function(console) {
		/*try { 
			rmInitializer();
		} catch(e) {
			require.ready(function(){
				rmInitializer();
			});
		}*/
		rm_try(UMPconfig.flagForRemote);
		rm_try(rmInitializer);
		
	}
);


function rm_ajaxSuccess() {
	rm_try(rmInitializer);
};


function rmInitializer() {
	this.rm_initializer_data = new rmInitData();
	/* add the class that will trigger your project here! */
	var project_classes = [
		'rmTestProjectClass1',
		'rmTestProjectClass2',
		'UMP_div',
		'UMP_open',
		'UMP_open_asset',
		'UMP_open_absolute',
		'rm_modal',
		'rm_login'
	];
	
	for (var n in project_classes) {
		var test_case = project_classes[n];
		if ($('.' + test_case).length > 0) {
			/* add a test case to require your class here! */
			switch(test_case) {
				case 'rmTestProjectClass1':
					rm_initializer_data.add(test_case);
					require(['docs/initializer_test/test_class1'], function(testClass) {
						rmTestClass1();
						rm_initializer_data.success(test_case);
					});
					break;
				case 'rmTestProjectClass2':
					rm_initializer_data.add(test_case);
					require(['docs/initializer_test/test_class2'], function(testClass) {
						rmTestClass2();
						rm_initializer_data.success(test_case);
					});
					break;
				case 'UMP_div' :
					rm_initializer_data.add(test_case);
					require(['projects/rm_UMP/rm_UMP'], function(testClass) {
						
						rm_try(UMP.init);
						
						/*try { 
							UMP.init();
							rm_initializer_data.success(test_case);
						} catch(e) {
							require.ready(function(){
								UMP.init();
								rm_initializer_data.success(test_case);
							});
						}*/
						
						/*require.ready(function(){
							UMP.init();
							rm_initializer_data.success(test_case);
						});*/
					});
					break;
				case 'UMP_open' :
					rm_initializer_data.add(test_case);
					require(['projects/rm_UMP/rm_UMP'], function(testClass) {
						rm_try(UMP.init);
					});
					break;
				case 'UMP_open_asset' :
					rm_initializer_data.add(test_case);
					require(['projects/rm_UMP/rm_UMP'], function(testClass) {
						rm_try(UMP.init);
					});
					break;
				case 'UMP_open_absolute' :
					rm_initializer_data.add(test_case);
					require(['projects/rm_UMP/rm_UMP'], function(testClass) {
						rm_try(UMP.init);
					});
					break;
				case 'rm_modal' :
					rm_initializer_data.add(test_case);
					require(['utils/rm_dhtml'], function(testClass) {
						rm_try(rmDHTML.init_modal_link);
					});
					break;
				case 'rm_login' :
					rm_initializer_data.add(test_case);
					require(['utils/rm_dhtml'], function(testClass) {
						rm_try(rmDHTML.init_rm_login);
					});
					break;
				default:
					//init_console.log(test_case + ' not available');
					break;
			}
		}
	}
}

function rmInitData() {
	var loaded_projects = [];
	
	this.add = function(project_class) {
		var this_project = {'className': project_class, 'isLoaded': false};
		
		if (!this.hasProject(project_class)) {
			loaded_projects.push(this_project);
		}
	}
	
	this.success = function(project_class) {
		if (this.hasProject(project_class)) {
			this.getProject(project_class).isLoaded = true;
		}
	}
	
	this.hasProject = function(project_class) {
		var match_count = 0;
		for (var n in loaded_projects) {
			if (project_class == loaded_projects[n].className) {
				match_count++;
			}
		}
		
		if (match_count == 0) {
			return false;
		} else {
			return true;
		}
	}
	
	this.getProject = function(project_class) {
		for (var n in loaded_projects) {
			if (project_class == loaded_projects[n].className) {
				return loaded_projects[n];
			}
		}
		
		return false;
	}
}