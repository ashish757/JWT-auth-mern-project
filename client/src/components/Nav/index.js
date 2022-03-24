import styles from "./Nav.module.css"
import { Link } from 'react-router-dom'
import ProtectedComponent from "../ProtectedComponent/ProtectedComponent"
import { AuthContext } from "../../context"
import { useContext } from "react"


export default function Nav() {
    const {dispatch} = useContext(AuthContext)


    
    const Logout = async () => {
        const res = await fetch("http://localhost:5000/api/auth/logout", {
            method: "DELETE", 
            credentials: "include",
            headers: {
                "content-type": "application/json",
            }
        })

        if (res.status) {
            dispatch({type: "REMOVE_ACCESS_TOKEN"})
            console.log("NAV LOGGEDOUT")

        } else {
            console.error(res)
        }
    }

    return (
        <nav className={styles.nav}>
            <ul>
                <li><Link to="/">Home</Link></li>
                <ProtectedComponent hideWhenAuthenticated>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Sign up</Link></li>
                </ProtectedComponent>
                
                <ProtectedComponent>
                    <button onClick={Logout}>Logout</button>
                </ProtectedComponent>
            </ul>
        </nav>
    )
}
