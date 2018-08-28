const _ = require('lodash')
const webpack = require('./webpack.config')

module.exports = function (config) {
  config.set({
    webpack: _.omit(webpack, ['entry', 'output', 'devServer', 'plugins']),
    basePath: './',
    autoWatch: true,
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/babel-polyfill/dist/polyfill.js',
      'src/js/app.js',
      'test/**/*.js'
    ],
    preprocessors: {
      'src/js/app.js': ['webpack', 'sourcemap'],
      'test/**/*.js': ['webpack', 'sourcemap']
    },
    reporters: ['progress', 'coverage'],
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    plugins: [
      'karma-chrome-launcher',
      'karma-sourcemap-loader',
      'karma-jasmine',
      'karma-webpack',
      'karma-coverage'
    ]
  })
}
