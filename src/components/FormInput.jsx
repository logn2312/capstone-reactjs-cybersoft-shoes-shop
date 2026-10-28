import { useState } from 'react'

export default function FormInput({ label, name, type = 'text', placeholder, value, onChange, error, readOnly }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="form-field">
      <label className="form-label-ui" htmlFor={name}>
        {label}
      </label>
      <div className="position-relative">
        <input
          id={name}
          name={name}
          type={isPassword && show ? 'text' : type}
          className="form-input-ui"
          placeholder={placeholder ?? label}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />
        {isPassword && (
          <button
            type="button"
            className="btn-eye"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            <i className={`bi ${show ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
          </button>
        )}
      </div>
      <p className="form-error">{error}</p>
    </div>
  )
}
