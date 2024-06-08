import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";
export default function PrivateRoute({ permittedRoles, children}){
    const { user} = useAuth() 
    
    if(!user.isLoggedIn && localStorage.getItem('token')) {
        return <p>loading...</p>
    }

    if(!user.isLoggedIn) {
        return <Navigate to="/login" /> 
    }


    return children
}