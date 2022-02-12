import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	statisticsAction,
	statisticsCloseAction,
	visibleLoaderAction} from '../../../actions/settingsAction';
import manager from '../../../service-manager/api';
import routes from '../../../service-manager/routes';
import Tabla from './AutorizacionesTable.js';
import swal from 'sweetalert';
import Modal from 'react-bootstrap/Modal';
import numeral from 'numeral';

class Autorizaciones extends Component {
	constructor(props) {
		super(props);
		this.state = {					
			dataTable:[],
			dataHistorialTable:[],
			facultades : "",
			tableDatail :[],
		};

	}
	handleStatistics(e) {
		this.props.statisticsAction(e)
	}
	closeStatistics(e) {
		this.props.statisticsCloseAction(e)
	}

	componentDidMount(){
		this.getMovimientos();
	}
	

	//REQUEST A TODOS LOS  MOVIMIENTOS 
	getMovimientos(){    
		this.props.visibleLoaderAction(true);	 	    
        manager.postData(routes.spMovApp,{"UsuarioWeb":localStorage.getItem("usuario")})
        .then(response => {      			
			this.setDataMovimientos(response);    
			this.props.visibleLoaderAction(false);   
        })
        .catch(error =>{	
			this.props.visibleLoaderAction(false);
			console.log(error)
			swal("Oops!", error.Mensaje , "error");
        })
	}

	getDetail = (ID,Modulo) => {   
		this.setState({ID: ID,Modulo:Modulo});
		this.props.visibleLoaderAction(true);	 	    
        manager.postData(routes.spMovDApp,{"Modulo": Modulo, "ID": ID})
        .then(response => {      			
			this.setDataDetalle(response);    
			this.props.visibleLoaderAction(false);   
        })
        .catch(error =>{	
			this.props.visibleLoaderAction(false);
			console.log(error)
			swal("Oops!", error.Mensaje , "error");
        })
	}

	getAutorizar(){    
		this.props.visibleLoaderAction(true);	 	    
        manager.postData(routes.spAutorizacionModuloAPP,{"Modulo": this.state.Modulo, "ID": this.state.ID, "UsuarioWeb" : localStorage.getItem("usuario")})
        .then(response => {   
			swal("Movimiento Autorizado", "");
			this.getMovimientos();    
			this.props.visibleLoaderAction(false);  
			this.manejarClose(false); 
        })
        .catch(error =>{	
			this.props.visibleLoaderAction(false);
			console.log(error)
			swal("Oops!", error.Mensaje , "error");
        })
	}

	
	
	setDataMovimientos(response){  	 	
		let objArray = [response]   
		let data = [];
		if(Array.isArray(response)){
			objArray = response
		}

		data = objArray.map((objV) => {
				let dateFormat = this.formatDate(objV.FechaEmision)
				let array = {
					"detalle": 
					<div key={objV.ProvNombre + " " + objV.SubTotal +" " + dateFormat +" " + objV.Estatus} class="list-group" onClick={() => this.getDetail(objV.ID,objV.Modulo) }>
						<div className="list-group-item list-group-item-action flex-column align-items-start">
							<div className="d-flex w-100 justify-content-between ">
								<h5 className="mb-1">{objV.Alumno}</h5>
								<small>{dateFormat}</small>
							</div>
							<p className="mb-1">{objV.ProvNombre}</p>
							<small>{numeral(objV.SubTotal).format('$ 0,0[.]00')}</small>
							<br />
							<small>{objV.Mov +" "+objV.MovID  }</small>
							<br />
							<small>{objV.Estatus}</small>
							<br />
							<small>{objV.Situacion}</small>
						</div>
				  </div>,
				}
				return array;
			});
		this.setState({dataTable: data});
	}

	formatDate = (date2) => {
		let date = new Date(date2)

		let day = date.getDate()
		let month = date.getMonth() + 1
		let year = date.getFullYear()

		if(month < 10){
		return `${day}-0${month}-${year}`
		}else{
		return `${day}-${month}-${year}`
		}

	}


	setDataDetalle(response){ 
		let objArray = [response]   
		let data = [];
		if(Array.isArray(response)){
			objArray = response
		}
		
		data = objArray.map((objV) => {

			return	<tr>
						<td ><small>{objV.Concepto}</small></td>
						<td><small>{numeral(objV.Cantidad).format('0,0.00')}</small></td>
						<td><small>{numeral(objV.Precio).format('$ 0,0[.]00')}</small></td>
						<td><small>{numeral(objV.SubTotal).format('$ 0,0[.]00')}</small></td>
					</tr>
			});

		this.setState({tableDatail: data});
		
		this.manejarClose(true);
	};


	manejarClose = (state) => {
		this.setState({
			modalDocumento: state
		});
	}

	autorizar = () => {
		if(this.state.ID && this.state.Modulo){
			this.getAutorizar()
		}else{
			this.manejarClose(false);
		}
	}


	render() {
		let tabla;
		if (this.state.dataTable.length > 0) {
			tabla = 
					<div>
						<div class="row mt-2 mb-2">
							<div class="col-sm float-right">
							<div >Lista de Movimientos</div>
							</div>
							<div class="col-sm d-flex flex-row-reverse">
							<i class="icon-reload" onClick={() => this.getMovimientos()}></i>
							</div>
						</div>
						<Tabla data={this.state.dataTable} titulo={this.state.titulo}/>
					</div>
		} else {
			tabla = 
					<div>
						<div class="row mt-2 mb-2">
							<div class="col-sm float-right">
							<div >Sin Movimientos</div>
							</div>
							<div class="col-sm d-flex flex-row-reverse">
							<i class="icon-reload" onClick={() => this.getMovimientos()}></i>
							</div>
						</div>
					</div>
		}
		return (
			<>
				<div>
					<div>
						<div className="section-body">
							<div className="container-fluid">
								<div className="tab-content">
									<div className="tab-pane fade show active" id="Employee-list" role="tabpanel">
										<div className="card">
											<div className="card-body">
				
												{tabla}																																											
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<Modal className="modal-termometro"
								size="lg"
								aria-labelledby="contained-modal-title-vcenter"
								centered show={this.state.modalDocumento}
								onHide={() => this.manejarClose(false)}>
								<Modal.Header closeButton>
									<Modal.Title>Detalle Movimiento</Modal.Title>
								</Modal.Header>
								<Modal.Body>
								<div>
								<table className="table">
									<thead className="thead-dark">
									<th scope="col"><small>Concepto</small></th>
									<th scope="col"><small>Cant.</small></th>
									<th scope="col"><small>Precio</small></th>
									<th scope="col"><small>SubTotal</small></th>
									</thead>
									<tbody>
										{this.state.tableDatail}
									</tbody>
								</table>
								</div>
								<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.manejarClose(false)}>
									Cancelar
								</button>
								<button type="button" className="btn btn-primary"  onClick={() => this.autorizar()}>
									Autorizar
								</button>										

								</div>
								</Modal.Body>
							</Modal>
				</div>
			</>
		);
	}
}
const mapStateToProps = state => ({
	fixNavbar: state.settings.isFixNavbar,
	statisticsOpen: state.settings.isStatistics,
	statisticsClose: state.settings.isStatisticsClose,
})

const mapDispatchToProps = dispatch => ({
	statisticsAction: (e) => dispatch(statisticsAction(e)),
	statisticsCloseAction: (e) => dispatch(statisticsCloseAction(e)),
	visibleLoaderAction: (e) => dispatch(visibleLoaderAction(e))
})
export default connect(mapStateToProps, mapDispatchToProps)(Autorizaciones);
