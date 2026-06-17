type TraceStage = {
  readonly name: string
  readonly latency: string
  readonly health: 'success' | 'warning' | 'danger'
  readonly note: string
  readonly fill: string
}

const traceStages: readonly TraceStage[] = [
  { name: 'Client', latency: '24ms', health: 'success', note: 'Browser request starts the trace.', fill: '18%' },
  { name: 'API Gateway', latency: '72ms', health: 'success', note: 'Ingress receives and routes the request.', fill: '34%' },
  { name: 'Lambda', latency: '418ms', health: 'warning', note: 'Business logic slows while waiting on a dependency.', fill: '68%' },
  { name: 'DynamoDB', latency: '128ms', health: 'danger', note: 'Hot partition causes retries and elevated latency.', fill: '44%' },
]

export const renderXRaySection = (container: HTMLElement): void => {
  const section = document.createElement('section')
  section.id = 'xray'
  section.className = 'section reveal'

  section.innerHTML = `
    <div class="container">
      <span class="section-eyebrow">AWS X-Ray</span>
      <h2 class="section-title">
        <span class="icon-badge" aria-hidden="true">⟶</span>
        Trace a single request across multiple services.
      </h2>
      <p class="section-intro">
        X-Ray connects the story between services by showing how a request travels through your architecture. It highlights latency, errors, and retries so you can focus on the real source of customer impact.
      </p>

      <div class="xray-layout">
        <div class="demo-shell">
          <div class="chart-title">
            <div>
              <h3 style="margin: 0;">Distributed trace replay</h3>
              <p class="copy-muted" style="margin: 0.35rem 0 0;">Replay the trace to see where time is spent from edge to database.</p>
            </div>
            <button class="button button-primary" type="button" id="simulate-request" aria-label="Replay the X-Ray request animation">Simulate Request</button>
          </div>
          <div class="service-map" aria-label="Service map from client to DynamoDB">
            <div class="trace-beam" aria-hidden="true"></div>
            ${traceStages
              .map(
                (stage, index) => `
                  <article class="service-node" data-step="${index}">
                    <strong>${stage.name}</strong>
                    <div class="latency-note">Latency: ${stage.latency}</div>
                    <p class="copy-muted">${stage.note}</p>
                    <span class="health-tag ${stage.health}">${stage.health === 'success' ? 'Healthy' : stage.health === 'warning' ? 'Slow path' : 'Errors detected'}</span>
                  </article>
                `,
              )
              .join('')}
          </div>

          <div class="timeline" aria-label="Simplified trace timeline">
            ${traceStages
              .map(
                (stage, index) => `
                  <div class="timeline-row">
                    <strong>${stage.name}</strong>
                    <div class="timeline-track">
                      <div class="timeline-fill" data-step="${index}" style="--fill-width: ${stage.fill};"></div>
                    </div>
                    <span class="copy-muted">${stage.latency}</span>
                  </div>
                `,
              )
              .join('')}
          </div>
        </div>

        <div>
          <div class="panel">
            <h3 style="margin-top: 0;">What you learn from traces</h3>
            <p class="copy-muted">Traces reveal which service owns the latency spike, whether retries are happening, and how upstream alarms connect to downstream failures.</p>
          </div>
          <div class="card" style="margin-top: 1rem;">
            <h3>Healthy vs slow vs error</h3>
            <p class="copy-muted">Green segments show normal request flow, yellow stages warn of slower processing, and red segments identify failure points or unhealthy dependencies.</p>
          </div>
          <div class="card" style="margin-top: 1rem;">
            <h3>Educational takeaway</h3>
            <p class="copy-muted">Use X-Ray after metrics and logs narrow the problem domain. It transforms a broad symptom into a precise root-cause investigation.</p>
          </div>
        </div>
      </div>
    </div>
  `

  container.append(section)

  const replayButton = section.querySelector<HTMLButtonElement>('#simulate-request')
  const serviceMap = section.querySelector<HTMLElement>('.service-map')
  const nodes = Array.from(section.querySelectorAll<HTMLElement>('.service-node'))
  const timelineFills = Array.from(section.querySelectorAll<HTMLElement>('.timeline-fill'))

  if (!replayButton || !serviceMap) {
    return
  }

  const replayTrace = (): void => {
    serviceMap.classList.remove('replay')
    nodes.forEach((node) => node.classList.remove('is-active'))
    timelineFills.forEach((fill) => fill.classList.remove('is-active'))

    void serviceMap.offsetWidth
    serviceMap.classList.add('replay')

    nodes.forEach((node, index) => {
      window.setTimeout(() => {
        node.classList.add('is-active')
        timelineFills[index]?.classList.add('is-active')
      }, 360 * index + 140)
    })

    window.setTimeout(() => {
      serviceMap.classList.remove('replay')
    }, 2200)
  }

  replayButton.addEventListener('click', replayTrace)
  replayTrace()
}
