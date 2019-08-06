<template>
  <div>
    <div id="map"></div>
    <div id="my-gui-container"></div> 
  </div>
</template>
<script>
/*页面:MeshPhongMaterial 网格深度材质
   种光亮的材质。与MeshLambertMaterial中使用的Lambertian模型不同， 它可以模拟具有镜面高光的光泽表面（如上漆木材）
   */

import * as THREE from "three";
import Stats from "stats-js";
import OrbitControls from "three/examples/js/controls/OrbitControls";
//import sceneUtil from 'three/examples/js/utils/SceneUtils.js'
import * as dat from 'dat.gui';
export default {
  data() {
    return {
      scene: null, //场景
      camera: null, //相机
      renderer: null, //渲染器
      ambientLight:null,
      hemiLight:null,
      Light:null,
      controls: null,    
      gui:null,
      plane :null
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
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.camera.position.set(0, 40, 200);
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
      this.ambientLight = new THREE.AmbientLight("#111111");
        this.scene.add(this.ambientLight);

        this.Light = new THREE.PointLight("#ffffff");
        this.Light.position.set(15, 30, 10);     
        //告诉平行光需要开启阴影投射
        this.Light.castShadow = true;

        this.scene.add(this.Light);
    },
    initGui() {      
      this.gui = {
            Light:"#ffffff", //点光源
            LightIntensity:1, //灯光强度
            visible:true, //是否可见
            castShadow:true,
            exponent:30,
            target:"plane",
            debug:false,
            groundColor:"#00ff00",
            skyColor:"#0000ff",
            hemiLightIntensity:0.3
        };
        var datGui = new dat.GUI();
        let customContainer = document.getElementById('my-gui-container'); 
        customContainer.appendChild(datGui.domElement); 
        //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）

        datGui.addColor(this.gui,"skyColor").onChange(function (e) {
            window.vue.ambientLight.color = new THREE.Color(e);
        });
        datGui.addColor(this.gui,"groundColor").onChange(function (e) {
            window.vue.ambientLight.groundColor = new THREE.Color(e);
        });
        datGui.add(this.gui,"hemiLightIntensity",0,1).onChange(function (e) {
            window.vue.ambientLight.intensity = e;
        });
        datGui.addColor(this.gui,"Light").onChange(function (e) {
            window.vue.Light.color = new THREE.Color(e);
        });
        datGui.add(this.gui,"LightIntensity",0,5).onChange(function (e) {
            window.vue.Light.intensity = e;
        });
        datGui.add(this.gui,"visible").onChange(function (e) {
            window.vue.Light.visible = e;
        });
        datGui.add(this.gui,"castShadow").onChange(function (e) {
            window.vue.Light.castShadow = e;
        });
        datGui.add(this.gui,"debug").onChange(function (e) {
            if(e){
                var debug = new THREE.CameraHelper(window.vue.Light.shadow.camera);
                debug.name = "debug";
                window.vue.scene.add(debug);
            }
            else{
                var debug = window.vue.scene.getObjectByName("debug");
                window.vue.scene.remove(debug);
            }
        });
    },
    initModel() {
       //辅助工具
        var helper = new THREE.AxisHelper(10);
        this.scene.add(helper);
        //球体
        var sphereGeometry = new THREE.SphereGeometry(10,30,30);
        var sphereMaterial = new THREE.MeshPhongMaterial({color:0xeeeeee});
        var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
        sphere.position.set(-20,20,0);

        sphere.castShadow = true;

        this.scene.add(sphere);

         //立方体
        var cubeGeometry = new THREE.CubeGeometry(10,10,10);
        var cubeMaterial = new THREE.MeshPhongMaterial({color: 0x00ffff});
        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cube.position.x = 30;
        this.cube.position.y = 5;
        this.cube.position.z = -5;

        //告诉立方体需要投射阴影
        this.cube.castShadow = true;
        this.scene.add(this.cube);

        //底部平面
        var planeGeometry = new THREE.PlaneGeometry(5000, 5000, 20, 20);
        var planeMaterial = new THREE.MeshPhongMaterial({color: 0xaaaaaa});
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.rotation.x = -0.5 * Math.PI;
        this.plane.position.y = -0;

        //告诉底部平面需要接收阴影
        this.plane.receiveShadow = true;

        this.scene.add(this.plane);

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
      //渲染图形

      this.renderer.render(this.scene, this.camera);
    },
    animate() {     
     this.controls.update();
      this.render();
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

#my-gui-container{ 
    position: absolute; 
    top: 10%; 
    right: 1.5%; 
    z-index: 100; 
} 
</style>