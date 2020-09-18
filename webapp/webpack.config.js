const path = require('path');

module.exports = {
    mode: "production",
    context: path.resolve(__dirname, '.'),
    entry: path.resolve(__dirname,"./src/index.js"),
    output: {
        path: path.resolve(__dirname, "../backend/public/javascripts"),
        filename: "sposo_app.js",
        library: 'sposo-web',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.m?js|jsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env','@babel/preset-react']
                    }
                }
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            importLoaders: 1,
                            sourceMap: true
                        }
                    },
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {

                            }
                        }
                    }
                ]
            },
            {
              test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
              use: 'file-loader?name=[name].[ext]?[hash]'
            },
            {
              test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
              loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
              test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
              loader: 'file-loader'
            },
            {
            test: /\.otf(\?.*)?$/,
            use: 'file-loader?name=/fonts/[name].  [ext]&mimetype=application/font-otf'
            }
        ]
    },
    resolve: {
        alias: {
        '../../theme.config$': path.join(__dirname, 'semantic-ui/theme.config')
        }
     }
}
