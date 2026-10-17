import './policy.css'
import { policies } from './policyData.js'
import ResearchResources from './ResearchResources.jsx'

export default function PolicyPage({ type }) {
  const policy = policies[type]
  if (!policy) return null
  return (
    <article className="policy-page">
      <header>
        <span>{policy.eyebrow}</span>
        <h1>{policy.title}</h1>
        {policy.subtitle && <p>{policy.subtitle}</p>}
        <p>Effective {policy.effectiveDate || 'July 20, 2026'}{policy.updatedDate ? ` · Updated ${policy.updatedDate}` : ''}</p>
      </header>
      <div className="policy-content">
        {policy.sections.map(([title, body]) => (
          <section key={title}>
            <h2>{title}</h2>
            {(Array.isArray(body) ? body : [body]).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </section>
        ))}
        {policy.relatedLinks && <nav aria-label="Related policies">
          <h2>Related policies</h2>
          <ul>{policy.relatedLinks.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
        </nav>}
        <section>
          <h2>Contact</h2>
          <p>Questions may be sent to <a href="mailto:info@peptalith.com">info@peptalith.com</a>.</p>
        </section>
      </div>
      <ResearchResources products={false} />
    </article>
  )
}
