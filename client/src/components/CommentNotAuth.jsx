import React from 'react'
import { formatDate, formatTitle } from '../utils/config'


const CommentNotAuth = props => {
    const { comments, login } = props
  return (
    <div className='flex flex-col gap-y-4'>
        <div className='flex flex-col gap-y-8 pt-4'>
            {comments.map(item => (
                <div key={item.id}>
                    <h2 className='font-bold'> {formatTitle(item.user.first_name)} {formatTitle(item.user.last_name)} </h2>
                    <span className='text-gray-400 text-xs'> {formatDate(item.updated_at !== null ? item.updated_at : item.created_at)} </span>
                    <p className='mt-4'> {item.comment} </p>
                </div>
            ))}
        </div>
        <div className='flex flex-col items-center border-t border-gray-300 pt-12'>
            <h1 className='text-xl font-semibold mb-4'>Join the discussion</h1>
            <button onClick={() => login.current.showModal()} className='bg-black text-white font-bold py-1 px-2.5 rounded'>Sign in</button>
        </div>
    </div>
  )
}

export default CommentNotAuth