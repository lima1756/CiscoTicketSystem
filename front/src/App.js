import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth0 } from './react-auth0-spa';
import { Card, Button, Col } from 'react-bootstrap';
import HomeSearch from './pages/HomeSearch';
import history from './utils/history'
import TicketManipulation from './components/Partner/TicketManipulation';
import axios from 'axios';
import TicketView from './components/Partner/TicketView';
import Dashboard from './components/Cisco/views/Dashboard';
import CiscoTicketManipulation from './components/Cisco/views/TicketManipulation';
import CiscoTicketView from './components/Cisco/views/TicketManipulation';
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

export default function App() {
  const { isAuthenticated, loginWithRedirect, logout, getIdTokenClaims, user } = useAuth0();

  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  let body;
  if (isAuthenticated) {
    getIdTokenClaims().then((data)=>{
      axios.get('/user/auth/' + user.sub, {
        headers: {
          'Authorization': `Bearer ${data.__raw}`
        }
      })
        .then()
        .catch(err=>{
          axios.post('/user', {name:user.name, type:"a", authOId:user.sub, company:"cisco"}, {headers:{"Authorization":`Bearer ${data.__raw}`}}).then().catch();
        })
    }).catch()

    let cisco = true;
    
    if(cisco){
      body = (
        <Router history={history}>
          <Route path="/" exact component={Dashboard} />
          <Route path="/ticket/edit/:id" exact component={CiscoTicketManipulation} />
          <Route path="/ticket/:id" exact component={CiscoTicketView} />
        </Router>
      )
    }
    else {
      body = (
        <Router history={history}>
          <Route path="/" exact component={HomeSearch} />
          <Route path="/ticket/new" exact component={TicketManipulation} />
          <Route path="/ticket/new/:problem" exact component={TicketManipulation} />
          <Route path="/ticket/edit/:id" exact component={TicketManipulation} />
          <Route path="/ticket/:id" exact component={TicketView} />
          <Route path="/tickets" exact component={null} />
        </Router>
      )
    }
    
  }
  else {
    body = (
      <div className="h-100 row align-items-center">
        <Col align="center" className="center-block" >
          <Card style={{ width: '18rem', boxShadow: "2px 2px 4px #DADDD8" }} >
            <Card.Img variant="top" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/1200px-Cisco_logo_blue_2016.svg.png" />
            <Card.Body>
              <Card.Title>Ticket Service</Card.Title>
              <Button variant="primary" onClick={() => loginWithRedirect({})} size="lg" block> Login</Button>
            </Card.Body>
          </Card>
        </Col>
      </div>
    )
  }

  return body;
}

