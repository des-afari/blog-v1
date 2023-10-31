
const ReactQuillModule = () => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'blockquote'],
            [{ 'script': 'super' }, { 'script': 'sub' }],
            [{ 'align': [] }, { 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
        ]
    }
    
    return modules 
}

export default ReactQuillModule