import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	statisticsAction,
	statisticsCloseAction,
	visibleLoaderAction
} from '../../../actions/settingsAction';
import manager from '../../../service-manager/api';
import routes from '../../../service-manager/routes';
import Tabla from './AlumnosTable.js';
import TablaDocuentos from './DocumentosTable.js';
import FormData from 'form-data';
import swal from 'sweetalert';
import Modal from 'react-bootstrap/Modal'
import PDFcalificaciones from './PDFcalificaciones.js';
import PDFcertificado from './PDFcertificado.js';
import PDFresumenExpediente from './PDFresumenExpediente.js';
import ModalOptionsList from './ModalOptionList.js';
import ModalConfirmarCurp from './ModalConfirmarCurp.js';
import ModalConfirmarCorreo from './ModalConfirmarCorreo.js';
import ModalConfirmarTelefono from './ModalConfirmarTelefono.js';
import ModalConfirmarTelefonoFijo from './ModalConfirmarTelefonoFijo.js';
import ModalConfirmarDireccion from './ModalConfirmarDireccion.js';
import ModalConfirmarObservaciones from './ModalConfirmarObservaciones.js';
import ModalSecundariaProcedencia from './ModalSecundariaProcedencia.js';
import ModalPreparatoriaProcedencia from './ModalPreparatoriaProcedencia.js';
import ModalUniversidadProcedencia from './ModalUniversidadProcedencia.js';
import ModalConfig from './ModalConfig.js';
import ModalEdit from './ModalEdit.js';
import './modal.css';
import { triggerBase64Download } from 'react-base64-downloader';
import ModalDireccion from './ModalDireccion.js';
import moment from 'moment';
import 'moment/locale/es';

var jsonCompletoAlumno = [];

class Documentos extends Component {
	constructor(props) {
		super(props);
		this.state = {
			files: [],
			file:null,
			facultades : "",
			dataTableAlumnos:[],
			dataHistorialTable:[],
			curriculums:[],
			documento:"",
			porcentaje:100,
			busqueda: "",
			carrera:"",
			secundariaNO:"",
			columnsAlumnos :
			[{
				Header: ' ',
				columns:
					[
					{
						Header: '',
						accessor: 'Doc',
						maxWidth: 50,
						Filter: '',
					},
					{
						Header: '',
						accessor: 'Cal',
						maxWidth: 50,
						Filter: '',
					},
					{
						Header: 'Matrícula',
						accessor: 'Matricula',
						maxWidth: 100,
					},
					{
						Header: 'Nombre',
						accessor: 'Nombre',
						width: 400,
					},
					{
						Header: 'Carrera',
						accessor: 'Carrera',
						width: 400,
					},
					{
						Header: 'Adeuda',
						accessor: 'Adeuda',
						width: 150,
					},
					{
						Header: 'Plan',
						accessor: 'CEPlan',
						width: 150,
					},
					{
						Header: 'Tipo de Ingreso',
						accessor: 'TipoIngreso',
						width: 150,
					},
					{
						Header: 'Estatus',
						accessor: 'Estatus',
						width: 150,
					},
					]
			}],
			headersDocumentos:[<th >DOCUMENTO</th>,<th >DIGITALIZADO</th> ,<th >ENTREGADO</th> ,/*<th >APLICA</th> ,*/ <th >IMPORTANCIA</th>,""],
			dataDocumentos:[],
			caseDocumentos:false,
			nombre:"",
			estatus:"",
			licenciatura:"",
			matricula:"",
			tituloAlumnos:"Lista Alumnos",
			modalDocumento:false,
			openModalOptions:false,
			openModalConfirmarCurp:false,
			openModalConfirmarCorreo:false,
			openModalConfirmarTelefono:false,
			openModalConfirmarTelefonoFijo:false,
			openModalConfirmarDireccion:false,
			openModalConfirmarObservaciones:false,
			openModalConfig:false,
			showModalDireccion:false,
			secundariaExtranjeroCheck:false,
			anoIngreso:"",
			CEPlan:"",
			TipoIngresoInicial:"",
			CicloIngreso:"",
			Hoy:"",
			Nacionalidad:"",
			PaisOrigen:"",
			Direccion:"",
			Curp:"",
			correo:"",
			telefono:"",
			genero:"",
			arregloAlumno: [],
			arrayToTablePDF:[],
			arrayPDFresumenAcademico:[],
			arrayPDFreumenNombreyMatricula:[],
			TipoIngresoEnviar:"",
			estatusDelAlumno:"",
			spinnerPosicion : "",
			//CHANGE INPUTS DOCUMENTOS
			changeCurp:false,
			changeCorreo:false,
			changeTelefono:false,
			changeTelefonoFijo:false,
			changeObservaciones:false,
			changeDireccion:false,
			checkExtrangero:false,
			aprobadas: "",
			reprobadas:"",
			valor:"" ,
			DireccionNumeroInt:"",
			Colonia:"",
			Poblacion:"",
			CodigoPostal:"",
			DireccionNumero:"",

			Creditos: 0,
			Materias: 0,
			PlanEscolar: "",
			RVOE: "",
			DGES:""	,
			FECHA:""
		}
		this.handleChange = this.handleChange.bind(this);
		this.keyPress = this.keyPress.bind(this);
	}


	componentDidMount(){
		//this.getAlumnos();
		this.listaCampus();
	}	
	//HANDLE ENTER KEY
	handleChangeExp(e) {
		this.setState({ valor: e.target.value });
	}

	keyPress(e){
		if(e.keyCode === 13){
			this.getAlumnos();
		   // put the login here
		}
	}

	//REQUEST A FACULTADES
	listaCampus(){
		this.props.visibleLoaderAction(true);

        manager.postData(routes.spWHsectionLista,{})
        .then(response => {
			this.props.visibleLoaderAction(false);
			this.setDataFacultades(response);
        })
        .catch(error =>{
			this.props.visibleLoaderAction(false);

			swal("Oops!", error.Mensaje , "error");
        })
	}

	setDataFacultades(response){
		let objArray = [response]
		let data = [];
		if(Array.isArray(response)){
			objArray = response
		}

		data = objArray.map((objV) => {

				return	<option value={objV.Carrera}>{objV.Carrera.replace("UW","")}</option>
			});
		this.setState({facultades: data});
	}


	//REQUEST A TODOS LOS ALUMNOS
	getAlumnos(){
		this.props.visibleLoaderAction(true);
        manager.postData(routes.GET_ALUMNOS,{"WebUsuario":localStorage.getItem("usuario"),"Licenciatura": this.state.carrera,"Busqueda": this.state.busqueda})
        .then(response => {
			this.setHeaders();
			this.setDataAlumnos(response);
			this.props.visibleLoaderAction(false);
        })
        .catch(error =>{
			swal("Oops!", error.Mensaje , "error");
			this.props.visibleLoaderAction(false);
        })
	}

	//TABLA DE ALUMNOS
	setHeaders() {
		let headers = ["DOC", "CAL","MATRÍCULA", "NOMBRE","LICENCIATURA","ADEUDA","ADEUDO DE ALTO IMPACTO","PLAN","TIPO DE INGRESO","ESTATUS DEL ALUMNO"];

		let headerItems = [];

		headerItems = headers.map((title, index) =>
				<th key={title + index} >{title}</th>
		);

		this.setState({
			headers: headerItems
		});
	}
	//DATA ALUMNOS
	setDataAlumnos(response){
		let objArray = [response]
		let data = [];
		if(Array.isArray(response)){
			objArray = response
		}

		data = objArray.map((objV) => {
				let array = {
					"Doc":
						<div onClick={() => this.handleClickDoc(objV)}>
								<a
									id="user-tab"
									data-toggle="tab"
									href="#user-add">
								<i class="icon-notebook"></i>
							</a>
						</div>,
					"Cal":
						<div onClick={() => this.handleClickCal(objV)}>
								<a
									id="user-tab"
									data-toggle="tab"
									href="#user-add">
								<i class="icon-book-open"></i>
							</a>
						</div>,
					"Matricula":(objV.Matricula || objV.Matricula!==null) ? objV.Matricula : " ",
					"Nombre": (objV.Nombre || objV.Nombre!==null) ? objV.Nombre : " ",
					"Carrera": (objV.Carrera || objV.Carrera!==null) ? objV.Carrera.replace("UW","") : " ",
					"Adeuda":(objV.Adeuda === 1) ? "SI" : "NO",
					"CEPlan":(objV.CEPlan || objV.CEPlan!==null) ? objV.CEPlan : " ",
					"TipoIngreso":(objV.TipoIngreso || objV.TipoIngreso!==null) ? objV.TipoIngreso: " ",
					"Estatus":(objV.CEEstatus || objV.CEEstatus!==null) ? objV.CEEstatus : " ",
				}
				return array;
			});
		this.setState({dataTableAlumnos: data});
	}

	//ACTUALIZA ENTIDAD
	handleActualizaEntidad(actualizaEntidad){
		console.log(actualizaEntidad)
		console.log(this.state.EntidadNacimiento)

		jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
		jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
		this.deleteItemsJSONcompletoAlumno();

		jsonCompletoAlumno.EntidadNacimiento = actualizaEntidad

		let JSONentidadNacimiento = JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

		this.requestUpdate(JSONentidadNacimiento);

	}


	//TRAER DOCUMENTOS DE ESE ALUMNO SELECCIONADO
	handleClickDoc = (alumno,actualizaEntidad) => {
		this.props.visibleLoaderAction(true);
		if(alumno){
			localStorage.setItem("usuarioActual",alumno.Alumno);
			this.setState({
				nombre:alumno.Nombre,
				matricula:alumno.Matricula,
				alumnoID: alumno.Alumno,
			})
		}
		manager.postData(routes.ALUMNO_DETALLE,{"UsuarioWeb":localStorage.getItem("usuario"),"Alumno":localStorage.getItem("usuarioActual")})
		.then(response => {
			var fecha =  response[0].FechaIngreso
			var anoIngreso = moment(fecha).format('L');
			moment.locale(anoIngreso);


			this.setState({
				changeTelefono:false,
				changeTelefonoFijo:false,
				changeCorreo:false,
				changeCurp:false,
				changeDireccion:false,
				changeObservaciones:false,
				checkExtrangero:(response[0].EsExtrajero === true ) ? "SI" : "NO",
				CEEstatus:response[0].CEEstatus,
				licenciatura:response[0].Licenciatura,
				anoIngreso:(anoIngreso != null) ? anoIngreso : "-",
				CEPlan:response[0].CEPlan,
				TipoIngresoInicial:response[0].TipoIngreso,
				CicloIngreso: response[0].CicloIngreso,
				CicloCursa:response[0].CicloCursa,
				Hoy:response[0].Hoy,
				Nacionalidad:response[0].Nacionalidad,
				PaisOrigen:response[0].PaisOrigen,
				Direccion:response[0].Direccion,
				Curp:response[0].CURP,
				observaciones:response[0].Observaciones,
				correo:response[0].eMailParticular,
				telefono:response[0].TelefonoParticular,
				telefonoFijo:response[0].TelefonoMovil,
				continuidad:response[0].EstatusIngreso,
				EntidadNacimiento:response[0].EntidadNacimiento,
				genero:response[0].Genero,
				arrayPDFreumenNombreyMatricula:alumno,
				arrayPDFresumenAcademico:response[0],
				caseDocumentos:true	,
				Colonia:response[0].Colonia,
				Poblacion:response[0].Poblacion,
				CodigoPostal:response[0].CodigoPostal,
				DireccionNumero:response[0].DireccionNumero,
				DireccionNumeroInt:response[0].DireccionNumeroInt,
				Estado:response[0].Estado,
				
			})
			jsonCompletoAlumno = response[0];
			this.props.visibleLoaderAction(false);
			this.getProcedenciaEscolar();
			this.getDocumentos();
		})

		.catch(error =>{
			swal("Oops!", error.Mensaje , "error");
			this.props.visibleLoaderAction(false);
		})
	}
	getProcedenciaEscolar(){
		this.props.visibleLoaderAction(true);
		manager.postData(routes.ESCUELA_PROCEDENCIA,{"UsuarioWeb":localStorage.getItem("usuario"),"Student_id":localStorage.getItem("usuarioActual")})
		.then(response => {
			this.setState({
				secuProcedencia:response[0].EscuelaSecundaria,
				prepaProcedencia:response[0].EscuelaPreparatoria,
				uniProcedencia:response[0].EscuelaUniversidad,
				lugarSecundaria:response[0].EstadoCursoSecundaria,
				lugarPreparatoria:response[0].EstadoCursoPreparatoria,
				lugarUniversidad:response[0].EstadoCursoUniversidad,
			})

			this.props.visibleLoaderAction(false);
		})
		.catch(error =>{
			swal("Oops!", error.Mensaje , "error");
			this.props.visibleLoaderAction(false);
		})
	}
	//TRAER DOCUMENTOS
	getDocumentos(){
		this.props.visibleLoaderAction(true);
		manager.postData(routes.GET_DOCUMENTOS,{"UsuarioWeb":localStorage.getItem("usuario"),"Alumno":localStorage.getItem("usuarioActual")})
		.then(response => {
			this.setHeadersDocumentos();
			this.setDataDocumentos(response);
			this.props.visibleLoaderAction(false);
		})
		.catch(error =>{
			swal("Oops!", error.Mensaje , "error");
			this.props.visibleLoaderAction(false);
		})
	}
	//HEADERS TABLA DOCUMENTOS
	setHeadersDocumentos() {
	//	let headers = ["DOCUMENTO", "ENTREGADO","IMPORTANCIA",""];

		//let headerItems = [];
	}

