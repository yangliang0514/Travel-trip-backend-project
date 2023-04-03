import { login, logout } from "./login";
import displayMap from "./map";
import { updateData } from "./updateUser";

const mapPort = document.querySelector("#map");
const loginForm = document.querySelector(".form--login");
const userDataForm = document.querySelector(".form-user-data");
const emailField = document.querySelector("#email");
const nameField = document.querySelector("#name");
const passwordField = document.querySelector("#password");
const logOutBtn = document.querySelector(".nav__el--logout");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login(emailField.value, passwordField.value);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener("click", logout);
}

if (mapPort) {
  const locationsData = JSON.parse(mapPort.dataset.locations);
  displayMap(locationsData);
}

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    updateData(nameField.value, emailField.value);
  });
}
