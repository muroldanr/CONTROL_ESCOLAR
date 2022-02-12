import React, { Component } from 'react';
import {
	visibleLoaderAction
} from '../../actions/settingsAction';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import manager from '../../service-manager/api';
import routes from '../../service-manager/routes';
import ModalOptionsList from '../HRMS/Documentos/ModalOptionList';
import Tabla from './ReporteTable.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';



class ReporteEdad extends Component {

	constructor(props){
		super(props);
		this.state = {
			dataTableEdad:[],
			dataTableEstados:[],
			columnsEdad :
			[{
				Header: ' ',
				columns:
					[
					{
						Header: '#',
						accessor: '#',
						maxWidth: 50,
						Filter: '',
					},
					{
						Header: 'Edad',
						accessor: 'Edad',
						maxWidth: 50,
						Filter: '',
					}
				]
			}],
			columnsEstados :
			[{
				Header: ' ',
				columns:
					[
					{
						Header: '#',
						accessor: '#',
						maxWidth: 50,
						Filter: '',
					},
					{
						Header: 'Estado',
						accessor: 'Estado',
						maxWidth: 50,
						Filter: '',
					}
				]
			}],
		}

	}

		//ELEGIR OPCIÒN

		handleTipoList = (e,tipo) => {
			this.props.visibleLoaderAction(true);
			switch(tipo) {
				case "carrera":
					manager.postData(routes.spWHsectionLista,{})
					.then(response => {
						this.props.visibleLoaderAction(false);
						this.setState({
							openModalOptions:true,
						})
						this.setDataList(response,tipo)
					})
					.catch(error =>{
						this.props.visibleLoaderAction(false);

						swal("Oops!", error.Mensaje , "error");
					})
				break;
				case "ciclo":

					manager.postData(routes.ALUMNO_CICLO,{"UsuarioWeb":localStorage.getItem("usuario"),Licenciatura: this.state.carrera })
					.then(response => {
						this.props.visibleLoaderAction(false);
						this.setState({
							openModalOptions:true,
						})
						this.setDataList(response,tipo)
					})
					.catch(error =>{
						this.props.visibleLoaderAction(false);

						swal("Oops!", error.Mensaje , "error");
					})
				break;
				case "tipoIngreso":
					manager.postData(routes.TIPO_INGRESO,{"UsuarioWeb":localStorage.getItem("usuario")})
					.then(response => {
						this.props.visibleLoaderAction(false);
						this.setState({
							openModalOptions:true,
						})
						this.setDataList(response,tipo)
					})
					.catch(error =>{
						this.props.visibleLoaderAction(false);

						swal("Oops!", error.Mensaje , "error");
					})
				break;
				case "estatus":
					manager.postData(routes.ESTATUS_LIST,{"UsuarioWeb ":localStorage.getItem("usuario")})
					.then(response => {
						this.props.visibleLoaderAction(false);
						this.setState({
							openModalOptions:true,
						})
						this.setDataList(response,tipo)
					})
					.catch(error =>{
						this.props.visibleLoaderAction(false);

						swal("Oops!", error.Mensaje , "error");
					})
				break;

				default:
					break;
			}
		}

