import { useContext, useEffect, useState } from 'react'
import styles from './Login.module.css'
import {useNavigate, useLocation} from 'react-router-dom'
import { AuthContext } from "../../context"

export default function Login() {
    const {state, dispatch} = useContext(AuthContext)
    const navigate = useNavigate()
    
    
    const location = useLocation()
    
    const [formControl, setFormControl] = useState({
        email: "", password: ""
    })

    useEffect(() => {
        if (state.accessToken)  navigate(-1, {replace: true})
    })

    const formController = (e) => {
        setFormControl({ ...formControl, [e.target.name]: e.target.value })
    }

    const login = async (e) => {
        e.preventDefault()

        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            credentials: 'include',

            body: JSON.stringify({
                email: formControl.email,
                password: formControl.password,
            })
        })
        const jsonRes = await res.json()

        if (jsonRes.success) {
            console.log(jsonRes);
            dispatch({type: "SET_ACCESS_TOKEN", payload: {accessToken: jsonRes.accessToken}})

            const from  = location.state?.from?.pathname || "/";
            navigate(from, {replace: true})
        }
        else {
            // Internal Server Error
            // set error state
        }
    }

    
    

    return (
        <div className={styles.login}>
            <form className={styles.form} onSubmit={login}>
                <input type="text" placeholder='Email' name="email" value={formControl.email} onChange={formController} />
                <input type="text" placeholder='Password' name="password" value={formControl.password} onChange={formController} />
                <button>Login in</button>
            </form>
        </div>
    )
}