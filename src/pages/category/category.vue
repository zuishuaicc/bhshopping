<template>
  <div>
    <!-- 搜索框 -->
    <my-search></my-search>
     <view class="scroll-view-container">
      <!-- 左侧的滚动区域 -->
      <scroll-view
        class="left-scroll-view"
        scroll-y
        :style="{ height: wh + 'px' }"
      >
      <!-- 一级标题渲染 -->
        <view class="left-scroll-view-item" 
        :class="{active:selectedCategory===index}"
         v-for="(item,index) in categoryList" :key="index"
         @click="selectedCategoryClickHandle(index)"
         >
         {{item.cat_name}}
         </view>
      </scroll-view>

      <!-- 右侧的滚动区域 -->
      <scroll-view
        class="right-scroll-view"
        scroll-y
        :style="{ height: wh + 'px' }"
        :scroll-top="scrollTop"
      >
     
        <view class="cate-lv2"
        v-for="(item2,index2) in categoryList[selectedCategory].children"
        :key="index2"        
        >
         <!-- 二级标题渲染 -->
          <view class="cate-lv2-title">
            /{{item2.cat_name}}/
          </view>
          <!-- 三级列表渲染 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item3,index3) in item2.children" :key="index3" @click="gotoProductList(item3.cat_id)">
              <image :src="item3.cat_icon"></image>
              <text>{{ item3.cat_name }}</text>
              </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </div>
</template>

<script>
import mySearch from '@/components/my-search.vue'
export default {
    components:{
      mySearch
    },
    data(){
      return {
        categoryList:[],
        wh:0,
        selectedCategory:0,
        scrollTop:0
      }
    },
    created(){
      this.getCategoryList()
      this.wh=uni.getSystemInfoSync().windowHeight-50
    },
    methods:{
      //封装获取分类列表数据方法
      async getCategoryList(){
        const {data:{message,meta}}= await this.$http.get('/categories')
        if(meta.status===200){
          this.categoryList=message
        }
        console.log(this.categoryList);
      },
      //点击一级菜单执行函数
      selectedCategoryClickHandle(index){
        if(this.selectedCategory===index){
          return
        }
        this.selectedCategory=index
        this.scrollTop=this.scrollTop===0?1:0
      },
      //点击三级商品执行函数
      gotoProductList(id){
        uni.navigateTo({
          url:`/pages_sub1/product-list/product-list?cid=${id}`
        })
      }
    }
}
</script>

<style scoped lang="scss">
.scroll-view-container {
  display: flex;

  .left-scroll-view {
    width: 240rpx;

    .left-scroll-view-item {
      line-height: 120rpx;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 24rpx;

      // 激活项的样式
      &.active {
        background-color: #ffffff;
        position: relative;

        // 渲染激活项左侧的红色指示边线
        &::before {
          content: " ";
          display: block;
          width: 6rpx;
          height: 60rpx;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .cate-lv2-title {
  font-size: 24rpx;
  font-weight: bold;
  text-align: center;
  padding: 30rpx 0;
  }
  .cate-lv3-list {
  display: flex;
  flex-wrap: wrap;

  .cate-lv3-item {
    width: 33.33%;
    margin-bottom: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    image {
      width: 120rpx;
      height: 120rpx;
    }

    text {
      font-size: 24rpx;
    }
  }
  }
}
</style>