		setDataList(response,tipo){

			switch(tipo) {
				case "carrera":

					let objArrayCEPlan = response

					let dataCEPlan = [];

					dataCEPlan = objArrayCEPlan.map((objV) =>
						<tr key = {objArrayCEPlan.id}  >
							<center><td className="col-md-12" onClick={() => this.tipoIngresoSelected(objV.Carrera,"carrera")}>{objV.Carrera.replace("UW","")}</td></center>				
						</tr>
					);
					this.setState({
						listData: dataCEPlan,
						ciclo : false,
					});

				break;
				case "ciclo":

					let objArrayNacionalidad = response

					let dataCiclo= [];

					dataCiclo = objArrayNacionalidad.map((objV) =>
						<tr key = {objArrayNacionalidad.id}  >
							<center><td className="opcList" onClick={() => this.tipoIngresoSelected(objV.Ciclo,"ciclo")}>{objV.Ciclo}</td></center>
						</tr>
					);
					this.setState({
						listData: dataCiclo,

					});

				break;
				case "tipoIngreso":
					let objArray = response
					let dataTipoIngreso = [];
					dataTipoIngreso = objArray.map((objV) =>
						<tr key = {objArray.id}  >
							<center><td className="opcList"  onClick={()=>this.tipoIngresoSelected(objV.TipoIngreso,"tipoIngreso")}>{objV.TipoIngreso}</td></center>
						</tr>
					);
					this.setState({
						listData: dataTipoIngreso,

					});

				break;
				case "estatus":
					let objArrayEstatus = response
					let dataEstatus = [];

					dataEstatus = objArrayEstatus.map((objV) =>
						<tr key = {objArrayEstatus.id}  >
							<center><td className="opcList" onClick={() => this.tipoIngresoSelected(objV.Estatus,"estatus")}>{objV.Estatus}</td></center>
						</tr>
					);
					this.setState({
						listData: dataEstatus,

					});

				break;

				case "edad":
					let objArrayEdad = response
					let dataEdad = [];

					dataEdad = objArrayEdad.map((objV) =>{
						let array = {
							"#":(objV.Cuantos || objV.Cuantos!==null) ? objV.Cuantos : " ",
							"Edad":(objV.Edad || objV.Edad!==null) ? objV.Edad : " ",
						}
						return array
						}
					);

					this.setState({
						dataTableEdad: dataEdad,

					});

				break;

				case "nacionalidad":
					let objArrayEstados = response
					let dataEstados = [];

					dataEstados = objArrayEstados.map((objV) =>{
						let array = {
							"#":(objV.Cuantos || objV.Cuantos!==null) ? objV.Cuantos : " ",
							"Estado":(objV.Nacionalidad || objV.Nacionalidad!==null) ? objV.Nacionalidad : " ",
						}
						return array
						}
					);

					this.setState({
						dataTableEstados: dataEstados,

					});

				break;

				default:
					console.log("ESTOY ENTRANDO AL DEFAULT");
				break;
				}


		}

		getReport = () => {

			if(this.state.carrera && this.state.ciclo && this.state.tipoIngreso && this.state.estatus  ){
				this.props.visibleLoaderAction(true);
				manager.postData(routes.spWebAlumnoEdad,{"UsuarioWeb":localStorage.getItem("usuario"),Licenciatura: this.state.carrera ,CicloCursa: this.state.ciclo ,  TipoIngreso: this.state.tipoIngreso ,  EstatusIngreso:this.state.estatus })
				.then(response => {
					this.props.visibleLoaderAction(false);
					this.setDataList(response,"edad") ;

				})
				.catch(error =>{
					this.props.visibleLoaderAction(false);
					swal("Oops!", error.Mensaje , "error");
				})

				manager.postData(routes.spWebAlumnoNacionalidad,{"UsuarioWeb":localStorage.getItem("usuario"),Licenciatura: this.state.carrera ,CicloCursa: this.state.ciclo ,  TipoIngreso: this.state.tipoIngreso ,  EstatusIngreso:this.state.estatus })
				.then(response => {
					this.props.visibleLoaderAction(false);
					this.setDataList(response,"nacionalidad") ;

				})
				.catch(error =>{
					this.props.visibleLoaderAction(false);
					swal("Oops!", error.Mensaje , "error");
				})
			}else{
				swal("Oops!", "Llenar todos los campos" );
			}
		}


		tipoIngresoSelected = (campo,tipo) => {
			this.setState(
				{[tipo] : campo , openModalOptions: false}
			);
		}

		manejarCloseOptions = (state) => {
			this.setState({
				openModalOptions: state
			});
		}

