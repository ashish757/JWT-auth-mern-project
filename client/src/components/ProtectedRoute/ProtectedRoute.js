import {Navigate, Outlet, useLocation} from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../context"

function ProtectedRoute(props) {
    const {state: {isAuthenticated}} = useContext(AuthContext)

    const location =  useLocation() 
    
    if (props.loading) return <h1>Loading...</h1>
    
    if (!isAuthenticated) return <Navigate to="./login" state={{from: location}} replace />

    return  <Outlet />     
}

export default  ProtectedRoute