const CONFIG = {
    keyGoogleMapsGeocodingAPI: "AIzaSyCgYxdkNO3zNCfJNiM0RmDTmUfhx9pzkVI",
    keyDarskyNetForecast: "1e02026fd5ea63a81275a7795bfbe5e0",
    lat: 0,
    lng: 0
}

const now = new Date()
const timeNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000

const secondsDay = 86400

const darskyCountDays = 7 

function weather(time)
{
        $(function() {

            if (!time) {
                time = timeNow
            }

            latitude = CONFIG.latitude
            longitude = CONFIG.longitude

            let latlng = new google.maps.LatLng(latitude, longitude);

            let geocoder = new google.maps.Geocoder();

            geocoder.geocode({'latLng': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    $('#place').text(results[1]['formatted_address'])
                }
            })
            const language = 'uk';
            let data, uv_class, wind_direction;
            let urlDarkSky = `https://api.darksky.net/forecast/${CONFIG.keyDarskyNetForecast}/${latitude},${longitude},${time}`;

            $.getJSON(urlDarkSky + "?exclude=daily,hourly,flags&lang="+language+"&callback=?", function(data) {

                var now = moment()

                let strDate = moment(data.currently.time * 1000).format("dddd, MMMM D YYYY").valueOf()
                $('#date').text(strDate.toLowerCase().capitalizeEachWord())
            
                $("#result").removeClass('invisible')
                    
                $("#time").attr('data-time', data.currently.time)
                // convert from fahrenheit to celsius
                $('#temperature').text(Math.round((parseInt(data.currently.temperature) - 32) * 5 / 9))
                $('#humidity').text(Math.round(data.currently.humidity * 100))
                $('#wind').text(Math.round(data.currently.windSpeed))
                $('#summary').text(data.currently.summary)
                $('#dewPoint').text(data.currently.dewPoint)
                $('#pressure').text(data.currently.pressure)
                
                windDirection = data.currently.windBearing/2
                $('#windDirection')
                    .css({
                        'display': 'inline-block',
                        '-webkit-transform': `rotate(${wind_direction}deg)`, 'transform': `rotate(${wind_direction}deg)`
                    });

                var skycons = new Skycons({"color": "blue"})
                skycons.add("icon", data.currently.icon)
                skycons.play()
                                
                if (time == timeNow) {
                    $('#prevDay').addClass('disabled')
                } else {
                    $('#prevDay').removeClass('disabled')
                }

                if (time == timeNow + secondsDay * darskyCountDays) {
                    $('#nextDay').addClass('disabled')
                } else {
                    $('#nextDay').removeClass('disabled')
                }
            })
        })
}  

$("#nextDay").on("click", function(e) {
    weather(parseInt($('#time').attr('data-time')) + secondsDay)
})

$("#prevDay").on("click", function(e) {
    weather(parseInt($('#time').attr('data-time')) - secondsDay)
})

$('#search').on('keypress', function(e) {  
    if (e.keyCode == 13)  e.preventDefault()

    return true 
})

// insert tag script with url GoogleMapApi + key
function insertMapScript() {
  let googleApi = document.createElement("script")
  googleApi.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.keyGoogleMapsGeocodingAPI}&callback=initMap&libraries=places,geometry`

  document.body.appendChild(googleApi)
}

// Find data for autocomplete from Google Maps Geocoding Api
function initMap() {
    let autocomplete = new google.maps.places.SearchBox($('#search')[0])

    autocomplete.addListener("places_changed", function() {
        let place = autocomplete.getPlaces()[0]
        let now = new Date()

        CONFIG.latitude = place.geometry.location.lat()
        CONFIG.longitude = place.geometry.location.lng()

        weather()
        $('#search').val("")
    })
}

window.addEventListener("load", function() {
    if ("geolocation" in navigator){        
        navigator.geolocation.getCurrentPosition(function(position){ 
            CONFIG.latitude = position.coords.latitude
            CONFIG.longitude = position.coords.longitude

            weather();
            // Get weather every 10 min.
            setInterval(weather, 600000);      
        });
    }
})

insertMapScript()

String.prototype.capitalizeEachWord = function() {
    return this.replace(/\W\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
}
