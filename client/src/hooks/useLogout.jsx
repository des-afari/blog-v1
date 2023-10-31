import axios from '../utils/axios'
import useAuth from './useAuth'
import { useNavigate } from 'react-router-dom'


const useLogout = () => {
	const { auth, setAuth } = useAuth()
	const navigate = useNavigate()


	const logout = async () => {
		const data = {
			"access_token": auth?.accessToken
		}

		await axios.post('/logout', data, {
			withCredentials: true
		})
		setAuth({})
		localStorage.removeItem('user')

		navigate('/')
	}

	return logout
}

export default useLogout