import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Container, Button } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useAuth0 } from '../../../react-auth0-spa';
import { useHistory } from "react-router-dom";




export default function TicketManipulation() {
    const { problem, id } = useParams();
    const [token, setToken] = useState("")
    const { user, getIdTokenClaims } = useAuth0();
    const [ticket, setTicket] = useState({
        title: problem ? problem : "",
        description: "",
        priority: "Not assigned",
        status: "Not assigned",
        type: "Servers",
        user: user.sub,
        company: "cisco",
        public: false
    });
    const history = useHistory();
    getIdTokenClaims().then((data) => { setToken(data.__raw) }).catch()

    useEffect(()=>{
        if(id) {
            axios.get("/ticket/" + id, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            ).then(res => {
                setTicket(res.data)
            }).catch(err => {
                console.log(err);
            })
        }
    }, [id, token])
    

    const modifyField = (field) => {
        return (ev) => {
            const copy = JSON.parse(JSON.stringify(ticket));
            if(field==="public"){
                copy[field] = ev.target.checked;
            }
            else {
                copy[field] = ev.target.value;
            }
            setTicket(copy)
        }
    }
    const submit = () => {
        if(id){
            axios.put("/ticket/"+id, ticket, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            ).then(res => {
                history.push("/ticket/" + res.data._id)
            }).catch(err => {
                console.log(err);
            })
        }
        else {
            axios.post("/ticket", ticket, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            ).then(res => {
                history.push("/ticket/" + res.data._id)
            }).catch(err => {
                console.log(err);
            })
        }
    }

    return (
        <div className="vertical-center">
            <Container className="align-items-center ">
                <Row>
                    <Col  >
                        <Card body>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" placeholder="Title of your problem" value={ticket.title} onChange={modifyField("title")} />
                                    <Form.Text className="text-muted"> An small description of your problem so we can classify it.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control as="select" custom value={ticket.type} onChange={modifyField("status")}>
                                        <option>Not assigned</option>
                                        <option>Assigned</option>
                                        <option>In progress</option>
                                        <option>Completed</option>
                                        <option>Urgent</option>
                                    </Form.Control>
                                    <Form.Text className="text-muted">
                                        Select the current status
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" rows="3" value={ticket.description} onChange={modifyField("description")} />
                                    <Form.Text className="text-muted" >
                                        Please be as detailed as posible, so we can help you as fast as posible.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control as="select" custom value={ticket.type} onChange={modifyField("type")}>
                                        <option>Servers</option>
                                        <option>Hardware</option>
                                        <option>Webex</option>
                                        <option>Teams</option>
                                        <option>Other</option>
                                    </Form.Control>
                                    <Form.Text className="text-muted">
                                        Select the category that is the clossest as your problem
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Make this ticket public"
                                        defaultChecked={ticket.public}

                                        onChange={modifyField("public")}
                                        />
                                </Form.Group>
                                <Button variant="success" onClick={submit}>
                                    Save
                                </Button>
                            </Form>
                        </Card >
                    </Col>
                </Row>
            </Container>
        </div>
    )
}