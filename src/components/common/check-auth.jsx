


import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const CheckAuth = ({isAuthenticated,user,children}) => {
    const location = useLocation()

    if(!isAuthenticated 
        && !(location.pathname.includes('/login')   // ager user authenticated nhi hai and woh kes or page per jana chalta hai to phier usko phale usko login karna hoga 
        || location.pathname.includes('register'))
    )
    {
       return <Navigate to = "/auth/login"  />;  
    }
     
    if(isAuthenticated  // ager user nhi login kar liya hai to usko login page yeah ragister page nhi dekhana hai 
        &&(location.pathname.includes('/login') 
        || location.pathname.includes('/register')) // abb check kareygey ke user ne login kiya hai ke admin login kiya hai
    ){
        if(user?.role === 'admin'){
            return <Navigate to = "/admin/dashboard" />  
        }else{
            return <Navigate to = "/shop/home" />
        }
    }
    if(isAuthenticated && user.role !== 'admin' && location.pathname.includes('admin')){  // customer ko admin page provide nhi karna hai
        return <Navigate to = "/unauth-page" />
    }

    if(isAuthenticated && user.role === 'admin' && location.pathname.includes('shop')){ // admin ko shop page provide nhi karna hai
        return <Navigate to ="/admin/dashboard" />
    }
    return <>{children}</>
}

export default CheckAuth
