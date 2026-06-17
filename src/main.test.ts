import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Track render-call order across the whole test file.
const renderOrder: string[] = []

const makeRender = (name: string) => (container: HTMLElement) => {
  renderOrder.push(name)
  const section = document.createElement('section')
  section.setAttribute('data-mock', name)
  container.appendChild(section)
}

vi.mock('./style.css', () => ({}))

vi.mock('./components/hero', () => ({
  renderHeroSection: (c: HTMLElement) => makeRender('hero')(c),
}))
vi.mock('./components/cloudwatch', () => ({
  renderCloudWatchSection: (c: HTMLElement) => makeRender('cloudwatch')(c),
}))
vi.mock('./components/logs-insights', () => ({
  renderLogsInsightsSection: (c: HTMLElement) => makeRender('logs-insights')(c),
}))
vi.mock('./components/xray', () => ({
  renderXRaySection: (c: HTMLElement) => makeRender('xray')(c),
}))
vi.mock('./components/workflow', () => ({
  renderWorkflowSection: (c: HTMLElement) => makeRender('workflow')(c),
}))
vi.mock('./components/takeaways', () => ({
  renderTakeawaysSection: (c: HTMLElement) => makeRender('takeaways')(c),
}))

const scrollIntoViewMock = vi.fn()

beforeEach(() => {
  renderOrder.length = 0
  scrollIntoViewMock.mockClear()
  // happy-dom doesn't implement scrollIntoView; stub it on the prototype.
  Element.prototype.scrollIntoView = scrollIntoViewMock as unknown as Element['scrollIntoView']
  document.body.innerHTML = '<div id="app"></div>'
  vi.resetModules()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('main.ts bootstrap', () => {
  it('throws when #app root is missing', async () => {
    document.body.innerHTML = ''
    await expect(import('./main')).rejects.toThrow('App root not found.')
  })

  it('renders header nav with 5 anchor links to known sections', async () => {
    await import('./main')
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('nav.site-nav a'),
    ).map((a) => a.getAttribute('href'))
    expect(links).toEqual([
      '#cloudwatch',
      '#logs-insights',
      '#xray',
      '#workflow',
      '#takeaways',
    ])
  })

  it('calls all 6 render*Section functions in the correct order against #main-content', async () => {
    await import('./main')
    expect(renderOrder).toEqual([
      'hero',
      'cloudwatch',
      'logs-insights',
      'xray',
      'workflow',
      'takeaways',
    ])
    const mainContent = document.querySelector('#main-content')!
    expect(mainContent.querySelectorAll('section[data-mock]')).toHaveLength(6)
  })
})

describe('setupSmoothScroll', () => {
  it('scrolls smoothly and preventsDefault when href targets an existing element', async () => {
    await import('./main')
    const target = document.createElement('div')
    target.id = 'cloudwatch'
    document.body.appendChild(target)

    const link = document.querySelector<HTMLAnchorElement>(
      'nav.site-nav a[href="#cloudwatch"]',
    )!
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    const preventSpy = vi.spyOn(event, 'preventDefault')
    link.dispatchEvent(event)

    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1)
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
    expect(preventSpy).toHaveBeenCalled()
  })

  it('does nothing when href is exactly "#"', async () => {
    await import('./main')
    const brand = document.querySelector<HTMLAnchorElement>('a.brand')!
    brand.setAttribute('href', '#')

    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    const preventSpy = vi.spyOn(event, 'preventDefault')
    brand.dispatchEvent(event)

    expect(scrollIntoViewMock).not.toHaveBeenCalled()
    expect(preventSpy).not.toHaveBeenCalled()
  })

  it('does nothing when href targets a non-existent element', async () => {
    await import('./main')
    const nav = document.querySelector('nav.site-nav')!
    const link = nav.querySelector<HTMLAnchorElement>('a[href="#workflow"]')!
    link.setAttribute('href', '#missing')

    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    const preventSpy = vi.spyOn(event, 'preventDefault')
    link.dispatchEvent(event)

    expect(scrollIntoViewMock).not.toHaveBeenCalled()
    expect(preventSpy).not.toHaveBeenCalled()
  })
})

describe('setupScrollAnimations', () => {
  it('adds .is-visible to all .reveal elements immediately when IntersectionObserver is missing', async () => {
    vi.doMock('./components/hero', () => ({
      renderHeroSection: (c: HTMLElement) => {
        renderOrder.push('hero')
        const a = document.createElement('div')
        a.className = 'reveal'
        a.id = 'r-a'
        const b = document.createElement('div')
        b.className = 'reveal'
        b.id = 'r-b'
        c.appendChild(a)
        c.appendChild(b)
      },
    }))

    const originalIO = (window as unknown as { IntersectionObserver?: unknown })
      .IntersectionObserver
    // @ts-expect-error — intentionally remove for the missing-IO branch.
    delete window.IntersectionObserver

    await import('./main')

    const reveals = document.querySelectorAll<HTMLElement>('.reveal')
    expect(reveals.length).toBeGreaterThanOrEqual(2)
    reveals.forEach((el) => {
      expect(el.classList.contains('is-visible')).toBe(true)
    })

    if (originalIO) {
      ;(window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
        originalIO
    }
  })

  it('defers .is-visible until observer callback fires with isIntersecting=true; calls unobserve on that element', async () => {
    vi.doMock('./components/hero', () => ({
      renderHeroSection: (c: HTMLElement) => {
        renderOrder.push('hero')
        const a = document.createElement('div')
        a.className = 'reveal'
        a.id = 'r-a'
        const b = document.createElement('div')
        b.className = 'reveal'
        b.id = 'r-b'
        c.appendChild(a)
        c.appendChild(b)
      },
    }))

    let capturedCallback: IntersectionObserverCallback | null = null
    const unobserveSpy = vi.fn()
    const observeSpy = vi.fn()

    class FakeIO implements IntersectionObserver {
      root = null
      rootMargin = ''
      thresholds = []
      constructor(cb: IntersectionObserverCallback) {
        capturedCallback = cb
      }
      observe = observeSpy
      unobserve = unobserveSpy
      disconnect = vi.fn()
      takeRecords = () => []
    }
    ;(window as unknown as { IntersectionObserver: typeof FakeIO }).IntersectionObserver =
      FakeIO

    await import('./main')

    const a = document.getElementById('r-a')!
    const b = document.getElementById('r-b')!

    expect(a.classList.contains('is-visible')).toBe(false)
    expect(b.classList.contains('is-visible')).toBe(false)
    expect(observeSpy).toHaveBeenCalledTimes(2)

    expect(capturedCallback).not.toBeNull()
    capturedCallback!(
      [
        { isIntersecting: true, target: a } as unknown as IntersectionObserverEntry,
        { isIntersecting: false, target: b } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    )

    expect(a.classList.contains('is-visible')).toBe(true)
    expect(b.classList.contains('is-visible')).toBe(false)
    expect(unobserveSpy).toHaveBeenCalledTimes(1)
    expect(unobserveSpy).toHaveBeenCalledWith(a)
  })
})
