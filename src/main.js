'use strict';
//引入 vue
import Vue from 'vue'
//引入App.vue
import App from './app.vue';

import Layout from './components/Layout.vue';
import FirstDemo_01 from './components/0_basic/01_firstDemo.vue';
import DrawingLines_02 from './components/0_basic/02_DrawingLines.vue';
import CubeGeomentry from './components/0_basic/CubeGeomentry.vue';
import BoxBufferGeometry_03 from './components/0_basic/03_BoxBufferGeometry.vue';
import GeometryExample_04 from './components/0_basic/04_GeometryExample.vue';
import AllGeometry_05 from './components/0_basic/05_AllGeometry.vue';
import TrackballControls_06 from './components/0_basic/06_TrackballControls.vue';
import CreatingText_07 from './components/0_basic/07_CreatingText.vue';
import ShadowDemo_08 from './components/0_basic/08_ShadowDemo.vue';
import Fogemo_09 from './components/0_basic/09_FogDemo.vue';
import OverrideMaterial_10 from './components/0_basic/10_OverrideMaterial.vue';
import VertexPositions_11 from './components/0_basic/11_VertexPositions.vue';
import AmbientLight_12 from './components/01_light/12_AmbientLight.vue';
import SpotLight_13 from './components/01_light/13_SpotLight.vue';
import DirectionalLight_14 from './components/01_light/14_DirectionalLight.vue';
import HemisphereLight_15 from './components/01_light/15_HemisphereLight.vue';
import RectAreaLight_16 from './components/01_light/16_RectAreaLight.vue';
import RectAreaLight02_17 from './components/01_light/17_RectAreaLight02.vue';
import FlyControls_18 from './components/01_light/18_FlyControls.vue';
import LensFlare_19 from './components/01_light/19_LensFlare.vue';
import MeshBasicMaterial_20 from './components/02_material/20_MeshBasicMaterial.vue';
import MeshDepthMaterial_21 from './components/02_material/21_MeshDepthMaterial.vue';
import MultiMaterialObject_22 from './components/02_material/22_MultiMaterialObject.vue';
import MeshLambertMaterial_23 from './components/02_material/23_MeshLambertMaterial.vue';
import MeshPhongMaterial_24 from './components/02_material/24_MeshPhongMaterial.vue';
import LineBasicMaterial_25 from './components/02_material/25_LineBasicMaterial.vue';
import LineDashedMaterial_26 from './components/02_material/26_LineDashedMaterial.vue';
import ConvexGeometry_27 from './components/03_geomentry/27_ConvexGeometry.vue';
import ShapeGeometry_28 from './components/03_geomentry/28_ShapeGeometry.vue';
import ExtrudeGeometry_29 from './components/03_geomentry/29_ExtrudeGeometry.vue';
import TubeGeometry_30 from './components/03_geomentry/30_TubeGeometry.vue';
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
        {
            path:'/',
            component: Layout,
            name: 'Layout',
            CNName:'快速入门',
            children:[
                { name: 'FirstDemo', CNName: '01_hello word', path: 'firstDemo', component: FirstDemo_01 },
                { name: 'DrawingLines', CNName: '02_画线', path: 'drawingLines', component: DrawingLines_02 },    
                { name: 'CubeGeomentry', CNName: '几何图', path: 'cubeGeomentry', component: CubeGeomentry },
                { name: 'BoxBufferGeometry', CNName: '03_立方体', path: 'boxBufferGeometry', component: BoxBufferGeometry_03 },
                { name: 'GeometryExample', CNName: '04_立方体综合', path: 'geometryExample', component: GeometryExample_04 },
                { name: 'AllGeometry', CNName: '05_内置几何体', path: 'allGeometry', component: AllGeometry_05},
                { name: 'TrackballControls', CNName: '06_轨迹球和性能监控', path: 'trackballControls', component: TrackballControls_06},
                { name: 'CreatingText', CNName: '07_创建文字', path: 'creatingText', component: CreatingText_07 },
                { name: 'ShadowDemo', CNName: '08_阴影效果和调试工具', path: 'shadowDemo', component: ShadowDemo_08 },
                { name: 'Fogemo', CNName: '09_雾化效果', path: 'fogemo', component: Fogemo_09 },
                { name: 'OverrideMaterial', CNName: '10_使用相同的材质', path: 'overrideMaterial', component: OverrideMaterial_10 },
                { name: 'VertexPositions', CNName: '11_原生顶点绘制', path: 'vertexPositions', component: VertexPositions_11 }
            ]
        },{
            path:'/',
            component: Layout,
            name: 'Layout',
            CNName:'three-灯光',
            children:[
                { name: 'AmbientLight', CNName: '12_环境光源', path: 'ambientLight', component: AmbientLight_12 },
                { name: 'SpotLight', CNName: '13_聚光灯光源', path: 'spotLight', component: SpotLight_13 },
                { name: 'DirectionalLight', CNName: '14_平行光光源', path: 'directionalLight', component: DirectionalLight_14 },
                { name: 'HemisphereLight', CNName: '15_户外光照光源', path: 'hemisphereLight', component: HemisphereLight_15 },
                { name: 'RectAreaLight', CNName: '16_窗口射入光线模拟', path: 'rectAreaLight', component: RectAreaLight_16 },
                { name: 'RectAreaLight02', CNName: '17_窗口射入光线模拟', path: 'rectAreaLight02', component: RectAreaLight02_17 },
                { name: 'FlyControls', CNName: '18_相机飞行控件', path: 'flyControls', component: FlyControls_18 },
                { name: 'LensFlare', CNName: '19_镜头光晕效果', path: 'lensFlare', component: LensFlare_19 }
            ]  
        },{
            path:'/',
            component: Layout,
            name: 'Layout',
            CNName:'three-材质',
            children:[
                { name: 'MeshBasicMaterial', CNName: '20_简单基础材质', path: 'meshBasicMaterial', component: MeshBasicMaterial_20 },
                { name: 'MeshDepthMaterial', CNName: '21_网格深度材质', path: 'meshDepthMaterial', component: MeshDepthMaterial_21 },
                { name: 'MultiMaterialObject', CNName: '22_与深度材质融合', path: 'multiMaterialObject', component: MultiMaterialObject_22 } ,
                { name: 'MeshLambertMaterial', CNName: '23_非光泽表面材质', path: 'meshLambertMaterial', component: MeshLambertMaterial_23 } ,
                { name: 'MeshPhongMaterial', CNName: '24_光泽的材质', path: 'meshPhongMaterial', component: MeshPhongMaterial_24 },
                { name: 'LineBasicMaterial', CNName: '25_基础线条材质', path: 'lineBasicMaterial', component: LineBasicMaterial_25 },
                { name: 'LineDashedMaterial', CNName: '26_虚线材质', path: 'LineDashedMaterial', component: LineDashedMaterial_26 }
            ]  
        },{
            path:'/',
            component: Layout,
            name: 'Layout',
            CNName:'three-高级几何体',
            children:[
                { name: 'ConvexGeometry', CNName: '27_一组点创建几何', path: 'convexGeometry', component: ConvexGeometry_27 },
                { name: 'ShapeGeometry', CNName: '28_自定义二维图形', path: 'shapeGeometry', component: ShapeGeometry_28 } ,
                { name: 'ExtrudeGeometry', CNName: '29_2D拉伸为3D', path: 'extrudeGeometry', component: ExtrudeGeometry_29 },
                { name: 'TubeGeometry', CNName: '29_三维曲线延伸为管道', path: 'tubeGeometry', component: TubeGeometry_30 }
            ]  
        }
    ]

})


//创建vue实例
//构建示例
new Vue({
    el: '#app',
    router,
    render: c => c(App)
})