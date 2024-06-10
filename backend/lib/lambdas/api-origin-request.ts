import { CloudFrontRequestEvent } from "aws-lambda";

const separateTokenFromCookies = (cookiesValue: any) => {
  return cookiesValue?.split(";").reduce(
    (acc: any, cur: any) => {
      const [key, value] = cur.split("=");
      if (key.trim() === "idToken") acc.idToken = value;
      else if (key.trim() === "refreshToken") acc.refreshToken = value;
      else if (key.trim() === "accessToken") acc.accessToken = value;
      else acc.cookiesWithoutIdToken.push(cur);
      return acc;
    },
    {
      cookiesWithoutIdToken: [],
      idToken: "",
      accessToken: "",
      refreshToken: "",
    }
  );
};

export const handler = async (event: CloudFrontRequestEvent) => {
  const request = event.Records[0].cf.request;
  try {
    // request.headers['x-origin-verify'] = [{ key: 'x-origin-verify', value: '1234' }];
    const cookiesHeader = request.headers["cookie"];
    const cookies = cookiesHeader.find((item) => item.key?.toLowerCase() === "cookie");
    if (!cookies) return request;
    const cookiesValue = cookies?.value;
    const { cookiesWithoutIdToken, idToken, accessToken, refreshToken } =
      separateTokenFromCookies(cookiesValue);
    request.headers["AccessToken"] = [{ key: "AccessToken", value: accessToken }];
    if (request.uri.includes("refreshToken")) {
      request.headers["refreshToken"] = [{ key: "refreshToken", value: refreshToken }];
    }
    cookies.value = cookiesWithoutIdToken.join("; ");
    request.headers["Authorization"] = [{ key: "Authorization", value: `Bearer ${idToken}` }];
  } catch (err) {
    console.log(err);
  }
  return request;
};
x;
