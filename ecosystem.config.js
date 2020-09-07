module.exports = {
  apps: [
    {
      name: "app",
      script: "./server/index.js",
      instances: "1",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};

// module.exports = {
//   apps: [
//     {
//       script: "server/index.js",
//       watch: ".",
//     },
//     {
//       script: "./service-worker/",
//       watch: ["./service-worker"],
//     },
//   ],

//   deploy: {
//     production: {
//       user: "SSH_USERNAME",
//       host: "SSH_HOSTMACHINE",
//       ref: "origin/master",
//       repo: "GIT_REPOSITORY",
//       path: "DESTINATION_PATH",
//       "pre-deploy-local": "",
//       "post-deploy":
//         "npm install && pm2 reload ecosystem.config.js --env production",
//       "pre-setup": "",
//     },
//   },
// };
