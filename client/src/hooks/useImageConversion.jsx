
const useImageConversion = () => {
	const imageConversion = img => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			
			reader.onloadend = () => {
				resolve(reader.result)
			}

			reader.onerror = reject
			reader.readAsDataURL(img)
		})
	}
  
	return imageConversion
}

export default useImageConversion