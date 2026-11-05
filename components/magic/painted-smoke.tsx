// Box is aligned so the smoke in lamp-smoke.mp4 starts exactly at the painted lamp's spout.
const BOX = { left: 69.19, top: 34.23, width: 31.31, height: 36.9 }

export function PaintedSmoke() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 mix-blend-screen"
        style={{
          left: `${BOX.left}%`,
          top: `${BOX.top}%`,
          width: `${BOX.width}%`,
          height: `${BOX.height}%`,
        }}
      >
        <video autoPlay loop muted playsInline className="h-full w-full object-fill">
          <source src="/lamp-smoke.mp4" type="video/mp4" />
        </video>
      </div>
      <span
        aria-hidden="true"
        className="lamp-spout-glow pointer-events-none absolute z-10 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left: '75.1%', top: '64.5%', width: '4.5%' }}
      />
    </>
  )
}
