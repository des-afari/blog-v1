import { forwardRef, useEffect, useState } from 'react'
import useCloseModal from '../hooks/useCloseModal'
import { passwordRegex } from '../utils/config'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import PulseLoader from './PulseLoader'


const PasswordUpdateModal = forwardRef((props, ref) => {

    const closeModal = useCloseModal()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const axiosPrivate = useAxiosPrivate()
    
    useEffect(() => {
        closeModal(ref.current)
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        if (!passwordRegex.test(currentPassword)){
            setError('Invalid current password')
            setIsLoading(false)
            return
        }

        if (!passwordRegex.test(newPassword)){
            setError('Invalid new password')
            setIsLoading(false)
            return
        }

        if (!passwordRegex.test(confirmPassword)){
            setError('Invalid confirm password')
            setIsLoading(false)
            return
        }

        if (newPassword !== confirmPassword) {
            setError('New password does not match')
            setIsLoading(false)
            return
        }
        
        try {          
            const data = {
                "current_password": currentPassword,
                "new_password": newPassword
            }
    
            await axiosPrivate.patch('/user/password/update', data, {
                withCredentials: true
            })
            
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            
            ref.current.close()

        } catch (error) {
            setError(error.response.data.detail)

        } finally {
            setIsLoading(false)
        }
    }
    
    //styles
    const inputStyle = 'bg-gray-100 p-1 border border-gray-400 rounded focus:bg-white focus:outline-none w-full'
    const submitStyle = 'bg-black text-white p-1.5 font-bold rounded w-full'
	const errorStyle = 'absolute bottom-0 left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center text-xs text-red-600 font-semibold'


    return (
    <dialog ref={ref} className='w-[35%] h-[55%]'>
        <form onSubmit={handleSubmit} className='text-sm w-full h-full'>
            <div className='h-[20%] flex flex-col justify-center items-center gap-y-1'>
                <p className='font-bold'>Change password</p>
                <p className='text-gray-500 text-xs text-center'>Use a password that is a minimum of 10 characters long, includes at least one uppercase letter, one numerical digit, and one special character.</p>
            </div>
            <div className='h-[65%] flex flex-col justify-evenly'>
                <div>
                   <p className='text-xs font-bold'>Enter your current password</p>
                   <input type="password" autoFocus={true} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                   className={`${inputStyle}`} /> 
                </div>
                <div>
                   <p className='text-xs font-bold'>Enter a new password</p>
                   <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    className={`${inputStyle}`} /> 
                </div>
                <div>
                   <p className='text-xs font-bold'>Confirm your new password</p>
                   <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    className={`${inputStyle}`} /> 
                </div>
            </div>
            <div className='h=[15%] flex flex-col gap-y-1'>
                <button className={`${submitStyle}`}> {isLoading ? <PulseLoader height={20} /> : 'Change Password'} </button>
                <small className={`${errorStyle}`}> {error} </small>
            </div>
        </form>
    </dialog>
  )
})

PasswordUpdateModal.displayName = 'PasswordUpdateModal'

export default PasswordUpdateModal