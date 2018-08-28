const path = require('path')
const webpack = require('webpack')
const WebpackCleanPlugin = require('clean-webpack-plugin')
const WebpackCopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackMiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackHTMLPlugin = require('html-webpack-plugin')

const CWD = process.cwd()
const BUILD = path.resolve(CWD, 'build')
const SRC = path.resolve(CWD, 'src')

const PRODUCTION = process.env.NODE_ENV === 'production'

const plugins = [
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development'
  }),
  new WebpackHTMLPlugin({
    hash: true,
    inject: false,
    minify: PRODUCTION ? {
      html5: true,
      collapseWhitespace: true
    } : false,
    chunks: ['app'],
    template: './html',
    filename: 'index.html'
  })
]

if (PRODUCTION) {
  plugins.unshift(
    new WebpackCleanPlugin([BUILD], {
      root: CWD
    }),
    new WebpackMiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
      chunkFilename: '[id].[chunkhash].css'
    })
  )
} else {
  plugins.unshift(
    new webpack.HotModuleReplacementPlugin(),
    new WebpackCopyWebpackPlugin([
      'json/data.json'
    ])
  )
}

const cssModules =
  [
    [/src\/js/, true, /\.scss$/, 'sass'],
    [/src\/scss/, false, /\.scss$/, 'sass'],
    [/node_modules/, false, /\.scss$/, 'sass'],
    [/node_modules/, false, /\.css$/, 'css']
  ].map(([include, modules, test, loader]) => {
    const use = [
      PRODUCTION ? WebpackMiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules,
          minimize: PRODUCTION,
          sourceMap: !PRODUCTION
        }
      }
    ]

    const preprocessors = [{
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        plugins: (loader) => [
          require('postcss-cssnext')()
        ]
      }
    }, 'resolve-url-loader', {
      loader: `${loader}-loader`,
      options: {
        sourceMap: true
      }
    }]

    if (loader !== 'css') {
      use.push(...preprocessors)
    }

    return {
      include,
      test,
      use
    }
  })

module.exports = {
  plugins,
  context: SRC,
  entry: {
    app: [
      'babel-polyfill',
      'whatwg-fetch',
      './js/app',
      './scss/app'
    ]
  },
  devtool: PRODUCTION ? false : 'inline-source-map',
  module: {
    rules: [{
      test: /\.(eot|woff2?|ttf|svg)/,
      include: /font/,
      use: [{
        loader: 'file-loader',
        query: {
          name: 'asset/font/[name].[ext]?[hash]'
        }
      }]
    }, {
      test: /\.(jpg|png|svg|gif)/,
      include: /img/,
      use: [{
        loader: 'file-loader',
        query: {
          name: 'asset/img/[name].[ext]?[hash]'
        }
      }, 'img-loader']
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          plugins: PRODUCTION && [require('babel-plugin-transform-remove-console')]
        }
      }]
    }, {
      test: /\.yml$/,
      use: ['json-loader', 'yaml-loader']
    }].concat(cssModules)
  },
  output: {
    filename: '[name].[hash].js',
    path: BUILD,
    publicPath: '/'
  },
  mode: PRODUCTION ? 'production' : 'development',
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: (module) => {
            if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
              return false
            }

            return module.context && module.context.indexOf('node_modules') !== -1
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      base: process.cwd(),
      controller: `${SRC}/js/controller`,
      directive: `${SRC}/js/directive`,
      json: `${SRC}/json`,
      module: `${SRC}/js/module`,
      service: `${SRC}/js/service`,
      src: `${SRC}/js`
    },
    extensions: ['.html', '.js', '.jsx', '.json', '.scss']
  },
  devServer: {
    contentBase: BUILD,
    historyApiFallback: true,
    hot: true,
    hotOnly: true,
    open: true,
    inline: true,
    publicPath: '/',
    port: 3000
  }
}
