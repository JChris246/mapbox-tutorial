import { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import './App.css';

import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const App = () => {

  const [state, setState] = useState({
    coordinates: [13.17080317085379, -59.6034520733074],
    zoom: 11,
    selectedCoordinates: null,
    title: "",
    map: null,
    markers: []
  })

  useEffect(() => {
    if (!state.map)
      state.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [state.coordinates[1], state.coordinates[0]],
        zoom: state.zoom
      });

    state.map.on('click', (e) => {
      const { lngLat } = e;

      setState({...state, "selectedCoordinates": [lngLat.lng, lngLat.lat] });
      document.getElementById("confirm").style.display = "block";
    })

    state.map.on('load', () => {
      console.log('map has loaded')

      state.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    })

  }, [])

  useEffect(() => {
    // Save to localstorage whenever markers is updated
    console.log('save markers to localstorage')
    window.localStorage.setItem('markers', JSON.stringify(state.markers))
  }, [state.markers])

  // Update the state object whenever the field is changed
  const handleFieldChange = (e) => {
    const { value, name } = e.target
    
    setState({...state, [name] : value});
}

  const addMarker = () => {
    //TODO: Add a marker when user clicks on map and display in the left side
    //NOTE: Each marker must have distinct coordinates within Barbados
    //NOTE: Utilize localstorage. No auth required.

    if (state.title.length > 0) {
      // create a new marker obj with provided coords and title
      const newMarker = {
        lng: state.selectedCoordinates[0],
        lat: state.selectedCoordinates[1],
        title: state.title
      }

      // add marker obj to list
      state.markers = [...state.markers, newMarker]

      // add marker to map
      new mapboxgl.Marker({
        color: "red",
      }).setLngLat([newMarker.lng, newMarker.lat])
        .addTo(state.map);

      // close popup
      setState({...state, "title" : ""});
      document.getElementById("confirm").style.display = "none";
    }
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
        <div style={{ width: '100%' }}>
          <div id="confirm" style={{ display: "none" }}>
            <span>Please enter a title for the marker: </span>
            <input
              type="text"
              placeholder="title"
              name="title"
              onChange={handleFieldChange}
              value={state.title}
            />
            <button onClick={addMarker}>Enter</button>
          </div>
          <div id='map' style={{ height: '500px'}}>

          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
