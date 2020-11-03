const
    /** Quick Config =================================================== */
    config = {
        hash: true, // hash file name
    }
    /* ================================================================= **/;

const Path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const Webpack = require('webpack');

module.exports = {
    config: (env) => {
        return merge(config, env);
    },
    merge: (envWebpack, env) => {
        const webpack = merge({
            resolve: {
                extensions: ['.js', '.ts', '.scss'],
                modules: [Path.resolve('../src'), 'node_modules']
            },
            module: {
                rules: [
                    {
                        test: /\.ts$/, loader: 'ts-loader'
                    },
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    babelrc: true
                                }
                            }
                        ]
                    },
                    {
                        test: /index\.(sass|scss|css)$/,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                            }
                        ]
                    },
                    {
                        test: /\.(sass|scss|css)$/,
                        use: [
                            { loader: 'css-loader' },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    postcssOptions: {
                                        config: 'postcss.config.js',
                                    },
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sassOptions: {
                                        includePaths: ['./node_modules']
                                    }
                                }
                            }]
                    }
                ]
            },
            output: {
                filename: env.hash ? '[name].[hash].js' : '[name].js'
            },
            plugins: [
                new Webpack.ProgressPlugin(),
                new FixStyleOnlyEntriesPlugin(),
                new MiniCssExtractPlugin({
                    filename: env.hash ? '[name].[hash].css' : '[name].css',
                    chunkFilename: env.hash ? '[name].[hash].css' : '[name].css'
                }),
            ]
        }, envWebpack);

        return webpack;
    },
};