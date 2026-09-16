import type { Placement } from '@floating-ui/vue'
import { describe, expect, it, vi } from 'vitest'
import {
  createApp,
  defineComponent,
  h,
  nextTick,
  shallowRef,
} from 'vue'

import { useVueltip } from './composables'
import { setOptions } from './options'
import {
  debouncedHoveredElement,
  debouncedTooltipPlacement,
} from './state'

const TOOLTIP_WIDTH = 100
const TOOLTIP_HEIGHT = 40
const ARROW_SIZE = 10

// Geometry is asserted against real getBoundingClientRect() values rather than
// parsed transform strings, so the assertions survive floating-ui internals
// changing how floatingStyles is expressed.
const TOLERANCE = 2
const expectClose = (
  actual: number,
  expected: number,
  tolerance = TOLERANCE,
) => {
  expect(
    Math.abs(actual - expected),
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  ).toBeLessThanOrEqual(tolerance)
}

type HarnessOptions = {
  offset?: number
  padding?: number
  withArrow?: boolean
  /** Render the tooltip with `v-if` instead of the default `v-show`. */
  vIf?: boolean
}

const mountHarness = ({
  offset,
  padding,
  withArrow,
  vIf,
}: HarnessOptions = {}) => {
  let api: ReturnType<typeof useVueltip> | undefined

  const component = defineComponent({
    setup() {
      const tooltipElement = shallowRef<HTMLElement | null>(
        null,
      )
      const arrowElement = shallowRef<HTMLElement | null>(
        null,
      )
      api = useVueltip({
        tooltipElement,
        arrowSize: ARROW_SIZE,
        ...(withArrow ? { arrowElement } : {}),
        ...(offset === undefined ? {} : { offset }),
        ...(padding === undefined ? {} : { padding }),
      })
      const local = api
      return () =>
        vIf && !local.show.value
          ? null
          : h(
              'div',
              {
                ref: tooltipElement,
                style: {
                  ...local.tooltipStyles.value,
                  width: `${TOOLTIP_WIDTH}px`,
                  height: `${TOOLTIP_HEIGHT}px`,
                  ...(vIf
                    ? {}
                    : {
                        display: local.show.value
                          ? ''
                          : 'none',
                      }),
                },
              },
              withArrow
                ? [
                    h('div', {
                      ref: arrowElement,
                      style: local.arrowStyles.value,
                    }),
                  ]
                : [],
            )
    },
  })

  const container = document.createElement('div')
  document.body.appendChild(container)
  const app = createApp(component)
  app.mount(container)

  return {
    container,
    api: api!,
    tooltip: () =>
      container.firstElementChild as HTMLElement,
    arrow: () =>
      container.firstElementChild
        ?.firstElementChild as HTMLElement,
    unmount: () => {
      app.unmount()
      container.remove()
    },
  }
}

const createReference = (
  style: Partial<CSSStyleDeclaration>,
) => {
  const el = document.createElement('div')
  Object.assign(el.style, {
    position: 'fixed',
    width: '20px',
    height: '20px',
    ...style,
  })
  document.body.appendChild(el)
  return el
}

const show = async (
  reference: HTMLElement,
  placement: Placement,
) => {
  debouncedTooltipPlacement.value = placement
  debouncedHoveredElement.value = reference
  await nextTick()
}

const teardown = (
  harness: ReturnType<typeof mountHarness>,
  ...elements: HTMLElement[]
) => {
  debouncedHoveredElement.value = undefined
  debouncedTooltipPlacement.value = 'top'
  harness.unmount()
  elements.forEach((el) => el.remove())
  setOptions({ handleDialogModals: false })
}

