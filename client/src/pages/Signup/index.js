import { useContext, useState, useEffect } from 'react'
import styles from './Signup.module.css'
import {useLocation, useNavigate} from 'react-router-dom'
import { AuthContext } from '../../context'

export default function Signup() {
    const {state, dispatch} = useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()
    const [formControl, setFormControl] = useState({
        name: "", email: "", password: ""
    })

    useEffect(() => {
        if (state.accessToken)  navigate(-1, {replace: true})
    })

    const formController = (e) => {
        setFormControl({ ...formControl, [e.target.name]:e.target.value })
    }

    const signup = async (e) => {
        e.preventDefault()

        const res = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: formControl.name,
                email: formControl.email,
                password: formControl.password,
            })
        })
        const jsonRes = await res.json()
        if (jsonRes.success) {
            
            console.log(jsonRes);
            dispatch({type: "SET_ACCESS_TOKEN", payload: {accessToken: jsonRes.accessToken}})

            /// replace:true will go to the new destination but won't let the browser back to the current url that is the signup ulr
            const from  = location.state?.from?.pathname || "/";
            navigate(from, {replace: true})
        }
        else {
            // Error
        }
    }

 

    return ( 
        <div className={styles.signup} onSubmit={signup}>
            <form className={styles.form}>
                <input type="text" placeholder='Name' name="name" value={formControl.name} onChange={formController} />
                <input type="text" placeholder='Email' name="email" value={formControl.email} onChange={formController} />
                <input type="text" placeholder='Password' name="password" value={formControl.password} onChange={formController} />
                <button>Sign up</button>
            </form>
        </div>
    ) 
}