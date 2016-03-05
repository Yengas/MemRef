import React from 'react'

class Link extends React.Component{
	render(){
		return (
			<div>
				<a href={this.props.href}>{this.props.title}</a>
				<span>({this.props.date.toLocaleTimeString()})</span>
				<img src={this.props.src} />
			</div>	
		);	
	}
}

export default Link
