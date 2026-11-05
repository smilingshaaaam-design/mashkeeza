"use client";

import React, { useEffect, useRef } from 'react';

export function PaintedSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: PremiumCinematicParticle[] = [];

    // 1. MUKAMMAL 99 ASMA-E-ALLAH ARRAY
    const ASMA_E_HUSNA = [
      'الله', 'الرَّحْمٰن', 'الرَّحِیم', 'الْمَلِک', 'الْقُدُّوس', 'السَّلَام', 'الْمُؤْمِن', 'الْمُهَیْمِن', 'الْعَزِیز', 'الْجَبَّار', 'الْمُتَکَبِّر',
      'الْخَالِق', 'الْبَارِئ', 'الْمُصَوِّر', 'الْغَفَّار', 'الْقَهَّار', 'الْوَهَّاب', 'الرَّزَّاق', 'الْفَتَّاح', 'الْعَلِیم', 'الْقَابِض', 'الْبَاسِط',
      'الْخَافِض', 'الرَّافِع', 'الْمُعِزّ', 'الْمُذِلّ', 'السَّمِیع', 'الْبَصِیر', 'الْحَکَم', 'الْعَدْل', 'اللَّطِیف', 'الْخَبِیر', 'الْحَلِیم',
      'الْعَظِیم', 'الْغَفُور', 'الشَّکُور', 'الْعَلِیّ', 'الْکَبِیر', 'الْحَفِیظ', 'الْمُقِیت', 'الْحَسِیب', 'الْجَلِیل', 'الْکَرِیم', 'الرَّقِیب',
      'الْمُجِیب', 'الْوَاسِع', 'الْحَکِیم', 'الْوَدُود', 'الْمَجِید', 'الْبَاعِث', 'الشَّهِید', 'الْحَقّ', 'الْوَکِیل', 'الْقَوِیّ', 'الْمَتِین',
      'الْوَلِیّ', 'الْحَمِید', 'الْمُحْصِی', 'الْمُبْدِئ', 'الْمُعِید', 'الْمُحْیی', 'الْمُمِیت', 'الْحَیّ', 'الْقَیُّوم', 'الْوَاجِد', 'الْمَاجِد',
      'الْوَاحِد', 'الْأَحَد', 'الصَّمَد', 'الْقَادِر', 'الْمُقْتَدِر', 'الْمُقَدِّم', 'الْمُؤَخِّر', 'الْأَوَّل', 'الْآخِر', 'الظَّاهِر', 'الْبَاطِن',
      'الْوَالی', 'الْمُتَعَالِی', 'الْبَرّ', 'التَّوَّاب', 'الْمُنْتَقِم', 'العَفُوّ', 'الرَّؤُوف', 'مَالِکُ الْمُلْک', 'ذُو الْجَلَالِ وَالْإِکْرَام', 'الْمُقْسِط',
      'الْجَامِع', 'الْغَنِیّ', 'الْمُغْنِی', 'الْمَانِع', 'الضَّارّ', 'النَّافِع', 'النُّور', 'الْهَادِی', 'الْبَدِیع', 'الْبَاقِی', 'الْوَارِث', 'الرَّشِید', 'الصَّبُور'
    ];

    // 2. MUKAMMAL 12 HUROOF-E-MUQATTA'AT ARRAY
    const MUQATTAAT = ['الم', 'المر', 'الر', 'طسم', 'طہ', 'یس', 'ص', 'حم', 'عسق', 'کہیعص', 'ق', 'ن'];

    // 3. MUKAMMAL 28 MOWAKKEEN NAMES ARRAY
    const MOWAKKEEN_28 = [
      'اسرافیل', 'جبرائیل', 'میکائیل', 'عزرائیل', 'ملوائیل', 'شمخائیل', 'صرفیائیل', 'تنکفیل', 'جیائیل', 'حزقیائیل', 'دردائیل', 
      'رفمائیل', 'طاطائیل', 'لوخائیل', 'ہمواکیل', 'سرھمواکیل', 'عینائیل', 'کفیائیل', 'لوائیل', 'عطائیل', 'نوخائیل', 'روحائیل',
      'لوطائیل', 'صباغائیل', 'عطوفائیل', 'ھمروائیل', 'عزرائیل', 'غلغائیل'
    ];

    // 4. MUKAMMAL 28 HUROOF-E-ABJAD ARRAY
    const ABJAD_28 = ['ا', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ی', 'ک', 'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ'];

    const resizeCanvas = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight || 450;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 🪐 5. VECTOR GENERATOR FOR 7 PLANETS TALISMATIC SEALS
    const drawPlanetTalisman = (context: CanvasRenderingContext2D, planetId: number, size: number) => {
      context.beginPath();
      context.lineWidth = 1.3;
      if (planetId === 0) { // Shams (Sun)
        context.arc(0, 0, size * 0.6, 0, Math.PI * 2);
        context.moveTo(-size * 0.6, 0); context.lineTo(size * 0.6, 0);
        context.moveTo(0, -size * 0.6); context.lineTo(0, size * 0.6);
        context.stroke();
        context.beginPath(); context.arc(0, 0, size * 0.15, 0, Math.PI * 2); context.fill();
      } else if (planetId === 1) { // Qamar (Moon)
        context.arc(0, 0, size * 0.55, 0.5, Math.PI * 1.5);
        context.stroke();
        context.beginPath(); context.arc(size * 0.2, 0, size * 0.45, 0, Math.PI * 2);
      } else if (planetId === 2) { // Merrikh (Mars)
        context.moveTo(0, -size * 0.7); context.lineTo(size * 0.6, size * 0.4); context.lineTo(-size * 0.6, size * 0.4); context.closePath();
        context.stroke();
        context.beginPath(); context.arc(0, -size * 0.7, 3, 0, Math.PI * 2); context.fill();
      } else if (planetId === 3) { // Utarid (Mercury)
        context.arc(0, 0, size * 0.6, 0, Math.PI * 2); context.stroke();
        context.beginPath(); context.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        context.moveTo(-size * 0.3, -size * 0.3); context.lineTo(size * 0.3, size * 0.3);
      } else if (planetId === 4) { // Mushtari (Jupiter)
        context.rect(-size * 0.5, -size * 0.5, size, size);
        context.moveTo(-size * 0.5, 0); context.lineTo(size * 0.5, 0);
        context.moveTo(0, -size * 0.5); context.lineTo(0, size * 0.5);
      } else if (planetId === 5) { // Zuhra (Venus)
        for (let i = 0; i < 2; i++) {
          context.moveTo(0, -size * 0.65); context.lineTo(size * 0.55, size * 0.35); context.lineTo(-size * 0.55, size * 0.35); context.closePath();
          context.rotate(Math.PI);
        }
      } else { // Zuhal (Saturn)
        context.arc(0, 0, size * 0.6, 0, Math.PI * 2);
        context.moveTo(-size * 0.7, -size * 0.2); context.lineTo(size * 0.7, -size * 0.2);
        context.moveTo(0, -size * 0.6); context.lineTo(0, size * 0.6);
      }
      context.stroke();
    };

    class PremiumCinematicParticle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      maxLife: number;
      life: number;
      hue: number;
      renderType: 'smoke' | 'asma' | 'muqattaat' | 'abjad' | 'mowakkal' | 'talisman';
      textStr: string;
      planetId: number;
      waveOffset: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = canvasWidth * 0.76;
        this.y = canvasHeight * 0.64;
        this.textStr = '';
        this.planetId = 0;
        this.waveOffset = Math.random() * Math.PI * 2;

        const rand = Math.random();
        if (rand < 0.10) {
          this.renderType = 'asma';
          this.textStr = ASMA_E_HUSNA[Math.floor(Math.random() * ASMA_E_HUSNA.length)];
          this.size = Math.random() * 3 + 14;
        } else if (rand < 0.18) {
          this.renderType = 'muqattaat';
          this.textStr = MUQATTAAT[Math.floor(Math.random() * MUQATTAAT.length)];
          this.size = Math.random() * 4 + 15;
        } else if (rand < 0.28) {
          this.renderType = 'abjad';
          this.textStr = ABJAD_28[Math.floor(Math.random() * ABJAD_28.length)];
          this.size = Math.random() * 3 + 13;
        } else if (rand < 0.38) {
          this.renderType = 'mowakkal';
          this.textStr = MOWAKKEEN_28[Math.floor(Math.random() * MOWAKKEEN_28.length)];
          this.size = Math.random() * 3 + 12;
        } else if (rand < 0.48) {
          this.renderType = 'talisman';
          this.planetId = Math.floor(Math.random() * 7);
          this.size = Math.random() * 4 + 11;
        } else {
          this.renderType = 'smoke';
          this.size = Math.random() * 15 + 10;
        }

        this.vx = -(Math.random() * 2.3 + 1.7);
        this.vy = -(Math.random() * 0.18 + 0.04);
        this.alpha = Math.random() * 0.65 + 0.45;
        this.maxLife = Math.random() * 260 + 200;
        this.life = 0;
        
        const colorRand = Math.random();
        if (colorRand < 0.50) {
          this.hue = 275;
        } else if (colorRand < 0.85) {
          this.hue = 188;
        } else {
          this.hue = 44;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        this.vy += Math.sin(this.life * 0.042 + this.waveOffset) * 0.038;
        const progress = this.life / this.maxLife;

        if (this.renderType !== 'smoke' && progress > 0.45) {
          this.renderType = 'smoke';
          this.size = Math.random() * 1.5 + 1.1;
          this.vx *= 0.94;
        } else if (this.renderType === 'smoke' && this.size >= 4) {
          if (progress <= 0.6) this.size += 0.14;
        }

        if (progress > 0.75) {
          this.alpha -= 0.007;
        }
      }

      draw(renderCtx: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        renderCtx.save();
        renderCtx.globalCompositeOperation = 'lighter';

        if (this.renderType === 'asma' || this.renderType === 'muqattaat' || this.renderType === 'abjad' || this.renderType === 'mowakkal') {
          renderCtx.translate(this.x, this.y);
          const isAsma = this.renderType === 'asma';
          renderCtx.font = `bold ${this.size}px "Times New Roman", Amiri, serif`;
          renderCtx.fillStyle = isAsma ? `hsla(44, 100%, 82%, ${this.alpha})` : `hsla(${this.hue}, 100%, 82%, ${this.alpha})`;
          renderCtx.shadowColor = `hsla(${this.hue}, 100%, 65%, 0.85)`;
          renderCtx.shadowBlur = isAsma ? 16 : 12;
          renderCtx.textAlign = 'center';
          renderCtx.textBaseline = 'middle';
          renderCtx.fillText(this.textStr, 0, 0);
        } else if (this.renderType === 'talisman') {
          renderCtx.translate(this.x, this.y);
          renderCtx.strokeStyle = `hsla(${this.hue}, 100%, 75%, ${this.alpha})`;
          renderCtx.fillStyle = `hsla(${this.hue}, 100%, 75%, ${this.alpha * 0.22})`;
          renderCtx.shadowColor = `hsla(${this.hue}, 100%, 65%, 0.85)`;
          renderCtx.shadowBlur = 15;
          drawPlanetTalisman(renderCtx, this.planetId, this.size);
        } else {
          const isStarDot = this.size < 4;
          const radius = isStarDot ? this.size * 1.4 : this.size;
          const gradient = renderCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
          if (isStarDot) {
            const starBrightness = 80 + Math.sin(this.life * 0.5) * 20;
            renderCtx.shadowBlur = 8;
            renderCtx.shadowColor = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
            gradient.addColorStop(0, `hsla(${this.hue}, 100%, ${starBrightness}%, ${this.alpha})`);
            gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0export)`);
          } else {
