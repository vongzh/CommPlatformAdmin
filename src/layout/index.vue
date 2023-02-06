<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
        <notice />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
        <TelService />
      </right-panel>
    </div>
  </div>
</template>

<script>
import {
  AppMain,
  Navbar,
  Settings,
  Sidebar,
  TagsView,
  Notice
} from './components'

import RightPanel from '@/components/RightPanel'
import TelService from '@/components/TelService'
import ResizeMixin from './mixin/ResizeHandler'
import {
  mapState,
  mapGetters
} from 'vuex'
import signalR from '@/signalr/SignalR'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    TelService,
    Settings,
    Sidebar,
    TagsView,
    Notice
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    ...mapGetters([
      'sysUser',
      'session'
    ]),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    this.connectionServer()

    if (this.sysUser.isDefaultPwd === true) {
      this.$confirm('当前密码已经重置，是否修改密码', '密码已重置', {
        confirmButtonText: '去修改',
        cancelButtonText: '暂不修改',
        type: 'info',
        callback: action => {
          if (action === 'confirm') {
            this.torestpwd()
          }
        }
      })
    }
  },
  beforeDestroy() {
    // signalR.unRegistHandler('notify')
    signalR.close()
  },
  methods: {
    connectionServer() {
      const qs = {
        uid: this.sysUser.userId,
        sid: encodeURIComponent(this.session.sessionId)
      }
      signalR.open(process.env.VUE_APP_BASE_API, qs).then(() => {
        signalR.registHandler('notify', msg => {
          var mes = JSON.parse(msg)
          var param = {
            title: mes.title,
            message: mes.body,
            type: mes.type ? mes.type : 'info',
            duration: mes.duration ? mes.duration : 0
          }
          if (mes.redirect) {
            param.onClick = () => {
              const path = '/'
              switch (mes.redirect) {
                case 'order':
                  break
                default:

                  break
              }

              this.$router.push({
                path: path,
                query: mes.qs
              })
            }
          }
          
         // console.log(mes.popupWinType)
          if(mes.popupWinType=="msgbox"){
            this.$alert(mes.body, mes.title, {
              confirmButtonText: '确定'
            });
          }else
          {
            this.$notify(param)
          }
        })
      })
    },
    torestpwd() {
      this.$router.push({
        path: '/user/profile'
      })
    },

    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', {
        withoutAnimation: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/mixin.scss';
  @import '~@/styles/variables.scss';

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    top: 0;
    right: 0;
    z-index: 9;
    position: fixed;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px);
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
