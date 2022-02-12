import React, { Component } from 'react';
import { connect } from 'react-redux';
import MetisMenu from 'react-metismenu';
import { Switch, Route} from 'react-router-dom';
import Header from '../Shared/Header';
import DefaultLink from './DefaultLink';
//import { Redirect } from 'react-router';
//import { useHistory } from 'react-router-dom';

import {
	darkModeAction, darkHeaderAction, fixNavbarAction,
	darkMinSidebarAction, darkSidebarAction, iconColorAction,
	gradientColorAction, rtlAction, fontAction,
	subMenuIconAction,
	menuIconAction,
	boxLayoutAction,
	statisticsAction, friendListAction,
	statisticsCloseAction, friendListCloseAction, toggleLeftMenuAction
} from '../../actions/settingsAction';
import Routes from '../Route';



const masterNone = {
	display: 'none',
};

const masterBlock = {
	display: 'block',
};

let content = [];

class MenuAutorizaciones extends Component {
	constructor(props) {
		super(props);
		this.toggleLeftMenu = this.toggleLeftMenu.bind(this);
		this.toggleUserMenu = this.toggleUserMenu.bind(this);
		this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
		this.toggleSubMenu = this.toggleSubMenu.bind(this);
		this.handleDarkMode = this.handleDarkMode.bind(this);
		this.handleFixNavbar = this.handleFixNavbar.bind(this);
		this.handleDarkHeader = this.handleDarkHeader.bind(this);
		this.handleMinSidebar = this.handleMinSidebar.bind(this);
		this.handleSidebar = this.handleSidebar.bind(this);
		this.handleIconColor = this.handleIconColor.bind(this);
		this.handleGradientColor = this.handleGradientColor.bind(this);
		this.handleRtl = this.handleRtl.bind(this);
		this.handleFont = this.handleFont.bind(this);
		this.handleStatistics = this.handleStatistics.bind(this);
		this.handleFriendList = this.handleFriendList.bind(this);
		this.closeFriendList = this.closeFriendList.bind(this);
		this.closeStatistics = this.closeStatistics.bind(this);
		this.handleBoxLayout = this.handleBoxLayout.bind(this);
		this.handler = this.handler.bind(this);
		this.state = {
			isToggleLeftMenu: false,
			isOpenUserMenu: false,
			isOpenRightSidebar: false,
			isBoxLayout: false,
			parentlink: null,
			childlink: null,
		};
	}

	componentDidMount() {
		const { location } = this.props;
		const links = location.pathname.substring(1).split(/-(.+)/);
		const parentlink = links[0];
		const nochildlink = links[1];

		if (parentlink && nochildlink && nochildlink === 'dashboard') {
			this.handler(parentlink, `${parentlink}${nochildlink}`);
		} else if (parentlink && nochildlink && nochildlink !== 'dashboard') {
			this.handler(parentlink, nochildlink);
		} else if (parentlink) {
			this.handler(parentlink, '');
		} else {
			this.handler('hr', 'dashboard');
		}
	}

	componentDidUpdate(prevprops, prevstate) {
		const { location } = this.props;
		const links = location.pathname.substring(1).split(/-(.+)/);
		const parentlink = links[0];
		const nochildlink = links[1];
		if (prevprops.location !== location) {
			if (parentlink && nochildlink && nochildlink === 'dashboard') {
				this.handler(parentlink, `${parentlink}${nochildlink}`);
			} else if (parentlink && nochildlink && nochildlink !== 'dashboard') {
				this.handler(parentlink, nochildlink);
			} else if (parentlink) {
				this.handler(parentlink, '');
			} else {
				this.handler('hr', 'dashboard');
			}
		}
	}

	handler(parentlink, nochildlink) {
		this.setState({
			parentlink: parentlink,
			childlink: nochildlink,
		});
	}

