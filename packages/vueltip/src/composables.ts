import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/vue'
import type { Maybe } from '@vingy/shared/types'
import { computed, type StyleValue, watch } from 'vue'

import { getOption } from './options'
import {
  debouncedHoveredElement,
  debouncedTooltipPlacement,
  hoveredElement,
  tooltipContent,
} from './state'
import type { UseTooltipOptions } from './types.ts'

const sideMap: Record<string, string> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
}

export const useVueltip = ({
  tooltipElement,
  arrowElement,
  offset: _offset,
  padding,
  arrowSize,
  floatingOptions,
}: UseTooltipOptions) => {
  const show = computed(
    () => !!debouncedHoveredElement.value,
  )

  watch(
    show,
    (value, _, onCleanup) => {
      if (!value) return
      const el = tooltipElement.value
      if (!el) return

      const onEnter = () =>
        (hoveredElement.value =
          debouncedHoveredElement.value)
      const onLeave = () =>
        (hoveredElement.value = undefined)

      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)

      onCleanup(() => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    },
    { flush: 'post' },
  )
  const middleware = [
    offset(_offset),
    flip(),
    shift({ padding }),
  ]
  if (arrowElement) {
    middleware.push(
      arrow({ element: arrowElement, padding: 6 }),
    )
  }
  const { floatingStyles, middlewareData, placement } =
    useFloating(debouncedHoveredElement, tooltipElement, {
      placement: debouncedTooltipPlacement,
      whileElementsMounted: autoUpdate,
      middleware,
      ...floatingOptions,
    })

  const staticSide = computed(
    () => sideMap[placement.value.split('-')[0]]!,
  )
  const size = arrowSize ?? 10
  const arrowStyles = computed<StyleValue>(() => {
    return {
      width: `${size}px`,
      height: `${size}px`,
      rotate: '45deg',
      position: 'absolute',
      left:
        middlewareData.value.arrow?.x != null
          ? `${middlewareData.value.arrow.x}px`
          : '',
      top:
        middlewareData.value.arrow?.y != null
          ? `${middlewareData.value.arrow.y}px`
          : '',
      [staticSide.value]: `-${size / 2}px`,
    }
  })

  if (getOption('handleDialogModals')) {
    // Captured once: every later show must be able to compare against the
    // parent the tooltip was rendered into, not the dialog we moved it to.
    let initialParent: Maybe<HTMLElement>

    watch(
      debouncedHoveredElement,
      (reference) => {
        const el = tooltipElement.value
        if (!reference || !el) return
        initialParent ??= el.parentElement
        if (!initialParent) return

        const dialogEl = reference.closest('dialog')
        const isModal =
          !!dialogEl &&
          globalThis.getComputedStyle(
            dialogEl,
            '::backdrop',
          ).display !== 'none'

        if (isModal) {
          dialogEl.appendChild(el)
        } else if (el.parentElement !== initialParent) {
          initialParent.appendChild(el)
        }
      },
      // post-flush so a v-if tooltip element already exists when we reparent.
      { flush: 'post' },
    )
  }

  return {
    tooltipStyles: floatingStyles,
    arrowStyles,
    show,
    content: tooltipContent,
  }
}
