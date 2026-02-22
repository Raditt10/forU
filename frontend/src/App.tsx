import { useState, useEffect, useRef } from 'react';
import Gombalan from './components/Gombalan';
import HeartEffect from './components/HeartEffect';
import gsap from 'gsap';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [targetName, setTargetName] = useState<string | null>(null);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);

  const flapRef = useRef<SVGPathElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<any>(null); // gunakan 'any' atau union type untuk menangani SVG/DIV sekaligus
  const contentRef = useRef<HTMLDivElement>(null);
  const textHintRef = useRef<HTMLDivElement>(null);
  const envelopeFrontRef = useRef<HTMLDivElement>(null);
  const envelopeBackRef = useRef<HTMLDivElement>(null);
  const heartIconRef = useRef<HTMLDivElement>(null); // Dipindah ke atas biar aman dipanggil

  useEffect(() => {
    // Ambil parameter dari URL saat pertama kali dimuat
    const searchParams = new URLSearchParams(window.location.search);
    const target = searchParams.get('target');
    if (target) {
      setTargetName(target);
      document.title = `SURAT TERBUKA UNTUK ${target.toUpperCase()} 💌`;
    } else {
      document.title = 'FOR U 💌';
    }
  }, []);

  useEffect(() => {
    if (isEnvelopeOpened && letterRef.current) {
        gsap.fromTo(letterRef.current, 
            { y: 50, opacity: 0, scale: 0.8 },
            { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" }
        );
    }
  }, [isEnvelopeOpened]);

  const handleStart = () => {
    // Play music now that user has interacted
    const audio = document.getElementById('bgMusic') as HTMLAudioElement;
    if (audio) {
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Audio autoplay prevented:', e));
    }

    // Start 3-2-1 countdown
    setCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        setHasStarted(true);
      }
    }, 1000);
  };

  const handleSuccess = async (noCount: number) => {
    try {
      await fetch('http://localhost:5000/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetName: targetName || 'Unknown',
          noClicks: noCount,
          success: true
        })
      });
      console.log('Successfully tracked interaction!');
    } catch (err) {
      console.error('Failed to notify backend:', err);
    }
  };

  const handleOpenEnvelope = () => {
    if (!flapRef.current || !wrapperRef.current || !letterRef.current) return;
    
    // Disable clicking
    wrapperRef.current.style.pointerEvents = 'none';

    const tl = gsap.timeline({
      onComplete: () => {
        setIsEnvelopeOpened(true);
        if (wrapperRef.current) wrapperRef.current.style.pointerEvents = 'auto';
      }
    });

    // 1. Sembunyikan teks hint
    tl.to(textHintRef.current, { opacity: 0, duration: 0.3 })
    
    // 2. Buka penutup amplop (flap)
    .to(flapRef.current, {
      rotateX: 180,
      transformOrigin: "top",
      duration: 0.5,
      ease: "power2.inOut"
    }, "-=0.3")

    // 3. Kertas surat sliding naik keluar amplop
    .to(letterRef.current, {
      y: -120, // bergerak naik cukup tinggi
      duration: 0.6,
      ease: "power2.out"
    })

    // 4. Amplop (depan & belakang) drop ke bawah dan fade out
    .to([envelopeFrontRef.current, envelopeBackRef.current], {
      y: 150,
      opacity: 0,
      duration: 0.6,
      ease: "power2.in"
    }, "-=0.4")

    // 5. Kertas melebar jadi modal horizontal (width membesar, dan ganti style)
    .to(letterRef.current, {
      width: window.innerWidth > 600 ? "450px" : "90vw",
      height: "auto",
      minHeight: "250px",
      padding: "3rem",
      y: 0, // turun ke tengah
      borderRadius: "25px",
      border: "4px dashed #ff4d79",
      boxShadow: "0 10px 30px rgba(255, 77, 121, 0.3)",
      duration: 0.8,
      ease: "back.out(1.2)"
    })

    // 5.1 Hilangkan love heart yang melayang di tengah
    .to(heartIconRef.current, {
      opacity: 0,
      scale: 0,
      duration: 0.3,
      ease: "power2.in",
      display: "none"
    }, "-=0.6")

    // 6. Tampilkan teks di dalam kertas secara crossfade
    .to(contentRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.3");
  };

  if (!hasStarted) {
    return (
      <div className="start-screen">
        <HeartEffect />
        
        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="countdown-overlay">
            <h1 className="countdown-number" key={countdown}>{countdown}</h1>
          </div>
        )}

        <div className="envelope-scene" style={{ opacity: countdown !== null ? 0 : 1, transition: 'opacity 0.3s ease', pointerEvents: countdown !== null ? 'none' : 'auto' }}>
          <div className="envelope-container" ref={wrapperRef} onClick={!isEnvelopeOpened && countdown === null ? handleOpenEnvelope : undefined}>
            
            <div className="envelope-back" ref={envelopeBackRef}>
              <svg viewBox="0 0 100 80" width="100%" height="100%" preserveAspectRatio="none">
                <path d="M0,0 L100,0 L100,80 L0,80 Z" fill="#ffb3c6" />
                <path ref={flapRef} d="M0,0 L50,45 L100,0 Z" fill="#ff4d79" />
              </svg>
            </div>

            <div className="envelope-paper" ref={letterRef}>
              <div className="paper-content" ref={contentRef} style={{ opacity: 0 }}>
                <h2>Haii {targetName ? targetName : 'Manis'}! ✨</h2>
                <p className="modal-desc">Aku punya sesuatu yang mau disampein nih..</p>
                <button className="btn start-btn" onClick={handleStart}>
                  Coba Liat Dong 🥺
                </button>
              </div>
              {!isEnvelopeOpened && (
                 <div className="paper-heart" ref={heartIconRef}>💖</div>
              )}
            </div>

            <div className="envelope-front" ref={envelopeFrontRef}>
               <svg viewBox="0 0 100 80" width="100%" height="100%" preserveAspectRatio="none">
                 <path d="M0,80 L50,40 L100,80 Z" fill="#ff758c" />
                 <path d="M0,0 L50,40 L0,80 Z" fill="#ff9eb5" />
                 <path d="M100,0 L50,40 L100,80 Z" fill="#ff9eb5" />
                 <circle cx="50" cy="40" r="8" fill="#ff0040" />
               </svg>
            </div>
          </div>

          {/* BAGIAN TEKS YANG DIBIKIN MAKIN GEMOY */}
          <div className="text-hint" ref={textHintRef} style={{ textAlign: 'center', marginTop: '25px' }}>
            <p className="envelope-text" style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ff4d79' }}>
              Ada surat spesial nih buat {targetName ? targetName : 'kamu'}! 💌✨
            </p>
            <p className="click-hint bounce-text" style={{ fontSize: '0.9rem', color: '#ff758c', cursor: 'pointer', margin: 0 }}>
              (Pencet amplopnya yaa, ada deg-degan yang mau tumpah 🥺👉👈)
            </p>
          </div>
        </div>

      </div>
    );
  }

  return (
    <>
      <audio id="bgMusic" loop>
          <source src="https://media-hosting.imagekit.io//57d9b82542f24b31/wannabeyours.mp4?Expires=1834834240&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=fLWj0s-DFN0BYhACzcL2Vt6ns3P8OmnzOirGVSK1ntGY0QYL0c7qPjnfzsffd9Fz9SIj71ykx1RLCoDfTwvwTMBGnRQmkpfuTMp5ooR3SNK3Ql-9KF254A2SyHAzKUGdd~v7NsMUpUILrykwbM-B-hU0C31HZrhgvLd4-4~wk7xdS-TZ~pgfHGWuwqZR3-ya1adDQQ6hLAcAiRPQsy2H~4b4lbhdbXSnCdWjCuxb7zMHdIwEqJk3vwvyqHhoY4-HNtlTJXoCj54FPpqSaLBrcCkNsz-d3oUxUztdeYggJVROeUvEiaf1nZ5IlQdm0vrJzbtE93zAZnXHfEE26VZlzg__" type="video/mp4" />
      </audio>
      <HeartEffect />
      <Gombalan targetName={targetName} onSuccess={handleSuccess} />
    </>
  );
}

export default App;