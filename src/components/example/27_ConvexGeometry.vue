<template>
  <div>
    <div id="map"></div>
    <div id="my-gui-container"></div>
  </div>
</template>
<script>
/*页面:ConvexGeometry 
    可以围绕一组点创建一个凸包。所谓凸包就是包围这组点的最小图形。也就是所有的点都在当前模型的体内，而且当前图形还是实现的体积最小的一个模型。
   */

import * as THREE from "three";
import Stats from "stats-js";
import OrbitControls from "three/examples/js/controls/OrbitControls";
import {ConvexBufferGeometry} from 'three/examples/jsm/geometries/ConvexGeometry';
import {SceneUtils} from 'three/examples/jsm/utils/SceneUtils';
import * as dat from "dat.gui";
export default {
  data() {
    return {
      scene: null, //场景
      camera: null, //相机
      renderer: null, //渲染器
      ambientLight: null,
      hemiLight: null,
      Light: null,
      controls: null,
      gui: null,
      line: null,
      step:0
    };
  },
  mounted() {
    window.vue = this;
    //场景
    this.initScene();

    //相机
    this.initCamera();

    //渲染器
    this.initRender();

    //灯光
    this.initLight();
    //模型
    this.initModel();
    this.initControls();
    this.initStats();
    //this.initGui();

    //渲染
    this.animate();
  },
  methods: {
    initScene() {
      this.scene = new THREE.Scene();
    },
    initCamera() {
      let mapEle = document.getElementById("map");
      let width = mapEle.clientWidth;
      let height = mapEle.clientHeight;
      // ( fov, aspect, near, far )
      // 这里使用最常见的远景相机（PerspectiveCamera），也就是类似于人眼观察的方式。
      // fov,第一个属性75设置的是视角（field of view）。类似眼睛睁多大
      // aspect,第二个属性设置的是相机拍摄面的长宽比（aspect ratio）。我们几乎总是会使用元素的宽除以高，否则会出现挤压变形。
      // near,接下来的2个属性是近裁剪面（near clipping plane）
      // far,远裁剪面（far clipping plane）
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
      this.camera.position.set(0, 0, 600);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0)); //指的是相机观察的目标点
      // this.camera.updateProjectionMatrix();
    },
    initRender() {
      let mapEle = document.getElementById("map");
      let width = mapEle.clientWidth;
      let height = mapEle.clientHeight;
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, //antialias（是否启用抗锯齿）
        // alpha:true//canvas是否包含alpha (透明度)。默认为 false
        logarithmicDepthBuffer: true //是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用。 默认是false。
      });
      //设置渲染器的尺寸
      this.renderer.setSize(width, height);
      //告诉渲染器需要阴影效果
      //this.renderer.shadowMap.enabled = true;
      // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
      // 0xffffff
      this.renderer.setClearColor(0x000000);
      //将渲染器放置到指定dom当中
      mapEle.appendChild(this.renderer.domElement);
    },
    initLight() {
      
    },
    initGui() {
    },
    initModel() {
     this.generatePoints();
    },
    initControls() {
      this.controls = new THREE.OrbitControls(
        this.camera,
        this.renderer.domElement
      );
      // 如果使用animate方法时，将此函数删除
      //controls.addEventListener( 'change', render );
      // 使动画循环使用时阻尼或自转 意思是否有惯性
      this.controls.enableDamping = true;
      //动态阻尼系数 就是鼠标拖拽旋转灵敏度
      //controls.dampingFactor = 0.25;
      //是否可以缩放
      this.controls.enableZoom = true;
      //是否自动旋转
      //this.controls.autoRotate = true;
      //设置相机距离原点的最远距离
      this.controls.minDistance = 5;
      //设置相机距离原点的最远距离
      this.controls.maxDistance = 1000;
      //是否开启右键拖拽
      this.controls.enablePan = true;

      // this.camera.position.set(0, 20, 100);
      this.controls.update();
    },
    initStats() {
      // debugger;
      this.stats = new Stats();
      this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      let statsPosition = this.stats.dom;
      statsPosition.style.left = "230px";
      statsPosition.style.top = "9.5%";
      document.getElementById("map").appendChild(statsPosition);
    },
    render() {
       //设置模型动画
       // this.line.rotation.z = this.step += 0.01;
       // this.line.rotation.y = this.step += 0.01;
      //渲染图形
      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      this.controls.update();
      this.render();
      this.stats.update();

      requestAnimationFrame(this.animate);
    },
    generatePoints() {
        // 随机生成一组顶点
        var points = [];
        for (var i = 0; i < 20; i++) {
            //xyz轴的坐标点的位置会随机生成在+-150以内
            var randomX = -150 + Math.round(Math.random() * 300);
            var randomY = -150 + Math.round(Math.random() * 300);
            var randomZ = -150 + Math.round(Math.random() * 300);

            //创建一个坐标点并添加到数组当中
            points.push(new THREE.Vector3(randomX, randomY, randomZ));
        }

        //声明一个存放所有点的网格对象
        let spGroup = new THREE.Object3D();
        //声明一个网格基础材质
        var material = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: false});
        //遍历数组生成小球点并添加到对象当中
        points.forEach(function (point) {

            var spGeom = new THREE.SphereGeometry(2);
            var spMesh = new THREE.Mesh(spGeom, material);
            spMesh.position.copy(point); //将当前小球的位置设置为当前点的坐标
            window.vue.scene.add(spMesh);
        });
        // 将存放所有点的对象添加到场景当中
        this.scene.add(spGroup);

        // 使用这些点实例化一个THREE.ConvexGeometry几何体对象
        var hullGeometry = new ConvexBufferGeometry(points);
        //生成模型
        let hullMesh = this.createMesh(hullGeometry);
        //添加到场景
        this.scene.add(hullMesh);
    }, 
    createMesh(geom) {
        // 实例化一个绿色的半透明的材质
        var meshMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.2});
        meshMaterial.side = THREE.DoubleSide; //将材质设置成正面反面都可见
        var wireFrameMat = new THREE.MeshBasicMaterial();
        wireFrameMat.wireframe = true; //把材质渲染成线框

        // 将两种材质都赋给几何体
        var mesh =new  SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

        return mesh;
    }

    
  }
};
</script>
<style>
#map {
  border: none;
  /* cursor: pointer; */
  width: 100%;
  height: 600px;
  /* background-color: black; */
}

#my-gui-container {
  position: absolute;
  top: 10%;
  right: 1.5%;
  z-index: 100;
}
</style>