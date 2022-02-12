import React from 'react';
import Modal from 'react-bootstrap/Modal';



class ModalSecundariaProcedencia extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            openModalSecundaria:false,   
            newSecundaria:props.secProcedencia       
        };
    }
    
    componentWillReceiveProps(props) {
        this.setState({
            openModalSecundaria: props.mostrar,     
            newSecundaria:props.secProcedencia          

        });
    }


    manejarCloseSecundaria(){
        this.setState({ openModalSecundaria: false });
        const {isShow} = this.props
        isShow(false)
    }

    confirmarChange(){
        this.setState({ openModalSecundaria: false });
        const {isShow} = this.props
        isShow(false)
        this.props.actualizarEscuela(this.state.newSecundaria,"secundaria");
    }


render(){  

    return(
        <>
            <Modal className="modal-termometro"
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.openModalSecundaria}
				onHide={() => this.manejarCloseSecundaria(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Estás seguro que deseas modificar el campo ?</Modal.Title>
				</Modal.Header>                
				<Modal.Body>                
                    <center><h5>El campo será:  {this.state.newSecundaria}</h5></center>
				</Modal.Body>
                <Modal.Footer>                
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.confirmarChange(false)}>
                            Confirmar
                        </button>	
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.manejarCloseSecundaria(false)}>
                            Cancelar
                        </button>														                     																							
                    </div>
				</Modal.Footer>
			</Modal>								
        </>
    );
}
}

export default ModalSecundariaProcedencia;