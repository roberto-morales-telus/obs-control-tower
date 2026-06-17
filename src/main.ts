import './style.css'
import { renderCloudWatchSection } from './components/cloudwatch'
import { renderHeroSection } from './components/hero'
import { renderLogsInsightsSection } from './components/logs-insights'
import { renderTakeawaysSection } from './components/takeaways'
import { renderWorkflowSection } from './components/workflow'
import { renderXRaySection } from './components/xray'

const root = document.querySelector<HTMLElement>('#app')
//Make sure the root element exists before proceeding
if (!root) {
  throw new Error('App root not found.')
}

root.innerHTML = `
  <header class="site-header" aria-label="Primary">
    <div class="container header-inner">
      <a class="brand" href="#hero" aria-label="AWS Observability Control Tower home">
        <span class="brand-mark" aria-hidden="true">◌</span>
        <span>
          <strong>AWS Observability</strong>
          <small>Control Tower</small>
        </span>
      </a>
      <nav class="site-nav" aria-label="Section navigation">
        <a href="#cloudwatch">CloudWatch</a>
        <a href="#logs-insights">Logs Insights</a>
        <a href="#xray">X-Ray</a>
        <a href="#workflow">Workflow</a>
        <a href="#takeaways">Takeaways</a>
      </nav>
    </div>
  </header>
  <main id="main-content"></main>
`

const mainContent = root.querySelector<HTMLElement>('#main-content')

if (!mainContent) {
  throw new Error('Main content container not found.')
}

renderHeroSection(mainContent)
renderCloudWatchSection(mainContent)
renderLogsInsightsSection(mainContent)
renderXRaySection(mainContent)
renderWorkflowSection(mainContent)
renderTakeawaysSection(mainContent)

const setupSmoothScroll = (scope: ParentNode): void => {
  const anchorLinks = scope.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href')

      if (!targetId || targetId === '#') {
        return
      }

      const target = document.querySelector<HTMLElement>(targetId)

      if (!target) {
        return
      }

      event.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })
}

const setupScrollAnimations = (): void => {
  const revealItems = document.querySelectorAll<HTMLElement>('.reveal')

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -48px 0px',
    },
  )

  revealItems.forEach((item) => observer.observe(item))
}

setupSmoothScroll(root)
setupScrollAnimations()
