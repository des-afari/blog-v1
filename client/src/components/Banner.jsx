import { useState, useEffect } from 'react'
import { formatTitle } from '../utils/config'
import axios from '../utils/axios'
import Header from './Header'
import { useNavigate } from 'react-router-dom'


const Banner = () => {
    const [categories, setCategories] = useState([])
	const navigate = useNavigate()

    useEffect(() => {
		const get_categories = async () => {
			try {
				const response = await axios.get('/categories')
				setCategories(response.data)

			} catch (error) {
				console.error(error.response.data.detail)
			}		
		}

		get_categories()
	}, [])

    const handleClick = async e => {
		const dataName = e.currentTarget.getAttribute('data-name')
		{dataName && navigate(`/category/${dataName}`)}
	}

	
    return (
        <div className='sticky top-0 bg-white'>
            <Header />
            <div className='h-[3rem] px-8 flex justify-center items-center gap-x-6 shadow-md'>
	    		{
	    			categories.map(item => (
	    				<span key={item.id} data-name={item.name} onClick={handleClick}>
	    					<p className='bg-gray-200 hover:bg-gray-300 transition-colors px-3 py-1 text-sm rounded-md cursor-pointer'> {formatTitle(item.name)} </p>
	    				</span>
	    			))
	    		}
	    	</div>
        </div>
  )
}

export default Banner