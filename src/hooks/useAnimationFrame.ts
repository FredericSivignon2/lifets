import { useEffect, useRef } from "react";

export const useAnimationFrame = (nextAnimationFrameHandler: (width: number, height: number) => void, 
	width: number,
  	height: number,
	shouldAnimate: boolean = true) => {
    
	const frame = useRef(0);

    const animate = () => {
        nextAnimationFrameHandler(width, height);
        frame.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        // start or continue animation in case of shouldAnimate if true
        if (shouldAnimate) {
            frame.current = requestAnimationFrame(animate);
        } else {
            // stop animation
            cancelAnimationFrame(frame.current);
        }

        return () => cancelAnimationFrame(frame.current);
    }, [width, height, shouldAnimate]);
};