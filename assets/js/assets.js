(function() {
	if (document.body) { setupEmbed(); }
	else { document.addEventListener("DOMContentLoaded", setupEmbed); }
	
	function setupEmbed() {
		if (window.top != window) {
			document.body.className += " embedded";
		}
	}
	
	var o = window.assets = {};
	o.showLoading = function(id) {
		var div = id ? document.getElementById(id) : document.querySelector("div canvas").parentNode;
		div.className += " loading";
	};
	
	o.hideLoading = function() {
		var div = document.querySelector(".loading");
		div.className = div.className.replace(/\bloading\b/);
	};
})();