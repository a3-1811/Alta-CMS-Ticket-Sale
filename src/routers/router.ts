import NotFoundPage from "../components/NotFound";
import CheckingTicket from "../pages/CMS/CheckingTicket";
import Dashboard from "../pages/CMS/Dashboard";
import ManagerTicket from "../pages/CMS/ManagerTicket";
import TicketPackage from "../pages/CMS/TicketPackage";

// Private routes
export const privatesRoute = [
    {path: '/' , component : Dashboard},
    {path: '/manager-ticket' , component : ManagerTicket},
    {path: '/ticket-package' , component : TicketPackage},

]
export const customRoute = [
    {path: '/checking-ticket' , component : CheckingTicket},
]
export const publicRoute = [
    {path: '*' , component : NotFoundPage},
]