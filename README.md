# Vue 项目优化实践

## 能学到什么？

通过本课程，你可以学习到：

1. vue-cli 以及 webpack 等开源工具的使用方法。
2. 自己动手，从零开始搭建一个 vue+typescript 的开发环境。
3. 基于最常用的默认 vue-cli 项目，实现对项目打包过程的优化。

本课程的源代码见[这里](https://github.com/Alfxjx/VueBuildingOptimize)，如有什么不懂的，可以在项目中提出 ISSUE。

## 先导知识

本课程中，首先要对`vue-cli`以及`webpack`有一个基本的认识，这样方便之后的实战学习。

### vue-cli 入门

`vue-cli`是`vue.js`官方推出的一个命令行工具，所谓的`cli`就是`command line interface`，通过它我们可以很快的构建一个基于 webpack 的 vue 应用程序，当然在 cli@3 之后，`vue-cli`隐藏了 webpack 的配置，这样使得项目更加的简洁。
对于`vue-cli`的使用，可以查看[官方的文档](https://cli.vuejs.org/zh/guide/)，里面说的非常的详细了。

一通操作之后，我们就得到了一个 vue 的 app,这个时候能够满足基本的开发需要了，但是当我们引入了其他的组件库的时候，例如`echarts`，`vuetify`甚至在初始化这个项目的时候选择的`vue-router`,`vuex`等，都会影响项目最后的打包体积，很多时候，如果一点优化也不做，可能只使用了`vuetify`里面的一个按钮，就会导致引入了一个几 M 的 js 文件，这样会使得用户访问你的网站时，出现长时间的白屏，为了能够优化用户的体验，所以我们也要对项目进行优化。

接下来，首先对`vue-cli`的基础设施学习一波，就是`webpack`，顺便学习一下`babel`。

### webpack，babel 入门

`webpack` 是什么呢？看一下[官方 GIthub](https://github.com/webpack/webpack):

> A bundler for javascript and friends. Packs many modules into a few bundled assets. Code Splitting allows for loading parts of the application on demand. Through "loaders", modules can be CommonJs, AMD, ES6 modules, CSS, Images, JSON, Coffeescript, LESS, ... and your custom stuff.

> TL;DR webpack 是一个打包器。

webpack 可以把除了 JS 文件之外的其他资源，都看作是一个个的模块，最终打包成一个`bundle`，发布到生产环境。很推荐大家去看一本交《深入浅出 webpack》的书，讲的很透彻，webpack 通过一个`webpack.config.js`的文件配置打包的过程，当然在实际的开发过程中，可能针对不同的环境，需要做特殊的配置，因而会有例如`webpack.base.js`,`webpack.dev.conf.js`等等，这些大同小异。之前的 vue-cli@2 就是这样的目录结构。更多的关于 webpack 的原理，可以去查阅她的[文档](https://webpack.js.org/),里面说的满详细的，这里就基于下面的一个小教程，来带大家熟悉 webpack，进而可以对 vue-cli 的打包过程来进行优化。

[`Babel`](https://www.babeljs.cn/)则是一个 js 转译器，负责把新的、尚未在浏览器中实现的 es 新功能转换成浏览器能看懂的代码的过程，当然随着`Babel`的发展，她能做的不止于此。

关于`Babel`，中文名巴别塔；是《圣经·旧约·创世记》第 11 章故事中人们建造的塔。根据篇章记载，当时人类联合起来兴建希望能通往天堂的高塔；为了阻止人类的计划，上帝让人类说不同的语言，使人类相互之间不能沟通，计划因此失败，人类自此各散东西。此事件，为世上出现不同语言和种族提供解释。 这个名字很符合这个编译器的定位。

## 从 0 开始，搭建一个 vue+ts 开发环境

现在我们首先来初始化一个 nodejs 的文件夹，运行一下的语句:

```shell
mkdir vue-from-zero
cd vue-from-zero
npm init -y
```

这样我们就得到了一个初始的 node 项目目录了。在安装依赖之前，我们需要给目录添加 git,并且设置 gitignore。这样可以通过 git 来控制版本，gitignore 则可以忽略接下来安装的依赖包，以及之后开发中可能的密码等不想要上传到 github 等代码管理平台的文件。

运行`git init`来初始化，新建一个`.gitignore`文件，内容为：`/node_modules`，表示忽略此目录。

接下来就是安装依赖的过程，你可以一个一个的安装,当然我推荐你直接复制我[源代码]()里面的 package.json 中的依赖，然后运行`npm i`或者`yarn`来进行安装，这样比较快，而且版本应该和本问写作的时候比较类似，不容易出现由于依赖版本不一致导致的可能的问题。当然本教程之后会解释为什么要安装这些依赖。

---

接着，我们来看一下复制的`package.json`里面，我们引入了哪些包。

最主要的包就是 webpack 了，我们基于 webpack 来进行项目的搭建。在`devDependencies`中安装了这些包：

```json
devDependencies:{
    "webpack": "^4.44.2",
    "webpack-bundle-analyzer": "^3.9.0",
    "webpack-cli": "^3.3.12",
    "webpack-dev-server": "^3.11.0"
}
```

为了能使用 webpack,新建`webpack.config.js`，并在`package.json`新建以下脚本：

```json
"build": "npx webpack --config ./webpack.config.js",
"dev": "webpack-dev-server"
```

接下来就是配置 webpack,在 `webpack.config.js` 中：

```js
const path = require("path");
const webpack = require("webpack");
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
		port: 3000,
	},
	resolve: {
		// 默认的解析扩展名
		extensions: [".vue", ".ts", ".js"],
		alias: {
			// 这里是配置别名，
			// 对于下面的例子，就是把 B/main.js => src/main.js
			B: path.resolve(__dirname, "./src/"),
		},
	},
};
```

上面的就是基本的 webpack 配置，此时如果运行 `npm run build` 的话可以把文件打包成功嘛？

一般来说，还需要对项目中的除了 js 之外的文件，例如样式 CSS 文件，html（当然现在的 SPA 一般只有一个 html 文件），以及其他的字体文件，图像等都打包成一个整体，这就需要 webpack 的`loader` 配置了，loader 类似于一个管道，输入就是原始的文件，输出经过转换能够被 webpack 核心引擎解析的结果。在本项目中可以这样写：

```js
module.exports = {
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
```

上面就是一些很典型的 loader 的写法，可以看出 loader 通过正则表达式的方法实现对特定的文件后缀的解析，之后用 include/exclude 来判断需要包含的文件夹范围。而 use 配置的是使用的 loader，接受数组字符串，当然也接受对象。
对于 scss 文件，需要进行多层的转换，因此传了一个包含三个参数的数组，**倒序**依次解析。

如果说 loader 是 webpack 的总线的话，那么 plugin 就是给 webpack 创造更多可能的模块了，plugin 和 loader 的区别在于 loader 主要关注文件的转换，而 plugin 则是贯穿全生命周期的，从而为 webpack 实现更多的功能。

本项目中主要使用的 plugin 有以下几个：

```js
const htmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin;
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
	plugins: [
		// 该插件可以把index.html打包到bundle.js文件所属目录，跟着bundle走
		// 同时也会自动在index.html中注入script引用链接，并且引用的资源名称，也取决于打包的文件名称
		new htmlWebpackPlugin({
			template: "./index.html",
        }),
        // 检查打包体积的plugin
        // 配置之后，编译完成时不显示网页，保存静态的html文件到/reports文件夹下，并附上时间。
		new BundleAnalyzerPlugin({
			analyzerMode: "static",
			openAnalyzer: false,
			reportFilename: `../reports/report-${new Date().getTime()}.html`,
        }),
        // vue-loader所需的plugin
		new VueLoaderPlugin(),
		//HMR的插件(HMR只能webpack-dev-server下使用)
		new webpack.HotModuleReplacementPlugin(),
		// 编译的时候清空dist文件夹
		new CleanWebpackPlugin(),
	],
};
```
这样我们的webpack配置就完成啦.

1. /cli-template/output.js
2. babel-loader
3. eslint-loader
4. 细说一下 loader到底做了什么工作，那么多的loader我该选哪个呢

## 基于 vue-cli，对打包进行优化

## 总结

## 代码
