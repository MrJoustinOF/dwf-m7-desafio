import { ReportPetForm } from "./ReportPetForm";
import { state } from "../state";

export const NearPetsCards = async () => {
  const { nearPets } = state.getState();

  const nearPetsContainer = document.querySelector(".nearPetsContainer");
  const component = document.createElement("div");
  component.classList.add("md:grid");
  component.classList.add("grid-cols-3");

  nearPets.map((pet) => {
    const { objectID, name, image, refPlace, found } = pet;

    component.innerHTML += `
          
      <div class="w-60 border-2 border-black mx-auto my-4">
        <img src="${image}" alt="pet-img" class="w-full block" />

        <div class="mx-4 my-2 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-semibold">${name}</h2>
            <p class="uppercase">${refPlace}</p>
          </div>

            <p id="report-pet-${objectID}" class="cursor-pointer text-right text-blue underline">Reportar informacion</p>
        </div>
            
            ${
              found
                ? '<p class="mx-4 my-2 text-green uppercase">Encontrado</p>'
                : ""
            }
      </div>
          
          `;

    setTimeout(() => {
      ReportPetForm(pet);
    }, 1000);
  });

  nearPetsContainer.firstChild?.remove();
  nearPetsContainer.firstElementChild?.remove();
  nearPetsContainer.appendChild(component);
};
