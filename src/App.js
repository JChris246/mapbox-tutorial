import { useState, useEffect } from 'react'
import mapboxgl from 'mapbox-gl';
import './App.css';

import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const App = () => {

  const [state, setState] = useState({
    coordinates: [13.17080317085379, -59.6034520733074],
    zoom: 11
  })


  useEffect(() => {

    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [state.coordinates[1], state.coordinates[0]],
      zoom: state.zoom,
    });
    map.on('click', (e) => {
      console.log(e)
    })

    map.on('load', () => {
      console.log('map has loaded')

      map.addControl(new mapboxgl.NavigationControl(), 'top-left');

      new mapboxgl.Marker({
        color: "red",
        // draggable: true
      }).setLngLat([state.coordinates[1], state.coordinates[0]])
        .addTo(map);
    })

    //eslint-disable-next-line
  }, [])

  const addMarker = () => {
    //TODO: Add a marker when user clicks on map and display in the left side
    //NOTE: Each marker must have distinct coordinates within Barbados
    //NOTE: Utilize localstorage. No auth required.
  }

  return (
    <div className="App">
      <header>
        <h2>Map app</h2>
      </header>
      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: '25%' }}>
          Marker List
          {/* Add list of todos here */}
        </div>
        <div data-testid="map" id='map' style={{ height: '500px', width: '100%' }}>

        </div>
      </div>

    </div>
  );
}

export default App;
