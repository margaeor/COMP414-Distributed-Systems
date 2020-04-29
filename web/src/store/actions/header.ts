export const GO_HOME = "GO_HOME";
export const GO_ADMIN = "GO_ADMIN";
export const GO_LEADERBOARD = "GO_LEADERBOARD";
export const LOGOUT = "LOGOUT";

export function goHome() {
  return {
    type: GO_HOME,
  };
}

export function goAdmin() {
  return {
    type: GO_ADMIN,
  };
}

export function goLeaderboard() {
  return {
    type: GO_LEADERBOARD,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}