	downloadDocumento = (path,ext,name)=> {
		//e.preventDefault();
		this.props.visibleLoaderAction(true);
		manager.postDataForm(routes.DOWNLOAD,{"path": path})
		.then(response => {
			this.props.visibleLoaderAction(false);
			if(path.includes('pdf') || path.toString().toUpperCase().includes('PDF')){
				const linkSource = response.Archivo;
				const downloadLink = document.createElement("a");
				const fileName = name+".pdf";

				downloadLink.href = linkSource;
				downloadLink.download = fileName;
				downloadLink.click();
			}else{
				triggerBase64Download(response.Archivo,name)
			}

		})
		.catch(error =>{
			swal("Oops!", error.Mensaje , "error");
			this.props.visibleLoaderAction(false);
		})
	}

	deleteDocumento = (path,ext,name)=> {
		//e.preventDefault();
		this.props.visibleLoaderAction(true);
		manager.postDataForm(routes.DELETE,{"path": path})
		.then(response => {
			this.props.visibleLoaderAction(false);
			this.deleteDocumentoERP(name)
		})
		.catch(error =>{
			swal("Oops!", error.Mensaje , "error");
			this.props.visibleLoaderAction(false);
		})
	}


	deleteDocumentoERP = (name)=> {
		//e.preventDefault();
		this.props.visibleLoaderAction(true);
		manager.postDataForm(routes.spWebAnexoCtaEliminar,{"UsuarioWeb":localStorage.getItem("usuario"),"Alumno":localStorage.getItem("usuarioActual"),"Documento": name })
		.then(response => {
			this.props.visibleLoaderAction(false);
			this.getDocumentos()
		})
		.catch(error =>{
			swal("Oops!", error.Mensaje , "error");
			this.props.visibleLoaderAction(false);
		})
	}

	//DATA TABLA DOCUMENTOS
	setDataDocumentos(response) {
		let objArray = response;
		let data = [];
		let docs = 0;
		data = objArray.map((objV, index) => {

			let buttonStyle = 'btn btn-primary'
			if(objV.Importancia === "Alto"){
				buttonStyle = 'btn btn-danger'
			}

			if(this.compareString(objV.Nombre , "ACTA NACIMIENTO") || this.compareString(objV.Nombre , "CERTIFICADO ORIGINAL SECUNDARIA") || this.compareString( objV.Nombre ,"CERTIFICADO ORIGINAL PREPARATORIA") || this.compareString(objV.Nombre ,"CERTIFICADO DE UNIVERSIDAD") ){
					if(objV.Ok.toString().toUpperCase() === "SI" || objV.Ok === "N/A"){
						docs++;
					}
				if(objV.Nombre=== "CERTIFICADO ORIGINAL SECUNDARIA"){
					if(objV.Ok === "N/A"){
						this.setState({
							secundariaNA:"N/A"
						})
					}else{
						this.setState({
							secundariaNA:"",
						})
					}
					if(objV.Ok === "NO"){
						this.setState({
							secundariaNO:"NO"
						})
					}else{
						this.setState({
							secundariaNO:"",
						})
					}
				}
				if(objV.Nombre=== "CERTIFICADO ORIGINAL PREPARATORIA"){
					if(objV.Ok === "N/A"){
						this.setState({
							preparatoriaNA:"N/A"
						})
					}else{
						this.setState({
							preparatoriaNA:""
						})
					}
					if(objV.Ok === "NO"){
						this.setState({
							preparatoriaNO:"NO"
						})
					}else{
						this.setState({
							preparatoriaNO:""
						})
					}
				}
				if(objV.Nombre=== "CERTIFICADO DE UNIVERSIDAD" ){
					if(objV.Ok === "N/A"){
						this.setState({
							universidadNA:"N/A"
						})
					}else{
						this.setState({
							universidadNA:""
						})
					}
					if(objV.Ok === "NO"){
						this.setState({
							universidadNO:"NO"
						})
					}else{
						this.setState({
							universidadNO:""
						})
					}
				}
			}
			return <tr>
						<td>
							<span className="font-weight-bolder">{objV.Nombre}</span>
						</td>

						{
						(objV.Ok !== "N/A")? (
							(objV.Digitalizado === 0 && objV.Ok !== "N/A") ?
							<td className="">NO</td>:
							<td className=" font-weight-bolder">SI</td>
							):(<td className=""></td>)
						}

						{
						/*(objV.Digitalizado === 0 ) ? (*/
						<td className="font-weight-bolder"  >
							<select
								className="form-control"
								data-placeholder="Choose a color..."
								name="category-color"
								onChange={(e) => this.requestAplica(e,objV.Nombre)}
								value={objV.Ok.toLocaleUpperCase() }>
								<option>SI</option>
								<option>NO</option>
								<option>N/A</option>
							</select>
							</td>
						/*):(
							<td className="font-weight-bolder">SI</td>
						)*/
						}
						{
						<td><button className={buttonStyle}>{(objV.Importancia || objV.Importancia!==null) ? objV.Importancia : " "}</button> </td>
						}
						<td>
						{
						(objV.Digitalizado === 0 && objV.Ok !== "N/A") ?
							<button
								type="button"
								className="btn btn-icon btn-sm"
								title="fe fe-upload"
								data-toggle="modal"
								onClick={() => this.uploadDocumento(objV.Nombre)}>
								<i className="fe fe-upload" />
							</button>	:
							<></>
						}

						{
						(objV.Digitalizado === 1 && objV.Ok !== "N/A") ?
							<>
								<button
								type="button"
								className="btn btn-icon btn-sm"
								title="fe fe-upload"
								data-toggle="modal"
								onClick={() => this.deleteDocumentoClick(objV)}>
									<i className="fe fe-delete" />
								</button>
								<button
								type="button"
								className="btn btn-icon btn-sm"
								title="fe fe-download"
								onClick={() => this.downloadDocumentoClick(objV)}
								>
									<i className="fe fe-download" />
								</button>
							</>
								:
							<></>
						}
						</td>
					</tr>
			}
		);

		let porcentaje = (docs / 4) * 100

		this.setState({dataDocumentos: data,porcentaje: porcentaje});
	}

	compareString = (primerCadena , segundaCadena) => {
		
		var n = primerCadena.localeCompare(segundaCadena);
		if(n=== 0){
			return true;
		}else{
			return false;
		}

	}

	// SUBIR DOCUMENTOS
	uploadDocumento = (documento) => {
		this.setState({
			documento: documento,
			modalDocumento : true,
		});
	}
	//CERRAR MODAL
	manejarClose = (state) => {
		this.setState({
			modalDocumento: state
		});
	}

	//DESCARGAR DOCUMENTO
	downloadDocumentoClick = (documento) => {
		this.setState({
			documento: documento,
		});
		this.downloadDocumento(documento.Direccion,documento.Extencion,documento.Nombre);

	}

