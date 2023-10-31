import React from 'react'
import { ReactComponent as NotFoundSvg } from '../assets/svg/notfound.svg'

const NotFound = () => {
  return (
    <div className='h-screen flex justify-center items-center'>
        <NotFoundSvg />
    </div>
  )
}

export default NotFound