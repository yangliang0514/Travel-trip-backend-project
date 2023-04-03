import axios from "axios";
import { showAlert } from "./_alerts";

// Update the current user's data
// type is either "password" or "data"
// data is a object for the data user wants to update
export async function updateSettings(data, type) {
  try {
    let url;
    if (type === "password") url = "updateMyPassword";
    if (type === "data") url = "updateMe";

    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:8080/api/v1/users/${url}`,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
}
