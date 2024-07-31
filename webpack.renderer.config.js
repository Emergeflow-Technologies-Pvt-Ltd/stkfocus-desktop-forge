const rules = require("./webpack.rules");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
  devServer: {
    host: "172.20.10.2", // Set the host to 127.0.0.1
    port: 4000,
    historyApiFallback: true,
    // hot: true,
    // Other devServer options...
  },
};
