import {
  getContacts,
  addNewContact,
  getContactsById,
  updateContact,
  deleteContact,
} from "../controllers/crmController";
import { login, register, loginRequired } from "../controllers/userController";

const routes = (app) => {
  app
    .route("/contact")
    .get(
      (req, res, next) => {
        //middleware
        console.log(`request from ${req.originalUrl}`);
        console.log(`request type: ${req.method}`);
        next();
      },
      loginRequired,
      getContacts
    )
    .post(loginRequired, addNewContact);
  app
    .route("/contact/:contactID")
    .get(loginRequired, getContactsById)
    .put(loginRequired, updateContact)
    .delete(loginRequired, deleteContact);
  app.route("/auth/register").post(register);
  app.route("/login").post(login);
};

export default routes;
