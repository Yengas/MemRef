import React from 'react'
import style from './Link.css'

class Link extends React.Component{
	render(){
		return (
			<div>
				<a href={this.props.href} className={style.title}>{this.props.title}</a>
				<span className={style.date}>({this.props.date.toLocaleTimeString()})</span>
				<img src={this.props.src} className={style.ref_img} />
			</div>	
		);	
	}
}

export default Link
