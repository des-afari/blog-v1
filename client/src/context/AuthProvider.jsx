import { createContext, useState, useEffect } from "react"

const AuthContext = createContext({});


// eslint-disable-next-line react/prop-types
export const AuthProvider = props => {
    const { children } = props
    const [auth, setAuth] = useState({})


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))

        if (user) {
            const date = new Date()

            if (date.getTime() > user.expiry) {
                localStorage.removeItem('user')
            }
        }
       

    }, [])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext