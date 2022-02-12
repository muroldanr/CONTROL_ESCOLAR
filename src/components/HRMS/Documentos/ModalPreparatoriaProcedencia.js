import React from 'react';
import Modal from 'react-bootstrap/Modal';



class ModalPreparatoriaProcedencia extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            openModalPreparatoria:false,   
            newPrepa:props.preProcedencia       
        };
    }
    
    componentWillReceiveProps(props) {
        this.setState({
            openModalPreparatoria: props.mostrar,     
            newPrepa:props.preProcedencia          

        });
    }


    manejarClosePreparatoria(){
        this.setState({ openModalPreparatoria: false });
        const {isShow} = this.props
        isShow(false)
    }

    confirmarChange(){
        this.setState({ openModalPreparatoria: false });
        const {isShow} = this.props
        isShow(false)
        this.props.actualizarEscuela(this.state.newPrepa,"preparatoria");
    
    }


render(){  

    return(
        <>
            <Modal className="modal-termometro"
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.openModalPreparatoria}
				onHide={() => this.manejarClosePreparatoria(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Estás seguro que deseas modificar el campo ?</Modal.Title>
				</Modal.Header>                
				<Modal.Body>                
                    <center><h5>El campo será:  {this.state.newPrepa}</h5></center>
				</Modal.Body>
                <Modal.Footer>                
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.confirmarChange(false)}>
                            Confirmar
                        </button>	
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.manejarClosePreparatoria(false)}>
                            Cancelar
                        </button>														                     																							
                    </div>
				</Modal.Footer>
			</Modal>								
        </>
    );
}
}

export default ModalPreparatoriaProcedencia;