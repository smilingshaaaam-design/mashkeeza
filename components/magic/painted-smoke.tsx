const BOX = { left: 68.5, top: 21, width: 24, height: 50 }

export function PaintedSmoke() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute overflow-hidden z-10"
      style={{
        left: `${BOX.left}%`,
        top: `${BOX.top}%`,
        width: `${BOX.width}%`,
        height: `${BOX.height}%`,
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover mix-blend-screen"
      >
        <source src="/VID-20261104-WA0031.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
