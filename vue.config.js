const path = require('path');
const PrerenderSpaPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSpaPlugin.PuppeteerRenderer;
require('events').EventEmitter.defaultMaxListeners = 0;
const htmlMinifier = require('html-minifier-terser');

const timeStamp = new Date().getTime();
const proxy = require('./proxy.js');

const chalk = require('chalk');

const needSourceMap = process.argv.indexOf('--sourcemap') > -1;

const externals = {
	externals: {
		AMap: 'AMap'
	},
	devtool: false,
	output: {
		filename: `[name].${timeStamp}.js`,
		chunkFilename: `[name].${timeStamp}.js`
	}
};

function resolve(dir) {
	return path.join(__dirname, dir);
}

module.exports = {
	publicPath: process.env.VUE_APP_BASE_ND_PATH || '/',
	productionSourceMap: needSourceMap, //process.env.VUE_APP_BUILD_ENV == "production",
	transpileDependencies: [
		'ant-design-vue',
		'jsencrypt',
		/[/\\]node_modules[/\\](.+?)?js-base64(.*)/,
		'socket.io-client',
		'socket.io-parser',
		'sockjs',
		'sockjs-client',
		'reconnectingwebsocket',
		'webrtc-adapter',
		'moment',
		'moment.js',
		'sdp',
		'uuid'
	],

	// ant-design主题色
	css: {
		loaderOptions: {
			less: {
				modifyVars: {
					//在此处设置，也可以设置直角、边框色、字体大小等
					'primary-color': '#4682F3',
					'success-color': '#52c41a'
					// 'error-color': '#ff4d4f',
					// 'warning-color': '#faad14',
					// 'border-color-base': '#f5f5f5',
					// 'border-color-base': '#f0f0f0',
					// 'font-size-base': '14px',
					// 'border-radius-base': '2px'
				},
				javascriptEnabled: true
			}
		}
	},
	configureWebpack: config => {
		if (process.env.VUE_APP_BUILD_ENV !== 'production') {
			return externals;
		} else {
			var array = [
				new PrerenderSpaPlugin({
					// 生成文件的路径，也可以与webpakc打包的一致。
					// 下面这句话非常重要！！！
					// 这个目录只能有一级，如果目录层次大于一级，在生成的时候不会有任何错误提示，在预渲染的时候只会卡着不动。
					staticDir: resolve('dist'),
					renderAfterElementExists: '#app',
					// 对应自己的路由文件，比如a有参数，就需要写成 /a/param1。
					routes: [
						'/',
						'/case',
						'/solution',
						'/solution/tab=1',
						'/solution/tab=2',
						'/solution/tab=3',
						'/join',
						'/act',
						'/article'
					],
					// 这个很重要，如果没有配置这段，也不会进行预编译
					renderer: new Renderer({
						injectProperty: '__PRERENDER_INJECTED__',
						inject: 'prerender',
						// headless: false,
						// 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
						renderAfterDocumentEvent: 'render-event'
					})
				})
			];
			// vender太大了拆分一下
			config.optimization.splitChunks.cacheGroups.antdv = {
				name: 'chunk-antdv',
				priority: 20,
				test: /ant-design-vue/,
				chunks: 'initial',
				reuseExistingChunk: true,
				enforce: true
			};
			// config.optimization.splitChunks.cacheGroups.moment = {
			//     name:'chunk-moment',
			//     priority: 20,
			//     test: /moment/,
			//     chunks: 'all',
			//     reuseExistingChunk: true,
			//     enforce: true
			// }

			// 只有生产环境需要sentry sourcemap 改为脚本上传
			// if (needSourceMap) {
			// array.push(new SentryWebpackPlugin({
			//     // sentry-cli configuration - can also be done directly through sentry-cli
			//     // see https://docs.sentry.io/product/cli/configuration/ for details
			//     authToken: "9e6681e476a648d6a2ea3a8edab9eb2b9dcff4a53d644737b984baf5ee117e7c",
			//     org: "sentry",
			//     project: "rest",
			//     cleanArtifacts: true,
			//     release: process.env.SENTRY_RELEASE,
			//     // deleteAfterCompile:true,
			//     // other SentryWebpackPlugin configuration
			//     include: "./dist",
			//     ignore: ["node_modules"],
			// }))

			// array.push(new DeleteSourceMapWebpackPlugin())

			// }
			return {
				plugins: array,
				devtool: 'hidden-source-map',
				externals
			};
		}
	},
	lintOnSave: false,
	chainWebpack: config => {
		config.plugins.delete('prefetch');
		config.plugins.delete('preload');
		config.resolve.symlinks(true);
		config.resolve.alias
			.set('@$', resolve('src'))
			.set('v2', resolve('src/v2'))
			.set('@sub', resolve('submodules/src'))
			.set('assets', resolve('src/assets'))
			.set('imgs', resolve('src/assets/imgs'))
			.set('files', resolve('src/assets/files'))
			.set('components', resolve('src/components'))
			.set('layout', resolve('src/layout'))
			.set('views', resolve('src/views'))
			.set('store', resolve('src/store'))
			.set('untils', resolve('src/untils'))
			.set('router', resolve('src/router'))
			.set('api', resolve('src/api'));

		//压缩打包的图片文件(太耗时间和内存)
		// config.module
		//   .rule("images")
		//   .use("image-webpack-loader")
		//   .loader("image-webpack-loader")
		//   .options({ disable: process.env.NODE_ENV == "development" })
		//   .end();

		//压缩打包的html文件
		config.plugin('copy').tap(args => {
			args[0][0].transform = function (content, absoluteFrom) {
				if (absoluteFrom.indexOf('.html') > -1) {
					//https://github.com/terser/html-minifier-terser
					var d = htmlMinifier.minify(content.toString(), {
						collapseWhitespace: true, // 去除空格和换行
						minifyCSS: true, // 压缩style标签内容
						minifyJS: true // 压缩JavaScript标签内容
					});
					return d;
				}

				return content;
			};

			return args;
		});

		const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
		types.forEach(type => addStyleResource(config.module.rule('stylus').oneOf(type)));
	},
	assetsDir: 'static',
	devServer: {
		// before: process.env.NODE_ENV !== 'production' && require('./src/mock'),
		disableHostCheck: true,
		port: 7777,
		proxy: proxy
	}
};

