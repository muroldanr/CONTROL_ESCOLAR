import React from 'react';
import Modal from 'react-bootstrap/Modal';



class ModalConfirmarTelefonoFijo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            openModalConfirmarTelefonoFijo:false,   
            newTelefono:props.campoCambiadoTelefonoFijo       
        };
    }
    
    componentWillReceiveProps(props) {
        this.setState({
            openModalConfirmarTelefonoFijo: props.mostrar,     
            newTelefono:props.campoCambiadoTelefonoFijo          

        });
    }


    manejarCloseConfirmar(){
        this.setState({ openModalConfirmarTelefonoFijo: false });
        const {isShow} = this.props
        isShow(false)
    }

    confirmarChange(){
        this.setState({ openModalConfirmarTelefonoFijo: false });
        const {isShow} = this.props
        isShow(false)
        this.props.mandarNew(this.state.newTelefono,"telefonoFijo");
    }


render(){  

    return(
        <>
            <Modal className="modal-termometro"
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.openModalConfirmarTelefonoFijo}
				onHide={() => this.manejarCloseConfirmar(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Estás seguro que deseas modificar el campo ?</Modal.Title>
				</Modal.Header>                
				<Modal.Body>                
                    <center><h5>El campo será {this.state.newTelefono}</h5></center>
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

export default ModalConfirmarTelefonoFijo;