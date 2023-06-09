import { login, logout } from "./_login";
import displayMap from "./_map";
import { updateSettings } from "./_updateUser";
import { bookTour } from "./_stripe";

const mapPort = document.querySelector("#map");
const loginForm = document.querySelector(".form--login");
const userDataForm = document.querySelector(".form-user-data");
const nameField = document.querySelector("#name");
const emailField = document.querySelector("#email");
const passwordField = document.querySelector("#password");
const logOutBtn = document.querySelector(".nav__el--logout");
const userPasswordForm = document.querySelector(".form-user-password");
const passwordCurrField = document.querySelector("#password-current");
const newPasswordField = document.querySelector("#password");
const passwordConfField = document.querySelector("#password-confirm");
const savePasswordBtn = document.querySelector(".btn--save-password");
const bookBtn = document.querySelector("#book-tour");

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

    // a web api for creating an object that can send data like using form with encode in html
    const form = new FormData();
    // injecting the data in
    form.append("name", nameField.value);
    form.append("email", emailField.value);
    form.append("photo", document.getElementById("photo").file[0]);

    updateSettings(form, "data");
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // telling the user password is updating... (before the await)
    savePasswordBtn.textContent = "Updating...";
    await updateSettings(
      {
        passwordCurrent: passwordCurrField.value,
        password: newPasswordField.value,
        passwordConfirm: passwordConfField.value,
      },
      "password"
    );
    // change the button text back
    savePasswordBtn.textContent = "Save Password";
    // clear the input fields, after the password was updated
    passwordCurrField.value = "";
    newPasswordField.value = "";
    passwordConfField.value = "";
  });
}

if (bookBtn) {
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    const tourId = e.target.dataset.tourId;
    bookTour(tourId);
  });
}
