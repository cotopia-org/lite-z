// colors.ts
export const getCSSVariableValue = (variable: string) => {
  if (typeof window !== "undefined") {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim()
  }
  return ""
}

export const colors = {
  primary: {
    default: getCSSVariableValue("--primary"),
    background: getCSSVariableValue("--primary-background"),
    primaryForeground: getCSSVariableValue("--primary-foreground"),
    primaryLabel: getCSSVariableValue("--primary-label"),
    primaryLight: getCSSVariableValue("--primary-light"),
    body: getCSSVariableValue("--primary-body"),
  },
  grayscale: {
    grayscaleCaption: getCSSVariableValue("--grayscale-caption"),
    subtitle: getCSSVariableValue("--grayscale-subtitle"),
  },
  secondary: {
    default: getCSSVariableValue("--secondary"),
    foreground: getCSSVariableValue("--secondary-foreground"),
  },
  destructive: getCSSVariableValue("--destructive"),
  background: getCSSVariableValue("--background"),
  foreground: getCSSVariableValue("--foreground"),
  error: {
    default: getCSSVariableValue("--error"),
    "surface-default": getCSSVariableValue("--error-surface-default"),
  },
  warning: {
    default: getCSSVariableValue("--warning"),
    light: getCSSVariableValue("--warning-light"),
  },
  success: {
    default: getCSSVariableValue("--success"),
    "surface-default": getCSSVariableValue("--success-surface-default"),
  },
  // Add more as needed
}

export const VARZ = {
  apiBaseUrl: process.env.REACT_APP_PUBLIC_API_URL,
  domain: process.env.REACT_APP_PUBLIC_PUBLIC_HOME_URL,
  serverUrl: process.env.REACT_APP_PUBLIC_LK_SERVER_URL,
  socketUrl: process.env.REACT_APP_PUBLIC_SOOCKET_URL ?? "",
  dashboardPage: "/dashboard",
  loginPage: `/auth/login`,
  registerPage: `/auth/register`,
  forgetPasswordPage: `/auth/forget-password`,
  signOutApiPage: `/api/auth/sign-out`,
  collisionMargin: 70,
  voiceAreaRadius: 200,
  defaultPositionOfUserX: 400,
  jailWidth: 3800,
  jailHeight: 1700,
  sidebarWidth: 376,
  jailNodeId: "jail-node-custom",
  jailNodeType: "jailNode",
  shareScreenNodeType: "shareScreenNode",
  backgroundNodeType: "bgNode",
  defaultPerPage: 20,
  pagesLimitDiff: 6,
  defaultPositionOfUserY: 400,
  teleportMargin: 40,
  userTimeTrackerId: "user-timer-tracker",
}
