import React from 'react'
import LogOut from './LogOut'
import { Link } from 'react-router-dom'
import pic from "../assets/dashboard_4263925.png"
const Nav = () => {
  return (
    <div className='flex justify-between px-6 w-full py-4  bg-red-300 font-bold rounded'>
      <div>
        <h1><Link to={"/"}><img src={pic} className="rounded absolute top-1 left-8 mx-auto d-block w-14 h-14" alt="..."/></Link></h1>
      </div>
      <div>
        <h1><Link to={"/"} className='hover:text-white'>Home</Link></h1>
      </div>
      <div>
        <h1><Link to={"/employee-list"} className='hover:text-white'>Employee List</Link></h1>
      </div>
      <div>
        <h1 className='text-white'>{localStorage.getItem("username")}</h1>
      </div>
      <div>
        <h1><LogOut/></h1>
      </div>
    </div>
  )
}

export default Nav
