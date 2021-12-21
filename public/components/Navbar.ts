import { state } from "../state";
const pawPrint = require("url:./../img/pawprint.png");
const burguerBtn = require("url:./../img/burguerBtn.png");

export const Navbar = (el: Element, params) => {
  const component = document.createElement("div");
  component.classList.add("navbar");

  const { loged } = state.getState();
  let email: string;

  if (loged) {
    const { user } = state.getState();
    email = user.email;
  }

  component.innerHTML = `
    
  <img src="${pawPrint}" alt="Paw print img" class="pawPrint cursor-pointer" />

    ${
      loged
        ? `
    
  <div class="dropdown hidden md:inline-block relative">
    <button class="bg-main font-semibold py-2 px-4 rounded inline-flex items-center">
      <span class="mr-1">${email}</span>
      <svg class="fill-current h-4 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/> </svg>
    </button>
    <ul class="dropdown-menu absolute hidden text-gray-700 pt-2 ">
      <li class=""><p class="meButton cursor-pointer rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="#">Mis datos</p></li>
      <li class=""><p class="myPetsButton cursor-pointer bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="#">Mis mascotas reportadas</p></li>
      <li class=""><p class="reportPetButton cursor-pointer rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="#">Reportar mascota</p></li>
      <li class=""><p class="logOutButton cursor-pointer rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="#">Cerrar sesion</p></li>
    </ul>
  </div>
    
  <img src="${burguerBtn}" alt="burguer btn" class="btnMenu inline-block md:hidden cursor-pointer" />

  <div class="responsiveNav grid grid-rows-2 bg-second fixed top-0 left-0 right-0 h-screen hidden">
      <div class="flex items-end justify-center text-center font-semibold">
        <ul>
          <li><p class="meButton my-2 cursor-pointer">Mis datos</p></li>
          <li><p class="myPetsButton my-2 cursor-pointer">Mis mascotas reportadas</p></li>
          <li><p class="reportPetButton my-2 cursor-pointer">Reportar mascota</p></li>
        </ul>
      </div>

      <div class="flex items-center justify-center text-center">
          <div>
            <h3 class="text-xl">${email}</h3>
            <p class="logOutButton cursor-pointer uppercase text-main underline text-sm">Cerrar sesion</p>
          </div>
      </div>
  </div>

    `
        : `<p class="signInButton cursor-pointer">Acceder</p>`
    }

    
  `;

  const button = component.querySelector(".btnMenu");
  button?.addEventListener("click", () => {
    const responsiveNav = component.querySelector(".responsiveNav");
    responsiveNav?.classList.remove("hidden");
  });

  // Routing Listeners
  const pawPrintButton = component.querySelector(".pawPrint");
  const signInButton = component.querySelector(".signInButton");
  const meButtons = component.querySelectorAll(".meButton");
  const myPetsButtons = component.querySelectorAll(".myPetsButton");
  const reportPetButtons = component.querySelectorAll(".reportPetButton");

  pawPrintButton?.addEventListener("click", () => params.goTo("/"));
  signInButton?.addEventListener("click", () => params.goTo("/signin"));
  meButtons.forEach((button) => {
    button.addEventListener("click", () => params.goTo("/me"));
  });
  myPetsButtons.forEach((button) => {
    button.addEventListener("click", () => params.goTo("/mypets"));
  });
  reportPetButtons.forEach((button) => {
    button.addEventListener("click", () => params.goTo("/reportpet"));
  });

  // Logout
  const logOutButtons = component.querySelectorAll(".logOutButton");
  logOutButtons.forEach((button) =>
    button.addEventListener("click", () => {
      localStorage.removeItem("token");
      state.setState({
        ...state.getState(),
        loged: false,
      });
      params.goTo("/");
    })
  );

  const container = el.querySelector(".navbar-container");
  container.firstChild?.remove();
  container.appendChild(component);
};
