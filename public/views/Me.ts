import * as jwt from "jsonwebtoken";
import { Navbar } from "../components/Navbar";
import { state } from "../state";

export const initMe = (params) => {
  const el = document.createElement("div");

  const { loged, userEmail } = state.getState();
  let name: string;
  let password: string;

  if (loged) {
    const { user } = state.getState();
    name = user.name;
    password = user.password;
  } else if (!loged && !userEmail) {
    params.goTo("/");
  }

  el.innerHTML = `
    
    <div class="navbar-container"></div>
    <h2 class="text-center text-3xl my-8 font-bold">Mis datos</h2>
    
    <div class="errs-container"></div>

    <form class="meForm flex justify-center">
        <div>
            <label class="text-sm block w-full uppercase">
                Nombre
            </label>

            <input value="${
              loged ? name : ""
            }" type="text" class="nameInput rounded border-black border-2 w-60 md:w-96 block w-full h-10" autofocus />

            <label class="text-sm block w-full uppercase mt-8">
                Contraseña
            </label>

            <input value="${
              loged ? password : ""
            }" type="password" class="passInput rounded border-black border-2 w-60 md:w-96 block w-full h-10" />

            <label class="text-sm block w-full uppercase mt-2">
                Repetir contraseña
            </label>

            <input value="${
              loged ? password : ""
            }" type="password" class="confirmPassInput rounded border-black border-2 w-60 md:w-96 block w-full h-10" />

            <input type="submit" value="Guardar" class="font-bold bg-pink rounded w-60 block w-full h-10 my-2 cursor-pointer" />
        </div>
    </form>
    
    `;

  Navbar(el, params);

  // Validate form
  const form = el.querySelector(".meForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const errsContainer: HTMLDivElement =
      document.querySelector(".errs-container");
    const nameInput: HTMLInputElement = document.querySelector(".nameInput");
    const passInput: HTMLInputElement = document.querySelector(".passInput");
    const confirmPassInput: HTMLInputElement =
      document.querySelector(".confirmPassInput");
    let errs = [];

    if (
      nameInput.value.length === 0 ||
      passInput.value.length === 0 ||
      confirmPassInput.value.length === 0
    ) {
      errs.push("Todos los campos son necesarios");
    }

    if (nameInput.value.length < 4 && nameInput.value.length !== 0) {
      errs.push("Tu nombre tiene que tener al menos 4 caracteres");
    }

    if (passInput.value.length < 8 && passInput.value.length !== 0) {
      errs.push("Tu contraseña debe tener al menos 8 caracteres");
    }

    if (passInput.value !== confirmPassInput.value) {
      errs.push("Las contraseñas no coinciden");
    }

    if (errs.length === 0) {
      if (loged) {
        // Update user way
        const { user } = state.getState();
        const { id, email } = user;
        const updateUser = await (
          await fetch("/api/users/" + id, {
            method: "PUT",
            body: JSON.stringify({
              name: nameInput.value,
              email,
              password: passInput.value,
            }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
        ).json();

        if (updateUser.msg === "user updated" && updateUser.token) {
          try {
            const user = jwt.verify(updateUser.token, process.env.SECRET);

            localStorage.setItem("token", updateUser.token);

            state.setState({
              ...state.getState(),
              user,
            });
          } catch (err) {
            console.error(err);
          }
          params.goTo("/");
        }
      } else {
        // Sign up way
        const email = state.getState().userEmail;

        const signUp = await (
          await fetch("/api/users/", {
            method: "POST",
            body: JSON.stringify({
              name: nameInput.value,
              email,
              password: passInput.value,
            }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
        ).json();

        if (signUp.msg === "user saved" && signUp.token) {
          try {
            const user = jwt.verify(signUp.token, process.env.SECRET);

            localStorage.setItem("token", signUp.token);

            state.setState({
              ...state.getState(),
              loged: true,
              user,
            });
          } catch (err) {
            console.error(err);
          }
          params.goTo("/");
        }
      }
    } else {
      const errsDiv = document.createElement("div");
      errs.map((err) => {
        errsDiv.innerHTML += `
          <h2 class="w-60 md:w-96 mx-auto text-center text-red-700 bg-red-100 my-4 py-4 border-l-8 border-red-700">
            ${err}
          </h2>
        `;
      });
      errsContainer.firstChild?.remove();
      errsContainer.appendChild(errsDiv);
    }
  });

  state.subscribe(() => {
    if (window.location.pathname === "/me") {
      Navbar(el, params);
    }
  });

  return el;
};
