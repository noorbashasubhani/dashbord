import React,{createContext} from "react";

export const UserContext = createContext();

export const UserProvider = ({children})=>{
     const users={
        name:"fissss",
        fullname:"noorbashas "
     }
    return( <UserContext.Provider value={users}>{children}</UserContext.Provider> );
}