import { useState, useEffect } from 'react';
import '../css/time_section.css';

export default function TimeSection()
{
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
    const intervalId = setInterval(() => {
        setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);
    
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    
    const renderDigits = (timeStr) =>
    timeStr.split('').map((digit, idx) => (
      <span key={`${digit}-${idx}`} className="clockDigit">
        {digit}
      </span>
    ));
    
    return (
    <div className="timeContainer">
        <div className="timeSection">
        <h2>Current Time</h2>
        <p className="clockDisplay">
            {renderDigits(hours)}
            <span className="clockColon">:</span>
            {renderDigits(minutes)}
        </p>
        </div>
    </div>
    );
};
