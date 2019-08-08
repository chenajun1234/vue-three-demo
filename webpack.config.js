'use strict';

const path=require('path');
const htmlWebpackPlugin=require('html-webpack-plugin');
module.exports={
	//入口
	entry:{
		main:'./src/main.js'
	},
	output:{
		//所有产出资源路径
		path:path.join(__dirname,'dist'),
		filename:'build.js'
	},
	module:{
		unknownContextCritical: false,
		loaders:[
			{test: /\.json$/,loader: 'json-loader'},
			{
				test:/\.css$/,
				loader:'style-loader!css-loader!autoprefixer-loader'
			},
			{
				test:/\.less$/,
				loader:'style-loader!css-loader!autoprefixer-loader!less-loader'
			},
			{
				test:/\.(jpg|png|svg|ttf|woff|woff2|gif)$/,
				loader:'url-loader',
				options:{
					limit:8192,//4096以上生成文件,否则base64
					name:'[name].[ext]'
				}
			},
			{
				test:/\.js$/,
				loader:'babel-loader',
				exclude:/node_modules/,
				options:{
					presets:['es2015'],
					plugins:['transform-runtime']
				}
			},
			{
				test:/\.vue$/,
				loader:'vue-loader'
			},
			{
				test: require.resolve("three/examples/js/controls/OrbitControls"),
				use: "imports-loader?THREE=three"
			},
			{
				test: require.resolve("three/examples/js/controls/OrbitControls"),
				use: "exports-loader?THREE.OrbitControls"
			},
			{
				test: require.resolve("three/examples/js/WebGL"),
				use: "imports-loader?THREE=three"
			},
			{
				test: require.resolve("three/examples/js/WebGL"),
				use: "exports-loader?THREE.WebGL"
			},
			{
				test: require.resolve("three/examples/js/lights/RectAreaLightUniformsLib"),
				use: "imports-loader?THREE=three"
			},
			{
				test: require.resolve("three/examples/js/lights/RectAreaLightUniformsLib"),
				use: "exports-loader?THREE.RectAreaLightUniformsLib"
			},
			{
				test: require.resolve("three/examples/js/controls/FlyControls"),
				use: "imports-loader?THREE=three"
			},
			{
				test: require.resolve("three/examples/js/controls/FlyControls"),
				use: "exports-loader?THREE.FlyControls"
			},
			{
				test: require.resolve("three/examples/js/objects/Lensflare"),
				use: "imports-loader?THREE=three"
			},
			{
				test: require.resolve("three/examples/js/objects/Lensflare"),
				use: "exports-loader?THREE.Lensflare"
			}
		]
	},
	plugins:[
		new htmlWebpackPlugin({
			template:'./src/index.html'
		})
	]
}
