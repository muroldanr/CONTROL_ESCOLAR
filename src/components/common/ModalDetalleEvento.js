import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

class ModalDetalleEvento extends React.Component{
    constructor(props) {
        super(props);        
        this.state = {    
            mostrarModal:false,     
            eventoData: []       
        };
    }

    componentWillReceiveProps(props) {        
        this.setState({
            mostrarModal: props.mostrarModal,
            eventoData : props.eventoData
        }); 
    }
    
    
    handleCloseModal(){      
        this.setState({mostrarModal:false});
    }

    render(){
    let modalClose = () => this.setState({ mostrarModal: false });
    return(
    <React.Fragment>
        <Modal            
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.state.mostrarModal} 
            onHide={this.handleCloseModal.bind(this)}>            
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                Modal heading
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{this.state.eventoData.title}</h4>
                <p>
                Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                consectetur ac, vestibulum at eros.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={modalClose} >Cerrar</Button>
            </Modal.Footer>
        </Modal>   
    </React.Fragment>
        );
    }
}
export default ModalDetalleEvento;