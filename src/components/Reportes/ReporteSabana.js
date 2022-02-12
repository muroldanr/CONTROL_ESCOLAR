import React, { Component } from 'react';
import {
	visibleLoaderAction
} from '../../actions/settingsAction';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import manager from '../../service-manager/api';
import routes from '../../service-manager/routes';
import ModalOptionsList from '../HRMS/Documentos/ModalOptionList';
import ReactExport from "react-export-excel";
import Button from 'react-bootstrap/Button';
import Tabla from './SabanaTable.js';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class ReporteSabana extends Component {

	constructor(props){
		super(props);
		this.state = {
			dataTableChart:[],
			dataTableTipoIngreso:[],
			dataTableDocumentosAlta:[],
			dataTableDocumentosBaja:[],
			carrera:"",
			dataTableAlumnos:[],
			columnsAlumnos :
			[{
				Header: ' ',
				columns:
					[
						{
							Header: "Matricula",accessor: "Matricula",
							maxWidth: 50,
						},
					{
							Header: "Adeuda",accessor: "Adeuda",
							maxWidth: 50,
							
						},
					{
							Header: "TiempoAdeudo",accessor: "TiempoAdeudo",
							maxWidth: 50,
							
						},
					{
							Header: "TipoIngreso",accessor: "TipoIngreso",
							maxWidth: 50,
							
						},
					{
							Header: "NombreCompleto",accessor: "NombreCompleto",
							maxWidth: 50,
							
						},
					{
							Header: "CeEstatus",accessor: "CEEstatus",
							maxWidth: 50,
							
						},
					{
							Header: "Licenciatura",accessor: "Licenciatura",
							maxWidth: 50,
							
						},
					{
							Header: "FechaIngreso",accessor: "FechaIngreso",
							maxWidth: 50,
							
						},
					{
							Header: "PaisOrigen",accessor: "PaisOrigen",
							maxWidth: 50,
							
						},
					{
							Header: "Forma",accessor: "Forma",
							maxWidth: 50,
							
						},
					{
							Header: "Acta de Nacimiento",accessor: "ActaNacimiento",
							maxWidth: 50,
							
						},
					{
							Header: "Certificado Secundaria",accessor: "CertificadoSecundaria",
							maxWidth: 50,
							
						},
					{
							Header: "Certificado Preparatoria",accessor: "CertificadoPreparatoria",
							maxWidth: 50,
							
						},
					{
							Header: "Cuenta Con Legalización",accessor: "CuentaConLegalizacion",
							maxWidth: 50,
							
						},
					{
							Header: "Equivalencia",accessor: "Equivalencia",
							maxWidth: 50,
							
						},
					{
							Header: "Certificado P. Universidad",accessor: "CertificadoParcialUniversidad",
							maxWidth: 50,
							
						},
					{
							Header: "Documento Inscripción",accessor: "DocumentoInscripcion",
							maxWidth: 50,
							
						},
					{
							Header: "Carta Compromiso",accessor: "CartaCompromiso",
							maxWidth: 50,
							
						},
					{
							Header: "Certificado Médico",accessor: "CertificadoMedico",
							maxWidth: 50,
							
						},
					{
							Header: "Fotos",accessor: "Fotos",
							maxWidth: 50,
							
						},
					{
							Header: "HojaDatosGenerales",accessor: "HojaDatosGenerales",
							maxWidth: 50,
							
						},
					{
							Header: "Aviso Privacidad",accessor: "AvisoPrivacidad",
							maxWidth: 50,
							
						},
					{
							Header: "Contrato",accessor: "Contrato",
							maxWidth: 50,
							
						},
					{
							Header: "Aviso Consentimiento",accessor: "AvisoConsentimiento",
							maxWidth: 50,
							
						},
						{
							Header: "Carta Cambio Carrera",accessor: "CartaCambioCarrera",
							maxWidth: 50,
							
						},
						{
							Header: "Reglamento",accessor: "Reglamento",
							maxWidth: 50,
							
						},
					{
							Header: "Notas",accessor: "Notas",
							maxWidth: 500,
							
						},
					
			]
			}],
		}

	}




//TRAER DATA SABANA
	tipoIngresoSabana(carrera){
		console.log(carrera);
		manager.postData(routes.GET_SABANA_INFORME,{'Licenciatura':carrera})
		.then(response => {
			this.setState({
				sabanaData:response,
				openModalOptions:false,
				carrera:carrera
			})
			this.setDataAlumnos(response);
		})
		.catch(error =>{
			console.log("Oops!" + error.Mensaje  + "error");
		})

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
							<center><td className="col-md-12" onClick={() => this.tipoIngresoSabana(objV.Carrera)}>{objV.Carrera.replace("UW","")}</td></center>
						</tr>
					);


					dataCEPlan.push(
						<tr key = {objArrayCEPlan.id}  >
							<center><td className="col-md-12" onClick={() => this.tipoIngresoSabana("Todos")}>Todos</td></center>
						</tr>
					)


					this.setState({
						listData: dataCEPlan,
					});

				break;

				default:
					console.log("ESTOY ENTRANDO AL DEFAULT");
				break;
				}


		}

		getSabana = () => {

			let carrera = "" ;
			if (this.state.carrera  !== "Todos"){
				carrera = this.state.carrera
			}

			if(this.state.carrera ){
				this.props.visibleLoaderAction(true);
				manager.postData(routes.spWebTipoIngreso,{"UsuarioWeb":localStorage.getItem("usuario"),Licenciatura: carrera})
				.then(response => {
					this.props.visibleLoaderAction(false);
					this.setDataList(response,"tipoIngreso") ;
				})
				.catch(error =>{
					this.props.visibleLoaderAction(false);
					swal("Oops!", error.Mensaje , "error");
				})

				manager.postDataForm(routes.spWebDocumentacion,{"UsuarioWeb":localStorage.getItem("usuario"),Licenciatura: carrera })
				.then(response => {
					this.setDataList(response,"documentacion");
				})
				.catch(error =>{
					swal("Oops!", error.Mensaje , "error");
					this.props.visibleLoaderAction(false);
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

		dataFilter = (state) => {
			let objArray = state;
			let data = [];
			if(objArray.length > 0  ){
			data = objArray.map((objV) => {
				console.log(objV.values)
				return objV.values;
			});
				if(JSON.stringify(this.state.sabanaData) !== JSON.stringify(data)){
					this.setState({sabanaData: data});
				}
			}
		}

		
		setDataAlumnos(response){
			let objArray = [response]
			let data = [];
			if(Array.isArray(response)){
				objArray = response
			}
	
			data = objArray.map((objV) => {
					let array = {
					"Matricula":(objV.Matricula || objV.Matricula!==null) ? objV.Matricula : " ",
					"Adeuda":(objV.Adeuda || objV.Adeuda!==null) ? objV.Adeuda : " ",
					"TiempoAdeudo":(objV.TiempoAdeudo || objV.TiempoAdeudo!==null) ? objV.TiempoAdeudo : " ",
					"TipoIngreso":(objV.TipoIngreso || objV.TipoIngreso!==null) ? objV.TipoIngreso : " ",
					"NombreCompleto":(objV.NombreCompleto || objV.NombreCompleto!==null) ? objV.NombreCompleto : " ",
					"CEEstatus":(objV.CEEstatus || objV.CEEstatus!==null) ? objV.CEEstatus : " ",
					"Licenciatura":(objV.Licenciatura || objV.Licenciatura!==null) ? objV.Licenciatura : " ",
					"FechaIngreso":(objV.FechaIngreso || objV.FechaIngreso!==null) ? objV.FechaIngreso : " ",
					"PaisOrigen":(objV.PaisOrigen || objV.PaisOrigen!==null) ? objV.PaisOrigen : " ",
					"Forma":(objV.Forma || objV.Forma!==null) ? objV.Forma : " ",
					"ActaNacimiento":(objV.ActaNacimiento || objV.ActaNacimiento!==null) ? objV.ActaNacimiento : " ",
					"CertificadoSecundaria":(objV.CertificadoSecundaria || objV.CertificadoSecundaria!==null) ? objV.CertificadoSecundaria : " ",
					"CertificadoPreparatoria":(objV.CertificadoPreparatoria || objV.CertificadoPreparatoria!==null) ? objV.CertificadoPreparatoria : " ",
					"CuentaConLegalizacion":(objV.CuentaConLegalizacion || objV.CuentaConLegalizacion!==null) ? objV.CuentaConLegalizacion : " ",
					"Equivalencia":(objV.Equivalencia || objV.Equivalencia!==null) ? objV.Equivalencia : " ",
					"CertificadoParcialUniversidad":(objV.CertificadoParcialUniversidad || objV.CertificadoParcialUniversidad!==null) ? objV.CertificadoParcialUniversidad : " ",
					"DocumentoInscripcion":(objV.DocumentoInscripcion || objV.DocumentoInscripcion!==null) ? objV.DocumentoInscripcion : " ",
					"CartaCompromiso":(objV.CartaCompromiso || objV.CartaCompromiso!==null) ? objV.CartaCompromiso : " ",
					"CertificadoMedico":(objV.CertificadoMedico || objV.CertificadoMedico!==null) ? objV.CertificadoMedico : " ",
					"Fotos":(objV.Fotos || objV.Fotos!==null) ? objV.Fotos : " ",
					"HojaDatosGenerales":(objV.HojaDatosGenerales || objV.HojaDatosGenerales!==null) ? objV.HojaDatosGenerales : " ",
					"AvisoPrivacidad":(objV.AvisoPrivacidad || objV.AvisoPrivacidad!==null) ? objV.AvisoPrivacidad : " ",
					"Contrato":(objV.Contrato || objV.Contrato!==null) ? objV.Contrato : " ",
					"AvisoConsentimiento":(objV.AvisoConsentimiento || objV.AvisoConsentimiento!==null) ? objV.AvisoConsentimiento : " ",
					"CartaCambioCarrera":(objV.CartaCambioCarrera || objV.CartaCambioCarrera!==null) ? objV.CartaCambioCarrera : " ",
					"Reglamento":(objV.Reglamento || objV.Reglamento!==null) ? objV.Reglamento : " ",
					"Notas":(objV.Notas || objV.Notas!==null) ? objV.Notas : " "
				}	
					return array;
				});
			this.setState({dataTableAlumnos: data});
		}


	render() {

		let tabla;
		if (this.state.dataTableAlumnos.length > 0) {
			tabla = <Tabla columns={this.state.columnsAlumnos} data={this.state.dataTableAlumnos} titulo={"Lista Alumnos"} dataFilterSabana={this.dataFilter}/>
		} else {
			tabla =
				<div className="table-responsive m-3">
					<div >Sin Información</div>
				</div>
		}

		return (
			<>
				<div className="card">
					<div className="card-body ">
						<h4 className="mb-3" >Sábana de Informe</h4>
						<div className="row clearfix">
							<div className="col-lg-12 col-md-12">
								<ul className="list-group mb-12">
									<li className="list-group-item">
										<div className="row">
											<div className="col-lg-12 col-md-12">
												<small className="text-muted">CARRERA: </small>
												<select class="custom-select mr-sm-2"  value={this.state.carrera} onClick={ (e) => this.handleTipoList(e,"carrera")}>
													<option value="tipoIngreso" >{this.state.carrera} </option>
												</select>
											</div>
										</div>
									</li>
									<div className="justify-content mt-3">
										<ExcelFile  className="col-lg-12" filename="Sabana Informe" element={
											this.state.carrera ==="" ?
											<Button width='100%' variant="success" size="lg" block disabled>
												Descargar Excel
											</Button>:
											<Button width='100%' variant="success" size="lg" block >
												Descargar Excel
											</Button>
										}>
											<ExcelSheet data={this.state.sabanaData} name={this.state.carrera}>
												<ExcelColumn label="Matricula" value="Matricula"/>
												<ExcelColumn label="Adeuda" value="Adeuda"/>
												<ExcelColumn label="TiempoAdeudo" value="TiempoAdeudo"/>
												<ExcelColumn label="TipoIngreso" value="TipoIngreso"/>
												<ExcelColumn label="NombreCompleto" value="NombreCompleto"/>
												<ExcelColumn label="CeEstatus" value="CEEstatus"/>
												<ExcelColumn label="Licenciatura" value="Licenciatura"/>
												<ExcelColumn label="FechaIngreso" value="FechaIngreso"/>
												<ExcelColumn label="PaisOrigen" value="PaisOrigen"/>
												<ExcelColumn label="Forma" value="Forma"/>
												<ExcelColumn label="Acta de Nacimiento" value="ActaNacimiento"/>
												<ExcelColumn label="Certificado Secundaria" value="CertificadoSecundaria"/>
												<ExcelColumn label="Certificado Preparatoria" value="CertificadoPreparatoria"/>
												<ExcelColumn label="Cuenta Con Legalización" value="CuentaConLegalizacion"/>
												<ExcelColumn label="Equivalencia" value="Equivalencia"/>
												<ExcelColumn label="Certificado P. Universidad" value="CertificadoParcialUniversidad"/>
												<ExcelColumn label="Documento Inscripción" value="DocumentoInscripcion"/>
												<ExcelColumn label="Carta Compromiso" value="CartaCompromiso"/>
												<ExcelColumn label="Certificado Médico" value="CertificadoMedico"/>
												<ExcelColumn label="Fotos" value="Fotos"/>
												<ExcelColumn label="HojaDatosGenerales" value="HojaDatosGenerales"/>
												<ExcelColumn label="Aviso Privacidad" value="AvisoPrivacidad"/>
												<ExcelColumn label="Contrato" value="Contrato"/>
												<ExcelColumn label="Aviso Consentimiento" value="AvisoConsentimiento"/>
												<ExcelColumn label="Carta Cambio Carrera" value="CartaCambioCarrera"/>
												<ExcelColumn label="Reglamento" value="Reglamento"/>
												<ExcelColumn label="Notas" value="Notas"/>
												{/*<ExcelColumn label="Alumno" value="Alumno"/>*/}
											</ExcelSheet>
										</ExcelFile>
									{tabla}
									</div>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<ModalOptionsList mostrar={this.state.openModalOptions} isShow={this.manejarCloseOptions.bind(this)} dataList={this.state.listData} />
			</>);
	}
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
	visibleLoaderAction: (e) => dispatch(visibleLoaderAction(e))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReporteSabana);
