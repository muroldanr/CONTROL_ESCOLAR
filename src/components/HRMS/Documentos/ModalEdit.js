import React from 'react';
import Modal from 'react-bootstrap/Modal';
import swal from 'sweetalert';
import routes from '../../../service-manager/routes';
import manager from '../../../service-manager/api';
import NumberFormat from 'react-number-format';
import moment from 'moment';



class ModalEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModalEdit: false,
      ciclos:[],
      TerminoCiclo:"",
      FechaIngreso:"",
      ciclo:"",
      TerminoCicloWH:"",
      FechaIngresoWH:"",
      cicloWH:"",
      CICLO: "",
      Ciclo_id: "",
      condicional:true,
      FechaNueva:""
  

    };    
  }

  componentDidMount() {    
    this.listaCiclosWH();

  }

  componentWillReceiveProps(props) {
    this.setState({
      openModalEdit: props.mostrar,
      alumno: props.alumno

    });

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



  manejarCloseEdit() {
    
    const { isShow } = this.props
    isShow(false)
  }

  
  confirmarChangeCicloToAlumno() {
    //alert("SIPINNER: " + this.state.CICLO + "  INPUT: " + this.state.Descripcion);
    manager.postData(routes.spPWHAlumnoCicloModificar, { "UsuarioWeb": localStorage.getItem("usuario"), "id": this.state.Ciclo_id, "Alumno  ": this.state.alumno })
      .then(response => {
        const { isShow } = this.props
        isShow(false)
        this.handleAlertNoReload();
      })
      .catch(error => {
        swal("Oops!", error.Mensaje, "error");
      })
  }

  handleAlert() {
    swal("Correcto !", "ok", "success");
    window.location.reload();

  }

  
  handleAlertNoReload() {
    swal("Correcto !", "ok", "success");
    this.props.newCiclo(this.state.CICLO,this.state.FechaNueva);

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
      CICLO: this.state.cicloArray[e.target.value].Ciclo,
      FechaNueva: this.state.cicloArray[e.target.value].FechaIngreso

    });
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
          show={this.state.openModalEdit}
          onHide={() => this.manejarCloseEdit(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Asignar ciclo al alumno </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="Container">
            <ul className="nav nav-tabs" role="tablist">                 
              <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#Ciclo" onClick={() => this.handleChangeTag(true)}  aria-expanded="false">CICLOS</a></li>
              <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#Nuevo" onClick={() => this.handleChangeTag(false)} aria-expanded="false">NUEVO</a></li>
            </ul>
            <div className="tab-content mt-3">
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
            
          
              <div className="modal-footer">   
                { (this.state.FechaIngreso !== "" && this.state.TerminoCiclo !== "" && this.state.condicional===true)?
                
                  <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.confirmarChangeCicloToAlumno(false)}>
                    Asignar
                  </button>
                  :<div></div>
                
                }       
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.manejarCloseEdit(false)}>
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

export default ModalEdit;
