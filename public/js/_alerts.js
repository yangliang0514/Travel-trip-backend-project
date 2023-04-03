export function showAlert(type, message) {
  hideAlert();
  const html = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", html);
  setTimeout(hideAlert, 5000);
}

export function hideAlert() {
  const el = document.querySelector(".alert");
  if (el) el.remove();
}
