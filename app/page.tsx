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

      {/* Invisible SVG Distortion Filter Matrix for Fluid Smoke Movement */}
      <svg className="absolute w-0 h-0 invisible" xmlns="http://w3.org">
        <defs>
          <filter id="magical-fluid-smoke" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.04" numOctaves="3" result="noise">
              <animate attributeName="baseFrequency" dur="15s" values="0.015 0.04; 0.015 0.07; 0.015 0.04" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <main>
        <section aria-label="روحانی منظر" className="relative -mt-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[16/8]">
            <div className="absolute inset-y-0 left-1/2 aspect-[1584/672] h-full -translate-x-1/2 [container-type:inline-size] w-full max-w-[1584px]">
              
              {/* 1. BASE BACKGROUND IMAGE (Pahaad aur baqi scene bilkul static rahega) */}
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

              {/* 2. LIVE LIQUID MASK (Sirf image ke dhuwan wale hisse ko target karega) */}
              <div 
                className="absolute bottom-[24%] right-[5%] w-[42cqw] h-[55cqw] max-w-[550px] max-h-[650px] pointer-events-none z-10 bg-no-repeat bg-contain origin-bottom-right opacity-95"
                style={{
                  backgroundImage: "url('/images/desert-scene.png')",
                  backgroundPosition: "91% 68%", // Exact focal point of purple smoke stream
                  backgroundSize: "320%", // Image ko crop kiye bina sirf smoke zone par align kiya
                  filter: "url(#magical-fluid-smoke)", // Direct dynamic ripple on original pixels
                }}
              />

              {/* 3. OPTIONAL: Golden Overlay particles to mix with the moving smoke */}
              <div className="absolute bottom-[35%] right-[15%] w-32 h-64 pointer-events-none mix-blend-screen z-20">
                <div className="absolute bottom-4 left-1/2 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0" style={{ animation: 'subtleSparkle 4s infinite linear' }} />
                <div className="absolute bottom-16 left-1/3 w-1 h-1 bg-white rounded-full opacity-0" style={{ animation: 'subtleSparkle 5s infinite linear 1s' }} />
              </div>

            </div>
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-night/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
          </div>
        </section>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes subtleSparkle {
            0% { transform: translateY(30px) scale(0.3); opacity: 0; }
            30% { opacity: 0.8; }
            100% { transform: translateY(-120px) scale(0); opacity: 0; }
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
