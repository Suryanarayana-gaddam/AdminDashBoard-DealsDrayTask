import React from 'react'
import { useNavigate } from 'react-router-dom';

const LogOut = () => {
  const navigate = useNavigate();

  const handleDelete = (event) =>{
    event.preventDefault();
    const isConfirmed = window.confirm("Do you want to Log Out ?");
    if(isConfirmed){
      localStorage.removeItem("username");
      alert("Logged out !")
      navigate("/login")
    }
  }

  return (
    <div>
      <button onClick={handleDelete} className='bg-red-500 rounded text-white px-2 py-1 hover:text-red-600 hover:bg-white'>Log Out</button>
    </div>
  )
}

export default LogOut
