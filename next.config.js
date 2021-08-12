const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode: true,
      env: {
        HOST: "http://localhost:3000",
        ROUTER_EXCHANGE: "https://api.xircus.app/exchanges",
        MONGODB_URI:
          "mongodb+srv://jmxircus:hamL5J0ZyMDkDgrH@tokenlister.fpl5d.mongodb.net/TokenLister_dev?retryWrites=true&w=majority",
      },
    };
  }

  return {
    reactStrictMode: true,
    env: {
      HOST: "https://xircus-tokens-next.vercel.app",
      ROUTER_EXCHANGE: "https://api.xircus.app/exchanges",
      MONGODB_URI:
        "mongodb+srv://jmxircus:hamL5J0ZyMDkDgrH@tokenlister.fpl5d.mongodb.net/TokenLister?retryWrites=true&w=majority",
    },
  };
};
