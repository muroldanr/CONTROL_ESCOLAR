import React from 'react';
import Modal from 'react-bootstrap/Modal';



class ModalUniversidadProcedencia extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            openModalUniversidad:false,   
            newUniversidad:props.uniProcedencia       
        };
    }
    
    componentWillReceiveProps(props) {
        this.setState({
            openModalUniversidad: props.mostrar,     
            newUniversidad:props.uniProcedencia          

        });
    }


    manejarCloseUniversidad(){
        this.setState({ openModalUniversidad: false });
        const {isShow} = this.props
        isShow(false)
    }

    confirmarChange(){
        this.setState({ openModalUniversidad: false });
        const {isShow} = this.props
        isShow(false)
        this.props.actualizarEscuela(this.state.newUniversidad,"universidad");
    }


render(){  

    return(
        <>
            <Modal className="modal-termometro"
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.openModalUniversidad}
				onHide={() => this.manejarCloseUniversidad(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Estás seguro que deseas modificar el campo ?</Modal.Title>
				</Modal.Header>                
				<Modal.Body>                
                    <center><h5>El campo será:  {this.state.newUniversidad}</h5></center>
				</Modal.Body>
                <Modal.Footer>                
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.confirmarChange(false)}>
                            Confirmar
                        </button>	
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.manejarCloseUniversidad(false)}>
                            Cancelar
                        </button>														                     																							
                    </div>
				</Modal.Footer>
			</Modal>								
        </>
    );
}
}

export default ModalUniversidadProcedencia;