describe('useVueltip positioning', () => {
  it('positions the tooltip on the requested side of the reference', async () => {
    const harness = mountHarness({ offset: 8 })
    const reference = createReference({
      top: '300px',
      left: '200px',
    })

    await show(reference, 'top')

    await vi.waitFor(() => {
      const tip = harness.tooltip().getBoundingClientRect()
      const ref = reference.getBoundingClientRect()
      expectClose(tip.bottom, ref.top - 8)
      expectClose(
        tip.left + tip.width / 2,
        ref.left + ref.width / 2,
      )
    })

    expect(harness.api.tooltipStyles.value.position).toBe(
      'absolute',
    )

    teardown(harness, reference)
  })

  it('positions the tooltip on the bottom when asked', async () => {
    const harness = mountHarness({ offset: 8 })
    const reference = createReference({
      top: '300px',
      left: '200px',
    })

    await show(reference, 'bottom')

    await vi.waitFor(() => {
      const tip = harness.tooltip().getBoundingClientRect()
      const ref = reference.getBoundingClientRect()
      expectClose(tip.top, ref.bottom + 8)
    })

    const tip = harness.tooltip().getBoundingClientRect()
    const ref = reference.getBoundingClientRect()
    expect(tip.top).toBeGreaterThan(ref.bottom)

    teardown(harness, reference)
  })

  it('flips to the opposite side when the preferred side has no room', async () => {
    const harness = mountHarness({ offset: 8 })
    // Only 4px of room above: not enough for a 40px tooltip plus 8px offset.
    const reference = createReference({
      top: '4px',
      left: '200px',
    })

    await show(reference, 'top')

    await vi.waitFor(() => {
      const tip = harness.tooltip().getBoundingClientRect()
      const ref = reference.getBoundingClientRect()
      expectClose(tip.top, ref.bottom + 8)
    })
    expect(harness.api.tooltipStyles.value).toBeTruthy()

    teardown(harness, reference)
  })

  it('shifts the tooltip back inside the viewport, respecting padding', async () => {
    const padding = 8
    const harness = mountHarness({ offset: 8, padding })
    // Centring a 100px tooltip on this reference would put it at x = -40.
    const reference = createReference({
      top: '300px',
      left: '0px',
    })

    await show(reference, 'top')

    await vi.waitFor(() => {
      const tip = harness.tooltip().getBoundingClientRect()
      expectClose(tip.left, padding)
    })

    // Never allowed to spill past the padded viewport edge.
    const tip = harness.tooltip().getBoundingClientRect()
    expect(tip.left).toBeGreaterThanOrEqual(
      padding - TOLERANCE,
    )
    expect(tip.right).toBeLessThanOrEqual(
      window.innerWidth - padding + TOLERANCE,
    )

    teardown(harness, reference)
  })

  it('repositions via autoUpdate when the reference element moves', async () => {
    const harness = mountHarness({ offset: 8 })
    const reference = createReference({
      top: '300px',
      left: '200px',
    })

    await show(reference, 'bottom')

    await vi.waitFor(() => {
      const tip = harness.tooltip().getBoundingClientRect()
      expectClose(tip.top, 320 + 8)
    })
    const before = harness.tooltip().getBoundingClientRect()

    reference.style.top = '500px'

    await vi.waitFor(() => {
      const tip = harness.tooltip().getBoundingClientRect()
      const ref = reference.getBoundingClientRect()
      expectClose(ref.top, 500)
      expectClose(tip.top, ref.bottom + 8)
    })

    // The tooltip actually tracked the move rather than staying put.
    const after = harness.tooltip().getBoundingClientRect()
    expect(after.top - before.top).toBeCloseTo(200, -1)

    teardown(harness, reference)
  })
})

describe('useVueltip arrow middleware', () => {
  it('feeds middlewareData.arrow into arrowStyles and anchors it to the static side', async () => {
    const harness = mountHarness({
      offset: 8,
      withArrow: true,
    })
    const reference = createReference({
      top: '300px',
      left: '200px',
    })

    await show(reference, 'top')

    await vi.waitFor(() => {
      const styles = harness.api.arrowStyles
        .value as Record<string, string>
      expect(styles['left']).toMatch(/^-?[\d.]+px$/)
    })

    const styles = harness.api.arrowStyles.value as Record<
      string,
      string
    >
    // placement 'top' -> static side is 'bottom', offset by half the arrow.
    expect(styles['bottom']).toBe(`-${ARROW_SIZE / 2}px`)
    expect(styles['width']).toBe(`${ARROW_SIZE}px`)
    expect(styles['height']).toBe(`${ARROW_SIZE}px`)

    // The arrow should sit horizontally over the reference's centre.
    const arrow = harness.arrow().getBoundingClientRect()
    const ref = reference.getBoundingClientRect()
    expectClose(
      arrow.left + arrow.width / 2,
      ref.left + ref.width / 2,
    )

    teardown(harness, reference)
  })

  it('anchors the arrow to the opposite static side when the placement flips', async () => {
    const harness = mountHarness({
      offset: 8,
      withArrow: true,
    })
    const reference = createReference({
      top: '4px',
      left: '200px',
    })

    await show(reference, 'top')

    await vi.waitFor(() => {
      const styles = harness.api.arrowStyles
        .value as Record<string, string>
      // Flipped to 'bottom' -> static side becomes 'top'.
      expect(styles['top']).toBe(`-${ARROW_SIZE / 2}px`)
    })

    teardown(harness, reference)
  })
})

