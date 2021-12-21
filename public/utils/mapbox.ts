import * as MapboxClient from "mapbox";
import * as mapboxgl from "mapbox-gl";
import { state } from "../state";

export const initMapbox = (initial?) => {
  const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

  const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

  const initMap = () => {
    mapboxgl.accessToken = MAPBOX_TOKEN;

    return new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
    });
  };

  const initSearchForm = (cb) => {
    const button: any = document.querySelector(".mapbox-button");

    button.addEventListener("click", (e) => {
      e.preventDefault();
      const input: HTMLInputElement = document.querySelector(".petLocation");
      mapboxClient.geocodeForward(
        input.value,
        {
          autocomplete: true,
          language: "es",
        },
        function (err, data, res) {
          if (!err) cb(data.features);
        }
      );
    });
  };

  const map = initMap();
  let initialMarker;

  if (initial) {
    map.setCenter([initial.lng, initial.lat]);
    map.setZoom(10);
    initialMarker = new mapboxgl.Marker()
      .setLngLat([initial.lng, initial.lat])
      .addTo(map);
  }
  const noNeededDiv = document.querySelector(".mapboxgl-control-container");
  noNeededDiv.remove();

  initSearchForm((data) => {
    if (initial) {
      initialMarker.remove();
    }

    const firstResult = data[0];

    const marker = new mapboxgl.Marker({ color: "#222", draggable: true })
      .setLngLat(firstResult.geometry.coordinates)
      .addTo(map);

    const [lng, lat] = firstResult.geometry.coordinates;

    state.setState({
      ...state.getState(),
      petGeoloc: {
        lng,
        lat,
      },
    });

    marker.on("dragend", () => {
      const data = marker.getLngLat();
      const { lng, lat } = data;

      state.setState({
        ...state.getState(),
        petGeoloc: {
          lng,
          lat,
        },
      });
    });

    map.setCenter(firstResult.geometry.coordinates);
    map.setZoom(14);
  });
};
