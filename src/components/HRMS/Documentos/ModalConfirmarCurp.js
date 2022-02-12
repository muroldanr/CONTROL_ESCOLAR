import Modal from 'react-bootstrap/Modal';
import React from 'react';



class ModalConfirmarCurp extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            openModalConfirmarCurp:false,   
            newCurp:props.campoCambiadoCurp,
            fechaNacimientoCURP:props.FechaNacimiento,    
            edadCURP:props.Edad,            
            sexoCURP:props.Genero,
            entidadCURP:props.entidad,       
        };
    }
    
    componentWillReceiveProps(props) {
        this.setState({
            openModalConfirmarCurp: props.mostrar,     
            newCurp:props.campoCambiadoCurp,
            fechaNacimientoCURP:props.FechaNacimiento, 
            edadCURP:props.Edad,                   
            sexoCURP:props.Genero,
            entidadCURP:props.entidad,     

        });
    }


    manejarCloseConfirmar(){
        this.setState({ openModalConfirmarCurp: false });
        const {isShow} = this.props
        isShow(false)
    }

    confirmarChange(){
        this.setState({ openModalConfirmarCurp: false });
        const {isShow} = this.props
        isShow(false)
        this.props.mandarNew(this.state.newCurp,"curp");               
        this.props.actualizarEntidad(this.state.entidadCURP);
    }


render(){  

    return(
        <>
            <Modal className="modal-termometro"
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.openModalConfirmarCurp}
				onHide={() => this.manejarCloseConfirmar(false)}>
				<Modal.Header closeButton>
					<Modal.Title>¿Estás seguro que deseas modificar el campo ?</Modal.Title>
				</Modal.Header>                
				<Modal.Body>               
                    <center><h5>El CURP será {this.state.newCurp}</h5></center> 
                    <div className="row">
                        <div className="col-lg-3 col-md-12">
                            <small className="text-muted">FECHA DE NACIMIENTO </small>																														
                            <input  type="text" class="form-control" id="inlineFormInputName" value={this.state.fechaNacimientoCURP} />																															
                        </div>	
                        <div className="col-lg-3 col-md-12">
                            <small className="text-muted">EDAD </small>																														
                            <input  type="text" class="form-control" id="inlineFormInputName" value={this.state.edadCURP} />																															
                        </div>
                        <div className="col-lg-3 col-md-12">
                            <small className="text-muted">SEXO </small>																														
                            <input  type="text" class="form-control" id="inlineFormInputName" value={this.state.sexoCURP} />																															
                        </div>
                        <div className="col-lg-3 col-md-12">
                            <small className="text-muted">ENTIDAD DE NACIMIENTO </small>																														
                            <input  type="text" class="form-control" id="inlineFormInputName" value={this.state.entidadCURP} />																															
                        </div>  
                    </div>                  
				</Modal.Body>
                <Modal.Footer>                
                    <div className="modal-footer">                                                           
                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.confirmarChange(false)}>
                            Confirmar
                        </button>	                      	
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.manejarCloseConfirmar(false)}>
                            Cancelar
                        </button>														                     																							
                    </div>
				</Modal.Footer>
			</Modal>								
        </>
    );
}
}

export default ModalConfirmarCurp;