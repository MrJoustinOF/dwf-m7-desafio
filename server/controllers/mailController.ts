import * as sgMail from "@sendgrid/mail";
import { Pet, User } from "../models";
import { SENDGRID_API_KEY } from "../config";

const sendPetReport = async (req, res) => {
  const { name, phone, message, petId } = req.body;
  sgMail.setApiKey(SENDGRID_API_KEY);

  const pet = await Pet.findOne({
    where: {
      id: petId,
    },
    include: User,
  });

  const user: any = pet.get("User");
  const namePet = pet.get("name");
  const to = user.get("email");

  const msg = {
    to,
    from: "ortizjoustindev@gmail.com",
    subject: "Somebody has found your pet",
    html:
      '<h2 style="background: #ff6868; text-align: center; padding: 20px 0; color: #E5E5E5">Hello, somebody called ' +
      name +
      ' has found your pet "' +
      namePet +
      '", the message is: "' +
      message +
      '", you can contact them by: ' +
      phone +
      "</h2>",
  };

  try {
    const sendEmail = await sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }

  res.json({ msg: "email sent" });
};

export { sendPetReport };
