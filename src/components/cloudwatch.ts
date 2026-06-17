type MetricSample = {
  readonly label: string
  readonly value: number
}

type ChartPoint = MetricSample & {
  readonly x: number
  readonly y: number
}

const metricSeries: readonly MetricSample[] = [
  { label: '09:00', value: 32 },
  { label: '09:05', value: 38 },
  { label: '09:10', value: 44 },
  { label: '09:15', value: 58 },
  { label: '09:20', value: 67 },
  { label: '09:25', value: 82 },
  { label: '09:30', value: 76 },
  { label: '09:35', value: 69 },
  { label: '09:40', value: 54 },
]

const threshold = 70

const keyConcepts = [
  {
    title: 'Metrics build your first health signal',
    body: 'Metrics turn application and infrastructure behavior into time-series data so you can chart trends, compare periods, and spot abnormal patterns quickly.',
  },
  {
    title: 'Alarms convert thresholds into action',
    body: 'CloudWatch alarms watch one or more metrics and change state when thresholds or anomaly conditions are met, helping operators react before users feel impact.',
  },
  {
    title: 'Dashboards keep teams aligned',
    body: 'Dashboards combine metrics, logs, and status widgets into a shared operational view for service owners, incident commanders, and leadership.',
  },
] as const

const createChartPoint = (sample: MetricSample, index: number, total: number): ChartPoint => {
  const width = 640
  const height = 240
  const paddingX = 30
  const paddingY = 22
  const usableWidth = width - paddingX * 2
  const usableHeight = height - paddingY * 2
  const x = paddingX + (usableWidth / (total - 1)) * index
  const y = paddingY + usableHeight - (sample.value / 100) * usableHeight

  return {
    ...sample,
    x,
    y,
  }
}

