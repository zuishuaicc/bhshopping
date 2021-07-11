<template>
  <view>
    <view class="search-box">
      <!-- 使用 uni-ui 提供的搜索组件 -->
      <uni-search-bar ref="searchbox" cancelButton="none" :radius="100" @input="inputHandler"></uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="sugguestions.length">
      <view
            class="sugg-item"
            v-for="(item, index) in sugguestions"
            :key="index"
            @click="gotoProductDetail(item)"
            >
        <view class="goods-name">{{ item.goods_name }}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clearHistory"></uni-icons>
      </view>
      <!-- 历史列表 -->
      <view class="history-list">
        <uni-tag v-for="(item, index) in historyList" 
        :key="index" 
        :text="item" 
        @click="clickHandleHistory(item)"
        />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
    timerId:null,
    keyword:'',
    sugguestions:[],
    historyList:[]
    }
  },
  created(){
    const history=uni.getStorageSync('keywordHistory')
    if(history){
       this.historyList=JSON.parse(history)
    }
  },
  mounted () {
      //自动获取焦点
      const searchbox=this.$refs.searchbox
      searchbox.show=true
      searchbox.showSync=true
    },
  methods:{
      //监听输入框input事件，输入内容时执行的函数
    inputHandler(e) {
      clearTimeout(this.timerId)
      this.timerId=setTimeout(()=>{
        this.keyword=e.value
        if(this.keyword){
          this.getSugguestions()
        }else{
          this.sugguestions=[]
        }
      },500)
    },
    //封装根据keyword获取搜索建议列表的方法
    async getSugguestions(){
      const {data:{message,meta}}=await this.$http.get('/goods/qsearch',{query:this.keyword})
      if(meta.status!==200){
        this.$err()
        return
      }
      this.sugguestions=message
      this.updateSearchHistory()
    },
    //点击搜索建议执行的函数
    gotoProductDetail(item){
      uni.navigateTo({
        url:`/pages_sub1/product-detail/product-detail?pid=${item.goods_id}`
      })
    },
    //封装处理搜索历史的方法
    updateSearchHistory(){
      this.historyList.unshift(this.keyword)
      this.historyList=Array.from(new Set(this.historyList))
      if(this.historyList.length>10){
        this.historyList.pop()
      }
      uni.setStorageSync('keywordHistory',JSON.stringify(this.historyList))
    },
    //点击删除历史记录图标执行的函数
    clearHistory(){
      this.historyList=[]
      uni.removeStorageSync('keywordHistory')
    },
    //点击历史记录执行函数
    clickHandleHistory(item){
      uni.switchTab(`/pages_sub1/product-list/product-list?query=${item}`)
    }
  }
};
</script>

<style scoped lang="scss">
// 使用样式穿透：覆盖 uni-search-bar 组件的 .uni-searchbar 背景色
::v-deep .uni-searchbar {
  background-color: #c00000 !important;
}
// 搜索建议列表
.sugg-list {
  padding: 0 10rpx;

  .sugg-item {
    font-size: 24rpx;
    padding: 26rpx 0;
    border-bottom: 1rpx solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .goods-name {
      margin-right: 6rpx;
      
      // 溢出部分隐藏
      overflow: hidden;
      
      // 文字不允许换行
      white-space: nowrap;
      
      // 文字溢出后使用省略号表示
      text-overflow: ellipsis;
    }
  }
}
.history-box {
  padding: 0 10rpx;

  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;
    font-size: 26rpx;
    border-bottom: 2rpx solid #efefef;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;

    uni-tag {
      margin-top: 10rpx;
      margin-right: 10rpx;
    }
  }
}
</style>