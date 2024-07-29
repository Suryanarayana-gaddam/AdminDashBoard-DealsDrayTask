import './App.css'
import Nav from './components/Nav'
import Footer from './components/Footer'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    if(!localStorage.getItem("username")){
      navigate("/signup");
    }
  })

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
