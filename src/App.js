import {Link,Routes,Route} from "react-router-dom"
import axios from "./config/axios";
import { useEffect } from "react";
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "./auth/AuthContext";
import Home from "./components/home"
import Register from "./components/register";
import Login from "./components/login";
import Account from "./components/account";
import AddBlogs from "./components/addBlogs";
import AllBlogs from "./components/allBlogs";
import SinglePost from "./components/singlePost";
import MyBlogs from "./components/myBlogs";
import PrivateRoute from "./components/privateRoute";

function App() {
  const {user,dispatch} = useAuth()
  useEffect(() => {
    if(localStorage.getItem('token'))  {
      
      (async () => {

        const response = await axios.get('api/users/profile', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
        console.log(response.data)
        dispatch({ type: 'LOGIN', payload: { account: response.data } })
      })();
    }
  }, [])
  const registerIn=()=>{
    toast("successfully Registered !!")
     }
  const loggedIn=()=>{
    toast("successfully logged !!")
     }
  return (
    <div>
      <h1>Blogs App</h1>
      <Link to='/'>Home</Link>|
      <Link to='/allblogs'>AllBlogs</Link>|
      {
        user.isLoggedIn ? (
          <>
          <Link to='/account'>Account</Link>|
          <Link to='/addblogs'>AddBlogs</Link> | 
          <Link to='/myblogs'>MyBlogs</Link> |
          <Link to='/' onClick={()=>{
            localStorage.removeItem('token')
            dispatch({type:'LOGOUT'})
            }}>Logout</Link>
          </>
        ):(
          <>
            <Link to='/register'>Register</Link>|
            <Link to='/login'>Login</Link> 
          </>
        )
      }
      <Routes>
        <Route path='/'element={<Home/>}/>
        <Route path="/register" element={<Register registerIn={registerIn}/>}/>
        <Route path="/login" element={<Login loggedIn={loggedIn}/>}/>
        <Route path='/allblogs' element={<AllBlogs/>}/>
        <Route path="/account" element={
        <PrivateRoute>
        <Account/>
        </PrivateRoute>} />
        <Route path='/addblogs' element={
        <PrivateRoute>
          <AddBlogs/>
        </PrivateRoute>} />
        <Route path='/myblogs' element={
          <PrivateRoute><MyBlogs/></PrivateRoute>
        }/>
        <Route path='/singlepost/:postId' element={
          <PrivateRoute>
            <SinglePost/>
          </PrivateRoute>
        }/>
      </Routes>
      <ToastContainer
      position="top-center"
      autoClose={5000}
      // hideProgressBar={false}
      // newestOnTop={false}
      // closeOnClick
      // rtl={false}
      // pauseOnFocusLoss
      // draggable
      // pauseOnHover
      theme="dark"/>
    </div>
  );
}

export default App;
