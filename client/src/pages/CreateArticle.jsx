import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import useImageConversion from '../hooks/useImageConversion'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useReactQuillModule from '../hooks/useReactQuillModule'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import Loader from '../components/Loader'


const CreateArticle = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [content, setContent] = useState('')
    const [image, setImage] = useState(null)
    const [categories, setCategories] = useState([])
    const [chosenTags, setChosenTags] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const imageConversion = useImageConversion() 
    const axiosPrivate = useAxiosPrivate()
    const reactQuillModule = useReactQuillModule()
    const navigate = useNavigate()

    useEffect(() => {
        const get_categories = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get('/categories')
                setCategories(response.data)

            } catch (error) {
                console.error(error.response.data)

            } finally {
                setIsLoading(false)
            }
        }

        get_categories()
    }, [])

    

    const handleImageChange = async e => {
        // const orignalImage = e.target.files[0]
        // const base64Image = await imageConversion(orignalImage)
        setImage(e.target.value)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)
        
        try {
            const data = {
                "title": title,
                "description": description,
                "img_url": image,
                "content": content,
                "categories": chosenTags
            }  
            
            await axiosPrivate.post('/article/create', data)
            navigate(-1)

        } catch (error) {
            console.error(error)  

        } finally {
            setIsLoading(false)
        }
        
    }

    const handleTagClick = (e, item) => {
        const dataId = e.target.parentNode.getAttribute('data-id')
        
        if (!chosenTags.includes(dataId)) {
            setChosenTags([...chosenTags, dataId])
        } else {
            setChosenTags(chosenTags.filter(tag => tag != item.name))
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Title' className='text-4xl font-bold'></input>
        <input type="text" maxLength={1000} value={description} onChange={e => setDescription(e.target.value)} placeholder='What is the article about?' />
        <input type="text" onChange={handleImageChange} placeholder='Image URL' />
        <div> {categories.map(item => (
            <span key={item.id} data-id={item.name}>
                <p onClick={e => handleTagClick(e, item)}> {item.name} </p>
            </span>
        ))} </div>
        <ReactQuill theme='snow' value={content} onChange={value => setContent(value)} modules={reactQuillModule}>
            
        </ReactQuill>
        <button> {isLoading ? <Loader /> : 'Create article'} </button>
    </form>
  )
}

export default CreateArticle