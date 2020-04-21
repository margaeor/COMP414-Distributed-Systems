const REFRESH_NAME = "refresh";
const REFRESH_DAYS = 30;

function setCookie(cname: string, cvalue: string, exdays: number) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
  // TODO: Implement this call
}

export async function signUp(
  username: string,
  password: string,
  answer: string
) {
  // TODO: Implement this call
}

export async function forgotPassword(
  username: string,
  password: string,
  answer: string
) {
  // TODO: Implement this call
}

export async function renewAccessToken(): Promise<string> {
  // Todo: implement the api call
  return "abc";
}
