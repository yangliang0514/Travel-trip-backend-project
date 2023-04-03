import axios from "axios";
import { showAlert } from "./alerts";

// Update the current user's data
export async function updateData(name, email) {
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://127.0.0.1:8080/api/v1/users/updateMe",
      data: {
        name,
        email,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Data updated successfully!");
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
}
