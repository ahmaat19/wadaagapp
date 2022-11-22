import * as Location from 'expo-location'

export async function startTracking(client) {
  await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      distanceInterval: 1,
      timeInterval: 3000,
    },
    ({ coords }) => {
      return coords
    }
  )
    .then((locationWatcher) => {
      return locationWatcher
    })
    .catch((err) => {
      console.log(err)
    })
}

export async function stopTracking(client) {
  console.log('Remove tracking')
  await client.location.remove()
}
