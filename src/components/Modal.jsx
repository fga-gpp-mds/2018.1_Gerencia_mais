import React from "react";
import "../css/bootstrap.css";
import "../css/Modal.css";
import FormUpdate from "../components/FormUpdate";
import {
  Modal,
  Button
} from "react-bootstrap";
import {store} from "../components/store"


export default class ModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: true,
      doctor: [],
      doctorEventsList: [],
      currentDoctorId: "",
      isVisible: false,
      isValid: false,
    };
    this.changeSchedule = this.changeSchedule.bind(this);
    this.onSetVisible = this.onSetVisible.bind(this);
    this.componentDidMount4 = this.componentDidMount4.bind(this);
  }

  toggleStatus = () => {
    this.setState({
      status: !this.state.status
    });
  }

  parseISOLocal(s) {
    let b = s.split(/\D/);
    return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
  }

  async componentDidMount4() {
    try {
      const conf = {
        headers: new Headers({"Authorization": "Token " + store.getState().status})
      };
      const name = "https://gicsaude.herokuapp.com/doctor/api-doctor/list-doctor/category/?name=" + this.props.currentdoctor;
      const res = await fetch(name, conf);
      const doctor = await res.json();
      this.setState({doctor});
    } catch (e) {
      console.log(e);
    }
  }

  async componentDidMount5() {
    var date = new Date(this.props.currentstart);
    var newStart = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    var resultStart = newStart.toISOString();
    date = new Date(this.props.currentend);
    var newEnd = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    var resultEnd = newEnd.toISOString();
    try {
      const conf = {
        headers: new Headers({"Authorization": "Token " + store.getState().status})
      };
      const name = "https://gicsaude.herokuapp.com/schedule/api-event/list-doctor/?doctor=" + this.state.currentDoctorId + '&start=' + resultStart + '&end=' + resultEnd;
      const res = await fetch(name,conf);
      const doctorEventsList = await res.json();
      this.setState({doctorEventsList});
    } catch (e) {
      console.log(e);
    }
  }



  async changeSchedule(e) {
    await this.componentDidMount4();
    this.setState({currentDoctorId: this.state.doctor[0].id});
    await this.componentDidMount5();
    this.setState({isVisible: !this.state.isVisible});
  }

    async changeSchedule2(e) {
      await this.componentDidMount4();
      this.setState({currentDoctorId: this.state.doctor[0].id});
      await this.componentDidMount5();
    }


  redirectPage(){
    if(this.state.isValid === true){
      window.location.href = "/ScheduleTable";
      }
  }

  handleDelete = e => {
    const conf = {
      method: "DELETE",
      headers: new Headers({"Content-Type": "application/json", "Authorization": "Token " + store.getState().status})
    };
    fetch("https://gicsaude.herokuapp.com/schedule/api-event/delete/" +this.props.currentid + "/", conf).then((res) => {
        this.state.isValid = true;
        this.redirectPage();
    });
  }

  onSetVisible(e){

    this.setState({isVisible: false});
  }

  render() {
    let form;
    if (this.state.isVisible) {
      form = (<FormUpdate eventid={this.state.doctorEventsList[0].id}></FormUpdate>);
    } else {
      form = (<div>
        <h5 className='beautiful_text'>Inicio</h5>
        <p className='beautiful_text'>{this.props.currentstart}</p>
        <h5 className='beautiful_text'>Fim</h5>
        <p className='beautiful_text'>{this.props.currentend}</p>
      </div>);
    }
    return (<Modal className="height-modal modal" {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
      <Modal.Header className="">
        <h2 className="modal-header-title">{this.props.currentdoctor}</h2>
      </Modal.Header>
      <Modal.Body className="modal-content">
        <div>
          <Button onClick={this.changeSchedule} bsStyle="primary">Alterar evento</Button>
          <br></br>
          <br></br>
          <Button onClick={this.handleDelete.bind(this)} bsStyle="primary">Deletar evento</Button>
          <br></br>
          <br></br>
          {form}
          <a onClick={this.props.onHide}><Button onClick={this.onSetVisible} bsStyle="danger">Close</Button></a>
          <br></br>
        </div>
      </Modal.Body>
    </Modal>);
  }
}
