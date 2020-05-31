import React, { useState, useEffect }  from "react";
import Chartist from 'chartist';
import ChartistLegends from 'chartist-plugin-legend';
import ChartistGraph from "react-chartist";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useAuth0 } from '../../../react-auth0-spa';
import axios from 'axios';

import Card from "../components/Card.jsx";
import StatsCard from "../components/StatsCard.jsx";
import Tickets from "../components/Tickets";
import "../../../assets/sass/chartist-legends.scss";
import Pagination from 'react-bootstrap/Pagination';


export default function Dashboard(){

  const [token, setToken] = useState("")
  const [tickets, setTickets] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [lastMonthTickets, setLastMonthTickets] = useState([]);
  const [dataPie, setDataPie] = useState({labels: [], series: []})
  const [lineNotAssigned, setLineNotAssigned] = useState([]);
  const [lineAssigned, setLineAssigned] = useState([]);
  const [lineWorking, setLineWorking] = useState([]);
  const [lineCompleted, setLineCompleted] = useState([]);
  const [lineUrgent, setLineUrgent] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(["Completed"]);
  const { user, getIdTokenClaims } = useAuth0();

  new ChartistLegends();

  const legendPie = {
    names: ["Not assigned", "Assigned", "In progress", "Completed", "Urgent"],
    types: ["secondary", "primary", "info", "success","danger"]
  };
  const optionsPie = {
    labelOffset: 10,
    labelDirection: 'inside',
    ignoreEmptyValues: true,
    plugins: [Chartist.plugins.legend()]
  }

  // Data for Line Chart
var dataLine = {
  series: [
    lineNotAssigned, lineAssigned, lineWorking, lineCompleted, lineUrgent
    ]
  };
  var optionsLine = {
    low: 0,
    showArea: false,
    height: "245px",
    axisX: {
      showGrid: false
    },
    lineSmooth: false,
    showLine: true,
    showPoint: true,
    fullWidth: true,
    chartPadding: {
      right: 50
    },
    plugins: [Chartist.plugins.legend({
      legendNames: ["Not assigned", "Assigned", "Working", "Completed", "Urgent"],
    })]
  };
  var responsiveLine = [
    [
      "screen and (max-width: 640px)",
      {
        axisX: {
          labelInterpolationFnc: function(value) {
            return value[0];
          }
        }
      }
    ]
  ];
  var legendSales = {
    names: ["Open", "Click", "Click Second Time"],
    types: ["info", "danger", "warning"]
  };

  useEffect(()=>{getIdTokenClaims().then((data) => { setToken(data.__raw) }).catch()})
  
  
  useEffect(()=>{
    axios.get("/ticket", {
      headers: {
          'Authorization': `Bearer ${token}`
      }
    }).then(res => {
        setTickets(res.data);
        let startMonth = new Date();
        startMonth.setMonth(startMonth.getMonth()-1);
        let months  = res.data.filter((ticket)=> {
          let d = new Date(ticket.date);
          if(ticket.date && d>startMonth){
            return true;
          } 
          if(!ticket.date){
            return true;
          }
          return false;
        });
        setLastMonthTickets(months)

        let pie = [0,0,0,0,0];
        for(let i = 0; i < res.data.length; i++){
          switch(res.data[i].status){
            case "Not assigned": pie[0]++; break; 
            case"Assigned": pie[1]++; break; 
            case"Working": pie[2]++; break; 
            case"Completed": pie[3]++; break; 
            case"Urgent": pie[4]++; break;
            default: pie[0]++;
          }
        }

        let line = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        // [type][quarter]

        let q1 = new Date();
        q1.setHours(q1.getHours()-168*3);
        let q2 = new Date();
        q2.setHours(q2.getHours()-168*2);
        let q3 = new Date();
        q3.setHours(q3.getHours()-168*1);
        let q4 = new Date();
        for(let i = 0; i < months.length; i++){
          const d = new Date(months[i].date);
          if(months[i].date && d < q1){
            switch(res.data[i].status){
              case "Not assigned": line[0][0]++; break; 
              case"Assigned": line[1][0]++; break; 
              case"Working": line[2][0]++; break; 
              case"Completed": line[3][0]++; break; 
              case"Urgent": line[4][0]++; break;
              default: line[0][0]++;
            }
          } else if(months[i].date && d < q2) {
            switch(res.data[i].status){
              case "Not assigned": line[0][1]++; break; 
              case"Assigned": line[1][1]++; break; 
              case"Working": line[2][1]++; break; 
              case"Completed": line[3][1]++; break; 
              case"Urgent": line[4][1]++; break;
              default: line[0][1]++;
            }
          } else if(months[i].date && d < q3) {
            switch(res.data[i].status){
              case "Not assigned": line[0][2]++; break; 
              case"Assigned": line[1][2]++; break; 
              case"Working": line[2][2]++; break; 
              case"Completed": line[3][2]++; break; 
              case"Urgent": line[4][2]++; break;
              default: line[0][2]++;
            }
          } else if(months[i].date && d < q4) {
            switch(res.data[i].status){
              case "Not assigned": line[0][3]++; break; 
              case"Assigned": line[1][3]++; break; 
              case"Working": line[2][3]++; break; 
              case"Completed": line[3][3]++; break; 
              case"Urgent": line[4][3]++; break;
              default: line[0][3]++;
            }
          } else {
            switch(res.data[i].status){
              case "Not assigned": line[0][3]++; break; 
              case"Assigned": line[1][3]++; break; 
              case"Working": line[2][3]++; break; 
              case"Completed": line[3][3]++; break; 
              case"Urgent": line[4][3]++; break;
              default: line[0][3]++;
            }
          }
        }

        setLineNotAssigned(line[0]);
        setLineAssigned(line[1]);
        setLineWorking(line[2]);
        setLineCompleted(line[3]);
        setLineUrgent(line[4]);

        setDataPie({
          labels: pie.map((i, key)=>{
            if(i === 0) return "";
            return legendPie.names[key]+" "+(i*100/res.data.length)+"%";
          }),
          series: pie
        });
    }).catch(err => {
        console.log(err);
    })
  }, [token])
  
  const createLegend = (json) => {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  };

  const callSearch = (search) => {
    setSearchValue(search)
  };

  const search = (ev) => {
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    setTypingTimeout(setTimeout(callSearch(ev.target.value), 475));
  };

  const filtering = (data) => {
    if(filter.includes(data)){
      setFilter(filter.filter(i=>i!==data));
    } else {
      setFilter(filter.concat(data));
    }
  }

  const pages = [];
  const totalPages = Math.ceil(tickets.length / pageSize);
  if(totalPages<=4){
    for(let i = 1; i<=totalPages; i++){
      if(currentPage === i)
        pages.push(<Pagination.Item active key={i}>{i}</Pagination.Item>)
      else
        pages.push(<Pagination.Item key={i}>{i}</Pagination.Item>)
    }
  } else {
    if(currentPage<=3){
      pages.push(<Pagination.Item active={totalPages-2===currentPage} key={1}>1</Pagination.Item>)
      pages.push(<Pagination.Item active={totalPages-2===currentPage} key={2}>2</Pagination.Item>)
      pages.push(<Pagination.Item active={totalPages-2===currentPage} key={3}>3</Pagination.Item>)
      pages.push(<Pagination.Ellipsis/>)
    }
    else if(currentPage>=totalPages-2){
      pages.push(<Pagination.Ellipsis/>)
      pages.push(<Pagination.Item active={totalPages-2===currentPage} key={totalPages-2}>{totalPages-2}</Pagination.Item>)
      pages.push(<Pagination.Item active={totalPages-2===currentPage} key={totalPages-1}>{totalPages-1}</Pagination.Item>)
      pages.push(<Pagination.Item active={totalPages-2===currentPage} key={totalPages}>{totalPages}</Pagination.Item>)
    }
    else{
      pages.push(<Pagination.Ellipsis/>)
      pages.push(<Pagination.Item key={currentPage-1}>{currentPage-1}</Pagination.Item>)
      pages.push(<Pagination.Item active key={currentPage}>{currentPage}</Pagination.Item>)
      pages.push(<Pagination.Item key={currentPage+1}>{currentPage+1}</Pagination.Item>)
      pages.push(<Pagination.Ellipsis/>)
    }
  }

  return (
    <div className="content">
      <Container style={{paddingTop:"2.5em"}}>
        <Row>
          <Col lg={6} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-headphones text-warning" />}
              statsText="Total tickets"
              statsValue={tickets.length}
              statsIcon={<i className="fa fa-clock-o" />}
              statsIconText="In last 30 days"
            />
          </Col>
          <Col lg={6} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-graph1 text-danger" />}
              statsText="Urgent tickets"
              statsValue={tickets.reduce((acc, ticket) => {if(ticket.status === "Urgent") return acc +1; return acc;}, 0)}
              statsIcon={<i className="fa fa-clock-o" />}
              statsIconText="Today"
            />
          </Col>
        </Row>

        <Row>

          <Col md={12}>
            <Card
              title="Tickets"
              category="Pending tickets"
              content={
                <div>
                  <Form className="form-group">
                      <Form.Control type="text" placeholder="Search" value={searchValue} onChange={search}/>
                      <Form.Check inline label="Not assigned" type="checkbox" defaultChecked onClick={()=>{filtering("Not assigned")}}/>
                      <Form.Check inline label="Assigned" type="checkbox"  defaultChecked onClick={()=>{filtering("Assigned")}}/>
                      <Form.Check inline label="In progress" type="checkbox" defaultChecked onClick={()=>{filtering("In progress")}}/>
                      <Form.Check inline label="Urgent" type="checkbox" defaultChecked onClick={()=>{filtering("Urgent")}}/>
                      <Form.Check inline label="Completed" type="checkbox"  onClick={()=>{filtering("Completed")}}/>
                  </Form>
                  <Tickets tickets={tickets} pageSize={6} page={1} exclude={filter} search={searchValue}/>
                  <Pagination>
                    <Pagination.First />
                    <Pagination.Prev />
                    {pages}
                    <Pagination.Next />
                    <Pagination.Last />
                  </Pagination>
                </div>
                
              }
            />
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Card
              statsIcon="fa fa-history"
              id="chartHours"
              title="Tickets status"
              stats="In last month"
              content={
                <div className="ct-chart">
                  <ChartistGraph
                    data={dataLine}
                    type="Line"
                    options={optionsLine}
                    responsiveOptions={responsiveLine}
                  />
                </div>
              }
              legend={
                <div className="legend">{createLegend(legendSales)}</div>
              }
            />
          </Col>
          <Col md={4}>
            <Card
              statsIcon="fa fa-clock-o"
              title="Ticket Statistics"
              stats="Campaign sent 2 days ago"
              content={
                <div
                  id="chartPreferences"
                  className="ct-chart ct-perfect-fourth"
                >
                  <ChartistGraph data={dataPie} type="Pie" options={optionsPie}/>
                </div>
              }
              legend={
                <div className="legend">{createLegend(legendPie)}</div>
              }
            />
          </Col>
        </Row>

      </Container>
    </div>
  );

}