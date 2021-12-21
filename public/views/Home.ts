import { Navbar } from "../components/Navbar";
import { NearPetsCards } from "../components/NearPetsCards";
import { state } from "../state";

export const initHome = (params) => {
  const el = document.createElement("div");

  const { nearPets } = state.getState();

  const askForGeoContainer = `
  
    <div class="w-60 md:w-96 mx-auto my-8">
      <p class="text-justify">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</p>

      <button id="askForUserGeoButton" class="font-bold bg-pink rounded w-60 block w-full h-10 my-2 cursor-pointer">Dar mi ubicación</button>
    </div>
  
  `;

  el.innerHTML = `

    <div class="navbar-container"></div>

    <h2 class="text-center text-3xl font-semibold my-8">Mascotas perdidas cerca tuyo</h2>

    <div class="nearPetsContainer">
    
      ${
        !nearPets
          ? askForGeoContainer
          : setTimeout(() => {
              NearPetsCards();
            }, 1000)
      }
       
    </div>
      
      `;

  Navbar(el, params);

  const askForUserGeoButton = el.querySelector("#askForUserGeoButton");
  askForUserGeoButton?.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const lat = latitude;
      const lng = longitude;

      const url = `/api/pets/near/${lat}/${lng}`;
      const nearPets = await (await fetch(url)).json();

      state.setState({
        ...state.getState(),
        nearPets,
      });

      NearPetsCards();
    });
  });

  state.subscribe(() => {
    if (window.location.pathname === "/") {
      Navbar(el, params);
    }
  });

  return el;
};
