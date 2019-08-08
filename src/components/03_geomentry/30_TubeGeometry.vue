<template>
  <div>
    <div id="map"></div>
    <div id="my-gui-container"></div>
  </div>
</template>
<script>
/*页面:TubeGeometry 创建一个沿着三维曲线延伸的管道 
 new THREE.TubeGeometry(path,segments,radius,radiusSegments,closed);
    path	是	该属性用一个THREE.CatmullRomCurve3对象来指定THREE.TubeGeometry对象应当遵循的路径
    segments	否	该属性指定构建这个THREE.TubeGeometry对象所用的分段数。默认值为64。路径越长，指定的分段数应该越多
    radius	否	该属性指定THREE.TubeGeometry对象的半径。默认值为1
    radiusSegments	否	该属性指定THREE.TubeGeometry对象圆周的分段数。默认值为8。分段数越多，越圆滑
    colosed	否	如果该属性设为true，THREE.TubeGeometry头和尾部会连接起来。默认值为false。

   */

import * as THREE from "three";
import Stats from "stats-js";
import OrbitControls from "three/examples/js/controls/OrbitControls";
// import { ConvexBufferGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import { SceneUtils } from "three/examples/jsm/utils/SceneUtils";
import * as dat from "dat.gui";
export default {
  name: "TubeGeometry",
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
      shape: null,
      spGroup: null,
      tubeMesh: null
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
    initGui() {
      //声明一个保存需求修改的相关数据的对象
      this.gui = {
        numberOfPoints: 5,
        segments: 64,//该属性指定构建这个THREE.TubeGeometry对象所用的分段数。默认值为64。路径越长，指定的分段数应该越多
        radius: 1,//该属性指定THREE.TubeGeometry对象的半径。默认值为1
        radiusSegments: 8,//该属性指定THREE.TubeGeometry对象圆周的分段数。默认值为8。分段数越多，越圆滑
        closed: false,//如果该属性设为true，THREE.TubeGeometry头和尾部会连接起来。默认值为false。
        points: [],
        newPoints: function() {
          //生成一些随机点放置到数组当中
          var points = [];
          for (var i = 0; i < window.vue.gui.numberOfPoints; i++) {
            var randomX = -20 + Math.round(Math.random() * 50);
            var randomY = -15 + Math.round(Math.random() * 40);
            var randomZ = -20 + Math.round(Math.random() * 40);

            points.push(new THREE.Vector3(randomX, randomY, randomZ));
          }
          window.vue.gui.points = points;
          window.vue.gui.redraw();
        },
        redraw: function() {
          //清楚掉场景中原来的模型对象
          window.vue.scene.remove(window.vue.spGroup);
          window.vue.scene.remove(window.vue.tubeMesh);
          //重新绘制模型
          window.vue.generatePoints(
            window.vue.gui.points,
            window.vue.gui.segments,
            window.vue.gui.radius,
            window.vue.gui.radiusSegments,
            window.vue.gui.closed
          );
        }
      };
      var datGui = new dat.GUI();
      let customContainer = document.getElementById("my-gui-container");
      customContainer.appendChild(datGui.domElement);
      //将设置属性添加到gui当中，this.gui.add(对象，属性，最小值，最大值）
      datGui.add(this.gui, "newPoints");
      datGui
        .add(this.gui, "numberOfPoints", 2, 15)
        .step(1)
        .onChange(this.gui.newPoints);
      datGui
        .add(this.gui, "segments", 0, 200)
        .step(1)
        .onChange(this.gui.redraw);
      datGui.add(this.gui, "radius", 0, 10).onChange(this.gui.redraw);
      datGui
        .add(this.gui, "radiusSegments", 0, 100)
        .step(1)
        .onChange(this.gui.redraw);
      datGui.add(this.gui, "closed").onChange(this.gui.redraw);

      this.gui.newPoints();
    },
    initModel() {},
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
      this.controls.dampingFactor = 0.25;
      //是否可以缩放
      this.controls.enableZoom = true;
      //是否自动旋转
      this.controls.autoRotate = true;
      //设置相机距离原点的最远距离
      this.controls.minDistance = 200;
      //设置相机距离原点的最远距离
      this.controls.maxDistance = 400;
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
    },
    createMesh(geom) {
      var meshMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.3
      });

      //创建一个线框纹理
      var wireFrameMat = new THREE.MeshBasicMaterial();
      wireFrameMat.wireframe = true;

      // 将两种材质都赋给几何体
      var mesh = new SceneUtils.createMultiMaterialObject(geom, [
        meshMaterial,
        wireFrameMat
      ]);

      return mesh;
    },
    generatePoints(points, segments, radius, radiusSegments, closed) {
      this.spGroup = new THREE.Object3D(); //赋值spGroup存储模型点的3d对象
      var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: false
      }); //声明一个红色普通纹理
      //将所有的顶点创建出球形存储到spGroup内
      points.forEach(function(point) {
        var spGeom = new THREE.SphereGeometry(0.2);//半径0.2的球形几何体
        var spMesh = new THREE.Mesh(spGeom, material);
        spMesh.position.copy(point);
        window.vue.spGroup.add(spMesh);
      });
      // 将spGroup对象添加到场景当中
      this.scene.add(this.spGroup);

      // THREE.CatmullRomCurve3方法可以将一组顶点生成一条平滑的曲线
      var tubeGeometry = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),//从一系列的点创建一条平滑的三维样条曲线。
        segments,
        radius,//对象的半径。默认值为1
        radiusSegments,//对象圆周的分段数。默认值为8。分段数越多，越圆滑
        closed//如果该属性设为true，THREE.TubeGeometry头和尾部会连接起来。默认值为false。
      );
      //将模型对象赋值给tubeMesh并添加到场景当中
      this.tubeMesh = this.createMesh(tubeGeometry);
      this.scene.add(this.tubeMesh);
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