const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/Frontend/contentRender.js',
  mode: 'development', // Use development mode for faster builds
  devtool: 'eval-source-map', // Faster source maps for development
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'contentRender.bundle.js',
    library: 'contentRender',
    libraryTarget: 'umd',
    globalObject: 'this',
    libraryExport: 'default',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            cacheDirectory: true, // Enable caching for faster rebuilds
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 33339,
    hot: true, // Enable Hot Module Replacement
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Enable HMR globally
  ],
};