import NotFoundPage from "../components/NotFound";
import Dashboard from "../pages/CMS/Dashboard";
import ManagerTicket from "../pages/CMS/ManagerTicket";

// Private routes
export const privatesRoute = [
    {path: '/' , component : Dashboard},
    {path: '/manager-ticket' , component : ManagerTicket},

]
export const publicRoute = [
    {path: '*' , component : NotFoundPage},
]