// 该文件其实最终是要在node环境下执行的
const path = require("path");
const webpack = require("webpack");
const htmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin;
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// 导出一个具有特殊属性配置的对象
module.exports = {
	mode: "development",
	entry: ["./src/main.js"] /* 入口文件模块路径 */,
	output: {
		/* 出口文件模块所属目录，必须是一个绝对路径 */
		path: path.join(__dirname, "./dist/"),
		filename: "bundle.js" /* 打包的结果文件名称 */,
	},
	devServer: {
		// 配置webpack-dev-server的www目录
		contentBase: "./dist",
		hot: true,
		port: 3000
	},
	resolve: {
		// 默认的解析扩展名
		extensions: [".vue", ".ts", ".js"],
		alias: {
			"B": path.resolve(__dirname, "./src/"),
		},
	},
	plugins: [
		// 该插件可以把index.html打包到bundle.js文件所属目录，跟着bundle走
		// 同时也会自动在index.html中注入script引用链接，并且引用的资源名称，也取决于打包的文件名称
		new htmlWebpackPlugin({
			template: "./index.html",
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: "static",
			openAnalyzer: false,
			reportFilename: `../reports/report-${new Date().getTime()}.html`,
		}),
		new VueLoaderPlugin(),
		//HMR的插件(HMR只能webpack-dev-server下使用)
		new webpack.HotModuleReplacementPlugin(),
		// 编译的时候清空dist文件夹
		new CleanWebpackPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.scss$/i,
				exclude: /node_modules/,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
			{
				test: /.(jpg|png|gif|svg)$/,
				use: ["file-loader"],
			},
			{
				test: /\.(tsx|ts|js)$/,
				exclude: /(node_modules|bower_components)/, //排除掉node_module目录
				use: "babel-loader",
			},
			{
				test: /\.vue$/,
				exclude: /(node_modules|bower_components)/,
				use: "vue-loader",
			},
			{
				test: /\.(js|vue)$/,
				include: ["/src"],
				exclude: /node_modules/,
				use: "eslint-loader",
			},
		],
	},
};
