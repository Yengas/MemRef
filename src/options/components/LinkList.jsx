import React from 'react'
import Link from './Link.jsx'

class LinkList extends React.Component{
	render(){
		let previous = null;	

		return (
			<div>
				{this.props.logs.map((log) => {
					let current_date = log.date.toLocaleDateString();

					if(previous != current_date){
						previous = current_date;

						return (<div>
								<h2>{current_date}</h2>
								<Link {...log} />
							</div>);	
					}

					return <Link {...log} />;	
				})}				
			</div>	
		);	
	}
}

export default LinkList
