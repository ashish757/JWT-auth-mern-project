import jwtDecode from "jwt-decode";
import { useContext } from "react"
import { AuthContext } from "../context"
import useRefreshToken from "./useRefreshToken";


const useFetchPrivate = () => {

    const { state } = useContext(AuthContext)
    const refresh = useRefreshToken()

    if (!state.accessToken) return 

    const useFetch = async (url, options, method) => {
        // check for access token expiration and if refresh token
        const decoded = jwtDecode(state.accessToken);
        console.log(decoded.exp * 1000,  Date.now());
        console.log(decoded.exp * 1000 < Date.now());

        if (decoded.exp * 1000 < Date.now()) {
            state.accessToken = await refresh()
            // console.log(state.accessToken)
            // return;
        }

        const res = await fetch(`http://localhost:5000/api/${url}`, {
            method: method,
            // credentials: "include",
            headers: {
                "content-type": "application/json",
                "x-access-token": state.accessToken,
                ...options.headers
            },
            body: JSON.stringify(options.body)
        })

        return await res.json()
    }

    return useFetch 
}


export default useFetchPrivate