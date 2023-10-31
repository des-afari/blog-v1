import { Oval } from "react-loader-spinner"


const Loader = props => {

	return <div className="h-full flex items-center justify-center">
		<Oval
			height={25}
			width={25}
			color="gray"
			ariaLabel='oval-loading'
			secondaryColor="gray"
			strokeWidth={6}
			strokeWidthSecondary={6}
  		/>
	</div>
}

export default Loader