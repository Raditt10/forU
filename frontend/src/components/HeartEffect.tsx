import React, { useEffect } from 'react';

const HeartEffect: React.FC = () => {
    useEffect(() => {
        const createHeart = () => {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = ['❤', '🩷', '💖', '✨'][Math.floor(Math.random() * 4)];
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 4 + 3 + 's'; // 3s to 7s
            heart.style.fontSize = Math.random() * 15 + 15 + 'px'; // 15px to 30px
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 7000);
        };

        const intervalId = setInterval(createHeart, 300);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return null; // This component doesn't render anything itself
};

export default HeartEffect;
