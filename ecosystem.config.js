module.exports = {
  apps: [
    {
      name: "node-server",
      script: "./build/app.js",
      instances: 1,
      exec_mode: "cluster",
      listen_timeout: 60 * 10 * 1000,
      watch: false,
    },
  ],
};