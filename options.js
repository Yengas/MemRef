// Create a single element that is shown to the end user. Representing an instance of a visited page.
function createLogElement(log){
	var elem = document.createElement("div"), 
		link = document.createElement("a"), 
		stamp = document.createElement("span"), 
		reference = document.createElement("img");
	
	elem.className = "log";
	link.href = log.href;
	link.innerText = log.title;
	stamp.innerText = '(' + log.date.toLocaleTimeString() + ')';
	reference.src = chrome.extension.getURL("icons/" + log.ref + ".ico");
	elem.appendChild(link);
	elem.appendChild(stamp);
	elem.appendChild(reference);
	return elem;
}

// Populate the list with the given history of visited pages.
function populate(logs){
	var  last = "", list = document.querySelector("#list");
	
	list.innerHTML = "";
	for(var i in logs){
		logs[i].date = new Date(logs[i].time);
		var day = logs[i].date.toLocaleDateString();
		
		// Append the day of the year header
		if(last != day){
			var header = document.createElement("h2");
			
			last = day;
			header.innerText = day;
			list.appendChild(header);
		}
		list.appendChild(createLogElement(logs[i]));
	}
}

// Send a request to the event page(non-persistent background page) to clear the visited pages history and clear the list
function clear(){
	if(window.confirm("Are you sure you want to clear all of your log history?") == false) return;
	var port = chrome.runtime.connect({name: "cleaner"});
	port.postMessage({ clear: true });
	port.disconnect();
	document.querySelector("#list").innerHTML = "";
}

// Initialize the page and create filters
function initialize(logs){
	var filters = ["", "Reddit", "YCombinator"], filterList = document.querySelector("#filters");
	
	for(var i in filters){
		var link = document.createElement("a");
		
		link.href = "#";
		link.innerText = filters[i] == "" ? "ALL" : filters[i];
		link.addEventListener("click", function(e){
			if(e.target.hasAttribute('disabled')) return true;
			var filter = e.target.innerText.toLowerCase(), disabled = document.querySelector("#filters a[disabled]");
			
			if(disabled != null) disabled.removeAttribute('disabled');
			e.target.setAttribute("disabled", "");
			populate(logs.filter(function(log){ return  filter == "all" || log.ref == filter; }));
		});
		
		if(i > 0) filterList.appendChild(document.createTextNode(" | "));
		filterList.appendChild(link);
	}
	filterList.querySelector("a").click();
}
	
window.addEventListener("DOMContentLoaded", function(){
	document.querySelector("#clear").addEventListener("click", clear);
	
	chrome.storage.sync.get("history", function(data){
		var history = data["history"] || {}, logs = [];
		
		// Visited pages are stored in an object with visited page url as the key and the page_url, time, title and reference site as the value.
		// This way we can keep one log for each of the visited urls. We make an array out of the values of this object and sort the values by time desc.
		for(var key in history) logs.push(history[key]);
		logs.sort(function(a, b){ return b.time - a.time; });
		
		initialize(logs);
	});
});