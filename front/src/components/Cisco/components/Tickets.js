import React from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import Button from "./CustomButton.jsx";
import Fuse from 'fuse.js';


/**
 * Props: tickets={tickets} pageSize={6} page={1} exclude={"Completed"}
 */

export default function Tickets(props) {
    
    const edit = <Tooltip id="edit_tooltip">Update Ticket</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Completed Ticket</Tooltip>;
    const exclude = props.exclude;
    let tickets;
    if(props.search !== ""){
      tickets = search(props.search, props.tickets).filter((ticket)=> !exclude.includes(ticket.status));  
      console.log(tickets);
    }
    else {
      tickets = props.tickets.filter((ticket)=> !exclude.includes(ticket.status));
    }
    const table = [];
    for (var i = props.pageSize * (props.page-1); i < props.pageSize * props.page && i<tickets.length; i++) {
      table.push(
        <tr key={i}>
          <td>{tickets[i].title}</td>
          <td className="td-actions text-right">
            <OverlayTrigger placement="top" overlay={edit}>
              <Button bsstyle="info" simple type="button" bssize="xs">
                <i className="fa fa-edit" />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={remove}>
              <Button bsstyle="danger" simple type="button" bssize="xs">
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