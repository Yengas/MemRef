/*
	An instance of a worker to hold the state of the current log history(logs) and logs to append to this history(queue)
	This worker is coded so we can have a persistent history while getting request of log adds from multiple content scripts
*/
class Worker{
	constructor(){
		this.logs = null;
		this.queue = this._refresh();
	}

	_add(...data){
		data.forEach((log) => {
			console.log("Adding:", log);
			this.logs[log.href] = log;	
		});

		return new Promise((resolve, reject) => {
			chrome.storage.local.set({history: this.logs}, () => { console.log("Add done."); resolve(); });	
		});
	}

	_clear(){
		this.logs = {};
		return new Promise((resolve, reject) => {
			console.log("Setting clear...");
			chrome.storage.local.set({ history: null }, () => { console.log("Clear done!"); resolve(); });	
		});
	}

	_refresh(){
		return new Promise((resolve, reject) => {
			chrome.storage.local.get("history", (data) => {
				if(data == null || "history" in data == false) this.logs = {};
				else this.logs = data["history"] || {};	

				console.log("Refreshed history.");
				resolve();
			});	
		});	
	}

	_process(func, ...params){
		return this.queue = this.queue.then(() => { return func.call(this, ...params); });	
	}

	add(...data){
		return this._process(this._add, ...data);	
	}

	clear(){
		return this._process(this._clear);	
	}

	refresh(){
		return this._process(this._refresh);	
	}
}

console.log("Background script started...");
let worker = new Worker();

// Wait for a port to be opened between this script and a content/options page script.
chrome.runtime.onConnect.addListener(function(port){
	port.onMessage.addListener(function(request){
		// Check if we got a `log add` or `clear` request.
		if(request.add != undefined) worker.add(request.add);
		else if(request.clear === true) worker.clear().then(() => port.postMessage({ done: true }));
	});
});
