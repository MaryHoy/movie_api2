const path = require('path');
module.exports = {
    entry: './src/index.jsx',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/i,
                use: [
                    { loader: 'style-loader', options: { injectType: 'styleTag' } },
                    'css-loader', 'sass-loader',
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            // Prefer `dart-sass`
                            implementation: require('sass'),
                        },
                    },
                ],
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        filename: 'dist/index.js', // place where bundled app will be served
    },
    devServer: {
        inline: true, // autorefresh
        port: 1234 // development port server
    },
};
