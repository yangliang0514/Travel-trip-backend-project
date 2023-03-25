const loginForm = document.querySelector(".form");
const emailField = document.querySelector("#email");
const passwordField = document.querySelector("#password");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  login(emailField.value, passwordField.value);
});

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
      alert("Logged in successfully!");
      setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
}
