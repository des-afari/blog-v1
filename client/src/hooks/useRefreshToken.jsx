import axios from '../utils/axios'
import useAuth from './useAuth'


const useRefreshToken = () => {
	const { setAuth } = useAuth()

	const refresh = async () => {
		const response = await axios.get('/refresh', {
			withCredentials: true
		})

		const id = response?.data?.id 
		const accessToken =  response?.data?.access_token
		const role = response?.data?.role

		setAuth(prev => {
			return {...prev, id, accessToken, role}
		})
		
		return response.data.access_token
	}

	return refresh
}

export default useRefreshToken