function addStyleResource(rule) {
	rule
		.use('style-resource')
		.loader('style-resources-loader')
		.options({
			patterns: [path.resolve(__dirname, './src/assets/styl/fun.styl')]
		});
}

function proxyLog(req, res, proxyOptions) {
	if (req.headers.accept && req.headers.accept.includes('image/avif,image/webp,image/apng,image/*')) {
		return;
	}
	console.log('==='.repeat(20), '\n');
	console.log(`${chalk.greenBright(' 时间: ')}  ${new Date().toLocaleTimeString()}`);
	console.log(`${chalk.greenBright(' 方法: ')}  ${req.method}`);
	console.log(`${chalk.greenBright(' 地址: ')}  ${proxyOptions.target}`);
	console.log(`${chalk.greenBright(' 路由: ')}  ${req.path}`);
	console.log(`${chalk.greenBright(' ACCEPT: ')}${req.headers.accept}`);
	if (Object.keys(req.query).length) {
		console.log(`${chalk.greenBright(' Query信息: ')} `);
		console.table(req.query);
	}
	if (req.method != 'GET') {
		if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data; boundary')) {
			console.log(`${chalk.greenBright(' 文件上传: ')}${req.headers['content-type']}`);
			return;
		}
		let data = '';
		req.on('data', chunk => {
			data += chunk;
		});
		req.on('end', () => {
			console.log(chalk.greenBright('payload数据:'));
			console.table(data);
		});
	}
}
