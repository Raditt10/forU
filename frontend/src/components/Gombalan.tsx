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
        text: "Oke oke... ini terakhir lho! Setelah ini tombolnya kabur",
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

    const noBtnRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef    = useRef<HTMLHeadingElement>(null);
    const imageRef    = useRef<HTMLImageElement>(null);
    const buttonsRef  = useRef<HTMLDivElement>(null);

    const isMobile = window.innerWidth <= 768;

    /* ─── Text helpers ─── */
    const getTitleText = () => {
        if (isAccepted) return 'HOREE KAMU NERIMA AKU!!';
        if (noCount > 0 && noCount <= noMessages.length) return noMessages[noCount - 1].text;
        if (noCount > noMessages.length) {
            const runTexts = [
                'Itu tombolnya lagi kabur, tangkep dong!',
                'Hahaha ngga bisa dikejar kan?',
                'Udah ah,, mending klik YES aja!!',
                'Serius deh, YES itu enak lho!!',
            ];
            return runTexts[Math.min(noCount - noMessages.length - 1, runTexts.length - 1)];
        }
        return targetName
            ? `${targetName}, mau jadi kekasih aku ga?`
            : 'Mau jadi kekasih aku ga?';
    };

    const getNoLabel = () => {
        if (noCount === 0) return 'No';
        if (noCount === 1) return 'Tetap no...';
        if (noCount === 2) return 'NO DONG!';
        const runLabels = ['KABUR!!', 'LARI!!', 'NGGA MAU!!', 'BYEEE!!', 'HAHAHA!!'];
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

    /* ─── Yes handler ─── */
    const handleYesClick = () => {
        setIsAccepted(true);
        onSuccess(noCount);

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

    /* ─── No / run-away logic ─── */
    const [noBtnPos, setNoBtnPos] = useState<{ left: number; top: number } | null>(null);

    const runAway = (cursorX?: number, cursorY?: number) => {
        if (!noBtnRef.current || !containerRef.current) return;
        const btn = noBtnRef.current;
        const card = containerRef.current;

        const pad = 24; // Jarak aman dari ujung card agar tombol tidak kepotong
        const bw = btn.offsetWidth;
        const bh = btn.offsetHeight;
        const cw = card.offsetWidth;
        const ch = card.offsetHeight;

        // Batasan area gerak relatif terhadap card
        const minX = pad;
        const maxX = Math.max(minX, cw - bw - pad);
        const minY = pad;
        const maxY = Math.max(minY, ch - bh - pad);

        let nx: number, ny: number;

        if (cursorX != null && cursorY != null) {
            const cardRect = card.getBoundingClientRect();
            const btnRect = btn.getBoundingClientRect();

            // Posisi cursor relatif terhadap card
            const relCursorX = cursorX - cardRect.left;
            const relCursorY = cursorY - cardRect.top;

            // Titik tengah tombol saat ini relatif terhadap card
            const btnRelX = (btnRect.left - cardRect.left) + bw / 2;
            const btnRelY = (btnRect.top - cardRect.top) + bh / 2;

            // Jauhkan dari kursor sejauh jarak tertentu
            const dist = 90 + Math.min(noCount * 5, 40);
            const angle = Math.atan2(btnRelY - relCursorY, btnRelX - relCursorX);
            nx = (btnRect.left - cardRect.left) + Math.cos(angle) * dist;
            ny = (btnRect.top - cardRect.top) + Math.sin(angle) * dist;

            // Jika mentok tembok card, maka muncul di posisi acak di dalam batas card
            if (nx < minX || nx > maxX || ny < minY || ny > maxY) {
                nx = minX + Math.random() * (maxX - minX);
                ny = minY + Math.random() * (maxY - minY);
            }
        } else {
            // Mobile (tanpa posisi kursor detail): Acak murni di dalam area card
            nx = minX + Math.random() * (maxX - minX);
            ny = minY + Math.random() * (maxY - minY);
        }

        // Pastikan koordinat final tetap terkurung kuat di dalam card (Clamp)
        nx = Math.max(minX, Math.min(nx, maxX));
        ny = Math.max(minY, Math.min(ny, maxY));

        setNoBtnPos({ left: nx, top: ny });
    };

    const handleNoClick = (e: React.MouseEvent) => {
        triggerShake();
        setNoCount(prev => prev + 1);
        if (noCount >= RUN_AFTER - 1) runAway(e.clientX, e.clientY);
    };

    // Desktop: proximity detection — button escapes when cursor approaches
    useEffect(() => {
        if (isMobile || noCount < RUN_AFTER) return;
        const PROXIMITY = 80;
        const onMouseMove = (e: MouseEvent) => {
            if (!noBtnRef.current) return;
            const rect = noBtnRef.current.getBoundingClientRect();
            const bx = rect.left + rect.width / 2;
            const by = rect.top + rect.height / 2;
            const dist = Math.hypot(e.clientX - bx, e.clientY - by);
            if (dist < PROXIMITY) runAway(e.clientX, e.clientY);
        };
        document.addEventListener('mousemove', onMouseMove);
        return () => document.removeEventListener('mousemove', onMouseMove);
    });

    // Mobile: move on tap
    useEffect(() => {
        const btn = noBtnRef.current;
        if (!btn || noCount < RUN_AFTER) return;
        const onTouch = (e: TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();
            triggerShake();
            setNoCount(prev => prev + 1);
            runAway();
        };
        btn.addEventListener('touchstart', onTouch, { passive: false });
        return () => btn.removeEventListener('touchstart', onTouch);
    });

    // Entrance animation — staggered professional reveal
    useEffect(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        // 1. Card slides up + fades in
        tl.fromTo(containerRef.current,
            { y: 60, opacity: 0, scale: 0.94, rotationX: 6 },
            { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 0.85, clearProps: 'rotationX,scale' }
        )
        // 2. Title drops in from above
        .fromTo(titleRef.current,
            { y: -22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.8)' },
        '-=0.45')
        // 3. Image pops
        .fromTo(imageRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' },
        '-=0.3')
        // 4. Buttons slide up
        .fromTo(buttonsRef.current,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.5)' },
        '-=0.25');
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
                    <div style={{ fontSize: '3rem', marginBottom: '10px', animation: 'heartbeat 1.4s infinite' }}>- - -</div>
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
                    <div style={{ fontSize: '2.8rem', marginBottom: '10px', animation: 'heartbeat 1.2s infinite' }}>--</div>
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

                    {noCount >= 2 && !isAccepted && (
                        <p style={{ color: '#ffb3c6', fontSize: '0.78rem', margin: '0 0 10px', animation: 'wiggle 1.5s ease-in-out infinite' }}>
                            tombol YES makin gede tiap kamu pilih no loh
                        </p>
                    )}

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
                                IYA!
                            </button>

                            <button
                                ref={noBtnRef}
                                className={`btn no-btn${noCount >= RUN_AFTER ? ' running' : ''}`}
                                onClick={handleNoClick}
                                style={{
                                    padding: '10px 22px',
                                    fontSize: noFontSize,
                                    backgroundColor: '#f5f5f5',
                                    color: '#aaa',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    ...(noBtnPos ? {
                                        position: 'absolute' as const, /* Diganti jadi absolute agar tidak kabur dari div parent */
                                        left: `${noBtnPos.left}px`,
                                        top: `${noBtnPos.top}px`,
                                        zIndex: 9999,
                                        margin: 0,
                                        transition: 'left 0.3s cubic-bezier(0.34,1.56,0.64,1), top 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                                    } : {}),
                                }}
                            >
                                {getNoLabel()}
                            </button>
                        </div>
                    )}

                    {noCount > 0 && !isAccepted && (
                        <p style={{ color: '#ffccd5', fontSize: '0.75rem', marginTop: '10px', marginBottom: 0 }}>
                            udah nyoba no sebanyak {noCount}x
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default Gombalan;