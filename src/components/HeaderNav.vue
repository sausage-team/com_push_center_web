
<template>
  <div class="header-main">
    <div class="logo-main">
      <div ref="logo" class="logo-i"></div>
      <div class="logo-text">
        <span>智能推送中心</span>
        <span>Intelligent Push Center</span>
      </div>
    </div>
    <div class="header-menu-btn">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          推送中心<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in menuList" @click.native="chooseModal($event, item)" :key="index">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="header-con">
      <el-menu mode="horizontal" :default-active="chooseType">
        <el-menu-item index="home" @click.native="chooseMenu($event, 'home')">
          <span>首页</span>
          <i></i>
        </el-menu-item>
        <el-menu-item v-for="item in permissionList" :key="item"
          :index="CONSTANT.menuType[item].target"
          @click.native="chooseMenu($event, CONSTANT.menuType[item].target)">
          <span>{{ CONSTANT.menuType[item].name }}</span>
          <i></i>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="header-right">
      <el-dropdown trigger="click" style="margin-left: 20px" :disabled="shouldShowDicMenu" >
        <a href="javascript:void(0)" @click='toogleShow' >
          <div class="user-con">
            <div class="user-icon">
              <img :src="default_icon" alt="">
            </div>
            <span>{{username}}</span>
          </div>
        </a>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item  @click.native="chooseMenu($event, 'system', 'none')">反馈字典</el-dropdown-item>
          <el-dropdown-item  @click.native="chooseMenu($event, 'root', 'none')">用户管理</el-dropdown-item>
          <el-dropdown-item  @click.native="chooseMenu($event, 'role', 'none')">角色管理</el-dropdown-item>
          <el-dropdown-item  @click.native="chooseMenu($event, 'rt', 'none')">权限字典</el-dropdown-item>
          <el-dropdown-item  @click.native="chooseMenu($event, 'tm/lm', 'none')">页面设置</el-dropdown-item>
          <el-dropdown-item  @click.native="chooseMenu($event, 'authority', 'none')">系统授权</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="setting">
        <i @click="goOut($event)"></i>
      </div>
    </div>
  </div>
</template>
<script>
import userIcon from '../assets/imgs/user-icon.png'
export default {
  name: 'headerNav',
  data () {
    return {
      default_icon: userIcon,
      chooseType: '',
      username: '',
      userData: {},
      menuList: [],
      shouldShowDicMenu: false,
      permissionList: []
    }
  },
  mounted () {
    const params = {
      sys_type: this.CONSTANT.SYS_TYPE
    }
    this.tmService.currentLogoTitle(params).then(res => {
      if (res.status === 0) {
        if (res.data.logo) {
          window.$(this.$refs.logo).css('backgroundImage', `url(${res.data.logo})`)
        }
        if (res.data.title) {
          window.document.title = res.data.title
        }
      }
    })
  },
  created () {
    if (this.$cookies.get('pc_token')) {
      this.loginService.getMenuList().then(res => {
        if (res.status === 0) {
          this.menuList = res.data
        }
      })
      this.userData = this.$cookies.get('pc_data')
      this.username = (localStorage.getItem('login_user_data') && JSON.parse(localStorage.getItem('login_user_data')).name) || ((this.userData && this.userData.name) || '未知')

      this.permissionList = this.userData.permission_list
      if (this.$route.name === 'adm') {
        this.chooseType = 'dm'
      } else {
        this.chooseType = this.$route.name
      }
    }
  },
  methods: {
    toogleShow () {
      this.shouldShowDicMenu = this.userData.role === 1 ? !this.shouldShowDicMenu : false
    },
    chooseMenu (e, type) {
      this.shouldShowDicMenu = false
      if (this.chooseType !== type) {
        this.$router.push(`/${type}`)
      }
    },
    chooseModal (e, item) {
      e.stopPropagation()
      this.loginService.getMenuUrl({
        product_name: item.pro_name
      }).then(res => {
        if (res.status === 0) {
          if (res.data) {
            window.location.href = res.data
          }
        }
      })
    },
    goOut (e) {
      this.$message.success('登出成功')
      this.$store.commit('logOut')
      localStorage.clear()
      this.loginService.logout()
      this.$store.commit('backLogin')
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.name === 'adm') {
        this.chooseType = 'dm'
      } else {
        this.chooseType = this.$route.name
      }
    }
  }
}
</script>
