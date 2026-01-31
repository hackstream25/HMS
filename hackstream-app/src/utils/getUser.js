export const getUser = () => {
  const data = localStorage.getItem("hackstreamUser");
  return data ? JSON.parse(data) : null;
};
