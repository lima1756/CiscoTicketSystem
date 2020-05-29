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
    const { user, getIdTokenClaims } = useAuth0();
    const [searchResult, setSearchResult] = useState([]);
    const [loadingResults, setLoadingResults] = useState(true);
    const [numberResults, setNumberResults] = useState(1)
    const [isSearching, setIsSearching] = useState(false);
    const [specialFilter, setSpecialFilter] = useState(false);


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
                setSearchResult(res.data.map(e=>e.item))
            }).catch(err => {
                console.log(err);
            })
        }
    }

    const search = (ev) => {
        setIsSearching(true);
        setLoadingResults(true);
        setSearchResult([]);
        setNumberResults(1);
        setSpecialFilter(false)
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

    const userTickets = () => {
        if(specialFilter){
            setSpecialFilter(false);
            setLoadingResults(false);
            return;
        }
        setSearchResult([]);
        setIsSearching(false);
        setLoadingResults(true);
        setNumberResults(1);
        setSpecialFilter(true);
        setSearchValue("");
        axios.get("/ticket/user/"+user.sub, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            setNumberResults(res.data.length)
            setLoadingResults(false);
            setSearchResult(res.data);
        }).catch(err => {
            setNumberResults(0);
            console.log(err);
        })
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
                {(searchValue === "") &&
                    <Row>
                        <Col align="center" className="center-block" >
                            <Card style={{ width: '18rem', boxShadow: "2px 2px 4px #DADDD8" }} className="clickable" onClick={userTickets}>
                                <Card.Img variant="top" src="https://www.alphatechitsolutions.co.uk/wp-content/uploads/2018/11/illustrations-02.png" />
                                <Card.Body>
                                    <Card.Title>My tickets</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                        {!specialFilter && <Col align="center" className="center-block" >
                            <Card style={{ width: '18rem', boxShadow: "2px 2px 4px #DADDD8" }} >
                                <Card.Img variant="top" src="https://www.webnode.es/blog/files/2019/05/blog2.png" />
                                <Card.Body>
                                    <Card.Title>Knowledge</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>}
                    </Row>
                }
                {(searchValue !== "" || specialFilter) &&
                    <Row>
                        <Col align="center" className="center-block" >
                            <Table striped bordered hover className="search-results">
                                <tbody>
                                    {isSearching && <tr>
                                        <td colSpan={3}>
                                            {searchValue}
                                        </td>
                                        <td colSpan={1}>
                                            <Tabler.Button icon="plus" color="primary" outline onClick={()=>{history.push("/ticket/new/" + searchValue)}}>
                                                Create
                                                </Tabler.Button>
                                        </td>
                                    </tr>}
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
                                            <tr key={r._id} className="clickable" onClick={()=>{history.push("/ticket/"+r._id)}}>
                                                <td>{r.title}</td>
                                                <td>{r.company}</td>
                                                <td>{r.status}</td>
                                                <td>{r.type}</td>
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