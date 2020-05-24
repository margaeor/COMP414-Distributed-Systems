import { RefreshTokenError, ConnectionError } from "./errors";
import { sleep } from "./utils";
import { User } from "../../types";
import axios from "axios";

const REFRESH_NAME = "refresh";
const REFRESH_DAYS = 30;

function setCookie(cname: string, cvalue: string, exdays: number) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie =
    cname + "=" + cvalue + ";" + expires + ";path=/;sameSite=secure";
}

function getCookie(cname: string) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setRefreshToken(token: string) {
  setCookie(REFRESH_NAME, token, REFRESH_DAYS);
}

function getRefreshToken(): string {
  return getCookie(REFRESH_NAME);
}

export async function checkRefreshToken(): Promise<boolean> {
  // Todo: implement the api call
  return true;
}

export async function renewRefreshToken(username: string, password: string) {
  try {
    const res = await axios.get("/login", {
      params: {
        username,
        password,
      },
    });
    console.log(res);
  } catch (e) {
    throw new ConnectionError(e.message);
  }
}

export async function signUp(
  username: string,
  password: string,
  answer: string
) {
  // TODO: Implement this call
  await sleep(200);
}

export async function changePassword(
  username: string,
  password: string,
  answer: string
) {
  // TODO: Implement this call
  await sleep(200);
}

export async function renewAccessToken(): Promise<{
  token: string;
  user: User;
}> {
  // Todo: implement the api call
  await sleep(200);
  if (getRefreshToken() === "") throw new RefreshTokenError("poopie");
  return Math.random() > 0.5
    ? {
        token: "vetIO",
        user: {
          username: "vetIO",
          admin: true,
          officer: false,
          email: "vet@prohax.io",
        },
      }
    : {
        token: "killX",
        user: {
          username: "killX",
          admin: true,
          officer: false,
          email: "vet@prohax.io",
        },
      };
}

export async function requestLogout() {
  await sleep(200);
  setRefreshToken("");
}
