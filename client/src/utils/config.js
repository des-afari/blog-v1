
export const formatTitle = title => {
	if (title) {
		return title.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ' ')
	}
}

export const formatDate = date => {
	date = new Date(date)
	const options = { year: 'numeric', month: 'short', day: 'numeric' };

	return date.toLocaleDateString('en-US', options)
}

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:'",<.>/?]).{10,}$/