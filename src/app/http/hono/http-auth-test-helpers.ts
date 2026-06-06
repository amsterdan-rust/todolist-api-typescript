type TestApp = {
  request: (path: string, init?: RequestInit) => Response | Promise<Response>;
};

export const signUpAndGetAuthCookie = async (app: TestApp) => {
  const response = await app.request("/auth/sign-up/email", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: "Test User",
      email: `test-${crypto.randomUUID()}@example.com`,
      password: "password123",
    }),
  });

  const cookie = response.headers.get("set-cookie");

  if (!cookie) throw new Error("Auth cookie was not returned.");

  return cookie;
};

export const makeAuthHeaders = async (app: TestApp) => ({
  cookie: await signUpAndGetAuthCookie(app),
});
