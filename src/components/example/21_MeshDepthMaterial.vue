<template>
  <div>
    <div id="map"></div>
  </div>
</template>
<script>
/*页面:MeshDepthMaterial 网格深度材质
    这个材质使用从摄像机到网格的距离来决定如何给网格上色
    其外观不是由光照或某个材质属性决定的，而是由物体到摄像机的距离决定的。可以将这种材质与其他材质结合使用，
    从而很容易地创建出逐渐消失的效果。摄像机的near属性和far属性之间的距离决定了场景的亮度和物体消失的速度。
    如果这个距离非常大，那么当物体远离摄像机时，只会稍微消失一点。如果这个距离非常小，那么物体消失的效果会非常明显。

    <span>
    发现80+的版本不支持这个，全部都是这个颜色，换了一个60的版本的three.js文件，没问题
     高版本解决方法 this.camera.near+=1; this.camera.updateProjectionMatrix();
    
    <span>
   */

import * as THREE from "three";
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
      this.camera.position.set(0, 40, 100);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0)); //指的是相机观察的目标点
      this.camera.updateProjectionMatrix();
    },
    initRender() {
      let mapEle = document.getElementById("map");
      let width = mapEle.clientWidth;
      let height = mapEle.clientHeight;
      this.renderer = new THREE.WebGLRenderer({
        antialias: true, //antialias（是否启用抗锯齿）
        // alpha:true//canvas是否包含alpha (透明度)。默认为 false
          logarithmicDepthBuffer: true 
      });
      //设置渲染器的尺寸
      this.renderer.setSize(width, height);
      //告诉渲染器需要阴影效果
     // this.renderer.shadowMap.enabled = true;
     // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
      this.renderer.setClearColor(0x000000);
      //将渲染器放置到指定dom当中
      mapEle.appendChild(this.renderer.domElement);
    },
    initLight() {
      
    },
    initGui() {      
          //声明一个保存需求修改的相关数据的对象
        var param = {

        };

        var gui = new dat.GUI();
    },
    initModel() {
       //辅助工具
        var helper = new THREE.AxisHelper(10);
        this.scene.add(helper);
        var s = 25;
        //立方体
        var cube = new THREE.CubeGeometry(s, s, s);
        var material = new THREE.MeshDepthMaterial();     
        for (var i = 0; i < 1000; i++) {
            var mesh = new THREE.Mesh(cube, material);

            mesh.position.x = 800 * ( 2.0 * Math.random() - 1.0 );
            mesh.position.y = 800 * ( 2.0 * Math.random() - 1.0 );
            mesh.position.z = 800 * ( 2.0 * Math.random() - 1.0 );

            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;

            mesh.updateMatrix();

            this.scene.add(mesh);

        }
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
      //渲染图形

      this.renderer.render(this.scene, this.camera);
    },
    animate() {     
     //this.controls.update();
      this.render();
      this.stats.update(); 
     if(this.camera.near=0.1){
        this.camera.near+=100;
        this.camera.updateProjectionMatrix();
      }      
      
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

</style>