export const renderCloudWatchSection = (container: HTMLElement): void => {
  const section = document.createElement('section')
  section.id = 'cloudwatch'
  section.className = 'section reveal'

  const chartPoints = metricSeries.map((sample, index) => createChartPoint(sample, index, metricSeries.length))
  const pathData = chartPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const thresholdY = 22 + (196 - (threshold / 100) * 196)
  const alarmPoint = chartPoints.find((point) => point.value > threshold)

  section.innerHTML = `
    <div class="container">
      <span class="section-eyebrow">Amazon CloudWatch</span>
      <h2 class="section-title">
        <span class="icon-badge" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 16.5a3.5 3.5 0 1 1 0-7c.34 0 .66.05.96.14A5.5 5.5 0 0 1 17 7.5a4.5 4.5 0 1 1 .5 9H6Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        Detect issues with metrics, alarms, and dashboards.
      </h2>
      <p class="section-intro">
        CloudWatch gives operations teams a real-time pulse on infrastructure and application health. Use metrics to understand normal behavior, alarms to flag risk, and dashboards to tell the story of an incident as it unfolds.
      </p>

      <div class="card-grid" aria-label="CloudWatch capability overview">
        <article class="card">
          <h3>Metrics</h3>
          <p class="copy-muted">Capture CPU, memory, latency, request count, and custom business signals as time-series data.</p>
        </article>
        <article class="card">
          <h3>Alarms</h3>
          <p class="copy-muted">Trigger alerting workflows when thresholds, anomalies, or missing data indicate elevated risk.</p>
        </article>
        <article class="card">
          <h3>Dashboards</h3>
          <p class="copy-muted">Combine visual widgets into a shared control plane for engineers, SREs, and stakeholders.</p>
        </article>
      </div>

      <div class="metric-layout">
        <div class="demo-shell chart-shell" aria-labelledby="chart-title">
          <div class="chart-title">
            <div>
              <h3 id="chart-title" style="margin: 0;">CPU utilization alarm demo</h3>
              <p class="copy-muted" style="margin: 0.35rem 0 0;">A CloudWatch metric can reveal an emerging workload issue before users report it.</p>
            </div>
            <div class="alarm-badge" aria-live="polite">
              <span aria-hidden="true">⚠</span>
              Alarm state: ALARM
            </div>
          </div>
          <svg viewBox="0 0 640 240" role="img" aria-label="Animated line chart of CPU utilization crossing an alarm threshold">
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#ffb347" />
                <stop offset="100%" stop-color="#4ea6ff" />
              </linearGradient>
            </defs>
            ${[20, 40, 60, 80].map((value) => {
              const y = 22 + (196 - (value / 100) * 196)
              return `<line x1="30" y1="${y}" x2="610" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />`
            }).join('')}
            <line class="threshold-line" x1="30" y1="${thresholdY}" x2="610" y2="${thresholdY}" />
            <text x="612" y="${thresholdY + 4}" fill="#ffc8bf" font-size="12">70%</text>
            <path class="metric-line" d="${pathData}" stroke="url(#metricGradient)" />
            ${chartPoints
              .map(
                (point, index) => `
                  <g class="metric-point-group" tabindex="0" aria-label="${point.label} CPU ${point.value} percent">
                    <circle class="metric-point" cx="${point.x}" cy="${point.y}" r="6" style="animation-delay: ${index * 0.18}s;" />
                    <g class="point-tooltip" transform="translate(${point.x - 34} ${Math.max(point.y - 48, 10)})">
                      <rect width="68" height="34" rx="10" fill="#0d141c" stroke="rgba(255,255,255,0.12)" />
                      <text x="34" y="15" text-anchor="middle" fill="#f5f7fa" font-size="12">${point.label}</text>
                      <text x="34" y="28" text-anchor="middle" fill="#ff9900" font-size="12">${point.value}%</text>
                    </g>
                  </g>
                `,
              )
              .join('')}
            ${chartPoints
              .map(
                (point) => `
                  <text x="${point.x}" y="226" text-anchor="middle" fill="rgba(255,255,255,0.68)" font-size="12">${point.label}</text>
                `,
              )
              .join('')}
            ${alarmPoint
              ? `
                <g transform="translate(${alarmPoint.x - 8} ${alarmPoint.y - 34})" aria-hidden="true">
                  <path d="M8 0L16 14H0L8 0Z" fill="#d13212" />
                  <text x="8" y="11" text-anchor="middle" fill="#fff" font-size="10">!</text>
                </g>
              `
              : ''}
          </svg>
          <div class="chart-legend">
            <span><span class="legend-dot metric"></span> CPU utilization metric</span>
            <span><span class="legend-dot threshold"></span> Alarm threshold</span>
            <span><span class="legend-dot success"></span> Pulse points = fresh samples</span>
          </div>
        </div>

        <div>
          <div class="panel">
            <h3 style="margin-top: 0;">Why CloudWatch matters</h3>
            <p class="copy-muted">When a metric rises above a known safe limit, operators can pivot into logs and traces with context instead of guessing where to start.</p>
          </div>
          <div class="concept-list" aria-label="CloudWatch key concepts">
            ${keyConcepts
              .map(
                (concept, index) => `
                  <article class="expandable-card card">
                    <button class="expandable-trigger" aria-expanded="${index === 0}" aria-controls="cw-panel-${index}" id="cw-trigger-${index}">
                      <span>${concept.title}</span>
                      <span aria-hidden="true">▾</span>
                    </button>
                    <div class="expandable-panel" id="cw-panel-${index}" role="region" aria-labelledby="cw-trigger-${index}" ${index === 0 ? '' : 'hidden'}>
                      <p>${concept.body}</p>
                    </div>
                  </article>
                `,
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  `

  container.append(section)

  const line = section.querySelector<SVGPathElement>('.metric-line')
  if (line) {
    const length = line.getTotalLength()
    line.style.strokeDasharray = `${length}`
    line.style.strokeDashoffset = `${length}`
    requestAnimationFrame(() => line.classList.add('animate'))
  }

  const triggers = section.querySelectorAll<HTMLButtonElement>('.expandable-trigger')
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panelId = trigger.getAttribute('aria-controls')
      if (!panelId) {
        return
      }

      const panel = section.querySelector<HTMLElement>(`#${panelId}`)
      if (!panel) {
        return
      }

      const expanded = trigger.getAttribute('aria-expanded') === 'true'
      trigger.setAttribute('aria-expanded', String(!expanded))
      panel.hidden = expanded
    })
  })
}
