import { useEffect, useState } from 'react'
import LogOut from './LogOut'
import { Link } from 'react-router-dom'
import pic from "../assets/dashboard_4263925.png"
import { FaBarsStaggered, FaX } from 'react-icons/fa6'
const Nav = () => {
  const [isMenuToggle,setIsMenuToggle] = useState(false);
  const [userName,setUsername] = useState("")
  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  },[localStorage.getItem("username")])
  const handleToggle = () =>{
    if(isMenuToggle){
      setIsMenuToggle(false)
    }else{
      setIsMenuToggle(true);
    }

  }

  return (
    <div className='flex justify-between px-6 w-full py-4  bg-red-300 font-bold rounded'>
        <button className="md:hidden relative right-4" onClick={handleToggle}>{isMenuToggle ? <FaX/> : <FaBarsStaggered/>}</button>
      <div className={`${isMenuToggle ? "flex" : "hidden"} absolute left-1 top-[55px] bg-black p-2 text-center  flex-col space-y-3 text-rose-500`}>
        <div><Link to={"/"} onClick={handleToggle} className='hover:text-orange-500 px-8 hover:bg-gray-300 '>Home</Link></div>
        <div><Link to={"/employee-list"} onClick={handleToggle} className='hover:text-orange-500 bg-black p-1 w-full hover:bg-gray-300 '>Employee List</Link></div>
        <div>
        <h1 onClick={handleToggle}><LogOut/></h1>
      </div>
      </div>
      <div >
        <h1><Link to={"/"}><img src={pic} className="rounded absolute top-1 left-8 mx-auto d-block w-14 h-14" alt="..."/></Link></h1>
      </div>
      <div className="hidden md:block">
        <h1><Link to={"/"} className='hover:text-white'>Home</Link></h1>
      </div>
      <div className="hidden md:block">
        <h1><Link to={"/employee-list"} className='hover:text-white'>Employee List</Link></h1>
      </div>
      <div>
        <h1 className='text-white relative left-20 shadow-2xl md:left-0 top-1 md:top-0'>{userName}</h1>
      </div>
      <div className='relative left-5 md:left-0'>
        <h1><LogOut/></h1>
      </div>
    </div>
  )
}

export default Nav
