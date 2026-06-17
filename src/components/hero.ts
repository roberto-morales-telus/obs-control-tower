export const renderHeroSection = (container: HTMLElement): void => {
  const section = document.createElement('section')
  section.id = 'hero'
  section.className = 'section hero reveal'

  section.innerHTML = `
    <div class="container hero-grid">
      <div>
        <span class="section-eyebrow">AWS-inspired learning experience</span>
        <h1>Understand observability from metrics to traces.</h1>
        <p>
          Explore how Amazon CloudWatch, CloudWatch Logs Insights, and AWS X-Ray work together to help teams detect,
          investigate, and resolve production issues faster.
        </p>
        <div class="badge-row" aria-label="Core AWS observability services">
          <span class="feature-badge">☁️ CloudWatch</span>
          <span class="feature-badge">🔎 Logs Insights</span>
          <span class="feature-badge">🕸️ X-Ray</span>
        </div>
        <div class="pill-row" style="margin-top: 1.5rem;">
          <a class="button button-primary" href="#cloudwatch">Explore the Pillars</a>
          <a class="button button-secondary" href="#workflow">See the workflow</a>
        </div>
        <div class="stat-grid" aria-label="Observability outcomes">
          <article class="stat-card">
            <span class="stat-label">Detect early</span>
            <strong>Metrics</strong>
            <p class="copy-muted">Watch fleet health, latency, and saturation in near real time.</p>
          </article>
          <article class="stat-card">
            <span class="stat-label">Investigate deeply</span>
            <strong>Logs</strong>
            <p class="copy-muted">Filter noise and isolate the exact signals behind incidents.</p>
          </article>
          <article class="stat-card">
            <span class="stat-label">Trace root cause</span>
            <strong>Requests</strong>
            <p class="copy-muted">Follow every hop to pinpoint slow or failing dependencies.</p>
          </article>
        </div>
      </div>
      <div class="hero-metrics" aria-hidden="true">
        <div class="metric-orb"></div>
        <div class="metric-chip">
          <div>
            <strong>CPU 82%</strong>
            <small>Alarm threshold crossed</small>
          </div>
        </div>
        <div class="metric-chip">
          <div>
            <strong>ERROR 17</strong>
            <small>Insights query matched</small>
          </div>
        </div>
        <div class="metric-chip">
          <div>
            <strong>Trace 642ms</strong>
            <small>Latency spike in Lambda</small>
          </div>
        </div>
      </div>
    </div>
  `

  container.append(section)
}
