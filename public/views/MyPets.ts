import { Navbar } from "../components/Navbar";
import { state } from "../state";
const editIcon = require("url:./../img/editIcon.png");

export const initMyPets = (params) => {
  const el = document.createElement("div");

  const { loged, user } = state.getState();

  if (!loged) {
    params.goTo("/signin");
  }

  el.innerHTML = `
    
      <div class="navbar-container"></div>
      <h2 class="text-3xl md:text-center md:mx-0 mx-4 font-semibold my-8">Mis mascotas reportadas</h2>
      <div class="myPetsContainer"></div>
    `;

  Navbar(el, params);

  const goToEditPet = (pet) => {
    setTimeout(() => {
      const { id } = pet;
      const idQuery = "#edit-icon-" + id;
      const editButton = document.querySelector(idQuery);

      editButton.addEventListener("click", () => {
        state.setState({
          ...state.getState(),
          petOnEdit: pet,
        });
        params.goTo("/reportpet");
      });
    }, 1000);
  };

  const fetchMyPets = async () => {
    const { id } = user;
    const token = localStorage.getItem("token");
    const pets = await (
      await fetch("/api/pets/user/" + id, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: "bearer " + token,
        },
      })
    ).json();
    const myPetsContainer = el.querySelector(".myPetsContainer");
    const div = document.createElement("div");
    div.classList.add("md:grid");
    div.classList.add("grid-cols-3");

    if (pets.length === 0) {
      div.innerHTML = `
        <h2 class="md:text-center md:mx-0 mx-4">Aun no reportaste mascotas perdidas</h2>
      `;
    } else {
      pets.map((pet) => {
        const { id, name, image, refPlace, found } = pet;
        div.innerHTML += `
        
          <div class="w-60 border-2 border-black mx-auto my-4">
            <img src="${image}" alt="pet-img" class="w-full block" />

            <div class="mx-4 my-2 flex justify-between items-center">
              <div>
                <h2 class="text-2xl font-semibold">${name}</h2>
                <p class="uppercase">${refPlace}</p>
              </div>

              <img src="${editIcon}" alt="edit-icon" id="edit-icon-${id}" class="cursor-pointer w-6 h-6" />
            </div>
            ${
              found
                ? '<p class="mx-4 my-2 text-green uppercase">Encontrado</p>'
                : ""
            }
          </div>
        
        `;

        goToEditPet(pet);
      });
    }
    myPetsContainer.appendChild(div);
  };
  fetchMyPets();

  state.subscribe(() => {
    if (location.pathname === "/mypets") {
      Navbar(el, params);
    }
  });

  return el;
};
