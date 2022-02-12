import React from 'react';
import Modal from 'react-bootstrap/Modal';



class ModalConfirmarCorreo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            openModalConfirmarCorreo:false,   
            newCorreo:props.campoCambiadoCorreo       
        };
    }
    
    componentWillReceiveProps(props) {
        this.setState({
            openModalConfirmarCorreo: props.mostrar,     
            newCorreo:props.campoCambiadoCorreo          

        });
    }


    manejarCloseConfirmar(){
        this.setState({ openModalConfirmarCorreo: false });
        const {isShow} = this.props
        isShow(false)
    }
    
    confirmarChange(){
        this.setState({ openModalConfirmarCorreo: false });
        const {isShow} = this.props
        isShow(false)
        this.props.mandarNew(this.state.newCorreo,"correo");
    }


render(){  

    return(
        <>
            <Modal className="modal-termometro"
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.openModalConfirmarCorreo}
				onHide={() => this.manejarCloseConfirmar(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Estás seguro que deseas modificar el campo ?</Modal.Title>
				</Modal.Header>                
				<Modal.Body>                
                    <center><h5>El campo será {this.state.newCorreo}</h5></center>
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

export default ModalConfirmarCorreo;