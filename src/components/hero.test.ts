import { renderHeroSection } from './hero'

describe('renderHeroSection', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it('appends exactly one <section> to the container', () => {
    renderHeroSection(container)
    const sections = container.querySelectorAll('section')
    expect(sections).toHaveLength(1)
    expect(container.children).toHaveLength(1)
    expect(container.firstElementChild?.tagName).toBe('SECTION')
  })

  it('section has id="hero" and classes "section hero reveal"', () => {
    renderHeroSection(container)
    const section = container.querySelector('section')!
    expect(section.id).toBe('hero')
    expect(section.classList.contains('section')).toBe(true)
    expect(section.classList.contains('hero')).toBe(true)
    expect(section.classList.contains('reveal')).toBe(true)
  })

  it('renders the H1 heading text', () => {
    renderHeroSection(container)
    const h1 = container.querySelector('h1')
    expect(h1).not.toBeNull()
    expect(h1!.textContent?.trim()).toBe(
      'Understand observability from metrics to traces.',
    )
  })

  it('renders 3 feature badges with CloudWatch, Logs Insights, and X-Ray', () => {
    renderHeroSection(container)
    const badges = container.querySelectorAll('.feature-badge')
    expect(badges).toHaveLength(3)
    const texts = Array.from(badges).map((b) => b.textContent ?? '')
    expect(texts.some((t) => t.includes('CloudWatch'))).toBe(true)
    expect(texts.some((t) => t.includes('Logs Insights'))).toBe(true)
    expect(texts.some((t) => t.includes('X-Ray'))).toBe(true)
  })

  it('renders 2 CTA buttons with correct hrefs', () => {
    renderHeroSection(container)
    const primary = container.querySelector<HTMLAnchorElement>(
      'a.button-primary',
    )
    const secondary = container.querySelector<HTMLAnchorElement>(
      'a.button-secondary',
    )
    expect(primary).not.toBeNull()
    expect(secondary).not.toBeNull()
    expect(primary!.getAttribute('href')).toBe('#cloudwatch')
    expect(secondary!.getAttribute('href')).toBe('#workflow')
  })

  it('renders exactly 3 article.stat-card elements', () => {
    renderHeroSection(container)
    const cards = container.querySelectorAll('article.stat-card')
    expect(cards).toHaveLength(3)
  })

  it('renders 3 .metric-chip elements inside .hero-metrics', () => {
    renderHeroSection(container)
    const heroMetrics = container.querySelector('.hero-metrics')
    expect(heroMetrics).not.toBeNull()
    const chips = heroMetrics!.querySelectorAll('.metric-chip')
    expect(chips).toHaveLength(3)
  })

  it('appends a second section when called twice (no deduplication)', () => {
    renderHeroSection(container)
    renderHeroSection(container)
    const sections = container.querySelectorAll('section')
    expect(sections).toHaveLength(2)
    sections.forEach((s) => expect(s.id).toBe('hero'))
  })

  it('preserves existing children of the container', () => {
    const existing = document.createElement('p')
    existing.textContent = 'pre-existing'
    container.appendChild(existing)

    renderHeroSection(container)

    expect(container.children).toHaveLength(2)
    expect(container.firstElementChild).toBe(existing)
    expect(container.lastElementChild?.tagName).toBe('SECTION')
  })
})
