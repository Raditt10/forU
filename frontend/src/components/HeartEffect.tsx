import React, { useEffect } from 'react';

const HeartEffect: React.FC = () => {

    // Floating hearts & flowers rising from bottom
    useEffect(() => {
        const colors = ['#ff4d79', '#ff758c', '#ffb3c6', '#ff9eb5', '#ff1a53', '#e91e8c', '#c2185b'];
        const heartSVG = `<svg viewBox="0 0 32 29.6" style="width:100%;height:100%;filter:drop-shadow(0px 2px 4px rgba(255,77,121,0.4))"><path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" fill="currentColor"/></svg>`;

        const createFloating = () => {
            const el = document.createElement('div');

            el.innerHTML = heartSVG;
            const size = Math.random() * 20 + 10;
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.color = colors[Math.floor(Math.random() * colors.length)];

            el.style.position = 'fixed';
            el.style.bottom = '-50px';
            el.style.left = `${Math.random() * 100}vw`;
            el.style.opacity = (Math.random() * 0.5 + 0.25).toString();
            el.style.zIndex = '1';
            el.style.pointerEvents = 'none';
            el.style.userSelect = 'none';

            const duration = Math.random() * 7 + 6;
            const sway = (Math.random() - 0.5) * 80;
            el.style.transition = `transform ${duration}s linear, opacity ${duration}s ease-in`;

            document.body.appendChild(el);

            requestAnimationFrame(() => {
                setTimeout(() => {
                    el.style.transform = `translateY(-120vh) translateX(${sway}px) rotate(${Math.random() * 180 - 90}deg)`;
                    el.style.opacity = '0';
                }, 50);
            });

            setTimeout(() => {
                if (document.body.contains(el)) el.remove();
            }, (duration + 1) * 1000);
        };

        const intervalId = setInterval(createFloating, 380);
        return () => clearInterval(intervalId);
    }, []);

    // Cursor sparkle trail on mouse move
    useEffect(() => {
        const sparkleChars = ['*', '+', '·', '•', '~', '¤'];

        const handleMouseMove = (e: MouseEvent) => {
            if (Math.random() > 0.28) return;

            const sparkle = document.createElement('span');
            sparkle.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
            sparkle.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                font-size: ${Math.random() * 14 + 8}px;
                pointer-events: none;
                z-index: 99998;
                animation: sparkleAnim 0.75s ease-out forwards;
                user-select: none;
                line-height: 1;
            `;
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 750);
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return null;
};

export default HeartEffect;