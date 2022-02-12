import React, { Component } from 'react';
//import Piechart from '../../common/piechart';
//import Columnchart from '../../common/columnchart';
//import Stackedchart from '../../common/stackedchart';
//import Sparklineschart from '../../common/sparklineschart';
//import Donutchart from '../../common/donutchart';
import { connect } from 'react-redux';

//import Tabla from './AlumnosTable.js';
import {	
	visibleLoaderAction
} from '../../../actions/settingsAction';
import ReactExport from "react-export-excel";
import BotonFlotanteExcel from '../Documentos/BotonFlotanteExcel';
import ReporteEdad from '../../Reportes/ReporteEdad';
import ReporteDocumentos from '../../Reportes/ReporteDocumentos';
import ReporteSabanaCompletoDos from '../../Reportes/ReporteSabanaCompletoDos';

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {					
			titulo:"Documentos Pendientes",														
		};

	}

	componentDidMount(){

    }


	

	FuncionTablaExcel(e){
		const ExcelFile = ReactExport.ExcelFile;
		const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
		if(this.state.condicionDeTablas === "Analisis" ){
			return  <ExcelFile filename="Mps" element={<BotonFlotanteExcel />}>
						<ExcelSheet dataSet={this.state.excelMps} name="MPS"/>
					</ExcelFile>
		}
		if(this.state.condicionDeTablas === "Programa" ){
			return <ExcelFile filename="Programa_Producción" element={<BotonFlotanteExcel />}>
						<ExcelSheet dataSet={this.state.excelPrograma} name="Programa Producción"/>
					</ExcelFile>
		}
		if(this.state.condicionDeTablas === "Produccion" ){
			return <ExcelFile filename="Analisis_Produccion" element={<BotonFlotanteExcel />}>
					<ExcelSheet dataSet={this.state.excelAnalisis} name="Análisis Producción"/>
			</ExcelFile>
		}
	}

	render() {
		const { fixNavbar } = this.props;
		return (
			<>
				<div>
					<div className={`section-body ${fixNavbar ? "marginTop" : ""} mt-3`}>
						<div className="container-fluid">
						
							<div className="row">
									{/*<div className="col-lg-6 col-md-6">
										<div className="card">
											<div className="card-body w_sparkline">
												<div className="details">
													<span>Documentos alto Impacto</span>
													<h3 className="mb-0">
														<span className="counter">	<CountUp end={4} /></span>
													</h3>
												</div>
												<div className="w_chart">
													<div id="mini-bar-chart1" className="mini-bar-chart" />
												</div>
											</div>
										</div>
										{/* 
											<div className="w_chart">
													<span
														ref={this.sparkline1}
														id="mini-bar-chart1"
														className="mini-bar-chart"
													></span>
												</div>
										*/}
									{/*</div>
									<div className="col-lg-6 col-md-6">
										<div className="card">
											<div className="card-body w_sparkline">
												<div className="details">
													<span>Documentos bajo Impacto</span>
													<h3 className="mb-0">
														<CountUp end={14} />
														{/* <span >124</span> 
													</h3>
												</div>
												<div className="w_chart">
													<span
														ref={this.sparkline2}
														id="mini-bar-chart2"
														className="mini-bar-chart"
													/>
												</div>
											</div>
										</div>
									</div>*/}
								</div>
								<ReporteDocumentos></ReporteDocumentos>
								<ReporteEdad></ReporteEdad>
								{
									/*
									<ReporteSabana></ReporteSabana>
								
										 <ReporteSabanaCompleto></ReporteSabanaCompleto> */
								}
								
								<ReporteSabanaCompletoDos></ReporteSabanaCompletoDos>
							
						</div>
					</div>
				</div>
			</>
		);
	}
}

const mapStateToProps = state => ({
	fixNavbar: state.settings.isFixNavbar
})

const mapDispatchToProps = dispatch => ({
	visibleLoaderAction: (e) => dispatch(visibleLoaderAction(e))
})
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);