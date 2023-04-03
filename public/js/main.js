import { login, logout } from "./_login";
import displayMap from "./_map";
import { updateSettings } from "./_updateUser";

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
    updateSettings({ name: nameField.value, email: emailField.value }, "data");
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
