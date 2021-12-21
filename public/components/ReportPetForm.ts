const closeIcon = require("url:./../img/closeIcon.png");

export const ReportPetForm = ({ objectID, name }) => {
  const id = objectID;
  const home = document.querySelector(".root").firstElementChild;
  const reportPetButton = document.querySelector("#report-pet-" + id);
  const form = document.createElement("div");
  form.classList.add("w-full");
  form.classList.add("h-full");
  form.classList.add("fixed");
  form.classList.add("top-0");
  form.classList.add("left-0");
  form.classList.add("right-0");
  form.classList.add("bg-black-opacity");
  form.classList.add("flex");
  form.classList.add("justify-center");
  form.classList.add("items-center");
  form.id = "report-form-" + id;

  reportPetButton.addEventListener("click", () => {
    form.innerHTML = `
    
        <div class="bg-white w-60 md:w-96 px-4 py-8 rounded">

            <div class="flex justify-end">
                <img src="${closeIcon}" alt="close-icon" class="closeFormButton w-4 h-4 cursor-pointer" />
            </div>

            <div>
                <h2 class="text-center text-2xl font-bold">Reportar info de ${name}</h2>

                <div class="errsContainer"></div>

                <form class="reportForm">
                    <div class="my-4">
                        <label class="text-sm block w-full uppercase">
                            Tu nombre
                        </label>

                        <input type="text" class="nameReport rounded border-black border-2 block w-full h-10" autofocus />
                    </div>

                    <div class="my-4">
                        <label class="text-sm block w-full uppercase">
                            Tu telefono
                        </label>

                        <input type="text" class="phoneReport rounded border-black border-2 block w-full h-10" />
                    </div>

                    <div class="my-4">
                        <label class="text-sm block w-full uppercase">
                            Donde lo viste?
                        </label>

                        <textarea name="messageReport" id="messageReport" cols="30" rows="10" class="messageReport rounded border-black border-2 block w-full"></textarea>
                    </div>
        
                    <input id="submitReportPet" type="submit" value="Enviar" class="font-bold bg-pink rounded w-60 block w-full h-10 my-2 cursor-pointer" />
        
                </form>
            </div>
        </div>
    
    `;

    const closeFormButton = form.querySelector(".closeFormButton");
    closeFormButton.addEventListener("click", () => form.remove());

    const nameReport: HTMLInputElement = form.querySelector(".nameReport");
    const phoneReport: HTMLInputElement = form.querySelector(".phoneReport");
    const messageReport: HTMLInputElement =
      form.querySelector(".messageReport");

    const reportForm = form.querySelector(".reportForm");
    reportForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errs = [];

      if (
        nameReport.value.length === 0 ||
        phoneReport.value.length === 0 ||
        messageReport.value.length === 0
      ) {
        errs.push("Todos los campos son necesarios");
      } else if (nameReport.value.length < 4 && nameReport.value.length !== 0) {
        errs.push("Tu nombre debe tener al menos 4 caracteres");
      } else if (
        phoneReport.value.length < 10 &&
        phoneReport.value.length !== 0
      ) {
        errs.push("Tu telefono debe tener al menos 10 digitos");
      } else if (
        messageReport.value.length < 5 &&
        messageReport.value.length !== 0
      ) {
        errs.push("Debes poner un poco mas de informacion de la mascota");
      }

      if (errs.length !== 0) {
        const errsContainer = document.querySelector(".errsContainer");
        const div = document.createElement("div");
        errs.map((err) => {
          div.innerHTML += `
        
            <h2 class="mx-auto text-center text-red-700 bg-red-100 my-4 py-4 border-l-8 border-red-700">
                ${err}
            </h2>
        
        `;
        });
        errsContainer.firstChild?.remove();
        errsContainer.firstElementChild?.remove();
        errsContainer.appendChild(div);
      } else {
        const name = nameReport.value;
        const phone = phoneReport.value;
        const message = messageReport.value;
        const petId = id;

        const sendMail = await (
          await fetch("/api/sendmail", {
            method: "POST",
            body: JSON.stringify({
              name,
              phone,
              message,
              petId,
            }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })
        ).json();

        if (sendMail.msg === "email sent") {
          const successMessage = document.createElement("div");

          successMessage.innerHTML = `
                <h2 class="mx-auto text-center text-green-700 bg-green-100 my-4 py-4 border-l-8 border-green-700">
                    Se ha reportado esta mascota correctamente
                </h2>
            `;

          form.firstElementChild.lastElementChild.remove();
          form.firstElementChild.appendChild(successMessage);
        }
      }
    });

    home.appendChild(form);
  });
};
