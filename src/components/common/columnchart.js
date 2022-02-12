import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import manager from '../../service-manager/api';
import routes from '../../service-manager/routes';
import swal from 'sweetalert';
import { connect } from 'react-redux';
import {
	visibleLoaderAction
} from '../../actions/settingsAction';
class Columnchart extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [],
            options: {},


        };
    }

    componentDidMount(){
		this.dataChart();
	}

    dataChart = ()=> {
		//e.preventDefault();
		this.props.visibleLoaderAction(true);	    
		manager.postDataForm(routes.spWebDocumentacion,{"UsuarioWeb":localStorage.getItem("usuario")})
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
            return objV.Documento ;
        });

            
		this.setState(
            {
                series : [{
                    name: 'Cantidad',
                    data: series
                }],
                options : {
                    chart: {
                        type: 'bar',
                        height: 350
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                            endingShape: 'rounded'
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    legend: {
                        markers: {
                            fillColors: ['#00abc8', '#6f6593', '#8075aa', '#a192d9']
                        }
                    },
                    stroke: {
                        show: true,
                        width: 2,
                        colors: ['transparent']
                    },
                    xaxis: {
                        categories: labels,
                    },
                    yaxis: {
                        title: {
                            text: '$ (thousands)'
                        }
                    },
                    fill: {
                        opacity: 1,
                        colors: ['#00abc8', '#6f6593', '#8075aa']
                    },
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return "$ " + val + " thousands"
                            }
                        }
                    }
                }
            }
        );
    }


    render() {
        return (
            <div>
                <div id="chart">
                    <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height="auto" />
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

export default connect(mapStateToProps, mapDispatchToProps)(Columnchart);

