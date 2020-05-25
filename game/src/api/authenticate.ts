import jwt from "jsonwebtoken";

/**
 * Takes as input the token of the user and returns
 * his username if it's valid and null if its not.
 */
export function checkToken(token: string): string | null {
  type Token = {
    data: {
      username: string;
      roles: Array<string>;
    };
  };
  const key = process.env.JWT_PUBLIC_KEY as string;
  let decoded: Token;

  try {
    decoded = jwt.verify(
      token,
      Buffer.from(key, "base64").toString("ascii")
    ) as Token;
  } catch (e) {
    return null;
  }

  if (
    !decoded ||
    !decoded.data ||
    !decoded.data.username ||
    !decoded.data.roles ||
    !Array.isArray(decoded.data.roles)
  )
    return null;

  return decoded.data.username;
}
