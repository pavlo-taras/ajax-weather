// My key
const keyGoogleMapsGeocodingAPI = 'AIzaSyArEG7a9LJ_SqOIYqCbQcGUNcj5pZ23mfQ'

const objPlaceLocation = {}

const $id = id => document.querySelector(id)

// insert tag script with url GoogleMapApi + key
function insertGoogleMapAPIScript() {
  let googleApi = document.createElement('script')
  googleApi.src = `https://maps.googleapis.com/maps/api/js?key=${keyGoogleMapsGeocodingAPI}&callback=initGoogleMapsGeocodingAPI&libraries=places,geometry`
  console.log(googleApi.src)
  document.body.appendChild(googleApi)
}

// Find data for autocomplete from Google Maps Geocoding Api
function initGoogleMapsGeocodingAPI() {
    console.log('#search = ', $id('#search'))
    let autocomplete = new google.maps.places.SearchBox($id('#search'))
    console.log('autocomplete = ', autocomplete)

    autocomplete.addListener('places_changed', function() {
      let place = autocomplete.getPlaces()[0]
      console.log("place = ", place)
      objPlaceLocation['latitude'] = place.geometry.location.lat();
      objPlaceLocation['longitude'] = place.geometry.location.lng();
    })
}

insertGoogleMapAPIScript()
