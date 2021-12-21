import * as jwt from "jsonwebtoken";
import { Navbar } from "../components/Navbar";
import { state } from "../state";

export const initSignIn = (params) => {
  const el = document.createElement("div");

  const { loged } = state.getState();

  if (loged) {
    params.goTo("/");
  }

  el.innerHTML = `
    
    <div class="navbar-container"></div>

    <h2 class="text-3xl text-center my-8 font-bold">Ingresar</h2>
    
    <div class="errs-container"></div>

    <form class="signInForm flex justify-center">
        <div>
            <label class="text-sm block w-full uppercase">
                Email
            </label>

            <input type="text" class="emailInput rounded border-black border-2 w-60 md:w-96 block w-full h-10" autofocus />

            <input type="submit" value="Siguiente" class="font-bold bg-pink rounded w-60 block w-full h-10 my-2 cursor-pointer" />
        </div>
    </form>
    
    `;

  Navbar(el, params);

  // Validate Form
  const form = el.querySelector(".signInForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput: any = document.querySelector(".emailInput");
    const passInput: any = document.querySelector(".passInput");
    const errsContainer = document.querySelector(".errs-container");

    if (!passInput) {
      if (!/^\w+@\w+\.\w+$/.test(emailInput.value)) {
        const err = document.createElement("div");
        err.innerHTML = `
              <h2 class="w-60 md:w-96 mx-auto text-center text-red-700 bg-red-100 my-4 py-4 border-l-8 border-red-700">
                  Este email no es valido
              </h2>
              `;

        errsContainer.firstChild?.remove();
        errsContainer.appendChild(err);
      } else {
        const verifyEmail = await (
          await fetch("/api/users/" + emailInput.value)
        ).json();

        if (verifyEmail.created) {
          const newDiv = document.createElement("div");
          newDiv.innerHTML = `
                <label class="text-sm block w-full uppercase">
                    Contraseña
                </label>

                <input type="password" class="passInput rounded border-black border-2 w-60 md:w-96 block w-full h-10" autofocus />

                <input type="submit" value="Ingresar" class="font-bold bg-pink rounded w-60 block w-full h-10 my-2 cursor-pointer" />
            `;

          form.firstElementChild.remove();
          form.appendChild(newDiv);

          state.setState({
            ...state.getState(),
            userEmail: emailInput.value,
          });
        } else {
          state.setState({
            ...state.getState(),
            userEmail: emailInput.value,
          });
          params.goTo("/me");
        }
      }
    } else {
      if (passInput.value.length < 8) {
        const err = document.createElement("div");
        err.innerHTML = `
              <h2 class="w-60 md:w-96 mx-auto text-center text-red-700 bg-red-100 my-4 py-4 border-l-8 border-red-700">
                  Tu contraseña tiene que ser mas de 8 caracteres
              </h2>
              `;
        errsContainer.firstChild?.remove();
        errsContainer.appendChild(err);
      } else {
        const { userEmail } = state.getState();
        const login = await (
          await fetch("/api/users/token", {
            method: "POST",
            body: JSON.stringify({
              email: userEmail,
              password: passInput.value,
            }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
        ).json();

        if (login.msg === "wrong password") {
          const err = document.createElement("div");
          err.innerHTML = `
              <h2 class="w-60 md:w-96 mx-auto text-center text-red-700 bg-red-100 my-4 py-4 border-l-8 border-red-700">
                  Contraseña Incorrecta
              </h2>
              `;
          errsContainer.firstChild?.remove();
          errsContainer.appendChild(err);
        } else if (login.token) {
          const token = login.token;
          try {
            localStorage.setItem("token", token);
            const user = jwt.verify(token, "dwf-m7-desafio-JOUS");

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
    }
  });

  state.subscribe(() => {
    if (window.location.pathname === "/signin") {
      Navbar(el, params);
    }
  });

  return el;
};
