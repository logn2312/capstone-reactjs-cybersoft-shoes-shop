import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { changeQuantity, removeFromCart } from '../redux/slices/cartSlice.js'
import { order } from '../services/api.js'
import ProductImage from '../components/ProductImage.jsx'
import { formatPrice } from '../utils/format.js'

const keyOf = (item) => `${item.id}-${item.size}`

export default function Carts() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)
  const email = useSelector((state) => state.user.email)
  const [selected, setSelected] = useState(() => items.map(keyOf))
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const selectedItems = items.filter((i) => selected.includes(keyOf(i)))
  const allSelected = items.length > 0 && selectedItems.length === items.length
  const selectedCount = selectedItems.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const toggleAll = () => setSelected(allSelected ? [] : items.map(keyOf))
  const toggleOne = (key) =>
    setSelected((s) => (s.includes(key) ? s.filter((x) => x !== key) : [...s, key]))

  const removeItem = (item) => {
    dispatch(removeFromCart({ id: item.id, size: item.size }))
    setSelected((s) => s.filter((x) => x !== keyOf(item)))
  }

  const submitOrder = async () => {
    if (!email) {
      navigate('/login', { state: { from: '/carts' } })
      return
    }

    const orderDetail = selectedItems.map((i) => ({ productId: String(i.id), quantity: i.quantity }))

    setSubmitting(true)
    setMessage(null)
    try {
      await order({ email, orderDetail })
      selectedItems.forEach((i) => dispatch(removeFromCart({ id: i.id, size: i.size })))
      setSelected([])
      setMessage({ type: 'success', text: 'Đặt hàng thành công!' })
    } catch (err) {
      setMessage({ type: 'error', text: `Đặt hàng thất bại: ${err.message}` })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-section pt-4">
      <div className="container-xl">
        <div className="page-head">
          <p className="eyebrow">Your bag</p>
          <h1 className="page-title mb-0">
            Shopping Cart <span className="title-count">({items.length})</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-bag"></i>
            <h2>Your cart is empty</h2>
            {message?.type === 'success' ? (
              <p className="detail-message success">
                {message.text} <Link to="/profile">Xem đơn hàng →</Link>
              </p>
            ) : (
              <p>Looks like you haven't added anything yet.</p>
            )}
            <Link to="/search" className="btn-pill">
              Continue shopping <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <label className="cart-select-all">
                <input type="checkbox" className="check-ui" checked={allSelected} onChange={toggleAll} />
                Select all ({items.length})
              </label>

              <ul className="cart-list list-unstyled">
                {items.map((item) => (
                  <li className="cart-item" key={keyOf(item)}>
                    <input
                      type="checkbox"
                      className="check-ui"
                      checked={selected.includes(keyOf(item))}
                      onChange={() => toggleOne(keyOf(item))}
                      aria-label={`Select ${item.name}`}
                    />
                    <Link to={`/detail/${item.id}`} className="cart-thumb">
                      <ProductImage src={item.image} alt={item.name} seed={item.id} />
                    </Link>

                    <div className="cart-info">
                      <Link to={`/detail/${item.id}`} className="cart-name">{item.name}</Link>
                      <p className="cart-meta">
                        Size {item.size} · {formatPrice(item.price)}
                      </p>
                      <div className="qty-stepper qty-stepper-sm">
                        <button
                          type="button"
                          onClick={() => dispatch(changeQuantity({ id: item.id, size: item.size, delta: -1 }))}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease"
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => dispatch(changeQuantity({ id: item.id, size: item.size, delta: 1 }))}
                          aria-label="Increase"
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>

                    <div className="cart-right">
                      <button type="button" className="icon-btn" onClick={() => removeItem(item)} aria-label="Delete" title="Delete">
                        <i className="bi bi-trash3"></i>
                      </button>
                      <p className="cart-total">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-4">
              <aside className="summary-card">
                <h2 className="summary-title">Order summary</h2>
                <dl className="summary-rows">
                  <div>
                    <dt>Selected items</dt>
                    <dd>{selectedCount}</dd>
                  </div>
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>
                  <div>
                    <dt>Shipping</dt>
                    <dd>Free</dd>
                  </div>
                  <div className="summary-total">
                    <dt>Total</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  className="btn-pill w-100"
                  disabled={selectedItems.length === 0 || submitting}
                  onClick={submitOrder}
                >
                  {submitting ? 'Submitting...' : email ? 'Submit order' : 'Login to order'}
                </button>
                {selectedItems.length === 0 && <p className="summary-note">Chọn ít nhất 1 sản phẩm để đặt hàng</p>}
                {message && <p className={`detail-message ${message.type}`}>{message.text}</p>}

                <Link to="/search" className="summary-link">
                  <i className="bi bi-arrow-left"></i> Continue shopping
                </Link>
              </aside>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
