import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard.jsx'
import ProductImage from '../components/ProductImage.jsx'
import { formatPrice } from '../utils/format.js'
import { addToCart } from '../redux/slices/cartSlice.js'
import { fetchProductById } from '../redux/slices/productSlice.js'

const PERKS = [
  { icon: 'bi-truck', text: 'Free shipping & fast delivery' },
  { icon: 'bi-arrow-repeat', text: 'Hassle-free returns' },
  { icon: 'bi-shield-check', text: 'Secure payments' },
]

export default function Detail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { detail: product, error } = useSelector((state) => state.product)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState(null)

  const handleAddToCart = () => {
    if (!selectedSize) {
      setMessage({ type: 'error', text: 'Vui lòng chọn size' })
      return
    }
    dispatch(addToCart({ product, size: selectedSize, quantity }))
    setMessage({ type: 'success', text: `Đã thêm ${quantity} sản phẩm (size ${selectedSize}) vào giỏ` })
  }

  useEffect(() => {
    dispatch(fetchProductById(id))
      .unwrap()
      .then(() => {
        setSelectedSize(null)
        setQuantity(1)
        setMessage(null)
        window.scrollTo(0, 0)
      })
      .catch(() => {})
  }, [dispatch, id])

  if (!product) {
    return (
      <p className={`text-center py-5 ${error ? 'text-danger' : ''}`}>
        {error ? `Không tải được sản phẩm: ${error}` : 'Loading...'}
      </p>
    )
  }

  const relatedProducts = product.relatedProducts ?? []
  const category = product.categories?.[0]?.category?.replaceAll('_', ' ')
  const stock = product.quantity ?? Infinity

  return (
    <>
      <section className="detail-section">
        <div className="container-xl">
          <nav className="breadcrumb-ui" aria-label="breadcrumb">
            <Link to="/">Home</Link>
            <i className="bi bi-chevron-right"></i>
            <Link to="/search">Shop</Link>
            <i className="bi bi-chevron-right"></i>
            <span className="text-capitalize">{product.name}</span>
          </nav>

          <div className="row g-4 g-lg-5">
            <div className="col-lg-6">
              <div className="detail-img-wrap">
                <ProductImage src={product.image} alt={product.name} seed={product.id} className="detail-img" key={product.id} />
              </div>
            </div>

            <div className="col-lg-6 detail-info">
              {category && <p className="eyebrow">{category}</p>}
              <h1 className="detail-name">{product.name}</h1>
              <div className="d-flex align-items-center gap-3 mb-3">
                <span className="detail-price">{formatPrice(product.price)}</span>
                {Number.isFinite(stock) && (
                  <span className="stock-badge">
                    <i className="bi bi-check-circle-fill"></i> {stock} in stock
                  </span>
                )}
              </div>
              <p className="detail-desc">{product.shortDescription}</p>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <p className="detail-size-label mb-0">Select size</p>
                {selectedSize && <span className="detail-size-picked">Size {selectedSize}</span>}
              </div>
              <div className="size-grid mb-4">
                {product.size.map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={`btn-size ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSize(s)
                      setMessage(null)
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="d-flex gap-3 flex-wrap">
                <div className="qty-stepper">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease"
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={quantity >= stock}
                    aria-label="Increase"
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
                <button type="button" className="btn-add-cart flex-grow-1" onClick={handleAddToCart}>
                  <i className="bi bi-bag-plus me-2"></i>Add to cart
                </button>
              </div>
              {message && (
                <p className={`detail-message ${message.type}`}>
                  {message.text}
                  {message.type === 'success' && (
                    <Link to="/carts" className="ms-2">View cart →</Link>
                  )}
                </p>
              )}

              <ul className="perks list-unstyled">
                {PERKS.map((p) => (
                  <li key={p.text}>
                    <i className={`bi ${p.icon}`}></i>
                    {p.text}
                  </li>
                ))}
              </ul>

              <details className="detail-more" open>
                <summary>Description</summary>
                <p>{product.description}</p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-section">
          <div className="container-xl">
            <p className="eyebrow">You may also like</p>
            <h2 className="related-title">Related Products</h2>
            <div className="row g-4">
              {relatedProducts.map((p) => (
                <div className="col-6 col-lg-3" key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
