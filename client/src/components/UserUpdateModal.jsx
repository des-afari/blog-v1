import { forwardRef, useState, useEffect } from 'react'
import useCloseModal from '../hooks/useCloseModal'
import { emailRegex } from '../utils/config'
import PulseLoader from './PulseLoader'
import useAxiosPrivate from '../hooks/useAxiosPrivate'


const UserUpdateModal = forwardRef((props, ref) => {
    const { choice, user, setChangeUser, changeUser } = props

    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const closeModal = useCloseModal()
    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        closeModal(ref.current)
    }, [])

    useEffect(() => {
        setFirstName('')
        setLastName('')
        setEmail('')
        setError('')
    }, [choice])

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        if (choice === 'email') {
            if (!emailRegex.test(email)) {
                setError('Invalid email address')
			    setIsLoading(false)
			    return 
            }
        } 
        else if (choice === 'firstName') {
            if (firstName.length < 2) {
                setError('Invalid first name')
                setIsLoading(false)
			    return 
            }
        }
        else if (choice === 'lastName') {
            if (lastName.length < 2) {
                setError('Invalid last name')
                setIsLoading(false)
			    return 
            }
        }

        try {
            const data = {
                "first_name": firstName === '' ? user.first_name : firstName,
                "last_name": lastName === '' ? user.last_name : lastName,
                "email": email === '' ? user.email : email
            }
    
            await axiosPrivate.put('/user/update', data, {
                withCredentials: true
            })

            const currentUser = JSON.parse(localStorage.getItem('user'))
            localStorage.setItem('user', JSON.stringify({...currentUser, account: {...currentUser.account, ...data}}))

            setFirstName('')
            setLastName('')
            setEmail('')

            setChangeUser(!changeUser)
            ref.current.close()
                                    
        } catch (error) {
            setError(error.response.data.detail)
        
        } finally {  
            setIsLoading(false)
        }
    }

    //styles
    const formStyle = 'h-full flex flex-col justify-evenly'
    const inputStyle = 'bg-gray-100 p-1 border border-gray-400 rounded focus:bg-white focus:outline-none'
    const submitStyle = 'bg-black text-white p-1.5 font-bold rounded'
	const errorStyle = 'absolute bottom-0 left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center text-xs text-red-600 font-semibold'

    return (
        <dialog ref={ref} className='text-sm w-[35%] h-[35%] rounded'>
            {choice === 'firstName' && (<form onSubmit={handleSubmit} className={`${formStyle}`}>
                    <p>Your current first name is <strong>{user.first_name}</strong></p>
                    <p>Please enter your first name</p>
                    <input type="text" autoFocus={true} placeholder='First name' value={firstName} onChange={e => setFirstName(e.target.value)} className={`${inputStyle}`} />
                    <button className={`${submitStyle}`}> {isLoading ? <PulseLoader height={20} /> : 'Continue'} </button>
                    <small className={`${errorStyle}`}> {error} </small>
                </form>)
            }{choice === 'lastName' && (<form onSubmit={handleSubmit} className='h-full flex flex-col justify-evenly'>
                    <p>Your current last name is <strong>{user.last_name}</strong></p>
                    <p>Please enter your last name</p>
                    <input type="text" autoFocus={true} placeholder='Last name' value={lastName} onChange={e => setLastName(e.target.value)} className={`${inputStyle}`} />
                    <button className={`${submitStyle}`}> {isLoading ? <PulseLoader height={20} /> : 'Continue'} </button>
                    <small className={`${errorStyle}`}> {error} </small>
                </form>)
            }{ choice === 'email' && (<form onSubmit={handleSubmit} className='h-full flex flex-col justify-evenly'>
                    <p>Your current email is <strong>{user.email}</strong></p>
                    <p>Please enter a new email address</p>
                    <input type="email" autoFocus={true} placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} className={`${inputStyle}`} />
                    <button className={`${submitStyle}`}> {isLoading ? <PulseLoader height={20} /> : 'Continue'} </button>
                    <small className={`${errorStyle}`}> {error} </small>
                </form>)}
        </dialog>
    )
})

UserUpdateModal.displayName = 'UserUpdateModal'

export default UserUpdateModal