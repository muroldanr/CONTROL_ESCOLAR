//const BASE_URL = "https://rtorresapp.com/avanti-back/web/app_dev.php"
//const BASE_URL = "http://3.92.119.99:9001/orusapi/public/index.php"
//const BD = "rtorres2"
//const BASE_URL = "http://34.201.186.209/API/"
//const BASE_URL = "http://gersafacturacion.intelisiscloud.com:5001/"
//const BASE_URL = " https://rtorresapp.com/app_dev.php"
//const BASE_URL = "http://192.168.15.15:8080/app_dev.php"
//const BASE_URL = "http://localhost:55996/api/"
//const BASE_URL = "http://10.30.50.234:8080/api/"
const BASE_URL = "http://201.151.192.226:8080/api/"

const BD = "LocalSQLExpress"
const BD_2 = "M"




const endpoints = Object.freeze({
    login:                    "Login",
    get_alumnos:              "/sp/spWebAlumnos",
    get_documentos:           "/sp/spWebDocumentacionLista",
    alumnoDetalle:            "/sp/spWebAlumnoDetalle",
    upload:                   "upload",
    download:                 "download",
    delete:                   "delete",
    spWebRutaAlmacenarCE:     "/sp/spWebRutaAlmacenarCE",
    historialAcademico:       "/sp/sp__gb_grades",
    lista_campus:             "/sp/spCECampusLista",
    spWHsectionLista:         "/sp/spWHsectionLista",
    spWebAnexoCtaCEAlumno:    "/sp/spWebAnexoCtaCEAlumno",
    spWebTipoIngreso:         "/sp/spWebTipoIngreso",
    spWebDocumentacion:       "/sp/spWebDocumentacion",
    spWebDocLicenciatura:     "/sp/spWebDocLicenciatura",
    spEmpresaAPP:             "/sp/spEmpresaAPP",
    spWebUsuarioRol:          "/sp/spWebUsuarioRol",
    //Autorizaciones
    spMovApp:                 "/sp/spMovApp",
    spMovDApp:                "/sp/spMovDApp",
    spAutorizacionModuloAPP:  "/sp/spAutorizacionModuloAPP",

    // CATALOGOS
    CEPlanLista:              "/sp/spCEPlanLista ",
    spCETipoIngresoLista:     "/sp/spCETipoIngresoLista",
    estatusList:              "/sp/spCEEstatusLista  ",
    continuidadList:          "/sp/spCEEstatusContinuidadLista",
    nacionalidadList:         "/sp/spCENacionalidadLista",
    paisList:                 "/sp/spCEPaisLista",
    estadoList:               "/sp/spCEPaisEstadoLista",
    spCECicleLista:           "/sp/spCECicleLista",

    //UPDATE A CAMPOS
    actualizarCampos:         "/sp/spWebCEAlumnoActualizar",

    spWebAlumnoEdad:          "/sp/spWebAlumnoEdad",
    spWebAlumnoNacionalidad:  "/sp/spWebAlumnoNacionalidad",
    spWebAlumnoDocActualizar: "/sp/spWebAlumnoDocActualizar",
    spWHsectionActualizar:    "/sp/spWHsectionActualizar",
    spWebCodigoPostal:        "/sp/spWebCodigoPostal",
    spWebAnexoCtaEliminar:    "/sp/spWebAnexoCtaEliminar",
    sp_g_curriculums:         "/sp/sp_g_curriculums",
    spCURPdatos:              "/sp/spWHCURPDatos",
    spWHEscuelaProcedencia:   "/sp/spWHEscuelaProcedencia",
    spWebciclesLista  :       "/sp/spWebciclesLista  ",
    spWHEscuelaProcedenciaActualiza:"/sp/spWHEscuelaProcedenciaActualiza",
    spWebciclesActualizar  :   "/sp/spWebciclesActualizar",
    get_sabana:                "/sp/spWebSabanaInforme",
    get_sabana_general:        "/sp/spWebSabanaGeneral",
    spPWHCicloLista:        "/sp/spPWHCicloLista",
    spPWHCicloAgregar:        "/sp/spPWHCicloAgregar",
    spPWHCicloModificar:        "/sp/spPWHCicloModificar",
    spPWHAlumnoCicloModificar:        "/sp/spPWHAlumnoCicloModificar",




})






