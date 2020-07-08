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
  mode: 'none',
};

// module.exports = {
//   entry: './src/main/js/index.tsx',
//   devtool: 'sourcemaps',
//   cache: true,
//   mode: 'development',
//   output: {
//     path: __dirname,
//     filename: './src/main/resources/static/bundle.js',
//   },
//   module: {
//     rules: [
//       {
//         test: path.join(__dirname, '.'),
//         exclude: /(node_modules)/,
//         use: [{
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env', '@babel/preset-react'],
//           },
//         }],
//       },
//       {
//         test: /\.css$/i,
//         use: ['style-loader', 'css-loader'],
//       },
//     ],
//   },
// };
