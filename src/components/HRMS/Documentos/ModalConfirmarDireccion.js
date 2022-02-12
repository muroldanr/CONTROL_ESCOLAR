import React from 'react';
import Modal from 'react-bootstrap/Modal';



class ModalConfirmarDireccion extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            openModalConfirmarDireccion:false,   
            newDireccion:props.campoCambiadoDireccion       
        };
    }
    
    componentWillReceiveProps(props) {
        this.setState({
            openModalConfirmarDireccion: props.mostrar,     
            newDireccion:props.campoCambiadoDireccion          

        });
    }


    manejarCloseConfirmar(){
        this.setState({ openModalConfirmarDireccion: false });
        const {isShow} = this.props
        isShow(false)
    }

    confirmarChange(){
        this.setState({ openModalConfirmarDireccion: false });
        const {isShow} = this.props
        isShow(false)
        this.props.mandarNew(this.state.newDireccion,"direccion");
    }


render(){  

    return(
        <>
            <Modal className="modal-termometro"
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.openModalConfirmarDireccion}
				onHide={() => this.manejarCloseConfirmar(false)}>
				<Modal.Header closeButton>
					<Modal.Title>¿ Estás seguro que deseas actualizar la dirección ?</Modal.Title>
				</Modal.Header>                
				<Modal.Body>                
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

export default ModalConfirmarDireccion;