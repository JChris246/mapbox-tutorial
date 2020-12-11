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
    title: "",
    map: null,
  })

  const [selectedCoordinates, setSelectedCoordinates] = useState([])
  const [markers, setMarkers] = useState([])
  const [realMarkers, setRealMarkers] = useState([])

  // load markers from local storage
  if (markers.length < 1) {
    const loadedMarkers = JSON.parse(localStorage.getItem("markers"));
    if (loadedMarkers)
      loadedMarkers.map(marker => markers[markers.length] = marker);
  }

  useEffect(() => {
    if (!state.map) {
      state.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [state.coordinates[1], state.coordinates[0]],
        zoom: state.zoom
      });

      state.map.on('click', (e) => {
        const { lngLat } = e;

        selectedCoordinates[0] = lngLat.lng;
        selectedCoordinates[1] = lngLat.lat;
        
        document.getElementById("confirm").style.display = "block";
      })

      state.map.on('load', () => {
        console.log('map has loaded')
    
        state.map.addControl(new mapboxgl.NavigationControl(), 'top-left');

        // add existing markers to map
        if (markers)
          markers.map(marker => {
            let m = new mapboxgl.Marker({
              color: "red"
            }).setLngLat([marker.lng, marker.lat])
              .addTo(state.map);
            
              realMarkers[realMarkers.length] = {"marker": m, "id": marker.title};
          });
      })
    }
  }, [state])

  // Update the state object whenever the field is changed
  const handleFieldChange = (e) => {
    const { value, name } = e.target
    
    setState({...state, [name] : value });
  }

  const handleRemove = (title) => {
    // TODO: Remove marker from list and map
    setMarkers(markers.filter((marker) => marker.title !== title))

    realMarkers.filter((marker) => marker.id === title)[0].marker.remove()
    setRealMarkers(realMarkers.filter((marker) => marker.id !== title))
    
    console.log('save markers to localstorage')
    window.localStorage.setItem('markers', JSON.stringify(markers.filter((marker) => marker.title !== title)))
  }

  const viewMarker = (title) => {
    const marker = markers.filter((marker) => marker.title === title)[0];
    const lngLat = {
      lng: marker.lng,
      lat: marker.lat
    };
    state.map.jumpTo({ 'center': lngLat, 'zoom': 14 }); 
    state.zoom = 14;
  }

  const addMarker = () => {
    //TODO: Add a marker when user clicks on map and display in the left side
    //NOTE: Each marker must have distinct coordinates within Barbados
    //NOTE: Utilize localstorage. No auth required.

    if (state.title.length > 0) {
      // create a new marker obj with provided coords and title
      const newMarker = {
        lng: selectedCoordinates[0],
        lat: selectedCoordinates[1],
        title: state.title
      }

      // add marker obj to list
      markers[markers.length] = newMarker

      console.log('save markers to localstorage')
      window.localStorage.setItem('markers', JSON.stringify(markers))

      // add marker to map
      let m = new mapboxgl.Marker({
        color: "red",
      }).setLngLat([newMarker.lng, newMarker.lat])
        .addTo(state.map);
      realMarkers[realMarkers.length] = {
        "marker": m,
        "id": state.title
      };

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
          <h3>Marker List</h3>
          {markers?.length > 0 ? markers.map((marker) => (
            <div onClick={() => viewMarker(marker.title)} name={marker.title} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{marker.title}</span>
              <button onClick={() => handleRemove(marker.title)}>Remove</button>
            </div>
          )) : ""}
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
