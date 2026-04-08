
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const navigate = useNavigate()

    //  LOGIN
    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)

            // 👉 redirect to home
            navigate("/")

        } catch (err) {
            console.log("Login failed")
            alert(err?.response?.data?.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    // REGISTER
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)

            // 👉 auto redirect (since auto login)
            navigate("/")

        } catch (err) {
            console.log("Register failed")
            alert(err?.response?.data?.message || "Register failed")
        } finally {
            setLoading(false)
        }
    }

    //  LOGOUT
    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()

            setUser(null)

            // 👉 redirect to login
            navigate("/login")

        } catch (err) {
            console.log("Logout failed")
        } finally {
            setLoading(false)
        }
    }

    // CHECK USER (AUTO LOGIN)
    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) {
                // 👉 if token invalid → reset user
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}