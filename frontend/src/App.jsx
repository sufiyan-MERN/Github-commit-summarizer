import { useEffect } from 'react';
import './App.css'

 function App () {
  useEffect(()=>{
    fetchData()
  },[])

  const fetchData= async ()=>{
    console.log("1 fetch started");

    
const response= await fetch("http://localhost:8080/summarisecommit")
console.log("2 data fetch");

  const data= await response.json()
  console.log(" 3 repo commits ",data);
  }
  

  return (
    <h1>commit summarizer page</h1> 

  )
}

export default App
