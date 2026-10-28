import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import FormInput from '../components/FormInput.jsx'
import GenderRadio from '../components/GenderRadio.jsx'
import Pagination from '../components/Pagination.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductImage from '../components/ProductImage.jsx'
import Recommendations from '../components/Recommendations.jsx'
import {
  cancelOrder,
  fetchFavorites,
  fetchProfile,
  removeLocalAvatar,
  saveProfile,
  uploadAvatar,
  WRONG_PASSWORD,
} from '../redux/slices/userSlice.js'
import { formatPrice } from '../utils/format.js'
import { MAX_AVATAR_SIZE } from '../utils/image.js'

const PAGE_SIZE = 2

const formatDate = (date) => {
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('vi-VN')
}

function OrderCard({ order, onCancel, cancelling }) {
  const items = order.orderDetail ?? []
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  return (
    <div className="order-card">
      <div className="order-head">
        <div>
          <p className="order-id">Order #{order.id}</p>
          <p className="order-date">Placed on {formatDate(order.date)} · {items.length} items</p>
        </div>
        <div className="text-end">
          <p className="order-total">{formatPrice(total)}</p>
          <button type="button" className="btn-cancel-order" onClick={() => onCancel(order)} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Cancel order'}
          </button>
        </div>
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

function AvatarPicker({ src, name }) {
  const dispatch = useDispatch()
  const localAvatar = useSelector((state) => state.user.localAvatar)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Vui lòng chọn file ảnh' })
      return
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setMessage({ type: 'error', text: 'Ảnh tối đa 5MB' })
      return
    }

    setUploading(true)
    setMessage(null)
    try {
      const { source } = await dispatch(uploadAvatar(file)).unwrap()
      setMessage(
        source === 'server'
          ? { type: 'success', text: 'Đã cập nhật avatar' }
          : { type: 'info', text: 'Server chưa nhận upload, avatar được lưu trên trình duyệt này' },
      )
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="avatar-wrap">
        <div className="avatar">
          {src ? (
            <img src={src} alt={name} className="w-100 h-100 object-fit-cover" />
          ) : (
            <span>{name?.[0]?.toUpperCase() ?? <i className="bi bi-person-fill"></i>}</span>
          )}
          {uploading && <span className="avatar-loading spinner-border spinner-border-sm"></span>}
        </div>
        <label className="avatar-edit" title="Change avatar">
          <i className="bi bi-camera"></i>
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} aria-label="Change avatar" />
        </label>
      </div>
      {localAvatar && (
        <button type="button" className="avatar-remove" onClick={() => dispatch(removeLocalAvatar())}>
          Xoá ảnh
        </button>
      )}
      {message && <p className={`avatar-message ${message.type}`}>{message.text}</p>}
    </>
  )
}

export default function Profile() {
  const dispatch = useDispatch()
  const { profile, favorites, localAvatar, error } = useSelector((state) => state.user)

  const [values, setValues] = useState({ email: '', name: '', phone: '', password: '', gender: true })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('order')
  const [page, setPage] = useState(1)
  const [cancellingId, setCancellingId] = useState(null)
  const [orderMessage, setOrderMessage] = useState(null)

  const handleCancelOrder = async (order) => {
    if (!window.confirm(`Huỷ đơn hàng #${order.id}?`)) return
    setCancellingId(order.id)
    setOrderMessage(null)
    try {
      await dispatch(cancelOrder(order.id)).unwrap()
      setOrderMessage({ type: 'success', text: `Đã huỷ đơn hàng #${order.id}` })
    } catch (err) {
      setOrderMessage({ type: 'error', text: err.message })
    } finally {
      setCancellingId(null)
    }
  }

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
    if (!values.password) newErrors.password = 'Nhập mật khẩu hiện tại để cập nhật'
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    setMessage(null)
    setSaving(true)
    try {
      const updated = await dispatch(saveProfile(values)).unwrap()
      fillForm(updated)
      setMessage({ type: 'success', text: 'Cập nhật thành công' })
    } catch (err) {
      if (err.message === WRONG_PASSWORD) setErrors({ password: err.message })
      else setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  const orders = profile?.ordersHistory ?? []
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageOrders = orders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

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
              <AvatarPicker src={localAvatar ?? profile.avatar} name={profile.name} />
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
              <Link to="/change-password" className="btn-pill btn-pill-outline btn-pill-sm w-100 mt-4">
                <i className="bi bi-key"></i> Change password
              </Link>
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
                    label="Current password"
                    name="password"
                    type="password"
                    placeholder="Nhập mật khẩu để xác nhận"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
                <GenderRadio value={values.gender} onChange={(gender) => setValues((v) => ({ ...v, gender }))} />
                <button type="submit" className="btn-pill" disabled={saving}>
                  {saving ? 'Saving...' : 'Update profile'}
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

        {tab === 'order' && orderMessage && (
          <p className={orderMessage.type === 'error' ? 'auth-alert' : 'success-alert'}>{orderMessage.text}</p>
        )}
        {tab === 'order' &&
          (orders.length === 0 ? (
            <div className="grid-empty">
              <i className="bi bi-receipt"></i>
              <p>Bạn chưa có đơn hàng nào</p>
            </div>
          ) : (
            <>
              {pageOrders.map((order, index) => (
                <OrderCard
                  order={order}
                  key={order.id ?? index}
                  onCancel={handleCancelOrder}
                  cancelling={cancellingId === order.id}
                />
              ))}
              {totalPages > 1 && <Pagination current={currentPage} total={totalPages} onChange={setPage} />}
            </>
          ))}

        {tab === 'favourite' &&
          (favorites.length === 0 ? (
            <div className="grid-empty">
              <i className="bi bi-heart"></i>
              <p>Bạn chưa thích sản phẩm nào</p>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {favorites.map((p) => (
                  <div className="col-6 col-lg-3" key={p.id}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
              <Recommendations className="pt-5 mt-3" />
            </>
          ))}
      </div>
    </section>
  )
}
