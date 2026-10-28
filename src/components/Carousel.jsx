import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/format.js'
import ProductImage from './ProductImage.jsx'

export default function Carousel({ slides }) {
  const [index, setIndex] = useState(0)
  const total = slides.length

  const prev = () => setIndex((i) => (i - 1 + total) % total)
  const next = () => setIndex((i) => (i + 1) % total)

  useEffect(() => {
    if (total < 2) return
    const timer = setTimeout(() => setIndex((i) => (i + 1) % total), 5000)
    return () => clearTimeout(timer)
  }, [index, total])

  if (!total) return null

  return (
    <section className="hero">
      <div className="container-xl">
        <div className="hero-panel">
          <div className="hero-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {slides.map((p, i) => {
              const active = i === index
              const tab = active ? 0 : -1
              return (
                <div className={`hero-slide ${active ? 'active' : ''}`} key={p.id} aria-hidden={!active}>
                  <div className="row align-items-center g-0 h-100">
                    <div className="col-md-6 hero-info order-2 order-md-1">
                      <p className="eyebrow">Move differently</p>
                      <h1 className="hero-title">{p.name}</h1>
                      <p className="hero-desc">
                        Modern sneakers designed for everyday comfort, performance and style.
                      </p>
                      <div className="d-flex align-items-center gap-4 flex-wrap justify-content-center justify-content-md-start">
                        <Link to={`/detail/${p.id}`} className="btn-pill" tabIndex={tab}>
                          Buy now <i className="bi bi-arrow-right"></i>
                        </Link>
                        <span className="hero-price">{formatPrice(p.price)}</span>
                      </div>
                    </div>
                    <div className="col-md-6 order-1 order-md-2">
                      <Link to={`/detail/${p.id}`} className="hero-img-wrap" tabIndex={tab}>
                        <ProductImage src={p.image} alt={p.name} seed={p.id} className="hero-img" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="hero-controls">
            <button type="button" className="hero-arrow" onClick={prev} aria-label="Previous">
              <i className="bi bi-arrow-left"></i>
            </button>
            <div className="hero-dots">
              {slides.map((p, i) => (
                <button
                  type="button"
                  key={p.id}
                  className={`hero-dot ${i === index ? 'active' : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button type="button" className="hero-arrow" onClick={next} aria-label="Next">
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
