import ReactDOM from 'react-dom/client';
import React, { useState } from "react";
import "./style.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useLocation,
} from 'react-router-dom';
import $ from 'jquery';
let title = "Cultural Programmes Collection Website";

const fakeData_Event = [{"ID":1,"name":"Errol","price":32,"quota":45},
{"ID":2,"name":"Bobbe","price":71,"quota":9},
{"ID":3,"name":"Pasquale","price":19,"quota":36},
{"ID":4,"name":"Maridel","price":92,"quota":88},
{"ID":5,"name":"Arthur","price":47,"quota":99},
{"ID":6,"name":"Joleen","price":97,"quota":15},
{"ID":7,"name":"Jeanne","price":31,"quota":65},
{"ID":8,"name":"Rachel","price":8,"quota":33},
{"ID":9,"name":"Hildagarde","price":68,"quota":34},
{"ID":10,"name":"Glenn","price":86,"quota":74}]

export default class Admin extends React.Component{


    render() {
       return (<body style={{ backgroundColor: "#FBE8A6", minHeight: "100vh"}}>
                <div className='row' style={{width: "100%"}}>
                  <Logout logout={this.props.logout}/>
                  <div className='col-sm-1'></div>
                  <h1 className='col-sm-8' style={{textAlign: "center", marginTop: 0}}>{title}</h1>
                </div>
                <h1 style={{width: "100%", textAlign: "center", marginTop: 30}}>Admin Dashboard</h1>
                <br />
                  <NavTable />
              </body>
    )}
}

class Logout extends React.Component{
  render() {
    return (
      <button className='col-sm-1 btn btn-primary' style={{backgroundColor: "#303C6C"}} onClick={() => this.props.logout(false, undefined)}>Logout</button>
    )
  }
}

class NavTable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {viewEvent: true};
  }
  render() {
    return (
      <div className='container'>
      <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: "#D2FDFF"}}>
        <div className='collapse navbar-collapse'>
          <ul className='navbar-nav'>
            <li className='nav-item active'>
              <a className='nav-link' href="#" style={this.state.viewEvent?{fontWeight: "bolder", color: "Highlight"}:{fontWeight: "bolder"}} onClick={() => this.setState({viewEvent: true})}>Events</a>
            </li>
            <li className='nav-item active' style={{marginLeft: "10vw"}}>
              <a className='nav-link' href="#" style={!this.state.viewEvent?{fontWeight: "bolder", color: "Highlight"}:{fontWeight: "bolder"}} onClick={() => this.setState({viewEvent: false})}>Users</a>
            </li>
          </ul>
        </div>
      </nav>
        {this.state.viewEvent ? <EventTable /> : <></>}
      </div>
    )
  }
}

class EventTable extends React.Component{
  render() {
    return(<table className="table" style={{backgroundColor: "#F4976C"}}>
      <thead>
      <tr>
        <th style={{width: "20%"}}>ID</th>
        <th style={{width: "20%"}}>Name</th>
        <th style={{width: "20%"}}>Price</th>
        <th style={{width: "20%"}}>Quota</th>
        <th style={{width: "20%"}}>Action</th>
      </tr>
      </thead>
      <tbody>
        {fakeData_Event.map((data) => <EventTableRow data={data}/>)}
      </tbody>
  </table>)
  }
}

class EventTableRow extends React.Component{
  render(){
    return (
      <tr>
        <th>{this.props.data["ID"]}</th>
        <th>{this.props.data["name"]}</th>
        <th>${this.props.data["price"]}</th>
        <th>{this.props.data["quota"]}</th>
        <th>
          <button className='btn' style={{maxHeight:35}}><i class="bi bi-pencil-square"/></button>
          <button className='btn' style={{maxHeight:35}}><i class="bi bi-trash3"/></button>
          </th>
      </tr>
    )
  }
}