	handleDarkMode(e) {
		this.props.darkModeAction(e.target.checked)
	}
	handleFixNavbar(e) {
		this.props.fixNavbarAction(e.target.checked)
	}
	handleDarkHeader(e) {
		this.props.darkHeaderAction(e.target.checked)
	}
	handleMinSidebar(e) {
		this.props.darkMinSidebarAction(e.target.checked)
	}
	handleSidebar(e) {
		this.props.darkSidebarAction(e.target.checked)
	}
	handleIconColor(e) {
		this.props.iconColorAction(e.target.checked)
	}
	handleGradientColor(e) {
		this.props.gradientColorAction(e.target.checked)
	}
	handleRtl(e) {
		this.props.rtlAction(e.target.checked)
	}
	handleFont(e) {
		this.props.fontAction(e)
	}
	handleFriendList(e) {
		this.props.friendListAction(e)
	}
	handleStatistics(e) {
		this.props.statisticsAction(e)
	}
	closeFriendList(e) {
		this.props.friendListCloseAction(e)
	}
	closeStatistics(e) {
		this.props.statisticsCloseAction(e)
	}
	handleSubMenuIcon(e) {
		this.props.subMenuIconAction(e)
	}
	handleMenuIcon(e) {
		this.props.menuIconAction(e)
	}
	handleBoxLayout(e) {
		this.props.boxLayoutAction(e.target.checked)
	}
	toggleLeftMenu(e) {
		this.props.toggleLeftMenuAction(e)
	}
	toggleRightSidebar() {
		this.setState({ isOpenRightSidebar: !this.state.isOpenRightSidebar })
	}
	toggleUserMenu() {
		this.setState({ isOpenUserMenu: !this.state.isOpenUserMenu })
	}
	closeSesion = () => {
		this.setState({ isOpenUserMenu: !this.state.isOpenUserMenu })
		localStorage.setItem("token","");
		localStorage.setItem("usuario","");
		localStorage.setItem("rol","");
		this.props.getRole();
	}


	
	toggleSubMenu(e) {
		let menucClass = ''
		if (e.itemId) {
			const subClass = e.items.map((menuItem, i) => {
				if (menuItem.to === this.props.location.pathname) {
					menucClass = "in";
				} else {
					menucClass = "collapse";
				}
				return menucClass
			})
			return subClass
			// return "collapse";
		} else {
			return e.visible ? "collapse" : "metismenu";
		}
	}

