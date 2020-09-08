const checkJWT = () => {
  if (!process.env.jwtPrivateKey) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
  }
};
module.exports = checkJWT;
