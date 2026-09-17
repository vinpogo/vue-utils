import { describe, expect, it } from 'vitest'

import { PACKAGE_NAME } from './index'

describe('package entry', () => {
  it('exposes the package name', () => {
    expect(PACKAGE_NAME).toBe('@vingy/vuetification')
  })
})
