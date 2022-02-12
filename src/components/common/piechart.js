import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import manager from '../../service-manager/api';
import routes from '../../service-manager/routes';
import swal from 'sweetalert';
import { connect } from 'react-redux';
import {
	visibleLoaderAction
} from '../../actions/settingsAction';
class Piechart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [],
            labelsBD: [],
            options: {},
        };
    }

    componentDidMount(){
		this.dataChart();
	}

    dataChart = ()=> {
		//e.preventDefault();
		this.props.visibleLoaderAction(true);	    
		manager.postDataForm(routes.spWebTipoIngreso,{"UsuarioWeb":localStorage.getItem("usuario")})
		.then(response => {   				
            this.setData(response);
		})
		.catch(error =>{	
			swal("Oops!", error.Mensaje , "error");
			this.props.visibleLoaderAction(false);
		})						
    }
    
    setData = (response) => {
        let objArray = [response]   
        let series = [];
        let labels = [];
		if(Array.isArray(response)){
			objArray = response
		}

		series = objArray.map((objV) => {			
				return objV.Cuantos;
        });

        labels = objArray.map((objV) => {			
            return objV.TipoIngreso + ":" + objV.Cuantos;
        });
		this.setState({options: {
            chart: {
                width: 380,
                type: 'column',
            },
            labels: labels,
            legend: {
                position: 'bottom',
                markers: {

                }
            },
            fill: {

            },
            dataLabels: {
                enabled: false
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: "100%"
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },series: series });
    }



    render() {
        return (
            <div>
                <div id="chart">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="pie" width="100%" />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
	visibleLoaderAction: (e) => dispatch(visibleLoaderAction(e))
})

export default connect(mapStateToProps, mapDispatchToProps)(Piechart);
