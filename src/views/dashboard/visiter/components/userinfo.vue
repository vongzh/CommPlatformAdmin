<template>
  <!-- <el-card class="box-card-component"> -->
  <div class="warp">
    <el-carousel :interval="3000" type="card">
      <el-carousel-item v-for="(ad,i) in ads" :key="i">
        <img :src="ads[i].url" class="img">
      </el-carousel-item>
    </el-carousel>
  </div>
  <!-- <div style="position:relative;">
      <pan-thumb :image="avatar" :z-index="10" class="panThumb">
        <strong>❤️</strong>
      </pan-thumb>
      <mallki class-name="mallki-text" :text="name" />
      <div style="padding-top:50px;" class="progress-item">
        <span>
          <el-link :underline="false">注册</el-link>
        </span>
        <el-progress :percentage="registerTask" :status="registerTask|statusFilter" />
      </div>
      <div class="progress-item">
        <span>
          <el-link @click="goProfile()">完善客户信息</el-link>
        </span>
        <el-progress :percentage="profileTask" :status="profileTask|statusFilter" />
      </div>
    </div>
  </el-card>-->
</template>

<script>
import {
  mapGetters
} from 'vuex'
// import PanThumb from '@/components/PanThumb'
// import Mallki from '@/components/TextHoverEffect/Mallki'
import {
  GetCustomer
} from '@/api/customer/customer'
export default {
  components: {
    // PanThumb,
    // Mallki
  },
  // filters: {
  //   statusFilter: (val) => {
  //     if (val === 0) { return 'warning' }
  //     if (val === 100) { return 'success' }
  //   }
  // },
  data() {
    return {
      ads: [{ url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1770688318,2869145722&fm=26&gp=0.jpg' },
        {
          url: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1573349281,4085021678&fm=26&gp=0.jpg'
        },
        {
          url: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1538884486,565225479&fm=26&gp=0.jpg'
        },
        {
          url: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1573349281,4085021678&fm=26&gp=0.jpg'
        }
      ],
      customer: {},
      AuditStatusEnum: {
        WAIT: 0,
        PASS: 10,
        REJTCT: -5
      },
      registerTask: 100,
      profileTask: 0
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.fetchCustomer()
  },
  methods: {
    fetchCustomer() {
      GetCustomer().then(res => {
        if (res.data.item1) {
          this.customer = res.data.item2
          switch (this.customer.auditStatus) {
            case this.AuditStatusEnum.WAIT:
              this.profileTask = 50
              break
            case this.AuditStatusEnum.REJECT:
              this.profileTask = 0
              break
          }
        } else {
          this.$confirm('是否去完善账户信息?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.goProfile()
          }).catch(() => {

          })
        }
      })
    },
    goProfile() {
      this.$router.push({
        path: '/customerinfo'
      })
    }
  }
}
</script>

<style lang="scss">
  .box-card-component {
    .el-card__header {
      padding: 0px !important;
    }
  }
</style>
<style lang="scss" scoped>
  .box-card-component {
    .box-card-header {
      position: relative;
      height: 220px;
    }

    .el-carousel {
      height: 220px;
      overflow-y: hidden;
    }

    .el-carousel__container {
      height: 220px;
    }

    .el-carousel__item {
        height: 220px;
    }

    .img {
        width: 100%;
        height: 100%;
        transition: all 0.2s linear;

        &:hover {
          transform: scale(1.1, 1.1);
          filter: contrast(130%);
        }
      }

    .mallki-text {
      position: absolute;
      top: 0px;
      right: 0px;
      font-size: 20px;
      font-weight: bold;
    }

    .panThumb {
      height: 70px !important;
      width: 70px !important;
      position: absolute !important;
      top: -45px;
      left: 0px;
      border: 5px solid #ffffff;
      background-color: #fff;
      margin: auto;
      box-shadow: none !important;

      ::v-deep  .pan-info {
        box-shadow: none !important;
      }
    }

    .progress-item {
      margin-bottom: 10px;
      font-size: 14px;
    }

    @media only screen and (max-width: 1510px) {
      .mallki-text {
        display: none;
      }
    }
  }

  .wrap {
    height: 40%;
    width: 100%;
    background: red;
  }
</style>
