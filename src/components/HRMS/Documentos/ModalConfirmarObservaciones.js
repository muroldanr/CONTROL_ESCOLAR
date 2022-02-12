import React from 'react';
import Modal from 'react-bootstrap/Modal';



class ModalConfirmarObservaciones extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            openModalConfirmarObservaciones:false,   
            newObservaciones:props.campoCambiadoObservaciones       
        };
    }
    
    componentWillReceiveProps(props) {
        this.setState({
            openModalConfirmarObservaciones: props.mostrar,     
            newObservaciones:props.campoCambiadoObservaciones          

        });
    }


    manejarCloseConfirmar(){
        this.setState({ openModalConfirmarObservaciones: false });
        const {isShow} = this.props
        isShow(false)
    }
    
    confirmarChange(){
        this.setState({ openModalConfirmarObservaciones: false });
        const {isShow} = this.props
        isShow(false)
        this.props.mandarNew(this.state.newObservaciones,"observaciones");
    }


render(){  

    return(
        <>
            <Modal className="modal-termometro"
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.openModalConfirmarObservaciones}
				onHide={() => this.manejarCloseConfirmar(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Estás seguro que deseas modificar el campo ?</Modal.Title>
				</Modal.Header>                
				<Modal.Body>                
                    <center><h5>El campo será {this.state.newObservaciones}</h5></center>
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

export default ModalConfirmarObservaciones;