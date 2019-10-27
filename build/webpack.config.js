const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    index: './src/code/index.ts',
    slider: './src/code/Slider.ts',
    spin: './src/code/Spin.ts',
    progress: './src/code/Progress.ts',
    message: './src/code/Message.ts',
    tree: './src/code/Tree.ts',
    // ===============Slider================
    slider1: './src/slider/v1/index.ts',
    slider2: './src/slider/v2/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
  devServer: {
    contentBase: './dist',
    stats: 'errors-only',
    compress: false,
    host: 'localhost',
    port: 8888
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['./dist']
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['index'],
      template: './src/template/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'slider.html',
      chunks: ['slider'],
      template: './src/template/slider.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'spin.html',
      chunks: ['spin'],
      template: './src/template/spin.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'progress.html',
      chunks: ['progress'],
      template: './src/template/progress.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'message.html',
      chunks: ['message'],
      template: './src/template/message.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'tree.html',
      chunks: ['tree'],
      template: './src/template/tree.html'
    }),
    // ===============Slider================
    new HtmlWebpackPlugin({
      filename: 'slider1.html',
      chunks: ['slider1'],
      template: './src/slider/v1/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'slider2.html',
      chunks: ['slider2'],
      template: './src/slider/v2/index.html'
    }),
  ]
}
