import React from 'react'
import {ReactComponent as UnauthorizedSvg} from '../assets/svg/unauthorized.svg'

const Unauthorized = () => {
  return (
	<div className='h-screen flex justify-center items-center'>
		<UnauthorizedSvg />
    </div>
  )
}

export default Unauthorized