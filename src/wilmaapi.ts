import { fetch } from "./lib/fetch";

export const Login = async (
  Username: string,
  Password: string,
  Server: string
) => {
  let SessionID: string;
  let Wilma2SID: string;

  //* Get SessionID
  const sessionInitRequest = await fetch(`${Server}/index_json`);
  const sessionInit = await sessionInitRequest.json();
  SessionID = sessionInit.SessionID;

  //* Login
  const sessionLoginRequest = await fetch(`${Server}/login`, {
    method: "POST",
    body: new URLSearchParams({
      Login: Username,
      Password: Password,
      SESSIONID: SessionID,
      CompleteJson: "",
      format: "json",
    }).toString(),
    redirect: "manual",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (
    (sessionLoginRequest.headers.get("Location") ?? "loginfailed").includes(
      "loginfailed"
    )
  ) {
    //! Login failed
    return false;
  }

  const sessionLoginRequestCookies =
    sessionLoginRequest.headers.get("Set-Cookie");
  if (!sessionLoginRequestCookies) return false;

  //! No cookies found
  if (!sessionLoginRequest.headers.get("Set-Cookie")) return false;

  try {
    [Wilma2SID] = sessionLoginRequestCookies
      .split(", ")
      .filter((cookie) => cookie.startsWith("Wilma2SID="))[0]
      .split("=")[1]
      .split(";");
  } catch (_) {
    //! Unknown failure
    return false;
  }

  return Wilma2SID;
};
