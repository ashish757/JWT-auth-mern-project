import styles from "./Nav.module.css"
import { Link } from 'react-router-dom'
import ProtectedComponent from "../ProtectedComponent/ProtectedComponent"
import { AuthContext } from "../../context"
import { useContext } from "react"
import useFetchPrivate from "../../hooks/useFetchPrivate"



export default function Nav() {
    const {dispatch} = useContext(AuthContext)
    const useFetch = useFetchPrivate()

    
    const Logout = async () => {
        const FetchUsers = async () => {
            const res = await useFetch(`auth/logout`, "DELETE", {config: {credentials: "include"}})
            
            console.log(res);

            if (res.status) {
                dispatch({type: "REMOVE_ACCESS_TOKEN"})
            console.log("NAV LOGGEDOUT")
            } else {
                console.error(res)
            }
        }
        FetchUsers()
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
