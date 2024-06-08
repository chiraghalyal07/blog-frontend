import { useState } from "react";
import validator from "validator";
import axios from "../config/axios";
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

export default function Register({registerIn}) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        bio: '',
        profilePic: '',
        serverErrors: null,
        clientErrors: {}
    });
    const [errors, setErrors] = useState({});

    const runValidations = () => {
        const tempErrors = {};

        if (form.username.trim().length === 0) {
            tempErrors.username = 'Username is required';
        }

        if (form.email.trim().length === 0) {
            tempErrors.email = 'Email is required';
        } else if (!validator.isEmail(form.email)) {
            tempErrors.email = 'Invalid email format';
        }

        if (form.password.trim().length === 0) {
            tempErrors.password = 'Password is required';
        } else if (form.password.trim().length < 8 || form.password.trim().length > 128) {
            tempErrors.password = 'Password should be between 8 - 128 characters';
        }

        if (form.bio.trim().length === 0) {
            tempErrors.bio = 'Bio is required';
        }

        if (form.profilePic.trim().length === 0) {
            tempErrors.profilePic = 'Profile picture URL is required';
        }

        setErrors(tempErrors);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = _.pick(form, ['username', 'email', 'password', 'bio', 'profilePic']);

        runValidations();

        if (Object.keys(errors).length === 0) {
            try {
                const response = await axios.post('/api/users/register', formData);
                console.log(response.data);
                registerIn();
                navigate('/login');
            } catch (err) {
                // console.log(err.response.data);
                // setForm({ ...form, serverErrors: err.response.data });
                console.log(err);
                const serverErrors = err.response && err.response.data ? err.response.data : 'An unexpected error occurred';
                setForm({ ...form, serverErrors });
            }
        } else {
            setForm({ ...form, clientErrors: errors });
        }
    };

    const displayErrors = () => {
        if (form.serverErrors) {
            if (Array.isArray(form.serverErrors)) {
                return (
                    <div>
                        <h3>These errors prohibited the form from being saved:</h3>
                        <ul>
                            {form.serverErrors.map((ele, i) => (
                                <li key={i}>{ele.msg}</li>
                            ))}
                        </ul>
                    </div>
                );
            } else if (typeof form.serverErrors === 'string') {
                return <p>{form.serverErrors}</p>;
            }
        }
        return null;
    };

    return (
        <div>
            <h1>Register With Us</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Enter username</label><br />
                <input 
                    type="text" 
                    value={form.username} 
                    onChange={handleChange}
                    name="username" 
                    id="username"
                />
                {errors.username && <span>{errors.username}</span>}
                <br />

                <label htmlFor="email">Enter email</label><br />
                <input 
                    type="text" 
                    value={form.email} 
                    onChange={handleChange}
                    name="email" 
                    id="email"
                />
                {errors.email && <span>{errors.email}</span>}
                <br />

                <label htmlFor="password">Enter password</label><br />
                <input 
                    type="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    name="password"
                    id="password"
                />
                {errors.password && <span>{errors.password}</span>}
                <br />

                <label htmlFor="bio">Enter Bio</label><br />
                <input 
                    type="text" 
                    value={form.bio} 
                    onChange={handleChange}
                    name="bio" 
                    id="bio"
                />
                {errors.bio && <span>{errors.bio}</span>}
                <br />

                <label htmlFor="profilePic">Enter profile picture URL</label><br />
                <input 
                    type="text" 
                    value={form.profilePic} 
                    onChange={handleChange}
                    name="profilePic" 
                    id="profilePic"
                />
                {errors.profilePic && <span>{errors.profilePic}</span>}
                <br />

                <input type="submit" />
            </form>
            {form.serverErrors && displayErrors()}
        </div>
    );
}
