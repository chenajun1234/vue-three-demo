<template>
    <div>
        <div id="map"></div>      
    </div>
</template>

<script>
  import * as THREE from 'three';
  export default {
    name:'FirstDemo',
    data(){
      return {
        map: '',
      }
    },
    mounted(){
      let width = document.getElementById('map').clientWidth;
      let height = document.getElementById('map').clientHeight;
      var scene = new THREE.Scene();
       // ( fov, aspect, near, far )
        // 这里使用最常见的远景相机（PerspectiveCamera），也就是类似于人眼观察的方式。
        // fov,第一个属性75设置的是视角（field of view）。类似眼睛睁多大
        // aspect,第二个属性设置的是相机拍摄面的长宽比（aspect ratio）。我们几乎总是会使用元素的宽除以高，否则会出现挤压变形。
        // near,接下来的2个属性是近裁剪面（near clipping plane）
        // far,远裁剪面（far clipping plane）
      var camera = new THREE.PerspectiveCamera( 45, width / height, 1,100 );
      
      var canvas = document.createElement( 'canvas' );
      var context = canvas.getContext( 'webgl2' );
      var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
			//var renderer = new THREE.WebGLRenderer();
			renderer.setSize( width, height );
			document.getElementById('map').appendChild( renderer.domElement );

			var geometry = new THREE.BoxGeometry( 1, 2, 5 );
			var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			var cube = new THREE.Mesh( geometry, material );
			scene.add( cube );

			camera.position.z = 10;// 相机位置

			var animate = function () {
				requestAnimationFrame( animate );

				cube.rotation.x += 0.01;
        //cube.rotation.y += 0.01;
        //cube.rotation.z += 0.01;

				renderer.render( scene, camera );
			};

			animate();
    }
  }
</script>
<style>
  #map{
    border: none;
    cursor: pointer;
    width: 100%;
    height: 600px;
    background-color: #EEEEEE;
  }
</style>

