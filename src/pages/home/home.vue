<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <my-search></my-search>
    </view>
    <!-- 轮播图 -->
    <swiper autoplay indicator-dots interval='1500' circular class="top-swiper" >
      <swiper-item v-for=" (item,index) in swiperList" :key="index">
        <navigator class="swiper-content" :url="`/pages_sub1/product-detail/product-detail?pid=${item.goods_id}`">
        <image :src="item.image_src"/>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item, index) in navList" :key="index" @click="navClickHandle(item)">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>
    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层 item 项 -->
      <view class="floor-item" v-for="(item, index) in floorList" :key="index">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧1个大图片 -->
          <view class="left-img-box" @click="floorClickHandle(item.product_list[0])">
            <image
                  :src="item.product_list[0].image_src"
                  :style="{ width: item.product_list[0].image_width + 'rpx' }"
                  mode="widthFix"
                  ></image>
          </view>

          <!-- 右侧4个小图片 -->
          <view class="right-img-box">
            <block v-for="(product, idx) in item.product_list" :key="idx">
              <view class="right-img-item"  @click="floorClickHandle(product)" v-if="idx !== 0" >
                <image
                      :src="product.image_src"
                      :style="{ width: product.image_width + 'rpx' }"
                      mode="widthFix"
                      ></image>
              </view>
            </block>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mySearch from '../../components/my-search.vue'
export default {
  components:{
    mySearch
  },
  data(){
    return{
      swiperList:[],
      navList:[],
      floorList:[]
    }
  },
  created(){
    this.getSwiperList()
    this.getNavList()
    this.getFloorList()
  },
  methods:{
    //封装获取轮播图数据方法
    async getSwiperList(){
      const {data:{message,meta}}=await this.$http.get('/home/swiperdata')
      if (meta.status!==200){
        this.$err()
        return
      }
      this.swiperList=message
    },
    //封装获取分类导航按钮数据方法
    async getNavList(){
      const {data:{message,meta}}=await this.$http.get('/home/catitems')
      if(meta.status!==200){
        this.$err()
        return
      }
      this.navList=message
    },
    //分类导航点击事件触发函数
    navClickHandle(item){
      if(item.name==='分类'){
        uni.switchTab({
          url:'/pages/category/category'
        })
      }
    },
    //封装获取楼层数据方法
    async getFloorList(){
      const {data:{message,meta}}=await this.$http.get('/home/floordata')
      if(meta.status!==200){
        this.$$err
        return
      }
      this.floorList=message
    },
    //点击楼层图片执行函数
    floorClickHandle(item){
      console.log(item);
      const query=item.navigator_url.split('?')[1]
      console.log(query);
      uni.navigateTo({
        url:`/pages_sub1/product-list/product-list?${query}`
      })
    }
  }

}
</script>

<style lang='scss' scoped>
.top-swiper {
  height: 330rpx;

  .swiper-content,
  image {
    width: 100%;
    height: 100%;
  }
}
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 30rpx 0;

  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}
.floor-title {
  display: flex;
  width: 100%;
  height: 60rpx;
}
.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.floor-img-box {
  display: flex;
  padding-left: 10rpx;
}
</style>