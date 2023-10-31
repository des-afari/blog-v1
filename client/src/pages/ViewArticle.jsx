import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import parser from 'html-react-parser'
import Header from '../components/Header'
import { formatDate, formatTitle } from '../utils/config'
import { ReactComponent as Liked } from '../assets/svg/liked.svg'
import { ReactComponent as UnLiked } from '../assets/svg/unliked.svg'
import { ReactComponent as Comment } from '../assets/svg/comment.svg'
import CommentAuth from '../components/CommentAuth'
import CommentNotAuth from '../components/CommentNotAuth'
import Loader from '../components/Loader'
import axios from '../utils/axios'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Footer from '../components/Footer'


const ViewArticle = () => {
	const { title } = useParams()
	const user = JSON.parse(localStorage.getItem('user'))
	const login = useRef(null)
	const { auth } = useAuth()
	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()
	const [article, setArticle] = useState({})
	const [like, setLike] = useState(false)
	const [changes, setChanges] = useState(false) 
	const [isLoading, setIsLoading] = useState(false)
	
	useEffect(() => {
		const get_article = async () => {

			try {
				const response = await axios.get(`/article/${title}`)
				setArticle(response.data)

				if (user) {
					const id = auth.id || user.account.id
					let liked = false

					for (let i = 0; i < response.data.votes.length; i++) {
					  if (id === response.data.votes[i].user_id) {
						liked = true
						break
					  }
					}

					setLike(liked)
				}

			} catch (error) {
				console.error(error.response.data.detail)
				navigate('/404')

			} finally {
				setIsLoading(false)
			}
		}

		get_article()
	}, [title, changes])
	  	  

	const passLogin = ref => {
		login.current = ref
	}
	
	const toggleChanges = () => {
		setChanges(changes => !changes)
	}

	const handleClick = async () => {
		if (!user) {
			login.current.showModal()
		} else {
			await axiosPrivate.get(`${article.id}/vote`)
			toggleChanges()
		}
	}

  return (
	<div>
		{
			isLoading ? <div className='h-screen'><Loader /></div> : <div>
				<Header passLogin={passLogin}  />
				{Object.keys(article).length > 0 && (
					<div className='flex justify-center items-center py-12'>
					<div className='w-8/12 flex flex-col gap-y-4'>
						<h1 className='text-center text-5xl font-extrabold'> {formatTitle(article.title)} </h1>
						<p className='text-xl text-gray-500'> {article.description} </p>
						<small className='text-gray-500'> <span className='text-black'>Published:</span> {formatDate(article.updated_at !== null ? article.updated_at : article.created_at)} </small>
						<div className='flex gap-x-6'>
							<span onClick={handleClick} className='flex items-center gap-x-1.5 cursor-pointer'>
								{like ? <Liked /> : <UnLiked />}
								<p > {article.votes.length} </p>
							</span>
							<span className='flex items-center gap-x-1.5'>
								<Comment />
								<p> {article.comments.length} </p>
							</span>
						</div>
						<img src={article.img_url} alt="article banner" />
						<div className='text-lg'> {parser(article.content)} </div>
						<div className='mt-12'>
							<h1 className='font-bold text-2xl'>Comments</h1>
							{user !== null ? <CommentAuth comments={article.comments} articleId={article.id} user={user} toggleChanges={toggleChanges} /> 
							: <CommentNotAuth comments={article.comments} login={login} />}
						</div>
					</div> 
				</div> 
				)}
				{Object.keys(article).length > 0 && <Footer />}
			</div>
		}
	</div>
  )
}

export default ViewArticle
