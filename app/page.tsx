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
            <div className="absolute inset-y-0 left-1/2 aspect-[1584/672] h-full -translate-x-1/2 [container-type:inline-size]">
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

              {/* 🪔 FIXED PREMIUM CINEMATIC SMOKE & SPARKS (No Style-JSX / Pure Tailwind Layout) */}
              <div className="absolute bottom-[28%] right-[11%] w-44 h-80 pointer-events-none mix-blend-screen z-20">
                {/* Core Ambient Light on Lamp Mouth */}
                <div className="absolute bottom-0 right-10 w-14 h-14 bg-purple-500/40 blur-xl rounded-full animate-pulse" />
                <div className="absolute bottom-1 right-12 w-6 h-6 bg-amber-400/50 blur-md rounded-full animate-ping [animation-duration:1400ms]" />

                {/* Volumetric Smoke Trail 1 (Tailwind Inline Animation classes) */}
                <div 
                  className="absolute bottom-4 right-8 w-28 h-56 bg-gradient-to-t from-purple-600/25 via-pink-500/10 to-transparent blur-2xl rounded-full opacity-0"
                  style={{
                    animation: 'cinematicSmoke1 8s infinite ease-in-out'
                  }}
                />
                
                {/* Volumetric Smoke Trail 2 */}
                <div 
                  className="absolute bottom-8 right-4 w-24 h-64 bg-gradient-to-tr from-indigo-500/20 via-purple-600/5 to-transparent blur-3xl rounded-full opacity-0"
                  style={{
                    animation: 'cinematicSmoke2 11s infinite ease-in-out 1.8s'
                  }}
                />

                {/* Magic Sparkle 1 */}
                <div 
                  className="absolute bottom-6 right-12 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0"
                  style={{ animation: 'luxurySparkle 5s infinite linear' }}
                />
                {/* Magic Sparkle 2 */}
                <div 
                  className="absolute bottom-12 right-6 w-2 h-2 bg-amber-200 rounded-full opacity-0"
                  style={{ animation: 'luxurySparkle 5s infinite linear 0.7s' }}
                />
                {/* Magic Sparkle 3 */}
                <div 
                  className="absolute bottom-20 right-14 w-1 h-1 bg-white rounded-full opacity-0"
                  style={{ animation: 'luxurySparkle 5s infinite linear 1.5s' }}
                />
              </div>

            </div>
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-night/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
          </div>
        </section>

        {/* Global Web Animations Engine injected safely inside standard CSS string layer */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes cinematicSmoke1 {
            0% { transform: translateY(40px) scale(0.7) rotate(0deg); opacity: 0; filter: blur(8px); }
            20% { opacity: 0.6; }
            50% { transform: translateY(-110px) scale(1.5) translateX(-25px) rotate(-12deg); opacity: 0.4; filter: blur(14px); }
            100% { transform: translateY(-260px) scale(2.3) translateX(-60px) rotate(-25deg); opacity: 0; filter: blur(24px); }
          }
          @keyframes cinematicSmoke2 {
            0% { transform: translateY(50px) scale(0.5) rotate(0deg); opacity: 0; filter: blur(12px); }
            25% { opacity: 0.5; }
            70% { transform: translateY(-140px) scale(1.7) translateX(20px) rotate(15deg); opacity: 0.3; filter: blur(18px); }
            100% { transform: translateY(-310px) scale(2.5) translateX(45px) rotate(35deg); opacity: 0; filter: blur(30px); }
          }
          @keyframes luxurySparkle {
            0% { transform: translateY(20px) translateX(0) scale(0.3); opacity: 0; }
            50% { opacity: 1; transform: translateY(-90px) translateX(-20px) scale(1.4); }
            100% { transform: translateY(-210px) translateX(-45px) scale(0); opacity: 0; }
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
