type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

type LogEntry = {
  readonly timestamp: string
  readonly level: LogLevel
  readonly service: string
  readonly message: string
}

const sampleLogs: readonly LogEntry[] = [
  { timestamp: '2025-02-20 09:25:14', level: 'INFO', service: 'orders-api', message: 'GET /orders completed in 118ms' },
  { timestamp: '2025-02-20 09:25:16', level: 'WARN', service: 'payments-worker', message: 'Retrying Stripe callback after timeout' },
  { timestamp: '2025-02-20 09:25:18', level: 'ERROR', service: 'orders-api', message: 'Lambda invocation exceeded configured memory threshold' },
  { timestamp: '2025-02-20 09:25:21', level: 'DEBUG', service: 'inventory-sync', message: 'Trace segment cached for downstream replay' },
  { timestamp: '2025-02-20 09:25:24', level: 'ERROR', service: 'orders-api', message: 'DependencyException: DynamoDB hot partition on customer-orders' },
  { timestamp: '2025-02-20 09:25:27', level: 'INFO', service: 'edge-router', message: 'POST /checkout forwarded to regional origin' },
]

const queryExample = `fields @timestamp, @message, @logStream\n| filter @message like /ERROR/\n| sort @timestamp desc\n| limit 20`

const matchesFilter = (entry: LogEntry, query: string): boolean => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return true
  }

  return [entry.level, entry.service, entry.message, entry.timestamp]
    .join(' ')
    .toLowerCase()
    .includes(normalized)
}

export const renderLogsInsightsSection = (container: HTMLElement): void => {
  const section = document.createElement('section')
  section.id = 'logs-insights'
  section.className = 'section reveal'

  section.innerHTML = `
    <div class="container">
      <span class="section-eyebrow">CloudWatch Logs Insights</span>
      <h2 class="section-title">
        <span class="icon-badge" aria-hidden="true">⌘</span>
        Filter noisy streams into useful evidence.
      </h2>
      <p class="section-intro">
        Logs Insights helps engineers search millions of log lines with purpose-built queries. During an incident, it becomes the bridge between a suspicious metric and the exact error messages behind it.
      </p>

      <div class="logs-layout">
        <div class="demo-shell" aria-labelledby="logs-demo-title">
          <div class="chart-title">
            <div>
              <h3 id="logs-demo-title" style="margin: 0;">Interactive log filter demo</h3>
              <p class="copy-muted" style="margin: 0.35rem 0 0;">Type a keyword or use presets to surface the relevant operational clues.</p>
            </div>
            <span class="inline-badge">Live sample stream</span>
          </div>
          <div class="log-toolbar">
            <label class="copy-muted" for="log-filter">Filter logs</label>
            <input id="log-filter" class="filter-input" type="text" placeholder="Try ERROR, WARN, DynamoDB, timeout..." aria-label="Filter log entries by keyword" />
          </div>
          <div class="pill-row" aria-label="Preset filters">
            <button class="filter-chip" type="button" data-filter="ERROR">Show Errors</button>
            <button class="filter-chip" type="button" data-filter="WARN">Show Warnings</button>
            <button class="filter-chip" type="button" data-filter="">Show All</button>
          </div>
          <p id="filter-status" class="copy-muted" aria-live="polite" style="margin-top: 1rem;"></p>
          <ul class="log-list" aria-label="Sample log entries"></ul>
        </div>

        <div>
          <div class="panel">
            <h3 style="margin-top: 0;">Typical investigation flow</h3>
            <p class="copy-muted">Start from a metric alarm, open the associated log groups, run a query that narrows the scope, and compare the resulting messages across time windows or services.</p>
          </div>
          <div class="panel" style="margin-top: 1rem;">
            <h3 style="margin-top: 0;">Sample Logs Insights query</h3>
            <pre class="code-block"><code>${queryExample}</code></pre>
          </div>
        </div>
      </div>
    </div>
  `

  container.append(section)

  const list = section.querySelector<HTMLUListElement>('.log-list')
  const input = section.querySelector<HTMLInputElement>('#log-filter')
  const status = section.querySelector<HTMLElement>('#filter-status')
  const presetButtons = section.querySelectorAll<HTMLButtonElement>('.filter-chip')

  if (!list || !input || !status) {
    return
  }

  const items = sampleLogs.map((entry) => {
    const item = document.createElement('li')
    item.className = 'log-entry'
    item.innerHTML = `
      <span class="log-level log-level--${entry.level}">${entry.level}</span>
      <strong>${entry.service}</strong>
      <div>
        <span class="copy-muted">${entry.timestamp}</span>
        <div>${entry.message}</div>
      </div>
    `
    list.append(item)
    return { element: item, entry }
  })

  const applyFilter = (query: string): void => {
    let visibleCount = 0

    items.forEach(({ element, entry }) => {
      const isMatch = matchesFilter(entry, query)
      element.classList.toggle('is-match', isMatch)
      element.classList.toggle('is-dimmed', !isMatch)
      if (isMatch) {
        visibleCount += 1
      }
    })

    const queryText = query.trim()
    status.textContent = queryText
      ? `${visibleCount} of ${items.length} log entries match “${queryText}”.`
      : `Showing all ${items.length} sample log entries.`
  }

  items.forEach(({ element }, index) => {
    window.setTimeout(() => {
      element.classList.add('is-visible')
    }, index * 140)
  })

  input.addEventListener('input', () => applyFilter(input.value))

  presetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filterValue = button.dataset.filter ?? ''
      input.value = filterValue
      applyFilter(filterValue)
    })
  })

  applyFilter('')
}
