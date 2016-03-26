import React from 'react'
import ReactPaginate from 'react-paginate'
import LinkList from './LinkList.jsx'
import style from './App.css'

class App extends React.Component{
	constructor(props){
		super(props);

		let filtered = this.getFiltered(props.history, 'all');
		this.state = 	{ 
					logs: this.getLogRange(filtered, 0, props.perPage), // Shown logs
					filtered, // Filtered logs by ref
					filters:  ['all', 'reddit', 'ycombinator'], 
					selected: { filter: 'all', page: 0 } 
				};	
	}

	componentDidMount(){
		window.addEventListener("keydown", this.onKeyPressed);	
	}

	componentWillUnmount(){
		window.removeEventListener("keydown", this.onKeyPressed);	
	}

	getLogRange = (logs, page, perPage) => {
		let offset = Math.ceil(page * perPage)
		if(offset < 0 || offset >= logs.length) return [];

		return logs.slice(offset, offset + perPage);	
	}

	getFiltered = (logs, selected) => {
		return logs.filter((log) => { return selected == 'all' || log.ref == selected; })	
	}

	handlePageClick = (data = {selected: 0}) => {
		if(data.selected < 0) return false;
		let logs = this.getLogRange(this.state.filtered, data.selected, this.props.perPage);
		if(logs.length == 0) return false;

		this.setState({
			selected: {...this.state.selected, page: data.selected},
			logs
		});	
		window.scrollTo(0, 0);
	}

	onKeyPressed = (e) => {
		if(e.which != 37 && e.which != 39) return true;	
		this.handlePageClick({selected: this.state.selected.page + (e.which == 39 ? 1 : -1)});
	}

	onFilterClick = (e) => {
		let filter = e == undefined ? 'all' : e.target.innerText;
		let filtered = this.getFiltered(this.props.history, filter); 

		this.setState({ selected: {page: 0, filter}, filtered, logs: this.getLogRange(filtered, 0, this.props.perPage)});
	}

	clearClicked = (e) => {
		if(window.confirm("Are you sure? All of your precious history will be removed.")){
			let port = chrome.runtime.connect({ name: "options" });

			port.onMessage.addListener(() => {
				port.disconnect();	
				location.reload();
			});
			port.postMessage({clear: true});
		}	
	};

	render(){
		if(typeof this.props.history != "object" || this.props.history.length == 0){
			return (<h1>Found nothing!</h1>);	
		}

		return (
			<div width="100%" height="100%">
				<h1>MemRef | Options</h1>
				<div className={style.manage}>
					<input type={"button"} onClick={this.clearClicked} value={"Clear History"} />
				</div>
				{this.state.filters.map((filter) => {
					return filter == this.state.selected.filter ?
						(<span className={style.selected}>{filter}</span>)
						:
						(<a href="#" onClick={this.onFilterClick} className={style.category}>{filter}</a>);	
				})}
				<span className={style.page_info}>Current Page: <span className={style.page}>{this.state.selected.page + 1}</span></span>
				<LinkList logs={this.state.logs} />
				<ReactPaginate 
					pageNum={Math.ceil(this.state.filtered.length / this.props.perPage)}
					forceSelected={this.state.selected.page}
					marginPagesDisplayed={2}
					clickCallback={this.handlePageClick}
					pageRangeDisplayed={5}
					containerClassName={style.pagination}
				       	/>
			</div>
		);	
	}
}

export default App
