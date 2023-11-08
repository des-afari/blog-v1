import { forwardRef, useState, useEffect } from 'react'
import { ReactComponent as Search } from '../assets/svg/search.svg'
import { formatTitle, formatDate } from '../utils/config'
import { useNavigate } from 'react-router-dom'
import useCloseModal from '../hooks/useCloseModal'
import Loader from './Loader'
import axios from '../utils/axios'
import useTailwind from '../hooks/useTailwind'


const SearchModal = forwardRef((props, ref) => {
    const [inputValue, setInputValue] = useState('')
	const [typingTimer, setTypingTimer] = useState(null)
	const [filteredArticles, setFilteredArticles] = useState([])
	const [isLoading, setIsLoading] = useState(false)
    
    const closeModal = useCloseModal()
    const navigate = useNavigate()
	const { tagStyle, dialogStyle } = useTailwind()
    const typingTimeout = 1300


	// get filtered articles
	const getFilteredArticles = async () => {
		setIsLoading(true)
		try {
			const response = await axios.get(`/articles?query=${inputValue}&limit=${10}`)
			setFilteredArticles(response.data)

		} catch (error) {
			console.error(error.response.data)

		} finally {
			setIsLoading(false)
		}
	}

	// check for timeout to run seach filteredArticle function
	const  handleChange = e => {
		clearTimeout(typingTimer)
		setInputValue(e.target.value)

		const timer = setTimeout(getFilteredArticles, typingTimeout)
		setTypingTimer(timer)
	}

	useEffect(() => {
		return () => {
			clearTimeout(typingTimer)
		}
	}, [typingTimer])

    useEffect(() => {
		closeModal(ref.current)
	}, [])

	const handleClick = async e => {
		try {
			const title = e.currentTarget.getAttribute('data-title')

			if (title) {
				const response = await axios.get(`/article/${title}`)
				const article = response.data

				navigate(`/article/${title}`, {state: {article}})
			}

		} catch (error) {
			console.error(error.response)
		}
	}


    return (
        <dialog ref={ref} className={`${dialogStyle} pt-0`}>
			<div className='h-[4rem] flex items-center px-1 py-4 gap-x-4 border-b sticky top-0 bg-white'>
				<Search />
				<input type="text" autoFocus={true} placeholder='Search Article' className='w-full outline-none' value={inputValue} onChange={handleChange} />
			</div>
			<div className='pt-4'>
				{
					isLoading ? <div style={{height: 'calc(34.5rem - 8rem)'}}><Loader /></div> : <div className='flex flex-col gap-y-6'>
						{
							filteredArticles.map(data => (
								<div key={data.id} onClick={handleClick} data-title={data.title} className='grid grid-cols-6 cursor-pointer pb-2 border-b h-40 gap-x-2'>
									<div className='col-span-4 flex justify-between flex-col'>
										<div>
											<h1 className='text-xl font-bold'> {formatTitle(data.title)} </h1>
											<p className='text-sm text-gray-600'> {data.description} </p>
										</div>
										<div className='text-xs flex gap-x-4'>
											<span className='text-gray-400'>{formatDate(data.updated_at !== null ? data.updated_at : data.created_at)}</span>
											<div className='flex gap-x-2'> {data.categories.map(item => (
												<span key={item.id} className={`${tagStyle}`}> {formatTitle(item.name)} </span>
											))} </div>
										</div>
									</div>
									<div className='col-span-2 h-36'>
										<img src={data.img_url} alt="article image" className='w-full h-full'  />
									</div>
								</div>
							))
						}
					</div>
				}
			</div>
		</dialog>
  )
})


SearchModal.displayName = 'SearchModal'
export default SearchModal