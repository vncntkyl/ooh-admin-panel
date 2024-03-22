import Cookies from "js-cookie";
const server = "https://oohplatformapi.retailgate.tech:20601";

export const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
};

export const endpoints = {
  roles: server + "/user/roles",
  users: server + "/user",
};
