import { LampSmokeCanvas } from './lamp-smoke-canvas'

const SPOUT = { x: 75.1, y: 64.5 }

// Canvas region (percent of the scene) the smoke can curl through: left of the spout for the
// opening loop, then up and over the lamp toward the top-right corner.
const CANVAS_BOX = { left: 55, top: 0, width: 45, height: 80 }
const CANVAS_ORIGIN = {
  x: (SPOUT.x - CANVAS_BOX.left) / CANVAS_BOX.width,
  y: (SPOUT.y - CANVAS_BOX.top) / CANVAS_BOX.height,
}
// One smoke unit spans 55% of the scene height.
const CANVAS_SCALE = 0.55 / (CANVAS_BOX.height / 100)

// Pixel region (1100,160 → 1460,470) of desert-scene.png that held the painted smoke.
// lamp-smoke-plate.png is that region with the painted smoke removed (sand and lamp untouched).
const PLATE_BOX = { left: 69.444, top: 23.81, width: 22.727, height: 46.131 }

const boxStyle = (box: { left: number; top: number; width: number; height: number }) => ({
  left: `${box.left}%`,
  top: `${box.top}%`,
  width: `${box.width}%`,
  height: `${box.height}%`,
})

export function PaintedSmoke() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/lamp-smoke-plate.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute z-10"
        style={boxStyle(PLATE_BOX)}
      />

      <div aria-hidden="true" className="pointer-events-none absolute z-10" style={boxStyle(CANVAS_BOX)}>
        <LampSmokeCanvas originX={CANVAS_ORIGIN.x} originY={CANVAS_ORIGIN.y} scale={CANVAS_SCALE} />
      </div>

      <span
        aria-hidden="true"
        className="lamp-spout-glow pointer-events-none absolute z-10 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left: `${SPOUT.x}%`, top: `${SPOUT.y}%`, width: '4.5%' }}
      />
    </>
  )
}
