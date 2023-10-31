import { useEffect, useRef, useState } from 'react'
import { ReactComponent as Logo } from '../assets/svg/logo.svg'
import { ReactComponent as Search } from '../assets/svg/search.svg'
import SearchModal from './SearchModal'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import AccountModal from './AccountModal'


const Header = props => {
	const { passLogin } = props
	const search = useRef(null)
	const account = useRef(null)
	const login = useRef(null)
	const register = useRef(null)

	const [user, setUser] = useState(localStorage.getItem('user'))


	const toggleUser = () => {
		setUser(!user ? localStorage.getItem('user') : null)
	}


	useEffect(() => {
		if (passLogin !== undefined) {
			passLogin(login.current)
		}
	}, [passLogin])


  return (
	<div className='sticky top-0'>
		<header className='h-16 px-8 flex items-center justify-between border-b bg-white'>
			<div>
				<a href="/"><Logo /></a>
			</div>
			<ul className='flex text-sm font-bold gap-x-2'>
				<li className='flex items-center'>
					<button onClick={() => search.current.showModal()}><Search /></button>
				</li>
				<li className='flex'>
					{ !user ?
					<div className='flex items-center gap-x-2'>
						<button onClick={() => login.current.showModal()} className='py-1 px-2.5'>Sign in</button>
						<button onClick={() => register.current.showModal()} className='bg-black text-white py-1 px-2.5 rounded'>Register</button> 
					</div> : 
					<div> 
						<button onClick={() => account.current.showModal()} className='bg-black text-white py-1 px-2.5 rounded'>Account</button>
					</div>}
				</li>
			</ul>
		</header>
		<SearchModal ref={search} />
		{user && <AccountModal ref={account} toggleUser={toggleUser} />}
		{!user && <LoginModal ref={login} toggleUser={toggleUser} />}
		{!user &&  <RegisterModal ref={register} toggleUser={toggleUser} />}
	</div>
  )
}

export default Header