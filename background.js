/*
	An instance of a worker to hold the state of the current log history(logs) and logs to append to this history(queue)
	This worker is coded so we can have a persistent history while getting request of log adds from multiple content scripts
*/
var worker = new (function Worker(){
	var logs = null, onStorageLoad = [], queue = [], working = false;
	
	chrome.storage.sync.get("history", function(data){
		if(data == null || "history" in data == false) logs = {};
		else logs = data["history"] || {};
		
		(function call(i){
			if(typeof onStorageLoad[i] == "function") onStorageLoad[i](logs, function(){ call(i + 1); }); 
		})(0);
	});
	
	function work(_, next){
		// If we get a request of `log add` before we finish retrieving history from the chrome storage, wait for the retrieving to finish.
		if(logs == null){
			if(onStorageLoad.indexOf(work) == -1) onStorageLoad.push(work);
			return;
		}
		
		// Set working true while processing the `log add` requests. So only one work function will be executed when we recieve multiple add requests.
		working = true;
		(function process(){
			if(queue.length == 0){
				working = false;
				if(typeof next == "function") next();
				return;
			}
			
			var data = queue.pop();
			
			logs[data.href] = data;
			// Store the updated log history and process the next `log add` request by calling the process function when storing completes.
			chrome.storage.sync.set({"history": logs}, process);
		})();
	}
	
	// Clear the log history.
	Worker.prototype.clear = function(_, next){
		// If we get a `clear` request before we retrieve the log history, wait for the retrieving to finish and then clear the history.
		if(logs == null){
			// Make sure the clear function is the first to be called after the retrieving of the log history completes.
			if(onStorageLoad[0] != this.clear) onStorageLoad.unshift(this.clear);
			return;
		}
		
		logs = {};
		chrome.storage.sync.set({history: {}}, next);
	};
	
	// Push `log add` request to the queue and call the work function for processing if it isn't working already.
	Worker.prototype.add = function(data){
		queue.push(data);
		if(working == false) work();
	}
})();

// Wait for a port to be opened between this script and a content/options page script.
chrome.runtime.onConnect.addListener(function(port){
	port.onMessage.addListener(function(request){
		// Check if we got a `log add` or `clear` request.
		if(request.add != undefined) worker.add(request.add);
		else if(request.clear == true) worker.clear();
	});
});