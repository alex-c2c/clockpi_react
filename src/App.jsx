import { useEffect, useState } from 'react'
import '../css/App.css'
import '../css/button-3.css'
import TimeSection from './time_section'

function App() {
  const [count, setCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/api/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <>
      <TimeSection/>
    </>
  )
}

export default App
