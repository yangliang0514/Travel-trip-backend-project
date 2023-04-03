import axios from "axios";

export async function login(email, password) {
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

export async function logout() {
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
