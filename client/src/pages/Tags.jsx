import { useState, useEffect } from 'react'
import axios from '../utils/axios'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Loader from '../components/Loader'


const Tags = () => {
    const [tags, setTags] = useState([])
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        const get_tags = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get('/categories')
                setTags(response.data)

            } catch (error) {
                console.error(error.response.data)

            } finally {
                setIsLoading(false)
            }
        }

        get_tags()
    }, [])

    const handleSubmit = async e => {
        e.preventDefault()

        try {
            const data = {
                "name": name
            }

            await axiosPrivate.post('/category/create', data)

        } catch (error) {
            console.error(error.response.data)
        }
    }

    const handleDelete = async (e, item) => {
        try {
            const dataId = e.currentTarget.parentNode.getAttribute('data-id')
            setTags(tags.filter(tag => tag != item))
            await axiosPrivate.delete(`/tag/${dataId}/delete`)
            
        } catch (error) {
            console.error(error.response.data)   
        }
    }


  return (
    <div>
        <div> {isLoading ? <Loader /> : tags.map(item => (
            <div key={item.id} data-id={item.id}>
                <button onClick={e => handleDelete(e, item)}>delete</button>
                <p> {item.name} </p>
            </div>
        ))} </div>
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder='Add new tag' />
            <button>create</button>
        </form>
    </div>
  )
}

export default Tags