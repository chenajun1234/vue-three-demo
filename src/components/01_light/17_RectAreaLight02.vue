<template>
  <div>
    <div id="map"></div>
    <div id="my-gui-container"></div>
  </div>
</template>
<script>
//页面:特殊光源THREE.RectAreaLight窗口射入光线模拟
/**此光源在整个面上均匀地发射出一个矩形平面。这可以用来模拟像明亮的窗户或带状照明的东西。
 * 不支持阴影。
 * 只支持 MeshStandardMaterial 和 MeshPhysicalMaterial 两种材质。
  <span>你必须在你的场景中加入 RectAreaLightUniformsLib 。</span>
 * new THREE.RectAreaLight(颜色, 光的强度, 宽度, 高度);

   记得 rectLightHelper.update(); 在渲染器里面添加
 */

import * as THREE from "three";
//import "three-orbitcontrols";
import Stats from "stats-js";
import OrbitControls from "three/examples/js/controls/OrbitControls";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import * as dat from "dat.gui";
var origin = new THREE.Vector3();
export default {
  data() {
    return {
      scene: null, //场景
      camera: null, //相机
      renderer: null, //渲染器
      ambient: null,
      rectLight: null,
      rectLightHelper: null,
      rectLightMesh:null,
      matStdFloor: null,
      matStdObjects: null,
      mshStdBox: null,
      controls: null,
      stats: null,
      gui: null,
      plane: null,
      cube: null,
      debug: true
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
    this.initGui();
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
      this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
      this.camera.position.set(0, 20, 35);
      //this.camera.lookAt(new THREE.Vector3(0, 0, 0)); //指的是相机观察的目标点
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
      this.renderer.setPixelRatio(window.devicePixelRatio);
      //告诉渲染器需要阴影效果
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;
      //将渲染器放置到指定dom当中
      mapEle.appendChild(this.renderer.domElement);

      if (!this.renderer.extensions.get("OES_texture_float")) {
        alert("OES_texture_float not supported");
        throw "missing webgl extension";
      }
      if (!this.renderer.extensions.get("OES_texture_float_linear")) {
        alert("OES_texture_float_linear not supported");
        throw "missing webgl extension";
      }
    },
    initLight() {
      this.ambient = new THREE.AmbientLight(0xffffff, 0.1);
      this.scene.add(this.ambient);
      RectAreaLightUniformsLib.init();
      //RectAreaLightUniformsLib.init();
      this.rectLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10);
      this.rectLight.position.set(5, 5, 0);
      this.scene.add(this.rectLight);

      this.rectLightMesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(),
        new THREE.MeshBasicMaterial({ side: THREE.BackSide })
      );
      this.rectLightMesh.scale.x = this.rectLight.width;
      this.rectLightMesh.scale.y = this.rectLight.height;
      this.rectLight.add(this.rectLightMesh);
      var rectLightMeshBack = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(),
        new THREE.MeshBasicMaterial({ color: 0x080808 })
      );
      this.rectLightMesh.add(rectLightMeshBack);
    },
    initModel() {
      //辅助工具
      var helper = new THREE.AxisHelper(10);
      this.scene.add(helper);
      
      var geoFloor = new THREE.BoxBufferGeometry(2000, 0.1, 2000);
      this.matStdFloor = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0,
        metalness: 0
      });
      var mshStdFloor = new THREE.Mesh(geoFloor, this.matStdFloor);
      this.scene.add(mshStdFloor);
      this.matStdObjects = new THREE.MeshStandardMaterial({
        color: 0xa00000,
        roughness: 0,
        metalness: 0
      });
      var geoBox = new THREE.BoxBufferGeometry(Math.PI, Math.sqrt(2), Math.E);
      this.mshStdBox = new THREE.Mesh(geoBox, this.matStdObjects);
      this.mshStdBox.position.set(0, 5, 0);
      this.mshStdBox.rotation.set(0, Math.PI / 2.0, 0);
      this.mshStdBox.castShadow = true;
      this.mshStdBox.receiveShadow = true;
      this.scene.add(this.mshStdBox);
      var geoSphere = new THREE.SphereBufferGeometry(1.5, 32, 32);
      var mshStdSphere = new THREE.Mesh(geoSphere, this.matStdObjects);
      mshStdSphere.position.set(-5, 5, 0);
      mshStdSphere.castShadow = true;
      mshStdSphere.receiveShadow = true;
      this.scene.add(mshStdSphere);
      var geoKnot = new THREE.TorusKnotBufferGeometry(1.5, 0.5, 100, 16);
      var mshStdKnot = new THREE.Mesh(geoKnot, this.matStdObjects);
      mshStdKnot.position.set(5, 5, 0);
      mshStdKnot.castShadow = true;
      mshStdKnot.receiveShadow = true;
      this.scene.add(mshStdKnot);
    },
    initGui() {
      //声明一个保存需求修改的相关数据的对象
      this.gui = {
        motion: true,
        width: window.vue.rectLight.width,
        height: window.vue.rectLight.height,
        color: window.vue.rectLight.color.getHex(),
        intensity: window.vue.rectLight.intensity,
        ambient: window.vue.ambient.intensity,
        "floor color": window.vue.matStdFloor.color.getHex(),
        "object color": window.vue.matStdObjects.color.getHex(),
        roughness: window.vue.matStdFloor.roughness,
        metalness: window.vue.matStdFloor.metalness
      };
      let datGui = new dat.GUI();
      let customContainer = document.getElementById("my-gui-container");
      customContainer.appendChild(datGui.domElement);
      datGui.open();
      datGui.add(this.gui, "motion");

      var lightFolder = datGui.addFolder("Light");

      lightFolder
        .add(this.gui, "width", 1, 20)
        .step(0.1)
        .onChange(function(val) {
          window.vue.rectLight.width = val;
          window.vue.rectLightMesh.scale.x = val;
        });
      lightFolder
        .add(this.gui, "height", 1, 20)
        .step(0.1)
        .onChange(function(val) {
          window.vue.rectLight.height = val;
          window.vue.rectLightMesh.scale.y = val;
        });
      lightFolder.addColor(this.gui, "color").onChange(function(val) {
        window.vue.rectLight.color.setHex(val);
        window.vue.rectLightMesh.material.color
          .copy(window.vue.rectLight.color)
          .multiplyScalar(window.vue.rectLight.intensity);
      });
      lightFolder
        .add(this.gui, "intensity", 0.0, 4.0)
        .step(0.01)
        .onChange(function(val) {
          window.vue.rectLight.intensity = val;
          window.vue.rectLightMesh.material.color
            .copy(window.vue.rectLight.color)
            .multiplyScalar(window.vue.rectLight.intensity);
        });
      lightFolder
        .add(this.gui, "ambient", 0.0, 0.2)
        .step(0.01)
        .onChange(function(val) {
          window.vue.ambient.intensity = val;
        });
      lightFolder.open();

      var standardFolder = datGui.addFolder("Standard Material");
      standardFolder.addColor(this.gui, "floor color").onChange(function(val) {
        window.vue.matStdFloor.color.setHex(val);
      });
      standardFolder.addColor(this.gui, "object color").onChange(function(val) {
        window.vue.matStdObjects.color.setHex(val);
      });
      standardFolder
        .add(this.gui, "roughness", 0.0, 1.0)
        .step(0.01)
        .onChange(function(val) {
          window.vue.matStdObjects.roughness = val;
          window.vue.matStdFloor.roughness = val;
        });
      // TODO (abelnation): use env map to reflect metal property
      standardFolder
        .add(this.gui, "metalness", 0.0, 1.0)
        .step(0.01)
        .onChange(function(val) {
          window.vue.matStdObjects.metalness = val;
          window.vue.matStdFloor.metalness = val;
        });
      standardFolder.open();
    },
    initControls() {
      this.controls = new THREE.OrbitControls(
        this.camera,
        this.renderer.domElement
      );
      this.controls.target.copy(this.mshStdBox.position);
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
      //渲染图形
      //this.rectLightHelper.update();
      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      requestAnimationFrame(this.animate);
      if (this.gui.motion) {
        var t = Date.now() / 2000;
        // move light in circle around center
        // change light height with sine curve
        var r = 15.0;
        var lx = r * Math.cos(t);
        var lz = r * Math.sin(t);
        var ly = 5.0 + 5.0 * Math.sin(t / 3.0);
        this.rectLight.position.set(lx, ly, lz);
        this.rectLight.lookAt(origin);
      }

      // this.stats.begin();
      this.controls.update();
      this.render();
      //  this.stats.end();
      this.stats.update();
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