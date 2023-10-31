import { useState, forwardRef, useEffect } from 'react'
import { ReactComponent as Google } from '../assets/svg/google.svg'
import { ReactComponent as Apple } from '../assets/svg/apple.svg'
import axios from '../utils/axios'
import useAuth from '../hooks/useAuth'
import useTailwind from '../hooks/useTailwind'
import PulseLoader from './PulseLoader'
import useCloseModal from '../hooks/useCloseModal'
import { emailRegex, passwordRegex } from '../utils/config'


const RegisterModal = forwardRef((props, ref) => {
	const { toggleUser } = props
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const closeModal = useCloseModal()
	const { setAuth } = useAuth()
	const { inputStyle, btnStyle, submitStyle, errorStyle, dialogStyle } = useTailwind()


	useEffect(() => {
		closeModal(ref.current)
	}, [])

	const handleSubmit = async e => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		if (firstName.length < 2 || lastName.length < 2) {
			setError('Enter your first and last name')
			setIsLoading(false)
			return
		}

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

		const data = {
			"first_name": firstName,
			"last_name": lastName,
			"email": email,
			"password": password
		}

		try {
			const response = await axios.post('/register', data, {
				headers: {
					"Content-Type": "application/json"
				},
				withCredentials: true
			})

			const accessToken = response?.data?.access_token
			const role = response?.data?.role
			const id = response?.data?.id
			const user = response?.data?.user
			const date = new Date()
			const ttl = 30 * 24 * 60 * 60 * 1000

			setAuth({id, accessToken, role})

			localStorage.setItem('user', JSON.stringify({
				expiry: date.getTime() + ttl, account: user
			}))
			
			ref.current.close()
			toggleUser()

		} catch (error) {
			setError(error.response.data.detail)

		} finally {
			setIsLoading(false)
		}
	}
	

  	return (
	<dialog ref={ref} className={`${dialogStyle}`}>
		<div className='flex flex-col justify-center items-center h-full'>
			<form onSubmit={handleSubmit} className='w-[60%] flex flex-col gap-y-6'>
				<div className='text-center'>
					<h1 className='text-4xl font-bold mb-2'>Sign up</h1>
					<p className='text-gray-500 text-xs'>Use a password that is a minimum of 10 characters long, includes at least one uppercase letter, one numerical digit, and one special character.</p>
				</div>
				<div className='flex flex-col gap-y-4'>
					<div className='grid grid-cols-2 gap-x-2'>
						<div className='flex flex-col'>
							<label className='text-xs font-bold'>First Name</label>
							<input autoFocus={true} type="text" onChange={e => setFirstName(e.target.value)}  className={`${inputStyle}`} placeholder='Enter your first name' />
						</div>
						<div className='flex flex-col'>
							<label className='text-xs font-bold'>Last Name</label>
							<input type="text" onChange={e => setLastName(e.target.value)}  className={`${inputStyle}`} placeholder='Enter your last name' />
						</div>
					</div>
					<div className='flex flex-col'>
						<label className='text-xs font-bold'>Email</label>
						<input type="text" onChange={e => setEmail(e.target.value)}  className={`${inputStyle}`} placeholder='Enter your email address' />
					</div>
					<div className='flex flex-col'>
						<label className='text-xs font-bold'>Password</label>
						<input type="password" onChange={e => setPassword(e.target.value)}  className={`${inputStyle}`} placeholder='Enter your password' />
					</div>
					<button className={`${submitStyle}`}> {isLoading ? <PulseLoader /> : 'Sign up' } </button>
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
	</dialog>
  )
})

RegisterModal.displayName = 'RegisterModal'

export default RegisterModal