import './App.css'
import Nav from './components/Nav'
import Footer from './components/Footer'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function App() {
  const navigate = useNavigate();
  const [loading,setLoading] = useState();

  useEffect(() => {
    setLoading(true)
    setTimeout(() =>{
      if(!localStorage.getItem("username") && location.href!=="https://admin-dash-board-indol-six.vercel.app/"){
        navigate("/signup");
        setLoading(false);
      }
    },2000);
  },[location.href,localStorage.getItem("username")])

  if(loading){
    return <div className=" flex flex-col items-center justify-center h-screen">
      <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
          </div>
      </div>
      Loading...Please Wait...
  </div>
  }

  return (
    <div className=''>
      <Nav/>
      <div className='min-h-screen'>
          <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default App
