<template>
  <div>
    <div id="map"></div>
    <div id="my-gui-container"></div> 
  </div>
</template>
<script>
//页面:平行光
/**与点光源和聚光灯光源的区别
    最大的区别就是，点光源和聚光灯光源距离物体越远光线越暗。光是从一点发出的。 
    而被平行光照亮的整个区域接收到的光强是一样的。光是平行的。
    由于模型的阴影渲染会消耗很多的性能，所以我们需要设置平行光相关的区域能够显示阴影，和阴影显示的良好程度。如下几个属性：
    directionalLight.shadow.camera.near = 20; //产生阴影的最近距离
    directionalLight.shadow.camera.far = 200; //产生阴影的最远距离
    directionalLight.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
    directionalLight.shadow.camera.right = 50; //最右边
    directionalLight.shadow.camera.top = 50; //最上边
    directionalLight.shadow.camera.bottom = -50; //最下面

    //这两个值决定使用多少像素生成阴影 默认512
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.mapSize.width = 1024;
    参考:http://www.wjceo.com/blog/threejs/2018-02-12/29.html
   */

import * as THREE from "three";
//import "three-orbitcontrols";
import Stats from "stats-js";
import OrbitControls from "three/examples/js/controls/OrbitControls";
import * as dat from 'dat.gui';
export default {
  data() {
    return {
      scene: null, //场景
      camera: null, //相机
      renderer: null, //渲染器
      ambientLight:null,
      directionalLight:null,
      controls: null,
      stats: null,
      gui:null,
      plane:null,
      cube:null,
      debug:true
    };
  },
  mounted() {
    this.initGui();
    // 假设你将要画一个圆或者画一条线，而不是一个线框模型，或者说不是一个Mesh（网格）。
    // 第一步我们要做的，是设置好renderer（渲染器）、scene（场景）和camera（相机）-
    // （如果对这里所提到的东西，还不了解，请阅读本手册第一章“创建一个场景 - Creating a scene”）。
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
      this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
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
      //添加环境光
      this.ambientLight = new THREE.AmbientLight("#111111");
      this.scene.add(this.ambientLight);
      //创建一个平行光光源照射到物体上     
      this.directionalLight = new THREE.DirectionalLight("#ffffff");
      this.directionalLight.position.set(-40, 60, -10);
     this.directionalLight.shadow.camera.near = 20; //产生阴影的最近距离
        this.directionalLight.shadow.camera.far = 200; //产生阴影的最远距离
        this.directionalLight.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
        this.directionalLight.shadow.camera.right = 50; //最右边
        this.directionalLight.shadow.camera.top = 50; //最上边
        this.directionalLight.shadow.camera.bottom = -50; //最下面

        //这两个值决定使用多少像素生成阴影 默认512
        this.directionalLight.shadow.mapSize.height = 1024;
        this.directionalLight.shadow.mapSize.width = 1024;

        console.log(this.directionalLight);

        //告诉平行光需要开启阴影投射
        this.directionalLight.castShadow = true;


      this.scene.add(this.directionalLight);

      this.debug = new THREE.CameraHelper(this.directionalLight.shadow.camera);
       this.debug.name = "debug";
      this.scene.add(this.debug);
    },
    initGui() {      
        //声明一个保存需求修改的相关数据的对象
        this.gui = {
            ambientLight:"#111111", //环境光源
            directionalLight:"#ffffff", //平行光
            intensity:1, //灯光强度
            visible:true, //是否可见
            castShadow:true,
            target:"plane",
            debug:true
        };
        let datGui = new dat.GUI();
        let customContainer = document.getElementById('my-gui-container'); 
        customContainer.appendChild(datGui.domElement); 
        datGui.addColor(this.gui,"ambientLight").onChange(function (e) {
            window.vue.ambientLight.color = new THREE.Color(e);
        });
        datGui.addColor(this.gui,"directionalLight").onChange(function (e) {
            window.vue.directionalLight.color = new THREE.Color(e);
        });
    
        datGui.add(this.gui,"intensity",0,5).onChange(function (e) {
            window.vue.directionalLight.intensity = e;//光源着色的强度，默认为1
        });
        datGui.add(this.gui,"visible").onChange(function (e) {
            window.vue.directionalLight.visible = e;//如果该属性设置为“true”（默认值），该光源就会打开，如果设置为“false”，该光源就会关闭
        });
       
        datGui.add(this.gui,"castShadow").onChange(function (e) {
            window.vue.directionalLight.castShadow = e;//如果设置为true，这个光源就会产生阴影
        });
       
        datGui.add(this.gui,"debug").onChange(function (e) {
            if(e){
                window.vue.debug = new THREE.CameraHelper(window.vue.directionalLight.shadow.camera);
                window.vue.debug.name = "debug";
                window.vue.scene.add(window.vue.debug);
            }else{
                window.vue.scene.remove(window.vue.debug);
            }
        });     
    },
    initModel() {
       //辅助工具
        var helper = new THREE.AxisHelper(10);
        this.scene.add(helper);

        //立方体
        var cubeGeometry = new THREE.CubeGeometry(10,10,10);

        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ffff});

        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cube.position.x = 30;
        this.cube.position.y = 5;
        this.cube.position.z = -5;

        //告诉立方体需要投射阴影
        this.cube.castShadow = true;

        this.scene.add(this.cube);

        //底部平面
        var planeGeometry = new THREE.PlaneGeometry(100, 100);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xaaaaaa});

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

#my-gui-container{ 
    position: absolute; 
    top: 10%; 
    right: 1.5%; 
    z-index: 100; 
} 
</style>