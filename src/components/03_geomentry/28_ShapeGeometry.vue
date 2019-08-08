<template>
  <div>
    <div id="map"></div>
    <div id="my-gui-container"></div>
  </div>
</template>
<script>
/*页面:LineBasicMaterial 网格深度材质 用于绘制虚线样式几何体的材质。
    scale	线条中虚线部分的占比，缩放dashSize和gapSize。如果scale的值小于1，dashSize和gapSize就会增大；如果scale的值小于1，dashSize和gapSize就会减小
    dashSize	破折号（-）的大小。默认为3。
    gapSize	间隙的大小。默认为1
   */

import * as THREE from "three";
import Stats from "stats-js";
import OrbitControls from "three/examples/js/controls/OrbitControls";
import { ConvexBufferGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import { SceneUtils } from "three/examples/jsm/utils/SceneUtils";
import * as dat from "dat.gui";
export default {
  data() {
    return {
      scene: null, //场景
      camera: null, //相机
      renderer: null, //渲染器
      ambientLight: null,
      hemiLight: null,
      Light: null,
      controls: null,
      gui: null,
      line: null,
      step: 0
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
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
      this.camera.position.set(0, 0, 600);
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
      this.scene.add(new THREE.AmbientLight(0x404040));

      this.Light = new THREE.DirectionalLight(0xffffff);
      this.Light.position.set(1, 1, 1);
      this.scene.add(this.Light);
    },
    initGui() {},
    initModel() {
      var shape = new THREE.ShapeGeometry(this.drawShape());
      var material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
      material.side = THREE.DoubleSide; //设置成两面都可见  
      var mesh = new THREE.Mesh(shape, material);
      this.scene.add(mesh);
      //此方法是创建两种纹理的方法
        var shape = new THREE.ShapeGeometry(this.drawShape());
        var mesh = this.createMesh(shape);
        this.scene.add(mesh);
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
      this.controls.maxDistance = 10000;
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
      //设置模型动画
      // this.line.rotation.z = this.step += 0.01;
      // this.line.rotation.y = this.step += 0.01;
      //渲染图形
      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      this.controls.update();
      this.render();
      this.stats.update();

      requestAnimationFrame(this.animate);
    },
    //生成2d图形
    drawShape() {
      // 实例化shape对象
      var shape = new THREE.Shape();//使用路径以及可选的孔洞来定义一个二维形状平面。 它可以和ExtrudeGeometry、ShapeGeometry一起使用，获取点，或者获取三角面。

      // 设置开始点的位置
      shape.moveTo(20, 10);

      // 从起始点绘制直线到当前位置
      shape.lineTo(20, 40);

      //设置一条曲线到30 40
      shape.bezierCurveTo(15, 25, -5, 25, -30, 40);

      // 设置一条通过当前所有顶点的光滑曲线
      shape.splineThru([
        new THREE.Vector2(-22, 30),
        new THREE.Vector2(-18, 20),
        new THREE.Vector2(-20, 10)
      ]);

      // 设置曲线回到顶点
      shape.quadraticCurveTo(0, -15, 20, 10);

      // 添加第一个眼
      var hole1 = new THREE.Path();
      hole1.absellipse(6, 20, 2, 3, 0, Math.PI * 2, true);
      shape.holes.push(hole1);

      // 添加第二个眼
      var hole2 = new THREE.Path();
      hole2.absellipse(-10, 20, 2, 3, 0, Math.PI * 2, true);
      shape.holes.push(hole2);

      // 添加嘴巴，一半的圆
      var hole3 = new THREE.Path();
      hole3.absarc(0, 5, 2, 0, Math.PI, true);
      shape.holes.push(hole3);

      // 返回shape
      return shape;
    },
    createMesh(geom) {
      // 创建两个纹理
      var meshMaterial = new THREE.MeshNormalMaterial();//一种把法向量映射到RGB颜色的材质。
      meshMaterial.side = THREE.DoubleSide; //两面都可见
      var wireFrameMat = new THREE.MeshBasicMaterial();
      wireFrameMat.wireframe = true; //打开线框
      // 将两种材质都赋给几何体
      var mesh = new SceneUtils.createMultiMaterialObject(geom, [
        meshMaterial,
        wireFrameMat
      ]);

      return mesh;
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