import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth'
import Loader from './Loader'


const PersistLogin = () => {
	const [isLoading, setIsLoading] = useState(true)
	const refresh = useRefreshToken()
	const { auth } = useAuth()
	const user = localStorage.getItem('user')

	useEffect(() => {
		let isMounted = true
		const verifyRefreshToken = async () => {
			try {
				await refresh()

			} catch (error) {
				console.error(error.response.data.detail)

			} finally {
				isMounted && setIsLoading(false)
			}
		}

		user ? !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false) : setIsLoading(false)

		return () => isMounted = false
	}, [])

  return (
	<div>
		{isLoading ? <div className='h-screen'><Loader /></div> : <Outlet />}
	</div>
  )
}

export default PersistLogin