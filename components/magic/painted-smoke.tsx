export function PaintedSmoke() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute mix-blend-screen object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]"
        style={{
          left: '62%',  /* Position ko exact lamp ki jagah lane ke liye ise thoda adjust kar sakte hain */
          top: '20%',
          width: '35%', /* Video ka size */
          height: 'auto',
        }}
      >
        {/* Next.js me public folder ke andar padi file ko direct / ke sath likhte hain */}
        <source src="/VID-20261104-WA0031.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
