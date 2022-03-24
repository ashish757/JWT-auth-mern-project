const reducer = (state, action) => {
    switch (action.type) {
        // case "SET_AUTH":
        //     return {...state, isAuthenticated: action.payload.auth}

        case "SET_ACCESS_TOKEN":
            return {...state, accessToken: action.payload.accessToken, isAuthenticated: true}

        case "REMOVE_ACCESS_TOKEN":
            console.log("REducer LOGGEDOUT")

            return {...state, accessToken: "", isAuthenticated: false}

        default:
            return {...state}
    }
}

export default reducer