	render() {
		if(localStorage.getItem("rol")  === "Autorizaciones"){
			content = [
				{
					"id": 'Directories',
					"label": "MENU"
				},
				{
					"id": 13,
					"icon": "icon-book-open",
					"label": "Autorizaciones",
					"to": "/hr-autorizaciones"
				},
				
			];
		}else{
			content = [
				{
					"id": 'Directories',
					"label": "MENU"
				},
				{
					"id": 3,
					"icon": "icon-bar-chart",
					"label": "Dashboard",
					"to": "/"
				},
				{
					"id": 13,
					"icon": "icon-notebook",
					"label": "Documentos",
					"to": "/hr-documentos"
				},			
				
			];
			/*{
				"id": 1,
				"icon": "icon-home",
				"label": "Home",
				"to": "#!",
				content: [
					{
						"id": 3,
						"label": "Dashboard",
						"to": "/"
					},
					/*{
						"id": 4,
						"label": "Users",
						"to": "/hr-users"
					},
					{
						"id": 5,
						"label": "Department",
						"to": "/hr-department"
					},
					{
						"id": 6,
						"label": "Employee",
						"to": "/hr-employee"
					},
					{
						"id": 7,
						"label": "Activities",
						"to": "/hr-activities"
					},
					{
						"id": 8,
						"label": "Holidays",
						"to": "/hr-holidays"
					},
					{
						"id": 9,
						"label": "Events",
						"to": "/hr-events"
					},
					{
						"id": 10,
						"label": "Payroll",
						"to": "/hr-payroll"
					},
					{
						"id": 11,
						"label": "Accounts",
						"to": "/hr-accounts"
					},
					{
						"id": 12,
						"label": "Report",
						"to": "/hr-report"
					},
					{
						"id": 13,
						"label": "Documentos",
						"to": "/hr-documentos"
					},
										{
						"id": 13,
						"label": "Calificaciones",
						"to": "/hr-calificaciones"
					}
				]
			},
			/*{
				"id": 14,
				"icon": "icon-cup",
				"label": "Project",
				content: [
					{
						"id": 15,
						"label": "Dashboard",
						"to": "/project-dashboard"
					},
					{
						"id": 16,
						"label": "Project List",
						"to": "/project-list"
					},
					{
						"id": 17,
						"label": "Taskboard",
						"to": "/project-taskboard"
					},
					{
						"id": 18,
						"label": "Ticket List",
						"to": "/project-ticket"
					},
					{
						"id": 19,
						"label": "Ticket Details",
						"to": "/project-ticket-details"
					},
					{
						"id": 20,
						"label": "Clients",
						"to": "/project-clients"
					},
					{
						"id": 21,
						"label": "Todo List",
						"to": "/project-todo"
					}
				]
			},
			{
				"id": 22,
				"icon": "icon-briefcase",
				"label": "Job Portal",
				content: [
					{
						"id": 23,
						"label": "Job Dashboard",
						"to": "/jobportal-dashboard"
					},
					{
						"id": 24,
						"label": "Positions",
						"to": "/jobportal-positions"
					},
					{
						"id": 25,
						"label": "Applicant",
						"to": "/jobportal-applicants"
					},
					{
						"id": 26,
						"label": "Resumes",
						"to": "/jobportal-resumes"
					},
					{
						"id": 27,
						"label": "Settings",
						"to": "/jobportal-settings"
					}
				]
			},
			{
				"id": 28,
				"icon": "icon-lock",
				"label": "Authentication",
				content: [
					{
						"id": 29,
						"label": "Login",
						"to": "/login"
					},
					{
						"id": 30,
						"label": "Register",
						"to": "/signup"
					},
					{
						"id": 31,
						"label": "Forgot Password",
						"to": "/forgotpassword"
					},
					{
						"id": 32,
						"label": "404 error",
						"to": "/notfound"
					},
					{
						"id": 33,
						"label": "500 Error",
						"to": "/internalserver"
					}
				]
			},
			/*
			{
				"id": 'UiElements',
				"label": "Ui Elements"
			},
			{
				"id": 34,
				"icon": "icon-tag",
				"label": "Icons",
				"to": "/icons",
			},
			{
				"id": 35,
				"icon": "icon-bar-chart",
				"label": "Charts",
				"to": "/charts",
			},
			{
				"id": 36,
				"icon": "icon-layers",
				"label": "Forms",
				"to": "/forms",
			},
			{
				"id": 37,
				"icon": "icon-tag",
				"label": "Tables",
				"to": "/tables",
			},
			{
				"id": 38,
				"icon": "icon-puzzle",
				"label": "Widgets",
				"to": "/widgets",
			},
			{
				"id": 39,
				"icon": "icon-map",
				"label": "Maps",
				"to": "/maps",
			},
			{
				"id": 40,
				"icon": "icon-picture",
				"label": "Gallery",
				"to": "/gallery",
			},
			*/
		}
		
		const {  isOpenUserMenu } = this.state
		const { darkMinSidebar, istoggleLeftMenu } = this.props
		const pageHeading = Routes.filter((route) => route.path === this.props.location.pathname)
		
		return (
			<>
				<div className={`${istoggleLeftMenu ? "offcanvas-active" : ""}`}>
					<div style={this.state.parentlink === 'login' ? masterNone : masterBlock}>
						<div id="header_top" className={`header_top ${darkMinSidebar && 'dark'}`}>
							<div className="container">
								<div className="hleft">
									<div>
										<p className="mt-3">
											UW
										</p>
									</div>

									{/*<NavLink
										to="/"
										onClick={() => this.handler('Westhill', 'dashboard')}
										className="header-brand"
									>
										<i className="fe fe-command brand-logo" />
									</NavLink>*/}
									<div className="dropdown">
										{/*<NavLink to="/page-search" className="nav-link icon">
											<i className="fa fa-search" />
										</NavLink>*/}
										{/*<NavLink to="/app-calendar" className="nav-link icon app_inbox">
											<i className="fa fa-calendar" />
										</NavLink>*/}
										{/*
										<NavLink to="/app-contact" className="nav-link icon xs-hide">
											<i className="fa fa-id-card-o" />
										</NavLink>
										<NavLink to="/app-chat" className="nav-link icon xs-hide">
											<i className="fa fa-comments-o" />
										</NavLink>
										<NavLink to="/app-filemanager" className="nav-link icon app_file xs-hide">
											<i className="fa fa-folder-o" />
										</NavLink>
										*/}
									</div>
								</div>
								<div className="hright">
									<div className="dropdown">
										{/* <a href="#!" class="nav-link icon theme_btn">
										<i
											class="fa fa-paint-brush"
											data-toggle="tooltip"
											data-placement="right"
											title="Themes"
										></i>
									</a> */}
										<p className="nav-link user_btn mt-2" onClick={this.toggleUserMenu}>
											<i class="icon-user"></i>
												
										</p>
										{/*<p className="nav-link icon menu_toggle" onClick={() => this.toggleLeftMenu(!istoggleLeftMenu)}>
											<i className="fa  fa-align-left" />
										</p>*/}
									</div>
								</div>
							</div>
						</div>

	
						<div className={`user_div ${isOpenUserMenu && 'open'}`}>
							<h5 className="brand-name mb-4">
							WESTHILL
							<p className="user_btn" onClick={() => this.closeSesion()}>
									<i className="icon-logout" />
								</p>
							</h5>
							<div className="card">
								<div className="card-body">
									<div className="media">	
											
										<div className="media-body">
											<h5 className="m-0">{localStorage.getItem("usuario")}</h5>
											<p className="text-muted mb-0">{localStorage.getItem("rol")}</p>
										</div>
									</div>
								</div>
							</div>
							

						</div>
						<div id="left-sidebar" className="sidebar ">
							<h5 className="brand-name">WESTHILL</h5>
							<nav id="left-sidebar-nav" className="sidebar-nav">
								<MetisMenu className=""
									content={content}
									noBuiltInClassNames={true}
									classNameContainer={(e) => this.toggleSubMenu(e)}
									classNameContainerVisible="in"
									classNameItemActive="active"
									classNameLinkActive="active"
									// classNameItemHasActiveChild="active"
									classNameItemHasVisibleChild="active"
									classNameLink="has-arrow arrow-c"
									// classNameIcon
									// classNameStateIcon
									iconNamePrefix=""
									// iconNameStateHidden=""
									LinkComponent={(e) => <DefaultLink itemProps={e} />}
								// toggleSubMenu={this.toggleSubMenu}
								/>

							</nav>
						</div>
					</div>

					<div className="page">
						<Header dataFromParent={this.props.dataFromParent} dataFromSubParent={pageHeading[0].pageTitle} />
						<Switch>
							{Routes.map((layout, i) => {
								return <Route key={i} exact={layout.exact} path={layout.path} component={layout.component}></Route>
							})}
						</Switch>
					</div>
				</div>
			</>
		);
	}
}

