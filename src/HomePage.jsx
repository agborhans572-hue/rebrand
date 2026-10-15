import { ShieldCheck, ClipboardList, Truck, TestTube2, Info } from 'lucide-react'
import Catalog from './Catalog.jsx'
import ResponsiveImage from './ResponsiveImage.jsx'
import ResearchResources from './ResearchResources.jsx'
import HeroMoleculeBackground from './HeroMoleculeBackground.jsx'
import { appPath } from './appPath.js'
import './home.css'
const routePaths = { shop: appPath('/shop/'), coaLibrary: appPath('/coa-library/') }
const followShop = (event, onGate) => { if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); onGate() }

const researchBenefits = [
  {
    title: '99% Purity',
    copy: 'Independently tested for purity and identity',
    icon: ShieldCheck,
  },
  {
    title: 'COA Every Batch',
    copy: 'Searchable Certificates of Analysis online',
    icon: ClipboardList,
  },
  {
    title: 'Fast U.S. Shipping',
    copy: 'Quick, discrete, and reliable delivery',
    icon: Truck,
  },
  {
    title: 'Independently Batch Tested in U.S.A.',
    copy: 'Visit our COA library',
    icon: TestTube2,
  },
]

// Pixel regions in the original 1024 × 618 artwork. Each sprite keeps its
// transparent edges and proportions without downloading new product artwork.
const heroBottles = [
  { name: 'BPC-157', x: 4, y: 36, width: 250, height: 562 },
  { name: 'GHK-Cu', x: 270, y: 118, width: 170, height: 385 },
  { name: 'GLP-3 (R)', x: 456, y: 156, width: 181, height: 412 },
  { name: 'MOTS-C', x: 654, y: 144, width: 132, height: 299 },
  { name: 'BPC-157/TB-500', x: 810, y: 181, width: 146, height: 331 },
]
const heroBottleArtwork = `${import.meta.env.BASE_URL}assets/hero-vials.png`

