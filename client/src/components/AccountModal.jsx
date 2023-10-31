import { useState, useEffect, useRef, forwardRef } from 'react'
import useCloseModal from '../hooks/useCloseModal'
import { ReactComponent as User } from '../assets/svg/user.svg'
import useLogout from '../hooks/useLogout'
import useTailwind from '../hooks/useTailwind'
import UserUpdateModal from './UserUpdateModal'
import PasswordUpdateModal from './PasswordUpdateModal'


const AccountModal = forwardRef((props, ref) => {
    const { toggleUser } = props
    const [choice, setChoice] = useState('')
    const [user, setUser] = useState({})
    const [changeUser, setChangeUser] = useState(false)
    
    const updateUser = useRef(null)
    const updatePassword = useRef(null)
    const closeModal = useCloseModal()
    const logout = useLogout()
    const { dialogStyle } = useTailwind()


	useEffect(() => {
        closeModal(ref.current)
	}, [])

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')).account)
    }, [changeUser])

    const handleLogout = () => {
        logout()
        ref.current.close()
        toggleUser()
    }

    //styles
    const labelStyle = 'font-semibold text-gray-700'
    const valueStyle = 'text-sm text-gray-600'
    const btnStyle = 'border border-gray-400 text-gray-500 px-2 py-1 text-sm hover:bg-gray-200'

  return (
    <dialog ref={ref} className={`${dialogStyle}`}>
        <div className='h-[30%] bg-gray-100 flex flex-col justify-center items-center rounded'>
            <User />
            <h1 className='text-3xl font-bold text-gray-700'>Your account</h1>
        </div>
        <div id={user.id} className='h-[56%] flex flex-col justify-evenly'>
            <div className='flex justify-between'>
                <span>
                    <p className={`${labelStyle}`}>Email</p>
                    <p className={`${valueStyle}`}> {user.email} </p>
                </span>
                <span className='flex justify-center items-center'>
                    <button onClick={() => {setChoice('email'); updateUser.current.showModal()}} className={`${btnStyle}`}>change email</button>
                </span>
            </div>
            <div className='flex justify-between'>
                <span>
                    <p className={`${labelStyle}`}>First name</p>
                    <p className={`${valueStyle}`}> {user.first_name} </p>
                </span>
                <span className='flex justify-center items-center'>
                    <button onClick={() => {setChoice('firstName'); updateUser.current.showModal()}} className={`${btnStyle}`}>change first name</button>
                </span>
            </div>
            <div className='flex justify-between'>
                <span>
                    <p className={`${labelStyle}`}>Last name</p>
                    <p className={`${valueStyle}`}> {user.last_name} </p>
                </span>
                <span className='flex justify-center items-center'>
                    <button onClick={() => {setChoice('lastName'); updateUser.current.showModal()}} className={`${btnStyle}`}>change last name</button>
                </span>
            </div>
            <div className='flex justify-between'>
                <span>
                    <p className={`${labelStyle}`}>Password</p>
                    <p className={`${valueStyle}`}> change your password </p>
                </span>
                <span className='flex justify-center items-center'>
                    <button onClick={() => updatePassword.current.showModal()} className={`${btnStyle}`}>change password</button>
                </span>
            </div>
        </div>
        <div className='h-[14%] flex justify-start items-center'>
            <button className='border border-black px-3 py-1 font-semibold bg-black text-white rounded' onClick={handleLogout}>Sign out</button>
        </div>

        <UserUpdateModal ref={updateUser} choice={choice} user={user} setChangeUser={setChangeUser} changeUser={changeUser} />
        <PasswordUpdateModal ref={updatePassword} />
        
    </dialog>
  )
})


AccountModal.displayName = 'AccountModal'
export default AccountModal