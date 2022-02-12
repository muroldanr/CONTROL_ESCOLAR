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
import Chart from "react-google-charts";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';




class ReporteDocumentos extends Component {

	constructor(props){
		super(props);
		this.state = {
			dataTableChart:[],
			dataTableTipoIngreso:[],
			dataTableDocumentosAlta:[],
			dataTableDocumentosBaja:[],
			columnsTipoIngreso :
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
						Header: 'TipoIngreso',
						accessor: 'TipoIngreso',
						maxWidth: 50,
						Filter: '',
					}
				]
			}],
			columnsDocumentos :
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
						Header: 'Documento',
						accessor: 'Documento',
						maxWidth: 50,
						Filter: '',
					},
					{
						Header: 'Impacto',
						accessor: 'Impacto',
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


					dataCEPlan.push(
						<tr key = {objArrayCEPlan.id}  >
							<center><td className="col-md-12" onClick={() => this.tipoIngresoSelected("Todos","carrera")}>Todos</td></center>
						</tr>
					)


					this.setState({
						listData: dataCEPlan,
					});

				break;

				case "tipoIngreso":
					let objArrayTipoIngreso = response
					let dataTipoIngreso = [];

					dataTipoIngreso = objArrayTipoIngreso.map((objV) =>{
						let array = {
							"#":(objV.Cuantos || objV.Cuantos!==null) ? objV.Cuantos : " ",
							"TipoIngreso": (objV.TipoIngreso || objV.TipoIngreso!==null) ? objV.TipoIngreso : " ",
						}
						return array
						}
					);

					this.setState({
						dataTableTipoIngreso: dataTipoIngreso,

					});
				break;

				case "documentacion":
					let objArrayDocumentacion = response
					let dataDocumentacionAlta = [];
					let dataDocumentacionBaja = [];
					var dataChart= [];

					if(objArrayDocumentacion.length > 0){
						dataDocumentacionAlta = objArrayDocumentacion.reduce(function(e, objV,index) {
							console.log(objV)
							console.log(e)
							let buttonStyle = 'btn btn-danger'
							if(objV.Impacto === 'Alto'){
								let array = {
									"#":(objV.Cuantos || objV.Cuantos!==null) ? objV.Cuantos : " ",
									"Documento":(objV.Documento || objV.Documento!==null) ? objV.Documento : " ",
									"Impacto": <button className={buttonStyle}>{(objV.Impacto || objV.Impacto!==null) ? objV.Impacto : " "}</button> ,
								}
								e.push(array);
								return e
							}else {
								return e
							}
						} ,[]);

						dataDocumentacionBaja = objArrayDocumentacion.reduce(function(e, objV,index) {
							console.log(objV)
							console.log(e)
							let buttonStyle = 'btn btn-primary'
							if(objV.Impacto === 'Bajo'){
								let array = {
									"#":(objV.Cuantos || objV.Cuantos!==null) ? objV.Cuantos : " ",
									"Documento":(objV.Documento || objV.Documento!==null) ? objV.Documento : " ",
									"Impacto": <button className={buttonStyle}>{(objV.Impacto || objV.Impacto!==null) ? objV.Impacto : " "}</button> ,
								}
								e.push(array);
								return e
							}else {
								return e
							}
						} ,[]);

						dataChart = objArrayDocumentacion.map((objV) =>{
							let color = '#e8769f'
							if(objV.Impacto === 'Bajo'){
								color = '#00abc8'
							}
							return [ (objV.Documento || objV.Documento!==null) ? objV.Documento : " " , (objV.Cuantos!==null) ? objV.Cuantos : 0 , color]
							}
						);

						dataChart.unshift(['Element', 'Documentación', { role: 'style' }]);

						this.setState({
							dataTableDocumentosAlta: dataDocumentacionAlta,
							dataTableDocumentosBaja: dataDocumentacionBaja,
							dataTableChart:  dataChart,
						});
					}else {
						this.setState({
							dataTableDocumentosAlta: [],
							dataTableDocumentosBaja: [],
							dataTableChart:  [],
						});
					}

				break;

				default:
					console.log("ESTOY ENTRANDO AL DEFAULT");
				break;
				}


		}

		getReport = () => {

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


		generatePDF = () => {

			const margin = 10;
			const input = document.getElementById('divReporteDocumentosPrint');

			this.props.visibleLoaderAction(true);
			html2canvas(input)
				.then((canvas) => {
					const imgData = canvas.toDataURL('image/png');
					const pdf = new jsPDF({});
					const imgProps= pdf.getImageProperties(imgData);
					const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
					let pdfHeight = ((imgProps.height * pdfWidth) / imgProps.width) - (margin * 1.5);

					if(pdfHeight > pdf.internal.pageSize.getHeight()){
						pdfHeight = pdf.internal.pageSize.getHeight() - (margin * 1.5);
					}

					pdf.addImage(imgData, 'PNG', margin, margin , pdfWidth , pdfHeight);
					pdf.save(this.state.carrera + '.pdf');
					this.props.visibleLoaderAction(false);
				});


		}


	render() {
		let tablaTipoIngreso;
		if (this.state.dataTableTipoIngreso.length > 0) {
			tablaTipoIngreso = <Tabla columns={this.state.columnsTipoIngreso} data={this.state.dataTableTipoIngreso} titulo={"Lista Alumnos"}/>
		} else {
			tablaTipoIngreso =
				<div className="table-responsive m-3">
					<div >Sin Información de Tipo de Ingreso</div>
				</div>
		}

		let tablaDocumentosAlta;
		if (this.state.dataTableDocumentosAlta.length > 0) {
			tablaDocumentosAlta = <Tabla columns={this.state.columnsDocumentos} data={this.state.dataTableDocumentosAlta} titulo={"Lista Alumnos"}/>
		} else {
			tablaDocumentosAlta =
				<div className="table-responsive m-3">
					<div >Sin Información de Documentación</div>
				</div>
		}

		let tablaDocumentosBaja;
		if (this.state.dataTableDocumentosBaja.length > 0) {
			tablaDocumentosBaja = <Tabla columns={this.state.columnsDocumentos} data={this.state.dataTableDocumentosBaja} titulo={"Lista Alumnos"}/>
		} else {
			tablaDocumentosBaja =
				<div className="table-responsive m-3">
					<div >Sin Información de Documentación</div>
				</div>
		}

		let chartDoc;
		if (this.state.dataTableChart.length > 0) {
			chartDoc = <Chart
						width={'100%'}
						height={700}
						chartType="ColumnChart"
						loader={<div>Loading Chart</div>}

						data={
							this.state.dataTableChart
						}
						options={{
							textStyle: {
								fontName: 'Times-Roman',
								fontSize: 8,
							},
							title: "",
							chartArea: { width: '85%' },
							hAxis: {
								title: '',
								minValue: 0,
								textStyle : {
									fontSize: 12 // or the number you want
								}
							},
							vAxis: {
								title: 'Alumnos',
							},
							legend: 'none',
						}}
						legendToggle/>
		} else {
			chartDoc =
				<div className="table-responsive m-1">
					<div ></div>
				</div>
		}

		return (
			<>
				<div className="card">
					<div className="card-body ">
						<h4 className="mb-3" >Reporte - Documentación</h4>
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
						<div className="container" id="divReporteDocumentosPrint" >
								<h4 className="text-center m-4">{this.state.carrera}</h4>
								<div className="row">
									<div className="col-lg-6 col-md-12">
										{tablaDocumentosAlta}

									</div>
									<div className="col-lg-6 col-md-12">
										{tablaDocumentosBaja}
									</div>
								</div>
								{chartDoc}
								<div className="row">
									<div className="col-lg-12 col-md-12 mt-5">
										{tablaTipoIngreso}

									</div>
									<div className="col-lg-6 col-md-12">
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

export default connect(mapStateToProps, mapDispatchToProps)(ReporteDocumentos);
