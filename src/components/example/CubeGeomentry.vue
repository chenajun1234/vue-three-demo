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
      light:null, //灯光
      material:null//材质
    };
  },
  mounted() {
    // 假设你将要画一个圆或者画一条线，而不是一个线框模型，或者说不是一个Mesh（网格）。
    // 第一步我们要做的，是设置好renderer（渲染器）、scene（场景）和camera（相机）-
    // （如果对这里所提到的东西，还不了解，请阅读本手册第一章“创建一个场景 - Creating a scene”）。
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

    this.drawAxes();

    //材质
    this.initMaterial();   
    this.drawCube();
    //渲染图形
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
    },
    drawAxes() {
                // x-axis
                var xGeo = new THREE.Geometry();
                xGeo.vertices.push(new THREE.Vector3(0, 0, 0));
                xGeo.vertices.push(new THREE.Vector3(3, 0, 0));
                var xMat = new THREE.LineBasicMaterial({
                    color: 0xff0000
                });
                var xAxis = new THREE.Line(xGeo, xMat);
                this.scene.add(xAxis);
                
                // y-axis
                var yGeo = new THREE.Geometry();
                yGeo.vertices.push(new THREE.Vector3(0, 0, 0));
                yGeo.vertices.push(new THREE.Vector3(0, 3, 0));
                var yMat = new THREE.LineBasicMaterial({
                    color: 0x00ff00
                });
                var yAxis = new THREE.Line(yGeo, yMat);
                this.scene.add(yAxis);
                
                // z-axis
                var zGeo = new THREE.Geometry();
                zGeo.vertices.push(new THREE.Vector3(0, 0, 0));
                zGeo.vertices.push(new THREE.Vector3(0, 0, 3));
                var zMat = new THREE.LineBasicMaterial({
                    color: 0x00ccff
                });
                var zAxis = new THREE.Line(zGeo, zMat);
                this.scene.add(zAxis);
    },
    initMaterial(){
        this.material = new THREE.MeshBasicMaterial({
                    color: 0xffff00,
                    wireframe: true
                });
    },
    drawCube() {
            var cube = new THREE.Mesh(new THREE.CubeGeometry(1, 2, 3, 2, 2, 3), this.material);
            this.scene.add(cube);
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

