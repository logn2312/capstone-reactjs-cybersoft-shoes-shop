import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchStores } from '../redux/slices/productSlice.js'
import { fixNestedUrl } from '../utils/format.js'

const pin = (active) =>
  L.divIcon({
    className: '',
    html: `<span class="map-pin ${active ? 'active' : ''}"><i class="bi bi-shop"></i></span>`,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -44],
  })

const positionOf = (store) => [Number(store.latitude), Number(store.longtitude)]

const directionsUrl = (store) =>
  `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longtitude}`

function MapController({ stores, selected, markers }) {
  const map = useMap()

  useEffect(() => {
    if (stores.length > 0) map.fitBounds(stores.map(positionOf), { padding: [60, 60], maxZoom: 15 })
  }, [stores, map])

  useEffect(() => {
    if (!selected) return
    map.flyTo(positionOf(selected), 16, { duration: 0.8 })
    markers.current[selected.id]?.openPopup()
  }, [selected, map, markers])

  return null
}

function StoreImage({ src, alt }) {
  const [failed, setFailed] = useState(false)
  if (failed || !src) {
    return (
      <span className="store-img img-fallback">
        <i className="bi bi-shop"></i>
      </span>
    )
  }
  return <img src={fixNestedUrl(src)} alt={alt} className="store-img" onError={() => setFailed(true)} />
}

export default function Stores() {
  const dispatch = useDispatch()
  const { stores, storesLoading, storesError } = useSelector((state) => state.product)
  const [keyword, setKeyword] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const markers = useRef({})

  useEffect(() => {
    dispatch(fetchStores())
  }, [dispatch])

  const q = keyword.trim().toLowerCase()
  const shown = stores.filter((s) => `${s.name} ${s.description}`.toLowerCase().includes(q))
  const selected = stores.find((s) => s.id === selectedId) ?? null

  return (
    <section className="page-section pt-4">
      <div className="container-xl">
        <div className="page-head">
          <p className="eyebrow">Find us</p>
          <h1 className="page-title">Our Stores</h1>
          <div className="search-bar">
            <i className="bi bi-geo-alt"></i>
            <input
              aria-label="Search store"
              placeholder="Tìm theo tên hoặc địa chỉ..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        {storesError ? (
          <p className="grid-empty text-danger">Không tải được cửa hàng: {storesError}</p>
        ) : (
          <div className="row g-4">
            <div className="col-lg-4">
              <p className="result-count mb-3">
                {storesLoading ? 'Loading...' : `${shown.length} stores`}
              </p>
              <ul className="store-list list-unstyled">
                {shown.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={`store-card ${s.id === selectedId ? 'active' : ''}`}
                      onClick={() => setSelectedId(s.id)}
                    >
                      <StoreImage src={s.image} alt={s.name} />
                      <span className="store-info">
                        <span className="store-name">{s.name}</span>
                        <span className="store-address">
                          <i className="bi bi-geo-alt"></i> {s.description}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
                {!storesLoading && shown.length === 0 && (
                  <li className="grid-empty py-4">Không tìm thấy cửa hàng</li>
                )}
              </ul>
            </div>

            <div className="col-lg-8">
              <div className="map-wrap">
                <MapContainer center={[10.7769, 106.7009]} zoom={13} scrollWheelZoom className="map">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {shown.map((s) => (
                    <Marker
                      key={s.id}
                      position={positionOf(s)}
                      icon={pin(s.id === selectedId)}
                      ref={(el) => {
                        markers.current[s.id] = el
                      }}
                      eventHandlers={{ click: () => setSelectedId(s.id) }}
                    >
                      <Popup>
                        <strong>{s.name}</strong>
                        <br />
                        {s.description}
                        <br />
                        <a href={directionsUrl(s)} target="_blank" rel="noreferrer">
                          Chỉ đường →
                        </a>
                      </Popup>
                    </Marker>
                  ))}
                  <MapController stores={shown} selected={selected} markers={markers} />
                </MapContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
