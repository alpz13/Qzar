/*
 * META Doc
 * Documentation generator
 *
 * @author META Platform <www.meta-platform.com>
 * @license See LICENSE file distributed with this source code
 */

Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInOutSine = function (t, b, c, d) {
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
};

Math.easeInOutCubic = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};

var scrollToElement = function(element, duration, offset, callback) {
    var start = document.body.scrollTop || document.documentElement.scrollTop,
        change = Math.max(0, element.offsetTop + offset) - start,
        currentTime = 0,
        increment = 20;
				
    var animateScroll = function(){
        currentTime += increment;
        var val = Math.easeInOutCubic(currentTime, start, change, duration);                        
        document.body.scrollTop = val; 
		document.documentElement.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        } else callback();
    };
	
    animateScroll();
};

var scrollNav = function(){

	//Get items
	var items = document.querySelectorAll("nav#toc ul.current > li");
	var lastItem = null;

	//Parse and store anchors
	for(var i = 0; i < items.length; i++){
		var item = items.item(i);
		
		if(item.getAttribute("data-anchor")){
			item._anchorEl = document.getElementById(item.getAttribute("data-anchor"));

			if(item._anchorEl)
				item._anchorTop = item._anchorEl.parentElement.offsetTop;

		}

	}

	var handle = function(){

		var currentItem = null;
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		var scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
		var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		if(scrollTop + viewportHeight < scrollHeight){

			for(var i = 0; i < items.length; i++){

				if(scrollTop >= items.item(i)._anchorTop - 10)
					currentItem = items.item(i);

			}

		} else {

			if(items.length > 0)
				currentItem = items.item(items.length - 1);

		}

		if(!currentItem && items.length > 0)
			currentItem = items.item(0);

		if(lastItem != currentItem){
			
			if(lastItem)
				lastItem.classList.remove("active");

			if(currentItem)
				currentItem.classList.add("active");

			lastItem = currentItem;

		}

	};

	window.addEventListener("scroll", handle);
	handle();

};

var scrollLink = function(){

	var navEl = document.getElementById("toc");

	var bindLink = function(linkEl){

		linkEl.addEventListener("click", function(ev){

			var href = linkEl.getAttribute('href');

			if (href.indexOf('#') >= 0) {

				var hash = href.indexOf('#');
				var targetAnchor = href.substr(hash + 1);

				var target = document.getElementById(targetAnchor);
				
				if(target){

					scrollToElement(target.parentElement, 1000, 0, function(){
						currentTop = document.body.scrollTop || document.documentElement.scrollTop;
						location.href = "#" + targetAnchor;
						document.body.scrollTop = currentTop;
						document.documentElement.scrollTop = currentTop;
					});

					if(navEl.classList.contains("opened"))
						navEl.classList.remove("opened");
					
					ev.preventDefault();

					return false;

				}

			}

		});

	};

	//Get links
	var links = document.querySelectorAll("nav#toc ul.current > li.section > a, nav#toc li.current.page > a, #page a[href^=\"#\"]");

	for(var i = 0; i < links.length; i++)
		bindLink(links.item(i));

};

var headerNav = function(){

	var navEl    = document.getElementById("header-nav");
	var btnOpen  = document.getElementById("menu-open");
	var btnClose = document.getElementById("menu-close");

	btnOpen.addEventListener("click", function(){
		navEl.classList.add("opened");
	});

	btnClose.addEventListener("click", function(){
		navEl.classList.remove("opened");
	});

};

var tocNav = function(){

	var navEl = document.getElementById("toc");
	var btnEl = document.getElementById("toc-toggle");

	navEl.addEventListener("click", function(ev){
		ev.stopPropagation();
	});

	btnEl.addEventListener("click", function(){
		navEl.classList.toggle("opened");
	});

	document.body.addEventListener("click", function(){

		if(navEl.classList.contains("opened"))
			navEl.classList.remove("opened");

	});

};

var lightbox = function(){

	var lightboxEl = document.querySelector("#lightbox");
	var container = document.querySelector("#lightbox .container");
	var closeBtn = document.querySelector("#lightbox .close");

	var imgSize = null;

	var resize = function(){

		if(!imgSize) return;

		var maxWidth = lightboxEl.offsetWidth * 0.9;
		var maxHeight = lightboxEl.offsetHeight * 0.9;

		var width = imgSize[0];
		var height = imgSize[1];

		if(width > maxWidth){
			height = height / width * maxWidth;
			width = maxWidth;
		}

		if(height > maxHeight){
			width = width / height * maxHeight;
			height = maxHeight;
		}

		container.style.width = width + "px";
		container.style.height = height + "px";

	};

	var open = function(imageUrl){

		lightboxEl.classList.add("opened");

		setTimeout(function(){

			lightboxEl.classList.remove("ready");
			lightboxEl.classList.add("loading");
			lightboxEl.classList.remove("transparent");

			if(imageUrl.match(/\.png$/))
				lightboxEl.classList.add("transparent");

			var img = new Image();

			img.onload = function(){

				//Resize container
				imgSize = [ img.width, img.height ];

				resize();

				//Wait for resize and show
				setTimeout(function(){
					
					container.innerHTML = '';
					container.appendChild(img);

					lightboxEl.classList.remove("loading");
					lightboxEl.classList.add("ready");

				}, 300);

			};

			//Set image source
			img.src = imageUrl;

		}, 100);

	};

	var close = function(){

		lightboxEl.classList.remove("loading");
		lightboxEl.classList.remove("ready");
		lightboxEl.classList.remove("transparent");

		setTimeout(function(){
			lightboxEl.classList.remove("opened");
			imgSize = null;
		}, 300);

	};

	closeBtn.addEventListener("click", close);
	lightboxEl.addEventListener("click", close);
	
	window.addEventListener("resize", resize);	

	//Bind lightbox links
	var bindLink = function(linkEl){

		linkEl.addEventListener("click", function(ev){
			open(linkEl.getAttribute("href"));

			ev.preventDefault();
			return false;
		});

	};

	var links = document.querySelectorAll('a[href$=".png"]:not([target="_blank"]), a[href$=".jpg"]:not([target="_blank"])');

	for(var i = 0; i < links.length; i++)
		bindLink(links.item(i));

};

window.addEventListener("load", function(){

	//headerShadow();
	scrollNav();
	scrollLink();
	headerNav();
	tocNav();
	lightbox();

});