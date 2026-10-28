import { Link } from 'react-router-dom'

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'Men', to: '/men' },
      { label: 'Woman', to: '/woman' },
      { label: 'Kid', to: '/kid' },
      { label: 'Sport', to: '/sport' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' },
      { label: 'Profile', to: '/profile' },
      { label: 'Cart', to: '/carts' },
    ],
  },
  {
    title: 'Support',
    links: [{ label: 'Stores', to: '/stores' }, { label: 'About' }, { label: 'Contact' }, { label: 'Help' }],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-xl">
        <div className="row g-4">
          <div className="col-lg-5">
            <Link to="/" className="footer-logo">CYBERSOFT</Link>
            <p className="footer-desc">
              Modern footwear for everyday comfort, performance and style.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div className="col-4 col-lg-2" key={col.title}>
              <h4 className="footer-title">{col.title}</h4>
              <ul className="list-unstyled mb-0">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className="footer-link">{link.label}</Link>
                    ) : (
                      <span className="footer-link">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container-xl">
        <div className="footer-bottom">
          © 2022 Cybersoft All Rights Reserved | Design Theme by Trương Tấn Khải.
        </div>
      </div>
    </footer>
  )
}
