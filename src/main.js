'use strict';
//引入 vue
import Vue from 'vue'
//引入App.vue
import App from './app.vue';

import FirstDemo_01 from './components/example/01_firstDemo.vue';
import DrawingLines_02 from './components/example/02_DrawingLines.vue';
import CubeGeomentry from './components/example/CubeGeomentry.vue';
import BoxBufferGeometry_03 from './components/example/03_BoxBufferGeometry.vue';
import GeometryExample_04 from './components/example/04_GeometryExample.vue';
import AllGeometry_05 from './components/example/05_AllGeometry.vue';
import TrackballControls_06 from './components/example/06_TrackballControls.vue';
import CreatingText_07 from './components/example/07_CreatingText.vue';
import ShadowDemo_08 from './components/example/08_ShadowDemo.vue';
import Fogemo_09 from './components/example/09_FogDemo.vue';
import OverrideMaterial_10 from './components/example/10_OverrideMaterial.vue';
import VertexPositions_11 from './components/example/11_VertexPositions.vue';
import AmbientLight_12 from './components/example/12_AmbientLight.vue';
import SpotLight_13 from './components/example/13_SpotLight.vue';
import DirectionalLight_14 from './components/example/14_DirectionalLight.vue';
import HemisphereLight_15 from './components/example/15_HemisphereLight.vue';
import RectAreaLight_16 from './components/example/16_RectAreaLight.vue';
import RectAreaLight02_17 from './components/example/17_RectAreaLight02.vue';
import FlyControls_18 from './components/example/18_FlyControls.vue';
import LensFlare_19 from './components/example/19_LensFlare.vue';
import MeshBasicMaterial_20 from './components/example/20_MeshBasicMaterial.vue';
import MeshDepthMaterial_21 from './components/example/21_MeshDepthMaterial.vue';

//路由
import VueRouter from 'vue-router';
//安装插件
Vue.use(VueRouter);

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

//自己公共样式
import './static/css/global.css';

//axios
import Axios from 'axios';
//默认请求配置
//Axios.default.baseURL="";

//挂载原型
Vue.prototype.$ajax = Axios;

//路由规则
let router = new VueRouter({
    routes: [
        { name: 'FirstDemo', CNName: '01_hello word', path: '/firstDemo', component: FirstDemo_01 },
        { name: 'DrawingLines', CNName: '02_画线', path: '/drawingLines', component: DrawingLines_02 },    
        { name: 'CubeGeomentry', CNName: '几何图', path: '/cubeGeomentry', component: CubeGeomentry },
        { name: 'BoxBufferGeometry', CNName: '03_立方体', path: '/boxBufferGeometry', component: BoxBufferGeometry_03 },
        { name: 'GeometryExample', CNName: '04_立方体综合', path: '/geometryExample', component: GeometryExample_04 },
        { name: 'AllGeometry', CNName: '05_内置几何体', path: '/allGeometry', component: AllGeometry_05},
        { name: 'TrackballControls', CNName: '06_轨迹球和性能监控', path: '/trackballControls', component: TrackballControls_06},
        { name: 'CreatingText', CNName: '07_创建文字', path: '/creatingText', component: CreatingText_07 },
        { name: 'ShadowDemo', CNName: '08_阴影效果和调试工具', path: '/shadowDemo', component: ShadowDemo_08 },
        { name: 'Fogemo', CNName: '09_雾化效果', path: '/fogemo', component: Fogemo_09 },
        { name: 'OverrideMaterial', CNName: '10_使用相同的材质', path: '/overrideMaterial', component: OverrideMaterial_10 },
        { name: 'VertexPositions', CNName: '11_原生顶点绘制', path: '/vertexPositions', component: VertexPositions_11 },
        { name: 'AmbientLight', CNName: '12_环境光源', path: '/ambientLight', component: AmbientLight_12 },
        { name: 'SpotLight', CNName: '13_聚光灯光源', path: '/spotLight', component: SpotLight_13 },
        { name: 'DirectionalLight', CNName: '14_平行光光源', path: '/directionalLight', component: DirectionalLight_14 },
        { name: 'HemisphereLight', CNName: '15_户外光照光源', path: '/hemisphereLight', component: HemisphereLight_15 },
        { name: 'RectAreaLight', CNName: '16_窗口射入光线模拟', path: '/rectAreaLight', component: RectAreaLight_16 },
        { name: 'RectAreaLight02', CNName: '17_窗口射入光线模拟', path: '/rectAreaLight02', component: RectAreaLight02_17 },
        { name: 'FlyControls', CNName: '18_相机飞行控件', path: '/flyControls', component: FlyControls_18 },
        { name: 'LensFlare', CNName: '19_镜头光晕效果', path: '/lensFlare', component: LensFlare_19 },
        { name: 'MeshBasicMaterial', CNName: '20_简单基础材质', path: '/meshBasicMaterial', component: MeshBasicMaterial_20 },
        { name: 'MeshDepthMaterial', CNName: '21_网格深度材质', path: '/meshDepthMaterial', component: MeshDepthMaterial_21 } 
        
    ]

})


//创建vue实例
//构建示例
new Vue({
    el: '#app',
    router,
    render: c => c(App)
})