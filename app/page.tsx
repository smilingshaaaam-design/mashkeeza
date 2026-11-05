import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { FeatureCard, type Feature } from '@/components/feature-card'
import { SiteFooter } from '@/components/site-footer'
import { Starfield } from '@/components/magic/starfield'
import { Mashk } from '@/components/magic/mashk'

const primaryFeatures: Feature[] = [
  {
    id: 'ism-azam',
    title: 'اسم اعظم',
    description: 'اللہ کے اسم اعظم سے روحانی فائدہ حاصل کریں',
    image: '/images/icon-ism-azam.png',
  },
  {
    id: 'jafar',
    title: 'علم جفر',
    description: 'حروف و اعداد کے اسرار کا علم حاصل کریں',
    image: '/images/icon-jafar.png',
  },
  {
    id: 'adad',
    title: 'علم الاعداد',
    description: 'اعداد کے ذریعے مستقبل کی جھلک',
    image: '/images/icon-adad.png',
  },
  {
    id: 'taweez',
    title: 'تعویذات',
    description: 'روحانی تعویذات اور مستند عملیات',
    image: '/images/icon-taweez.png',
  },
  {
    id: 'talismat',
    title: 'طلسمات',
    description: 'قرآنی طلسمات سے مشکلات کا حل',
    image: '/images/icon-talisman.png',
  },
  {
    id: 'wazaif',
    title: 'ورد و وظائف',
    description: 'روحانی سکون اور اللہ کی قربت',
    image: '/images/icon-wazaif.png',
  },
]

const secondaryFeatures: Feature[] = [
  {
    id: 'nawaz',
    title: 'روحانی نواز',
    description: 'آسان روحانی علاج اور روزمرہ زندگی کے لیے',
    image: '/images/icon-nawaz.png',
  },
  {
    id: 'peshgoiyan',
    title: 'تاریخی حسابات و پیش گوئیاں',
    description: 'ماضی اور مستقبل کے راز جانیں',
    image: '/images/icon-moon.png',
  },
  {
    id: 'jafri-hisabat',
    title: 'پرانے جفری حسابات',
    description: 'قدیم جفری حسابات سے مستفید ہوں',
    image: '/images/icon-scroll.png',
  },
  {
    id: 'contact',
    title: 'رابطہ کریں',
    description: 'اپنے سوالات اور رہنمائی کے لیے ہم سے رابطہ کریں',
    image: '/images/icon-quill.png',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-night text-white">
      <SiteHeader />

      <main>
        <section aria-label="روحانی منظر" className="relative -mt-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[16/8]">
            <div className="absolute inset-y-0 left-1/2 aspect-[1584/672] h-full -translate-x-1/2 [container-type:inline-size] w-full max-w-[1584px]">
              <Image
                src="/images/desert-scene.png"
                alt="صحرا میں روشن قدیم کتابیں، جادوئی چراغ اور سنہری روشنی کا دریا"
                fill
                sizes="(min-width: 768px) 118vw, 148vw"
                className="object-cover"
                priority
              />
              <Starfield count={90} seed={11} className="inset-x-0 top-0 h-[38%]" />
              <Mashk />

              {/* 🪔 SAME-TO-SAME FLUID VIDEO ANIMATION WRAPPER */}
              <div className="absolute bottom-[30%] right-[11%] w-[30cqw] h-[45cqw] max-w-[400px] max-h-[550px] pointer-events-none mix-blend-screen z-20 overflow-visible">
                
                {/* Core Magic Volumetric Smoke Strings */}
                <div 
                  className="absolute bottom-[10%] right-[30%] w-[120px] h-[300px] bg-gradient-to-t from-purple-600/40 via-pink-500/20 to-transparent blur-xl rounded-full opacity-0 origin-bottom"
                  style={{ animation: 'fluidSmokeVideo1 6s infinite ease-in-out' }}
                />
                
                <div 
                  className="absolute bottom-[12%] right-[25%] w-[150px] h-[350px] bg-gradient-to-tr from-indigo-500/30 via-purple-500/10 to-transparent blur-2xl rounded-full opacity-0 origin-bottom"
                  style={{ animation: 'fluidSmokeVideo2 8s infinite ease-in-out 1s' }}
                />

                <div 
                  className="absolute bottom-[8%] right-[35%] w-[90px] h-[260px] bg-gradient-to-tl from-fuchsia-500/35 via-cyan-500/15 to-transparent blur-xl rounded-full opacity-0 origin-bottom"
                  style={{ animation: 'fluidSmokeVideo3 5s infinite ease-in-out 2s' }}
                />

                {/* Ambient Nozzle Emitter Sparks */}
                <div className="absolute bottom-[8%] right-[45%] w-2 h-2 bg-yellow-300 rounded-full opacity-0" style={{ animation: 'videoSparkle 3.5s infinite linear' }} />
                <div className="absolute bottom-[12%] right-[40%] w-1.5 h-1.5 bg-white rounded-full opacity-0" style={{ animation: 'videoSparkle 4.5s infinite linear 0.7s' }} />
                <div className="absolute bottom-[15%] right-[50%] w-2 h-2 bg-purple-300 rounded-full opacity-0" style={{ animation: 'videoSparkle 4s infinite linear 1.5s' }} />
              </div>

            </div>
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-night/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
          </div>
        </section>

        {/* Cinematic Video Fluid Animation Engine */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fluidSmokeVideo1 {
            0% { transform: translateY(50px) scale(0.5) rotate(0deg); opacity: 0; filter: blur(6px); }
            15% { opacity: 0.8; }
            45% { transform: translateY(-120px) scale(1.4) translateX(-45px) rotate(-20deg); opacity: 0.5; filter: blur(14px); }
            100% { transform: translateY(-280px) scale(2.2) translateX(-110px) rotate(-45deg); opacity: 0; filter: blur(28px); }
          }
          @keyframes fluidSmokeVideo2 {
            0% { transform: translateY(60px) scale(0.4) rotate(0deg); opacity: 0; filter: blur(10px); }
            20% { opacity: 0.7; }
            55% { transform: translateY(-160px) scale(1.6) translateX(-20px) rotate(15deg); opacity: 0.4; filter: blur(20px); }
            100% { transform: translateY(-360px) scale(2.5) translateX(-50px) rotate(35deg); opacity: 0; filter: blur(35px); }
          }
          @keyframes fluidSmokeVideo3 {
            0% { transform: translateY(40px) scale(0.6) rotate(0deg); opacity: 0; filter: blur(8px); }
            10% { opacity: 0.75; }
            50% { transform: translateY(-100px) scale(1.3) translateX(-60px) rotate(-10deg); opacity: 0.45; filter: blur(12px); }
            100% { transform: translateY(-240px) scale(2.0) translateX(-140px) rotate(-25deg); opacity: 0; filter: blur(22px); }
          }
          @keyframes videoSparkle {
            0% { transform: translateY(20px) translateX(0) scale(0.3); opacity: 0; }
            30% { opacity: 1; }
            100% { transform: translateY(-220px) translateX(-80px) scale(0); opacity: 0; }
          }
        `}} />

        <section
          aria-labelledby="services-heading"
          className="relative mx-auto -mt-16 max-w-7xl px-4 pb-12 md:-mt-28"
        >
          <h2 id="services-heading" className="sr-only">
            ہماری روحانی خدمات
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {primaryFeatures.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {secondaryFeatures.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} wide />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
