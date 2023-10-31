import { useEffect, useState } from 'react'
import axios from '../utils/axios'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import Banner from '../components/Banner'
import useTailwind from '../hooks/useTailwind'
import { formatDate, formatTitle } from '../utils/config'
import Footer from '../components/Footer'

const Index = () => {
	const [articles, setArticles] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [page, setPage] = useState(0)
	const navigate = useNavigate()
	const { loaderStyle, tagStyle } = useTailwind()

	useEffect(() => {
		const getArticles = async () => {
			setIsLoading(true)
			
			try {
				const response = await axios.get(`/articles?skip=${page}`)
				setArticles(response.data)

			} catch (error) {
				console.error(error.response)
				
			} finally {
				setIsLoading(false)
			}
		}

		getArticles()

	}, [page])

	const handleClick = e => {
		const title = e.currentTarget.getAttribute('data-title')
		{title && navigate(`/article/${title}`)}
	}

  return (
	<div className='min-h-screen'>
		<Banner />
		<main className='p-8'>
			{isLoading ? <div className={`${loaderStyle} h-[85vh]`}><Loader /></div> : <div className='min-h-[85vh] grid grid-cols-3 gap-x-6 gap-y-12'>
				{articles.map(data => (
					<div key={data.id} onClick={handleClick} data-title={data.title} className='grid gap-y-3 cursor-pointer'>
						<span> <img src={data.img_url} alt="article image" /> </span>
						<div className='flex gap-x-2'>
							{data.categories.map(item => (
								<small key={item.id} className={`${tagStyle} h-fit`}> {formatTitle(item.name)} </small>
							))}
						</div>
						<h1 className='text-xl font-extrabold'> {formatTitle(data.title)} </h1>
						<p className='text-gray-600'> {data.description} </p>
						<span>
							<small className='text-gray-400'> {formatDate(data.updated_at !== null ? data.updated_at : data.created_at)} </small>
						</span>
					</div>
				))}
			</div>}
		</main>
		<Footer />
	</div>
  )
}

export default Index