const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');



module.exports = (env = {}, argv = {}) => {

  const { mode = 'development' } = argv;

  const isProd = mode === 'production'
  const isDev = mode === 'development'

  const getStyleLoaders = () => {
    return [
      isProd ? MiniCssExtractPlugin.loader : 'style-loader',
      'css-loader'
    ]
  }

  const getPlugins = () => {
    const plugins = [
      new HtmlWebpackPlugin({
        title: 'Hello World',
        buildTime: new Date().toString(),
        template: './public/index.html',
      }),
    ];
    if (isProd) {
      plugins.push(new MiniCssExtractPlugin({
        filename: 'main-[hash:8].css'
      }))
    }

    return plugins
  };

  return {
    mode: isProd ? 'production' : isDev && 'development',

    output: {
      filename: isProd ? 'main-[hash:8].js' : undefined,
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        //* Загрузка картинок
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath: './',
                outputPath: 'images',
                name: '[name]-[sha1:hash:7].[ext]'
              }
            }
          ]
        },
        //* Загрузка шрифтов
        {
          test: /\.(ttf|otf|eot|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath: './',
                outputPath: 'fonts',
                name: '[name].[ext]'
              }
            }
          ]
        },
        //* Загрузка стилей CSS
        {
          test: /\.(css)$/,
          use: getStyleLoaders()
        },
        //* Загрузка стилей SASS/SCSS
        {
          test: /\.(s[ca]ss)$/,
          use: [...getStyleLoaders(), 'sass-loader']
        }
      ]
    },

    plugins: getPlugins(),

    devServer: {
      open: true,
    }
  }
};