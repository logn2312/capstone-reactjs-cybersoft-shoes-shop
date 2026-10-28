const SHOE = 'https://shop.cyberlearn.vn/images/nike-air-max-97.png'

export default function AuthLayout({ eyebrow, title, subtitle, wide = false, children }) {
  return (
    <section className="auth-page">
      <div className="container-xl">
        <div className={`auth-card ${wide ? 'auth-card-wide' : ''}`}>
          <div className="auth-visual d-none d-lg-flex">
            <p className="eyebrow eyebrow-light">Cybersoft shoes</p>
            <h2>Step into comfort.</h2>
            <img src={SHOE} alt="" />
          </div>
          <div className="auth-body">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="auth-title">{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
