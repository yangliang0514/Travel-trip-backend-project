const loginForm = document.querySelector(".form--login");
const emailField = document.querySelector("#email");
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

async function login(email, password) {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8080/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
}

async function logout() {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:8080/api/v1/users/logout",
    });
    if (res.data.status === "success") {
      location.assign("/");
      // location.reload(true);
    }
  } catch (err) {
    showAlert("error", "Error loggingout, try again!");
  }
}

function showAlert(type, message) {
  hideAlert();
  const html = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", html);
  setTimeout(hideAlert, 5000);
}

function hideAlert() {
  const el = document.querySelector(".alert");
  if (el) el.remove();
}