function HeroBottleOrbit() {
  return (
    <div
      className="hero-visual"
      style={{ '--hero-bottle-artwork': `url("${heroBottleArtwork}")` }}
    >
      <div className="hero-orbit-scene" aria-hidden="true">
        <div className="hero-orbit-tilt">
          <div className="hero-orbit-ring">
            {heroBottles.map(({ name, x, y, width, height }, index) => (
              <div className="hero-orbit-position" key={name} style={{ '--phase': `${index * 72}deg` }}>
                <div
                  className="hero-orbit-bottle"
                  style={{
                    aspectRatio: `${width} / ${height}`,
                    backgroundSize: `${1024 / width * 100}% auto`,
                    backgroundPosition: `${x / (1024 - width) * 100}% ${y / (618 - height) * 100}%`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <ResponsiveImage
        className="hero-orbit-static"
        src="/assets/hero-vials.png"
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        sizes="(max-width: 560px) 90vw, 587px"
      />
    </div>
  )
}

function Hero({ onGate }) {
  return (
    <section className="hero" id="home">
      <HeroMoleculeBackground />
      <div className="hero-inner">
        <div className="hero-main">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light">PEPTALITH</p>
            <h1>
              <span>ReSeARCH PePTIDeS</span>
              <strong>YOU CAN TRUST.</strong>
            </h1>
            <p className="hero-description">
              Every batch is independently tested in the USA, documented, and backed by transparent
              Certificates of Analysis so researchers can purchase with confidence.
            </p>
            <div className="hero-buttons">
              <a
                className="button button-primary"
                href={routePaths.shop}
                onClick={(event) => {
                  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                  event.preventDefault()
                  onGate()
                }}
              >SHOP PEPTIDES</a>
              <a className="button button-light" href="#transparency">VERIFY A COA</a>
            </div>
          </div>
          <HeroBottleOrbit />
        </div>

        <div className="benefit-grid">
          {researchBenefits.map(({ title, copy, icon: Icon }) => (
            <article className="benefit-card" key={title}>
              <Icon aria-hidden="true" />
              <div>
                <h2>{title}</h2>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function TopicalEvent({ onGate }) {
  return (
    <section className="topical-event">
      <div className="topical-inner">
        <div className="topical-product">
          <ResponsiveImage src="/assets/topical-event.png" alt="Peptalith topical discovery collection" />
        </div>
        <div className="topical-copy">
          <p className="eyebrow">INTRODUCING</p>
          <h2>PEPTALITH — TOPICAL DISCOVeRY eVeNT</h2>
          <p className="event-offer">
            For a limited period — <strong>Receive your Complimentary Peptalith Discovery Collection</strong>
            {' '}with qualifying research orders of <strong>$500 or more*</strong>
          </p>
          <small>*after discount, before fees and taxes</small>
          <ResponsiveImage
            className="topical-mobile-product"
            src="/assets/topical-event.png"
            alt="Peptalith topical discovery collection"
          />
          <a className="topical-link" href={routePaths.shop} onClick={(event) => followShop(event, onGate)}>
            Discover the Peptalith Topical Format System.
          </a>
          <p>Our uniquely architected topical research platform, designed exclusively by Peptalith.</p>
        </div>
      </div>
    </section>
  )
}

function Welcome() {
  return (
    <section className="welcome section-pad">
      <div className="section-inner welcome-grid">
        <div className="welcome-copy">
          <p className="eyebrow">WELCOME TO</p>
          <h2>Peptalith</h2>
          <p><strong>Where Science Meets Excellence—and Research Has No Limits.</strong></p>
          <p>
            Your research deserves more than the ordinary. It deserves the best. At Peptalith, we don’t just supply peptides—we deliver game-changing quality, unbeatable
            pricing, and world-class service to fuel the breakthroughs of tomorrow.
          </p>
          <p>
            Tired of me-too suppliers? We’re not like them. With 99%+ purity guaranteed,
            industry-leading compliance, and a customer-first approach, we’re setting a new benchmark
            for peptide excellence. Every peptide, every vial, every time—precision you can trust,
            prices you can count on, and service that stands out.
          </p>
          <p>
            This is where serious researchers come to win. Step into the future of science with Peptalith—the partner you’ve been waiting for.
          </p>
        </div>
        <aside className="usage-card">
          <Info aria-hidden="true" />
          <div>
            <h3>Product Usage: For Research Use Only</h3>
            <h4>Not for Human or Veterinary Use</h4>
            <p>
              Peptalith products are supplied to qualified research professionals and
              institutional users for in vitro laboratory research only. KYC verification is required
              prior to order fulfillment, and we reserve the right to refuse orders that do not meet
              buyer qualification criteria. These products are not drugs, foods, cosmetics, or dietary
              supplements, have not been evaluated by the FDA, and are not intended for human or animal
              use. Any such use is prohibited and may violate federal, state, or local law. By purchasing,
              the buyer represents and warrants that the product will be used solely for in vitro research.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}

function DiscountSection({ onGate }) {
  return (
    <section className="discount-section">
      <HeroMoleculeBackground />
      <div className="section-inner discount-grid">
        <div className="discount-column">
          <p className="eyebrow eyebrow-light">ORDER MORE, SAVE MORE</p>
          <h2>DISCOUNT STRUCTURe</h2>
          <h3>Unlock Exclusive Savings with Our Unique Discount Structure!</h3>
          <p>Why settle for less when you can save more—every time?</p>
          <p>
            At Peptalith, we reward your commitment to groundbreaking research with a
            straightforward, unbeatable discount structure:
          </p>
          <p><strong>The number of vials you order per product = Your Discount!</strong></p>
          <ul>
            <li>2 vials = 2% off</li>
            <li>5 vials = 5% off</li>
            <li>10 vials = 10% off</li>
            <li>Up to a massive 15% off for 15+ vials of the same product!</li>
          </ul>
        </div>
        <div className="discount-column freebies">
          <p className="eyebrow eyebrow-light">FREEBIES FOR</p>
          <h2>Researchers Who Go Big</h2>
          <ul>
            <li><strong>Orders over $75:</strong> Receive a FREE Vial Vault, our sleek, secure container to store your research vials.</li>
            <li><strong>Orders of $175 or more after discounts:</strong> Free Shipping on your entire order—no hassle, no hidden fees.</li>
          </ul>
          <a className="button button-primary" href={routePaths.shop} onClick={(event) => followShop(event, onGate)}>SHOP NOW</a>
        </div>
      </div>
    </section>
  )
}

function Transparency({ onNavigate }) {
  return (
    <section className="transparency section-pad" id="transparency">
      <div className="section-inner transparency-grid">
        <div className="coa-visual">
          <ResponsiveImage src="/assets/peptalith-coa-montage.png" alt="Peptalith certificate of analysis documents" />
        </div>
        <div className="transparency-copy">
          <p className="eyebrow">PURE SCIENCE</p>
          <h2>TRANSPARENT RESULTS</h2>
          <p>
            At Peptalith, we are committed to providing the clarity and confidence researchers
            need. Every batch of our peptides undergoes rigorous third-party testing in the USA, with
            detailed Certificates of Analysis (COAs) available for verification. We invite you to visit
            our Certifications page, where you can <strong>easily search for your batch number and access
            its COA.</strong> This commitment to transparency ensures you have the data you need to trust
            our products and focus on advancing your research.
          </p>
          <a
            className="button button-outline-blue"
            href={routePaths.coaLibrary}
            onClick={(event) => { event.preventDefault(); onNavigate('coaLibrary') }}
          >EXPLORE CERTIFICATIONS</a>
        </div>
      </div>
    </section>
  )
}

export default function HomePage({ onShop, onProduct, onNavigate, onAddToCart }) {
  return (
    <>
      <Hero onGate={onShop} />
      <TopicalEvent onGate={onShop} />
      <Welcome />
      <Catalog onProduct={onProduct} onShop={onShop} onAddToCart={onAddToCart} />
      <DiscountSection onGate={onShop} />
      <Transparency onNavigate={onNavigate} />
      <ResearchResources />
    </>
  )
}
