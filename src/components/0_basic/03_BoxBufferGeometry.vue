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

    this.geometry = this.intiBoxBufferGeometry();

    //绘制几何图
    var cube = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(cube);

    this.camera.position.z = 50; // 相机位置
    //渲染图形
    //this.renderer.render(this.scene, this.camera);
    var animate = function() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      //cube.rotation.y += 0.01;
      //cube.rotation.z += 0.01;

      window.vue.renderer.render(window.vue.scene, window.vue.camera);
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
    initLight() {
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
    initMaterial() {
      return new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
      });
    },
    intiBoxBufferGeometry() {
      /*
      BoxBufferGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)
      width — X轴上面的宽度，默认值为1。
      height — Y轴上面的高度，默认值为1。
      depth — Z轴上面的深度，默认值为1。
      widthSegments — （可选）宽度的分段数，默认值是1。
      heightSegments — （可选）高度的分段数，默认值是1。
      depthSegments — （可选）深度的分段数，默认值是1。
      */
     /**
      * parameters 属性
      * geometry.parameters; // outputs an object {width: 1, height: 1, depth: 1, widthSegments: undefined, heightSegments: undefined}
        cube.geometry.parameters; // as above
        cube.geometry.parameters.width; // === 1
        cube.geometry.parameters.widthSegments // === undefined.
      * 
      */
      return new THREE.BoxBufferGeometry(10, 10, 10,1,1,2);
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

