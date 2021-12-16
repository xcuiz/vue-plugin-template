const getPublicPath = () => (process.env.NODE_ENV === "production" ? "" : "/a");

module.exports = {
  getPublicPath,
};
