<template>
  <div>
    <div id="map"></div>
    <div id="my-gui-container"></div> 
  </div>
</template>
<script>
//页面:环境光 
//this.ambientLight = new THREE.AmbientLight("#111111");

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
      spotLight:null,
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
      this.spotLight   = new THREE.SpotLight(0xffffff); //聚光灯
      this.spotLight.position.set(15,30,10);
      //告诉平行光需要开启阴影投射
      this.spotLight.castShadow = true;
      this.scene.add(this.spotLight);

      this.debug = new THREE.CameraHelper(this.spotLight.shadow.camera);
      this.scene.add(this.debug);
    },
    initGui() {      
        //声明一个保存需求修改的相关数据的对象
        this.gui = {
            ambientLight:"#111111", //环境光源
            spotLight:"#ffffff", //点光源
            lightY: 30, //灯光y轴的位置
            distance:0, //点光源距离
            intensity:1, //灯光强度
            visible:true, //是否可见
            angle:Math.PI/3,
            castShadow:true,
            exponent:30,
            target:"plane",
            debug:true
        };
        let datGui = new dat.GUI({autoPlace: false });
        let customContainer = document.getElementById('my-gui-container'); 
        customContainer.appendChild(datGui.domElement); 
        datGui.addColor(this.gui,"ambientLight").onChange(function (e) {
            window.vue.ambientLight.color = new THREE.Color(e);
        });
        datGui.addColor(this.gui,"spotLight").onChange(function (e) {
            window.vue.spotLight.color = new THREE.Color(e);
        });
        datGui.add(this.gui, "lightY", 0, 100).onChange(function(e){
            window.vue.spotLight.position.y = window.vue.gui.lightY;
        });
        datGui.add(this.gui,"distance",0,200).onChange(function (e) {
            window.vue.spotLight.distance = e;//光源照射的距离。默认为0，这意味着光线的强度不会随着距离增加而减弱
        });
        datGui.add(this.gui,"intensity",0,5).onChange(function (e) {
            window.vue.spotLight.intensity = e;//光源着色的强度，默认为1
        });
        datGui.add(this.gui,"visible").onChange(function (e) {
            window.vue.spotLight.visible = e;//如果该属性设置为“true”（默认值），该光源就会打开，如果设置为“false”，该光源就会关闭
        });
        datGui.add(this.gui,"angle",0,Math.PI*2).onChange(function (e) {
            window.vue.spotLight.angle = e;//光源发射出的光束的宽度。单位是弧度，默认值为Math.PI/3
        });
        datGui.add(this.gui,"castShadow").onChange(function (e) {
            window.vue.spotLight.castShadow = e;//如果设置为true，这个光源就会产生阴影
        });
        datGui.add(this.gui,"exponent",0,100).onChange(function (e) {
          /**使用THREE.SpotLight光源，发射的光线的强度随着光源距离的增加而减弱。
           * exponent属性决定了光线前度递减的速度。使用低值，从光源发出的光线将到达远程的物体，
           * 而使用高值，光线仅能到达非常接近THREE.SpotLight光源的物体 */
            window.vue.spotLight.exponent = e;
        });
        datGui.add(this.gui,"debug").onChange(function (e) {
            if(e){
                window.vue.debug = new THREE.CameraHelper(window.vue.spotLight.shadow.camera);
                window.vue.scene.add(window.vue.debug);
            }else{
                window.vue.scene.remove(window.vue.debug);
            }
        });
      datGui.add(this.gui,"target",["plane","cube"]).onChange(function (e) {
            switch (e){
                case "plane":
                    window.vue.spotLight.target = window.vue.plane;
                    break;
                case "cube":
                    window.vue.spotLight.target = window.vue.cube;
                    break;
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