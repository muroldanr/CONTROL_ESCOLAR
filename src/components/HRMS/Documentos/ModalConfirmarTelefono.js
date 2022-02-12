import React from 'react';
import Modal from 'react-bootstrap/Modal';



class ModalConfirmarTelefono extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            openModalConfirmarTelefono:false,   
            newTelefono:props.campoCambiadoTelefono       
        };
    }
    
    componentWillReceiveProps(props) {
        this.setState({
            openModalConfirmarTelefono: props.mostrar,     
            newTelefono:props.campoCambiadoTelefono          

        });
    }


    manejarCloseConfirmar(){
        this.setState({ openModalConfirmarTelefono: false });
        const {isShow} = this.props
        isShow(false)
    }

    confirmarChange(){
        this.setState({ openModalConfirmarTelefono: false });
        const {isShow} = this.props
        isShow(false)
        this.props.mandarNew(this.state.newTelefono,"telefono");
    }


render(){  

    return(
        <>
            <Modal className="modal-termometro"
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.openModalConfirmarTelefono}
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

export default ModalConfirmarTelefono;