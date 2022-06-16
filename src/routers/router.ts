import NotFoundPage from "../components/NotFound";
import Dashboard from "../pages/CMS/Dashboard";

// Private routes
export const privatesRoute = [
    {path: '/' , component : Dashboard},
]
export const publicRoute = [
    {path: '*' , component : NotFoundPage},
]