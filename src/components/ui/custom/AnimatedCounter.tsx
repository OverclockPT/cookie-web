import { useEffect, useRef, useState } from "react";

/**
 * Animated Counter Component
 * 
 * Animates a Counter from 0 to the Value Provided
 * 
 * @param value - The Value to Animate To
 * @param duration - The Duration of the Animation in Milliseconds
 * @param className - The Class Name to Apply to the Counter
 * @returns The Animated Counter UI Component
 */
function AnimatedCounter({ value, duration = 1000, className }: { value: number | string; duration?: number, className?: string }) {

    //State & Ref
    const [displayValue, setDisplayValue] = useState(0);
    const rafRef = useRef<number>(0);

    //Effect to Animate the Counter
    useEffect(() => {

        //Start Time
        let start: number | null = null;
        const targetValue = Number(value);
        const isWholeNumber = targetValue % 1 === 0;

        //Animate Function
        function animate(ts: number) {

            //If Start is Null, Set it to the Current Time
            if (start === null) start = ts;

            //Calculate Elapsed Time
            const elapsed = ts - start;

            //Calculate Progress
            const progress = Math.min(elapsed / duration, 1);

            //Use a Smooth Easing Function
            const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
            let currentValue = eased * targetValue;

            //Round to appropriate precision based on whether target is whole number
            if (isWholeNumber) {
                currentValue = Math.round(currentValue);
            } else {
                currentValue = Math.round(currentValue * 100) / 100; // Round to 2 decimal places
            }

            //Set the Display Value
            setDisplayValue(currentValue);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                //Ensure the Final Value is Set
                setDisplayValue(targetValue);
            }
        }

        //Always Start from 0
        setDisplayValue(0);

        //Request Animation Frame
        rafRef.current = requestAnimationFrame(animate);

        //Cleanup
        return () => {
            //Cancel Animation Frame
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [value, duration]);

    //Return the Animated Counter UI Component
    return <span className={className}>{displayValue.toLocaleString('pt-PT', {
        minimumFractionDigits: typeof value === 'number' && value % 1 !== 0 ? 2 : 0,
        maximumFractionDigits: 2
    })}</span>;
}

//Export Animated Counter
export default AnimatedCounter;