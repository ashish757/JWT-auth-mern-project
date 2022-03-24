import { useContext } from "react"
import { AuthContext } from "../../context"

function ProtectedComponent(props) {
    const {state: {isAuthenticated}} = useContext(AuthContext)

    if (props.hideWhenAuthenticated) {
        if (isAuthenticated) return  null
        else return <>{props.children}</>   
    }
    else {
        if (isAuthenticated) return  <>{props.children}</>   
        else return null
    }
}
export default ProtectedComponent