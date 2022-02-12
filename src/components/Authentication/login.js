import React, { Component } from 'react';
import manager from '../../service-manager/api'
import routes from '../../service-manager/routes'
import Logo from '../../images/logo_westhill.png'
import Loader from '../Loader/Loader';
import { connect } from 'react-redux';
import {visibleLoaderAction} from '../../actions/settingsAction';
import swal from 'sweetalert';


class Login extends Component {
		
	constructor(props) {
		super(props);
	
		this.state = {
			username: '',
			password: '',
			CondicionDeCredenciales:false
		}
	}

	handleChange = e => {        
        this.setState({            
            [e.target.name] : e.target.value
        }); 
	}; 
	
	onSubmitLogin(){
		this.props.visibleLoaderAction(true);	
		manager.loginUser(routes.LOGIN,{"username":this.state.username,"password":this.state.password.toUpperCase()})
		.then(response => {
			this.props.visibleLoaderAction(false);	
			if (response.AuthToken){	
				localStorage.setItem("token",response.AuthToken);
				localStorage.setItem("usuario",this.state.username);	
				this.getRol();					
			}
			else{
				swal("Oops!", "Ocurrio un problema!", "error");
			}
		})
		.catch(error => {	
			this.props.visibleLoaderAction(false);		
			this.setState({CondicionDeCredenciales:true})
			swal("Oops!", error.Mensaje , "error");
		});
		
	}

	getRol(){
		this.props.visibleLoaderAction(true);
		manager.postData(routes.spWebUsuarioRol,{"WebUsuario":localStorage.getItem("usuario")})
        .then(response => {   
			if (response[0].Rol && response[0].Estatus === 'ALTA'){	
			localStorage.setItem("rol",response[0].Rol);			
			this.props.history.push({
				pathname: '/'
			});
			}else{
				swal("Oops!","Hubo un problema con tu Rol y/o Estatus" , "error");
			}	  
			this.props.visibleLoaderAction(false);   
        })
        .catch(error =>{	
			this.props.visibleLoaderAction(false);
			console.log(error)
			localStorage.setItem("token","");
			localStorage.setItem("usuario","");
			localStorage.setItem("rol","");
			swal("Oops!", error.Mensaje , "error");
		})		
	}

	

	render() {
		return (
			<>
			<Loader></Loader>
			<div className="auth">
				<div className="auth_left">
					<div className="card">
						{/*	<div className="text-center mb-2">
							<Link className="header-brand" to="/">
								<img src={Logo} className="rounded" alt="login page" />
							</Link>
						</div>*/}
						<div className="card-body">
							<div className="card-title">Iniciar sesión</div>						
							<div className="form-group">
								<label className="form-label">
									Usuario
									{/*<Link className="float-right small" to="/forgotpassword">
										I forgot password
									</Link>*/}
								</label>
								<input
									type="email"
									className="form-control"
									id="exampleInputEmail1"
									aria-describedby="emailHelp"
									placeholder="Usuario"
									name="username"
									value={this.state.username}
									onChange={this.handleChange.bind(this)}									
								/>
							</div>
							<div className="form-group">
								<label className="form-label">
									Contraseña
									{/*<Link className="float-right small" to="/forgotpassword">
										I forgot password
									</Link>*/}
								</label>
								<input
									type="password"
									className="form-control"
									id="exampleInputPassword1"
									placeholder="Contraseña"
									name="password"
									value={this.state.password}
									onChange={this.handleChange.bind(this)}									
								/>
							</div>
							{/*<div className="form-group">
								<label className="custom-control custom-checkbox">
									<input type="checkbox" className="custom-control-input" />
									<span className="custom-control-label">Remember me</span>
								</label>
							</div>*/}
							<div className="form-footer">
								<button className="btn btn-primary btn-block" onClick={e => this.onSubmitLogin(this)} >
									Entrar
								</button>
							</div>
						</div>
						{/*<div className="text-center text-muted">
							Don't have account yet? <Link to="/signup">Sign Up</Link>
						</div>*/}
					</div>
				</div>
				<div className="auth_right">
					<div className="carousel slide" data-ride="carousel" data-interval={3000}>
						<div className="carousel-inner">
							<div className="carousel-item active">
								<img src={Logo} className="img-fluid" alt="login page" />
							</div>
						</div>
					</div>
				</div>
			</div>
			</>
		);
	}
}

const mapStateToProps = state => ({
	
})

const mapDispatchToProps = dispatch => ({
	visibleLoaderAction: (e) => dispatch(visibleLoaderAction(e)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
