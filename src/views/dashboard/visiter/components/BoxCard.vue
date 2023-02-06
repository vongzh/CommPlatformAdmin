<template>
  <el-carousel :interval="4000" type="card" height="320px">
    <el-carousel-item v-for="(ad,i) in ads" :key="i">
        <img :src="ads[i].url" class="img">
    </el-carousel-item>
  </el-carousel>
</template>
<script>
export default {
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
      ]
    }
  }
}
</script>
<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .img{
    height: 100%;
    width: 100%;
  }
</style>
