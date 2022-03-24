import { useContext } from "react"
import { AuthContext } from "../context"

const useRefreshToken = () => {
    const { state, dispatch } = useContext(AuthContext)
    
    const refresh = async () => {
        const res = await fetch(`http://localhost:5000/api/auth/refreshToken`, {
            headers: {
                "content-type": "application/json"
            },
            credentials: "include"
        })
        
        const data = await res.json()
        
        if (data.status) {
            // console.log(state.accessToken)
            dispatch({type: "SET_ACCESS_TOKEN", payload: {accessToken: data.accessToken}})
            return data.accessToken
        } 
        console.log(data)
    }

    return refresh
    
}

export default useRefreshToken