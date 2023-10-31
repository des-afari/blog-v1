
const useCloseModal = () => {
    const closeModal = ref => {
        ref.addEventListener('click', e => {
            const dimensions = ref.getBoundingClientRect()
            if(
                e.clientX < dimensions.left ||
                e.clientX > dimensions.right ||
                e.clientY < dimensions.top ||
                e.clientY > dimensions.bottom
                ){
                    ref.close()
                }
            })
    }

    return closeModal
}

export default useCloseModal