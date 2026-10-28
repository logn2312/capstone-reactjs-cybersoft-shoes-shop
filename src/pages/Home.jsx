import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Carousel from '../components/Carousel.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductImage from '../components/ProductImage.jsx'
import Recommendations from '../components/Recommendations.jsx'
import { fetchProducts } from '../redux/slices/productSlice.js'

const CATEGORIES = [
  { label: "Men's Sneakers", to: '/men', imageId: 6 },
  { label: "Women's Sneakers", to: '/woman', imageId: 7 },
  { label: 'Nike', to: '/nike', imageId: 9 },
  { label: 'Adidas', to: '/adidas', imageId: 12 },
]

const SERVICES = [
  { icon: 'bi-truck', title: 'Free Shipping', text: 'Fast delivery to your door' },
  { icon: 'bi-arrow-repeat', title: 'Easy Returns', text: 'Hassle-free returns' },
  { icon: 'bi-shield-check', title: 'Secure Payments', text: 'Safe & encrypted' },
  { icon: 'bi-headset', title: '24/7 Support', text: "We're here to help" },
]

const TECH_FEATURES = ['Breathable Knit', 'Responsive Cushioning', 'Durable Outsole']

export default function Home() {
  const dispatch = useDispatch()
  const { list: products, loading, error } = useSelector((state) => state.product)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  if (!products.length) {
    return (
      <p className={`text-center py-5 ${error ? 'text-danger' : ''}`}>
        {loading ? 'Loading...' : error ? `Không tải được sản phẩm: ${error}` : 'Chưa có sản phẩm'}
      </p>
    )
  }

  const slides = products.slice(0, 3)
  const featured = products.slice(0, 8)
  const techProduct = products[4] ?? products[0]
  const imageOf = (id) => products.find((p) => p.id === id)?.image

  return (
    <>
      <Carousel slides={slides} />

      <section className="container-xl home-block">
        <div className="row g-3">
          {CATEGORIES.map((c) => (
            <div className="col-6 col-lg-3" key={c.to}>
              <Link to={c.to} className="category-tile">
                <span className="category-name">{c.label}</span>
                <span className="category-explore">
                  Explore <i className="bi bi-arrow-right"></i>
                </span>
                {imageOf(c.imageId) && <img src={imageOf(c.imageId)} alt="" className="category-img" />}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container-xl home-block">
        <div className="section-head">
          <div>
            <p className="eyebrow">Popular right now</p>
            <h2 className="section-title">Product Feature</h2>
          </div>
          <Link to="/search" className="btn-pill btn-pill-outline btn-pill-sm">
            View all <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
        <div className="row g-4">
          {featured.map((p) => (
            <div className="col-6 col-lg-3" key={p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <Recommendations className="container-xl home-block" />

      <section className="container-xl home-block">
        <div className="services">
          {SERVICES.map((s) => (
            <div className="service" key={s.title}>
              <i className={`bi ${s.icon}`}></i>
              <div>
                <p className="service-title">{s.title}</p>
                <p className="service-text">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-xl home-block pb-5">
        <div className="tech-banner">
          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <p className="eyebrow eyebrow-light">Our technology</p>
              <h2 className="tech-title">Engineered for All-Day Comfort</h2>
              <p className="tech-text">
                Advanced cushioning, breathable materials and lightweight design — so you can go further in
                every step.
              </p>
              <Link to={`/detail/${techProduct.id}`} className="btn-pill btn-pill-light">
                Learn more <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="col-md-6 position-relative">
              <ProductImage src={techProduct.image} alt={techProduct.name} seed={techProduct.id} className="tech-img" />
              <ul className="tech-features list-unstyled">
                {TECH_FEATURES.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
