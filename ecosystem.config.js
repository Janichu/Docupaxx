module.exports = {
  apps: [
    {
      name: "team7-codedeploy",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
