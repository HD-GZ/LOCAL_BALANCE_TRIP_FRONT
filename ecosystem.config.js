module.exports = {
  apps: [
    {
      name: process.env.DEPLOY_APP_NAME || "nextjs",
      cwd: __dirname,
      script: "./node_modules/next/dist/bin/next",
      interpreter: process.execPath,
      args: ["start", "--port", process.env.PORT || "3000"],
      env: { NODE_ENV: "production" },
    },
  ],
};
