import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AuthLayout from '../components/AuthLayout.jsx'
import FormInput from '../components/FormInput.jsx'
import GenderRadio from '../components/GenderRadio.jsx'
import { register } from '../redux/slices/userSlice.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}
  if (!values.email) errors.email = 'Email is required'
  else if (!EMAIL_REGEX.test(values.email)) errors.email = 'Email is invalid'
  if (!values.password) errors.password = 'Password is required'
  if (values.passwordConfirm !== values.password) errors.passwordConfirm = 'Password confirm does not match'
  if (!values.name) errors.name = 'Name is required'
  if (!values.phone) errors.phone = 'Phone is required'
  else if (!/^\d{9,11}$/.test(values.phone)) errors.phone = 'Phone must be 9-11 digits'
  return errors
}

export default function Register() {
  const [values, setValues] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    gender: true,
  })
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
      await dispatch(register(values)).unwrap()
      alert('Đăng ký thành công! Mời bạn đăng nhập.')
      navigate('/login', { state: { email: values.email } })
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <AuthLayout eyebrow="Join us" title="Register" subtitle="Tạo tài khoản để mua sắm nhanh hơn." wide>
      <form className="row gx-3" onSubmit={handleSubmit} noValidate>
        <div className="col-12">
          <FormInput label="Email" name="email" type="email" placeholder="you@example.com" value={values.email} onChange={handleChange} error={errors.email} />
        </div>
        <div className="col-md-6">
          <FormInput label="Password" name="password" type="password" placeholder="Password" value={values.password} onChange={handleChange} error={errors.password} />
        </div>
        <div className="col-md-6">
          <FormInput
            label="Password confirm"
            name="passwordConfirm"
            type="password"
            placeholder="Nhập lại password"
            value={values.passwordConfirm}
            onChange={handleChange}
            error={errors.passwordConfirm}
          />
        </div>
        <div className="col-md-6">
          <FormInput label="Name" name="name" placeholder="Your name" value={values.name} onChange={handleChange} error={errors.name} />
        </div>
        <div className="col-md-6">
          <FormInput label="Phone" name="phone" placeholder="0901234567" value={values.phone} onChange={handleChange} error={errors.phone} />
        </div>
        <div className="col-12 mb-3">
          <GenderRadio value={values.gender} onChange={(gender) => setValues((v) => ({ ...v, gender }))} />
        </div>
        <div className="col-12">
          {serverError && <p className="auth-alert">{serverError}</p>}
          <button type="submit" className="btn-pill w-100" disabled={loading}>
            {loading ? 'Loading...' : 'Create account'}
          </button>
          <p className="auth-switch">
            Đã có tài khoản? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
