type Takeaway = {
  readonly icon: string
  readonly name: string
  readonly description: string
  readonly points: readonly string[]
  readonly docsUrl: string
}

const takeaways: readonly Takeaway[] = [
  {
    icon: '☁️',
    name: 'Amazon CloudWatch',
    description: 'The operational heartbeat for metrics, alarms, and dashboards.',
    points: ['Tracks infrastructure and application health', 'Supports alarm-driven alerting', 'Provides shared dashboards for teams'],
    docsUrl: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html',
  },
  {
    icon: '🔎',
    name: 'CloudWatch Logs Insights',
    description: 'A fast query layer for turning raw logs into evidence.',
    points: ['Filters millions of events with targeted queries', 'Highlights errors, warnings, and anomalies', 'Accelerates incident investigation workflows'],
    docsUrl: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html',
  },
  {
    icon: '🕸️',
    name: 'AWS X-Ray',
    description: 'Distributed traces that expose latency and dependency issues.',
    points: ['Maps service-to-service request paths', 'Shows segment latency and error hotspots', 'Clarifies root cause across microservices'],
    docsUrl: 'https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html',
  },
]

export const renderTakeawaysSection = (container: HTMLElement): void => {
  const section = document.createElement('section')
  section.id = 'takeaways'
  section.className = 'section reveal'

  const year = new Date().getFullYear()

  section.innerHTML = `
    <div class="container">
      <span class="section-eyebrow">Key takeaways</span>
      <h2 class="section-title">
        <span class="icon-badge" aria-hidden="true">✓</span>
        Turn observability theory into a repeatable habit.
      </h2>
      <p class="section-intro">
        The fastest investigations use all three pillars together. Start with symptoms, gather evidence, then confirm the exact root cause path.
      </p>

      <div class="takeaways-grid" aria-label="Observability service summaries">
        ${takeaways
          .map(
            (item) => `
              <article class="takeaway-card">
                <div class="icon-badge" aria-hidden="true">${item.icon}</div>
                <h3>${item.name}</h3>
                <p class="copy-muted">${item.description}</p>
                <ul>
                  ${item.points.map((point) => `<li>${point}</li>`).join('')}
                </ul>
                <a class="button button-secondary" href="${item.docsUrl}" target="_blank" rel="noreferrer noopener">Open AWS docs</a>
              </article>
            `,
          )
          .join('')}
      </div>

      <footer class="footer">
        <p>Built as a static educational experience for AWS observability learning.</p>
        <p>© ${year} obs-control-tower · Designed with Vite, TypeScript, semantic HTML, and modern CSS.</p>
      </footer>
    </div>
  `

  container.append(section)
}