const routes = {
        LOGIN: 			            BASE_URL + endpoints.login,
        GET_ALUMNOS: 	            BASE_URL + BD + endpoints.get_alumnos,
        GET_DOCUMENTOS: 	        BASE_URL + BD + endpoints.get_documentos,
        UPLOAD:                     BASE_URL + endpoints.upload,
        DOWNLOAD:                   BASE_URL + endpoints.download,
        DELETE:                     BASE_URL + endpoints.delete,
        RUTA_ALMACENAR:             BASE_URL + BD + endpoints.spWebRutaAlmacenarCE,
        HISTORIAL_ACADEMICO:        BASE_URL + BD + endpoints.historialAcademico,
        LISTA_CAMPUS:               BASE_URL + BD + endpoints.lista_campus,
        spWHsectionLista:           BASE_URL + BD + endpoints.spWHsectionLista,
        spWebAnexoCtaCEAlumno:      BASE_URL + BD + endpoints.spWebAnexoCtaCEAlumno,
        spWebTipoIngreso:           BASE_URL + BD + endpoints.spWebTipoIngreso,
        spWebDocumentacion:         BASE_URL + BD + endpoints.spWebDocumentacion,
        spWebDocLicenciatura:       BASE_URL + BD + endpoints.spWebDocLicenciatura,
        spEmpresaAPP:               BASE_URL + BD_2 + endpoints.spEmpresaAPP,
        spWebUsuarioRol:            BASE_URL + BD + endpoints.spWebUsuarioRol,

        //Autorizaciones
        spMovApp:                   BASE_URL + BD + endpoints.spMovApp,
        spMovDApp:                  BASE_URL + BD + endpoints.spMovDApp,
        spAutorizacionModuloAPP:    BASE_URL + BD + endpoints.spAutorizacionModuloAPP,

        // CATALOGOS
        TIPO_INGRESO:               BASE_URL + BD + endpoints.spCETipoIngresoLista,
        ESTATUS_LIST:               BASE_URL + BD + endpoints.estatusList,
        CONTINUIDAD_LIST:           BASE_URL + BD + endpoints.continuidadList,
        NACIONALIDAD_LIST:          BASE_URL + BD + endpoints.nacionalidadList,
        PAIS_LIST:                  BASE_URL + BD + endpoints.paisList,
        ESTADO_LIST:                BASE_URL + BD + endpoints.estadoList,
        UPDATE_CAMPOS:              BASE_URL + BD + endpoints.actualizarCampos,
        ALUMNO_DETALLE:             BASE_URL + BD + endpoints.alumnoDetalle,
        ALUMNO_CEPLAN:              BASE_URL + BD + endpoints.CEPlanLista,
        ALUMNO_CICLO:               BASE_URL + BD + endpoints.spCECicleLista,
        LICENCIATURA_ACTUALIZAR:    BASE_URL + BD + endpoints.spWHsectionActualizar,

        spWebAlumnoEdad:            BASE_URL + BD + endpoints.spWebAlumnoEdad,
        spWebAlumnoNacionalidad:    BASE_URL + BD + endpoints.spWebAlumnoNacionalidad,
        spWebAlumnoDocActualizar:   BASE_URL + BD + endpoints.spWebAlumnoDocActualizar,
        spWebCodigoPostal:          BASE_URL + BD + endpoints.spWebCodigoPostal,
        spWebAnexoCtaEliminar:      BASE_URL + BD + endpoints.spWebAnexoCtaEliminar,
        sp_g_curriculums:           BASE_URL + BD + endpoints.sp_g_curriculums,
        CURP_DATOS:                 BASE_URL + BD + endpoints.spCURPdatos,
        ESCUELA_PROCEDENCIA:        BASE_URL + BD + endpoints.spWHEscuelaProcedencia,
        ESCUELA_PROCEDENCIA_ACTUALIZA:BASE_URL + BD + endpoints.spWHEscuelaProcedenciaActualiza,

        LISTA_DE_CICLOS:           BASE_URL + BD + endpoints.spWebciclesLista,
        LISTA_DE_CICLOS_ACTUALIZAR:           BASE_URL + BD + endpoints.spWebciclesActualizar,
        GET_SABANA_INFORME:           BASE_URL + BD + endpoints.get_sabana,
        GET_SABANA_INFORME_GENERAL:           BASE_URL + BD + endpoints.get_sabana_general,
        LISTA_DE_CICLOS_WH:           BASE_URL + BD + endpoints.spPWHCicloLista,
        spPWHCicloAgregar:           BASE_URL + BD + endpoints.spPWHCicloAgregar,
        spPWHCicloModificar:           BASE_URL + BD + endpoints.spPWHCicloModificar,
        spPWHAlumnoCicloModificar:           BASE_URL + BD + endpoints.spPWHAlumnoCicloModificar,






}

export default routes;
