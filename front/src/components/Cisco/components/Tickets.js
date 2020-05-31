import React, {useState} from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import Button from "./CustomButton.jsx";
import Fuse from 'fuse.js';
import { useHistory } from "react-router-dom";
import { useAuth0 } from '../../../react-auth0-spa';
import axios from 'axios';


/**
 * Props: tickets={tickets} pageSize={6} page={1} exclude={"Completed"}
 */

export default function Tickets(props) {
    const [token, setToken] = useState("")
    const edit = <Tooltip id="edit_tooltip">Update Ticket</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Completed Ticket</Tooltip>;
    const exclude = props.exclude;
    const history = useHistory();
    const { user, getIdTokenClaims } = useAuth0();
    getIdTokenClaims().then((data) => { setToken(data.__raw) }).catch()

    const completed = (ticket) => {
      ticket.status="Completed";
      axios.put("/ticket/"+ticket._id, ticket, {
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

    let tickets;
    if(props.search !== ""){
      tickets = search(props.search, props.tickets).filter((ticket)=> !exclude.includes(ticket.status));  
      console.log(tickets);
    }
    else {
      tickets = props.tickets.filter((ticket)=> !exclude.includes(ticket.status));
    }
    const table = [];
    for (let i = props.pageSize * (props.page-1); i < props.pageSize * props.page && i<tickets.length; i++) {
      table.push(
        <tr key={i}>
          <td className="clickable" onClick={()=>{history.push("/ticket/"+tickets[i]._id)}}>{tickets[i].title}</td>
          <td className="td-actions text-right">
            <OverlayTrigger placement="top" overlay={edit} >
              <Button bsstyle="info" simple type="button" bssize="xs" onClick={()=>{history.push("/ticket/edit/" + tickets[i]._id)}}>
                <i className="fa fa-edit" />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={remove}>
              <Button bsstyle="success" simple type="button" bssize="xs" onClick={()=>{completed(tickets[i])}}>
                <i className="fa fa-check" />
              </Button>
            </OverlayTrigger>
          </td>
        </tr>
      );
    }
    return (
      <div className="table-full-width">
        <table className="table">
          <tbody>{table}</tbody>
        </table>
      </div>
    );
}



function search(input, tickets){
  const data = tickets.map( s => {return combineAllKeyValues(s, null)});
  const fuzeOptions = {
      shouldSort: true,
      threshold: 0.6,
      isCaseSensitive: false,
      keys: [
          "_id",
          "title",
          "description",
          "all"
        ]
  }
  const fuse = new Fuse(data, fuzeOptions);
  return fuse.search(input).map(f=>f.item);
}

function combineAllKeyValues( obj, separator )
{
  separator = separator || " ";
  let d = {...JSON.parse(JSON.stringify(obj)), ...{"all":Object.keys(JSON.parse(JSON.stringify(obj))).map(s => obj[s]).join( separator )}};
  return d;
}