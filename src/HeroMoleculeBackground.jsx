const artworkUrl = `${import.meta.env.BASE_URL}assets/hero-molecules-white.webp`

export default function HeroMoleculeBackground() {
  return (
    <div className="hero-molecule-background" aria-hidden="true">
      <div
        className="hero-molecule-image hero-molecule-drift"
        style={{ backgroundImage: `url("${artworkUrl}")` }}
      />
      <div className="hero-molecule-light hero-molecule-drift" />
    </div>
  )
}
