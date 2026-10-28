import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormInput from '../components/FormInput.jsx'
import GenderRadio from '../components/GenderRadio.jsx'
import Pagination from '../components/Pagination.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductImage from '../components/ProductImage.jsx'
import { fetchFavorites, fetchProfile, saveProfile } from '../redux/slices/userSlice.js'
import { formatPrice } from '../utils/format.js'

const PAGE_SIZE = 2

const formatDate = (date) => {
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('vi-VN')
}

function OrderCard({ order }) {
  const items = order.orderDetail ?? []
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  return (
    <div className="order-card">
      <div className="order-head">
        <div>
          <p className="order-id">Order #{order.id}</p>
          <p className="order-date">Placed on {formatDate(order.date)} · {items.length} items</p>
        </div>
        <p className="order-total">{formatPrice(total)}</p>
      </div>
      <ul className="list-unstyled mb-0">
        {items.map((item, index) => (
          <li className="order-item" key={index}>
            <span className="order-thumb">
              <ProductImage src={item.image} alt={item.name} />
            </span>
            <span className="order-name">{item.name}</span>
            <span className="order-qty">
              {item.quantity} × {formatPrice(item.price)}
            </span>
            <span className="order-line">{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Profile() {
  const dispatch = useDispatch()
  const { profile, favorites, loading, error } = useSelector((state) => state.user)

  const [values, setValues] = useState({ email: '', name: '', phone: '', password: '', gender: true })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)
  const [tab, setTab] = useState('order')
  const [page, setPage] = useState(1)

  const fillForm = (p) =>
    setValues({ email: p.email, name: p.name, phone: p.phone, password: '', gender: p.gender })

  useEffect(() => {
    dispatch(fetchProfile())
      .unwrap()
      .then(fillForm)
      .catch(() => {})
    dispatch(fetchFavorites())
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!values.name) newErrors.name = 'Name is required'
    if (!values.phone) newErrors.phone = 'Phone is required'
    if (!values.password) newErrors.password = 'Nhập password để cập nhật'
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    setMessage(null)
    try {
      const updated = await dispatch(saveProfile(values)).unwrap()
      fillForm(updated)
      setMessage({ type: 'success', text: 'Cập nhật thành công' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  const orders = profile?.ordersHistory ?? []
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE))
  const pageOrders = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (!profile) {
    return (
      <p className={`text-center py-5 ${error ? 'text-danger' : ''}`}>
        {error ? `Không tải được profile: ${error}` : 'Loading...'}
      </p>
    )
  }

  return (
    <section className="page-section pt-4">
      <div className="container-xl">
        <div className="page-head">
          <p className="eyebrow">My account</p>
          <h1 className="page-title mb-0">Profile</h1>
        </div>

        <div className="row g-4 align-items-start">
          <div className="col-lg-4">
            <aside className="profile-card">
              <div className="avatar">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-100 h-100 object-fit-cover" />
                ) : (
                  <span>{profile.name?.[0]?.toUpperCase() ?? <i className="bi bi-person-fill"></i>}</span>
                )}
              </div>
              <h2 className="profile-name">{profile.name}</h2>
              <p className="profile-email">{profile.email}</p>
              <div className="profile-stats">
                <div>
                  <strong>{orders.length}</strong>
                  <span>Orders</span>
                </div>
                <div>
                  <strong>{favorites.length}</strong>
                  <span>Favourites</span>
                </div>
              </div>
            </aside>
          </div>

          <div className="col-lg-8">
            <form className="form-card" onSubmit={handleSubmit} noValidate>
              <h2 className="form-card-title">Account details</h2>
              <div className="row gx-3">
                <div className="col-md-6">
                  <FormInput label="Email" name="email" type="email" value={values.email} readOnly />
                </div>
                <div className="col-md-6">
                  <FormInput label="Name" name="name" value={values.name} onChange={handleChange} error={errors.name} />
                </div>
                <div className="col-md-6">
                  <FormInput label="Phone" name="phone" value={values.phone} onChange={handleChange} error={errors.phone} />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Nhập password để cập nhật"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
                <GenderRadio value={values.gender} onChange={(gender) => setValues((v) => ({ ...v, gender }))} />
                <button type="submit" className="btn-pill" disabled={loading}>
                  {loading ? 'Saving...' : 'Update profile'}
                </button>
              </div>
              {message && <p className={`detail-message ${message.type}`}>{message.text}</p>}
            </form>
          </div>
        </div>

        <div className="chips profile-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'order'}
            className={`chip ${tab === 'order' ? 'active' : ''}`}
            onClick={() => setTab('order')}
          >
            Order history ({orders.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'favourite'}
            className={`chip ${tab === 'favourite' ? 'active' : ''}`}
            onClick={() => setTab('favourite')}
          >
            Favourite ({favorites.length})
          </button>
        </div>

        {tab === 'order' &&
          (orders.length === 0 ? (
            <div className="grid-empty">
              <i className="bi bi-receipt"></i>
              <p>Bạn chưa có đơn hàng nào</p>
            </div>
          ) : (
            <>
              {pageOrders.map((order, index) => (
                <OrderCard order={order} key={order.id ?? index} />
              ))}
              {totalPages > 1 && <Pagination current={page} total={totalPages} onChange={setPage} />}
            </>
          ))}

        {tab === 'favourite' &&
          (favorites.length === 0 ? (
            <div className="grid-empty">
              <i className="bi bi-heart"></i>
              <p>Bạn chưa thích sản phẩm nào</p>
            </div>
          ) : (
            <div className="row g-4">
              {favorites.map((p) => (
                <div className="col-6 col-lg-3" key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ))}
      </div>
    </section>
  )
}
