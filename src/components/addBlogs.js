import { useState } from "react";
import axios from "../config/axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";

export default function AddBlogs(){
    const navigate = useNavigate()
    const [title,setTitle] = useState('')
    const [content,setContent] = useState('')
    const [img,setImg] = useState('')
    const [serverErrors,setServerErrors] = useState(null)
    const [clientErrors,setClientErrors] = useState({})
    const errors = {}
    const runValidations = () =>{
        if(title.trim().length === 0){
            errors.title = 'Title is required'
        }
        if(content.trim().length === 0){
            errors.content = 'Content is required'
        }
        if(img.trim().length === 0){
            errors.img = 'Image is required'
        }
    }
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const formData = {
            title:title,
            content:content,
            img:img
        }
        runValidations()
        if(Object.keys(errors).length === 0){
            try{
                const response = await axios.post('/api/posts',formData,{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                })
                console.log(response.data)
                navigate('/allblogs')
            }catch(err){
                console.log(err.response.data)
                setServerErrors(err.response.data)
            }
        }else{
            setClientErrors(errors)
        }
    }
    return(
        <div>
            <h1>AddBlogs..</h1>
            {serverErrors && <div>{serverErrors}</div>}
            {Object.keys(clientErrors).length > 0 && (
                <div>
                    {Object.values(clientErrors).map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Enter Title</label><br/>
                <input type="text" value={title} id="title" onChange={e=>{setTitle(e.target.value)}}/><br/>
                <label htmlFor="content">Enter Content</label><br/>
                <ReactQuill type='text' theme='snow' id='content' value={content} onChange={newContent => setContent(newContent)}/><br/>
                <label htmlFor="img">Add Image</label><br/>
                <input type="file" value={img} id="img" onChange={e=>{setImg(e.target.value)}}/><br/>
                <input type="submit"/>
            </form>
        </div>
    )
}