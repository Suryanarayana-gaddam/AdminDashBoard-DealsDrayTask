import {createBrowserRouter} from "react-router-dom"
import App from "../App"
import Home from "../components/Home"
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import LogOut from "../components/LogOut";
import EmployeeList from "../components/EmployeeList";
import Test from "../components/Test";
import EditEmployee from "../components/EditEmployee";

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "/",
                element : <Home/>
            },
            {
                path : "/test",
                element : <Test/>
            },
            {
                path : "/employee-list",
                element : <EmployeeList/>
            },
            {
                path :`edit/employee/:employeeId`,
                element : <EditEmployee/>,
                loader : ({params}) => fetch(`http://localhost:5080/get/employee/${params.employeeId}`,{
                    method : "GET",
                    headers : {
                        "Content-type" :"application/json"
                    }
                })
            },
        ]
    },{
        path : "/signup",
        element : <SignUp/>
    },{
        path : "/login",
        element : <Login/>
    },{
        path : "/logout",
        element : <LogOut/>
    }
]);

export default router;