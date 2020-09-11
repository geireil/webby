const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Extracts loaded styles into separate files for production use to take advantage of browser caching.
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function(_env, argv) {
  const isProduction = argv.mode === 'production'; // Determine what enviroment we are using
  const isDevelopment = !isProduction;

  return {
    devtool: isDevelopment && 'cheap-module-source-map', // Enables source-map generation in development mode.
    entry: './src/index.js', // The main file of our application.
    output: {
      path: path.resolve(__dirname, 'dist'), // The root directory to store output files in.
      filename: 'assets/js/[name].[contenthash:8].js', // The filename pattern to use for generated files.
      publicPath: '/', // The path to the root directory where the files will be deployed on the web server.
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/, // What files to bablify
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader', // Gives Babel the responsibility to run js(x) files
            options: {
              cacheDirectory: true, // Future webpack builds will attempt to read from the cache to avoid needing to run the potentially expensive Babel recompilation process
              cacheCompression: false, // Babel transform output will be compressed with Gzip (performance hit)
              envName: isProduction ? 'production' : 'development', // current active environment used during configuration loading
            },
          },
        },
        {
          test: /\.css$/, // Handle CSS files
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader', // During development, injects loaded styles into the document at runtime.
            {
              loader: 'css-loader', // Parses CSS files, resolving external resources, such as images, fonts, and additional style imports.
              options: {
                importLoaders: 1, // process @import-ed files using the loaders that follow it
              },
            },
            'postcss-loader', // run postcss magic
          ],
        },
				{
	          test: /\.module\.s[ac]ss$/, // allow for scoped styling
	          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 2, // process @import-ed files using the loaders that follow it
                modules: true, // enable modules
                sourceMap: true
              }
            },
            'postcss-loader',
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ]
	       },
        {
          test: /\.s[ac]ss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
              },
            },
            'postcss-loader', // run postcss magix
            'resolve-url-loader', // make relative imports work from @imported Sass files
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: {
            loader: 'url-loader', // handle common image formats
            options: {
              limit: 8192,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'], // transforms imported files into React components
        },
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          loader: require.resolve('file-loader'), // needed to reference any other kinds of files (no optimazation)
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },
    plugins: [
      isProduction && // only use this plugins in production
        new MiniCssExtractPlugin({
          filename: 'assets/css/[name].[contenthash:8].css',
          chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css',
        }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'), // generate an HTML file for us
        inject: true,
      }),
      new webpack.DefinePlugin({ // expose environment variables from the build environment to our application code
        'process.env.NODE_ENV': JSON.stringify(
          isProduction ? 'production' : 'development'
        ),
      }),
    ].filter(Boolean),
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserWebpackPlugin({ // minimizing our code
          terserOptions: {
            compress: {
              comparisons: false,
            },
            mangle: {
              safari10: true,
            },
            output: {
              comments: false,
              ascii_only: true,
            },
            warnings: false,
          },
        }),
        new OptimizeCssAssetsPlugin(), // minimizing our code
      ],
      splitChunks: { // allow code splitting by dynamic imports and extract code that changes less frequent
        chunks: 'all', // enables optimization for entry-point loading not just dynamic imports
        minSize: 0, // enables optimization for all common code regardless of its size
        maxInitialRequests: 10, // These settings increase the maximum number of source files that can be loaded in parallel for entry-point imports and split-point imports, respectively.
        maxAsyncRequests: 10, // These settings increase the maximum number of source files that can be loaded in parallel for entry-point imports and split-point imports, respectively.
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/, // Configures extraction for third-party modules (searching in node modules)
            name(module, chunks, cacheGroupKey) { // Groups separate chunks from the same module together by giving them a common name
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `${cacheGroupKey}.${packageName.replace('@', '')}`;
            },
          },
          common: {
            minChunks: 2, // A chunk will be considered common if referenced from at least two modules.
            priority: -10, // chunks for the vendors cache group would be considered first
          },
        },
      },
      runtimeChunk: 'single', // extract Webpack runtime code in a single chunk that can be shared between multiple entry points
    },
    devServer: {
      compress: true, // Enables asset compression for faster reloads
      historyApiFallback: true, // Enables a fallback to index.html for history-based routing.
			open: true,      // Opens the browser after launching the dev server
			overlay: true,  // Displays Webpack errors in the browser window
    },
		resolve: {
      extensions: ['.js', '.jsx', '.scss'] // needed or else files will not be recognized
    }
  };
};
