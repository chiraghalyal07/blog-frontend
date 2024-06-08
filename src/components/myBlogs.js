import { useState, useEffect } from "react";
import axios from "../config/axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";

export default function MyBlogs() {
    const [myBlogs, setMyBlogs] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [img, setImg] = useState("");
    const [serverErrors, setServerErrors] = useState(null);
    const [clientErrors, setClientErrors] = useState({});
    const [editId, setEditId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/posts/myposts", {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                setMyBlogs(response.data);
            } catch (err) {
                console.log(err);
                setServerErrors(err.response.data.errors);
            }
        };
        fetchData();
    }, []);

    const runValidations = () => {
        const errors = {};

        if (title.trim().length === 0) {
            errors.title = "Title is required";
        }

        if (content.trim().length === 0) {
            errors.content = "Content is required";
        }

        if (img.trim().length === 0) {
            errors.img = "Image is required";
        }

        setClientErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!runValidations()) {
            return;
        }

        const formData = { title, content, img };

        try {
            const response = await axios.put(
                `/api/posts/${editId}`,
                formData,
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );

            setMyBlogs((prevBlogs) =>
                prevBlogs.map((blog) =>
                    blog._id === editId ? response.data : blog
                )
            );
            setEditId(null);
        } catch (err) {
            console.log(err);
            setServerErrors(err.response.data.errors);
        }
    };

    const handleRemove = async (id) => {
        try {
            await axios.delete(`/api/posts/${id}`, {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            setMyBlogs((prevBlogs) =>
                prevBlogs.filter((blog) => blog._id !== id)
            );
        } catch (err) {
            console.log(err);
        }
    };

    const handleEdit = (id) => {
        setEditId(id);
        const blog = myBlogs.find((blog) => blog._id === id);
        setTitle(blog.title);
        setContent(blog.content);
        setImg(blog.img);
    };

    return (
        <div>
            <h1>My Blogs</h1>
            {myBlogs.map((blog) => (
                <div key={blog._id}>
                    <h4>{blog.title}</h4>
                    <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                    <button onClick={() => handleEdit(blog._id)}>Edit</button>
                    <button onClick={() => handleRemove(blog._id)}>
                        Delete
                    </button>
                    <button onClick={() => navigate(`/singlepost/${blog._id}`)}>
                        View
                    </button>
                </div>
            ))}
            {editId && (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {clientErrors.title && (
                        <span>{clientErrors.title}</span>
                    )}
                    <br />
                    <label htmlFor="content">Content</label>
                    <ReactQuill type='text' theme='snow' id='content' value={content} onChange={newContent => setContent(newContent)}/><br/>
                    {clientErrors.content && (
                        <span>{clientErrors.content}</span>
                    )}
                    <br />
                    <label htmlFor="img">Image URL</label>
                    <input
                        type="text"
                        value={img}
                        onChange={(e) => setImg(e.target.value)}
                    />
                    {clientErrors.img && (
                        <span>{clientErrors.img}</span>
                    )}
                    <br />
                    <button type="submit">Save</button>
                </form>
            )}
            {serverErrors && Array.isArray(serverErrors) && (
    <ul>
        {serverErrors.map((error, index) => (
            <li key={index}>{error.msg}</li>
        ))}
    </ul>
)}
        </div>
    );
}
