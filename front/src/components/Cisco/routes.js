import Dashboard from "./views/Dashboard.jsx";


const dashboardRoutes = [
  {
    path: "/",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/"
  },
  {
    path: "/tickets",
    name: "Tickets",
    icon: "pe-7s-note2",
    component: null,
    layout: "/admin"
  }
];

export default dashboardRoutes;
