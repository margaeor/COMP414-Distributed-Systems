import {
  RefreshTokenError,
  ConnectionError,
  WrongParametersError,
} from "./errors";
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
  return getRefreshToken() !== "";
}

export async function renewRefreshToken(username: string, password: string) {
  try {
    const { data } = await axios.get("auth/login", {
      params: {
        username,
        password,
      },
    });

    if (data.status !== 200) {
      throw new WrongParametersError(
        data.error || `Unknown Error: ${data.status}`
      );
    } else {
      setRefreshToken(data.refresh_token);
    }
  } catch (e) {
    if (e instanceof WrongParametersError) throw e;
    throw new ConnectionError(e.message);
  }
}

export async function signUp(
  username: string,
  password: string,
  email: string,
  answer: string
) {
  try {
    const { data } = await axios.get("auth/create", {
      params: {
        username,
        password,
        email,
        secret: answer,
      },
    });

    if (data.status !== 200) {
      throw new WrongParametersError(
        data.error || `Unknown Error: ${data.status}`
      );
    } else {
      setRefreshToken(data.refresh_token);
    }
  } catch (e) {
    if (e instanceof WrongParametersError) throw e;
    throw new ConnectionError(e.message);
  }
}

export async function changePassword(
  username: string,
  password: string,
  answer: string
) {
  try {
    const { data } = await axios.get("auth/forgot", {
      params: {
        username,
        password,
        secret: answer,
      },
    });

    if (data.status !== 200) {
      throw new WrongParametersError(
        data.error || `Unknown Error: ${data.status}`
      );
    } else {
      setRefreshToken(data.refresh_token);
    }
  } catch (e) {
    if (e instanceof WrongParametersError) throw e;
    throw new ConnectionError(e.message);
  }
}

export async function renewAccessToken(): Promise<{
  token: string;
  user: User;
}> {
  try {
    const { data } = await axios.get("auth/refresh_token", {
      params: {
        refresh_token: getRefreshToken(),
      },
    });

    if (data.status !== 200) {
      throw new RefreshTokenError(
        data.error || `Unknown Error: ${data.status}`
      );
    } else {
      setRefreshToken(data.refresh_token);
      return {
        token: data.jwt,
        user: {
          username: data.username,
          officer: data.roles.includes("official"),
          admin: data.roles.includes("admin"),
          email: "",
        },
      };
    }
  } catch (e) {
    if (e instanceof RefreshTokenError) throw e;
    throw new ConnectionError(e.message);
  }
}

export async function requestLogout() {
  await sleep(200);
  setRefreshToken("");
}
