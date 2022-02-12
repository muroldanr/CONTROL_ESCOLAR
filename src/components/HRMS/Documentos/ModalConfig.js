import React from 'react';
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import routes from '../../../service-manager/routes';
import manager from '../../../service-manager/api';
import NumberFormat from 'react-number-format';
import moment from 'moment';



class ModalConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      condicional:false,
      openModalConfirmarCurp: false,
      RVOE: "",
      CICLO: "",
      Ciclo_id: "",
      Descripcion: "",
      Creditos: "",
      Materias: "",
      valor: "",
      planes: "",
      TerminoCiclo:"",
      FechaIngreso:"",
      ciclo:"",
      TerminoCicloWH:"",
      FechaIngresoWH:"",
      cicloWH:"",
      PlanEscolar: [
        {
          nombre: "Semestral"
        },
        {
          nombre: "Cuatrimestral"
        },
        {
          nombre: "Trimestral"
        }
      ]

    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      openModalConfirmarCurp: props.mostrar,
      rvoe: props.rvoe

    });

  }


  componentDidMount() {
    //this.getAlumnos();
    this.listaCiclosWH();
   // this.listaCiclos();
    this.listaCampus();
    this.setDataPlanes();
  }

  confirmarChangeCiclo() {
    //alert("SIPINNER: " + this.state.CICLO + "  INPUT: " + this.state.Descripcion);
    manager.postData(routes.LISTA_DE_CICLOS_ACTUALIZAR, { "UsuarioWeb": localStorage.getItem("usuario"), "id": this.state.Ciclo_id, "description": this.state.Descripcion, "FechaIngreso": this.state.FechaIngreso })
      .then(response => {
        const { isShow } = this.props
        isShow(false)
        this.handleAlert();
      })
      .catch(error => {
        swal("Oops!", error.Mensaje, "error");
      })
  }

  //REQUEST A FACULTADES
  listaCampus() {

    manager.postData(routes.spWHsectionLista, {})
      .then(response => {
        this.setDataFacultades(response);
      })
      .catch(error => {
        swal("Oops!", error.Mensaje, "error");
      })
  }

  //REQUEST LISTA DE CICLOS
  listaCiclos() {
    manager.postData(routes.LISTA_DE_CICLOS, { "UsuarioWeb": localStorage.getItem("usuario") })
      .then(response => {
        this.setDataCiclos(response);
      })
      .catch(error => {
        swal("Oops!", error.Mensaje, "error");
      })
  }

  //REQUEST LISTA DE CICLOS WH
  listaCiclosWH() {
    manager.postData(routes.LISTA_DE_CICLOS_WH, { "UsuarioWeb": localStorage.getItem("usuario") })
      .then(response => {
        this.setDataCiclosWH(response);
      })
      .catch(error => {
        swal("Oops!", error.Mensaje, "error");
      })
  }

  setDataCiclos(response) {
    let objArray = [response]
    let data = [];
    if (Array.isArray(response)) {
      objArray = response
    }

    data = objArray.map((objV, index) => {
      return <option value={index} >{objV.Nombre}</option>
    })
    this.setState({ ciclos: data, cicloArray: objArray });
  }


  setDataCiclosWH(response) {
    let objArray = [response]
    let data = [];
    if (Array.isArray(response)) {
      objArray = response
    }

    data = objArray.map((objV, index) => {
      return <option value={index} >{objV.Ciclo}</option>
    })
    this.setState({ ciclos: data, cicloArray: objArray });
  }
  setDataFacultades(response) {
    let objArray = [response]
    let data = [];
    if (Array.isArray(response)) {
      objArray = response
    }

    data = objArray.map((objV, index) => {
      return <option value={index} >{objV.Carrera}</option>
    });
    this.setState({ facultades: data, facultadesArray: objArray });
  }

  getData = (obj) => {
    console.log(obj)
  }

  setDataPlanes() {
    let objArray = [this.state.PlanEscolar]
    let data = [];
    if (Array.isArray(this.state.PlanEscolar)) {
      objArray = this.state.PlanEscolar
    }

    data = objArray.map((objV) => {
      return <option value={objV.nombre}>{objV.nombre}</option>
    });
    this.setState({ planes: data });
  }


  manejarCloseConfig() {
    const { isShow } = this.props
    isShow(false)
  }


  handleChange = (e) => {
    var fecha = this.state.facultadesArray[e.target.value].Fecha ? this.state.facultadesArray[e.target.value].Fecha : ""
    var fechaFormat = moment(fecha).format('L');
    moment.locale(fechaFormat);
    this.setState({
      [e.target.name]: e.target.value,
      LicenciaturaID: this.state.facultadesArray[e.target.value].ID,
      RVOE: this.state.facultadesArray[e.target.value].RVOE ? this.state.facultadesArray[e.target.value].RVOE : "",
      DGES: this.state.facultadesArray[e.target.value].DGES ? this.state.facultadesArray[e.target.value].DGES : "",
      Fecha: fechaFormat,
      Creditos: this.state.facultadesArray[e.target.value].Creditos ? this.state.facultadesArray[e.target.value].Creditos : "",
      Materias: this.state.facultadesArray[e.target.value].Materias ? this.state.facultadesArray[e.target.value].Materias : "",
    });

  }


  handleChangeSpinner = (e) => {
    console.log(e.Ciclo)
    var fechaIngreso = this.state.cicloArray[e.target.value].FechaIngreso ? this.state.cicloArray[e.target.value].FechaIngreso : ""
    var fechaFormato = moment(fechaIngreso).format('L');
    var terminoCiclo = this.state.cicloArray[e.target.value].TerminoCiclo ? this.state.cicloArray[e.target.value].TerminoCiclo : ""
    var terminoFormato = moment(terminoCiclo).format('L');
    moment.locale(fechaFormato);
    moment.locale(terminoFormato);    
    this.setState({
      [e.target.name]: e.target.value,
      FechaIngreso: fechaFormato,
      TerminoCiclo: terminoFormato,
      Ciclo_id: this.state.cicloArray[e.target.value].ID,
      CICLO: this.state.cicloArray[e.target.value].Ciclo

    });
  }


  handleChangeInput = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  confirmarChange() {
    var Creditos = parseFloat(this.state.Creditos);
    manager.postData(routes.LICENCIATURA_ACTUALIZAR, {
      "UsuarioWeb": localStorage.getItem("usuario"),
      "LicenciaturaID": this.state.LicenciaturaID,
      "RVOE": this.state.RVOE,
      "DGES": this.state.DGES,
      "Fecha": this.state.Fecha,
      "Creditos": Creditos,
      "Materias": this.state.Materias,
      "PlanEscolar": this.state.PlanEscolar
    })
      .then(response => {
        const { isShow } = this.props
        isShow(false)
        this.handleAlert();
      })

      .catch(error => {
        swal("Oops!", error.Mensaje, "error");
      })
  }

  handleAlert() {
    swal("Correcto !", "ok", "success");
    window.location.reload();

  }


  confirmarChangeCicloWH() {
    //alert("SIPINNER: " + this.state.CICLO + "  INPUT: " + this.state.Descripcion);
    manager.postData(routes.spPWHCicloModificar, { "UsuarioWeb": localStorage.getItem("usuario"), "id": this.state.Ciclo_id, "Ciclo":this.state.CICLO, "Inicio": this.state.FechaIngreso, "Fin": this.state.TerminoCiclo })
      .then(response => {
        console.log("SOY RESPONSE");
        console.log(response);
        const { isShow } = this.props
        isShow(false)
        this.handleAlert();
      })
      .catch(error => {
        swal("Oops!", error.Mensaje, "error");
      })
  }

  addCicloWH() {
    //alert("SIPINNER: " + this.state.CICLO + "  INPUT: " + this.state.Descripcion);
    manager.postData(routes.spPWHCicloAgregar, { "UsuarioWeb": localStorage.getItem("usuario"),"Ciclo":this.state.cicloWH, "Inicio": this.state.FechaIngresoWH, "Fin": this.state.TerminoCicloWH })
      .then(response => {
        console.log("SOY RESPONSE");
        console.log(response);
        const { isShow } = this.props
        isShow(false)
        this.handleAlert();
      })
      .catch(error => {
        swal("Oops!", error.Mensaje, "error");
      })
  }

  
  handleChangeTag(valor){
    this.setState({
    condicional:valor
    });    

  }



  render() {

    return (
      <>
        <Modal className="modal-termometro"
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.openModalConfirmarCurp}
          onHide={() => this.manejarCloseConfig(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Configurar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="Container">
            <ul className="nav nav-tabs" role="tablist">´
              {/*

            <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#Ciclo" aria-expanded="false">CICLOS</a></li> */}
              <li className="nav-item" onClick={() => this.handleChangeTag(false)} ><a className="nav-link" data-toggle="tab" href="#Nuevo" aria-expanded="false">NUEVO</a></li>
              <li className="nav-item" onClick={() => this.handleChangeTag(false)} ><a className="nav-link" data-toggle="tab" href="#Ciclo" aria-expanded="false">CICLOS</a></li>
              <li className="nav-item" onClick={() => this.handleChangeTag(true)} ><a className="nav-link" data-toggle="tab" href="#Carrera" aria-expanded="true">CARRERA</a></li>
            
            </ul>
            <div className="tab-content mt-3">
              {/*
 
            <div role="tabpanel" className="tab-pane vivify fadeIn" id="Ciclo">
            <div  class="row  mt-2">
                  <div class="col-lg-4 col-md-12 float-right mt-2">
                    <center><small className="text-muted">CICLO ESCOLAR</small></center>
                    <select
                    className="form-control"
                    data-placeholder="Seleccionar..."
                    name = "CICLO"
                    onChange={(e) => this.handleChangeSpinner(e)}
                    value={this.state.CICLO}>
                    <option value="">Buscar ...</option>
                   {this.state.ciclos}
                   </select>
                  </div>
              <div class="col-lg-4 col-md-12 col-sm-12 float-right mt-2">
                <center><small className="text-muted">CICLO</small></center>
                <input type="text" class="form-control" id="inlineFormInputName"  placeholder="Descrpción del Ciclo" name="Descripcion" value={this.state.Descripcion} onChange={ (e) => this.handleChangeInput(e)}/>
              </div>
              <div class="col-lg-4 col-md-12 col-sm-12 float-right mt-2">
                <center><small className="text-muted">FECHA</small></center>
                <NumberFormat format="##/##/####" class="form-control" placeholder="DD/MM/YY" mask={['D', 'D', 'M', 'M', 'Y','Y','Y','Y']}  name="FechaIngreso" value={this.state.FechaIngreso} onChange={ (e) => this.handleChangeInput(e)}/>
              </div>
              </div>
              <div className="modal-footer">
                  {
                      (this.state.CICLO != null && this.state.Descripcion)?
                      <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.confirmarChangeCiclo()}>
                          Confirmar
                      </button>:
                      <button type="button" className="btn btn-primary" data-dismiss="modal" disabled="true">
                          Confirmar
                      </button>
                  }

                  <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.manejarCloseConfig(false)}>
                      Cancelar
                  </button>
              </div>
            </div> */}

              <div role="tabpanel" className="tab-pane vivify fadeIn" id="Nuevo">
                <div class="row  mt-2 mb-2  justify-content-center">
                  <div class="col-lg-4 col-md-12  mt-2">
                    <center><small className="text-muted">CICLO ESCOLAR</small></center>                    
                    <input type="text" class="form-control" placeholder="Ciclo..." name="cicloWH" value={this.state.cicloWH} onChange={ (e) => this.handleChangeInput(e)}/>
                  </div>
                  <div class="col-lg-3 col-md-11 col-sm-11  mt-2">
                    <center><small className="text-muted">FECHA INICIO</small></center>
                    <NumberFormat format="##/##/####" class="form-control" placeholder="DD/MM/YY" mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']} name="FechaIngresoWH" value={this.state.FechaIngresoWH} onChange={(e) => this.handleChangeInput(e)} />
                  </div>
                  <div class="col-lg-3 col-md-11 col-sm-11  mt-2">
                    <center><small className="text-muted">FECHA FIN</small></center>
                    <NumberFormat format="##/##/####" class="form-control" placeholder="DD/MM/YY" mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']} name="TerminoCicloWH" value={this.state.TerminoCicloWH} onChange={(e) => this.handleChangeInput(e)} />
                  </div>    
                  {
                (this.state.cicloWH!=="" && this.state.FechaIngresoWH !== "" && this.state.TerminoCicloWH !== "")?
                  <div class="col-lg-2 col-md-1 col-sm-1  mt-2" style={{paddingTop:"25px"}} >                                       
												<i class="icon-plus" onClick={() => this.addCicloWH()}></i>											
                  </div>:
                  <div></div>
              }                                        
                </div>
              
              </div>

              <div role="tabpanel" className="tab-pane vivify fadeIn" id="Ciclo">
                <div class="row  mt-2 mb-2 justify-content-center">
                  <div class="col-lg-4 col-md-12 mt-2">
                    <center><small className="text-muted">CICLO ESCOLAR</small></center>
                    <select
                      className="form-control"
                      data-placeholder="Seleccionar..."
                      name="CICLO"
                      onChange={(e) => this.handleChangeSpinner(e)}
                      value={this.state.Ciclo}>
                      <option value="">Buscar ...</option>
                      {this.state.ciclos}
                    </select>
                  </div>
                  <div class="col-lg-3 col-md-11 col-sm-11 mt-2">
                    <center><small className="text-muted">FECHA INICIO</small></center>
              
                    <NumberFormat format="##/##/####" class="form-control" placeholder="DD/MM/YY" mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']} name="FechaIngreso" value={this.state.FechaIngreso} onChange={(e) => this.handleChangeInput(e)} />
                  </div>
                  <div class="col-lg-3 col-md-11 col-sm-11 mt-2">
                    <center><small className="text-muted">FECHA FIN</small></center>
                    <NumberFormat format="##/##/####" class="form-control" placeholder="DD/MM/YY" mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']} name="TerminoCiclo" value={this.state.TerminoCiclo} onChange={(e) => this.handleChangeInput(e)} />
                  </div>
              {
                (this.state.FechaIngreso !== "" && this.state.TerminoCiclo !== "")?
                  <div class="col-lg-2 col-md-1 col-sm-1 mt-2" style={{paddingTop:"25px"}} >              
                      		<button
														type="button"
														className="btn btn-icon"
														title="Edit">
                            <i class="fa fa-save fa-1x" onClick={() => this.confirmarChangeCicloWH()}></i>											
													</button>                         											
                  </div>:
                  <div>

                  </div>
              }
                  

                </div>              
              </div>    
            <div role="tabpanel" className="tab-pane vivify fadeIn" id="Carrera">
            <div class="row  mb-2">
                <div class="col-lg-12 col-md-12 float-right mt-2">
                    <select
                      className="form-control"
                      data-placeholder="Seleccionar ..."
                      name = "carrera"
                      onChange={(e) => this.handleChange(e)}
                      value={this.state.carrera }>
                      <option value="">Buscar ...</option>
                    {this.state.facultades}
                    </select>
                  </div>
                </div>
                <div  class="row  mt-2">
                  <div class="col-lg-4 col-md-12 col-sm-12 float-right mt-2">
                    <center><small className="text-muted">RVOE</small></center>
                    <input type="email" class="form-control" id="inlineFormInputName" placeholder="RVOE" name="RVOE" value={this.state.RVOE} onChange={ (e) => this.handleChangeInput(e)} />
                  </div>
                  <div class="col-lg-4 col-md-12 col-sm-12 float-right mt-2">
                  <center><small className="text-muted">DGES</small></center>
                  <input type="email" class="form-control" id="inlineFormInputName" placeholder="DGES" name="DGES" value={this.state.DGES} onChange={ (e) => this.handleChangeInput(e)}/>
              </div>
              <div class="col-lg-4 col-md-12 col-sm-12 float-right mt-2">
                  <center><small className="text-muted">FECHA</small></center>
                  <NumberFormat format="##/##/####" class="form-control" placeholder="DD/MM/YY" mask={['D', 'D', 'M', 'M', 'Y','Y','Y','Y']}  name="Fecha" value={this.state.Fecha} onChange={ (e) => this.handleChangeInput(e)}/>
              </div>
              </div>
              <div  class="row  mt-2">
                  <div class="col-lg-4 col-md-6 float-right mt-2">
                    <center><small className="text-muted">PLAN ESCOLAR</small></center>
                    <select
                    className="form-control"
                    data-placeholder="Seleccionar ..."
                    name = "PlanEscolar"
                    onChange={(e) => this.handleChangeInput(e)}
                    value={this.state.PlanEscolar }>
                    <option value="">Buscar ...</option>
                    {this.state.planes}
                  </select>
                </div>
                <div class="col-lg-4 col-md-6 float-right mt-2">
                  <center><small className="text-muted">TOTAL DE CREDITOS</small></center>
                  <input type="email" class="form-control" id="inlineFormInputName" placeholder="Cant. Créditos" name="Creditos" value={this.state.Creditos} onChange={ (e) => this.handleChangeInput(e)}/>
                </div>
                  <div class="col-lg-4 col-md-6 float-right mt-2">
                    <center><small className="text-muted">TOTAL DE MATERIAS</small></center>
                    <input type="email" class="form-control" id="inlineFormInputName" placeholder="Cant. Materias" name="Materias" value={this.state.Materias} onChange={ (e) => this.handleChangeInput(e)}/>
                  </div>
                </div>

          </div>     
              <div className="modal-footer">      
              {
                    (this.state.condicional === true && this.state.RVOE !== '' && this.state.Creditos !== '' && this.state.Materias !== '' && this.state.PlanEscolar !== '')?
                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.confirmarChange()}>
                        Confirmar
                    </button>:<div></div>
                  
                }    
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.manejarCloseConfig(false)}>
                  Cancelar
                </button>
              </div>
            </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default ModalConfig;
