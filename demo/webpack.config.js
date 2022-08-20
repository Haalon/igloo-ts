const path = require('path');

module.exports = {
  entry: './demo.js',
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.(vert|frag|glsl|css|svg)$/i,
  //       use: 'raw-loader'
  //     }
  //   ]
  // }
};