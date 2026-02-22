import React, { useState, useRef, useEffect } from 'react';

const messages = [
    {
        text: "o gitu",
        image: "https://i.pinimg.com/736x/1e/7c/6f/1e7c6ff7a0c26f7eaefbce683656193d.jpg"
    },
    {
        text: "beneran?",
        image: "https://i.pinimg.com/736x/90/73/a9/9073a9359bff531cd830ae7384752934.jpg"
    },
    {
        text: "terakhir, kalo \"no\" yauda deh",
        image: "https://i.pinimg.com/736x/a6/43/f5/a643f5a40db387585b56bc767b66fddb.jpg"
    }
];

interface GombalanProps {
    targetName: string | null;
    onSuccess: (noCount: number) => void;
}

const Gombalan: React.FC<GombalanProps> = ({ targetName, onSuccess }) => {
    const [noCount, setNoCount] = useState(0);
    const [isAccepted, setIsAccepted] = useState(false);
    
    // Posisi dan style tombol No
    const [noBtnStyle, setNoBtnStyle] = useState<React.CSSProperties>({});
    const noBtnRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const isMobile = window.innerWidth <= 768;

    const getTitleText = () => {
        if (isAccepted) return "HOREEEE!!";
        if (noCount >= 3) return "TAPI BOONG HEHEHE";
        if (noCount > 0) return messages[noCount - 1].text;
        
        return targetName ? `${targetName}, apakah kamujh sayang ak?` : "Apakah kamujh sayang ak?";
    };

    const getImageSrc = () => {
        if (isAccepted) return "https://media.tenor.com/gUiu1zyxfzYAAAAi/good-night-kiss-kiss.gif";
        if (noCount > 0 && noCount <= 3) return messages[noCount - 1].image;
        if (noCount > 3) return messages[messages.length - 1].image; // Keep the last image
        return "https://i.pinimg.com/736x/e4/72/4d/e4724dc43d60d24fa01eda5d6614715a.jpg";
    };

    const handleYesClick = () => {
        setIsAccepted(true);
        onSuccess(noCount);
    };

    const isNearContainer = (x: number, y: number, containerRect: DOMRect, safeDistance: number) => {
        return x >= containerRect.left - safeDistance &&
               x <= containerRect.right + safeDistance &&
               y >= containerRect.top - safeDistance &&
               y <= containerRect.bottom + safeDistance;
    };

    const getFarPosition = (containerRect: DOMRect, windowWidth: number, windowHeight: number, buttonWidth: number, buttonHeight: number, safeDistance: number) => {
        const positions = [
            { x: Math.max(20, containerRect.left - buttonWidth - safeDistance), y: Math.random() * (windowHeight - buttonHeight - 40) + 20 },
            { x: Math.min(windowWidth - buttonWidth - 20, containerRect.right + safeDistance), y: Math.random() * (windowHeight - buttonHeight - 40) + 20 },
            { x: Math.random() * (windowWidth - buttonWidth - 40) + 20, y: Math.max(20, containerRect.top - buttonHeight - safeDistance) },
            { x: Math.random() * (windowWidth - buttonWidth - 40) + 20, y: Math.min(windowHeight - buttonHeight - 20, containerRect.bottom + safeDistance) }
        ];
        return positions[Math.floor(Math.random() * positions.length)];
    };

    const runAway = () => {
        if (!containerRef.current || !noBtnRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const buttonWidth = noBtnRef.current.offsetWidth;
        const buttonHeight = noBtnRef.current.offsetHeight;
        const safeDistance = isMobile ? 80 : 120;

        // Ensure we calculate position relative to the viewport (fixed)
        const currentX = parseInt(noBtnStyle.left as string) || containerRect.right + safeDistance;
        const currentY = parseInt(noBtnStyle.top as string) || containerRect.top;

        let newX, newY;

        if (isNearContainer(currentX, currentY, containerRect, safeDistance)) {
            const farPosition = getFarPosition(containerRect, windowWidth, windowHeight, buttonWidth, buttonHeight, safeDistance);
            newX = farPosition.x;
            newY = farPosition.y;
        } else {
            newX = currentX + (Math.random() - 0.5) * (isMobile ? 150 : 300);
            newY = currentY + (Math.random() - 0.5) * (isMobile ? 150 : 300);
        }

        const padding = isMobile ? 20 : 40;
        newX = Math.max(padding, Math.min(windowWidth - buttonWidth - padding, newX));
        newY = Math.max(padding, Math.min(windowHeight - buttonHeight - padding, newY));

        setNoBtnStyle({
            position: 'fixed',
            transition: `all ${isMobile ? '0.8s' : '0.6s'} cubic-bezier(0.34, 1.56, 0.64, 1)`,
            left: `${newX}px`,
            top: `${newY}px`,
            zIndex: 9999
        });
    };

    const handleNoClick = (e: React.MouseEvent | React.TouchEvent) => {
        if (noCount < 3) {
            setNoCount(prev => prev + 1);
        } else {
            runAway();
        }
    };

    const handleButtonDodge = (e: React.MouseEvent | React.TouchEvent) => {
        if (noCount >= 3) {
            e.preventDefault(); // Might not be perfectly possible with React synthetic events mapped to touchstart passively
            e.stopPropagation();
            runAway();
        }
    };
    
    // Handling passive touch events for running away need vanilla listeners because React hooks them up globally
    useEffect(() => {
        const btn = noBtnRef.current;
        if (!btn) return;
        
        const touchStartHandler = (e: TouchEvent) => {
             if (noCount >= 3) {
                 e.preventDefault();
                 e.stopPropagation();
                 runAway();
             }
        };
        const touchMoveHandler = (e: TouchEvent) => {
             if (noCount >= 3) {
                 e.preventDefault();
             }
        };

        btn.addEventListener('touchstart', touchStartHandler, { passive: false });
        btn.addEventListener('touchmove', touchMoveHandler, { passive: false });

        return () => {
            btn.removeEventListener('touchstart', touchStartHandler);
            btn.removeEventListener('touchmove', touchMoveHandler);
        };
    }, [noCount, noBtnStyle]);


    return (
        <div className="container" ref={containerRef}>
            <h1 className="title">{getTitleText()}</h1>
            <img src={getImageSrc()} alt="cute-gif" />
            
            {!isAccepted && (
                <div className="buttons">
                    <button className="btn yes-btn" onClick={handleYesClick}>Yes</button>
                    <button 
                        ref={noBtnRef}
                        className={`btn no-btn ${noCount >= 3 ? 'running' : ''}`}
                        onClick={handleNoClick}
                        onMouseOver={handleButtonDodge}
                        style={noBtnStyle}
                    >
                        No
                    </button>
                </div>
            )}
        </div>
    );
};

export default Gombalan;
