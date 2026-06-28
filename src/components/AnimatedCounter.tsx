import { useEffect, useState } from 'react';
import { useMotionValue, animate } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  duration?: number; // duration in seconds (framer-motion standard)
  formatter?: (val: number) => string;
}

export default function AnimatedCounter({ 
  value, 
  decimals = 0, 
  duration = 1.2, 
  formatter 
}: AnimatedCounterProps) {
  const [currentValue, setCurrentValue] = useState(0);
  const count = useMotionValue(0);

  useEffect(() => {
    // Animate count from 0 to target value on load or when the value changes
    const controls = animate(count, value, {
      duration: duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        setCurrentValue(parseFloat(latest.toFixed(decimals)));
      }
    });

    return () => controls.stop();
  }, [value, duration, decimals, count]);

  return <>{formatter ? formatter(currentValue) : currentValue}</>;
}
