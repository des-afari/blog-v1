import { useState, useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Loader from '../components/Loader'



const Admins = () => {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        const get_users = async () => {
            setIsLoading(true)
            try {
                const response = await axiosPrivate('/get_users')
                setUsers(response.data)
            } catch (error) {
                console.error(error.response.data)
            } finally {
                setIsLoading(false)
            }
        }

        get_users()
    }, [])

    const handleDelete = async (item, e) => {
		try {
            const dataId = e.currentTarget.parentNode.getAttribute('data-id')
		    setUsers(users.filter(user => user != item))
		    await axiosPrivate.delete(`/user/${dataId}/delete`)
        } catch (error) {
           console.error(error.ressponse.data) 
        }
	}

    return (
    <div>
        {
            isLoading ? <Loader /> : users.map(item => (
                <div key={item.id} data-id={item.id}>
                    <p>First Name: {item.first_name} </p>
                    <p>Last Name: {item.last_name} </p>
                    <p>Email: {item.email} </p>
                    <p>role: {item.role} </p>
					<button onClick={e => handleDelete(item, e)}>delete</button>
                </div>
            ))
        }
    </div>
  )
}

export default Admins