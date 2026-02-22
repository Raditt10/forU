import { useState, useEffect } from 'react';
import Gombalan from './components/Gombalan';
import HeartEffect from './components/HeartEffect';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [targetName, setTargetName] = useState<string | null>(null);

  useEffect(() => {
    // Ambil parameter dari URL saat pertama kali dimuat
    const searchParams = new URLSearchParams(window.location.search);
    const target = searchParams.get('target');
    if (target) setTargetName(target);
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    // Play music now that user has interacted
    const audio = document.getElementById('bgMusic') as HTMLAudioElement;
    if (audio) {
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Audio autoplay prevented:', e));
    }
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

  if (!hasStarted) {
    return (
      <div className="start-screen">
        <HeartEffect />
        <div className="start-modal">
          <h2>Ada pesan nih buat kamu {targetName ? targetName : 'kamu'}!</h2>
          <button className="btn start-btn" onClick={handleStart}>
            Klik untuk Buka
          </button>
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
