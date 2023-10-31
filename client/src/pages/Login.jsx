import { useState } from 'react'
import { ReactComponent as Google } from '../assets/svg/google.svg'
import { ReactComponent as Apple } from '../assets/svg/apple.svg'
import axios from '../utils/axios'
import { useNavigate, useLocation } from "react-router-dom"
import useAuth from '../hooks/useAuth'
import useTailwind from '../hooks/useTailwind'
import PulseLoader from '../components/PulseLoader'
import { emailRegex, passwordRegex } from '../utils/config'


const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const navigate = useNavigate()
	const location = useLocation()
	const { setAuth } = useAuth()
	const { inputStyle, btnStyle, submitStyle, errorStyle } = useTailwind()
	const from = location.state?.from?.pathname || '/'

	const handleSubmit = async e  => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		if (!emailRegex.test(email)) {
			setError('Invalid email address')
			setIsLoading(false)
			return 
		}
		
		if (!passwordRegex.test(password)) {
			setError('Invalid password')
			setIsLoading(false)
			return
		}

		const data = new URLSearchParams({
			username: email,
			password: password
		})

		try{
			const response = await axios.post('/login', data, {
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/x-www-form-urlencoded"
				},
				withCredentials: true
			})

			const accessToken = response?.data?.access_token
			const role = response?.data?.role
			const id = response?.data?.id
			const user = response?.data?.user
			const date = new Date()
			const ttl = 30 * 24 * 60 * 60 * 1000

			setAuth({accessToken, role, id})

			localStorage.setItem('user', JSON.stringify({
				expiry: date.getTime() + ttl, account: user
			}))

			navigate(from, {replace: true})

		} catch (error) {
			setError(error.response.data.detail)

		} finally {
			setIsLoading(false)
		}
	}


    return (
	    <div className='flex flex-col justify-center items-center h-screen'>
	    	<form onSubmit={handleSubmit} className='w-[35%] flex flex-col gap-y-6'>
	    		<div>
	    			<h1 className='text-4xl font-bold text-center'>Sign in</h1>
	    		</div>
				<div className='flex flex-col gap-y-4'>
	    			<div className='flex flex-col'>
	    				<label className='text-xs font-bold'>Email</label>
	    				<input autoFocus={true} type="text" onChange={e => setEmail(e.target.value)}  className={`${inputStyle}`} placeholder='Enter your email address' />
	    			</div>
	    			<div className='flex flex-col'>
	    				<label className='text-xs font-bold'>Password</label>
	    				<input type="password" onChange={e => setPassword(e.target.value)} className={`${inputStyle}`} placeholder='Enter your password' />
	    			</div>
	    			<button className={`${submitStyle}`}> {isLoading ? <PulseLoader /> : 'Sign in' } </button>
	    			<small className={`${errorStyle}`}> {error} </small>
	    		</div>
	    		<div className='text-sm flex flex-col gap-y-4'>
	    			<button className={`${btnStyle}`}>
	    				<span className='col-span-2 justify-self-end self-center'> <Google /> </span>
	    				<span className='col-span-4 justify-self-start'>Continue with Google</span>
	    			</button>
	    			<button className={`${btnStyle}`}>
	    				<span className='col-span-2 justify-self-end self-center'> <Apple /> </span>
	    				<span className='col-span-4 justify-self-start'>Continue with Apple</span>
	    			</button>
	    		</div>
	    		
	    	</form>
	    </div>
    )
}

export default Login