import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

import ModalDetalleEvento from './ModalDetalleEvento';


class Fullcalender extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            weekendsVisible: true,
            mostrarModal:false,
            dataEvento: []
        }
    }

    componentWillReceiveProps(props) {
		
		this.setState({
			
			events:props.data
			
		});
    }
    
    handleWeekendsToggle = () => {
        this.setState({
        weekendsVisible: !this.state.weekendsVisible
        })
    }    
    
    handleEventClick = (clickInfo) => {        
        this.setState({mostrarModal:true, dataEvento:clickInfo.event});  
        console.log(clickInfo.event.title);    
        console.log(clickInfo.event.start);    
        console.log(clickInfo.event.end);                              
    }

    
    handleClickModal(active){
        this.setState({mostrarModal:active}); 
    }
    
    handleEvents = (events) => {
        this.setState({
        currentEvents: events
        })
    }

    
	
    render() {    
        return (
            
            <div id="example-component">
                <FullCalendar
                    id="calendar"
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    
                    headerToolbar={{                       
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',    
                        locale: 'es'                                                                                          
                    }}
                    
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={this.state.weekendsVisible}
                    defaultDate={new Date()}                                        
                    eventLimit={true} 
                    events={this.state.events}
                    timeZone= 'local'     
                    locale={esLocale}   
                    navLinks = {true}
                    //select={this.handleEventClick}
                    //eventContent={this.renderEventContent} // custom render function
                    eventClick={this.handleEventClick}                             
                />
                <ModalDetalleEvento
                    mostrarModal ={this.state.mostrarModal}                                                             
                    isShow={this.handleClickModal.bind(this)}    
                    eventoData = {this.state.dataEvento}
                />
            </div>
        );
    }
}

export default Fullcalender;
