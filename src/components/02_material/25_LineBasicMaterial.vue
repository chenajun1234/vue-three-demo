<template>
  <div>
    <div id="map"></div>
    <div id="my-gui-container"></div>
  </div>
</template>
<script>
/*页面:LineBasicMaterial 网格深度材质
   用于绘制线段的基础材质。
    color	该属性设置材质的颜色，如果设置了vertexColors，这是属性将被忽略
    linewidth	设置线的宽度，默认值为1.0
    linecap	这个属性定义了线框模式下顶点间线段的端点如何显示。可选的值包括butt（平）、round（圆）和square（方）。
            默认值为round。在实际使用中，这个属性的修改结果很难看出来。WebGLRenderer对象不支持该属性
    linejoin	这个属性定义了线段的连接点如何显示。可选的值有round（圆）、bevel（斜角）和miter（尖角）。
              默认值为round。如果你在一个使用低透明度和很大wireframeLinewidth值的例子里靠近观察，就可以看到这个属性的效果。WebGLRenderer对象不支持该属性
    vertexColors	将这个属性设置成THREE.VertexColors值，就可以给每个顶点指定一种颜色
    fog	该属性指定当前材质是否受全局雾化效果设置的影响
   */

import * as THREE from "three";
import Stats from "stats-js";
import OrbitControls from "three/examples/js/controls/OrbitControls";
//import sceneUtil from 'three/examples/js/utils/SceneUtils.js'
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
      step:0
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
      this.camera.position.set(0, 50, 100);
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
      this.ambientLight = new THREE.AmbientLight("0x0c0c0c");
      this.scene.add(this.ambientLight);

      this.Light = new THREE.SpotLight("#ffffff");
      this.Light.position.set(-40, 60, -10);
      //告诉平行光需要开启阴影投射
      this.Light.castShadow = true;

      this.scene.add(this.Light);
    },
    initGui() {
      this.gui = {
        Light: "#ffffff", //点光源
        LightIntensity: 1, //灯光强度
        visible: true, //是否可见
        castShadow: true,
        exponent: 30,
        target: "plane",
        debug: false,
        groundColor: "#00ff00",
        skyColor: "#0000ff",
        hemiLightIntensity: 0.3
      };
      var datGui = new dat.GUI();
      let customContainer = document.getElementById("my-gui-container");
      customContainer.appendChild(datGui.domElement);
      //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）

      datGui.addColor(this.gui, "skyColor").onChange(function(e) {
        window.vue.ambientLight.color = new THREE.Color(e);
      });
      datGui.addColor(this.gui, "groundColor").onChange(function(e) {
        window.vue.ambientLight.groundColor = new THREE.Color(e);
      });
      datGui.add(this.gui, "hemiLightIntensity", 0, 1).onChange(function(e) {
        window.vue.ambientLight.intensity = e;
      });
      datGui.addColor(this.gui, "Light").onChange(function(e) {
        window.vue.Light.color = new THREE.Color(e);
      });
      datGui.add(this.gui, "LightIntensity", 0, 5).onChange(function(e) {
        window.vue.Light.intensity = e;
      });
      datGui.add(this.gui, "visible").onChange(function(e) {
        window.vue.Light.visible = e;
      });
      datGui.add(this.gui, "castShadow").onChange(function(e) {
        window.vue.Light.castShadow = e;
      });
      datGui.add(this.gui, "debug").onChange(function(e) {
        if (e) {
          var debug = new THREE.CameraHelper(window.vue.Light.shadow.camera);
          debug.name = "debug";
          window.vue.scene.add(debug);
        } else {
          var debug = window.vue.scene.getObjectByName("debug");
          window.vue.scene.remove(debug);
        }
      });
    },
    initModel() {
      //获取点的位置      
      var points = this.gosper(2, 50);//(密度, 大小)

      //实例化一个几何图形
      var geometry = new THREE.Geometry();
      var colors = []; //存放颜色的数组
      for (var i = 0, len = points.length; i < len; i++) {
        var e = points[i];
        //遍历将顶点的位置添加进入
        geometry.vertices.push(new THREE.Vector3(e.x, e.z, e.y));
        //设置生成相应的颜色
        colors[i] = new THREE.Color(0xffffff);
        colors[i].setHSL(e.x / 100 + 0.5, (e.y * 20) / 300, 0.8);
      }

      //设置几何图形每个点的颜色
      geometry.colors = colors;

      //定义直线纹理 MeshBasicMaterial  LineBasicMaterial
      var material = new THREE.LineBasicMaterial({       
        opacity: 0.1, //设置透明度
        linecap:'square',
        linejoin:'square',
        linewidth: 100, //设置线的宽度
        vertexColors: THREE.VertexColors //设置这个可以给每个顶点指定一种颜色
      });
      //为了对比 体现作用
      //var material =new THREE.MeshBasicMaterial({color: 'red'});
      //生成网格
      this.line = new THREE.Line(geometry, material);
      //设置位置
      this.line.position.set(0, 0, -60);
      this.scene.add(this.line);
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
    gosper(a, b) {
      /*高斯帕曲线生成函数gosper(密度, 大小)，也被称为flowsnake（一首音误的雪花），
  是一种空间填充曲线。它是一个与龙曲线和希尔伯特曲线相似的分形物体。*/
      var turtle = [0, 0, 0];
      var points = [];
      var count = 0;

      rg(a, b, turtle);

      return points;

      function rt(x) {
        turtle[2] += x;
      }

      function lt(x) {
        turtle[2] -= x;
      }

      function fd(dist) {
        //                ctx.beginPath();
        points.push({ x: turtle[0], y: turtle[1], z: Math.sin(count) * 5 });
        //                ctx.moveTo(turtle[0], turtle[1]);

        var dir = turtle[2] * (Math.PI / 180);
        turtle[0] += Math.cos(dir) * dist;
        turtle[1] += Math.sin(dir) * dist;

        points.push({ x: turtle[0], y: turtle[1], z: Math.sin(count) * 5 });
        //                ctx.lineTo(turtle[0], turtle[1]);
        //                ctx.stroke();
      }

      function rg(st, ln, turtle) {
        st--;
        ln = ln / 2.6457;
        if (st > 0) {
          //                    ctx.strokeStyle = '#111';
          rg(st, ln, turtle);
          rt(60);
          gl(st, ln, turtle);
          rt(120);
          gl(st, ln, turtle);
          lt(60);
          rg(st, ln, turtle);
          lt(120);
          rg(st, ln, turtle);
          rg(st, ln, turtle);
          lt(60);
          gl(st, ln, turtle);
          rt(60);
        }
        if (st == 0) {
          fd(ln);
          rt(60);
          fd(ln);
          rt(120);
          fd(ln);
          lt(60);
          fd(ln);
          lt(120);
          fd(ln);
          fd(ln);
          lt(60);
          fd(ln);
          rt(60);
        }
      }

      function gl(st, ln, turtle) {
        st--;
        ln = ln / 2.6457;
        if (st > 0) {
          //                    ctx.strokeStyle = '#555';
          lt(60);
          rg(st, ln, turtle);
          rt(60);
          gl(st, ln, turtle);
          gl(st, ln, turtle);
          rt(120);
          gl(st, ln, turtle);
          rt(60);
          rg(st, ln, turtle);
          lt(120);
          rg(st, ln, turtle);
          lt(60);
          gl(st, ln, turtle);
        }
        if (st == 0) {
          lt(60);
          fd(ln);
          rt(60);
          fd(ln);
          fd(ln);
          rt(120);
          fd(ln);
          rt(60);
          fd(ln);
          lt(120);
          fd(ln);
          lt(60);
          fd(ln);
        }
      }
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