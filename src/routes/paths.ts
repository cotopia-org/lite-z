export const paths = {
  home: "/",
  login: {
    index: "/login",
    otp: "otp",
  },
  profile: {
    index: "/profile",
    personnel: {
      index: "personnel",
      view: ":id",
    },
    wallet: {
      index: "wallet",
      increase: "increase",
    },
    credits: {
      index: "credits",
      add: "add",
      view: ":id",
    },
    creditsHistory: "credits-history",
  },
};
