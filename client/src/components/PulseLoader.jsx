import { ThreeDots } from "react-loader-spinner"

const PulseLoader = props => {
  const { height } = props
  return (
    <div className='h-full flex justify-center items-center'>
        <ThreeDots 
            height={height || "24"} 
            width="25" 
            radius="9"
            color="#fff" 
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
        />
    </div>
  )
}

export default PulseLoader