	//ELIMINAR DOCUMENTOS
	deleteDocumentoClick = (documento) => {
		swal({
			title: '',
			text:'¿Está seguro que desea eliminar ' + documento.Nombre + " ?",
			buttons: true,
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				this.setState({
					documento: documento,
				});
				this.deleteDocumento(documento.Direccion,documento.Extencion,documento.Nombre);
			} else {

			}
		});


	}


	//MENJANDO DOCUMENTO

	handleFile(e){

		let file = e.target.files[0];
		const name = file.name.split(".",1);
		const documento = this.state.documento;

		console.log(this.state.documento);
		console.log(documento.toString().replace(" ","") === name.toString().replace(" ",""));


		if(name.toString().replace(" ","") === this.state.documento.toString().replace(" ","")){
			this.setState({file: file})
		}else{
			swal("Oops!", "El nombre del documento no coincide" , "error");
			this.setState({file: null});
		}
	}

	onFilesChange = (files) => {
		this.setState({
		files
		}, () => {

		})
	}

	filesRemoveOne = (file) => {
		this.setState({
			file: null
		});
	}

	filesRemoveAll = (file) => {

		this.setState({
			file: null
		});
	}

	filesUpload = (download) => {
		//this.manejarClose(false);
		this.props.visibleLoaderAction(true);
		manager.postDataForm(routes.RUTA_ALMACENAR,{"UsuarioWeb":localStorage.getItem("usuario"),"Alumno":localStorage.getItem("usuarioActual")})
		.then(response => {
			if(download){
				this.almacenarFile(response[0].Ruta);
			}else{
				this.downloadDocumento();
			}
		})
		.catch(error =>{
			this.props.visibleLoaderAction(false);
			swal("Oops!", error.Mensaje , "error");
		})
	}

	almacenarFile(path){
		let file = this.state.file
		const formData  = new FormData()
		formData.append('file', file);
		let fileName = file.name;
		let ext = fileName.substr(fileName.lastIndexOf('.') + 1);

		formData.append('path',path);
		this.props.visibleLoaderAction(true);
		manager.postDataForm(routes.UPLOAD,formData)
		.then(response => {
			this.fileUploadSQL(ext,path);
			this.props.visibleLoaderAction(false);
			this.props.history.push({
				pathname: '/hr-documentos'
			});
		})
		.catch(error =>{
			swal("Oops!", error.Mensaje , "error");
			this.props.visibleLoaderAction(false);
		})
	}

	fileUploadSQL = (ext ,path) => {
		this.manejarClose(false);
		this.props.visibleLoaderAction(true);
		manager.postDataForm(routes.spWebAnexoCtaCEAlumno,{"UsuarioWeb":localStorage.getItem("usuario"),"Alumno":localStorage.getItem("usuarioActual"),"Documento":this.state.documento,"PathAnexo": path+"/"+this.state.documento+"."+ext ,"Tipo":'Imagen',"Extencion": ext})
		.then(response => {
			try{
				if(response.Mensaje === "Archivo guardado con éxito"){
					swal("Proceso Completado",response[0].OkRef, "success");
					this.handleClick(localStorage.getItem("usuarioActual"));
					this.getDocumentos();

				}else{
					swal("Proceso Completado",response[0].OkRef, "success");
					this.getDocumentos();
				}
			} catch{

			}

		})
		.catch(error =>{
			this.props.visibleLoaderAction(false);
			swal("Oops!", error.Mensaje , "error");
		})
	}

	//REINICIANDO EL ESTADO
	handleClickAll = () =>{
		this.setState({
			caseDocumentos:false,
			caseCalificaciones:false,
			changeSecundaria:false,
			changePreparatoria:false,
			changeUniversidad: false,
			secundariaExtranjeroCheck:false,
			preparatoriaExtranjeroCheck:false,
			universidadExtranjeroCheck:false,
		})
	}


	//////LOGICA  CALIFICACIONES
	handleClickCal = (alumno)=> {
		this.props.visibleLoaderAction(true);
		manager.postData(routes.ALUMNO_DETALLE,{"UsuarioWeb":localStorage.getItem("usuario"),"Alumno":alumno.Alumno})
		.then(response => {
			this.setState({
				caseCalificaciones:true,
				estatusDelAlumno:response[0].EstatusIngreso,
				nombre:alumno.Nombre,
				arregloAlumno:alumno,
				anoIngreso:(response[0].FechaIngreso != null) ? response[0].FechaIngreso.substring(0,4) : "-",
				estatus:alumno.Estatus,
				matricula:alumno.Matricula,
				licenciatura:response[0].Licenciatura,
				genero:response[0].Genero,
				RVOE:alumno.RVOE,
				DGES:alumno.DGES,
				Fecha:alumno.Fecha,
				Creditos:alumno.Creditos,
				Materias:alumno.Materias,
				PlanEscolar:alumno.PlanEscolar,
				alumnoID: alumno.Alumno,
				ingreso:(response[0].CicloIngreso != null) ? response[0].CicloIngreso : "SIN INFORMACIÓN",
			})


			//jsonCompletoAlumno = response[0];
			this.props.visibleLoaderAction(false);
			this.curriculumsAlumno(this.state.alumnoID);

		})

		.catch(error =>{
			swal("Oops!", error.Mensaje , "error");
			this.props.visibleLoaderAction(false);
		})
	}



	curriculumsAlumno(alumno){
		this.props.visibleLoaderAction(true);
		manager.postData(routes.sp_g_curriculums,{"UsuarioWeb":localStorage.getItem("usuario"),"Student_id":this.state.alumnoID})
		.then(response => {
			this.setDataListCurriculums(response)
			this.historialAcademico(response[0].id);
			/*
			this.setState({
				RVOE:response.RVOE,
				DGES:response.DGES,
				Fecha:response.Fecha,
				Creditos:response.Creditos,
				Materias:response.Materias,
				PlanEscolar:response.PlanEscolar,
				porcentajeCreditos:response.porcentajeCreditos
			})*/
			this.props.visibleLoaderAction(false);
		})
		.catch(error =>{
			this.props.visibleLoaderAction(false);
			swal("Oops!", error.Mensaje , "error");
		})
	}


	historialAcademico(carrera){
		this.props.visibleLoaderAction(true);
		manager.postData(routes.HISTORIAL_ACADEMICO,{"UsuarioWeb":localStorage.getItem("usuario"),"Student_id":this.state.alumnoID,"curriculums":carrera})
		.then(response => {
			this.setDataHistorial(response);
			this.setState({
				arrayToTablePDF:response
			});
			this.props.visibleLoaderAction(false);
		})
		.catch(error =>{
			this.props.visibleLoaderAction(false);
			swal("Oops!", error.Mensaje , "error");
		})
	}

	setDataListCurriculums(response){
		console.log(response)
		let objArray = response
		let curriculums = [];
		if(Array.isArray(response)){
			objArray = response
		}

		curriculums = objArray.map((objV) => {
				return	<option value={objV.id}>{objV.curriculums}</option>
			});

		this.setState({
			curriculums: curriculums,
		});
	}


	setDataHistorial(response){
		let apro = 0;
        let repro = 0;
        let sumaCalif = 0;
        let promedio = 0;
		let numCreditos = 0;
		let porcentajeCreditos = 0;
		let numMaterias = 0;
		let objArray = [response]
		let dataHistorial = [];

		if(Array.isArray(response)){
			objArray = response
		}
		let recursadas = 0;

		dataHistorial = objArray.map((objV,index) => {

			//CALCULANDO CREDITOS
            numCreditos = numCreditos + objV.credits;
            // CALCULANDO APROBADAS Y REPROBADAS
            if(objV.Promedio >= 6){
                apro = apro + 1
				sumaCalif = sumaCalif + objV.Promedio;
				numMaterias = numMaterias + 1
            }else{
                repro = repro + 1
			}

			//CALCULANDO PORCENTAJE CREDITOS

			let renglon ;
			let titulo ;

			titulo = (
					<tr>
						<td bgcolor="#33bcd3" colspan="10" className="text-center text-white font-weight-bolder">{objV.Semestre}</td>
					</tr>
			)

			let variable = false;
			for(var i=index + 1;i<response.length; i++){
				if(objV.CodigoMateria === response[i].CodigoMateria){
					recursadas = recursadas + 1;
					variable = true;
				}
			}

			if(objV.Promedio < 5){
				variable = true;
			}

			renglon =
			(
			<tr className={ (variable ? "text-red" : "text-dark font-weight-bold" )}>
				<td>{objV.CodigoMateria}</td>
				<td>{objV.credits}</td>
				<td>{objV.Materia}</td>
				<td>{(objV.Promedio < 5) ? "5" : objV.Promedio}</td>
				<td>{objV.Ordinario}</td>
				<td>{objV.Ciclo}</td>
				<td>{objV.Grupo}</td>
			</tr>
			)

			let renglonTitulo = <>{titulo}{renglon}</>;

			if(index === 0){
				return  renglonTitulo ;
			}else {
				if(objArray[index - 1]["Semestre"] === objV.Semestre){
					return  renglon ;
				}else {
					return  renglonTitulo ;
				}
			}

		});

		this.setState({
			materiasRecursadas:recursadas
		})
		porcentajeCreditos = (numCreditos * 100)/this.state.Creditos;
		let aproReal = apro.toString();
        let reproReal = repro.toString();
        // CALCULANDO PROMEDIO
        promedio = sumaCalif/apro;
        let promedioFormat = (Math.round(promedio * 100) / 100).toFixed(2);
		let promedioReal = promedioFormat.toString();
		let numCreditosTwoDecimals = numCreditos.toFixed(2);
		this.setState({
			dataHistorialTable: dataHistorial,
			promReal:promedioReal,
			aproReal:aproReal,
			reproReal:reproReal,
			numCreditos:numCreditosTwoDecimals,
			numMaterias:numMaterias,
			porcentajeCreditos:porcentajeCreditos
		});

	}
	//DESCARGA CERTIFICADO
	estadoDescargaCertificado(estado){
		this.setState({descargarPdfCertificado: estado});
	}
	downloadPdfCertificado(event) {
		this.props.visibleLoaderAction(true);
		this.setState({descargarPdfCertificado: true});

	}
	// DESCARGAR PDF HISTORIAL
	estadoDescarga(estado){
		this.setState({descargarPdf: estado});
	}

	downloadPdf(event) {
		this.props.visibleLoaderAction(true);
		this.setState({descargarPdf: true});

	}

	//DESCARGAR PDF RESUMEN

	estadoDescargaResumen(estado){
		this.setState({descargarResumenPdf: estado});
	}

	downloadPdfResumen(event){
		this.props.visibleLoaderAction(true);
		this.setState({descargarResumenPdf: true});

	}


	//ELEGIR OPCIÒN

	handleTipoList = (e,tipo) => {
		this.props.visibleLoaderAction(true);
		switch(tipo) {
			case "plan":
				manager.postData(routes.ALUMNO_CEPLAN,{"UsuarioWeb":localStorage.getItem("usuario")})
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
			case "continuidad":
				manager.postData(routes.CONTINUIDAD_LIST,{"UsuarioWeb ":localStorage.getItem("usuario")})
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
			case "nacionalidad":
				manager.postData(routes.NACIONALIDAD_LIST,{"UsuarioWeb ":localStorage.getItem("usuario")})
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
			case "pais":
				manager.postData(routes.PAIS_LIST,{"UsuarioWeb ":localStorage.getItem("usuario")})
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
			case "estado":
				manager.postData(routes.ESTADO_LIST,{"UsuarioWeb ":localStorage.getItem("usuario"),"Pais":"Mexico"})
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
			case "paisSecundaria":
				this.setState({
					changeSecundaria:true
				})
				this.listaLugares("paisSecundaria",this.state.secundariaExtranjeroCheck);
			break;
			case "estadoSecundaria":
				this.setState({
					changeSecundaria:true
				})
				this.listaLugares("estadoSecundaria",this.state.secundariaExtranjeroCheck);
			break;
			case "paisPreparatoria":
				this.setState({
					changePreparatoria:true
				})
				this.listaLugares("paisPreparatoria",this.state.preparatoriaExtranjeroCheck);
			break;
			case "estadoPreparatoria":
				this.setState({
					changePreparatoria:true
				})
				this.listaLugares("estadoPreparatoria",this.state.preparatoriaExtranjeroCheck);
			break;
			case "paisUniversidad":
				this.setState({
					changeUniversidad:true
				})
				this.listaLugares("paisUniversidad",this.state.universidadExtranjeroCheck);
			break;
			case "estadoUniversidad":
				this.listaLugares("estadoUniversidad",this.state.universidadExtranjeroCheck);
				this.setState({
					changeUniversidad:true
				})
			break;

			default:
				break;
		}
	}

	listaLugares(tipo,tipoCheck){
		if(tipoCheck){
			manager.postData(routes.PAIS_LIST,{"UsuarioWeb ":localStorage.getItem("usuario")})
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

		}else{
			manager.postData(routes.ESTADO_LIST,{"UsuarioWeb ":localStorage.getItem("usuario"),"Pais":"Mexico"})
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
		}
	}

	setDataList(response,tipo,documento){
		switch(tipo) {
			case "plan":

				let objArrayCEPlan = response

				let dataCEPlan = [];

				dataCEPlan = objArrayCEPlan.map((objV) =>
					<tr key = {objArrayCEPlan.id}  >
						<center><td className="opcList" onClick={(e) => this.tipoIngresoSelected(objV.Plan,"plan")}>{objV.Plan}</td></center>
					</tr>
				);
				this.setState({
					listData: dataCEPlan,

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
						<center><td className="opcList" onClick={(e) => this.tipoIngresoSelected(objV.Estatus,"estatus")}>{objV.Estatus}</td></center>
					</tr>
				);
				this.setState({
					listData: dataEstatus,

				});

			break;
			case "continuidad":

				let objArrayContinuidad = response

				let dataContinuidad = [];

				dataContinuidad = objArrayContinuidad.map((objV) =>
					<tr key = {objArrayContinuidad.id}  >
						<center><td className="opcList" onClick={(e) => this.tipoIngresoSelected(objV.Estatus,"continuidad")}>{objV.Estatus}</td></center>
					</tr>
				);
				this.setState({
					listData: dataContinuidad,

				});

			break;
			case "nacionalidad":

				let objArrayNacionalidad = response

				let dataNacionalidad = [];

				dataNacionalidad = objArrayNacionalidad.map((objV) =>
					<tr key = {objArrayNacionalidad.id}  >
						<center><td className="opcList" onClick={(e) => this.tipoIngresoSelected(objV.Nacionalidad,"nacionalidad")}>{objV.Nacionalidad}</td></center>
					</tr>
				);
				this.setState({
					listData: dataNacionalidad,

				});

			break;
			case "pais":

				let objArrayPais = response

				let dataPais = [];

				dataPais = objArrayPais.map((objV) =>
					<tr key = {objArrayPais.id}  >
						<center><td className="opcList" onClick={(e) => this.tipoIngresoSelected(objV.Pais,"pais")}>{objV.Pais}</td></center>
					</tr>
				);
				this.setState({
					listData: dataPais,

				});

			break;
			case "estado":

				let objArrayEstado = response

				let dataEstado = [];

				dataEstado = objArrayEstado.map((objV) =>
					<tr key = {objArrayEstado.id}  >
						<center><td className="opcList" onClick={(e) => this.tipoIngresoSelected(objV.Estado,"estado")}>{objV.Estado}</td></center>
					</tr>
				);
				this.setState({
					listData: dataEstado,

				});

			break;
			case "paisSecundaria":
				let objArrayPaisSecundaria = response
				let dataPaisSecundaria = [];
				dataPaisSecundaria = objArrayPaisSecundaria.map((objV) =>
					<tr key = {objArrayPaisSecundaria.id}  >
						<center><td className="opcList" onClick={(e) => this.tipoIngresoSelected(objV.Pais,"paisSecundaria")}>{objV.Pais}</td></center>
					</tr>
				);
				this.setState({
					listData: dataPaisSecundaria,

				});
			break;
			case "estadoSecundaria":
				let objArrayEstadoSecundaria = response
				let dataEstadoSecundaria = [];
				dataEstadoSecundaria = objArrayEstadoSecundaria.map((objV) =>
					<tr key = {objArrayEstadoSecundaria.id}  >
						<center><td className="opcList" onClick={(e) => this.tipoIngresoSelected(objV.Estado,"estadoSecundaria")}>{objV.Estado}</td></center>
					</tr>
				);
				this.setState({
					listData: dataEstadoSecundaria,

				});

			break;
			case "paisPreparatoria":
				let objArrayPaisPreparatoria = response
				let dataPaisPreparatoria = [];
				dataPaisPreparatoria = objArrayPaisPreparatoria.map((objV) =>
					<tr key = {objArrayPaisPreparatoria.id}  >
						<center><td className="opcList" onClick={(e) => this.tipoIngresoSelected(objV.Pais,"paisPreparatoria")}>{objV.Pais}</td></center>
					</tr>
				);
				this.setState({
					listData: dataPaisPreparatoria,

				});
			break;
			case "estadoPreparatoria":
				let objArrayEstadoPreparatoria = response
				let dataEstadoPreparatoria = [];
				dataEstadoPreparatoria = objArrayEstadoPreparatoria.map((objV) =>
					<tr key = {objArrayEstadoPreparatoria.id}  >
						<center><td className="opcList" onClick={(e) => this.tipoIngresoSelected(objV.Estado,"estadoPreparatoria")}>{objV.Estado}</td></center>
					</tr>
				);
				this.setState({
					listData: dataEstadoPreparatoria,

				});

			break;
			case "paisUniversidad":
				let objArrayPaisUniversidad = response
				let dataPaisUniversidad = [];
				dataPaisUniversidad = objArrayPaisUniversidad.map((objV) =>
					<tr key = {objArrayPaisUniversidad.id}  >
						<center><td className="opcList" onClick={(e) => this.tipoIngresoSelected(objV.Pais,"paisUniversidad")}>{objV.Pais}</td></center>
					</tr>
				);
				this.setState({
					listData: dataPaisUniversidad,

				});
			break;
			case "estadoUniversidad":
				let objArrayEstadoUniversidad = response
				let dataEstadoUniversidad = [];
				dataEstadoUniversidad = objArrayEstadoUniversidad.map((objV) =>
					<tr key = {objArrayEstadoUniversidad.id}  >
						<center><td className="opcList" onClick={(e) => this.tipoIngresoSelected(objV.Estado,"estadoUniversidad")}>{objV.Estado}</td></center>
					</tr>
				);
				this.setState({
					listData: dataEstadoUniversidad,

				});

			break;

			default:

			break;
			}

	}

	//PASANDO LA ENTIDAD DE NACIMIENTO QUE GENERA EL CURP
	equalsEntidadNacimiento(entidadCURP){
		console.log("AQUI SI ENTROY")
		this.setState({
			EntidadNacimiento:entidadCURP
		})

	}

	manejarCloseOptions = (state) => {
		this.setState({
			openModalOptions: state
		});
	}

	manejarCloseConfirmarCurp = (state) => {
		this.setState({
			openModalConfirmarCurp: state
		});
	}
	//CAMBIAR CORREO
	manejarCloseConfirmarCorreo = (state) => {
		this.setState({
			openModalConfirmarCorreo: state
		});
	}

	handleConfirmarCorreo(){
		this.setState({
			openModalConfirmarCorreo:true,
		})
	}
	//CAMBIAR TELEFONO
	manejarCloseConfirmarTelefono = (state) => {
		this.setState({
			openModalConfirmarTelefono: state
		});
	}

	//CAMBIAR TELEFONO FIJO
	manejarCloseConfirmarTelefonoFijo = (state) => {
		this.setState({
			openModalConfirmarTelefonoFijo: state
		});
	}

	handleConfirmarTelefono(){
		this.setState({
			openModalConfirmarTelefono:true,
		})
	}

	handleConfirmarTelefonoFijo(){
		this.setState({
			openModalConfirmarTelefonoFijo:true,
		})
	}

	//CONFIRMAR SECUNDARIA
	handleConfirmarSecundaria(){
		this.setState({
			openModalSecundaria:true,
		})
	}

	//CONFIRMAR PREPARATORIA
	handleConfirmarPreparatoria(){
		this.setState({
			openModalPreparatoria:true,
		})
	}

	//CONFIRMAR UNIVERSIDAD
	handleConfirmarUniversidad(){
		this.setState({
			openModalUniversidad:true,
		})
	}


	manejarCloseConfirmarDireccion = (state) => {
		this.setState({
			openModalConfirmarDireccion: state
		});
	}

	manejarCloseConfirmarObservaciones = (state) => {
		this.setState({
			openModalConfirmarObservaciones: state
		});
	}

	//MANEJAR CLOSE SECUNDARIA
	manejarCloseSecundaria = (state) => {
		this.setState({
			openModalSecundaria: state
		});
	}

	//MANEJAR CLOSE PREPARATORIA
	manejarClosePreparatoria = (state) => {
		this.setState({
			openModalPreparatoria: state
		});
	}

	//MANEJAR CLOSE UNIVERSIDAD
	manejarCloseUniversidad = (state) => {
		this.setState({
			openModalUniversidad: state
		});
	}

	deleteItemsJSONcompletoAlumno(){
		delete jsonCompletoAlumno.Hoy;
		delete jsonCompletoAlumno.Genero;
		delete jsonCompletoAlumno.Estatus;
		delete jsonCompletoAlumno.ActaNacimiento;
		delete jsonCompletoAlumno.AvisoConsentimiento;
		delete jsonCompletoAlumno.AvisoPrivacidad;
		delete jsonCompletoAlumno.CartaCambioCarrera;
		delete jsonCompletoAlumno.CartaCompromiso;
		delete jsonCompletoAlumno.CertificadoMedico;
		delete jsonCompletoAlumno.CertificadoParcialUniversidad;
		delete jsonCompletoAlumno.CertificadoPreparatoria;
		delete jsonCompletoAlumno.CertificadoSecundaria;
		delete jsonCompletoAlumno.Contrato;
		delete jsonCompletoAlumno.CuentaConLegalizacion;
		delete jsonCompletoAlumno.DocumentoInscripcion;
		delete jsonCompletoAlumno.Equivalencia;
		delete jsonCompletoAlumno.EscuelaProcedencia;
		delete jsonCompletoAlumno.EstadoCursoPreparatoria;
		delete jsonCompletoAlumno.EstadoCursoSecundaria;
		delete jsonCompletoAlumno.Folio2;
		delete jsonCompletoAlumno.Folio3;
		delete jsonCompletoAlumno.Folio4;
		delete jsonCompletoAlumno.Folio5;
		delete jsonCompletoAlumno.Folio6;
		delete jsonCompletoAlumno.FolioDictamenEquivalencia;
		delete jsonCompletoAlumno.Forma;
		delete jsonCompletoAlumno.FormaFolio;
		delete jsonCompletoAlumno.Fotos;
		delete jsonCompletoAlumno.HojaDatosGenerales;
		delete jsonCompletoAlumno.EscuelaProcedencia7;
		delete jsonCompletoAlumno.EstadoCursoUniversidad;
		delete jsonCompletoAlumno.FormaVencimiento;
	}

	updateProcedencia = (dataEscuela, tipoEscuela) => {
		let UsuarioWeb = localStorage.getItem("usuario")
		let Alumno = localStorage.getItem("usuarioActual")
		switch(tipoEscuela) {
			case "secundaria":
				this.props.visibleLoaderAction(true);
				manager.postData(routes.ESCUELA_PROCEDENCIA_ACTUALIZA,
				{
					"UsuarioWeb":UsuarioWeb,
					"Student_id":Alumno,
					"EstadoCursoPreparatoria":this.state.lugarPreparatoria,
					"EscuelaPreparatoria":this.state.prepaProcedencia,
					"EstadoCursoUniversidad":this.state.lugarUniversidad,
					"EscuelaUniversidad":this.state.uniProcedencia,
					"EstadoCursoSecundaria": this.state.lugarSecundaria,
					"EscuelaSecundaria":dataEscuela

				})
				.then(response => {
					this.props.visibleLoaderAction(false);
					this.setState({
						changeSecundaria:false
					})
					this.getProcedenciaEscolar();
					swal("Correcto !","ok", "success");

				})
				.catch(error =>{
					this.props.visibleLoaderAction(false);
					swal("Oops!", error.Mensaje , "error");
				})

			break;
			case "preparatoria":
				this.props.visibleLoaderAction(true);
				manager.postData(routes.ESCUELA_PROCEDENCIA_ACTUALIZA,
				{
					"UsuarioWeb":UsuarioWeb,
					"Student_id":Alumno,
					"EstadoCursoPreparatoria":this.state.lugarPreparatoria,
					"EscuelaPreparatoria":dataEscuela,
					"EstadoCursoUniversidad":this.state.lugarUniversidad,
					"EscuelaUniversidad":this.state.uniProcedencia,
					"EstadoCursoSecundaria":this.state.lugarSecundaria,
					"EscuelaSecundaria":this.state.secuProcedencia

				})
				.then(response => {
					this.props.visibleLoaderAction(false);
					this.setState({
						changePreparatoria:false
					})
					this.getProcedenciaEscolar();
					swal("Correcto !","ok", "success");

				})
				.catch(error =>{
					this.props.visibleLoaderAction(false);
					swal("Oops!", error.Mensaje , "error");
				})
				break;
			case "universidad":
				this.props.visibleLoaderAction(true);
				manager.postData(routes.ESCUELA_PROCEDENCIA_ACTUALIZA,
				{
					"UsuarioWeb":UsuarioWeb,
					"Student_id":Alumno,
					"EstadoCursoPreparatoria":this.state.lugarPreparatoria,
					"EscuelaPreparatoria":this.state.prepaProcedencia,
					"EstadoCursoUniversidad":this.state.lugarUniversidad,
					"EscuelaUniversidad":dataEscuela,
					"EstadoCursoSecundaria":this.state.lugarSecundaria,
					"EscuelaSecundaria":this.state.secuProcedencia

				})
				.then(response => {
					this.props.visibleLoaderAction(false);
					this.setState({
						changeUniversidad:false
					})
					this.getProcedenciaEscolar();
					swal("Correcto !","ok", "success");

				})
				.catch(error =>{
					this.props.visibleLoaderAction(false);
					swal("Oops!", error.Mensaje , "error");
				})
				break;

			default:

			}
	}

	tipoIngresoSelected = (campo,tipo) => {
		switch(tipo) {
			case "plan":
			jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
			jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
			this.deleteItemsJSONcompletoAlumno();

			jsonCompletoAlumno.CEPlan = campo

			let JSONCPlan = JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

			this.requestUpdate(JSONCPlan);
			break;
			case "tipoIngreso":
				jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
				jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
				this.deleteItemsJSONcompletoAlumno();

				jsonCompletoAlumno.TipoIngreso = campo

				let JSONtipoIngreso = JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

				this.requestUpdate(JSONtipoIngreso);
			break;
			case "estatus":
				jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
				jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
				this.deleteItemsJSONcompletoAlumno();

				jsonCompletoAlumno.CEEstatus = campo

				let JSONceeEstatus = JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

				this.requestUpdate(JSONceeEstatus);
			break;
			case "continuidad":

			jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
				jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
				this.deleteItemsJSONcompletoAlumno();

				jsonCompletoAlumno.EstatusIngreso = campo;

				let JSONcontinuidad = JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

				this.requestUpdate(JSONcontinuidad);

			break;
			case "nacionalidad":
				jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
				jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
				this.deleteItemsJSONcompletoAlumno();

				jsonCompletoAlumno.Nacionalidad = campo;

				let JSONNacionalidad= JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

				this.requestUpdate(JSONNacionalidad);
			break;
			case "pais":
				jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
				jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
				this.deleteItemsJSONcompletoAlumno();

				jsonCompletoAlumno.PaisOrigen = campo;

				let JSONPais= JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

				this.requestUpdate(JSONPais);
			break;
			case "estado":
			jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
			jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
			this.deleteItemsJSONcompletoAlumno();

			jsonCompletoAlumno.EntidadNacimiento = campo

			let JSONentidadNacimiento = JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

			this.requestUpdate(JSONentidadNacimiento);

			break;
			case "curp":
				jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
				jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
				this.deleteItemsJSONcompletoAlumno();

				jsonCompletoAlumno.CURP = campo;

				let JSONCurp= JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

				this.requestUpdate(JSONCurp);
			break;
			case "correo":
				jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
				jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
				this.deleteItemsJSONcompletoAlumno();

				jsonCompletoAlumno.eMailParticular = campo;

				let JSONcorreo= JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

				this.requestUpdate(JSONcorreo);
			break;
			case "telefono":
				jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
				jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
				this.deleteItemsJSONcompletoAlumno();

				jsonCompletoAlumno.TelefonoParticular = campo;

				let JSONtelefono= JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

				this.requestUpdate(JSONtelefono);
			break;
			case "telefonoFijo":
				jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
				jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
				this.deleteItemsJSONcompletoAlumno();

				jsonCompletoAlumno.TelefonoMovil = campo;

				let JSONtelefonoFijo= JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

				this.requestUpdate(JSONtelefonoFijo);
			break;
			case "observaciones":
				jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
				jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
				this.deleteItemsJSONcompletoAlumno();

				jsonCompletoAlumno.Observaciones = campo

				let JSONobservaciones = JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

				this.requestUpdate(JSONobservaciones);
			break;
			case "direccion":
				jsonCompletoAlumno.UsuarioWeb = localStorage.getItem("usuario")
				jsonCompletoAlumno.Alumno = localStorage.getItem("usuarioActual")
				this.deleteItemsJSONcompletoAlumno();

				jsonCompletoAlumno.Direccion = campo;
				jsonCompletoAlumno.Colonia = this.state.Colonia;
				jsonCompletoAlumno.Poblacion = this.state.Poblacion;
				jsonCompletoAlumno.CodigoPostal = this.state.CodigoPostal;
				jsonCompletoAlumno.DireccionNumero = this.state.DireccionNumero;
				jsonCompletoAlumno.DireccionNumeroInt = this.state.DireccionNumeroInt;
				jsonCompletoAlumno.Estado = this.state.Estado;

				let JSONDireccion= JSON.parse(JSON.stringify(jsonCompletoAlumno).replace(/null/g, '""'))

				this.requestUpdate(JSONDireccion);
			break;
			case "paisSecundaria":
					this.setState({
						lugarSecundaria:campo,
						openModalOptions:false,

					})

			break;
			case "estadoSecundaria":
					this.setState({
						lugarSecundaria:campo,
						openModalOptions:false,
					})
			break;
			case "paisPreparatoria":
				this.setState({
					lugarPreparatoria:campo,
					openModalOptions:false
				})
			break;
			case "estadoPreparatoria":
					this.setState({
						lugarPreparatoria:campo,
						openModalOptions:false
					})
			break;
			case "paisUniversidad":
				this.setState({
					lugarUniversidad:campo,
					openModalOptions:false
				})
			break;
			case "estadoUniversidad":
				this.setState({
					lugarUniversidad:campo,
					openModalOptions:false
				})
			break;

			default:

			}
	}

	requestUpdate(JSON){
		this.props.visibleLoaderAction(true);
		manager.postData(routes.UPDATE_CAMPOS,JSON)
		.then(response => {
			this.props.visibleLoaderAction(false);
			this.setState({
				openModalOptions:false
			})
			swal("Correcto !","ok", "success");

			this.handleClickDoc()
		})
		.catch(error =>{
			this.props.visibleLoaderAction(false);
			swal("Oops!", error.Mensaje , "error");
		})

	}

	requestAplica(e,documento){
		this.props.visibleLoaderAction(true);
		manager.postData(routes.spWebAlumnoDocActualizar,  {"Alumno": localStorage.getItem("usuarioActual"), "Documento" :documento , "Estatus": e.target.value} )
		.then(response => {
			this.props.visibleLoaderAction(false);
			this.setState({
				openModalOptions:false
			})
			swal("Correcto !","ok", "success");
			this.getDocumentos();
		})
		.catch(error =>{
			this.props.visibleLoaderAction(false);
			swal("Oops!", error.Mensaje , "error");
		})

	}


	//CAMBIANDO CURP
	handleChangeCurp(event){
		this.setState({
			Curp: event.target.value,
			changeCurp: true

		});
	}

	//CAMBIANDO CORREO
	handleChangeCorreo(event){
		this.setState({
			correo: event.target.value,
			changeCorreo: true

		});
	}

	//CAMBIANDO TELFONO
	handleChangeTelefono(event){
		this.setState({
			telefono: event.target.value,
			changeTelefono: true

		});
	}

	//CAMBIAR TELEFONO FIJO
	handleChangeTelefonoFijo(event){
		this.setState({
			telefonoFijo: event.target.value,
			changeTelefonoFijo: true

		});
	}

	//CAMBIAR SECUNDARIA
	handleChangeSecundaria(event){
		this.setState({
			secuProcedencia: event.target.value,
			changeSecundaria: true

		});
	}

	//CAMBIAR PREPARATORIA
	handleChangePreparatoria(event){
		this.setState({
			prepaProcedencia: event.target.value,
			changePreparatoria: true

		});
	}

	//CAMBIAR UNIVERSIDAD
	handleChangeUniversidad(event){
		this.setState({
			uniProcedencia: event.target.value,
			changeUniversidad: true

		});
	}

	//CAMBIANDO OBSERVACIONES
	handleChangeObservaciones(event){
		this.setState({
			observaciones: event.target.value.toUpperCase(),
			changeObservaciones: true

		});
	}

	handleConfirmar(){
		this.props.visibleLoaderAction(true);
        manager.postData(routes.CURP_DATOS,{"CURP ":this.state.Curp})
        .then(response => {
			var fecha =  response[0].FechaNacimiento
			var nacimiento = moment(fecha).format('L');
			moment.locale(nacimiento);
			var dob = new Date(fecha);
			//calculate month difference from current date in time
			var month_diff = Date.now() - dob.getTime();
			//convert the calculated difference in date format
			var age_dt = new Date(month_diff);
			//extract year from date
			var year = age_dt.getUTCFullYear();
			//now calculate the age of the user
			var age = Math.abs(year - 1970);
			//display the calculated age
			console.log("EDAD REAL: " + age);
			//const options = { year: 'numeric' };
            this.setState({
				fechaNacimientoCURP:nacimiento,
				sexoCURP:response[0].Genero,
				entidadCURP:response[0].EntidadNacimiento,
				edadCURP:age,
				openModalConfirmarCurp:true,
            })
            this.props.visibleLoaderAction(false);
        })
        .catch(error =>{
            swal("Oops!", error.Mensaje , "error");
            this.props.visibleLoaderAction(false);
        })
	}


	//CAMBIANDO DIRECCION
	handleChangeDireccion= (event) => {
		this.setState({
			[event.target.name]: event.target.value,
			changeDireccion: true
		});
	}

	handleConfirmarDireccion(){
		this.setState({
			openModalConfirmarDireccion:true,
		})
	}

	handleConfirmarObservaciones(){
		this.setState({
			openModalConfirmarObservaciones:true,
		})
	}

	handleChange = (e) => {
		this.setState({[e.target.name]: e.target.value});
	}

	handleChangeCarrera = (e) => {
		this.setState({
			carrera: e.target.value,
		});
	}


	openModalConfig(){
		this.setState({
			openModalConfig:true,
		})
	}

	closeModalConfig = (state) => {
		this.setState({
			openModalConfig: state
		});
	}

	
	openModalEdit(){
		this.setState({
			openModalEdit:true,
		})
	}

	closeModalEdit = (state) => {
		this.setState({
			openModalEdit: state
		});
	}

	handleClose = (state) => {
		this.setState({showModalDireccion:state});
	}

	direccionModal = (obj) => {

		this.setState({
			'Colonia': obj.Colonia,
			'CodigoPostal': obj.CodigoPostal,
			'Poblacion': obj.Delegacion,
			'Estado': obj.Estado,
			changeDireccion: true
		});
	}

	clearInputs = () => {
		this.setState({
			'busqueda': "",
			'carrera': "",
		});

	}

	//CHECK SECUNDARIA EXTRANJERO
	handleChangeCheckSecundaria(){
		this.setState({
			secundariaExtranjeroCheck: (this.state.secundariaExtranjeroCheck === true) ? false : true
		})
	}

	//CHECK PREPARATORIA EXTRANJERO
	handleChangeCheckPreparatoria(){
		this.setState({
			preparatoriaExtranjeroCheck: (this.state.preparatoriaExtranjeroCheck === true) ? false : true
		})
	}

	//CHECK UNIVERSIDAD EXTRANJERO
	handleChangeCheckUniversidad(){
		this.setState({
			universidadExtranjeroCheck: (this.state.universidadExtranjeroCheck === true) ? false : true
		})
	}

	setNewCiclo(cicloNew, fechaNew){
		var fechaNewFormat = moment(fechaNew).format('L');
		moment.locale(fechaNewFormat);

		this.setState({
			CicloIngreso: cicloNew,		
			anoIngreso:	fechaNewFormat				
		})
	}



render(){
const { fixNavbar } = this.props;
let colorBar = this.state.porcentaje === 100 ? "#33bcd3" : "" ;
let tabla;
		if (this.state.dataTableAlumnos.length > 0) {
			tabla = <Tabla columns={this.state.columnsAlumnos} data={this.state.dataTableAlumnos} titulo={"Lista Alumnos"}/>
		} else {
			tabla =
				<div className="table-responsive m-3">
					<div >Sin Información</div>
				</div>
		}


let subir;

if(this.state.file !== null){
	subir =
			<React.Fragment>
				<button type="button" className="btn btn-primary" onClick={() => this.filesUpload(true)}>
					Subir
				</button>
			</React.Fragment>
}else{
	subir =
		<React.Fragment>
			<button type="button" disabled>
				Subir
			</button>
		</React.Fragment>
}


return(

<>

<div>
	<div>
		<div className={`section-body ${fixNavbar ? "marginTop" : ""} `}>
			<div className="container-fluid">
			{ (this.state.caseDocumentos === true) ?
			<>

				<ModalEdit
						mostrar={this.state.openModalEdit}
						isShow={this.closeModalEdit.bind(this)}
						alumno={this.state.alumnoID}
						newCiclo={this.setNewCiclo.bind(this)}
					/>
				<div className="d-flex justify-content-between align-items-center mb-3">
					<ul className="nav nav-tabs page-header-tab">
						<li className="nav-item">
							<p
								className="nav-link"
								onClick={this.handleClickAll}>
							Todos
							</p>
						</li>
					</ul>
				</div>

				<div className="row clearfix">
					
					<div className="col-lg-12 col-md-12">
						<ul className="list-group mb-3">
							<li className="list-group-item">
								<div className="row">
									<div className="card-header">
										<p onClick={(e) => this.downloadPdfResumen(e)} className="btn btn-light  text-dark">PDF Resumen de Expediente<i className="ml-1 fa fa-print"></i></p>
									</div>
								</div>
								<div className="row mt-1">
									<div className="col-lg-12 col-md-12">
										<div className="ALTOia-body">
											<center><h5 className="m-0 mb-2">{this.state.nombre}</h5></center>
											<center><p className="text-muted mb-0">{this.state.licenciatura.replace("UW","")}</p></center>
										</div>
									</div>	{/*
									<div className="col-lg-6 col-md-12 text-right">
									{(this.state.genero === "Masculino") ?
										<img
											className="rounded mr-3 mb-3"
											src="../assets/images/xs/avatar2.jpg"
											alt="fake_url"
										/>
										:
										<img
											className="rounded mr-3 mb-3"
											src="../assets/images/xs/avatar3.jpg"
											alt="fake_url"
										/>
									}
									</div>
									*/}
								</div>
							</li>
							<li className="list-group-item">
								<center>
								<div className="row mt-2">
									<div className="col-lg-3 col-md-12">
										<h6 className="m-0">MATRICULA</h6>
										<p className="mb-0">{this.state.matricula}</p>
									</div>
									<div className="col-lg-3 col-md-12">
										<h6 className="m-0">FECHA DE INGRESO</h6>
										<p className="mb-0">{this.state.anoIngreso}</p>
									</div>
									<div className="col-lg-3 col-md-12">
										<h6 className="m-0">CICLO INGRESO</h6>
										<p className="mb-0">{this.state.CicloIngreso}</p>								
										<i className="fa fa-edit" onClick={this.openModalEdit.bind(this)}/>										
									</div>
									<div className="col-lg-3 col-md-12">
										<h6 className="m-0">CICLO ACTUAL</h6>
										<p className="mb-0">{this.state.CicloCursa}</p>
									</div>
								</div>
								</center>
							</li>
							<li className="list-group-item">
								<div className="row">
									{
										(this.state.changeCurp === true) ?
										<div className="col-lg-2 col-md-5">
											<small className="text-muted">CURP: </small>
											<input maxlength="18" type="text" class="form-control" id="inlineFormInputName" value={this.state.Curp} onChange={this.handleChangeCurp.bind(this)}/>
										</div>:
										<div className="col-lg-3 col-md-5">
											<small className="text-muted">CURP: </small>
											<input maxlength="18" type="text" class="form-control" id="inlineFormInputName" value={this.state.Curp} onChange={this.handleChangeCurp.bind(this)}/>
										</div>
									}

									{
										(this.state.changeCurp === true) ?
										<div className="col-lg-1 col-md-1" style={{marginTop: "29px"}}>
											<span className="input-group-addon">
												<i style={{fontSize: "25px", color:"#33bcd3"}} className="icon-check" onClick={this.handleConfirmar.bind(this)}></i>
											</span>
										</div>
										:
										<></>
									}
									{
										(this.state.changeCorreo === true) ?
										<div className="col-lg-2 col-md-12">
											<small className="text-muted">CORREO: </small>
											<input  type="text" class="form-control" id="inlineFormInputName" value={this.state.correo} onChange={this.handleChangeCorreo.bind(this)}/>
										</div>	:
										<div className="col-lg-3 col-md-12">
											<small className="text-muted">CORREO: </small>
											<input  type="text" class="form-control" id="inlineFormInputName" value={this.state.correo} onChange={this.handleChangeCorreo.bind(this)}/>
										</div>
									}

									{(this.state.changeCorreo === true) ?
										<div className="col-lg-1 col-md-1" style={{marginTop: "29px"}}>
											<span className="input-group-addon">
												<i style={{fontSize: "25px", color:"#33bcd3"}} className="icon-check" onClick={this.handleConfirmarCorreo.bind(this)}></i>
											</span>
										</div>
										:
										<></>
									}
									{
											(this.state.changeTelefono === true) ?
											<div className="col-lg-2 col-md-12">
												<small className="text-muted">TELEFONO PARTICULAR</small>
												<input  type="text" class="form-control" id="inlineFormInputName" value={this.state.telefono} onChange={this.handleChangeTelefono.bind(this)}/>
											</div>		:
											<div className="col-lg-3 col-md-12">
												<small className="text-muted">TELEFONO PARTICULAR</small>
												<input  type="text" class="form-control" id="inlineFormInputName" value={this.state.telefono} onChange={this.handleChangeTelefono.bind(this)}/>
											</div>
									}
									{
										(this.state.changeTelefono === true) ?
										<div className="col-lg-1 col-md-1" style={{marginTop: "29px"}}>
											<span className="input-group-addon">
												<i style={{fontSize: "25px", color:"#33bcd3"}} className="icon-check" onClick={this.handleConfirmarTelefono.bind(this)}></i>
											</span>
										</div>
										:
										<></>
									}
									{
											(this.state.changeTelefonoFijo === true) ?
											<div className="col-lg-2 col-md-12">
												<small className="text-muted">CELULAR</small>
												<input  type="text" class="form-control" id="inlineFormInputName" value={this.state.telefonoFijo} onChange={this.handleChangeTelefonoFijo.bind(this)}/>
											</div>		:
											<div className="col-lg-3 col-md-12">
												<small className="text-muted">CELULAR</small>
												<input  type="text" class="form-control" id="inlineFormInputName" value={this.state.telefonoFijo} onChange={this.handleChangeTelefonoFijo.bind(this)}/>
											</div>
									}
									{
										(this.state.changeTelefonoFijo === true) ?
										<div className="col-lg-1 col-md-1" style={{marginTop: "29px"}}>
											<span className="input-group-addon">
												<i style={{fontSize: "25px", color:"#33bcd3"}} className="icon-check" onClick={this.handleConfirmarTelefonoFijo.bind(this)}></i>
											</span>
										</div>
										:
										<></>
									}

								</div>
							</li>
							<li className="list-group-item">
								<div className="row">
									<div className="col-lg-3 col-md-12">
										<small className="text-muted">PLAN: </small>
										<select class="custom-select mr-sm-2"  onClick={ (e) => this.handleTipoList(e,"plan")}>
											{
											(this.state.TipoIngresoInicial === null || this.state.TipoIngresoInicial === "") ?
											<option value="tipoIngreso" >Selecciona ... </option>	:
											<option value="tipoIngreso" >{this.state.CEPlan}</option>
											}
										</select>
									</div>
									<div className="col-lg-3 col-md-12">
										<small className="text-muted">TIPO DE INGRESO: </small>
										<select class="custom-select mr-sm-2"  onClick={ (e) => this.handleTipoList(e,"tipoIngreso")}>
											{
											(this.state.TipoIngresoInicial === null || this.state.TipoIngresoInicial === "") ?
											<option value="tipoIngreso"  >Selecciona ... </option>	:
											<option value="tipoIngreso" >{this.state.TipoIngresoInicial}</option>
											}
										</select>
									</div>
									<div className="col-lg-3 col-md-12">
										<small className="text-muted">ESTATUS: </small>
										<select class="custom-select mr-sm-2"  onClick={ (e) => this.handleTipoList(e,"estatus")}>
											{
											(this.state.CEEstatus === null || this.state.CEEstatus === "") ?
											<option value="westhill" >Selecciona ... </option>	:
											<option value="westhill" >{this.state.CEEstatus}</option>
											}
										</select>
									</div>
									<div className="col-lg-3 col-md-12">
										<small className="text-muted">CONTINUIDAD </small>
										<select class="custom-select mr-sm-2"  onClick={ (e) => this.handleTipoList(e,"continuidad")}>
											{
											(this.state.continuidad === null || this.state.continuidad === "") ?
											<option value="westhill" >Selecciona ... </option>	:
											<option value="westhill" >{this.state.continuidad}</option>
											}
										</select>
									</div>
								</div>
							</li>
							<li className="list-group-item">
								<div className="row">
								{
									(this.state.changeObservaciones === true) ?
									<div className="col-lg-11 col-md-12">
										<small className="text-muted">OBSERVACIONES </small>
										<textarea  class="md-textarea form-control" name="mensaje" value={this.state.observaciones} onChange={this.handleChangeObservaciones.bind(this)}></textarea>
									</div>		:
									<div className="col-lg-12 col-md-12">
										<small className="text-muted">OBSERVACIONES </small>
										<textarea  class="md-textarea form-control" name="mensaje" value={this.state.observaciones} onChange={this.handleChangeObservaciones.bind(this)}></textarea>
									</div>
								}
								{
									(this.state.changeObservaciones === true) ?
									<div className="col-lg-1 col-md-1" style={{marginTop: "29px"}}>
										<span className="input-group-addon">
											<i style={{fontSize: "25px", color:"#33bcd3"}} className="icon-check" onClick={this.handleConfirmarObservaciones.bind(this)}></i>
										</span>
									</div>
									:
									<></>
								}
								</div>
							</li>
							<li className="list-group-item">
								<div className="row">
									{/*
									<div className="col-lg-4 col-md-12">
										<small className="text-muted">NACIONALIDAD: </small>
										<select class="custom-select mr-sm-2"  onClick={ (e) => this.handleTipoList(e,"nacionalidad")}>
											{
											(this.state.Nacionalidad === null || this.state.Nacionalidad === "" ) ?
											<option value="westhill" >Selecciona ... </option>	:
											<option value="westhill" >{this.state.Nacionalidad}</option>
											}
										</select>
									</div>	*/}
									<div className="col-lg-4 col-md-12">
										<small className="text-muted">PAIS: </small>
										<select class="custom-select mr-sm-2"  onClick={ (e) => this.handleTipoList(e,"pais")}>
											{
											(this.state.PaisOrigen === null || this.state.PaisOrigen === "") ?
											<option value="westhill" >Selecciona ... </option>	:
											<option value="westhill" >{this.state.PaisOrigen}</option>
											}
										</select>
									</div>
									<div className="col-lg-4 col-md-12">
										<small className="text-muted">ESTADO: </small>
										<select class="custom-select mr-sm-2"  onClick={ (e) => this.handleTipoList(e,"estado")}>
											{
											(this.state.EntidadNacimiento === null || this.state.EntidadNacimiento === "") ?
											<option value="westhill" >Selecciona ... </option>	:
											<option value='EntidadNacimiento' >{this.state.EntidadNacimiento}</option>
											}
										</select>
									</div>
									<div className="col-lg-4 col-md-12">
										<small className="text-muted">EXTRANJERO: </small>
											<div class="input-group-text">
												{this.state.checkExtrangero }
											</div>	
									</div>
									{/*
									<div className="col-lg-3 col-md-12">
										<small className="text-muted">FOLIO DE ACTA DE NACIMIENTO: </small>
										<input type="text" class="form-control" id="inlineFormInputName"/>
									</div>		*/}
								</div>
									<center><h6 className="mt-4">PROCEDENCIA ACADÉMICA</h6></center>
									{/*SECUNDARIA DE PROCEDENCIA */}
								<div className="row mt-4">
									{
										(this.state.changeSecundaria === true) ?
										<div className="col-lg-4 col-md-12">
											<small className="text-muted">SECUNDARIA DE PROCEDENCIA </small>
											<input  type="text" class="form-control" id="inlineFormInputName" value={this.state.secuProcedencia} placeholder={(this.state.secuProcedencia ==="N/A" || this.state.secuProcedencia === null )?"Escribe el nombre de la escuela": this.state.secuProcedencia} onChange={this.handleChangeSecundaria.bind(this)}/>
										</div> :
										(this.state.secundariaNA==="N/A")?
										<div className="col-lg-5 col-md-12">
											<small className="text-muted">SECUNDARIA DE PROCEDENCIA </small>
											<input  disabled type="text" class="form-control" id="inlineFormInputName" value={(this.state.secundariaNA==="N/A")? this.state.secundariaNA :this.state.secuProcedencia} placeholder={(this.state.secuProcedencia ==="N/A" || this.state.secuProcedencia === null )?"Escribe el nombre de la escuela": this.state.secuProcedencia} onChange={this.handleChangeSecundaria.bind(this)}/>
										</div>:
										(this.state.secundariaNO==="NO")?
										<div className="col-lg-5 col-md-12">
											<small className="text-muted">SECUNDARIA DE PROCEDENCIA </small>
											<input type="text" class="form-control" id="inlineFormInputName" value={(this.state.secundariaNO==="NO")? "FALTA DOCUMENTO" :this.state.secuProcedencia} placeholder={(this.state.secuProcedencia ==="NO" || this.state.secuProcedencia === null )?"Escribe el nombre de la escuela": this.state.secuProcedencia} onChange={this.handleChangeSecundaria.bind(this)}/>
										</div>:
										<div className="col-lg-5 col-md-12">
											<small className="text-muted">SECUNDARIA DE PROCEDENCIA </small>
											<input  type="text" class="form-control" id="inlineFormInputName" value={this.state.secuProcedencia} placeholder={(this.state.secuProcedencia ==="N/A" || this.state.secuProcedencia === null )?"Escribe el nombre de la escuela": this.state.secuProcedencia} onChange={this.handleChangeSecundaria.bind(this)}/>
										</div>
									}
									{
										(this.state.secundariaNA==="N/A") ?
										<div className="col-lg-2 col-md-12">
											<small className="text-muted">EXTRANJERO: </small>
											<div class="input-group-text">
												<input disabled="true" style={{height: "20px"}} type="checkbox" aria-label="Checkbox for following text input" onChange={this.handleChangeCheckSecundaria.bind(this)}/>
											</div>
										</div>:
										<div className="col-lg-2 col-md-12">
											<small className="text-muted">EXTRANJERO: </small>
											<div class="input-group-text">
												<input style={{height: "20px"}} type="checkbox" aria-label="Checkbox for following text input" onChange={this.handleChangeCheckSecundaria.bind(this)}/>
											</div>
										</div>
									}

									{(this.state.secundariaExtranjeroCheck === true)?
									<div className="col-lg-5 col-md-12">
										<small className="text-muted">PAIS: </small>
										{(this.state.secundariaNA ==="N/A")?
										<select class="custom-select mr-sm-2" disabled>
												<option> {this.state.secundariaNA } </option>
										</select>	:
										<select class="custom-select mr-sm-2"  onClick={ (e) => this.handleTipoList(e,"paisSecundaria")}>
											{
											(this.state.lugarSecundaria === null || this.state.lugarSecundaria === "") ?
											<option value="westhill" >Selecciona ... </option>	:
											<option value="lugarSecundaria" >{
												(this.state.secundariaNA ==="N/A")?this.state.secundariaNA:
												this.state.lugarSecundaria}</option>
											}
										</select>
										}
									</div>:
									<div className="col-lg-5 col-md-12">
										<small className="text-muted">ESTADO: </small>
										{(this.state.secundariaNA ==="N/A")?
										<select class="custom-select mr-sm-2"  disabled>
												<option value="westhill" >{this.state.secundariaNA}</option>
										</select>
										:
										<select class="custom-select mr-sm-2"  onClick={ (e) => this.handleTipoList(e,"estadoSecundaria")}>
											{
											(this.state.lugarSecundaria === null || this.state.lugarSecundaria === "") ?
											<option value="westhill" >Selecciona ... </option>	:
											<option value='lugarSecundaria' >{
												(this.state.secundariaNA ==="N/A")?this.state.secundariaNA:
												(this.state.secundariaNO ==="NO")?"FALTA DOCUMENTO":
												this.state.lugarSecundaria}</option>

											}
										</select>
										}

									</div>
									}
									{
										(this.state.changeSecundaria === true) ?
										<div className="col-lg-1 col-md-1" style={{marginTop: "29px"}}>
											<span className="input-group-addon">
												<i style={{fontSize: "25px", color:"#33bcd3"}} className="icon-check" onClick={this.handleConfirmarSecundaria.bind(this)}></i>
											</span>
										</div>
										:
										<></>
									}
								</div>
								{/*PREPARATORIA DE PROCEDENCIA */}
								<div className="row mt-4">
									{
									(this.state.changePreparatoria === true) ?
										<div className="col-lg-4 col-md-12">
											<small className="text-muted">PREPARATORIA DE PROCEDENCIA </small>
											<input  type="text" class="form-control" id="inlineFormInputName" value={this.state.prepaProcedencia} placeHolder={(this.state.prepaProcedencia === "N/A" || this.state.prepaProcedencia === null)?"Escribir Escuela": this.state.prepaProcedencia } onChange={this.handleChangePreparatoria.bind(this)}/>
										</div>		:
										(this.state.preparatoriaNA==="N/A")?
										<div className="col-lg-5 col-md-12">
											<small className="text-muted">PREPARATORIA DE PROCEDENCIA </small>
											<input disabled type="text" class="form-control" id="inlineFormInputName" value={(this.state.preparatoriaNA ==="N/A")? this.state.preparatoriaNA : this.state.prepaProcedencia} onChange={this.handleChangePreparatoria.bind(this)}/>
										</div>:
										(this.state.preparatoriaNO==="NO")?
										<div className="col-lg-5 col-md-12">
											<small className="text-muted">PREPARATORIA DE PROCEDENCIA </small>
											<input type="text" class="form-control" id="inlineFormInputName" value={(this.state.preparatoriaNO ==="NO")? "FALTA DOCUMENTO" : this.state.prepaProcedencia} onChange={this.handleChangePreparatoria.bind(this)}/>
										</div>:
										<div className="col-lg-5 col-md-12">
											<small className="text-muted">PREPARATORIA DE PROCEDENCIA </small>
											<input  type="text" class="form-control" id="inlineFormInputName" value={this.state.prepaProcedencia} placeHolder={(this.state.prepaProcedencia === "N/A" || this.state.prepaProcedencia === null)?"Escribir Escuela": this.state.prepaProcedencia } onChange={this.handleChangePreparatoria.bind(this)}/>
										</div>
									}
									{
										(this.state.preparatoriaNA==="N/A") ?
										<div className="col-lg-2 col-md-12">
											<small className="text-muted">EXTRANJERO: </small>
												<div class="input-group-text">
													<input disabled style={{height: "20px"}} type="checkbox" aria-label="Checkbox for following text input" onChange={this.handleChangeCheckPreparatoria.bind(this)}/>
												</div>
										</div>:
										<div className="col-lg-2 col-md-12">
										<small className="text-muted">EXTRANJERO: </small>
											<div class="input-group-text">
												<input style={{height: "20px"}} type="checkbox" aria-label="Checkbox for following text input" onChange={this.handleChangeCheckPreparatoria.bind(this)}/>
											</div>
										</div>
									}
									{(this.state.preparatoriaExtranjeroCheck === true)?
									<div className="col-lg-5 col-md-12">
										<small className="text-muted">PAIS: </small>
										{
										(this.state.preparatoriaNA ==="N/A")?
										<select class="custom-select mr-sm-2" disabled>
												<option> {this.state.preparatoriaNA } </option>
										</select>	:
										<select class="custom-select mr-sm-2"  onClick={ (e) => this.handleTipoList(e,"paisPreparatoria")}>
											{
											(this.state.lugarPreparatoria === null || this.state.lugarPreparatoria === "") ?
											<option value="westhill" >Selecciona ... </option>	:
											<option value="lugarPreparatoria" >{(this.state.preparatoriaNA ==="N/A")?this.state.preparatoriaNA:this.state.lugarPreparatoria}</option>
											}
										</select>
										}
									</div>:
									<div className="col-lg-5 col-md-12">
										<small className="text-muted">ESTADO: </small>
										{
										(this.state.preparatoriaNA ==="N/A")?
										<select class="custom-select mr-sm-2" disabled>
												<option> {this.state.preparatoriaNA } </option>
										</select>	:
										<select class="custom-select mr-sm-2"  onClick={ (e) => this.handleTipoList(e,"estadoPreparatoria")}>
											{
											(this.state.lugarPreparatoria === null || this.state.lugarPreparatoria === "") ?
											<option value="westhill" >Selecciona ... </option>	:
											<option value='lugarPreparatoria' >{
												(this.state.preparatoriaNA ==="N/A")?this.state.preparatoriaNA:
												(this.state.preparatoriaNO ==="NO")?"FALTA DOCUMENTO":
												this.state.lugarPreparatoria}</option>
											}
										</select>
										}
									</div>
									}
									{
										(this.state.changePreparatoria === true) ?
										<div className="col-lg-1 col-md-1" style={{marginTop: "29px"}}>
											<span className="input-group-addon">
												<i style={{fontSize: "25px", color:"#33bcd3"}} className="icon-check" onClick={this.handleConfirmarPreparatoria.bind(this)}></i>
											</span>
										</div>
										:
										<></>
									}
								</div>
								{/*UNIVERSIDAD DE PROCEDENCIA */}
								<div className="row mt-4">
									{
										(this.state.changeUniversidad === true) ?
										<div className="col-lg-4 col-md-12">
											<small className="text-muted">UNIVERSIDAD DE PROCEDENCIA </small>
											<input  type="text" class="form-control" id="inlineFormInputName" value={ this.state.uniProcedencia} onChange={this.handleChangeUniversidad.bind(this)}/>
										</div>		:
										(this.state.universidadNA==="N/A")?
										<div className="col-lg-5 col-md-12">
											<small className="text-muted">UNIVERSIDAD DE PROCEDENCIA </small>
											<input disabled type="text" class="form-control" id="inlineFormInputName" value={(this.state.universidadNA ==="N/A")? this.state.universidadNA : this.state.uniProcedencia} onChange={this.handleChangeUniversidad.bind(this)}/>
										</div>:
										(this.state.universidadNO==="NO")?
										<div className="col-lg-5 col-md-12">
											<small className="text-muted">UNIVERSIDAD DE PROCEDENCIA </small>
											<input type="text" class="form-control" id="inlineFormInputName" value={(this.state.universidadNO ==="NO")? "FALTA DOCUMENTO": this.state.uniProcedencia} onChange={this.handleChangeUniversidad.bind(this)}/>
										</div>:
										<div className="col-lg-5 col-md-12">
											<small className="text-muted">UNIVERSIDAD DE PROCEDENCIA </small>
											<input  type="text" class="form-control" id="inlineFormInputName" value={(this.state.universidadNA ==="N/A")? this.state.universidadNA : this.state.uniProcedencia} placeHolder={(this.state.uniProcedencia === "N/A" || this.state.uniProcedencia === null)?"Escribir Escuela": this.state.uniProcedencia } onChange={this.handleChangeUniversidad.bind(this)}/>
										</div>
									}
									{
										(this.state.universidadNA==="N/A") ?
										<div className="col-lg-2 col-md-12">
											<small className="text-muted">EXTRANJERO: </small>
											<div class="input-group-text">
												<input  disabled style={{height: "20px"}} type="checkbox" aria-label="Checkbox for following text input"  onChange={this.handleChangeCheckUniversidad.bind(this)}/>
											</div>
										</div>:
										<div className="col-lg-2 col-md-12">
											<small className="text-muted">EXTRANJERO: </small>
											<div class="input-group-text">
												<input style={{height: "20px"}} type="checkbox" aria-label="Checkbox for following text input"  onChange={this.handleChangeCheckUniversidad.bind(this)}/>
											</div>
										</div>
									}

									{(this.state.universidadExtranjeroCheck === true)?
									<div className="col-lg-5 col-md-12">
										<small className="text-muted">PAIS: </small>
										{
										(this.state.universidadNA ==="N/A")?
										<select class="custom-select mr-sm-2" disabled>
												<option> {this.state.universidadNA } </option>
										</select>	:
										<select class="custom-select mr-sm-2" onClick={ (e) => this.handleTipoList(e,"paisUniversidad")}>
											{
											(this.state.lugarUniversidad === null || this.state.lugarUniversidad === "") ?
											<option value="westhill" >Selecciona ... </option>	:
											<option value='lugarUniversidad' >{(this.state.universidadNA ==="N/A")?this.state.universidadNA:this.state.lugarUniversidad}</option>
											}
										</select>
										}
									</div>:
									<div className="col-lg-5 col-md-12">
										<small className="text-muted">ESTADO: </small>
										{
										(this.state.universidadNA ==="N/A")?
										<select class="custom-select mr-sm-2" disabled>
												<option> {this.state.universidadNA } </option>
										</select>	:
										<select class="custom-select mr-sm-2"  onClick={ (e) => this.handleTipoList(e,"estadoUniversidad")}>
											{
											(this.state.lugarUniversidad === null || this.state.lugarUniversidad === "") ?
											<option value="westhill" >Selecciona ... </option>	:
											<option value='lugarUniversidad' >{
												(this.state.universidadNA ==="N/A")?this.state.universidadNA:
												(this.state.universidadNO ==="NO")?"FALTA DOCUMENTO":
												this.state.lugarUniversidad}</option>
											}
										</select>
										}
									</div>
									}

									{
										(this.state.changeUniversidad === true) ?
										<div className="col-lg-1 col-md-1" style={{marginTop: "29px"}}>
											<span className="input-group-addon">
												<i style={{fontSize: "25px", color:"#33bcd3"}} className="icon-check" onClick={this.handleConfirmarUniversidad.bind(this)}></i>
											</span>
										</div>
										:
										<></>
									}
								</div>
							</li>
							<li className="list-group-item">
								<center><h5 className="mt-3 mb-3">DIRECCIÓN</h5></center>
								<div className="row">
									<div className="col-3">
										<small className="text-muted"> CALLE: </small>
										<input type="text" class="form-control" id="inlineFormInputName" value={this.state.Direccion}  name={"Direccion"} onChange={(e) => this.handleChangeDireccion(e)}/>
									</div>
									<div className="col-3">
										<small className="text-muted"> COLONIA: </small>
										<input type="text" class="form-control" id="inlineFormInputName" value={this.state.Colonia}  name={"Colonia"}  onChange={(e) => this.handleChangeDireccion(e)}/>
									</div>
									<div className="col-3">
										<small className="text-muted"> DELEGACIÓN O MUNICIPIO: </small>
										<input type="text" class="form-control" id="inlineFormInputName" value={this.state.Poblacion}  name={"Poblacion"} onChange={(e) => this.handleChangeDireccion(e)}/>
									</div>
									<div className="col-3">
										<small className="text-muted"> C.P.: </small>
										<input type="text" class="form-control" id="inlineFormInputName" value={this.state.CodigoPostal} name={"CodigoPostal"}  onChange={(e) => this.handleChangeDireccion(e)}/>
									</div>
									<div className="col-3">
										<small className="text-muted"> N. EXTERIOR: </small>
										<input type="text" class="form-control" id="inlineFormInputName" value={this.state.DireccionNumero}  name={"DireccionNumero"} onChange={(e) => this.handleChangeDireccion(e)}/>
									</div>
									<div className="col-3">
										<small className="text-muted"> N. INTERIOR: </small>
										<input type="text" class="form-control" id="inlineFormInputName" value={this.state.DireccionNumeroInt}  name={"DireccionNumeroInt"} onChange={(e) => this.handleChangeDireccion(e)}/>
									</div>
									<div className="col-3">
										<small className="text-muted"> ESTADO: </small>
										<input type="text" class="form-control" id="inlineFormInputName" value={this.state.Estado}  name={"Estado"} onChange={(e) => this.handleChangeDireccion(e)}/>
									</div>
									{(this.state.changeDireccion === true) ?
										<div className="col-lg-1 col-md-1" style={{marginTop: "29px"}}>
											<span className="input-group-addon">
												<i style={{fontSize: "25px", color:"#33bcd3"}} className="icon-check" onClick={this.handleConfirmarDireccion.bind(this)}></i>
											</span>
										</div>
										:
										<></>
									}
									<div className="col-lg-1 col-md-1" style={{marginTop: "29px"}}>
										<span className="input-group-addon">
											<i style={{fontSize: "25px", color:"#33bcd3"}} className="icon-magnifier" onClick={() => this.handleClose(true)}></i>
										</span>
									</div>
								</div>
							</li>
							<li className="list-group-item">
								<div>Porcentaje de Documentación :  { " "+ this.state.porcentaje + " %"} </div>
								<div className="progress progress-xs mt-2 mb-3">
									<div
										className="progress-bar"
										data-transitiongoal={this.state.porcentaje}
										aria-valuenow={this.state.porcentaje}
										style={{ width: `${ this.state.porcentaje }%` ,  background: colorBar }}
									/>
								</div>
							</li>
						</ul>
					</div>
					<div className="col-12">
						<div className="row">
							<div className="col-12">
								<div className="card">
									<div className="card-body">
										<TablaDocuentos headers={this.state.headersDocumentos} data={this.state.dataDocumentos} />
									</div>
								</div>
							</div>
						</div>
					</div>
			</div>
			<PDFresumenExpediente cambiandoEstadoDescargar={this.estadoDescargaResumen.bind(this)} descargar={this.state.descargarResumenPdf} alumnoResumen={this.state.arrayPDFresumenAcademico} alumnoNombreyMatricula={this.state.arrayPDFreumenNombreyMatricula} licenciatura={this.state.licenciatura}/>
			<ModalOptionsList mostrar={this.state.openModalOptions} isShow={this.manejarCloseOptions.bind(this)} dataList={this.state.listData}/>
			<ModalConfirmarCurp mostrar={this.state.openModalConfirmarCurp} isShow={this.manejarCloseConfirmarCurp.bind(this)} campoCambiadoCurp={this.state.Curp} mandarNew={this.tipoIngresoSelected.bind(this)} FechaNacimiento={this.state.fechaNacimientoCURP} Genero={this.state.sexoCURP} entidad={this.state.entidadCURP} Edad={this.state.edadCURP} actualizarEntidad={this.handleActualizaEntidad.bind(this)}/>
			<ModalConfirmarCorreo mostrar={this.state.openModalConfirmarCorreo} isShow={this.manejarCloseConfirmarCorreo.bind(this)} campoCambiadoCorreo={this.state.correo}  mandarNew={this.tipoIngresoSelected.bind(this)} />
			<ModalConfirmarTelefono mostrar={this.state.openModalConfirmarTelefono} isShow={this.manejarCloseConfirmarTelefono.bind(this)} campoCambiadoTelefono={this.state.telefono} mandarNew={this.tipoIngresoSelected.bind(this)}  />
			<ModalConfirmarTelefonoFijo mostrar={this.state.openModalConfirmarTelefonoFijo} isShow={this.manejarCloseConfirmarTelefonoFijo.bind(this)} campoCambiadoTelefonoFijo={this.state.telefonoFijo} mandarNew={this.tipoIngresoSelected.bind(this)}  />
			<ModalConfirmarDireccion mostrar={this.state.openModalConfirmarDireccion} isShow={this.manejarCloseConfirmarDireccion.bind(this)} campoCambiadoDireccion={this.state.Direccion} mandarNew={this.tipoIngresoSelected.bind(this)} />
			<ModalConfirmarObservaciones mostrar={this.state.openModalConfirmarObservaciones} isShow={this.manejarCloseConfirmarObservaciones.bind(this)} campoCambiadoObservaciones={this.state.observaciones} mandarNew={this.tipoIngresoSelected.bind(this)} />
			<ModalSecundariaProcedencia mostrar={this.state.openModalSecundaria} isShow={this.manejarCloseSecundaria.bind(this)} secProcedencia={this.state.secuProcedencia} actualizarEscuela={this.updateProcedencia.bind(this)}/>
			<ModalPreparatoriaProcedencia mostrar={this.state.openModalPreparatoria} isShow={this.manejarClosePreparatoria.bind(this)} preProcedencia={this.state.prepaProcedencia} actualizarEscuela={this.updateProcedencia.bind(this)} />
			<ModalUniversidadProcedencia mostrar={this.state.openModalUniversidad} isShow={this.manejarCloseUniversidad.bind(this)} uniProcedencia={this.state.uniProcedencia} actualizarEscuela={this.updateProcedencia.bind(this)}/>
			</>
			:
			(this.state.caseCalificaciones === true) ?
			<>
			<div className="d-flex justify-content-between align-items-center mb-3">
				<ul className="nav nav-tabs page-header-tab">
					<li className="nav-item">
						<p
							className="nav-link"
							onClick={this.handleClickAll}>
							Todos
						</p>
					</li>
				</ul>
			</div>
			<div className="row clearfix">
				<div className="col-lg-12 col-md-12">
					<ul className="list-group mb-3">
						<li className="list-group-item">
							<div className="media mb-0">
								{(this.state.genero === "Masculino") ?
										<img
											className="rounded mr-3 mb-3"
											src="../assets/images/xs/avatar2.jpg"
											alt="fake_url"
										/>
										:
										<img
											className="rounded mr-3 mb-3"
											src="../assets/images/xs/avatar3.jpg"
											alt="fake_url"
										/>
									}
								<div className="media-body">
									<h5 className="m-0">{this.state.nombre}</h5>
									<p className="text-muted mb-0">{this.state.estatus}</p>
								</div>
							</div>
						</li>
						<li className="list-group-item">
							<div className="row">
								<div className="col-lg-4 col-md-12">
									<small className="text-muted">MATRÍCULA </small>
									<p className="mb-0">{this.state.matricula}</p>
								</div>
								<div className="col-lg-4 col-md-12">
									<small className="text-muted">LICENCIATURA </small>
									<p className="mb-0">{this.state.licenciatura.replace("UW","")}</p>
								</div>
								<div className="col-lg-4 col-md-12">
									<small className="text-muted">AÑO INGRESO </small>
									<p className="mb-0">{this.state.anoIngreso}</p>
								</div>
							</div>
						</li>
						<li className="list-group-item">
							<div className="row">
								<div className="col-lg-4 col-md-12">
									<small className="text-muted">PROMEDIO </small>
									<p className="mb-0">{(this.state.promReal === 'NaN')?'No calculado': this.state.promReal}</p>
								</div>
								<div className="col-lg-4 col-md-12">
									<small className="text-muted">AVANCE DE CRÉDITOS </small>
									<p className="mb-0">{this.state.numCreditos} DE {this.state.Creditos}</p>
								</div>
								<div className="col-lg-4 col-md-12">
									<small className="text-muted">ASIGNATURAS </small>
									<p className="mb-0">{this.state.numMaterias} DE {this.state.Materias} </p>
								</div>
							</div>
						</li>
						<li className="list-group-item">
							<div className="row">
								<div className="col-lg-4 col-md-12">
									<small className="text-muted">APROBADAS </small>
									<p className="mb-0">{this.state.aproReal}</p>
								</div>
								<div className="col-lg-4 col-md-12">
									<small className="text-muted">REPROBADAS </small>
									<p className="mb-0">{this.state.reproReal}</p>
								</div>
								<div className="col-lg-4 col-md-12">
									<small className="text-muted">RECURSADAS </small>
									<p className="mb-0">{this.state.materiasRecursadas}</p>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>

			<div className="tab-content">
				<div className="tab-pane fade show active" id="Employee-list" role="tabpanel">
					<div className="card">
						<div className="row">
							<div className="col mt-4 ml-4">
								<p onClick= {(e) => this.downloadPdf(e)}  className="btn btn-light mr-1 text-dark">PDF Historial Académico<i className="ml-1 fa fa-print"></i></p>
							</div>

							{(this.state.curriculums.length > 1) ?
							<div className="col mt-4 ml-4">
									<select
										className="form-control"
										data-placeholder="Buscar..."
										name="curriculum"
										onChange={(e) => this.historialAcademico(e.target.value)}
										value={this.state.curriculum}>
											{this.state.curriculums}
									</select>
							</div>
							:
							<></>}
							<div className="col mt-4 mr-4">
								<p onClick= {(e) => this.downloadPdfCertificado(e)}  className="btn btn-light mr-1 text-dark"style={{display: 'flex',float: 'right'}}>PDF Certificado Académico<i className="ml-1 fa fa-print"></i></p>
							</div>
						</div>
						<div className="card-body">
							<div className="table-responsive">
								<table className="table table-hover table-striped table-vcenter mb-0">
									<thead>
										<tr>
											<th>Clave</th>
											<th>Créditos</th>
											<th>Asignatura</th>
											<th>Calificación</th>
											<th>Tipo</th>
											<th>Periodo</th>
											<th>Grupo</th>
										</tr>
									</thead>
									<tbody>
										{ this.state.dataHistorialTable }
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
				<PDFcalificaciones
					cambiandoEstadoDescarga={this.estadoDescarga.bind(this)}
					descarga={this.state.descargarPdf}
					dataAlumno={this.state.arregloAlumno}
					licenciatura={this.state.licenciatura}
					arrayTablePDF={this.state.arrayToTablePDF}
					ingresoAno={this.state.anoIngreso}
					RVOE={this.state.RVOE}
					DGES={this.state.DGES}
					Fecha={this.state.Fecha}
					Creditos={this.state.Creditos}
					Materias={this.state.Materias}
					PlanEscolar={this.state.PlanEscolar}
					porcentajeCreditos={this.state.porcentajeCreditos}
					ingreso={this.state.ingreso}
				/>
				<PDFcertificado
				cambiandoEstadoDescarga={this.estadoDescargaCertificado.bind(this)}
				descarga={this.state.descargarPdfCertificado}
				dataAlumno={this.state.arregloAlumno}
				licenciatura={this.state.licenciatura}
				arrayTablePDF={this.state.arrayToTablePDF}
				ingresoAno={this.state.anoIngreso}
				RVOE={this.state.RVOE}
				DGES={this.state.DGES}
				Fecha={this.state.Fecha}
				Creditos={this.state.Creditos}
				Materias={this.state.Materias}
				PlanEscolar={this.state.PlanEscolar}
				porcentajeCreditos={this.state.porcentajeCreditos}
				ingreso={this.state.ingreso}
				/>
			</div>
			</>
			:
			<>
				<div className="tab-content">
					<div className="tab-pane fade show active" id="Employee-list" role="tabpanel">
						<div className="card">
							<div className="card-body">
								<div className="col-12">
									<div class="row  mb-2">
										<div class="col-lg-6 col-md-12 float-right mt-2">
											<select
												className="form-control"
												data-placeholder="Choose a color..."
												name="carrera"
												onChange={(e) => this.handleChangeCarrera(e)}
												value={this.state.carrera}>
												{this.state.facultades}
												<option value="">Todas ...</option>
											</select>
										</div>
										<div class="col-lg-3 col-md-6 float-right mt-2">
											<input type="email" class="form-control" id="inlineFormInputName" placeholder="Buscar ..." name="busqueda" value={this.state.busqueda} onChange={(e) => this.handleChange(e)} onKeyDown={(e) => this.keyPress(e)}/>
										</div>
										<div class="mt-1 col-lg-3 col-md-6 d-flex mt-3">
											<div class="col-3">
												<i class="icon-magnifier"  onClick={() => this.getAlumnos(this.state.carrera)}></i>
											</div>
											<div class="col-3">
												<i class="icon-trash" onClick={() => this.clearInputs()}></i>
											</div>
											<div class="col-3">
												<i class="icon-reload" onClick={() => this.getAlumnos(this.state.carrera)}></i>
											</div>
											<div class="col-3">
												<i class="icon-settings" onClick={() => this.openModalConfig(this.state.carrera)}></i>
											</div>
										</div>
									</div>
								</div>
								{tabla}
							</div>
						</div>
					</div>
					<ModalConfig
						mostrar={this.state.openModalConfig}
						isShow={this.closeModalConfig.bind(this)}
						dataLicenciauras={this.state.dataLicenciaturas}
						rvoe={this.state.rvoe}
						totalCreditos={this.state.totalCreditos}
						totalMaterias={this.state.totalMaterias}
						planEscolar={this.state.planEscolar}/>
				</div>
			</>
			}
			<div
				className="modal"
				id="exampleModal"
				tabIndex={-1}
				role="dialog"
				aria-labelledby="exampleModalLabel"
				aria-hidden="false">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">
								Agregar Documento
							</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<Modal
							className="modal-termometro"
							size="lg"
							aria-labelledby="contained-modal-title-vcenter"
							centered show={this.state.modalDocumento}
							onHide={() => this.manejarClose(false)}>
							<Modal.Header closeButton>
								<Modal.Title>Subir Documento</Modal.Title>
							</Modal.Header>
							<Modal.Body>
							<div>
								<input type="file" name="file" className="custom-file-upload" onChange={(e) => this.handleFile(e)} ></input>
									{
									this.state.files.length > 0
									? <div className='files-list'>
										<ul>{this.state.files.map((file) =>
										<li className='files-list-item' key={file.id}>
											<div className='files-list-item-preview'>
											{file.preview.type === 'image'
											? <img className='files-list-item-preview-image' src={file.preview.url} alt="preview"/>
											: <div className='files-list-item-preview-extension'>{file.extension}</div>}
											</div>
											<div className='files-list-item-content'>
											<div className='files-list-item-content-item files-list-item-content-item-1'>{file.name}</div>
											<div className='files-list-item-content-item files-list-item-content-item-2'>{file.sizeReadable}</div>
											</div>
											<div
											id={file.id}
											className='files-list-item-remove'
											onClick={this.filesRemoveOne.bind(this, file)} // eslint-disable-line
											/>
										</li>
										)}</ul>
									</div>
									: null
									}
							</div>
							<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.manejarClose(false)}>
								Cancelar
							</button>
							{
								subir
							}
							</div>
							</Modal.Body>
						</Modal>
						<ModalDireccion show={this.state.showModalDireccion} onHide={() => this.handleClose(false)} infoDireccion={this.direccionModal} />
					</div>
				</div>
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
	fixNavbar: state.settings.isFixNavbar,
	statisticsOpen: state.settings.isStatistics,
	statisticsClose: state.settings.isStatisticsClose,
})

const mapDispatchToProps = dispatch => ({
	statisticsAction: (e) => dispatch(statisticsAction(e)),
	statisticsCloseAction: (e) => dispatch(statisticsCloseAction(e)),
	visibleLoaderAction: (e) => dispatch(visibleLoaderAction(e))
})
export default connect(mapStateToProps, mapDispatchToProps)(Documentos);
