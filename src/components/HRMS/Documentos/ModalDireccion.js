import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'
import { Button } from 'react-bootstrap';
import {Row} from 'react-bootstrap';
import manager from '../../../service-manager/api';
import routes from '../../../service-manager/routes';
import swal from 'sweetalert';
import strings from '../../utils/strings';
import Tabla from './DocumentosTable.js';

class ModalDireccion extends Component {

    constructor(props){
        super(props);
        this.state={

        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    closeModal = e => 
    {
        this.clearState();
        this.props.onHide();
    }

    updateClienteCarrito(objV){
        this.isLoading(true);
        manager.postData(routes.UPDATE_USER_CARRITO,{'WebUsuario':localStorage.getItem('user'),'Cliente':localStorage.getItem('clienteCliente'),'ClienteNuevo':objV})
        .then(response => {
            this.updateLocalStore(objV);
            this.isLoading(false);
        })
        .catch(error =>{
            this.isLoading(false);
            let {code} = error;
            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
            console.log(error);
            if (code === undefined) {
                code=500
            }
            if(code === 401){
                
            }
        })    
    }

    validNull(value){
        if (value === null || value === "" || value === "null") {
           return "NULL";
        }else{
            return value;
        }

    }

    clearState(){
        this.setState({
            codigoPostal:"",
            colonia:"",
            poblacion:"",
        });
    }

    searchAddress = (value) => {

        if ( this.state.colonia ||  this.state.codigoPostal   || this.state.poblacion ){
                this.getDirecciones(value)
            }else{
                swal("Datos vacios", "Ingrese los datos correspondientes", "error");
        } 
    }


    getDirecciones(value){
        let codigoPostal = ""
        let colonia = ""
        let poblacion = ""

        switch (value) {
            case "codigoPostal":
                codigoPostal = this.validNull(this.state.codigoPostal)
            break;
            case "colonia":
                colonia = this.validNull(this.state.colonia)
            break;
            case "poblacion":
                poblacion = this.validNull(this.state.poblacion)
            break;
            default:
                codigoPostal = this.validNull(this.state.codigoPostal)
                colonia = this.validNull(this.state.colonia)
                poblacion = this.validNull(this.state.poblacion)
            break;
        }

        manager.postData(routes.spWebCodigoPostal,{
            'Colonia':colonia,  
            'Delegacion':poblacion,
            'CodigoPostal':codigoPostal,
        })
        .then(response => {
            this.setHeaders();
            this.setData(response); 
        })
        .catch(error =>{
            this.isLoading(false)
            swal("Ocurrio un Error", "Existe un problema con el servidor, intentelo más tarde ", "error");
        });
    }


    setHeaders() {
        let headers = ["C.P.", "Colonia", "Poblacion", "Estado"];

        let headerItems = [];

        headerItems = headers.map((title) =>
                <th key={title} >{title}</th>
         );

        this.setState({
            headers: headerItems
        });
    }

    setData(arrayClientes,tipo) {
        let objArray = arrayClientes

        let data = [];

        data = objArray.map((objV) =>
            <tr key = {objArray.id}  >
                <td onClick= {() => this.setInfo(objV)} >{objV.CodigoPostal}</td>
                <td onClick= {() => this.setInfo(objV)} >{objV.Colonia}</td>
                <td onClick= {() => this.setInfo(objV)} >{objV.Delegacion}</td>
                <td onClick= {() => this.setInfo(objV)} >{objV.Estado}</td>
            </tr>
        );
        this.setState({
            data: data,
        });

    }

    setInfo = (objV) =>{
        this.props.infoDireccion(objV); 
        this.closeModal();  
    }

    tableAddress() {
        if(this.state.data){
            return   (<div className="col-12 text-center"> 
                        <button className="btn btn-light center-block" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">+</button>
                            <div className="collapse show" id="collapseExample">                        
                                <Tabla headers={this.state.headers} data={this.state.data} />
                            </div>
                    </div>)
        } else {
            return <p></p>
        }
    }

    render() {
        return (
            <Modal
                dialogClassName="modal-90w"
                show={this.props.show}
                onHide={this.props.onHide}
                size={"lg"}
                aria-labelledby="contained-modal-title-vcenter"
                scrollable="true"
            > 
            <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Dirección
                    </Modal.Title>
            </Modal.Header>
                    <Modal.Body className="mt-0 pt-0 mb-0 pb-0">
                    <Row className="mb-3">
                        <div className="col-xs-12 col-md-4 col-lg-4 col-xlg-4 mt-4" >
                            <div className="input-field input-group mb-3" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="codigoPostal" 
                                name="codigoPostal"
                                type="number"
                                className="form-control" 
                                placeholder={strings.CODIGO_POSTAL}
                                value={this.state.codigoPostal}
                                />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={() =>  this.searchAddress("codigoPostal")}>?</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-4 col-lg-4 col-xlg-4 mt-4" >
                            <div className="input-field input-group mb-3" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="poblacion" 
                                name="poblacion"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.POBLACION}
                                value={this.state.poblacion}
                                />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={() =>  this.searchAddress("poblacion")}>?</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-4 col-lg-4 col-xlg-4 mt-4" >
                            <div className="input-field  input-group mb-3" id="inp">
                                <input 
                                onChange={this.handleChange}
                                id="colonia" 
                                name="colonia"
                                type="text" 
                                className="form-control" 
                                placeholder={strings.COLONIA}
                                value={this.state.colonia}
                                />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" onClick={() =>  this.searchAddress("colonia")}>?</button>
                                </div>
                            </div>
                        </div>
                    </Row>
                        {this.tableAddress()}
                </Modal.Body>
                <Modal.Footer className="mt-0 pt-3 overflow-auto">
                    <Button onClick={this.closeModal}>Cancelar</Button>
                </Modal.Footer>

            </Modal>

        );
    }
}

export default ModalDireccion;
