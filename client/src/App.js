import React, { useEffect, useReducer, useState } from 'react'
import "./App.css"
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom"

import Nav from './components/Nav'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserProfile from './pages/UserProfile'
import PageNotFound from './pages/PageNotFound'
import { AuthContext } from "./context"
import reducer from './reducer/reducer';
import initialState from "./reducer/"


const App = () => {

    const [loading, setLoading] = useState(true)
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        fetch(`http://localhost:5000/api/auth/refreshToken`, {
            headers: {
                "content-type": "application/json"
            },
            credentials: "include"
        }).then(res => res.json()).then(res => {
            if (res.status) {
                dispatch({type: "SET_ACCESS_TOKEN", payload: {accessToken: res.accessToken}})
                setLoading(false)
            } else {
                dispatch({type: "REMOVE_ACCESS_TOKEN"})
                setLoading(false)
                console.log("SERVER ERROR AT HOME");
            }
        }).catch(e => console.log("Failed to refresh token At home"))
    }, [])
    
    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            <Router>
                <Nav />
                <Routes>

                    <Route path="/" element={<Home loading={loading} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route path="/" element={<ProtectedRoute loading={loading} />}>
                        <Route path="user/:id" element={<UserProfile />} />
                    </Route>

                    <Route path="*" element={<PageNotFound />} />

                </Routes>
            </Router>
        </AuthContext.Provider>
    )
}

export default App