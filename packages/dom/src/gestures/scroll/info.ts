import { progress, velocityPerSecond } from "@motionone/utils"
import { AxisScrollInfo, ScrollInfo } from "./types"

/**
 * A time in milliseconds, beyond which we consider the scroll velocity to be 0.
 */
const maxElapsed = 50

const createAxisInfo = (): AxisScrollInfo => ({
  current: 0,
  offset: [],
  progress: 0,
  scrollLength: 0,
  targetOffset: 0,
  targetLength: 0,
  containerLength: 0,
  velocity: 0,
})

export const createScrollInfo = (): ScrollInfo => ({
  time: 0,
  x: createAxisInfo(),
  y: createAxisInfo(),
})

const keys = {
  x: {
    length: "Width",
    position: "Left",
  },
  y: {
    length: "Height",
    position: "Top",
  },
}

function updateAxisInfo(
  element: HTMLElement,
  axisName: "x" | "y",
  info: ScrollInfo,
  time: number
) {
  const axis = info[axisName]
  const { length, position } = keys[axisName]

  const prev = axis.current
  const prevTime = info.time

  axis.current = element["scroll" + position]
  axis.scrollLength = element["scroll" + length] - element["client" + length]
  axis.offset.length = 0
  axis.offset[0] = 0
  axis.offset[1] = axis.scrollLength
  axis.progress = progress(0, axis.scrollLength, axis.current)

  const elapsed = time - prevTime
  axis.velocity =
    elapsed > maxElapsed ? 0 : velocityPerSecond(axis.current - prev, elapsed)
}

export function updateScrollInfo(
  element: HTMLElement,
  info: ScrollInfo,
  time: number
) {
  updateAxisInfo(element, "x", info, time)
  updateAxisInfo(element, "y", info, time)
  info.time = time
}
