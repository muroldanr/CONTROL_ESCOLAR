import React from 'react';

class BotonFlotanteExcel extends React.Component {

  constructor(props){
    super(props);
    this.state = {
    };
  }

  render() {
      return (
        <React.Fragment>
          <button type="button"
            className="botonTablaExcel"
          >
            <i className="tim-icons icon-single-copy-04 iconoTabla m-2"></i>
          </button>
        </React.Fragment>
        );
  }
}

export default BotonFlotanteExcel;