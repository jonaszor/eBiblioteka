import { useState, useEffect } from "react";
import AuthService from "./auth.service";

const useUser = () =>{
    const [user, setUser] = useState(undefined);

    useEffect(()=>{
        const user = AuthService.getCurrentUser();

        if (user) {
            setUser(user);
        }
    },[])

    return [user];
}

export default useUser;