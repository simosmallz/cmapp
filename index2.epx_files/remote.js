var pfnXHR = null;

if (typeof(XMLHttpRequest) == 'undefined') {
	var XMLHttpRequest = function() {
		var r = null;
		if (pfnXHR) return pfnXHR();
		else {
			try	{
				pfnXHR = function() { return new ActiveXObject('Msxml2.XMLHTTP'); }
				r = pfnXHR();
			}
			catch(e) {
				try	{
					pfnXHR = function() { return new ActiveXObject('Microsoft.XMLHTTP'); }
					r = pfnXHR();
				}
				catch(ee){
					pfnXHR = function() { return null; }
				}
			}
			return r;
		}
	}
}

function RemoteMethod(URL)
{
	this.RemoteURL = URL;
	this.MethodName = null;
	this.RemoteArgs = new Array();
	this.LocalObjectID = null;
	this.LocalAction = null;
}

RemoteMethod.prototype.AddArguments = function()
{
	// necessary because "arguments" isn't necessarily an array; in FireFox it's an object
	for (i = 0; i < arguments.length; i++) {
		this.AddArgument(arguments[i]);
	}
}

RemoteMethod.prototype.AddArgument = function(arg)
{
	this.RemoteArgs.push(arg);
}

RemoteMethod.prototype.Invoke = function()
{
	var req = new XMLHttpRequest();
	var pfnCallback = this.LocalAction;
	var objCallback = this.LocalObjectID;
	var async = pfnCallback != null;
	if (async)
	{
		req.onreadystatechange = function()
		{
			// only if req shows "loaded"
			if (req.readyState == 4)
			{
				// only if "OK"
				if (req.status == 200)
				{
					if (req.responseText)
						if(objCallback != null)
						{
							eval(objCallback + '.' + pfnCallback + '(' + req.responseText + ')');
						}
						else
							pfnCallback(eval(req.responseText));
					else
						if(objCallback != null)
						{
							eval(objCallback + '.' + pfnCallback + '(null)');
						}
						else
							pfnCallback(null);
			   	}else{
					pfnCallback(null);
				    window.status = "There was a problem retrieving the XML data:\n" +
						req.statusText;
			    	}
		    	}
      		}	
    	}
	req.open("POST", this.RemoteURL, true);
	var obj = {"method":this.MethodName, "arguments":this.RemoteArgs}
	var jsonStr = JSON.stringify(obj);
	req.send(jsonStr);
}

function remoteInvoke(scriptName, methodName) {
	var req = new XMLHttpRequest();
	var args = null;
	var pfnCallback = null;
	if (arguments.length > 2) {
		args = new Array();
		for (var i = 2; i < arguments.length; i++) {
			if (typeof(arguments[i]) == "function") {
				pfnCallback = arguments[i];
			}
			else {
				args.push(arguments[i]);
			}
		}
	}
	var async = pfnCallback != null;
	if (async) {
        req.onreadystatechange = function() {
		    // only if req shows "loaded"
		    if (req.readyState == 4) {
			    // only if "OK"
			    if (req.status == 200) {
			        if (req.responseText)
			            pfnCallback(eval(req.responseText));
			        else
				        pfnCallback(null);
			    } else {
				    window.status = "There was a problem retrieving the XML data:\n" +
				    	req.statusText;
			    }
		    }
        }
    }
	req.open("POST", scriptName, true);
	var obj = {"method":methodName, "arguments":args}
	var jsonStr = JSON.stringify(obj);
	req.send(jsonStr);
}



///JSON stuff
/*
Copyright (c) 2005 JSON.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The Software shall be used for Good, not Evil.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var JSON = {
    org: 'http://www.JSON.org',
    copyright: '(c)2005 JSON.org',
    license: 'http://www.crockford.com/JSON/license.html',
    stringify: function (arg) {
        var c, i, l, s = '', v;

        switch (typeof arg) {
        case 'object':
            if (arg) {
                if (arg.constructor == Array) {
                    for (i = 0; i < arg.length; ++i) {
                        v = this.stringify(arg[i]);
                        if (s) {
                            s += ',';
                        }
                        s += v;
                    }
                    return '[' + s + ']';
                } else if (typeof arg.toString != 'undefined') {
                    for (i in arg) {
                        v = arg[i];
                        if (typeof v != 'undefined' && typeof v != 'function') {
                            v = this.stringify(v);
                            if (s) {
                                s += ',';
                            }
                            s += this.stringify(i) + ':' + v;
                        }
                    }
                    return '{' + s + '}';
                }
            }
            return 'null';
        case 'number':
            return isFinite(arg) ? String(arg) : 'null';
        case 'string':
            l = arg.length;
            s = '"';
            for (i = 0; i < l; i += 1) {
                c = arg.charAt(i);
                if (c >= ' ') {
                    if (c == '\\' || c == '"') {
                        s += '\\';
                    }
                    s += c;
                } else {
                    switch (c) {
                        case '\b':
                            s += '\\b';
                            break;
                        case '\f':
                            s += '\\f';
                            break;
                        case '\n':
                            s += '\\n';
                            break;
                        case '\r':
                            s += '\\r';
                            break;
                        case '\t':
                            s += '\\t';
                            break;
                        default:
                            c = c.charCodeAt();
                            s += '\\u00' + Math.floor(c / 16).toString(16) +
                                (c % 16).toString(16);
                    }
                }
            }
            return s + '"';
        case 'boolean':
            return String(arg);
        default:
            return 'null';
        }
    }
};