describe('useVueltip dialog reparenting', () => {
  const setupDialog = () => {
    const dialog = document.createElement('dialog')
    const inDialog = document.createElement('div')
    dialog.appendChild(inDialog)
    document.body.appendChild(dialog)
    dialog.showModal()
    return { dialog, inDialog }
  }

  const teardownDialog = (dialog: HTMLDialogElement) => {
    dialog.close()
    dialog.remove()
  }

  it('moves the tooltip into a modal dialog', async () => {
    setOptions({ handleDialogModals: true })
    const harness = mountHarness({ offset: 8 })
    const { dialog, inDialog } = setupDialog()
    const outside = createReference({
      top: '300px',
      left: '200px',
    })

    // The first activation is what records the tooltip's initial parent.
    // Hold a stable handle on the element: reparenting moves it out of the
    // container, so container.firstElementChild stops resolving to it.
    await show(outside, 'top')
    await nextTick()
    const tip = harness.tooltip()
    expect(tip.parentElement).toBe(harness.container)

    debouncedHoveredElement.value = undefined
    await nextTick()

    await show(inDialog, 'top')
    await nextTick()
    expect(tip.parentElement).toBe(dialog)

    teardownDialog(dialog)
    teardown(harness, outside)
  })

  it('restores the tooltip to its original parent when leaving the dialog', async () => {
    setOptions({ handleDialogModals: true })
    const harness = mountHarness({ offset: 8 })
    const { dialog, inDialog } = setupDialog()
    const outside = createReference({
      top: '300px',
      left: '200px',
    })

    await show(outside, 'top')
    await nextTick()
    const tip = harness.tooltip()
    const initialParent = tip.parentElement

    debouncedHoveredElement.value = undefined
    await nextTick()
    await show(inDialog, 'top')
    await nextTick()
    expect(tip.parentElement).toBe(dialog)

    debouncedHoveredElement.value = undefined
    await nextTick()
    await show(outside, 'top')
    await nextTick()
    expect(tip.parentElement).toBe(initialParent)

    teardownDialog(dialog)
    teardown(harness, outside)
  })

  // The reference can change without `show` ever going false, so reparenting
  // has to react to the reference rather than to the visibility toggle.
  it('restores the tooltip when moving straight from the dialog to an outside element', async () => {
    setOptions({ handleDialogModals: true })
    const harness = mountHarness({ offset: 8 })
    const { dialog, inDialog } = setupDialog()
    const outside = createReference({
      top: '300px',
      left: '200px',
    })

    // Grab the handle before the first show: reparenting moves the element
    // out of the container, so container.firstElementChild stops resolving.
    const tip = harness.tooltip()

    await show(inDialog, 'top')
    await nextTick()
    expect(tip.parentElement).toBe(dialog)

    // No hidden state in between: straight from the dialog to the outside.
    await show(outside, 'top')
    await nextTick()
    expect(tip.parentElement).toBe(harness.container)

    teardownDialog(dialog)
    teardown(harness, outside)
  })

  // The demo renders the tooltip with `v-if`, so the element does not exist
  // when the reference changes -- only after the render flush.
  it('v-if: moves the tooltip into the dialog and restores it afterwards', async () => {
    setOptions({ handleDialogModals: true })
    const harness = mountHarness({ offset: 8, vIf: true })
    const { dialog, inDialog } = setupDialog()
    const outside = createReference({
      top: '300px',
      left: '200px',
    })

    expect(harness.container.firstElementChild).toBeNull()

    await show(inDialog, 'top')
    await nextTick()
    // Reparenting already happened, so the element is no longer reachable
    // through the container -- pick it up from the dialog instead.
    const tip = dialog.lastElementChild as HTMLElement
    expect(tip).not.toBe(inDialog)
    expect(tip.parentElement).toBe(dialog)

    await show(outside, 'top')
    await nextTick()
    expect(tip.parentElement).toBe(harness.container)

    teardownDialog(dialog)
    teardown(harness, outside)
  })

  it('leaves the tooltip in place when handleDialogModals is disabled', async () => {
    setOptions({ handleDialogModals: false })
    const harness = mountHarness({ offset: 8 })

    const { dialog, inDialog } = setupDialog()

    await show(inDialog, 'top')
    await nextTick()
    expect(harness.tooltip().parentElement).toBe(
      harness.container,
    )

    teardownDialog(dialog)
    teardown(harness)
  })
})
