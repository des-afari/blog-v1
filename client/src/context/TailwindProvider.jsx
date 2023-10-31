import { createContext } from "react"

const TailwindContext = createContext({})


export const TailwindProvider = props => {
    const { children } = props
    const loaderStyle = 'flex justify-center items-center'
    const inputStyle = 'p-1 border bg-gray-100 border-gray-400 rounded focus:bg-white focus:outline-none'
	const btnStyle = 'grid grid-cols-6 gap-x-2 p-2 border border-gray-400 rounded hover:bg-gray-200'
	const submitStyle = 'bg-black text-white p-1.5 font-bold rounded'
	const errorStyle = 'text-center text-red-600 font-semibold'
    const tagStyle = 'bg-gray-200 text-gray-600 px-2 rounded-lg'
    const dialogStyle = 'w-[55%] h-[34.5rem] rounded'

    return (
        <TailwindContext.Provider value={{ loaderStyle, inputStyle, btnStyle, submitStyle, errorStyle, tagStyle, dialogStyle }}>
            {children}
        </TailwindContext.Provider>
    )
}

export default TailwindContext