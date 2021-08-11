const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode: true,
      env: {
        HOST: "http://localhost:3000",
        ROUTER_EXCHANGE: "https://api.xircus.app/exchanges",
        MONGODB_DB: "tokenlister_dev",
        MONGODB_URI: "mongodb+srv://jmxircus:hamL5J0ZyMDkDgrH@tokenlister.fpl5d.mongodb.net",
      },
    };
  }

  return {
    reactStrictMode: true,
    env: {
      HOST: "https://xircus-tokens-next.vercel.app",
      ROUTER_EXCHANGE: "https://api.xircus.app/exchanges",
      MONGODB_DB: "tokenlister",
      MONGODB_URI: "mongodb+srv://jmxircus:hamL5J0ZyMDkDgrH@tokenlister.fpl5d.mongodb.net",
    },
  };
};
