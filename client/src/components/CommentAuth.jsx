import { useState, useRef, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { formatDate, formatTitle } from '../utils/config'
import { ReactComponent as Delete } from '../assets/svg/delete.svg'
import PulseLoader from './PulseLoader'
import useCloseModal from '../hooks/useCloseModal'


const CommentAuth = props => {
    const { comments, articleId, user, toggleChanges } = props
    const [comment, setComment] = useState('')
    const [isItem, setIsItem] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const axiosPrivate = useAxiosPrivate()
    const closeModal = useCloseModal()
    const textArea = useRef(null)
    const confirmDelete = useRef(null)

    useEffect(() => {
        closeModal(confirmDelete.current)
    }, [])

    const handleChange = e => {
        setComment(e.target.value)

        textArea.current.style.height = 'auto'
        textArea.current.style.height = `${textArea.current.scrollHeight}px`
    }


    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)
        

        if (comment === '') {
            setIsLoading(false)
            return
        }

        try {
            const data = {
                "comment": comment
            }

            await axiosPrivate.post(`/comment/${articleId}/create`, data)

            toggleChanges()
            setComment('')

        } catch (error) {
           console.error(error.response)

        } finally {
            setIsLoading(false)
        }
    }


    const handleClick = (e, item) => {
        setIsItem(item)
        confirmDelete.current.showModal()
    }

    const handleDelete = async () => {
        try {
            const id = isItem.id
            await axiosPrivate.delete(`/comment/${id}/delete`)
            
            toggleChanges()
            confirmDelete.current.close()

        } catch (error) {
            
        }

    }


    return (
    <div className='flex flex-col gap-y-4'>
        <div className='my-4'>
        <form className='p-2 rounded flex justify-start flex-col gap-y-4 shadow-comment' onSubmit={handleSubmit}>
            <textarea placeholder='What are your thoughts?' rows={4} className='p-2 border-b resize-none overflow-hidden focus:outline-none'
            ref={textArea} value={comment} onChange={handleChange} />
            <button className='bg-black text-white font-semibold py-1 px-2.5 rounded self-end'> {isLoading ? <PulseLoader /> : 'Add comment'} </button>
        </form>
        </div>
        <div className='border-t border-gray-300 flex flex-col gap-y-8 pt-4'>
            {comments.map(item => (
                <div key={item.id} className='grid grid-cols-5 group'>
                    <span className='col-span-4'>
                        <h2 className='font-bold'> {formatTitle(item.user.first_name)} {formatTitle(item.user.last_name)} </h2>
                        <span className='text-gray-400 text-xs'> {formatDate(item.updated_at !== null ? item.updated_at : item.created_at)} </span>
                        <p className='mt-4'> {item.comment} </p>
                    </span>
                    { user.account.role === 'user' ? user.account.id !== item.user.id ? '' : (
                    <span className='col-span-1 flex justify-end group-hover:opacity-100 opacity-0 transition-opacity'>
                        <button onClick={e => handleClick(e, item)}>
                            <Delete />
                        </button>
                    </span>
                    ) : (
                    <span className='col-span-1 flex justify-end group-hover:opacity-100 opacity-0 transition-opacity'>
                        <button onClick={e => handleClick(e, item)}>
                            <Delete />
                        </button>
                    </span>
                    )}
                </div>
            ))}
        </div>
        <dialog ref={confirmDelete} className='w-[35%] h-[35%] rounded'>
            <div className='h-full flex flex-col justify-between'>
                <strong className='text-center'>Delete comment</strong>
                <p>Delete your comment permanently?</p>
                <div className='self-end flex gap-x-2'>
                    <button onClick={() => confirmDelete.current.close()} className='font-semibold py-1 px-2.5'>Cancel</button>
                    <button onClick={handleDelete} className='bg-black text-white font-semibold py-1 px-2.5 rounded'>Delete</button>
                </div>
            </div>
        </dialog>
    </div>
  )
}

export default CommentAuth