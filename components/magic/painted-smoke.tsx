// Box is aligned so the smoke in lamp-smoke.mp4 starts exactly at the painted lamp's spout.
const VIDEO_BOX = { left: 69.19, top: 34.23, width: 31.31, height: 36.9 }

// Region of desert-scene.png that contains the painted purple smoke.
const PAINTED_BOX = { left: 68.5, top: 21, width: 24, height: 50 }

const paintedLayerStyle = {
  backgroundImage: 'url(/images/desert-scene.png)',
  backgroundSize: `${(100 / PAINTED_BOX.width) * 100}% ${(100 / PAINTED_BOX.height) * 100}%`,
  backgroundPosition: `${(PAINTED_BOX.left / (100 - PAINTED_BOX.width)) * 100}% ${(PAINTED_BOX.top / (100 - PAINTED_BOX.height)) * 100}%`,
}

export function PaintedSmoke() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-10"
        style={{
          left: `${PAINTED_BOX.left}%`,
          top: `${PAINTED_BOX.top}%`,
          width: `${PAINTED_BOX.width}%`,
          height: `${PAINTED_BOX.height}%`,
        }}
      >
        <div className="painted-smoke painted-smoke-base absolute inset-0" style={paintedLayerStyle} />
        <div
          className="painted-smoke painted-smoke-glow absolute inset-0 mix-blend-screen"
          style={paintedLayerStyle}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 mix-blend-screen"
        style={{
          left: `${VIDEO_BOX.left}%`,
          top: `${VIDEO_BOX.top}%`,
          width: `${VIDEO_BOX.width}%`,
          height: `${VIDEO_BOX.height}%`,
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
