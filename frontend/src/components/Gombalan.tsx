import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

const noMessages = [
    {
        text: "Itu salah klik kan? Iya kann??",
        image: "https://i.pinimg.com/736x/1e/7c/6f/1e7c6ff7a0c26f7eaefbce683656193d.jpg"
    },
    {
        text: "Beneran mau no? Yakin banget?",
        image: "https://i.pinimg.com/736x/90/73/a9/9073a9359bff531cd830ae7384752934.jpg"
    },
    {
        text: "Oke oke... ini terakhir lho! Oke kalo masih no juga, aku anggap kamu emang gatau cara klik mau :(",
        image: "https://i.pinimg.com/736x/a6/43/f5/a643f5a40db387585b56bc767b66fddb.jpg"
    },
];

const RUN_AFTER = 3;

interface GombalanProps {
    targetName: string | null;
    onSuccess: (noCount: number) => void;
}

const Gombalan: React.FC<GombalanProps> = ({ targetName, onSuccess }) => {
    const [noCount, setNoCount] = useState(0);
    const [isAccepted, setIsAccepted] = useState(false);
    const [cardFading, setCardFading] = useState(false);
    const [isOfficiallyCouple, setIsOfficiallyCouple] = useState(false);
    const [showDateCard, setShowDateCard] = useState(false);
    const [jadianDate, setJadianDate] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const [noBtnOffset, setNoBtnOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const noBtnRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef    = useRef<HTMLHeadingElement>(null);
    const imageRef    = useRef<HTMLImageElement>(null);
    const buttonsRef  = useRef<HTMLDivElement>(null);
    const acceptAudioRef = useRef<HTMLAudioElement | null>(null);

    const isMobile = window.innerWidth <= 768;

    /* ─── Text helpers ─── */
    const getTitleText = () => {
        if (isAccepted) return 'HOREE KAMU NERIMA AKU!!';
        if (noCount > 0 && noCount <= noMessages.length) return noMessages[noCount - 1].text;
        if (noCount > noMessages.length) {
            const runTexts = [
                'Masih yakin pilih NO terus?',
                'Aku tetep nunggu jawaban IYA kamu kok!',
                'Udah ah,, mending klik YES aja!!',
                'Serius deh, YES itu enak lho!!',
            ];
            return runTexts[Math.min(noCount - noMessages.length - 1, runTexts.length - 1)];
        }
        return targetName
            ? `${targetName}, Kamu mau ngga jadi Pacarku?`
            : 'Kamu mau ngga jadi Pacarku?';
    };

    const getNoLabel = () => {
        if (noCount === 0) return 'gamau';
        if (noCount === 1) return 'gamau ihh';
        if (noCount === 2) return 'pokoknya gamau';
        const runLabels = ['beneran gamau!!', 'gamau titik!', 'GAMAU DONG!!', 'udah deh gamau', 'hahaha gamau!!'];
        return runLabels[Math.min(noCount - RUN_AFTER, runLabels.length - 1)];
    };

    const getImageSrc = () => {
        if (isAccepted) return 'https://media.tenor.com/gUiu1zyxfzYAAAAi/good-night-kiss-kiss.gif';
        if (noCount > 0 && noCount <= noMessages.length) return noMessages[noCount - 1].image;
        if (noCount > noMessages.length) return noMessages[noMessages.length - 1].image;
        return 'https://i.pinimg.com/736x/e4/72/4d/e4724dc43d60d24fa01eda5d6614715a.jpg';
    };

    // Yes button grows, No button shrinks
    const yesFontSize = `${Math.min(1.1 + noCount * 0.18, 2.3)}rem`;
    const yesPadding  = `${Math.min(10 + noCount * 4, 22)}px ${Math.min(24 + noCount * 6, 56)}px`;
    const noFontSize  = `${Math.max(1.0 - noCount * 0.09, 0.55)}rem`;

    /* ─── Shake ─── */
    const triggerShake = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
    };

    /* ─── Audio crossfade helper ─── */
    const crossfadeToAcceptSong = () => {
        const bgMusic = document.getElementById('bgMusic') as HTMLAudioElement | null;

        // Fade out background music
        if (bgMusic && !bgMusic.paused) {
            const fadeOut = setInterval(() => {
                if (bgMusic.volume > 0.02) {
                    bgMusic.volume = Math.max(0, bgMusic.volume - 0.02);
                } else {
                    bgMusic.pause();
                    bgMusic.volume = 0;
                    clearInterval(fadeOut);
                }
            }, 50);
        }

        // Fade in acceptance song
        const audio = new Audio('/somebody_pleasure.mp3');
        audio.volume = 0;
        audio.loop = true;
        acceptAudioRef.current = audio;

        audio.play().then(() => {
            let vol = 0;
            const fadeIn = setInterval(() => {
                vol = Math.min(vol + 0.01, 0.5);
                audio.volume = vol;
                if (vol >= 0.5) clearInterval(fadeIn);
            }, 40);
        }).catch(e => console.log('Accept audio blocked:', e));
    };

    /* ─── Yes handler ─── */
    const handleYesClick = () => {
        setIsAccepted(true);
        onSuccess(noCount);
        crossfadeToAcceptSong();

        const duration = 3000;
        const end = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };
        const ticker = setInterval(() => {
            const timeLeft = end - Date.now();
            if (timeLeft <= 0) return clearInterval(ticker);
            confetti({ ...defaults, particleCount: 50 * (timeLeft / duration), origin: { x: Math.random(), y: Math.random() - 0.2 } });
        }, 250);

        setTimeout(() => {
            setCardFading(true);
            setTimeout(() => {
                setCardFading(false);
                setIsOfficiallyCouple(true);
                confetti({ particleCount: 130, spread: 110, origin: { y: 0.5 }, zIndex: 10000 });

                setTimeout(() => {
                    setCardFading(true);
                    setTimeout(() => {
                        const today = new Date();
                        setJadianDate(today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
                        setCardFading(false);
                        setShowDateCard(true);
                        confetti({ particleCount: 170, spread: 140, origin: { y: 0.6 }, zIndex: 10000 });
                    }, 800);
                }, 3500);
            }, 800);
        }, 5000);
    };

    const handleNoClick = () => {
        triggerShake();
        setNoCount(prev => prev + 1);
    };

    const isRunning = noCount >= RUN_AFTER;

    const clampAndSetNoOffset = (x: number, y: number) => {
        // Keep movement around original button slot so it never leaves the card.
        const limitX = isMobile ? 52 : 120;
        const limitY = isMobile ? 28 : 58;
        const safeX = Math.max(-limitX, Math.min(x, limitX));
        const safeY = Math.max(-limitY, Math.min(y, limitY));
        setNoBtnOffset({ x: safeX, y: safeY });
    };

    const runAway = (cursorX?: number, cursorY?: number) => {
        if (!noBtnRef.current) return;
        const btnRect = noBtnRef.current.getBoundingClientRect();

        let nextX = noBtnOffset.x;
        let nextY = noBtnOffset.y;

        if (cursorX != null && cursorY != null) {
            const centerX = btnRect.left + btnRect.width / 2;
            const centerY = btnRect.top + btnRect.height / 2;
            const angle = Math.atan2(centerY - cursorY, centerX - cursorX);
            const jump = isMobile ? 44 : 78;

            nextX = noBtnOffset.x + Math.cos(angle) * jump;
            nextY = noBtnOffset.y + Math.sin(angle) * (jump * 0.55);
        } else {
            nextX = noBtnOffset.x + (Math.random() > 0.5 ? 52 : -52);
            nextY = noBtnOffset.y + (Math.random() > 0.5 ? 24 : -24);
        }

        clampAndSetNoOffset(nextX, nextY);
    };

    // Desktop: escape when cursor gets close.
    useEffect(() => {
        if (!isRunning || isMobile) return;

        const PROXIMITY = 95;
        const onMouseMove = (e: MouseEvent) => {
            if (!noBtnRef.current) return;
            const rect = noBtnRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

            if (dist < PROXIMITY) {
                runAway(e.clientX, e.clientY);
            }
        };

        document.addEventListener('mousemove', onMouseMove);
        return () => document.removeEventListener('mousemove', onMouseMove);
    }, [isRunning, isMobile, noBtnOffset]);

    // Mobile: move away on touch, prevent accidental click.
    useEffect(() => {
        if (!isRunning || !isMobile || !noBtnRef.current) return;

        const btn = noBtnRef.current;
        const onTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            runAway(touch?.clientX, touch?.clientY);
        };

        btn.addEventListener('touchstart', onTouchStart, { passive: false });
        return () => btn.removeEventListener('touchstart', onTouchStart);
    }, [isRunning, isMobile, noBtnOffset]);

    useEffect(() => {
        if (!isRunning) {
            setNoBtnOffset({ x: 0, y: 0 });
        }
    }, [isRunning]);

    // Entrance animation — staggered professional reveal
    useEffect(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        // 1. Card slides up + fades in
        tl.fromTo(containerRef.current,
            { y: 80, opacity: 0, scale: 0.92, rotationX: 8 },
            { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 1.6, clearProps: 'rotationX,scale' }
        )
        // 2. Title drops in from above
        .fromTo(titleRef.current,
            { y: -30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.8)' },
        '-=0.9')
        // 3. Image pops
        .fromTo(imageRef.current,
            { scale: 0.75, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.0, ease: 'back.out(1.6)' },
        '-=0.5')
        // 4. Buttons slide up
        .fromTo(buttonsRef.current,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.85, ease: 'back.out(1.5)' },
        '-=0.45');
    }, []);

    /* ─── Render ─── */
    return (
        <div
            ref={containerRef}
            className={`container${isShaking ? ' is-shaking' : ''}`}
            style={{
                width: isMobile ? '90vw' : '470px',
                minHeight: '290px',
                padding: '3rem',
                position: 'relative', // Sangat Penting: agar 'absolute' di tombol No mengacu ke card ini
                zIndex: 10,
                transition: 'opacity 0.8s ease',
                opacity: cardFading ? 0 : 1,
                overflow: 'hidden', // Opsional: menjaga elemen agar terlihat rapi saat mendekati ujung padding
                backgroundColor: '#fff', // Pastikan background solid untuk test (sesuaikan dengan CSS aslimu)
                borderRadius: '20px'
            }}
        >
            {showDateCard ? (
                /* ── TANGGAL JADIAN ── */
                <>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px', animation: 'heartbeat 1.4s infinite', color: '#ff4d79', letterSpacing: '0.04em' }}>
                        {targetName ? targetName : 'Kamu'}
                    </div>
                    <h1 className="title" style={{ fontSize: isMobile ? '1.3rem' : '1.6rem', marginBottom: '8px', lineHeight: '1.4' }}>
                        TANGGAL JADIAN KITA!!
                    </h1>
                    <p style={{
                        color: '#ff1a53', fontWeight: 900, fontSize: isMobile ? '1.05rem' : '1.25rem',
                        margin: '0 0 16px', textShadow: '0 2px 10px rgba(255,26,83,0.3)',
                        animation: 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                    }}>
                        {jadianDate}
                    </p>
                    <img
                        src="https://media1.tenor.com/m/HZA1YV1NQkwAAAAC/happy-dance-panda.gif"
                        alt="celebration"
                        style={{ maxWidth: '100%', maxHeight: '190px', borderRadius: '20px', objectFit: 'cover', marginBottom: '14px', animation: 'popIn 0.7s cubic-bezier(0.34,1.56,0.64,1)' }}
                    />
                    <p style={{ color: '#ff758c', fontSize: '1rem', fontWeight: 'bold', margin: '0 0 4px' }}>
                        Happy anniversary setiap hari!
                    </p>
                    <p style={{ color: '#ffb3c6', fontSize: '0.85rem', margin: 0 }}>
                        semoga kita selalu bahagia ya
                    </p>
                </>
            ) : isOfficiallyCouple ? (
                /* ── RESMI PACARAN ── */
                <>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px', animation: 'heartbeat 1.2s infinite', color: '#ff4d79', letterSpacing: '0.04em' }}>
                        {targetName ? targetName : 'Kamu'}
                    </div>
                    <h1 className="title" style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', marginBottom: '16px', animation: 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)', lineHeight: '1.4' }}>
                        KITA RESMI PACARAN YA {targetName ? targetName.toUpperCase() : 'KAMU'}!
                    </h1>
                    <img
                        src="https://media1.tenor.com/m/b_rlhykPQ4AAAAAC/love.gif"
                        alt="couple"
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '20px', objectFit: 'cover', marginBottom: '16px', animation: 'popIn 0.7s cubic-bezier(0.34,1.56,0.64,1)' }}
                    />
                    <p style={{ color: '#ff758c', fontSize: '1.05rem', fontWeight: 'bold', margin: 0 }}>
                        muah!
                    </p>
                </>
            ) : (
                /* ── MAIN QUESTION ── */
                <>
                    <h1 ref={titleRef} className="title" style={{ fontSize: isMobile ? '1.2rem' : '1.45rem', marginBottom: '14px', lineHeight: '1.45' }}>
                        {getTitleText()}
                    </h1>

                    <img
                        ref={imageRef}
                        src={getImageSrc()}
                        alt="reaction"
                        style={{ maxWidth: '100%', maxHeight: '190px', borderRadius: '15px', objectFit: 'cover', display: 'block', margin: '0 auto 18px', transition: 'opacity 0.4s ease' }}
                    />

                    {!isAccepted && (
                        <div ref={buttonsRef} className="buttons" style={{ display: 'flex', gap: '14px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                            <button
                                className="btn yes-btn"
                                onClick={handleYesClick}
                                style={{
                                    padding: yesPadding,
                                    fontSize: yesFontSize,
                                    background: 'linear-gradient(135deg,#ff4d79,#ff758c)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                                    boxShadow: '0 4px 20px rgba(255,77,121,0.5)',
                                }}
                            >
                                IYA mau!
                            </button>

                            <button
                                ref={noBtnRef}
                                className={`btn no-btn${isRunning ? ' running' : ''}`}
                                onClick={(e) => {
                                    if (isRunning) {
                                        runAway(e.clientX, e.clientY);
                                        return;
                                    }
                                    handleNoClick();
                                }}
                                onMouseEnter={() => {
                                    if (isRunning) runAway();
                                }}
                                style={{
                                    padding: '10px 22px',
                                    fontSize: noFontSize,
                                    backgroundColor: '#f5f5f5',
                                    color: '#aaa',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    ...(isRunning ? {
                                        position: 'relative' as const,
                                        transform: `translate(${noBtnOffset.x}px, ${noBtnOffset.y}px)`,
                                        transition: 'transform 0.2s ease',
                                        zIndex: 9999,
                                    } : {}),
                                }}
                            >
                                {getNoLabel()}
                            </button>
                        </div>
                    )}

                    {noCount > 0 && !isAccepted && (
                        <p style={{ color: '#ffccd5', fontSize: '0.75rem', marginTop: '10px', marginBottom: 0 }}>
                            Kamu udah nyoba pencet tombol gamau sebanyak {noCount}x loh
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default Gombalan;