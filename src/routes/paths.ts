export const paths = {
  dashboard: "dashboard",
  auth: {
    index: "auth",
    login: "login",
    register: "register",
    ["forget-password"]: "forget-password",
  },
  invite: "invite",
  workspaces: {
    index: "workspaces",
    create: "create",
    view: ":slug",
    rooms: {
      index: "rooms",
      view: ":room_id",
    },
  },
};
