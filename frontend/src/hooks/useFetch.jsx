import React, { useEffect, useState } from 'react'

const useFetch = (url) => {
    const [data,setData] = useState([])

    useEffect(() => {
        if(url){
            const fetchData = async () => {
                try{
                    const response = await fetch(url);
                    if(!response.ok){
                         return alert("Error fetching data") 
                    }
                    const resData = await response.json();
                    console.log("Fetched Data:",resData)
                    setData(resData);
                }catch(error) {
                    console.log("Error in Fetch:"+error)
                }
            }
            fetchData();
        }
    },[url])
  return {data}
}
export default useFetch;
