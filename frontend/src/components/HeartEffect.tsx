import React, { useEffect } from 'react';

const HeartEffect: React.FC = () => {
    useEffect(() => {
        const createHeart = () => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '❤';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 3 + 2 + 's';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 5000);
        };

        const intervalId = setInterval(createHeart, 300);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return null; // This component doesn't render anything itself
};

export default HeartEffect;
