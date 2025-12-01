const BASE_URL = "http://localhost:3000/api";

async function verifyBackend() {
  console.log("Starting Backend Verification...");

  let accessToken = "";
  let refreshToken = "";

  try {
    console.log("\n1. Testing Login...");
    const loginResponse = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@aeropuerto.com",
        password: "admin123",
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(
        `Login failed: ${loginResponse.status} ${loginResponse.statusText}`
      );
    }

    const loginData = await loginResponse.json();
    accessToken = loginData.accessToken;

    const setCookie = loginResponse.headers.get("set-cookie");
    if (setCookie) {
      console.log("Cookie received:", setCookie);
      refreshToken = setCookie.split(";")[0];
    }

    console.log("Login Successful!");
    console.log("Access Token:", accessToken ? "Received" : "Missing");
  } catch (error) {
    console.error("Login Error:", error.message);
    return;
  }

  try {
    console.log("\n2. Testing Get Profile...");
    const profileResponse = await fetch(`${BASE_URL}/auth/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      const errText = await profileResponse.text();
      throw new Error(
        `Get Profile failed: ${profileResponse.status} ${profileResponse.statusText} - ${errText}`
      );
    }

    const profileData = await profileResponse.json();
    console.log("Profile Retrieved:", profileData.email);
  } catch (error) {
    console.error("Get Profile Error:", error.message);
  }

  try {
    console.log("\n3. Testing Refresh Token...");
    const refreshResponse = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        Cookie: refreshToken,
      },
    });

    if (!refreshResponse.ok) {
      console.log(`Refresh Token failed: ${refreshResponse.status}`);
    } else {
      const refreshData = await refreshResponse.json();
      if (refreshData.accessToken) {
        console.log("Token Refreshed Successfully!");
        accessToken = refreshData.accessToken;
      }
    }
  } catch (error) {
    console.error("Refresh Token Error:", error.message);
  }

  try {
    console.log("\n4. Testing Logout...");
    const logoutResponse = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: {
        Cookie: refreshToken,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (logoutResponse.ok) {
      console.log("Logout Successful!");
    } else {
      const errText = await logoutResponse.text();
      console.log(`Logout failed: ${logoutResponse.status} - ${errText}`);
    }
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
}

verifyBackend();
