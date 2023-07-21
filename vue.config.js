module.exports = {
  pwa: {
    workBoxPluginMode: "InjectManifest",
    workboxOptions: {
      swDest: "./src/service-worker.js",
    },
  },
};
