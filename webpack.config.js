var path = require("path");
module.exports = {
  entry: {
    app: ["./resources/js/index.js"]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  output: {
    path: path.resolve(__dirname, "build/js"),
    publicPath: "/js/",
    filename: "bundle.js"
  }
};