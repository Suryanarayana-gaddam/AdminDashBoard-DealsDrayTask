import pica from 'pica';
import React, { useEffect, useState } from 'react'
import { FaX } from 'react-icons/fa6';
import { useLoaderData, useNavigate } from 'react-router-dom'

const EditEmployee = () => {
    const {_id,empName,email,mobile,designation,gender,course,img} = useLoaderData();
    console.log({_id,empName,email,mobile,designation,gender,course,img})
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const userName = localStorage.getItem("username");
    const picaa = pica();
    const [genderSet,setGenderSet] = useState("");
    const [profilePic,setProfilePic] = useState(img);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [picChangeClicked, setPicChangeClicked] = useState(false);

    const handleChange = (e) => {
        const { value, checked } = e.target;
        setSelectedCourses((prevSelectedCourses) =>
        checked
            ? [...prevSelectedCourses, value]
            : prevSelectedCourses.filter((course) => course !== value)
        );
    };

    useEffect(() => {
        setGenderSet(gender);
        setSelectedCourses(course);
    },[gender])

    const handleClose = () => {
        navigate("/employee-list");
    }

  
    const formSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        
        const validate = () => {
        const newErrors = {};
        if(selectedCourses.length === 0){
            newErrors.checkbox = 'please select course!';
          }
          if (!/\S+@\S+\.\S+/.test(form.email.value)) newErrors.email = 'Email is invalid';
          if (!/^\d{10}$/.test(form.mobile.value)) newErrors.mobile = 'Mobile no must be 10 digits long';
          const fileExtension = String(form.image.value).slice(String(form.image.value).lastIndexOf(".")+1)
          if (form.image.value && !['image/jpeg', 'image/png',"png","jpg","jpeg"].includes(fileExtension)) {
            newErrors.img = 'Only jpg and png files are allowed';
          }
          if(form.designation.value == "-1"){
            newErrors.designation = "Please select designation!"
          }
          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
        };

        if (!validate()) return;
        
        const empName = form.empName.value;
        const email = form.email.value;
        if(form.designation.value == -1){
        return alert("Please select designation")
        }
        const designation = form.designation.value;
        const mobile = form.mobile.value;
        const gender = form.gender.value;
        const course = selectedCourses;
        const empData = { userName,empName,email,designation,mobile,gender,course,img:profilePic };
        console.log("empData :",empData)
        fetch(`https://admin-dash-board-api.vercel.app/update/employee/${_id}`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(empData)
        })
        .then(res => res.json())
        .then(data => {
        form.reset();
        navigate("/employee-list")
        alert("Employee details updated successfully:"+ data);
        })
        .catch(error => {
        console.error("Error adding task:", error);
        });
    };


    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
        try {
            const resizedImage = await resizeImage(file);
            const reader = new FileReader();

            reader.onloadend = () => {
            setProfilePic(reader.result);
            };

            reader.readAsDataURL(resizedImage);
        } catch (error) {
            console.error('Error resizing image:', error);
        }
        }
    };

    const resizeImage = (file) => {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img');
            const canvas = document.createElement('canvas');
            const reader = new FileReader();

            reader.onload = (event) => {
                img.src = event.target.result;
            };

            img.onload = () => {
                const width = 300; 
                const scaleFactor = width / img.width;
                const height = img.height * scaleFactor;

                canvas.width = width;
                canvas.height = height;

                picaa.resize(img, canvas)
                    .then(result => picaa.toBlob(result, 'image/jpeg', 0.90))
                    .then(blob => resolve(blob))
                    .catch(err => reject(err));
            };

            img.onerror = reject;

            reader.readAsDataURL(file);
        });
    }; 
    const setGenderChnage = (e) =>{
        setGenderSet(e.target.value);
    }

  return (
    <div className='grid justify-center  place-items-center p-2 h-[500px] w-full'>
          <form onSubmit={formSubmit} className={` text-black relative border-2 outline outline-black p-3 h-[450px] space-y-4`}>
            <h1 className='text-center font-bold text-xl'>Update Employee Details</h1>
            <FaX onClick={handleClose} className='absolute top-0 right-2 cursor-pointer'/>
            <div className='flex'>
              <label htmlFor="empName" className='font-semibold w-56'>Employee Name :</label>
              <input type="text" name='empName' id='empName' required autoFocus className=' border-gray-400 border-2 outline-none text-center w-full ' defaultValue={empName}/>
            </div>
            <div className='flex relative'>
              <label htmlFor="email" className='font-semibold w-56'>Email :</label>
              <input type="email" name='email' id='email' required className=' border-gray-400 border-2 outline-none text-center w-full' defaultValue={email}/>
              {errors.email && <span className='absolute top-[24px] left-36 text-red-500'>{errors.email}</span>}
            </div>
            <div className='flex relative'>
              <label htmlFor="mobile" className='font-semibold w-56'>Mobile Number :</label>
              <input type="text" name='mobile' id='mobile' required className=' border-gray-400 border-2 outline-none text-center w-full' defaultValue={mobile}/>
              {errors.mobile && <span className='absolute top-[23px] left-36 text-red-500'>{errors.mobile}</span>}
            </div>
            <div className='flex relative'>
              <label htmlFor="designation" className='font-semibold w-56'>Designation :</label>
              <select name="designation" id="designation" className=' border-gray-400 border-2 outline-none text-center w-full' defaultValue={designation}>
                <option className='bg-gray-400' value="-1">Select designation</option>
                <option className='border' value="HR">HR</option>
                <option className='border' value="Manager">Manager</option>
                <option className='border' value="Sales">Sales</option>
            </select>
            {errors.designation && <span className='absolute top-[23px] left-36 text-red-500'>{errors.designation}</span>}
            </div>
            <div  className='flex'>
              <label htmlFor="gender" className='font-semibold '>Gender : </label>
              <input type='radio' name="gender" id="male" value="male" required className='border-gray-400 border-2 outline-none text-center w-fit ml-6 mr-2' onChange={setGenderChnage} checked={genderSet === "male"}/>
              <label htmlFor="male"> Male </label>
              <input type='radio' name="gender" id="female" value="female" required className='border-gray-400 border-2 outline-none text-center w-fit ml-6 mr-2' onChange={setGenderChnage} checked={genderSet === "female"}/>
              <label htmlFor="female"> Female </label>
              <input type='radio' name="gender" id="others" value="others" required className='border-gray-400 border-2 outline-none text-center w-fit ml-6 mr-2' onChange={setGenderChnage} checked={genderSet === "others"}></input>
              <label htmlFor="female"> Others </label>
            </div>
            <div className='flex relative'>
              <label className='font-semibold'>Course :</label>
              <div className='flex items-center'>
                <input type="checkbox" id="mca" name="course" value="MCA" checked={selectedCourses.includes("MCA")} onChange={handleChange} className='ml-6 mr-2' />
                <label htmlFor="mca">MCA</label>
              </div>
              <div className='flex items-center'>
                <input type="checkbox" id="bca" name="course" value="BCA" checked={selectedCourses.includes("BCA")} onChange={handleChange} className='ml-6 mr-2'/>
                <label htmlFor="bca">BCA</label>
              </div>
              <div className='flex items-center'>
                <input type="checkbox" id="bsc" name="course" value="BSc" checked={selectedCourses.includes("BSc")} onChange={handleChange} className='ml-6 mr-2'/>
                <label htmlFor="bsc">BSc</label>
                {errors.checkbox && <span className='absolute top-5 left-20 text-red-500'>{errors.checkbox}</span>}
              </div>
            </div>
            <div className='relative'>
              <label htmlFor="image" className='font-semibold'>Image :</label>
              <div className={`${picChangeClicked ? "hidden" : "flex justify-evenly"}`}>
                <img src={profilePic} alt="" width={80} height={80}/>
                <button type='button' className='bg-gray-500 hover:bg-gray-300 hover:text-black p-1 rounded font-semibold w-20 h-10' onClick={() => setPicChangeClicked(true)}>Change</button>
              </div>
              <div className={`${picChangeClicked ? "flex justify-evenly" : "hidden"}`}>
                <input type="file" alt='img-input' name="image" id="image" accept=".jpeg, .png, .jpg" onChange={handleProfilePicChange} className=" h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"/>
                <button type='button' className='bg-gray-500 hover:bg-gray-300 hover:text-black p-1 rounded font-semibold w-20 h-10' onClick={() => setPicChangeClicked(false)}>Cancel</button>
              </div>
              {errors.img && <span className='absolute top-[55px] left-20 text-red-500'>{errors.img}</span>}
            </div>
            <div className='pl-32'>
              <button type='submit' className='border-2 border-gray-500 px-2 font-semibold'>Submit</button>
            </div>
          </form>
        </div>
  )
}

export default EditEmployee
