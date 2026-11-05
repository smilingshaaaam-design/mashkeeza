// Box is aligned so the smoke in lamp-smoke.mp4 starts exactly at the painted lamp's spout.
const VIDEO_BOX = { left: 69.19, top: 34.23, width: 31.31, height: 36.9 }

// Pixel region (1100,160 → 1460,470) of desert-scene.png holding the painted smoke.
// lamp-smoke-plate.png is that region with the smoke removed (sand and lamp untouched),
// lamp-smoke-painted.png is the smoke alone, so only the smoke moves.
const PAINTED_BOX = { left: 69.444, top: 23.81, width: 22.727, height: 46.131 }

const boxStyle = (box: typeof PAINTED_BOX) => ({
  left: `${box.left}%`,
  top: `${box.top}%`,
  width: `${box.width}%`,
  height: `${box.height}%`,
})

export function PaintedSmoke() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute z-10" style={boxStyle(PAINTED_BOX)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/lamp-smoke-plate.png" alt="" className="absolute inset-0 h-full w-full" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/lamp-smoke-painted.png"
          alt=""
          className="painted-smoke-drift absolute inset-0 h-full w-full"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/lamp-smoke-painted.png"
          alt=""
          className="painted-smoke-shimmer absolute inset-0 h-full w-full mix-blend-screen"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 mix-blend-screen"
        style={boxStyle(VIDEO_BOX)}
      >
        <video autoPlay loop muted playsInline preload="auto" className="h-full w-full object-fill">
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
