module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/main.js",
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
  devServer: {
    host: "0.0.0.0", // Set the host to 127.0.0.1
    port: 4000,
    historyApiFallback: true,
    // hot: true,
    // Other devServer options...
  },
};
