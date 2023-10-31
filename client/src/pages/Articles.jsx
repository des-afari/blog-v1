import { useState, useEffect, useRef } from 'react'
import Loader from '../components/Loader'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useCloseModal from '../hooks/useCloseModal'
import { Link } from 'react-router-dom'
import parser from 'html-react-parser'
import ReactQuill from 'react-quill'
import useReactQuillModule from '../hooks/useReactQuillModule'
import useImageConversion from '../hooks/useImageConversion'


const Articles = () => {
	const [articles, setArticles] = useState([])
	const [article, setArticle] = useState({title: ''})
	const [isLoading, setIsLoading] = useState(false)
	const axiosPrivate = useAxiosPrivate()
	const closeModal = useCloseModal()
	const reactQuillModule = useReactQuillModule()
	const imageConversion = useImageConversion()
	const update = useRef(null)

	useEffect(() => {
		const get_articles = async () => {
			setIsLoading(true)
			try {
				const response = await axiosPrivate.get('/articles')
				setArticles(response.data)

			} catch (error) {
				console.error(error.response.data)

			} finally {
				setIsLoading(false)
			}
		}

		get_articles()
	}, [])

	useEffect(() => {
		closeModal(update.current)
	}, [])

	const handleImageChange = async e => {
        // const image = e.target.files[0]
        // const base64Image = await imageConversion(image)
        setArticle({...article, img_url: e.target.value})
    }

	const handleUpdate = async e => {
		setArticle(({tags, ...updatedArticle}) => updatedArticle)
		
		try {
			const dataId = e.target.parentNode.getAttribute('data-id')
			await axiosPrivate.put(`/article/${dataId}/update`, article)
			update.current.close()

		} catch (error) {
			console.error(error.response.data)
		}
	}

	const handleDelete = async (e, item) => {
		try {
			const dataId = e.target.parentNode.getAttribute('data-id')
			await axiosPrivate.delete(`/article/${dataId}/delete`)
			setArticles(articles.filter(article => article != item))

		} catch (error) {
			console.error(error.response.data)

		}
	}

  return (
	<div>
		<div> {isLoading ? <Loader /> : articles.map(item => (
			<div key={item.id} data-id={item.id}>
				<img src={item.img_url} />
				<p> {item.title} </p>
				<div> {parser(item.content)} </div>
				<button onClick={() => {setArticle(item); update.current.showModal()}}>update</button>
				<button onClick={e => handleDelete(e, item)}>delete</button>
			</div>
		))} </div>
		<dialog ref={update} data-id={article.id}>
			<input type="text" onChange={handleImageChange} />
			<input value={article.description} onChange={e => setArticle({...article, description: e.target.value})} />
			<input value={article.title} onChange={e => setArticle({...article, title: e.target.value})} />
			<ReactQuill value={article.content} onChange={value => setArticle({...article, content: value})} modules={reactQuillModule} />
			<button onClick={handleUpdate}>update article</button>
		</dialog>
		<div>
			<Link to='/article/create'>Create new article</Link>
		</div>
	</div>
  )
}

export default Articles