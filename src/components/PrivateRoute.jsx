import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function PrivateRoute({ children }) {
  const token = useSelector((state) => state.user.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}
