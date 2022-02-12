import React from 'react';
import Table from 'react-bootstrap/Table';

class DocumentosTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            headers: props.headers,
            data: props.data,            
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            headers: props.headers,
            data: props.data
        });       
    }

    render(){
        return(
            <React.Fragment>
                <div className="container-fluid">
                    
                    <Table responsive={true}  className="tabla mt-3 table-curved ">
                        <thead className="table_title">
                            <tr>
                                {this.state.headers}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data}
                        </tbody>
                    </Table>
                </div>
            </React.Fragment>
        );
    }
}
export default DocumentosTable;