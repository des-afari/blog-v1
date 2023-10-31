import React from 'react'
import { ReactComponent as Github } from '../assets/svg/github.svg'
import { ReactComponent as LinkedIn } from '../assets/svg/linkedin.svg'
import { Link } from 'react-router-dom'

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <div className='text-xs h-44 text-gray-300'>
      <div className='h-40'></div>
      <div className='h-4 bg-black  flex justify-between items-center p-8'>
        <span>&copy; {year} Desmond Afari. All rights reserved.</span>
        <span className='flex items-center gap-x-2'>
          <Link to='https://github.com/des-afari/' target='blank'><Github /></Link>
          <Link to='https://linkedin.com/in/desmond-afari/' target='blank'><LinkedIn /></Link>
        </span>
      </div>
    </div>
  )
}

export default Footer