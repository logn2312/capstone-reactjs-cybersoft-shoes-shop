import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Home from './pages/Home.jsx'
import Detail from './pages/Detail.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile from './pages/Profile.jsx'
import Carts from './pages/Carts.jsx'
import Search from './pages/Search.jsx'
import Category from './pages/Category.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/carts" element={<PrivateRoute><Carts /></PrivateRoute>} />
            <Route path="/search" element={<Search />} />
            <Route path="/men" element={<Category title="Men" categoryId="MEN" />} />
            <Route path="/woman" element={<Category title="Woman" categoryId="WOMEN" />} />
            <Route path="/nike" element={<Category title="Nike" categoryId="NIKE" />} />
            <Route path="/adidas" element={<Category title="Adidas" categoryId="ADIDAS" />} />
            <Route path="/kid" element={<Category title="Kid" />} />
            <Route path="/sport" element={<Category title="Sport" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
