const workflowColumns = [
  {
    title: 'Metrics in CloudWatch',
    icon: '📈',
    body: 'A CPU alarm or latency spike gives the first clear signal that something changed in production.',
  },
  {
    title: 'Logs in Insights',
    icon: '🧾',
    body: 'Queries narrow millions of lines into the error, warning, or timeout entries that matter most.',
  },
  {
    title: 'Traces in X-Ray',
    icon: '🕸️',
    body: 'A distributed trace confirms which dependency slowed down and how the issue propagated downstream.',
  },
] as const

const incidentSteps = [
  'CloudWatch detects a CPU spike and moves an alarm from OK to ALARM.',
  'An engineer opens Logs Insights and filters for ERROR and timeout events in the affected service.',
  'X-Ray shows Lambda spending most of the request waiting on DynamoDB retries, confirming the root cause.',
] as const

export const renderWorkflowSection = (container: HTMLElement): void => {
  const section = document.createElement('section')
  section.id = 'workflow'
  section.className = 'section reveal'

  section.innerHTML = `
    <div class="container">
      <span class="section-eyebrow">Unified workflow</span>
      <h2 class="section-title">
        <span class="icon-badge" aria-hidden="true">⎋</span>
        See how the three pillars work together.
      </h2>
      <p class="section-intro">
        Effective observability is a sequence, not a single tool. Metrics tell you when to look, logs tell you what changed, and traces tell you exactly where the problem lives.
      </p>

      <div class="workflow-grid" aria-label="Observability workflow overview">
        ${workflowColumns
          .map(
            (column) => `
              <article class="workflow-column">
                <div class="icon-badge" aria-hidden="true">${column.icon}</div>
                <h3>${column.title}</h3>
                <p class="copy-muted">${column.body}</p>
              </article>
            `,
          )
          .join('')}
      </div>

      <div class="connector-row" aria-hidden="true">
        <span>→</span>
        <span>→</span>
        <span>→</span>
      </div>

      <div class="panel">
        <h3 style="margin-top: 0;">Incident scenario walkthrough</h3>
        <div class="scenario-list" aria-label="Step-by-step incident response">
          ${incidentSteps
            .map(
              (step, index) => `
                <article class="scenario-step" data-step="${index}">
                  <strong>Step ${index + 1}</strong>
                  <p class="copy-muted" style="margin-bottom: 0;">${step}</p>
                </article>
              `,
            )
            .join('')}
        </div>
      </div>
    </div>
  `

  container.append(section)

  const steps = Array.from(section.querySelectorAll<HTMLElement>('.scenario-step'))

  if (!('IntersectionObserver' in window)) {
    steps.forEach((step) => step.classList.add('is-active'))
    return
  }

  const playScenario = (): void => {
    steps.forEach((step) => step.classList.remove('is-active'))
    steps.forEach((step, index) => {
      window.setTimeout(() => step.classList.add('is-active'), index * 480 + 180)
    })
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playScenario()
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.35 },
  )

  observer.observe(section)
}
