import React, { useState, useEffect, useRef } from 'react';

// Props tanımı
interface CountdownAppProps {
  targetDate: Date;
  onDateChange: (date: Date) => void;
}

// Geri sayım için tip tanımı
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownApp: React.FC<CountdownAppProps> = ({ targetDate, onDateChange }) => {
  // Geri sayım durumu
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Input için referanslar - çift tıklama sorununu çözmek için
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // Geri sayım hesaplama
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        // Süre dolduğunda
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    // İlk hesaplamayı yap
    calculateTimeLeft();
    
    // Her saniye güncelle
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);

  // Tarih inputu için yardımcı fonksiyonlar
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeForInput = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Tarih değişikliği için işleyiciler - çift tıklama sorununu çözer
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Event propagasyonunu durdur
    
    const dateValue = e.target.value;
    const timeValue = formatTimeForInput(targetDate);
    
    const [year, month, day] = dateValue.split('-').map(num => parseInt(num));
    const [hours, minutes] = timeValue.split(':').map(num => parseInt(num));
    
    const newDate = new Date(year, month - 1, day, hours, minutes);
    onDateChange(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Event propagasyonunu durdur
    
    const dateValue = formatDateForInput(targetDate);
    const timeValue = e.target.value;
    
    const [year, month, day] = dateValue.split('-').map(num => parseInt(num));
    const [hours, minutes] = timeValue.split(':').map(num => parseInt(num));
    
    const newDate = new Date(year, month - 1, day, hours, minutes);
    onDateChange(newDate);
  };
  
  // Çift tıklama sorununu engellemek için ek işleyiciler
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Olayın yukarı doğru yayılmasını engelle
  };
  
  // Seçilen tarihi biçimlendirme
  const formatSelectedDate = (): string => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric', 
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
    };
    return targetDate.toLocaleDateString('tr-TR', options);
  };

  // Sayıları iki haneli göstermek için
  const padZero = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="countdown-container">
      <h1>Geri Sayım</h1>
      
      <div className="date-selection">
        <h2>Tarihe Geri Sayım</h2>
        
        <div className="inputs">
          <div className="input-group">
            <label>Tarih</label>
            <input
              ref={dateInputRef}
              type="date"
              value={formatDateForInput(targetDate)}
              onChange={handleDateChange}
              onClick={handleInputClick}
            />
          </div>
          
          <div className="input-group">
            <label>Saat</label>
            <input
              ref={timeInputRef}
              type="time"
              value={formatTimeForInput(targetDate)}
              onChange={handleTimeChange}
              onClick={handleInputClick}
            />
          </div>
        </div>
        
        <p className="selected-date">Seçilen tarih: {formatSelectedDate()}</p>
      </div>
      
      <div className="countdown">
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.days}</div>
          <div className="countdown-label">Gün</div>
        </div>
        
        <div className="countdown-item">
          <div className="countdown-value">{padZero(timeLeft.hours)}</div>
          <div className="countdown-label">Saat</div>
        </div>
        
        <div className="countdown-item">
          <div className="countdown-value">{padZero(timeLeft.minutes)}</div>
          <div className="countdown-label">Dakika</div>
        </div>
        
        <div className="countdown-item">
          <div className="countdown-value">{padZero(timeLeft.seconds)}</div>
          <div className="countdown-label">Saniye</div>
        </div>
      </div>
      
      <footer>
        <p>{new Date().getFullYear()} ❤️ Geri Sayım Uygulaması</p>
      </footer>
    </div>
  );
};

export default CountdownApp;