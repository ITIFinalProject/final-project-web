import { useState, useEffect } from 'react';

function CountDown() {

  const eventDate = '2025-08-31T23:59:59'; // Example event date
  const calculateTimeLeft = () => {
    const difference = +new Date(eventDate) - +new Date();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  if (!timeLeft) {
    return <div className="countdown-ended">🎉 The event has started!</div>;
  }

  return (
    <div className="countdown-container">
      <h2 className="countdown-title">Next Event Countdown</h2>
      <div className="countdown-timer">
        <div className="time-box">
          <span className="number">{timeLeft.days}</span>
          <span className="label">Days</span>
        </div>
        <div className="time-box">
          <span className="number">{timeLeft.hours}</span>
          <span className="label">Hours</span>
        </div>
        <div className="time-box">
          <span className="number">{timeLeft.minutes}</span>
          <span className="label">Minutes</span>
        </div>
        <div className="time-box">
          <span className="number">{timeLeft.seconds}</span>
          <span className="label">Seconds</span>
        </div>
      </div>
    </div>
  );
}

export default CountDown;
