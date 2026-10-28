import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import FormInput from '../components/FormInput.jsx'
import { updatePassword } from '../redux/slices/userSlice.js'

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' }

function validate(values) {
  const errors = {}
  if (!values.currentPassword) errors.currentPassword = 'Current password is required'
  if (!values.newPassword) errors.newPassword = 'New password is required'
  else if (values.newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters'
  else if (values.newPassword === values.currentPassword) errors.newPassword = 'New password must be different'
  if (values.confirmPassword !== values.newPassword) errors.confirmPassword = 'Password confirm does not match'
  return errors
}

export default function ChangePassword() {
  const dispatch = useDispatch()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate(values)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    setSubmitting(true)
    setMessage(null)
    try {
      await dispatch(
        updatePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword }),
      ).unwrap()
      setValues(EMPTY)
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-section pt-4">
      <div className="container-xl">
        <div className="page-head">
          <Link to="/profile" className="back-link">
            <i className="bi bi-arrow-left"></i> Back to profile
          </Link>
          <p className="eyebrow mt-3">My account</p>
          <h1 className="page-title mb-0">Change password</h1>
        </div>

        <form className="form-card form-card-narrow" onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Current password"
            name="currentPassword"
            type="password"
            value={values.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
          />
          <FormInput
            label="New password"
            name="newPassword"
            type="password"
            placeholder="Ít nhất 6 ký tự"
            value={values.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
          />
          <FormInput
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={values.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          {message && (
            <p className={message.type === 'error' ? 'auth-alert' : 'success-alert'}>{message.text}</p>
          )}

          <button type="submit" className="btn-pill w-100" disabled={submitting}>
            {submitting ? 'Saving...' : 'Update password'}
          </button>
        </form>
      </div>
    </section>
  )
}
