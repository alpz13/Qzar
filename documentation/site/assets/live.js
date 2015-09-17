/*
 * META Doc
 * Documentation generator
 *
 * @author META Platform <www.meta-platform.com>
 * @license See LICENSE file distributed with this source code
 */

var initLiveReload = function(){

	var pageId = location.pathname.replace("index.html", "");
	var initTimestamp = null;

	var check = function(){

		var oReq = new XMLHttpRequest();
		
		oReq.addEventListener('load', function(){

			var timestamp = parseInt(this.responseText);

			if(!initTimestamp){
				initTimestamp = timestamp;
			} else if(timestamp != initTimestamp){
				
				//Save current scroll
				if(localStorage){
					localStorage["meta-doc-live-scroll"] = document.body.scrollTop || document.documentElement.scrollTop;
					localStorage["meta-doc-live-path"] = location.href;
				}

				//Reload
				location.reload();

			}

		});

		oReq.open("get", "/_mtime/" + pageId, true);
		oReq.send();

	};

	setInterval(check, 1000);
	check();

	//Restore scroll?
	if(localStorage && localStorage["meta-doc-live-path"] === location.href && localStorage["meta-doc-live-scroll"]){
		document.body.scrollTop = parseInt(localStorage["meta-doc-live-scroll"]);

		if(document.documentElement)
			document.documentElement.scrollTop = parseInt(localStorage["meta-doc-live-scroll"]);

		localStorage["meta-doc-live-path"] = null;
	}

};

window.addEventListener("load", function(){

	if(location.hostname === "localhost" || location.hostname === "127.0.0.1"){
		initLiveReload();
	}

});