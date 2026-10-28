import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AuthLayout from '../components/AuthLayout.jsx'
import FormInput from '../components/FormInput.jsx'
import { login, loginFacebook } from '../redux/slices/userSlice.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}
  if (!values.email) errors.email = 'Email is required'
  else if (!EMAIL_REGEX.test(values.email)) errors.email = 'Email is invalid'
  if (!values.password) errors.password = 'Password is required'
  return errors
}

export default function Login() {
  const location = useLocation()
  const [values, setValues] = useState({ email: location.state?.email ?? '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const loading = useSelector((state) => state.user.loading)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate(values)
    setErrors(newErrors)
    if (Object.keys(newErrors).length) return

    setServerError('')
    try {
      await dispatch(login(values)).unwrap()
      navigate(location.state?.from || '/profile', { replace: true })
    } catch (err) {
      setServerError(err.message)
    }
  }

  const handleFacebook = async () => {
    setServerError('')
    try {
      await dispatch(loginFacebook()).unwrap()
      navigate(location.state?.from || '/profile', { replace: true })
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <AuthLayout eyebrow="Welcome back" title="Login" subtitle="Đăng nhập để đặt hàng và lưu sản phẩm yêu thích.">
      <form onSubmit={handleSubmit} noValidate>
        <FormInput label="Email" name="email" type="email" placeholder="you@example.com" value={values.email} onChange={handleChange} error={errors.email} />
        <FormInput label="Password" name="password" type="password" placeholder="Your password" value={values.password} onChange={handleChange} error={errors.password} />

        {serverError && <p className="auth-alert">{serverError}</p>}

        <button type="submit" className="btn-pill w-100" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>

        <div className="auth-divider">or</div>

        <button type="button" className="btn-facebook w-100" onClick={handleFacebook} disabled={loading}>
          <i className="bi bi-facebook"></i>
          <span>Continue with Facebook</span>
        </button>

        <p className="auth-switch">
          Chưa có tài khoản? <Link to="/register">Register now</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
