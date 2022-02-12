import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { NavLink } from 'react-router-dom';
import '../../assets/css/header.css';

class Header extends Component {
	closeSesion(){
		console.log("TOKEN:" + localStorage.getItem("token"));
		localStorage.clear();
		console.log("TOKEN:" + localStorage.getItem("token"));
	}

	render() {
		const { fixNavbar, darkHeader } = this.props;
		return (
			<div>
				<div
					id="page_top"
					// className={isFixNavbar ? "sticky-top" : "" + this.props.dataFromParent === 'dark' ? 'section-body top_dark' : 'section-body'}
					className={`section-body ${fixNavbar ? "sticky-top" : ""} ${darkHeader ? "top_dark" : ""}`}
				>
					<div className="container-fluid">
						<div className="page-header">
							<div className="left">
								<h1 className="page-title">{this.props.dataFromSubParent}</h1>
								{/*<select className="custom-select">
									<option>Year</option>
									<option>Month</option>
									<option>Week</option>
								</select>
								<div className="input-group xs-hide">
									<input type="text" className="form-control" placeholder="Search..." />
								</div>
								*/}
							</div>
							<div className="right">
								<ul className="nav nav-pills">
									{/*<li className="nav-item dropdown">
										<a
											className="nav-link dropdown-toggle"
											data-toggle="dropdown"
											role="button"
											aria-haspopup="true"
											aria-expanded="false"
											href="https://maserp.mx"
										>
											Language
										</a>
										<div className="dropdown-menu">
											<a className="dropdown-item" href="/">
												<img
													className="w20 mr-2"
													src="../assets/images/flags/us.svg"
													alt="fake_url"
												/>
												English
											</a>
											<div className="dropdown-divider" />
											<a className="dropdown-item"  href="/">
												<img
													className="w20 mr-2"
													src="../assets/images/flags/es.svg"
													alt="fake_url"
												/>
												Spanish
											</a>
											<a className="dropdown-item"  href="/">
												<img
													className="w20 mr-2"
													src="../assets/images/flags/jp.svg"
													alt="fake_url"
												/>
												japanese
											</a>
											<a className="dropdown-item"  href="/">
												<img
													className="w20 mr-2"
													src="../assets/images/flags/bl.svg"
													alt="fake_url"
												/>
												France
											</a>
										</div>
									</li>*/}
									{/*<li className="nav-item dropdown">
										<a
											className="nav-link dropdown-toggle"
											data-toggle="dropdown"
 											href="/"
											role="button"
											aria-haspopup="true"
											aria-expanded="false"
										>
											Reportes
										</a>
										<div className="dropdown-menu">
											<a className="dropdown-item"  href="/">
												<i className="dropdown-icon fa fa-file-excel-o" /> MS Excel
											</a>
											<a className="dropdown-item"  href="/">
												<i className="dropdown-icon fa fa-file-word-o" /> MS Word
											</a>
											<a className="dropdown-item"  href="/">
												<i className="dropdown-icon fa fa-file-pdf-o" /> PDF
											</a>
										</div>
								</li>*/}
									{/*<li className="nav-item dropdown">
										<a
											className="nav-link dropdown-toggle"
											data-toggle="dropdown"
 											href="/"
											role="button"
											aria-haspopup="true"
											aria-expanded="false"
										>
											Project
										</a>
										<div className="dropdown-menu">
											<a className="dropdown-item"  href="/">
												Graphics Design
											</a>
											<a className="dropdown-item"  href="/">
												Angular Admin
											</a>
											<a className="dropdown-item"  href="/">
												PSD to HTML
											</a>
											<a className="dropdown-item"  href="/">
												iOs App Development
											</a>
											<div className="dropdown-divider" />
											<a className="dropdown-item"  href="/">
												Home Development
											</a>
											<a className="dropdown-item"  href="/">
												New Blog post
											</a>
										</div>
								</li>*/}
								</ul>
								<div className="notification d-flex">
									{/*<div className="dropdown d-flex">
										<a
											href="/#"
											className="nav-link icon d-none d-md-flex btn btn-default btn-icon ml-1"
											data-toggle="dropdown"
										>
											<i className="fa fa-envelope" />
											<span className="badge badge-success nav-unread" />
										</a>
										<div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
											<ul className="right_chat list-unstyled w250 p-0">
												<li className="online">
													<a href="fake_url">
														<div className="media">
															<img
																className="media-object "
																src="../assets/images/xs/avatar4.jpg"
																alt="fake_url"
															/>
															<div className="media-body">
																<span className="name">Donald Gardner</span>
																<span className="message">Designer, Blogger</span>
																<span className="badge badge-outline status" />
															</div>
														</div>
													</a>
												</li>
												<li className="online">
													<a href="fake_url">
														<div className="media">
															<img
																className="media-object "
																src="../assets/images/xs/avatar5.jpg"
																alt="fake_url"
															/>
															<div className="media-body">
																<span className="name">Wendy Keen</span>
																<span className="message">Java Developer</span>
																<span className="badge badge-outline status" />
															</div>
														</div>
													</a>
												</li>
												<li className="offline">
													<a href="fake_url">
														<div className="media">
															<img
																className="media-object "
																src="../assets/images/xs/avatar2.jpg"
																alt="fake_url"
															/>
															<div className="media-body">
																<span className="name">Matt Rosales</span>
																<span className="message">CEO, Epic Theme</span>
																<span className="badge badge-outline status" />
															</div>
														</div>
													</a>
												</li>
												<li className="online">
													<a href="fake_url">
														<div className="media">
															<img
																className="media-object "
																src="../assets/images/xs/avatar3.jpg"
																alt="fake_url"
															/>
															<div className="media-body">
																<span className="name">Phillip Smith</span>
																<span className="message">Writter, Mag Editor</span>
																<span className="badge badge-outline status" />
															</div>
														</div>
													</a>
												</li>
											</ul>
											<div className="dropdown-divider" />
											<a
 												href="/"
												className="dropdown-item text-center text-muted-dark readall"
											>
												Mark all as read
											</a>
										</div>
									</div>*/}
									{/*<div className="dropdown d-flex">
										<a
											href="/#"
											className="nav-link icon d-none d-md-flex btn btn-default btn-icon ml-1"
											data-toggle="dropdown"
										>
											<i className="fa fa-bell" />
											<span className="badge badge-primary nav-unread" />
										</a>
										<div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
											<ul className="list-unstyled feeds_widget">
												<li>
													<div className="feeds-left">
														<i className="fa fa-user" />
													</div>
													<div className="feeds-body">
														<h4 className="title">
															Alberto Perez {' '}
															<small className="float-right text-muted">10:50</small>
														</h4>
														<small>Acta de Nacimiento ..............</small>
													</div>
												</li>
												
												<li>
													<div className="feeds-left">
														<i className="fa fa-user" />
													</div>
													<div className="feeds-body">
														<h4 className="title">
															Pedro Perez {' '}
															<small className="float-right text-muted">11:50</small>
														</h4>
														<small>Acta de Nacimiento </small>
													</div>
												</li>
												
												<li>
													<div className="feeds-left">
														<i className="fa fa-user" />
													</div>
													<div className="feeds-body">
														<h4 className="title">
															Jose Luis Hernandez {' '}
															<small className="float-right text-muted">12:45</small>
														</h4>
														<small>Contrato </small>
													</div>
												</li>
											</ul>
											<div className="dropdown-divider" />
											<a
												href="fake_url"
												className="dropdown-item text-center text-muted-dark readall"
											>
												Mark all as read
											</a>
										</div>
									</div>
									<div className="dropdown d-flex">
										<a
											href="/#"
											className="nav-link icon d-none d-md-flex btn btn-default btn-icon ml-1"
											data-toggle="dropdown"
										>
											<i className="fa fa-user" />
										</a>
										<div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
											<NavLink to="/profile" className="dropdown-item">
												<i className="dropdown-icon fe fe-user" /> Profile
											</NavLink>
											<a className="dropdown-item"  href="/">
												<i className="dropdown-icon fe fe-settings" /> Settings
											</a>
											<a className="dropdown-item"  href="/">
												<span className="float-right">
													<span className="badge badge-primary">6</span>
												</span>
												<i className="dropdown-icon fe fe-mail" /> Inbox
											</a>
											<a className="dropdown-item"  href="/">
												<i className="dropdown-icon fe fe-send" /> Message
											</a>
											<div className="dropdown-divider" />
											<a className="dropdown-item"  href="/">
												<i className="dropdown-icon fe fe-help-circle" /> Need help?
											</a>
											<a href="/login" className="dropdown-item">
												<button className="dropdown-item-close" onClick={e => this.closeSesion(this)}>
													<i type="submit" className="dropdown-icon fe fe-log-out"  /> Cerrar Sesión
												</button>												
											</a>
										</div>
									</div>
									*/}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
const mapStateToProps = state => ({
	fixNavbar: state.settings.isFixNavbar,
	darkHeader: state.settings.isDarkHeader
})

const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Header);