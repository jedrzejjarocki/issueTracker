const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: './src/main/js/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: __dirname,
    filename: './src/main/resources/static/bundle.js',
  },
  mode: 'production',
  optimization: {
    minimize: true,
  },
  plugins: [new CompressionPlugin()],
};
