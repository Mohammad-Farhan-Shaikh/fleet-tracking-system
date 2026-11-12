// src/services/googleMapsAdapter.js - Google Maps Provider Architecture Skeleton
// Ready to activate whenever Google Maps API key is provided

import { GOOGLE_MAPS_CONFIG } from '../config/mapConfig'

export class GoogleMapsAdapter {
  constructor() {
    this.map = null
    this.markers = new Map()
    this.isLoaded = false
  }

  // Load Google Maps JavaScript SDK asynchronously
  async loadSdk(apiKey = GOOGLE_MAPS_CONFIG.apiKey) {
    if (this.isLoaded || window.google?.maps) {
      this.isLoaded = true
      return true
    }

    if (!apiKey) {
      console.warn('[GoogleMapsAdapter] API Key not set. Remaining in Leaflet-only mode.')
      return false
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      const libraries = GOOGLE_MAPS_CONFIG.libraries.join(',')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries}&v=${GOOGLE_MAPS_CONFIG.version}`
      script.async = true
      script.defer = true
      script.onload = () => {
        this.isLoaded = true
        resolve(true)
      }
      script.onerror = (err) => reject(err)
      document.head.appendChild(script)
    })
  }

  // Initialize Map Instance
  init(container, center = { lat: 40.5, lng: -86.5 }, zoom = 7) {
    if (!window.google?.maps) return null

    this.map = new window.google.maps.Map(container, {
      center,
      zoom,
      mapTypeId: GOOGLE_MAPS_CONFIG.defaultMapTypeId,
      disableDefaultUI: true,
      zoomControl: false,
    })

    return this.map
  }

  // Update/render markers matching our fleet standards
  renderVehicles(vehicles, selectedId, onSelect) {
    if (!this.map || !window.google?.maps) return

    vehicles.forEach((v) => {
      if (!v.lat || !v.lng) return

      let marker = this.markers.get(v.id)
      const position = { lat: v.lat, lng: v.lng }

      if (marker) {
        marker.setPosition(position)
      } else {
        marker = new window.google.maps.Marker({
          position,
          map: this.map,
          title: `${v.id} - ${v.model}`,
        })

        marker.addListener('click', () => {
          if (onSelect) onSelect(v)
        })

        this.markers.set(v.id, marker)
      }
    })
  }

  // Smooth center/pan
  panTo(lat, lng, zoom = 14) {
    if (!this.map) return
    this.map.panTo({ lat, lng })
    if (zoom) this.map.setZoom(zoom)
  }

  destroy() {
    this.markers.forEach((m) => m.setMap(null))
    this.markers.clear()
    this.map = null
  }
}

export const googleMapsAdapter = new GoogleMapsAdapter()

