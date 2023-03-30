import { useEffect, useState } from 'react'

export const Home = () => {
  const [ count, setCount ] = useState(0);
  const [ autoCountOn, setAutoCountOn ] = useState(true);

  function toggleAutoCount() {
    setAutoCountOn(!autoCountOn);
  }

  useEffect(() => {
    if (autoCountOn) {
      const interval = setInterval(() => {
        setCount(count => count + 1);        
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoCountOn])

  return (
    <div className="home-page">
      <h2>Reptile Tracker</h2>
      <p>Have you ever needed help keeping track of your reptiles? We got you!</p>
      <p>Log all your reptile's feedings and records all in one place. </p>
    </div>
  )
}