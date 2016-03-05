import ReactDOM from 'react-dom'
import App from './components/App.jsx'

window.addEventListener("DOMContentLoaded", () => {
	chrome.storage.local.get("history", (data) => {
		let history = Object.keys(data.history).map((key) => {
			return {...data.history[key],
				src: chrome.extension.getURL("icons/" + data.history[key].ref + ".ico"),
				date: new Date(data.history[key].time)
				};
		});
		history.sort((a, b) => { return b.time - a.time; });

		ReactDOM.render(<App history={history} perPage={25} />, document.body);
	});
})
