import React, { useRef, useEffect } from 'react'
import MapView, { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_MAPS_API_KEY } from '../utils/key'

const MapComp = ({
  origin,
  destination,
  setDistance,
  setDuration,
  setError,
}) => {
  const mapRef = useRef(null)

  useEffect(() => {
    if (!origin || !destination) return
    mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
      edgePadding: { top: 60, right: 60, left: 60, bottom: 60 },
    })
  }, [origin, destination])

  useEffect(() => {
    if (!origin || !destination) return

    const getTravelTime = async () => {
      await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=${GOOGLE_MAPS_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          setDuration(data?.rows[0]?.elements[0]?.duration?.text)
          setDistance(data?.rows[0]?.elements[0]?.distance?.text)
          setError(null)
        })
        .catch((err) => {
          setError(err)
          console.log(err)
        })
    }
    getTravelTime()
  }, [origin, destination, GOOGLE_MAPS_API_KEY])

  return (
    <MapView
      ref={mapRef}
      className='h-full'
      initialRegion={{
        latitude: origin?.location?.lat,
        longitude: origin?.location?.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      {origin && destination && (
        <MapViewDirections
          origin={origin?.description}
          destination={destination?.description}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={3}
          strokeColor='#7e287e'
        />
      )}
      {origin?.location && (
        <Marker
          coordinate={{
            latitude: origin?.location?.lat,
            longitude: origin?.location?.lng,
          }}
          title='Origin'
          description={origin?.description}
          identifier='origin'
        />
      )}
      {destination?.location && (
        <Marker
          coordinate={{
            latitude: destination?.location?.lat,
            longitude: destination?.location?.lng,
          }}
          title='Destination'
          description={destination?.description}
          identifier='destination'
        />
      )}
    </MapView>
  )
}

export default MapComp
