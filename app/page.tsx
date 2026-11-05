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

              {/* 🪔 EXACT RESPONSIVE COORD MATCH FOR STATIC SMOKE ANIMATION */}
              <div className="absolute bottom-[33%] right-[13.5%] md:right-[14%] w-[25cqw] h-[35cqw] max-w-[320px] max-h-[420px] pointer-events-none mix-blend-screen z-20 overflow-visible">
                
                {/* Micro-glow directly at the nozzle tip */}
                <div className="absolute bottom-2 right-[42%] w-8 h-8 bg-purple-500/60 blur-md rounded-full animate-pulse" />
                <div className="absolute bottom-3 right-[44%] w-4 h-4 bg-amber-300/50 blur-sm rounded-full animate-ping [animation-duration:1s]" />

                {/* Overlapping Shimmering Smoke Strings that mask the static JPEG smoke */}
                <div 
                  className="absolute bottom-6 left-0 w-full h-[85%] bg-gradient-to-t from-purple-600/30 via-pink-500/10 to-transparent blur-xl rounded-full opacity-0"
                  style={{ animation: 'cinematicSmoke1 7s infinite ease-in-out' }}
                />
                
                <div 
                  className="absolute bottom-8 left-[10%] w-[90%] h-[90%] bg-gradient-to-tr from-indigo-500/25 via-purple-500/5 to-transparent blur-2xl rounded-full opacity-0"
                  style={{ animation: 'cinematicSmoke2 10s infinite ease-in-out 1.5s' }}
                />

                {/* Rising Magical Sparks */}
                <div className="absolute bottom-10 left-[45%] w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0" style={{ animation: 'luxurySparkle 4s infinite linear' }} />
                <div className="absolute bottom-20 left-[35%] w-2 h-2 bg-purple-300 rounded-full opacity-0" style={{ animation: 'luxurySparkle 5s infinite linear 0.8s' }} />
                <div className="absolute bottom-16 left-[55%] w-1 h-1 bg-white rounded-full opacity-0" style={{ animation: 'luxurySparkle 4.5s infinite linear 1.8s' }} />
              </div>

            </div>
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-night/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
          </div>
        </section>

        {/* CSS Engine safely embedded for production deployment */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes cinematicSmoke1 {
            0% { transform: translateY(30px) scale(0.8) rotate(0deg); opacity: 0; filter: blur(6px); }
            15% { opacity: 0.7; }
            50% { transform: translateY(-90px) scale(1.3) translateX(-35px) rotate(-15deg); opacity: 0.4; filter: blur(12px); }
            100% { transform: translateY(-220px) scale(1.9) translateX(-70px) rotate(-35deg); opacity: 0; filter: blur(20px); }
          }
          @keyframes cinematicSmoke2 {
            0% { transform: translateY(40px) scale(0.6) rotate(0deg); opacity: 0; filter: blur(10px); }
            20% { opacity: 0.6; }
            65% { transform: translateY(-120px) scale(1.5) translateX(25px) rotate(20deg); opacity: 0.3; filter: blur(16px); }
            100% { transform: translateY(-270px) scale(2.1) translateX(55px) rotate(45deg); opacity: 0; filter: blur(26px); }
          }
          @keyframes luxurySparkle {
            0% { transform: translateY(10px) translateX(0) scale(0.4); opacity: 0; }
            40% { opacity: 1; transform: translateY(-70px) translateX(-15px) scale(1.2); }
            100% { transform: translateY(-180px) translateX(-35px) scale(0); opacity: 0; }
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
