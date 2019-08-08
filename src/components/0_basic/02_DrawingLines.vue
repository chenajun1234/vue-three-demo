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
      light:null //灯光
    };
  },
  mounted() {
    let mapEle = document.getElementById("map");
    let width = mapEle.clientWidth;
    let height = mapEle.clientHeight;

    //场景
    this.initScene();

    //相机
    this.initCamera();

    //渲染器
    this.initRender();

    //灯光
    this.light = this.initLight();

    this.scene.add(this.light);
    //定义一个材质。对于线条来说，
    //vertexColors 使用顶点颜色 根据点的颜色 渐变
   // let material = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors});
    let material = new THREE.LineBasicMaterial({color: 0x444444});//不使用顶点颜色 color1颜色失效
    let color1 = new THREE.Color(0x444444),
      color2 = new THREE.Color(0xff0000),
      color3 = new THREE.Color(0xfff000);

    //定义顶点的Geometry 或者 BufferGeometry。
    //（推荐使用BufferGeometry，因为它在性能上表现得会更好一些；但在这里，为了简单起见，使用Geometry）：
    let geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-10,10, 0));//参数 x y z  一个点参数
    geometry.vertices.push(new THREE.Vector3(-10, -10, 0));
     geometry.vertices.push(new THREE.Vector3(10, -10, 0)); 
      geometry.vertices.push(new THREE.Vector3(-10,10, 0));


   /* var p1 = new THREE.Vector3(0, 0, 0);
    var p2 = new THREE.Vector3(0, 45, 0);   
    geometry.vertices.push(p1);
    geometry.vertices.push(p2);   */
    geometry.colors.push(color1, color2,color3);//几个点 就要有几个颜色 不然图形出不来
   // geometry — 表示线段的顶点。
    //material — 线条材料。默认为 LineBasicMaterial.
    let line = new THREE.Line(geometry, material, THREE.LineSegments);
    this.scene.add(line);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
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
      this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 500);
      this.camera.position.set(0, 0, 100);
      this.camera.lookAt(0, 0, 0);
    },
    initRender() {
      let mapEle = document.getElementById("map");
      let width = mapEle.clientWidth;
      let height = mapEle.clientHeight;
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("webgl2");
      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        context: context,
        antialias: true
      });
      this.renderer.setSize(width, height);
      mapEle.appendChild(this.renderer.domElement);
      this.renderer.setClearColor(0xffffff, 1.0);
    },
    initLight(){

      let light = new THREE.DirectionalLight(0xff0000, 1.0, 0);
      light.position.set(100, 100, 200);      
      return light;
    }
  }
};
</script>
<style>
#map {
  border: none;
  cursor: pointer;
  width: 100%;
  height: 600px;
  background-color: #eeeeee;
}
</style>