		generatePDF = () => {

			const margin = 10;
			const inputEdad = document.getElementById('divReporteEdadPrint');
			this.props.visibleLoaderAction(true);


			html2canvas(inputEdad)
				.then((canvas) => {
					const imgData = canvas.toDataURL('image/png');
					const pdf = new jsPDF({});
					const imgProps= pdf.getImageProperties(imgData);
					const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
					let pdfHeight = ((imgProps.height * pdfWidth) / imgProps.width) - (margin * 1.5);

					console.log(pdfHeight )

					if(pdfHeight > pdf.internal.pageSize.getHeight()){
						pdfHeight = pdf.internal.pageSize.getHeight() - (margin * 1.5);
					}
					console.log(pdfHeight )

					pdf.addImage(imgData, 'PNG', margin, margin , pdfWidth , pdfHeight);
					pdf.save(this.state.carrera + '.pdf');
					this.props.visibleLoaderAction(false);
				});

		}


	render() {

		let tablaEdad;
		if (this.state.dataTableEdad.length > 0) {
			tablaEdad = <Tabla columns={this.state.columnsEdad} data={this.state.dataTableEdad} titulo={"Lista Alumnos"}/>
		} else {
			tablaEdad =
				<div className="table-responsive m-3">
					<div >Sin Información de Edades</div>
				</div>
		}

		let tablaEstados;
		if (this.state.dataTableEstados.length > 0) {
			tablaEstados = <Tabla columns={this.state.columnsEstados} data={this.state.dataTableEstados} titulo={"Lista Alumnos"}/>
		} else {
			tablaEstados =
				<div className="table-responsive m-3">
					<div >Sin Información de Estados</div>
				</div>
		}

		return (
			<>
				<div className="card">
					<div className="card-body ">
						<h4 className="mb-3" >Reporte - Edades y Estados</h4>
						<div className="row clearfix">
							<div className="col-lg-12 col-md-12">
								<ul className="list-group mb-12">
									<li className="list-group-item">
										<div className="row">
											<div className="col-lg-3 col-md-12">
												<small className="text-muted">CARRERA: </small>
												<select class="custom-select mr-sm-2"  value={this.state.carrera} onClick={ (e) => this.handleTipoList(e,"carrera")}>
													<option value="tipoIngreso" >{this.state.carrera} </option>
												</select>
											</div>
											<div className="col-lg-3 col-md-12">
												<small className="text-muted">CICLO: </small>
												<select class="custom-select mr-sm-2" value={this.state.ciclo} onClick={ (e) => this.handleTipoList(e,"ciclo")}>
													<option value="tipoIngreso" >{this.state.ciclo} </option>
												</select>
											</div>
											<div className="col-lg-3 col-md-12">
												<small className="text-muted">TIPO DE INGRESO: </small>
												<select class="custom-select mr-sm-2"  value={this.state.tipoIngreso}  onClick={ (e) => this.handleTipoList(e,"tipoIngreso")}>
													<option value="tipoIngreso" >{this.state.tipoIngreso} </option>
												</select>
											</div>
											<div className="col-lg-3 col-md-12">
												<small className="text-muted">ESTATUS: </small>
												<select class="custom-select mr-sm-2"  value={this.state.estatus}  onClick={ (e) => this.handleTipoList(e,"estatus")}>
												<option value="tipoIngreso" >{this.state.estatus} </option>
												</select>
											</div>
										</div>
									</li>
									<div className="d-flex justify-content-between align-items-center mt-2">
										<button className="btn btn-block btn-success btn-sm" onClick={()=> this.getReport()}>
											Generar Reporte
										</button>

										<button className="btn " onClick={()=> this.generatePDF()}>
											<i class="ml-1 fa fa-print"></i>
										</button>
									</div>
								</ul>
							</div>
						</div>
						<div className="container" id="divReporteEdadPrint" >

							<div className="row">
								<div className="col-lg-6 col-md-12">
									{tablaEdad}
								</div>
								<div className="col-lg-6 col-md-12">
									{tablaEstados}
								</div>
							</div>
						</div>
					</div>
				</div>
				<ModalOptionsList mostrar={this.state.openModalOptions} isShow={this.manejarCloseOptions.bind(this)} dataList={this.state.listData}/>
			</>);
	}
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
	visibleLoaderAction: (e) => dispatch(visibleLoaderAction(e))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReporteEdad);
