const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  // Entry / Output
  entry: "./src/App.tsx",
  output: {
    filename: "bundle.[hash:8].js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: "./dist",
    port: 3000,
    hot: true,
    host: "0.0.0.0",
    disableHostCheck: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Setup template
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      minify: true,
    }),
  ],
  module: {
    rules: [
      {
        // Javascript Files
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        // CSS Files / Styling
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        // Image Support
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: { name: "./img/[name].[contenthash:8].[ext]" },
        },
      },
      {
        // Fonts
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: "file-loader",
          options: { name: "./res/[name].[contenthash:8].[ext]" },
        },
      },
    ],
  },
};

if (process.env.NODE_ENV === "development") {
  module.exports.mode = "development";
  module.exports.devtool = "inline-source-map";
  module.exports.optimization = {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  };
  module.exports.output.pathinfo = false;
  module.exports.output.filename = "bundle.js";
} else {
  module.exports.mode = "production";
  module.exports.optimization = {
    splitChunks: {
      chunks: "async",
    },
  };
}
