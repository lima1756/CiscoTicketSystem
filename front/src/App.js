import React from 'react';
import { Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth0 } from './react-auth0-spa';
import { Card, Button, Col } from 'react-bootstrap';
import HomeSearch from './pages/HomeSearch';
import TicketManipulation from './components/Partner/TicketManipulation';
import axios from 'axios';
import TicketView from './components/Partner/TicketView';
import Dashboard from './components/Cisco/views/Dashboard';
import CiscoTicketManipulation from './components/Cisco/views/TicketManipulation';
import CiscoTicketView from './components/Cisco/views/TicketView';
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import { useHistory } from "react-router-dom";

export default function App() {
  const { isAuthenticated, loginWithRedirect, logout, getIdTokenClaims, user } = useAuth0();
  const { loading } = useAuth0();
  const history = useHistory();

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
          <>
          <Route path="/" exact component={Dashboard} />
          <Route path="/ticket/edit/:id" exact component={CiscoTicketManipulation} />
          <Route path="/ticket/:id" exact component={CiscoTicketView} />
          </>
      )
    }
    else {
      body = (
          <>
          <Route path="/" exact component={HomeSearch} />
          <Route path="/ticket/new" exact component={TicketManipulation} />
          <Route path="/ticket/new/:problem" exact component={TicketManipulation} />
          <Route path="/ticket/edit/:id" exact component={TicketManipulation} />
          <Route path="/ticket/:id" exact component={TicketView} />
          <Route path="/tickets" exact component={null} />
          </>
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

  return (<>
    <span onClick={()=>{history.push("/")}} className="clickable" id="page_logo">
      <img  src="data:image/png;base64,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" alt="Cisco logo"/>
    </span>
    {body}
  </>);
}

