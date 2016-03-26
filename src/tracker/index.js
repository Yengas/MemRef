// Communicate with the background script, which handles the storage modifications and make it add a new log.
function addLink(href, title, ref){
	let data = { href, title, ref, time: Date.now() };
	let port = chrome.runtime.connect({name: "adder"});

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
	let cfg = config[location.host];

	// For each css selector to follow...
	[].forEach.call(cfg.follow, (follow) => {
		// Get every element in the dom which are to be followed...
		let things = document.querySelectorAll(follow);

		// and add click listeners to them.
		[].forEach.call(things, (thing) => {
			if(typeof thing != "object") return;	

			thing.addEventListener("click", (e) => {
				// Add the clicked element to the log history
				addLink(e.target.href, e.target.innerText, cfg.ref);	
			});
		});
	});
}
