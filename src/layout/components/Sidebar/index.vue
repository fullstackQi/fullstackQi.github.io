<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div style="height:60px;font-color: white;font-size: 20px;text-align: center;color: white;line-height: 60px;">
        YFFT
      </div>
      <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="false"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem'
import { constantRoutes } from '@/router'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  computed: {
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  data() {
    return {
      permission_routes: []
    }
  },
  created() {
    console.log(constantRoutes)
    this.permission_routes = constantRoutes
  },
  methods: {
    variables() {
      return variables
    },
  }
}
</script>
