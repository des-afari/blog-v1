import {useState, useEffect }  from 'react'
import { useParams } from 'react-router-dom'
import axios from '../utils/axios'
import Loader from '../components/Loader'
import Header from '../components/Header'
import useTailwind from '../hooks/useTailwind'
import { formatDate, formatTitle } from '../utils/config'
import { useNavigate } from 'react-router-dom'

const CategoryArticles = () => {
	const { name } = useParams()
	const { tagStyle } = useTailwind()
	const navigate = useNavigate()
	const [articles, setArticles] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const get_articles = async () => {
			setIsLoading(true)
			try {
				const response = await axios.get(`/category/${name}`)
				setArticles(response.data)

			} catch (error) {
				console.error(error.response.data.detail)
				navigate('/404')

			} finally {
				setIsLoading(false)
			}
		}

		get_articles()
	}, [])

	const handleClick = e => {
		const title = e.currentTarget.getAttribute('data-title')
		{title && navigate(`article/${title}`)}
	}

  return (
	<div style={{height: isLoading ? '100vh': ''}}>
		{isLoading ? <Loader /> : <div>
			<Header />
			<div className='p-8 grid grid-cols-3 gap-6'>
				{articles.map(data => (
					<div key={data.id} onClick={handleClick} data-title={data.title} className='grid gap-y-3 cursor-pointer'>
						<span> <img src={data.img_url} alt="article image" /> </span>
						<div className='flex gap-x-2'>
							{data.categories.map(item => (
								<small key={item.id} className={`${tagStyle}`}> {formatTitle(item.name)} </small>
							))}
						</div>
						<h1 className='text-xl font-extrabold'> {formatTitle(data.title)} </h1>
						<p className='text-gray-600'> {data.description} </p>
						<span>
							<small className='text-gray-400'> {formatDate(data.updated_at !== null ? data.updated_at : data.created_at)} </small>
						</span>
					</div>
				))}
			</div>
		</div>}
	</div>
  )
}

export default CategoryArticles