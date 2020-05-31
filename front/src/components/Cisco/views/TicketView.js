import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Container, Button } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useAuth0 } from '../../../react-auth0-spa';
import { ProgressCard, StampCard, ContactCard, Icon } from 'tabler-react';
import * as Tabler from 'tabler-react';
import { progress } from '../../../utils/constants';
import { useHistory } from "react-router-dom";




export default function TicketView() {
    const { id } = useParams();
    const [token, setToken] = useState("")
    const [localUser, setLocalUser] = useState({ name: "" });
    const { user, getIdTokenClaims } = useAuth0();
    const [ticket, setTicket] = useState({
        title: "",
        description: "",
        priority: "",
        status: "Not Assigned",
        type: "",
        user: "",
        company: "",
        comments: []
    });
    const history = useHistory();


    useEffect(() => {
        getIdTokenClaims().then((data) => {
            setToken(data.__raw)
            axios.get("/ticket/" + id, {
                headers: {
                    'Authorization': `Bearer ${data.__raw}`
                }
            }
            ).then(res => {
                setTicket(res.data)
                axios.get('/user/auth/' + res.data.user, {
                    headers: {
                        'Authorization': `Bearer ${data.__raw}`
                    }
                }).then((res) => setLocalUser(res.data)).catch();
            }).catch(err => {
                console.log(err);
            })
        }).catch()
    }, []);

    const completed = (ticket) => {
        ticket.status="Completed";
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

    const comments = ticket.comments.map((comment, key) => {
        return (<p key={key}><b>adasd</b>{' '}<small>(asfdasdf)</small>: fadsfafadsfasd gasgarw gare gvsaer gv saergvasgar gvbazdfv czvczxv</p>)
    })


    return (
        <div className="vertical-center">
            <Container className="align-items-center ">
                <Row>
                    <Col >
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <Row>
                                        <Icon prefix="fa" name={ticket.public ? "lock-open" : "lock"} /> {ticket.title}
                                    </Row>
                                </Card.Title>
                                <Row>
                                    <Col>
                                        <Tabler.Card>
                                            <Tabler.Card.Status color="blue" side />
                                            <Tabler.Card.Header>
                                                <Tabler.Card.Title>
                                                    Problem description
                                                </Tabler.Card.Title>
                                            </Tabler.Card.Header>
                                            <Tabler.Card.Body>
                                                {ticket.description}
                                            </Tabler.Card.Body>
                                        </Tabler.Card>
                                    </Col>
                                    <Col>
                                        <ProgressCard header={"Status: " + ticket.status} progressWidth={progress[ticket.status.toLocaleLowerCase()].value} progressColor={progress[ticket.status.toLocaleLowerCase()].color} />
                                        <StampCard icon="fa-bolt" color="blue">
                                            {ticket.type}
                                        </StampCard>
                                    </Col>
                                </Row>
                                <Row>
                                    <ContactCard rounded objectURL={`data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2264%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ec911398e%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ec911398e%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2213.84375%22%20y%3D%2236.65%22%3E64x64%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`}
                                        cardTitle={"Requested by: " + localUser.name} name={localUser.name} address={{ line1: ticket.company }} description={`Some company description.`} />
                                </Row>
                                <Row>
                                    <Tabler.Card title="Comments" isCollapsible>
                                        <Tabler.Card.Body>
                                            {comments}
                                            <Form>
                                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                                    <Form.Label>New comment</Form.Label>
                                                    <Form.Control as="textarea" rows="2" />
                                                </Form.Group>
                                                <Button>Send</Button>
                                            </Form>
                                        </Tabler.Card.Body>
                                    </Tabler.Card>
                                </Row>
                                <Row>
                                    <Button variant="outline-primary" onClick={()=>{history.push("/ticket/edit/" + ticket._id)}}>Modify</Button> {" "}
                                    <Button variant="outline-success" onClick={()=>{completed(ticket)}}>Completed Ticket</Button>
                                </Row>
                            </Card.Body>
                        </Card >
                    </Col>
                </Row>
            </Container>
        </div >
    )
}