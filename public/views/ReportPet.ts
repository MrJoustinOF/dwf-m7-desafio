import { Navbar } from "../components/Navbar";
import { initDropzone } from "../utils/dropzone";
import { initMapbox } from "../utils/mapbox";
import { state } from "../state";
const bgImage = require("url:./../img/bg-image.png");

export const initReportPet = (params) => {
  const el = document.createElement("div");

  const { loged, user, petOnEdit } = state.getState();

  if (!loged) {
    params.goTo("/signin");
  } else if (petOnEdit && petOnEdit.UserId !== user.id) {
    params.goTo("/");
  }

  el.innerHTML = `
    
    <div class="navbar-container"></div>

        <h2 class="text-3xl text-center font-semibold my-8">${
          petOnEdit
            ? "Editar mascota perdida: " + petOnEdit.name
            : "Reportar mascota perdida"
        }</h2>

        <form class="reportPetForm flex justify-center">
            <div>
                <div class="errsContainer"></div>
                <label class="text-sm block w-full uppercase">
                    Nombre
                </label>

                <input type="text" value="${
                  petOnEdit ? petOnEdit.name : ""
                }" class="namePetInput rounded border-black border-2 w-60 md:w-96 block w-full h-10" autofocus />
                
                <img src="${
                  petOnEdit ? petOnEdit.image : bgImage
                }" alt="current-image" class="current-image my-4 w-60 md:w-96 text-center" />
                
                <p class="text-center w-60 md:w-96 block">Si al subir la imagen no carga, recargar la pagina</p>

                <button class="dropzone font-bold bg-green rounded w-60 block w-full h-10 my-2 cursor-pointer">agregar/modificar foto</button>

                <div id="map" class="my-8 w-60 md:w-96 h-48"></div>
                <div class="mb-8">
                    <label class="uppercase">Ubicacion</label>
                    <input type="search" value="${
                      petOnEdit ? petOnEdit.refPlace : ""
                    }" name="location" class="petLocation rounded border-black border-2 w-60 md:w-96 block w-full h-10"/>
                    <p class="text-justify w-60 md:w-96 block">Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</p>
                    <button type="button" class="mapbox-button font-bold bg-green rounded w-60 block w-full h-10 my-2 cursor-pointer">Buscar ubicacion</button>
                </div>
                
                <input id="submitFormBtn" type="submit" value="${
                  petOnEdit ? "Guardar" : "Reportar como perdido"
                }" class="font-bold bg-pink rounded w-60 block w-full h-10 my-2 cursor-pointer" />

                <p id="cancelButton" class="${
                  petOnEdit ? "hidden" : ""
                } font-bold bg-gray rounded w-60 flex items-center justify-center w-full h-10 my-2 cursor-pointer">Cancelar</p>

                <p id="setPetFoundButton" class="${
                  !petOnEdit ? "hidden" : ""
                } font-bold bg-green rounded w-60 flex items-center justify-center w-full h-10 my-2 cursor-pointer">Reportar como encontrado</p>

                <p id="deletePetButton" class="${
                  !petOnEdit ? "hidden" : ""
                } my-8 text-main text-center underline uppercase cursor-pointer">Despublicar</p>
            </div>
        </form>

    `;

  Navbar(el, params);

  setTimeout(() => {
    initDropzone();
    initMapbox(petOnEdit ? petOnEdit : undefined);
  }, 1000);

  const cancelButton = el.querySelector("#cancelButton");
  cancelButton.addEventListener("click", () => params.goTo("/"));

  const setPetFoundButton = el.querySelector("#setPetFoundButton");
  setPetFoundButton.addEventListener("click", async () => {
    const url = "/api/pets/found/" + petOnEdit.id;
    const update = await (
      await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    ).json();

    if (update.msg === "pet found") {
      params.goTo("/mypets");
    }
  });

  const deletePetButton = el.querySelector("#deletePetButton");
  deletePetButton.addEventListener("click", async () => {
    const url = "/api/pets/" + petOnEdit.id;
    const deletePet = await (
      await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    ).json();

    if (deletePet.msg === "pet deleted") {
      params.goTo("/mypets");
    }
  });

  const form = el.querySelector(".reportPetForm");
  form.addEventListener("submit", (e) => e.preventDefault());

  const submitFormBtn = el.querySelector("#submitFormBtn");
  submitFormBtn.addEventListener("click", async () => {
    // e.preventDefault();

    const petName: HTMLInputElement = document.querySelector(".namePetInput");
    const petLocation: HTMLInputElement =
      document.querySelector(".petLocation");
    const { imageData, petGeoloc } = state.getState();
    let errs = [];

    if (
      petName.value.length === 0 ||
      petLocation.value.length === 0 ||
      (!petOnEdit && (!imageData || !petGeoloc))
    ) {
      errs.push("Todos los campos son obligatorios");
    }

    if (petName.value.length < 3 && petName.value.length !== 0) {
      errs.push("El nombre debe tener al menos 3 caracteres");
    }

    if (!petOnEdit && !imageData) {
      errs.push("Debes subir una imagen de tu mascota");
    }

    if (!petOnEdit && !petGeoloc) {
      errs.push(
        "Agrega la ubicacion el mapa para ayudar a encontrar tu mascota"
      );
    }

    if (petLocation.value.length < 4 && petLocation.value.length !== 0) {
      errs.push("Debes agregar un lugar o ciudad como referencia");
    }

    if (errs.length !== 0) {
      const errsContainer = document.querySelector(".errsContainer");
      const errsDiv = document.createElement("div");

      errs.map((err) => {
        errsDiv.innerHTML += `
          <h2 class="w-60 md:w-96 mx-auto text-center text-red-700 bg-red-100 my-4 py-4 border-l-8 border-red-700">
            ${err}
          </h2>`;
      });

      errsContainer.firstChild?.remove();
      errsContainer.appendChild(errsDiv);
    } else {
      if (!petOnEdit) {
        const { lat, lng } = petGeoloc;
        const query = await (
          await fetch("/api/pets/", {
            method: "POST",
            body: JSON.stringify({
              name: petName.value,
              imageData,
              lat,
              lng,
              refPlace: petLocation.value,
              UserId: user.id,
            }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
        ).json();

        if (query.msg === "pet saved") {
          params.goTo("/mypets");
        }
      } else {
        const url = "/api/pets/" + petOnEdit.id;
        const query = await (
          await fetch(url, {
            method: "PUT",
            body: JSON.stringify({
              name: petName.value,
              imageData: imageData ? imageData : petOnEdit.image,
              lat: petGeoloc ? petGeoloc.lat : petOnEdit.lat,
              lng: petGeoloc ? petGeoloc.lng : petOnEdit.lng,
              refPlace: petLocation.value,
            }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
        ).json();

        if (query.msg === "pet updated") {
          state.setState({
            ...state.getState(),
            petOnEdit: undefined,
          });
          params.goTo("/mypets");
        }
      }
    }
  });

  state.subscribe(() => {
    if (location.pathname === "/reportpet") {
      Navbar(el, params);

      const currentImage: HTMLImageElement =
        document.querySelector(".current-image");
      currentImage.src = state.getState().imageData;
    }
  });

  return el;
};
