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
import RectAreaLightUniformsLib from  "three/examples/js/lights/RectAreaLightUniformsLib";
import * as dat from "dat.gui";
export default {
  data() {
    return {
      scene: null, //场景
      camera: null, //相机
      renderer: null, //渲染器
      ambientLight: null,
      rectLight: null,
      rectLightHelper: null,
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
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.camera.position.set(0, 40, 100);
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
      //将渲染器放置到指定dom当中
      mapEle.appendChild(this.renderer.domElement);
    },
    initLight() {
      this.ambientLight = new THREE.AmbientLight(0x111111);
      this.scene.add(this.ambientLight);
      //创建一个平行光光源照射到物体上 光照颜色 光源强度／亮度 光源宽度  光源高度

      //RectAreaLightUniformsLib.init();
      this.rectLight = new THREE.RectAreaLight(0xffffff, 500, 10, 10);
      this.rectLight.position.set(5, 10, -20);
      this.rectLight.lookAt( 0, 0, 0 );
      //设置区域光旋转角度
      // this.rectLight.rotation.x = 0.5*Math.PI;
      this.scene.add(this.rectLight);

      // TODO: ensure RectAreaLight handles target param correctly
      /*var rectLightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { side: THREE.BackSide } ) );
				rectLightMesh.scale.x = this.rectLight.width;
				rectLightMesh.scale.y = this.rectLight.height;
				this.rectLight.add( rectLightMesh );

        var rectLightMeshBack = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { color: 0x080808 } ) );
        rectLightMesh.add( rectLightMeshBack );*/
        
      this.rectLightHelper = new THREE.RectAreaLightHelper(this.rectLight,0xff0000);
      this.scene.add(this.rectLightHelper);
    },
    initModel() {
      //辅助工具
      var helper = new THREE.AxisHelper(10);
      this.scene.add(helper);
      //球体
      var sphereGeometry = new THREE.SphereGeometry(10, 30, 30);
      var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
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
      var planeGeometry = new THREE.PlaneGeometry(5000, 5000, 20, 20);
      var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });

      this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
      this.plane.rotation.x = -0.5 * Math.PI;
      this.plane.position.y = -0;

      //告诉底部平面需要接收阴影
      this.plane.receiveShadow = true;

      this.scene.add(this.plane);
    },
    initGui() {
      //声明一个保存需求修改的相关数据的对象
      this.gui = {
        motion: true,
        width: window.vue.rectLight.width,
        height: window.vue.rectLight.height,
        color: window.vue.rectLight.color.getHex(),
        intensity: window.vue.rectLight.intensity/*,
        rectLightX: 30, //灯光y轴的位置
        rectLightY: 30, //灯光y轴的位置
        rectLightZ: 30 //灯光y轴的位置*/
      };
      let datGui = new dat.GUI();
      let customContainer = document.getElementById("my-gui-container");
      customContainer.appendChild(datGui.domElement);

      datGui.add(this.gui, "width", 0.1, 100).onChange(function(val) {
        window.vue.rectLight.width = val;
      });

      datGui.add(this.gui, "height", 0.1, 100).onChange(function(val) {
        window.vue.rectLight.height = val;
      });

      datGui.addColor(this.gui, "color").onChange(function(val) {    
        window.vue.rectLight.color.setHex(val);
      });

      datGui.add(this.gui, "intensity", 0.0, 1000).onChange(function(val) {
        window.vue.rectLight.intensity = val;
      });

      /*  datGui.add(this.gui,"rectLightX", -30, 30);
        datGui.add(this.gui,"rectLightY", -30, 30);
        datGui.add(this.gui,"rectLightZ", -30, 30);*/

      datGui.open();
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
      // this.controls.autoRotate = true;
      //设置相机距离原点的最远距离
      this.controls.minDistance = 100;
      //设置相机距离原点的最远距离
      this.controls.maxDistance = 800;
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
      //渲染图形
      this.rectLightHelper.update();
      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      // this.stats.begin();
      this.controls.update();
      this.render();
      //  this.stats.end();
      this.stats.update();
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