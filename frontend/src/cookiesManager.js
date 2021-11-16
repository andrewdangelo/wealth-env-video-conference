import jsCookie from "js-cookie";

const USER_COOKIE = 'mediasoup-demo.user';
const DEVICES_COOKIE = 'mediasoup-demo.devices';

export function getUser() {
  return JSON.parse(localStorage.getItem(USER_COOKIE));
}

export function setUser({ displayName }) {
  localStorage.setItem(USER_COOKIE, JSON.stringify({ displayName }));
}

export function getDevices() {
  return JSON.parse(localStorage.getItem(DEVICES_COOKIE));
}

export function setDevices({ webcamEnabled }) {
  localStorage.setItem(DEVICES_COOKIE, JSON.stringify({ webcamEnabled }));
}
