const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Add this line

module.exports = {
  // Define the entry point(s) for your JS
  entry: {
    app: ['./src/js/app.js', './src/css/main.scss'],
    index: ['./src/js/home.js', './src/css/main.scss'],
    events: ['./src/js/events.js', './src/css/main.scss'],
  },

  // Define output directory and filenames
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the /dist folder before each build
  },

  // Setup module loaders
  module: {
    rules: [
      // JavaScript: Use Babel to transpile modern JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // SCSS: Compile SCSS to CSS and extract it to a separate file
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS to a separate file
          'css-loader',                // Turns CSS into CommonJS
          'postcss-loader',            // Process CSS with PostCSS (e.g., autoprefixer)
          'sass-loader',               // Compiles Sass to CSS
        ],
      },
      // CSS: Load plain CSS files
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS
          'css-loader',                // CSS -> CommonJS
        ],
      },
      // Images: Handle image files
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico|webmanifest)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
        
      },
      // Fonts: Handle font files
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
            filename: 'fonts/[name][ext]'
          }
      },
      // HTML: Use html-loader to handle HTML-like content
      {
        test: /\.html$/,
        use: ['html-loader']
      }
    ],
  },

  // Define plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/templates/index.html',
      chunks: ['index'],
      filename: 'index.html',
      title: 'Via Brisbane - Your Guide to Local Events, Attractions, and Dining',
    }),
    new HtmlWebpackPlugin({
      template: './src/templates/about.html',
      filename: 'about.html',
      chunks: ['app'],
      title: 'About Us - Via Brisbane',
    }),
    new HtmlWebpackPlugin({
      template: './src/templates/events.html',
      filename: 'events.html',
      chunks: ['events'],
      title: 'Events - Via Brisbane',
    }),
    new HtmlWebpackPlugin({
      template: './src/templates/contact.html',
      filename: 'contact.html',
      chunks: ['app'],
      title: 'Contact - Via Brisbane',
    }),
    new HtmlWebpackPlugin({
      template: './src/templates/resources.html',
      filename: 'resources.html',
      chunks: ['app'],
      title: 'Resources - Via Brisbane',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),

    // Add this new plugin configuration
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/sitemap.xml", to: "sitemap.xml" },
        { from: "src/robots.txt", to: "robots.txt" },
        { from: "src/ads.txt", to: "ads.txt" },
        // Add any other files you want to copy here
      ],
    }),
  ],

  // Webpack Dev Server for local development
  devServer: {
    // Remove or comment out the contentBase option
    // contentBase: './dist',
    
    // Instead, use the 'static' option
    static: {
      directory: './dist', // or whatever directory you want to serve static files from
    },
  },

  // Enable source maps for easier debugging
  devtool: 'source-map',
};