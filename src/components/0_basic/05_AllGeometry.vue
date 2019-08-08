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
    this.initLight();
    //模型
    this.initModel();
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
      this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
      //设置相机的位置
      this.camera.position.y = 400;
      //
      //this.camera.lookAt(0, 0, 0);
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

      // 设置颜色及其透明度
      this.renderer.setClearColor(0x000000, 1.0);

      //设置设备像素比
      this.renderer.setPixelRatio(window.devicePixelRatio);

      //将渲染器放置到指定dom当中
      mapEle.appendChild(this.renderer.domElement);
    },
    initLight() {
      //添加环境光
      this.scene.add(new THREE.AmbientLight(0x404040));
      //创建一个平行光光源照射到物体上
      /**
       * DirectionalLight( color : Integer, intensity : Float )
          color - (可选参数) 16进制表示光的颜色。 缺省值为 0xffffff (白色)。
          intensity - (可选参数) 光照的强度。缺省值为1。

       */
      let light = new THREE.DirectionalLight(0xffffff, 1.5);
      //设置平型光照射方向，照射方向为设置的点照射到原点
      //position : Vector3 假如这个值设置等于 Object3D.DefaultUp (0, 1, 0),那么光线将会从上往下照射。
      light.position.set(0, 1, 0);
      this.scene.add(light);
    },
    initModel() {
      //通过加载图片生成一个纹理 UV_Grid_Sm

      var map = THREE.ImageUtils.loadTexture(
        "/src/static/textures/UV_Grid_Sm.jpg"
      );

      // var map = new THREE.TextureLoader().load("/src/static/textures/万花.jpg");
      //定义纹理在水平和垂直方向简单的重复到无穷大。
      //wrapS这个值定义了纹理贴图在水平方向上将如何包裹
      //wrapT 这个值定义了纹理贴图在垂直方向上将如何包裹，
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      //console.log('RepeatWrapping'+THREE.RepeatWrapping)
      //定义纹理的各向异性
      /*沿着轴，通过具有最高纹素密度的像素的样本数。 默认情况下，这个值为1。
            设置一个较高的值将会产生比基本的mipmap更清晰的效果，代价是需要使用更多纹理样本*/
      map.anisotropy = 16;

      //定义兰伯特网孔材质
      /*该材质使用基于非物理的Lambertian模型来计算反射率。 
            这可以很好地模拟一些表面（例如未经处理的木材或石材），但不能模拟具有镜面高光的光泽表面（例如涂漆木材）。
            side:定义将要渲染哪一面 - 正面，背面或两者。 默认为THREE.FrontSide。*/
      var material = new THREE.MeshLambertMaterial({
        map: map,
        side: THREE.DoubleSide
      });
      //var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );

      /*球形网格 
            （radius:半径长度，
            widthSegments:水平块的密度(水平分段数.最小值为3，默认值为8)，
            heightSegments:垂直块的密度(垂直分段数.最小值为2，默认值为6)）*/
      let object = new THREE.Mesh(
        new THREE.SphereGeometry(75, 20, 10),
        material
      );
      object.position.set(-400, 0, 200);
      this.scene.add(object);

      //二十面体 （图形大小半径，大于零将不是二十面体，越大越圆滑）
      /**
             radius — 二十面体的半径，默认为1。 
             detail — 默认值为0。将这个值设为一个大于0的数将会为它增加一些顶点，使其不再是一个二十面体。当这个值大于1的时候，实际上它将变成一个球体。
             下面 八面 四面同理
             */
      object = new THREE.Mesh(new THREE.IcosahedronGeometry(75, 0), material);
      object.position.set(-200, 0, 200);
      this.scene.add(object);

      //八面体（图形大小半径，大于零将不是八面体，越大越圆滑）
      object = new THREE.Mesh(new THREE.OctahedronGeometry(75, 0), material);
      object.position.set(0, 0, 200);
      this.scene.add(object);

      //四面体（图形大小半径，大于零将不是四面体，越大越圆滑）

      object = new THREE.Mesh(new THREE.TetrahedronGeometry(75, 0), material);
      object.position.set(200, 0, 200);
      this.scene.add(object);

      //长方形平面(平面几何体)
      /*width — 平面沿着X轴的宽度。默认值是1。
            height — 平面沿着Y轴的高度。默认值是1。
            widthSegments — （可选）平面的宽度分段数，默认值是1。
            heightSegments — （可选）平面的高度分段数，默认值是1。 */
      object = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 1, 1),
        material
      );
      object.position.set(-400, 0, 0);
      this.scene.add(object);

      //立方体 （x轴宽度，y轴高度，z轴深度，沿宽面分段数，沿高度面分段数，沿深度面分段数）
      object = new THREE.Mesh(
        new THREE.BoxGeometry(100, 100, 100, 1, 1, 1),
        material
      );
      object.position.set(-200, 0, 0);
      this.scene.add(object);

      //圆形平面 （半径，顶点密度，绘制起点弧度，绘制弧度）
      /*radius — 圆形的半径，默认值为1
            segments — 分段（三角面）的数量，最小值为3，默认值为8。
            thetaStart — 第一个分段的起始角度，默认为0。（three o'clock position）
            thetaLength — 圆形扇区的中心角，通常被称为“θ”（西塔）。默认值是2*Pi，这使其成为一个完整的圆。 */
      object = new THREE.Mesh(
        new THREE.CircleGeometry(50, 20, 0, Math.PI * 2),
        material
      );
      object.position.set(0, 0, 0);
      this.scene.add(object);

      //空心圆平面 （内圆半径，外圆半径，分割面越大越圆滑，垂直外边分割面，开始绘制弧度，绘制弧度）
      /**innerRadius — 内部半径，默认值为0.5。 
            outerRadius — 外部半径，默认值为1。
            thetaSegments — 圆环的分段数。这个值越大，圆环就越圆。最小值为3，默认值为8。
            phiSegments — 最小值为1，默认值为8。
            thetaStart — 起始角度，默认值为0。
            thetaLength — 圆心角，默认值为Math.PI * 2。 */

      object = new THREE.Mesh(
        new THREE.RingGeometry(10, 50, 10, 5, 0, Math.PI * 2),
        material
      );
      object.position.set(200, 0, 0);
      this.scene.add(object);

      //圆柱体 （头部圆的半径，底部圆半径，高度，上下圆顶点个数，上下面切割线条数，上下面是否显示，开始弧度，绘制弧度）
      /**radiusTop — 圆柱的顶部半径，默认值是1。
            radiusBottom — 圆柱的底部半径，默认值是1。
            height — 圆柱的高度，默认值是1。
            radialSegments — 圆柱侧面周围的分段数，默认为8。
            heightSegments — 圆柱侧面沿着其高度的分段数，默认值为1。
            openEnded — 一个Boolean值，指明该圆锥的底面是开放的还是封顶的。默认值为false，即其底面默认是封顶的。
            thetaStart — 第一个分段的起始角度，默认为0。（three o'clock position）
            thetaLength — 圆柱底面圆扇区的中心角，通常被称为“θ”（西塔）。默认值是2*Pi，这使其成为一个完整的圆柱。 */
      object = new THREE.Mesh(
        new THREE.CylinderGeometry(25, 75, 100, 40, 5),
        material
      );
      object.position.set(400, 0, 0);
      this.scene.add(object);

      //车床模型
      var points = [];

      for (var i = 0; i < 50; i++) {
        points.push(
          new THREE.Vector2(
            Math.sin(i * 0.2) * Math.sin(i * 0.1) * 15 + 50,
            (i - 5) * 2
          )
        );
      }

      //（一个vector2的数组分别代表xy轴，生成圆周段的数目，开始弧度，绘制弧度）
      /**points — 一个Vector2对象数组。每个点的X坐标必须大于0。
            segments — 要生成的车削几何体圆周分段的数量，默认值是12。
            phiStart — 以弧度表示的起始角度，默认值为0。
            phiLength — 车削部分的弧度（0-2PI）范围，2PI将是一个完全闭合的、完整的车削几何体，小于2PI是部分车削。默认值是2PI。 */
      object = new THREE.Mesh(new THREE.LatheGeometry(points, 20), material);
      object.position.set(-400, 0, -200);
      this.scene.add(object);

      //救生圈 (圆环几何体)（救生圈半径，管道直径，基于管道横切顶点数，救生圈横切顶点个数）
      /**radius - 圆环的半径，从圆环的中心到管道（横截面）的中心。默认值是1。
              tube — 管道的半径，默认值为0.4。
              radialSegments — 圆环的分段数，默认值为8。
              tubularSegments — 管道的分段数，默认值为6。
              arc — 圆环的中心角（单位是弧度），默认值为Math.PI * 2。 */
      object = new THREE.Mesh(
        new THREE.TorusGeometry(50, 20, 20, 20),
        material
      );
      object.position.set(-200, 0, -200);
      this.scene.add(object);

      //环面扭结模型 （图形半径，管道直径，基于管道横切定点数，根据图形半径横切顶点数，绕旋转对称轴的圈数，绕环面的圆的圈数）
      object = new THREE.Mesh(
        new THREE.TorusKnotGeometry(50, 10, 50, 20),
        material
      );
      object.position.set(0, 0, -200);
      this.scene.add(object);

      //轴辅助 （每一个轴的长度）
      object = new THREE.AxesHelper(50);
      object.position.set(200, 0, -200);
      this.scene.add(object);

      //箭头辅助（箭头头的方向必须是vecteor3，箭头起点必须是vector3，箭头长度，颜色）
      object = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        50,
        0x00ffff
      );
      object.position.set(400, 0, -200);
      this.scene.add(object);
    },
    render() {
      //渲染图形

      var timer = Date.now() * 0.0001;

      this.camera.position.x = Math.cos(timer) * 800;
      this.camera.position.z = Math.sin(timer) * 800;

      this.camera.lookAt(this.scene.position);

      for (var i = 0, l = this.scene.children.length; i < l; i++) {
        var object = this.scene.children[i];

        object.rotation.x = timer * 5;
        object.rotation.y = timer * 2.5;
      }

      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      requestAnimationFrame(this.animate);

      this.render();
      //stats.update();
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

