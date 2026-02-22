import React, { useEffect } from 'react';

const HeartEffect: React.FC = () => {
    useEffect(() => {
        // Palet warna elegan dan romantis (pink pastel, rose, crimson)
        const colors = ['#ff4d79', '#ff758c', '#ffb3c6', '#ff9eb5', '#ff1a53'];

        // SVG Hati kustom yang profesional (lengkungan presisi)
        const heartSVG = `
            <svg viewBox="0 0 32 29.6" style="width: 100%; height: 100%; filter: drop-shadow(0px 2px 4px rgba(255, 77, 121, 0.4));">
                <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z" fill="currentColor"/>
            </svg>
        `;

        const createHeart = () => {
            const heart = document.createElement('div');
            
            // Masukkan SVG ke dalam div
            heart.innerHTML = heartSVG;
            
            // Randomisasi ukuran dan warna
            const size = Math.random() * 20 + 12; // Ukuran bervariasi antara 12px - 32px
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Styling murni lewat JS agar tidak perlu file CSS tambahan
            heart.style.position = 'fixed';
            heart.style.bottom = '-50px'; // Mulai dari bawah layar agar rapi
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heart.style.color = color; // Mewarnai SVG lewat currentColor
            heart.style.opacity = (Math.random() * 0.5 + 0.3).toString(); // Transparansi acak (0.3 - 0.8) biar nge-blend
            heart.style.zIndex = '1'; // Diatur di background
            heart.style.pointerEvents = 'none'; // Penting: biar nggak menghalangi klik tombol
            
            // Pengaturan animasi transisi
            const duration = Math.random() * 5 + 5; // 5s - 10s (Gerak lambat = lebih romantis)
            heart.style.transition = `transform ${duration}s linear, opacity ${duration}s ease-in`;
            
            document.body.appendChild(heart);

            // Beri jeda sedikit sebelum animasi dimulai agar transisi CSS terbaca
            requestAnimationFrame(() => {
                setTimeout(() => {
                    // Hati akan terbang ke atas melewati layar dan berputar sedikit
                    heart.style.transform = `translateY(-120vh) rotate(${Math.random() * 180 - 90}deg)`;
                    heart.style.opacity = '0'; // Memudar saat sampai atas
                }, 50);
            });

            // Cleanup: Hapus elemen dari DOM setelah selesai terbang biar web nggak lemot
            setTimeout(() => {
                if (document.body.contains(heart)) {
                    heart.remove();
                }
            }, duration * 1000);
        };

        // Buat hati baru setiap 400ms (pas, tidak terlalu sepi, tidak terlalu ramai)
        const intervalId = setInterval(createHeart, 400);

        return () => clearInterval(intervalId); // Cleanup saat pindah halaman/unmount
    }, []);

    return null;
};

export default HeartEffect;