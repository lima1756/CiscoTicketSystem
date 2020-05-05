import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Container, Table } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useAuth0 } from '../react-auth0-spa';
import * as Tabler from 'tabler-react';


export default function HomeSearch() {
    const [searchValue, setSearchValue] = useState("");
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [token, setToken] = useState("")
    const { getIdTokenClaims } = useAuth0();
    const [searchResult, setSearchResult] = useState([]);
    const [loadingResults, setLoadingResults] = useState(true);
    const [numberResults, setNumberResults] = useState(1)


    getIdTokenClaims().then((data) => { setToken(data.__raw) }).catch()


    const history = useHistory();


    const callSearch = (searchInput) => {
        if (searchInput === "")
            return () => { }
        return () => {
            setSearchResult([]);
            axios.get("/search/" + searchInput, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => {
                setNumberResults(res.data.length)
                setLoadingResults(false);
                setSearchResult(res.data)
            }).catch(err => {
                console.log(err);
            })
        }
    }

    const search = (ev) => {
        setLoadingResults(true);
        setSearchResult([]);
        setNumberResults(1);
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTypingTimeout(setTimeout(callSearch(ev.target.value), 475));
        setSearchValue(ev.target.value)
    }

    const newProblem = (ev) => {
        if (ev.keyCode === 13) {
            history.push("/ticket/new/" + searchValue)
        }
    }

    return (
        <div className="vertical-center">
            <Container className="align-items-center ">
                <Row>
                    <Col align="center" className="center-block" >
                        <Form className="form-group has-search">
                            <span className="fa fa-search form-control-feedback"></span>
                            <Form.Control type="text" placeholder="Search" value={searchValue} onChange={search} onKeyDown={newProblem} />
                        </Form>
                    </Col>
                </Row>
                {/* {(searchValue === "") &&
                    <Row>
                        <Col align="center" className="center-block" >
                            <Card style={{ width: '18rem', boxShadow: "2px 2px 4px #DADDD8" }} >
                                <Card.Img variant="top" src="https://www.alphatechitsolutions.co.uk/wp-content/uploads/2018/11/illustrations-02.png" />
                                <Card.Body>
                                    <Card.Title>My tickets</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col align="center" className="center-block" >
                            <Card style={{ width: '18rem', boxShadow: "2px 2px 4px #DADDD8" }} >
                                <Card.Img variant="top" src="https://www.webnode.es/blog/files/2019/05/blog2.png" />
                                <Card.Body>
                                    <Card.Title>Knowledge</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                } */}
                {(searchValue !== "") &&
                    <Row>
                        <Col align="center" className="center-block" >
                            <Table striped bordered hover className="search-results">
                                <tbody>
                                    <tr>
                                        <td colSpan={3}>
                                            {searchValue}
                                        </td>
                                        <td colSpan={1}>
                                            <Tabler.Button icon="plus" color="primary" outline onClick={()=>{history.push("/ticket/new/" + searchValue)}}>
                                                Create
                                                </Tabler.Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Title</th>
                                        <th>Company</th>
                                        <th>Status</th>
                                        <th>Type</th>
                                    </tr>
                                    {loadingResults &&
                                        <tr>
                                            <td colSpan={4}>
                                                <Tabler.Button loading color="secondary" block>{" "}
                                                </Tabler.Button>
                                            </td>
                                        </tr>
                                    }
                                    {searchResult.map((r) => {
                                        return (
                                            <tr k={r.item._id} className="search-row" onClick={()=>{history.push("/ticket/"+r.item._id)}}>
                                                <td>{r.item.title}</td>
                                                <td>{r.item.company}</td>
                                                <td>{r.item.status}</td>
                                                <td>{r.item.type}</td>
                                            </tr>
                                        )
                                    })}
                                    {numberResults === 0 &&
                                        <tr>
                                            <td colSpan={4}><b>No ticket found, please rewrite your search or submit a new ticket</b></td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                }

            </Container>

        </div>
    )
}