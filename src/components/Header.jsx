import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartCount } from '../redux/slices/cartSlice.js'
import { fetchFavorites, logout } from '../redux/slices/userSlice.js'

const MENU = [
  { label: 'Home',  to: '/' },
  { label: 'Men',   to: '/men' },
  { label: 'Woman', to: '/woman' },
  { label: 'Kid',   to: '/kid' },
  { label: 'Sport', to: '/sport' },
  { label: 'Stores', to: '/stores' },
]

function Logo() {
  return (
    <Link to="/" className="logo d-flex align-items-center text-decoration-none">
      <span className="logo-mark"><i className="bi bi-box-seam"></i></span>
      <span className="logo-text">CYBERSOFT</span>
    </Link>
  )
}

export default function Header() {
  const cartCount = useSelector(selectCartCount)
  const email = useSelector((state) => state.user.email)
  const token = useSelector((state) => state.user.token)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (token) dispatch(fetchFavorites())
  }, [token, dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className="sticky-top">
      <div className="announce">
        Discover the new collection <Link to="/search">Shop now <i className="bi bi-arrow-right"></i></Link>
      </div>

      <div className="site-header">
        <div className="container-xl header-inner d-flex align-items-center">
          <div className="header-side d-flex align-items-center gap-2">
            <button
              type="button"
              className="icon-btn d-md-none"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>
            <Logo />
          </div>

          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            {MENU.map((item) => (
              <NavLink to={item.to} end className="menu-link" key={item.label} onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-side d-flex align-items-center justify-content-end gap-1">
            <Link to="/search" className="icon-btn" aria-label="Search">
              <i className="bi bi-search"></i>
            </Link>
            <Link
              to={email ? '/profile' : '/login'}
              className="icon-btn"
              aria-label={email ? 'Profile' : 'Login'}
              title={email || 'Login'}
            >
              <i className={`bi ${email ? 'bi-person-check' : 'bi-person'}`}></i>
            </Link>
            <Link to="/carts" className="icon-btn position-relative" aria-label="Cart">
              <i className="bi bi-bag"></i>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            {email ? (
              <button type="button" className="icon-btn" onClick={handleLogout} aria-label="Logout" title="Logout">
                <i className="bi bi-box-arrow-right"></i>
              </button>
            ) : (
              <Link to="/register" className="header-register d-none d-sm-inline-block">Register</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
