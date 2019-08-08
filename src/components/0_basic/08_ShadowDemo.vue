<template>
  <div>
    <div id="map"></div>
    <div id="my-gui-container"></div> 
  </div>
</template>

<script>
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
      light: null, //灯光
      controls: null,
      stats: null,
      gui:null,
      sphere:null,
      cube:null
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
      this.scene.add(new THREE.AmbientLight(0x444444));
      //创建一个平行光光源照射到物体上
      /**
        color - (可选参数) 十六进制光照颜色。 缺省值 0xffffff (白色)。
        intensity - (可选参数) 光照强度。 缺省值 1。
        distance - 从光源发出光的最大距离，其强度根据光源的距离线性衰减。 
        angle - 光线散射角度，最大为Math.PI/2。
        penumbra - 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
        decay - 沿着光照距离的衰减量。
       */
      this.light = new THREE.SpotLight(0xffffff); //聚光灯
      this.light.position.set(15,30,10);
      //告诉平行光需要开启阴影投射
      this.light.castShadow = true;

      this.scene.add(this.light);
    },
    initGui() {      
        //声明一个保存需求修改的相关数据的对象
        this.gui = {
            lightY:30, //灯光y轴的位置
            sphereX:0, //球的x轴的位置
            sphereZ:0, //球的z轴的位置
            cubeX:25, //立方体的x轴位置
            cubeZ:-5 //立方体的z轴的位置  
        };
        var datGui = new dat.GUI({autoPlace: false });
        let customContainer = document.getElementById('my-gui-container'); 
        customContainer.appendChild(datGui.domElement); 
        //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
        datGui.add(this.gui,"lightY",0,100);
        datGui.add(this.gui,"sphereX",-30,30);
        datGui.add(this.gui,"sphereZ",-30,30);
        datGui.add(this.gui,"cubeX",0,60);
        datGui.add(this.gui,"cubeZ",-30,30);
    },
    initModel() {
      //你的模型的材质一定要选择对灯光有反应的材质，要不然不会出现效果
      var map=new THREE.TextureLoader().load("/src/static/textures/万花.jpg");
      let material=new THREE.MeshLambertMaterial(
           {map : map, side: THREE.DoubleSide}
      );
      //上面的球
      var sphereGeometry = new THREE.SphereGeometry(5, 20, 20);
      //var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x7777ff });

      this.sphere = new THREE.Mesh(sphereGeometry, material);
      this.sphere.position.y = 5;

      //告诉球需要投射阴影
      this.sphere.castShadow = true;

      this.scene.add(this.sphere);

      //辅助工具
      var helper = new THREE.AxisHelper(10);
      this.scene.add(helper);

      //立方体
      var cubeGeometry = new THREE.CubeGeometry(10, 10, 8);
      var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff });

      this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      this.cube.position.x = 25;
      this.cube.position.y = 5;
      this.cube.position.z = -5;

      //告诉立方体需要投射阴影
      this.cube.castShadow = true;

      this.scene.add(this.cube);

      //底部平面
      var planeGeometry = new THREE.PlaneGeometry(100, 100);
      var planeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.y = -0;

      //告诉底部平面需要接收阴影
      plane.receiveShadow = true;

      this.scene.add(plane);
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

        //更新相关位置
    this.light.position.y = this.gui.lightY;
    this.sphere.position.x = this.gui.sphereX;
    this.sphere.position.z = this.gui.sphereZ;
    this.cube.position.x = this.gui.cubeX;
    this.cube.position.z = this.gui.cubeZ;


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