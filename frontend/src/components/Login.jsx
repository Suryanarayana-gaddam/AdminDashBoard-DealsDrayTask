import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [isShowClicked,setIsShowClicked] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;
    const userData = {
      username,
      password
    }
    fetch("https://admin-dash-board-api.vercel.app/login-user",{
      method:"POST",
      headers:{
        "Content-type" : "application/json",
      },
      body:JSON.stringify(userData)
    }).then(res => {
      if(res.status !== 200){
        if(res.status === 404){
          return alert(res.status+" : User not found");
        }else if(res.status === 401){
          return alert(res.status+" : Password is Incorrect");
        }
      }
      console.log("res:",res)
      alert("Welcome Back User...")
      navigate("/",{replace:true});
      return res.json();
    }).then(response => {
      localStorage.removeItem("username")
      console.log(response)
      localStorage.setItem("username",response.username)
    }).catch(error =>{
      console.error("Error in Login:",error)
    })
  }

  return (
    <div className='grid justify-center items-center h-screen bg-red-100'>
      <form onSubmit={handleLogin} className='form bg-slate-50 text-blue-500 transition-all duration-2s w-96 h-fit p-6 rounded-xl shadow-2xl flex-row flex-wrap flex-grow'>
        <h1 className='bg-rose-500 text-transparent bg-clip-text h-12 text-center font-bold text-4xl'>Login Form</h1>
        
        <div>
          <div className="label text-xl mb-2">User Name*</div>
          <input type="text" name='username' id='username' autoFocus autoComplete='off' placeholder='Enter your username' required  onChange={e => {e.target.value = e.target.value.toUpperCase()}} className='w-full p-1  bg-gray-200 text-black' />
        </div>
        <div className='relative'>
          <div className="label text-xl mb-2">Password*</div>
          <input type={isShowClicked ? "text" : "password"} name='password' id='password'  placeholder='Enter your password' required   className='bg-gray-200 p-1 text-black  w-full' />
          <button type='button' onClick={() =>{if(isShowClicked){setIsShowClicked(false)}else{setIsShowClicked(true)}}} className='absolute right-3 top-11 text-black'>{ isShowClicked ? <FaEyeSlash/> : <FaEye/>}</button>
        </div>
        <p>Don&apos;t have an account, please <Link to="/signup" className='text-indigo-800 hover:underline'>SignUp</Link> here.</p><br />
        <div><button className='bg-indigo-700 w-full text-center p-1 rounded font-semibold text-white hover:text-green-500 hover:bg-white'>Login</button></div>
      </form>
    </div>
  )
}

export default Login
