import React, { useState, useEffect } from 'react';
import CountdownApp from './components/CountdownApp';

function App() {
  const [targetDate, setTargetDate] = useState<Date>(() => {
    const saved = localStorage.getItem('targetDate');
    if (saved) {
      const date = new Date(saved);
      // Check if the date is valid and in the future
      if (!isNaN(date.getTime()) && date > new Date()) {
        return date;
      }
    }
    
    // Default to next New Year if no valid date is saved
    const nextNewYear = new Date();
    nextNewYear.setFullYear(nextNewYear.getFullYear() + 1, 0, 1);
    nextNewYear.setHours(0, 0, 0, 0);
    return nextNewYear;
  });

  // Save target date to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('targetDate', targetDate.toISOString());
  }, [targetDate]);

  // Tarih değişikliği işleyicisi
  const handleDateChange = (newDate: Date) => {
    setTargetDate(newDate);
  };

  return (
    <div className="app-container">
      <CountdownApp 
        targetDate={targetDate} 
        onDateChange={handleDateChange} 
      />
    </div>
  );
}

export default App;