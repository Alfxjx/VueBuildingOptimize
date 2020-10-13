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

## 从 0 开始，搭建一个 vue+ts 开发环境

现在我们首先来初始化一个 nodejs 的文件夹，运行一下的语句:

```shell
mkdir vue-from-zero
cd vue-from-zero
npm init -y
```

这样我们就得到了一个初始的 node 项目目录了。在安装依赖之前，我们需要给目录添加git,并且设置gitignore。这样可以通过git来控制版本，gitignore则可以忽略接下来安装的依赖包，以及之后开发中可能的密码等不想要上传到github等代码管理平台的文件。

运行`git init`来初始化，新建一个`.gitignore`文件，内容为：`/node_modules`，表示忽略此目录。

接下来就是安装依赖的过程，你可以一个一个的安装,当然我推荐你直接复制我[源代码]()里面的 package.json 中的依赖，然后运行`npm i`或者`yarn`来进行安装，这样比较快，而且版本应该和本问写作的时候比较类似，不容易出现由于依赖版本不一致导致的可能的问题。当然本教程之后会解释为什么要安装这些依赖。

-----

接着，我们来看一下复制的`package.json`里面，我们引入了哪些包。

为了能使用webpack,新建`webpack.config.js`，并在`package.json`新建以下脚本：

```json
"build": "npx webpack --config ./webpack.config.js",
"dev": "webpack-dev-server"
```


## 基于 vue-cli，对打包进行优化

## 总结

## 代码
