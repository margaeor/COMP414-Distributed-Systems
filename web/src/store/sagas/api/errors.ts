export class RefreshTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RefreshTokenError";
  }
}

export class ConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConnectionError";
  }
}

export class AccessTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConnectionError";
  }
}
