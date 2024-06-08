import React from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../config/axios";

export default function Account() {
    const { user, dispatch } = useAuth();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({
        username: user.profile ? user.profile.username : "",
        email: user.profile ? user.profile.email : "",
        bio: user.profile ? user.profile.bio : "",
    });

    const submitImage = async (e) => {
        e.preventDefault();
        try {
            const imageData = new FormData();
            imageData.append("profilePicture", image);
            const result = await axios.post("/api/users/upload-profile-picture", imageData, {
                headers: { Authorization: localStorage.getItem("token"), "Content-Type": "multipart/form-data" },
            });
            dispatch({ type: "LOGIN", payload: { account: result.data.user } });
            setImage(null);
        } catch (err) {
            console.log(err);
            alert(err);
        }
    };

    const onImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data before submit:', formData);

        try {
            const updatedUser = await axios.put(`/api/users/profile`, formData, {
                headers: { Authorization: localStorage.getItem("token")},
            });
            console.log('Updated User :',updatedUser)
            dispatch({ type: "LOGIN", payload: { account: updatedUser.data } });
            navigate("/account");
            setIsEdit(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error('Error response:', err.response.data);
            alert(err.response.data.error || "An error occurred");
        }
    };

    return (
        <div>
            <h1>Account Information</h1>
            {user.isLoggedIn ? (
                !isEdit ? (
                    <div>
                        {user.account?.profilePicture && (
                            <img
                                src={`http://localhost:3434/${user.account.profilePicture}`}
                                alt="Profile"
                                className="rounded-full w-40 h-40 object-cover"
                                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius:'50%'}} 
                                
                            />
                        )}
                        <p>Username: {user.account.username}</p>
                        <p>Email: {user.account.email}</p>
                        <p>Bio: {user.account.bio}</p>
                        <button onClick={() => setIsEdit(true)}>Edit Profile</button>
                    </div>
                ) : (
                    <>
                        <h3>Edit User</h3>
                        {user.account?.profilePicture && (
                            <img
                                src={`http://localhost:3434/${user.account.profilePicture}`}
                                alt="Profile"
                                className="w-40 h-40 object-cover rounded-full"
                            />
                        )}
                        <form onSubmit={submitImage} className="mb-4">
                            <input type="file" accept="image/*" onChange={onImageChange} className="mt-2"  />
                            <button type="submit">Submit</button>
                        </form>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    name="username"
                                    id="username"
                                />
                                <br />
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="text"
                                    value={formData.email}
                                    onChange={handleChange}
                                    name="email"
                                    id="email"
                                />
                                <br />
                                <label htmlFor="bio">Bio:</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={handleChange}
                                    name="bio"
                                    id="bio"
                                ></textarea>
                                <br />
                            </div>
                            <input type="submit" />
                        </form>
                    </>
                )
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
