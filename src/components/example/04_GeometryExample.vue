<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
import * as THREE from "three";

export default {
  name: "drawingLines",
  data() {
    return {
      scene: null, //场景
      camera: null, //相机
      renderer: null, //渲染器
      light: null, //灯光
      material: null, //材质
      geometry: null
    };
  },
  mounted() {
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
    this.light = this.initLight();
    this.scene.add(this.light);
    //材质
    this.material = this.initMaterial();
    //this.material .visible = true;//设置为false，模型将不会被渲染到场景内

    this.geometry = this.intiCubeGeometry();

    //绘制几何图
    var cube = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(cube);
   // this.camera.position.z = 5 ; // 相机位置
    //渲染图形
    //this.renderer.render(this.scene, this.camera);

    var animate = function() {  
      cube.rotation.x += 0.02;
      cube.rotation.y += 0.02;
      window.vue.renderer.render(window.vue.scene, window.vue.camera);
      requestAnimationFrame(animate);
    };

    animate();
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
      this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
      //设置相机的位置
      this.camera.position.set(0, 0, 6);
      //
      //this.camera.lookAt(0, 0, 0);
    },
    initRender() {
      let mapEle = document.getElementById("map");
      let width = mapEle.clientWidth;
      let height = mapEle.clientHeight;    
      this.renderer = new THREE.WebGLRenderer({       
        antialias: true//antialias（是否启用抗锯齿）
      });
      //设置渲染器的尺寸
      this.renderer.setSize(width, height);
      //将渲染器放置到指定dom当中
      mapEle.appendChild(this.renderer.domElement);
      this.renderer.setClearColor(0xffffff, 1.0);
     // 设置颜色及其透明度
     this.renderer.setClearColor(0x000, 1.0);

    },
    initLight() {
      //创建一个平行光光源照射到物体上
      /**
       * DirectionalLight( color : Integer, intensity : Float )
          color - (可选参数) 16进制表示光的颜色。 缺省值为 0xffffff (白色)。
          intensity - (可选参数) 光照的强度。缺省值为1。

       */
      let light = new THREE.DirectionalLight(0xffffff, 1.5);
      //设置平型光照射方向，照射方向为设置的点照射到原点
      //position : Vector3 假如这个值设置等于 Object3D.DefaultUp (0, 1, 0),那么光线将会从上往下照射。
      light.position.set(0, 0, 1);
      return light;
    },
    initMaterial() {
      var map = THREE.ImageUtils.loadTexture("/src/static/textures/万花.jpg");
       //然后创建一个phong材质来处理着色，并传递给纹理映射
      return new THREE.MeshPhongMaterial({map: map});
     
    },
    intiCubeGeometry() {
      //创建一个立方体的几何体
      return new THREE.CubeGeometry(1, 1, 1);
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
</style>

