import React, { Component } from 'react';
import Menu from './Menu';
import MenuAutorizaciones from './MenuAutorizaciones';
import { Redirect } from 'react-router'
import Loader from '../Loader/Loader';

export default class Layout extends Component {

	getSession = () => {
		if(localStorage.getItem("token")){
			return true;
		} else{
			return false;
		}
			
	}

	getRole = () => {
	
	let role = localStorage.getItem("rol");
	switch(role){
		
		case "Control Escolar" :	
			return (<>
				<Loader></Loader>
				<div id="main_content">
					<Menu {...this.props} getRole={() => this.getRole()}/>
				</div>
				</>)
		case "Autorizaciones": 
			return (<>
					<Loader></Loader>
					<div id="main_content">
						<MenuAutorizaciones {...this.props} getRole={() => this.getRole()} />
						<Redirect to={{ pathname: '/hr-autorizaciones' }} />
					</div>
					</>)
		default: 
				this.setState({role : ""})
			return (<Redirect to={{ pathname: '/login' }} />)
	}

	}

	render() {
		this.getSession();
		return (
			this.getSession() ?
			<>
				{this.getRole()}
			</>
			:
			<Redirect to={{ pathname: '/login' }} />
		);
	}
}
