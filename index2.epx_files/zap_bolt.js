function TryLoadZAPtracker(value)
{
	try{ 
	   	loadZAPtracker(value, '');
	}
	catch (e) {}
	return true;
}

//<!-- ZAP Lightning Bolt Begins -->
	try{ 
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = document.location.protocol + '//b3.mookie1.com/0/B3/ZAM/ZAP_bolt.js';
		script.id = 'zap_bolt';
		document.body.appendChild(script);
		script = null;
	}
	catch (e) {}
//<!-- ZAP Lightning Bolt Ends -->