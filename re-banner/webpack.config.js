const path = require('path');

const mode = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

module.exports = {
  mode: mode,
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.css', '.js', '.jsx', 'ur'],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  output: {
    filename: 're-banner.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: "source-map",
};