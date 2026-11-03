import Image from 'next/image'
import { MainNav } from '@/components/main-nav'

export function SiteHeader() {
  return (
    <header className="relative isolate z-20">
      <Image
        src="/images/hero-sky.png"
        alt=""
        fill
        priority
        className="-z-10 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-night/70" />

      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-12 pb-10 text-center md:pt-16 md:pb-14">
        <h1 className="gold-text glow-pulse text-5xl leading-[1.9] font-bold md:text-7xl md:leading-[1.8]">
          مشکیزہ روحانیت
        </h1>
        <p className="gold-text text-xl leading-[2.2] md:text-3xl">علم و معرفت کا روحانی مرکز</p>
        <div className="mt-2 flex items-center gap-3" aria-hidden="true">
          <span className="h-px w-24 bg-gradient-to-l from-gold to-transparent md:w-40" />
          <span className="size-2 rotate-45 bg-gold shadow-[0_0_10px_#f5c25b]" />
          <span className="h-px w-24 bg-gradient-to-r from-gold to-transparent md:w-40" />
        </div>
      </div>

      <MainNav />
    </header>
  )
}
