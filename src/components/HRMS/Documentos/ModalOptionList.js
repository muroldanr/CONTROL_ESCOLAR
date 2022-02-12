import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';



class ModalOptionList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            openModalOptions:false,
            listaOpciones:[],   
            headers : [""]       
        };
    }
    
    componentWillReceiveProps(props) {
        this.setState({
            openModalOptions: props.mostrar,   
            listaOpciones: props.dataList ? props.dataList : []    

        });
    }


    manejarClose(){
        this.setState({ openModalOptions: false });
        const {isShow} = this.props
        isShow(false)
    }


render(){  

    return(
        <>
            <Modal className="modal-termometro"
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
                centered 
                show={this.state.openModalOptions}
				onHide={() => this.manejarClose(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Selecciona ... </Modal.Title>
				</Modal.Header>
				<Modal.Body>
                    <Table responsive={true}  className="tabla mt-3 table-curved tablacarrito">
                        <thead className="table_title">
                            <tr>
                                {this.state.headers}
                            </tr>
                        </thead>
                        <tbody>
                            <center>{this.state.listaOpciones}</center>
                        </tbody>
                </Table>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => this.manejarClose(false)}>
                            Cancelar
                        </button>														                     																							
                    </div>
				</Modal.Body>
			</Modal>								
        </>
    );
}
}

export default ModalOptionList;