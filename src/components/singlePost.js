import {useState,useEffect} from 'react'
import axios from '../config/axios'
import { useParams } from "react-router-dom"
export default function SinglePost(){
    const {postId}=useParams()
    const [blogs,setBlogs]=useState(null)
    const [errors,setErrors]=useState(null)
    console.log(postId)
    useEffect(()=>{
      const fun=async()=>{
        try{
        const response =await axios.get(`/api/posts/${postId}`)
        console.log(response.data)
        setBlogs(response.data)
        setErrors(null)
      }catch(err){
         setErrors('Somthing went wrong')
         setBlogs(null)
      }
      }
      fun()
    },[])
    return (
        <div>
              {
                blogs &&
                <div>
                <h4>{blogs.title}</h4>
                <p>{blogs.content}</p>
                </div>
              }
              {
                errors && 
                <h3 style={{color:'red'}}>{errors}</h3>
              }
        </div>
    )
}