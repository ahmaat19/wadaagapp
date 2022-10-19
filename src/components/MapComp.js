import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_MAPS_API_KEY } from '@env'

const MapComp = ({ origin, destination }) => {
  const mapRef = useRef(null)
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)

  useEffect(() => {
    if (!origin || !destination) return
    mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
      edgePadding: { top: 50, right: 50, left: 50, bottom: 50 },
    })
  }, [origin, destination])

  useEffect(() => {
    if (!origin || !destination) return

    const getTravelTime = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=${GOOGLE_MAPS_API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          setDuration(data?.rows[0]?.elements[0]?.duration?.value)
          setDistance(data?.rows[0]?.elements[0]?.distance?.value)
        })
        .catch((err) => console.log(err))
    }
    getTravelTime()
  }, [origin, destination, GOOGLE_MAPS_API_KEY])

  return (
    <MapView
      ref={mapRef}
      className='h-full'
      mapType='mutedStandard'
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
          strokeColor='#6b21a8'
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
