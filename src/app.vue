<template>
  <div>
    <el-container style="height: auto; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          :default-active="$route.path"
          :default-openeds="['1','2','3']"
          :unique-opened="true"
          :router="true"
        >
          <!-- <el-menu :default-openeds="['1']">-->
          <el-submenu index="1">
            <template slot="title">three.js demo</template>
            <template v-for="(item) in  baseRoutesList">
              <el-menu-item :key="item.path" :index="item.path">{{ item.CNName }}</el-menu-item>
            </template>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">three.js-灯光-demo</template>
            <template v-for="(item) in  lightRoutesList">
              <el-menu-item :key="item.path" :index="item.path">{{ item.CNName }}</el-menu-item>
            </template>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">three.js-材质-demo</template>
            <template v-for="(item) in  materialRoutesList">
              <el-menu-item :key="item.path" :index="item.path">{{ item.CNName }}</el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: left; font-size: 12px">
          <span id="titleText">示例地图</span>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
#map {
  height: 500px;
}
</style>

<script>
export default {
  data() {
    return {
      baseRoutesList: [],
      lightRoutesList: [],//灯光
      materialRoutesList: []//材质
    };
  },
  created() {
    let lstRoutes = this.$router.options.routes;
    for (let i = 0; i < lstRoutes.length; i++) {
      if (i < 12) {
        this.baseRoutesList.push(lstRoutes[i]);
      } else if (i>=12 && i<=19){
        this.lightRoutesList.push(lstRoutes[i]);
      }else{
        console.log('序号:'+i);
         this.materialRoutesList.push(lstRoutes[i]);
      }
    }
    // this.baseRoutesList=routerList;
  }
};
</script>