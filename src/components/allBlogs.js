import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";

export default function AllBlogs() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [comment, setComment] = useState("");
    const [commentId, setCommentId] = useState("");
    
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('/api/posts');
                setBlogs(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchBlogs();
    }, []);

    const handleToggle = (id) => {
        setCommentId(commentId === id ? "" : id);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement comment submission logic
    };

    return (
        <div>
            <h1>All Blogs</h1>
            {blogs && blogs.map((blog) => (
                <div key={blog._id}>
                    <h4>{blog.title}</h4>
                    <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                    <button onClick={() => navigate(`/singlepost/${blog._id}`)}>View</button>
                    <button onClick={() => handleToggle(blog._id)}>{commentId === blog._id ? 'Cancel' : 'Comment'}</button>
                    {commentId === blog._id && (
                        <form onSubmit={handleSubmit}>
                            <textarea value={comment}  onChange={(e) => setComment(e.target.value)} /><br/>
                            <button type="submit">Submit</button>
                        </form>
                    )}
                </div>
            ))}
        </div>
    );
}
