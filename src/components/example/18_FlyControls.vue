<template>
  <div>
    <div id="map"></div>
    <div id="my-gui-container"></div>
  </div>
</template>
<script>
//页面:FlyControls是相机的控件，飞行模拟器控件,用键盘和鼠标控制相机移动和旋转。这个控件使用可以把相机想象成是无人机的摄像头。
/**操作方式
  A键和D键控制镜头左右移动 
  W键|鼠标左键和S键|鼠标右键控制镜头前进后退 
  R键和F键控制镜头的前进后退 
  Q键和E键控制镜头沿Z轴进行顺时针和逆时针旋转 
  向左键和向右键控制镜头沿Y轴旋转 
  向上键和向下键控制镜头沿X轴旋转
   */

import * as THREE from "three";
//import "three-orbitcontrols";
import Stats from "stats-js";
import OrbitControls from "three/examples/js/controls/OrbitControls";
import FlyControls from "three/examples/js/controls/FlyControls.js";
import * as dat from "dat.gui";
export default {
  data() {
    return {
      scene: null, //场景
      camera: null, //相机
      renderer: null, //渲染器
      ambientLight: null,
      pointLight: null,
      controls: null,
      clock: null,
      stats: null,
      gui: null,
      plane: null,
      cube: null,
      debug: true
    };
  },
  mounted() {
    this.initGui();
    // 假设你将要画一个圆或者画一条线，而不是一个线框模型，或者说不是一个Mesh（网格）。
    // 第一步我们要做的，是设置好renderer（渲染器）、scene（场景）和camera（相机）-
    let mapEle = document.getElementById("map");
    let width = mapEle.clientWidth;
    let height = mapEle.clientHeight;
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
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.camera.position.set(20, 40, 0);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0)); //指的是相机观察的目标点
    },
    initRender() {
      let mapEle = document.getElementById("map");
      let width = mapEle.clientWidth;
      let height = mapEle.clientHeight;
      this.renderer = new THREE.WebGLRenderer({
        antialias: true //antialias（是否启用抗锯齿）
      });
      //设置渲染器的尺寸
      this.renderer.setSize(width, height);
      //告诉渲染器需要阴影效果
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;
      //将渲染器放置到指定dom当中
      mapEle.appendChild(this.renderer.domElement);
    },
    initLight() {
      this.ambientLight = new THREE.AmbientLight("#111111");
      this.scene.add(this.ambientLight);
      //创建一个平行光光源照射到物体上
      this.pointLight = new THREE.PointLight("#ffffff");

      //告诉平行光需要开启阴影投射
      this.pointLight.castShadow = true;

      this.scene.add(this.pointLight);
    },
    initGui() {},
    initModel() {
      //辅助工具
      var helper = new THREE.AxisHelper(10);
      this.scene.add(helper);
      //球体
      var sphereGeometry = new THREE.SphereGeometry(10, 30, 30);
      var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
      var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(-20, 20, 0);
      sphere.castShadow = true;
      this.scene.add(sphere);

      //立方体
      var cubeGeometry = new THREE.CubeGeometry(10, 10, 10);

      var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff });

      this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      this.cube.position.x = 30;
      this.cube.position.y = 5;
      this.cube.position.z = -5;

      //告诉立方体需要投射阴影
      this.cube.castShadow = true;

      this.scene.add(this.cube);

      //底部平面
      var planeGeometry = new THREE.PlaneGeometry(100, 100);
      var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });

      this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
      this.plane.rotation.x = -0.5 * Math.PI;
      this.plane.position.y = -0;

      //告诉底部平面需要接收阴影
      this.plane.receiveShadow = true;

      this.scene.add(this.plane);
    },
    initControls() {
      this.clock = new THREE.Clock();
      this.controls = new THREE.FlyControls(this.camera);
      this.controls.movementSpeed = 100; //设置移动的速度
      this.controls.rollSpeed = Math.PI / 6; //设置旋转速度
      this.controls.autoForward = false;
      this.controls.dragToLook = false;
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
      //渲染图形

      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      var delta = this.clock.getDelta();
      this.render();
      this.stats.update();
      this.controls.update(delta);
      requestAnimationFrame(this.animate);
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