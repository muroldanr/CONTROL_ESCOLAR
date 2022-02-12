import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Layout from './components/Shared/Layout';
import Login from './components/Authentication/login';
import SignUp from './components/Authentication/signup';
import ForgotPassword from './components/Authentication/forgotpassword';
import NotFound from './components/Authentication/404';
import InternalServer from './components/Authentication/500';
import { BrowserRouter as Router, Route,Switch,Redirect } from 'react-router-dom';

class App extends Component {
	
	render() {
		const { darkMode, boxLayout, darkSidebar, iconColor, gradientColor, rtl, fontType } = this.props
		return (
			<div className={`${darkMode ? "dark-mode" : ""}${darkSidebar ? "sidebar_dark" : ""} ${iconColor ? "iconcolor" : ""} ${gradientColor ? "gradient" : ""} ${rtl ? "rtl" : ""} ${fontType ? fontType : ""}${boxLayout ? "boxlayout" : ""}`}>	
				<Router>
					<Switch>
						<Route exact path="/signup" component={SignUp} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/forgotpassword" component={ForgotPassword} />
						<Route exact path="/notfound" component={NotFound} />
						<Route exact path="/internalserver" component={InternalServer} />
						<Route exact path="/hr-documentos" component={Layout} />	
						<Route exact path="/hr-calificaciones" component={Layout} />	
						<Route exact path="/app-calendar" component={Layout} />
						<Route exact path="/hr-autorizaciones" component={Layout} />
						<Route exact path="/" component={Layout} />
						<Redirect to="/login"/>
					</Switch>	
				</Router>
			</div>
		);
		// let navHeader = this.state.visibility ? <Layout /> : <Login />;
		// return (
		//   <div>
		//       {navHeader}
		//   </div>
		// )
	}
}

const mapStateToProps = state => ({
	darkMode: state.settings.isDarkMode,
	darkSidebar: state.settings.isDarkSidebar,
	iconColor: state.settings.isIconColor,
	gradientColor: state.settings.isGradientColor,
	rtl: state.settings.isRtl,
	fontType: state.settings.isFont,
	boxLayout: state.settings.isBoxLayout
})

const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(App)