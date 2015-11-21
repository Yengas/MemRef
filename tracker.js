// Communicate with the background script, which handles the storage modifications and make it add a new log.
function addLink(href, title, ref){
	var data = { href: href, title: title, ref: ref, time: Date.now() };

	var port = chrome.runtime.connect({name: "adder"});
	port.postMessage({add: data});
	port.disconnect();
}


var config = {
	"news.ycombinator.com": {
		ref: "ycombinator",
		follow: [".athing .title > a"]
	},
	"www.reddit.com": {
		ref: "reddit",
		follow: [".entry > p.title > a.title"]
	}
};

// Loaded content script on document_idle no need to wait for document on load before querying or modifiying document elements. 
// Check which page this content script is running on and if we need to follow any links...
if(config[location.host] != undefined){
	var cfg = config[location.host];

	// For each css selector to follow...
	for(var f in cfg.follow){
		// Get every link to be followed in the dom...
		var follow = cfg.follow[f], things = document.querySelectorAll(follow);
		
		// And add click listeners to them.
		for(var i in things){
			var thing = things[i];
			if(typeof thing != "object") continue;
			
			thing.addEventListener("click", function(e){
				// Add the clicked link to the log history.
				addLink(e.target.href, e.target.innerText, cfg.ref);
			});
		}
	}
}