const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode: true,
      env: {
        HOST: "http://localhost:3000",
        ROUTER_EXCHANGE: "https://api.xircus.app/exchanges",
      },
    };
  }

  return {
    reactStrictMode: true,
    env: {
      HOST: "https://pairs.xircus.app",
      ROUTER_EXCHANGE: "https://api.xircus.app/exchanges",
    },
  };
};
