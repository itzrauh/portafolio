import { useState, useEffect } from "react";

export default function Birthday() {
  const [showBalloons, setShowBalloons] = useState(false);
  const [balloons, setBalloons] = useState([]);

  const SPECIAL_DATE = {
    month: 2, // 19 de marzo !!!!!!!!!!!! papelbirthday
    day: 19,
  };

  useEffect(() => {
    const today = new Date();
    const isSpecialDay =
      today.getMonth() === SPECIAL_DATE.month &&
      today.getDate() === SPECIAL_DATE.day;

    if (isSpecialDay) {
      setShowBalloons(true);
      const newBalloons = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 3,
        size: 40 + Math.random() * 30,
        color: [
          "from-red-400 to-red-600",
          "from-blue-400 to-blue-600",
          "from-yellow-400 to-yellow-600",
          "from-green-400 to-green-600",
          "from-purple-400 to-purple-600",
          "from-pink-400 to-pink-600",
          "from-orange-400 to-orange-600",
          "from-teal-400 to-teal-600",
          "from-cyan-400 to-cyan-600",
          "from-lime-400 to-lime-600",
        ][Math.floor(Math.random() * 6)],
        swing: Math.random() * 20 - 10,
      }));

      //los globos parecen condones pero esta todo perfe, WEBStORM todo NO ES TO DO

      setBalloons(newBalloons);

      const timer = setTimeout(() => {
        setShowBalloons(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!showBalloons) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className="absolute bottom-0"
          style={{
            left: `${balloon.left}%`,
            animationDelay: `${balloon.delay}s`,
            animation: `floatUp ${
              balloon.duration
            }s ease-in-out forwards, swing ${
              2 + Math.random()
            }s ease-in-out infinite`,
          }}
        >
          <div
            className={`relative bg-gradient-to-br ${balloon.color} rounded-full shadow-lg`}
            style={{
              width: `${balloon.size}px`,
              height: `${balloon.size * 1.2}px`,
            }}
          >
            <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full" />

            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-3 bg-gradient-to-b from-current to-transparent"
              style={{ color: "inherit" }}
            />
          </div>

          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-20 bg-neutral-400"
            style={{
              transformOrigin: "top",
              animation: `swingString 2s ease-in-out infinite`,
            }}
          />
        </div>
      ))}

      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={`confetti-${i}`}
          className="absolute top-0"
          style={{
            left: `${Math.random() * 100}%`,
            animation: `fall ${3 + Math.random() * 2}s linear forwards`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          <div
            className={`w-2 h-3 ${
              [
                "bg-red-500",
                "bg-blue-500",
                "bg-yellow-500",
                "bg-green-500",
                "bg-purple-500",
                "bg-pink-500",
                "bg-orange-500",
                "bg-teal-500",
                "bg-cyan-500",
                "bg-lime-500",
              ][Math.floor(Math.random() * 6)]
            }`}
            style={{
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) translateX(${
              Math.random() * 100 - 50
            }px);
            opacity: 0;
          }
        }

        @keyframes swing {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          25% {
            transform: translateX(10px) rotate(5deg);
          }
          75% {
            transform: translateX(-10px) rotate(-5deg);
          }
        }

        @keyframes swingString {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(5deg);
          }
          75% {
            transform: rotate(-5deg);
          }
        }

        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes fadeInScale {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
