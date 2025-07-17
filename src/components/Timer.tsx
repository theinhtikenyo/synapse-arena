import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  targetTime: Date;
  onExpire?: () => void;
  className?: string;
  showIcon?: boolean;
}

function Timer({ targetTime, onExpire, className = '', showIcon = true }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft('00:00:00');
        setIsExpired(true);
        onExpire?.();
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onExpire]);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showIcon && (
        <Clock className={`h-5 w-5 ${isExpired ? 'text-red-500' : 'text-orange-500'}`} />
      )}
      <span className={`font-mono text-lg font-bold ${isExpired ? 'text-red-500' : 'text-orange-500'}`}>
        {timeLeft}
      </span>
    </div>
  );
}

export default Timer;
