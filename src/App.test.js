import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mapboxgl from 'mapbox-gl';
import App from './App';
// import 'mapbox-gl/dist/mapbox-gl.css'

const initMock = () => {
  mapboxgl.Map.mockImplementation(() => {
    return {
      on: () => jest.fn().on,
    }
  });
}

beforeEach(() => initMock())

describe("testing Map app", () => {
  test('renders without crashing', () => {
    // initMock();
    render(<App />);
    const headerElement = screen.getByText(/map app/i);
    expect(headerElement).toBeInTheDocument();
  })

  test('renders Map', () => {
    // initMock();
    render(<App />);
    // let map = mapboxgl.Map
    
    expect(mapboxgl.Map).toHaveBeenCalledTimes(1)
  });

  test('responds to click event', async () => {
    initMock();
    const { getByTestId, getByLabelText } = render(<App />);
    const Map = getByTestId("map");
    console.log(mapboxgl.Map.mock.instances)
    // console.log(map.on)

    // await userEvent.click(map);
    // screen.debug()

    expect(mapboxgl.Map).toHaveBeenCalledTimes(1)
  });

});