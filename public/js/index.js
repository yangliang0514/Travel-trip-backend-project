import L from "leaflet";
import { login, logout } from "./login.js";

const mapPort = document.querySelector("#map");
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

if (mapPort) {
  const locationsData = JSON.parse(mapPort.dataset.locations);

  const map = L.map("map").setView([31.111745, -118.113491], 5);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const markerArray = [];
  locationsData.forEach((loc) => {
    const reversedArr = [...loc.coordinates].reverse();

    const myIcon = L.icon({
      iconUrl: "./../img/pin.png",
      iconSize: [30, 35],
      iconAnchor: [15, 35],
    });

    L.marker(reversedArr, { icon: myIcon }).addTo(map);
    markerArray.push(reversedArr);
  });

  const bounds = L.latLngBounds(markerArray);
  map.fitBounds(bounds);

  map.scrollWheelZoom.disable();
}
