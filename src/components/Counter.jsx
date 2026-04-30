import { useState, useEffect, useRef } from "react";

export default function Counter() {
  const targetDateRef = useRef(new Date("2025-10-20T18:00:00+01:00").getTime());
  const [mounted, setMounted] = useState(false);

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDateRef.current - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [blinkVisible, setBlinkVisible] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateCounter = () => {
      const now = new Date().getTime();
      const difference = targetDateRef.current - now;

      if (difference <= 0) {
        setIsFinished(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false;
      }

      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
      setBlinkVisible((prev) => !prev);
      return true;
    };

    updateCounter();

    const interval = setInterval(() => {
      const shouldContinue = updateCounter();
      if (!shouldContinue) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeUnit = ({ value, label, gradient }) => (
    <div className="group" style={{ userSelect: "none" }}>
      <div className="time-unit flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-neutral-800 bg-neutral-950/50 backdrop-blur-sm transition-all duration-300 hover:bg-neutral-900/50 hover:border-neutral-700 hover:scale-105 hover:shadow-lg hover:shadow-neutral-900/50">
        <div
          className={`time-number text-2xl sm:text-3xl font-bold tabular-nums transition-colors duration-300 ${
            gradient
              ? "bg-gradient-to-br from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent"
              : "text-neutral-50"
          } group-hover:scale-110`}
        >
          {mounted ? String(value).padStart(2, "0") : "--"}
        </div>
        <div className="time-label text-xs sm:text-sm font-medium text-neutral-400 uppercase tracking-wider transition-colors duration-300 group-hover:text-neutral-300">
          {label}
        </div>
      </div>
    </div>
  );

  const isCounterFinished = mounted && isFinished;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      {/* Título del contador */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-neutral-100 to-neutral-100 bg-clip-text text-transparent mb-2">
          itzrauh
        </h2>
      </div>

      {isCounterFinished ? (
        <div className="text-center">
          <div className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-100 bg-clip-text text-transparent mb-4">
            Próximamente
          </div>
        </div>
      ) : (
        <div
          className="counter-mobile flex items-center gap-3 sm:gap-4 text-center"
          style={{ userSelect: "none" }}
        >
          <TimeUnit value={timeLeft.days} label="Días" gradient={true} />
          <div
            className="separator text-3xl sm:text-4xl font-bold text-neutral-400 transition-all duration-200 transform"
            style={{
              opacity: blinkVisible ? 1 : 0.3,
              transform: blinkVisible ? "scale(1)" : "scale(0.9)",
            }}
          >
            :
          </div>

          <TimeUnit value={timeLeft.hours} label="Horas" />

          <div
            className="separator text-3xl sm:text-4xl font-bold text-neutral-400 transition-all duration-200 transform"
            style={{
              opacity: blinkVisible ? 1 : 0.3,
              transform: blinkVisible ? "scale(1)" : "scale(0.9)",
            }}
          >
            :
          </div>

          <TimeUnit value={timeLeft.minutes} label="Min" />

          <div
            className="separator text-3xl sm:text-4xl font-bold text-neutral-400 transition-all duration-200 transform"
            style={{
              opacity: blinkVisible ? 1 : 0.3,
              transform: blinkVisible ? "scale(1)" : "scale(0.9)",
            }}
          >
            :
          </div>

          <TimeUnit value={timeLeft.seconds} label="Seg" />
        </div>
      )}
    </div>
  );
}
