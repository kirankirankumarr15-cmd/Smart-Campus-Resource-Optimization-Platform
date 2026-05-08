import { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react'

// PESITM Shivamogga campus coordinates
// PES Institute of Technology & Management, Shivamogga, Karnataka
const CAMPUS_CENTER = { lat: 13.9338, lng: 75.5642 }

const CAMPUS_ROOMS = [
  { id: 'A', label: 'Block A – CSE', lat: 13.9340, lng: 75.5638 },
  { id: 'B', label: 'Block B – ECE', lat: 13.9334, lng: 75.5645 },
  { id: 'C', label: 'Block C – MECH', lat: 13.9337, lng: 75.5652 },
]

export default function LiveLocationMap() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const userMarkerRef = useRef(null)
  const [locationStatus, setLocationStatus] = useState('idle') // idle | loading | success | error
  const [userPos, setUserPos] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [mapLoaded, setMapLoaded] = useState(false)

  // Load Google Maps script (uses free Maps Embed for demo, or API key if available)
  useEffect(() => {
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

    if (!GOOGLE_MAPS_API_KEY) {
      // Fallback: Use OpenStreetMap via iframe embed
      setMapLoaded(false)
      return
    }

    if (window.google && window.google.maps) {
      setMapLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => setMapLoaded(true)
    script.onerror = () => setMapLoaded(false)
    document.head.appendChild(script)
  }, [])

  // Init Google Map when loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: CAMPUS_CENTER,
      zoom: 16,
      mapTypeId: 'hybrid',
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        { featureType: 'poi.school', elementType: 'labels', stylers: [{ visibility: 'on' }] }
      ],
    })

    mapInstanceRef.current = map

    // Campus marker
    new window.google.maps.Marker({
      position: CAMPUS_CENTER,
      map,
      title: 'PESITM Shivamogga Campus',
      icon: {
        path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 8,
        fillColor: '#E8601A',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
      label: { text: 'PESITM', color: '#fff', fontSize: '11px', fontWeight: 'bold' },
    })

    // Block markers
    CAMPUS_ROOMS.forEach(r => {
      new window.google.maps.Marker({
        position: { lat: r.lat, lng: r.lng },
        map,
        title: r.label,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#1e3a5f',
          fillOpacity: 0.9,
          strokeColor: '#fff',
          strokeWeight: 1.5,
        },
        label: { text: r.id, color: '#fff', fontSize: '10px', fontWeight: 'bold' },
      })
    })
  }, [mapLoaded])

  const locate = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.')
      setLocationStatus('error')
      return
    }
    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserPos(coords)
        setLocationStatus('success')

        if (mapLoaded && mapInstanceRef.current) {
          // Pan map to user
          mapInstanceRef.current.panTo(coords)
          mapInstanceRef.current.setZoom(17)

          // Remove old marker
          if (userMarkerRef.current) userMarkerRef.current.setMap(null)

          // Add live location marker
          userMarkerRef.current = new window.google.maps.Marker({
            position: coords,
            map: mapInstanceRef.current,
            title: 'Your Location',
            animation: window.google.maps.Animation.DROP,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 3,
            },
          })

          // Draw route from user to campus
          const directionsService = new window.google.maps.DirectionsService()
          const directionsRenderer = new window.google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: { strokeColor: '#E8601A', strokeWeight: 4, strokeOpacity: 0.8 },
          })
          directionsRenderer.setMap(mapInstanceRef.current)
          directionsService.route({
            origin: coords,
            destination: CAMPUS_CENTER, // PESITM Shivamogga
            travelMode: window.google.maps.TravelMode.DRIVING,
          }, (result, status) => {
            if (status === 'OK') directionsRenderer.setDirections(result)
          })
        }
      },
      (err) => {
        // Fallback retry if high accuracy failed
        setErrorMsg('Could not get location: ' + err.message)
        setLocationStatus('error')
      },
      { enableHighAccuracy: false, timeout: 15000 }
    )
  }

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

  return (
    <div className="bg-white rounded-card border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-orange" />
          <p className="text-nav font-medium text-navy">Campus Live Location</p>
          {locationStatus === 'success' && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-label">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          )}
        </div>
        <button
          onClick={locate}
          disabled={locationStatus === 'loading'}
          className="flex items-center gap-1.5 px-3 h-8 bg-orange hover:bg-orange/90 disabled:opacity-60
                     text-white text-label rounded-full transition-colors"
        >
          {locationStatus === 'loading'
            ? <Loader2 size={13} className="animate-spin" />
            : <Navigation size={13} />}
          {locationStatus === 'loading' ? 'Locating…' : 'Locate Me'}
        </button>
      </div>

      {/* Map area */}
      <div className="relative" style={{ height: 300 }}>
        {GOOGLE_MAPS_API_KEY && mapLoaded ? (
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        ) : (
          /* Fallback: OpenStreetMap embed */
          <iframe
            title="PESITM Campus Map"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=75.5600%2C13.9310%2C75.5690%2C13.9370&layer=mapnik&marker=13.9338%2C75.5642`}
            style={{ width: '100%', height: '100%', border: 0 }}
            loading="lazy"
          />
        )}

        {/* Overlay info */}
        {locationStatus === 'success' && userPos && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow text-label text-navy">
            <p className="font-medium">📍 Your Location</p>
            <p className="text-textmute">{userPos.lat.toFixed(5)}, {userPos.lng.toFixed(5)}</p>
          </div>
        )}
        {locationStatus === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-red-600">
              <AlertCircle size={32} />
              <p className="text-body font-medium">Location Error</p>
              <p className="text-label text-center max-w-[220px] mb-2">{errorMsg}</p>
              <button
                onClick={locate}
                className="px-4 h-8 bg-navy text-white text-label rounded-full hover:bg-navy/90 transition-colors"
              >
                Retry Locating
              </button>
            </div>
          </div>
        )}

        {/* Block legend */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow text-label space-y-1">
          {CAMPUS_ROOMS.map(r => (
            <div key={r.id} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-navy/80" />
              <span className="text-navy">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
