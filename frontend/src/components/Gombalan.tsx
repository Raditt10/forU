import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

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
    const [cardFading, setCardFading] = useState(false);
    const [isOfficiallyCouple, setIsOfficiallyCouple] = useState(false);
    
    // Posisi dan style tombol No
    const [noBtnStyle, setNoBtnStyle] = useState<React.CSSProperties>({});
    const noBtnRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const isMobile = window.innerWidth <= 768;

    const getTitleText = () => {
        if (isAccepted) return "HOREEE KAMU MENERIMA AKU ❤️!!";
        if (noCount >= 3) return "TAPI BOONG HEHEHE";
        if (noCount > 0) return messages[noCount - 1].text;
        
        return targetName ? `${targetName}, apakah kamu bersedia jadi kekasihku?` : "Apakah kamu bersedia jadi kekasihku?";
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
        
        // Trigger confetti
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        var interval: any = setInterval(function() {
            var timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            var particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
        }, 250);

        // Setelah 5 detik, fade out lalu ganti ke kartu resmi pacaran
        setTimeout(() => {
            setCardFading(true);
            setTimeout(() => {
                setCardFading(false);
                setIsOfficiallyCouple(true);
                // Confetti lagi pas kartu baru muncul 🎉
                confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, zIndex: 10000 });
            }, 800);
        }, 5000);
    };

    const runAway = (e?: React.MouseEvent | MouseEvent | TouchEvent, fromTouch: boolean = false) => {
        if (!noBtnRef.current) return;

        const btn = noBtnRef.current;
        const btnRect = btn.getBoundingClientRect();

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const buttonWidth = btnRect.width || 100;
        const buttonHeight = btnRect.height || 50;
        const safePadding = 20;

        const currentX = btnRect.left;
        const currentY = btnRect.top;

        let newX, newY;

        if (fromTouch || !e) {
             newX = Math.random() * (windowWidth - buttonWidth - safePadding * 2) + safePadding;
             newY = Math.random() * (windowHeight - buttonHeight - safePadding * 2) + safePadding;
        } else {
             let cursorX = 0;
             let cursorY = 0;
             if ('clientX' in e) {
                 cursorX = e.clientX;
                 cursorY = e.clientY;
             }
             
             const btnCenterX = currentX + buttonWidth / 2;
             const btnCenterY = currentY + buttonHeight / 2;

             const dx = btnCenterX - cursorX;
             const dy = btnCenterY - cursorY;

             const moveDist = 150;
             
             if (dx === 0 && dy === 0) {
                 newX = currentX + (Math.random() > 0.5 ? moveDist : -moveDist);
                 newY = currentY + (Math.random() > 0.5 ? moveDist : -moveDist);
             } else {
                 const angle = Math.atan2(dy, dx);
                 newX = currentX + Math.cos(angle) * moveDist;
                 newY = currentY + Math.sin(angle) * moveDist;
             }
        }

        if (newX < safePadding) newX = safePadding;
        if (newX > windowWidth - buttonWidth - safePadding) newX = windowWidth - buttonWidth - safePadding;
        
        if (newY < safePadding) newY = safePadding;
        if (newY > windowHeight - buttonHeight - safePadding) newY = windowHeight - buttonHeight - safePadding;

        setNoBtnStyle({
            position: 'fixed',
            left: `${newX}px`,
            top: `${newY}px`,
            transition: 'left 0.2s ease-out, top 0.2s ease-out',
            zIndex: 9999
        });
    };

    const handleNoClick = (e: React.MouseEvent) => {
        if (noCount < 3) {
            setNoCount(prev => prev + 1);
        } else {
            runAway(e, false);
        }
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (noCount >= 3 && !isMobile) {
            runAway(e, false);
        }
    };
    
    useEffect(() => {
        const btn = noBtnRef.current;
        if (!btn) return;
        
        const touchStartHandler = (e: TouchEvent) => {
             if (noCount >= 3) {
                 e.preventDefault();
                 e.stopPropagation();
                 runAway(e, true);
             }
        };

        btn.addEventListener('touchstart', touchStartHandler, { passive: false });

        return () => {
            btn.removeEventListener('touchstart', touchStartHandler);
        };
    }, [noCount, noBtnStyle]);

    return (
        <div 
            className="container" 
            ref={containerRef}
            style={{
                width: isMobile ? "90vw" : "450px",
                height: "auto",
                minHeight: "250px",
                padding: "3rem",
                borderRadius: "25px",
                border: "4px dashed #ff4d79",
                boxShadow: "0 10px 30px rgba(255, 77, 121, 0.3)",
                backgroundColor: "#fff",
                margin: "20px auto",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 10,
                transition: "opacity 0.8s ease",
                opacity: cardFading ? 0 : 1
            }}
        >
            {isOfficiallyCouple ? (
                // ==== KARTU RESMI PACARAN ====
                <>
                    <h1 className="title" style={{ color: '#ff4d79', fontSize: isMobile ? '1.3rem' : '1.6rem', marginBottom: '20px', animation: 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
                        KITA RESMI PACARAN YAA SEKARANG {targetName ? targetName.toUpperCase() : 'KAMU'}! 💕
                    </h1>
                    <img 
                        src="https://media1.tenor.com/m/2hYcy8HQrMUAAAAC/peach-cat-peach-and-goma.gif"
                        alt="couple sticker" 
                        style={{ 
                            maxWidth: '100%', 
                            maxHeight: '220px',
                            borderRadius: '20px', 
                            objectFit: 'cover',
                            marginBottom: '16px',
                            animation: 'popIn 0.7s cubic-bezier(0.34,1.56,0.64,1)'
                        }} 
                    />
                    <p style={{ color: '#ff758c', fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>muah!🩷</p>
                </>
            ) : (
                // ==== KARTU BIASA (PERTANYAAN + ACCEPTED) ====
                <>
                    <h1 className="title" style={{ color: '#ff4d79', fontSize: '1.5rem', marginBottom: '20px' }}>
                        {getTitleText()}
                    </h1>
                    
                    <img 
                        src={getImageSrc()} 
                        alt="cute-gif" 
                        style={{ 
                            maxWidth: '100%', 
                            maxHeight: '200px',
                            borderRadius: '15px', 
                            objectFit: 'cover',
                            marginBottom: '20px'
                        }} 
                    />
                    
                    {!isAccepted && (
                        <div className="buttons" style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button 
                                className="btn yes-btn" 
                                onClick={handleYesClick}
                                style={{
                                    padding: '10px 25px',
                                    fontSize: '1.1rem',
                                    backgroundColor: '#ff4d79',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 15px rgba(255, 77, 121, 0.4)'
                                }}
                            >
                                Yes
                            </button>
                            <button 
                                ref={noBtnRef}
                                className={`btn no-btn ${noCount >= 3 ? 'running' : ''}`}
                                onClick={handleNoClick}
                                onMouseEnter={handleMouseEnter}
                                style={{
                                    ...noBtnStyle,
                                    padding: '10px 25px',
                                    fontSize: '1.1rem',
                                    backgroundColor: '#f1f1f1',
                                    color: '#ff4d79',
                                    border: '2px solid #ff4d79',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                No
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Gombalan;