const mapStateToProps = state => ({
	darkMinSidebar: state.settings.isMinSidebar,
	statisticsOpen: state.settings.isStatistics,
	friendListOpen: state.settings.isFriendList,
	statisticsClose: state.settings.isStatisticsClose,
	friendListClose: state.settings.isFriendListClose,
	istoggleLeftMenu: state.settings.isToggleLeftMenu
})

const mapDispatchToProps = dispatch => ({
	darkModeAction: (e) => dispatch(darkModeAction(e)),
	darkHeaderAction: (e) => dispatch(darkHeaderAction(e)),
	fixNavbarAction: (e) => dispatch(fixNavbarAction(e)),
	darkMinSidebarAction: (e) => dispatch(darkMinSidebarAction(e)),
	darkSidebarAction: (e) => dispatch(darkSidebarAction(e)),
	iconColorAction: (e) => dispatch(iconColorAction(e)),
	gradientColorAction: (e) => dispatch(gradientColorAction(e)),
	rtlAction: (e) => dispatch(rtlAction(e)),
	fontAction: (e) => dispatch(fontAction(e)),
	subMenuIconAction: (e) => dispatch(subMenuIconAction(e)),
	menuIconAction: (e) => dispatch(menuIconAction(e)),
	boxLayoutAction: (e) => dispatch(boxLayoutAction(e)),
	statisticsAction: (e) => dispatch(statisticsAction(e)),
	friendListAction: (e) => dispatch(friendListAction(e)),
	statisticsCloseAction: (e) => dispatch(statisticsCloseAction(e)),
	friendListCloseAction: (e) => dispatch(friendListCloseAction(e)),
	toggleLeftMenuAction: (e) => dispatch(toggleLeftMenuAction(e))
})
export default connect(mapStateToProps, mapDispatchToProps)(MenuAutorizaciones);