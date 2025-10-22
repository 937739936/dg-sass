import { defineConfig, loadEnv } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import path from "path";
// import usePluginImport from "vite-plugin-importer";
import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import { viteExternalsPlugin } from 'vite-plugin-externals'
import AntdMomentResolver from "vite-plugin-antdv1-momentjs-resolver";
import { replaceCodePlugin } from "vite-plugin-replace";
// import filterReplace from 'vite-plugin-filter-replace';
import ViteRestart from 'vite-plugin-restart'
import proxy from './proxy.js'


function resolve(dir) {
    return path.join(__dirname, dir)
}

export default ({ mode }) => {

    return defineConfig({
        define:{
            __DEV_TYPE__VITE: JSON.stringify('VITE')        
        },
        envPrefix: 'VUE_APP_',

        build: {
            sourcemap: false,
            // target:'es2015',
            target: "modules",

            commonjsOptions: {
                //  改为 ture 后就会转化 require 语法
                // extensions: [ '.js', '.vue' ],
                // include:['src/store/getters.js'],
                sourceMap: false,
                // exclude:['videojs-contrib-hls'],
                transformMixedEsModules: true,
            },

        },
        css: {

            //* 预编译支持less
            preprocessorOptions: {
                less: {
                    modifyVars: {
                        //在此处设置，也可以设置直角、边框色、字体大小等
                        'primary-color': '#0053db',
                        'success-color': '#52c41a',
                        // 'error-color': '#ff4d4f',
                        // 'warning-color': '#faad14',
                        // 'border-color-base': '#f5f5f5',
                        // 'border-color-base': '#f0f0f0',
                        // 'font-size-base': '14px',
                        // 'border-radius-base': '2px'
                    },
                    // 支持内联 JavaScript
                    javascriptEnabled: true,
                },
                scss: {},
                stylus: {
                    imports: [path.resolve(__dirname, 'src/assets/styl/fun.styl')],
                },
                styl: {
                    imports: [path.resolve(__dirname, 'src/assets/styl/fun.styl')],
                },

            }
        },

        plugins: [
            createVuePlugin({
                jsx: true
            }),
            viteCommonjs({
                transformMixedEsModules: true,
                // exclude:['videojs-contrib-hls']
            }),
            viteExternalsPlugin({
                'video.js': 'videojs',
            }),
            // filterReplace([
            //   {
            //     filter: /.*moment-util.js$/,
            //     replace: {
            //       from: /import \* as moment/g,
            //       to: 'import moment'
            //     },
            //   },

            // ]),
            ViteRestart({
                restart: [
                    'proxy.js',
                ]
            }),
            AntdMomentResolver(/[/\\]node_modules[/\\](.+?)?ant-design-vue(.*)\.js$/),

            replaceCodePlugin({
                replacements: [
                    {
                        from: /process.env/g,
                        to: "import.meta.env",
                    },
                    {
                        from: /\/module\/centerRouter/,
                        to: "/module/centerRouterVite",
                    },

                ],
            }),
            // usePluginImport({
            //  libraryName: "ant-design-vue",
            //  libraryDirectory: "es",
            //  style: "less",
            // }),
        ],
        resolve: {
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
            // 配置路径别名


            alias: [

                // {find: /ant-design-vue$/,replacement: 'ant-design-vue/dist/antd.min'},
                { find: /^\~/, replacement: resolve('src') + '/' },
                { find: 'v2', replacement: resolve('src/v2') },
                { find: '@', replacement: resolve('src') },
                { find: '@sub', replacement: resolve('submodules/src') },
                { find: '@$', replacement: resolve('src') },
                { find: '@sub', replacement: resolve('submodules/src') },
                { find: 'assets', replacement: resolve('src/assets') },
                { find: 'imgs', replacement: resolve('src/assets/imgs') },
                { find: 'files', replacement: resolve('src/assets/files') },
                { find: 'layout', replacement: resolve('src/layout') },
                { find: 'views', replacement: resolve('src/views') },
                { find: 'store', replacement: resolve('src/store') },
                { find: 'untils', replacement: resolve('src/untils') },
                { find: 'router', replacement: resolve('src/router') },
                { find: 'api', replacement: resolve('src/api') },
                { find: 'components', replacement: resolve('src/components') }
            ],
        },
        server: {
            port: 7777,
            proxy: proxy
        }
    })
}