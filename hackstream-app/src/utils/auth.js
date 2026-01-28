export const getUser = () =>
  JSON.parse(localStorage.getItem("hackstreamUser"));

export const logout = () =>
  localStorage.removeItem("hackstreamUser");
