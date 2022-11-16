<template>
	<!-- 我的相关内容 -->
	<view>
	   <!-- 该页面取消默认navbar，使用uview组件 -->
	   <u-navbar
	    bgColor="#2eb976"
	    :autoBack="true"
			leftIconColor="#ffffff"
	   	safeAreaInsetTop
	   	fixed
	   	placeholder
	   ></u-navbar>	
	    <!-- 个人信息 -->
	  <view class="top">
	    <view class="user-info">
	        <!-- 头像 -->
	        <view class="user-photo" @click="getUserProfile">
	          <image v-if="!userInfo" src="@/static/img/me/avatar.jpg"></image>
	          <image v-else :src="userInfo.avatarUrl"></image>
	        </view>
	        <!-- 用户名 -->
	        <view class="user-name">
	            <text v-if="!userInfo">未登录</text>
	            <text v-else>{{userInfo.nickName}}</text>
	        </view>
	    </view>
	    <!-- 内容分类 -->
	    <view class="user-detail">
	        <view class="type">
	            <view class="type-name">收藏题数</view>
	            <view class="type-num">0</view>
	        </view>
	        <view class="type">
	            <view class="type-name">刷题数量</view>
	            <view class="type-num">{{questionCount}}</view>
	        </view>
	    </view>
	  </view>
	  
	  <!-- 底部信息栏 -->
	  <view class="bottom">
	    <view class="bottom-content">
				<view class="me-about" v-if="userInfo" @click="openPopup">
			    <text>个人信息</text>
			    <image src="@/static/img/me/next.png"></image>
				</view>
	      <view class="me-about" @click="openOverlay">
	          <text>邀请好友</text>
	          <image src="@/static/img/me/next.png"></image>
	      </view>
	      <view class="me-about">
	          <button open-type="feedback" class="u-reset-button">问题反馈</button>
	          <image src="@/static/img/me/next.png"></image>
	      </view>
			  <view class="me-about" v-if="isAdmin" @click="goVersionManage">
			    <text>版本管理</text>
			    <image src="@/static/img/me/next.png"></image>
			  </view>
	      <view class="me-about" v-if="isAdmin" @click="goEdit">
	        <text>真题管理</text>
	        <image src="@/static/img/me/next.png"></image>
	      </view>
	      <view v-if="userInfo" class="me-about" @click="logout">
	        <text>退出登录</text>
	        <image src="@/static/img/me/next.png"></image>
	      </view>
	    </view>
	  </view>
	  
	    <!-- 个人信息修改弹出层 -->
		<u-popup :show="isShowPopup" :round="10" mode="bottom" @close="close" :safeAreaInsetTop="true">
	  		<view class="u-popup-slot">
				<view class="popup-container">
					<view class="popup-title">
						<u-icon name="info-circle-fill" color="#2eb976" size="25px"></u-icon>
						<text>完善您的昵称、头像</text>
					</view>
					<view class="popup-avatar">
						<text>头像</text>
						<button class="avatar-wrapper u-reset-button" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
						  <u-avatar :src="avatarUrl"></u-avatar>
						  <u-icon name="arrow-right"></u-icon>
						</button> 
					</view>
					<view class="popup-nickname">
						<text>昵称</text>
						<input type="nickname" class="weui-input" placeholder="请输入昵称" v-model="nickName"/>
					</view>
					<view class="popup-button">
						<u-button color="#CCCCCC" text="取消" @click="close"></u-button>
						<view></view>
						<u-button color="#2eb976" :disabled="isDisabled" text="保存" @click="confirmSubmit"></u-button>
					</view>
				</view>
			</view>
	  </u-popup>
		<!-- 邀请好友海报弹窗 -->
		<u-overlay :show="isShowOverlay" @click="isShowOverlay = false">
				<view class="warp">
					<poster
					  ref="poster"
					  @close-overlay="isShowOverlay = false"
						@tap.stop
					/>
				</view>
		</u-overlay>
	</view>
</template>

<script>
	import poster from '@/components/poster/poster.vue' 
	export default {
		components: {
		  poster
		},
		data() {
			return {
				userInfo: null,
				questionCount: 0,
				avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				nickName: '',
				isAdmin: false,
				isShowPopup: false,
				isShowOverlay: false
			}
		},
		computed: {
			isDisabled(){
				return this.nickName === '' ? true : false	
			}
		},
		methods: {
			// 登录获取用户头像昵称
			getUserProfile(){
			    if(!this.userInfo){
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}else{
					return;
				}
			},
			// 获取用户刷题数量
			getQuestionCount(){
				uniCloud.database().collection('user').where({
					openid: this.userInfo.openid
				}).get().then(res => {
					this.questionCount = res.result.data[0].count
					uni.setStorageSync('questionCount',res.result.data[0].count)
				})
			},
			// 跳转真题后台管理页面
			goEdit() {
				if(this.userInfo){
					uniCloud.database().collection('user').where({
						openid: this.userInfo.openid
					}).get().then(res => {
						if(res.result.data[0].admin){
							uni.navigateTo({
								url: '/pages/question-2013/list'
							});
						}
					})
				}
			},
			// 跳转版本管理页面
			goVersionManage(){
				if(this.userInfo){
					uniCloud.database().collection('user').where({
						openid: this.userInfo.openid
					}).get().then(res => {
						if(res.result.data[0].admin){
							uni.navigateTo({
								url: '/pages/version/version'
							});
						}
					})
				}
			},
			// 打开个人信息弹出层
			openPopup(){
			    this.isShowPopup = true
			},
			// 打开邀请海报弹窗
			openOverlay(){
					this.isShowOverlay = true
					this.$refs.poster.pageInit()
			},
			// 关闭个人信息弹出层
			close() {
			  this.isShowPopup = false
			},
			// 保存提交个人信息
			confirmSubmit(){
				uniCloud.uploadFile({
				  filePath: this.avatarUrl, // 必传，要上传的文件对象临时路径
				  cloudPath: Date.now() + "avatar" + Math.floor(Math.random()*(9999-1000)) + '.jpg', // 必传，保存在云端的文件名，这样写上传后就是原本的名称与后缀名
				  success: res => {
				    let avatarUrl = res.fileID //云端返回的图片地址
				    uniCloud.database().collection('user').where({openid:this.userInfo.openid}).update({
							avatarUrl: avatarUrl,
							nickName: this.nickName
						}).then(res=>{
							this.isShowPopup=false
							uniCloud.database().collection('user').where({openid:this.userInfo.openid}).get().then(res=>{
								 uni.setStorageSync('userInfo',JSON.stringify(res.result.data[0]))
								 this.userInfo = res.result.data[0]
							})
						})
				  },
				  fail(err) {
				    console.log(err)
				  }
				})
			},
			// 自定义选择头像
			onChooseAvatar(e) {
			    const { avatarUrl } = e.detail 
			    this.avatarUrl = avatarUrl
					console.log(avatarUrl);
			},
			// 退出登录
			logout(){
				uni.removeStorageSync("userInfo")
				uni.removeStorageSync("version")
				uni.navigateTo({
					url: '/pages/home/home'
				});
			}
		},
		onShow() {
			if(uni.getStorageSync('userInfo')){
				this.userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				this.getQuestionCount()
				uniCloud.database().collection('user').where({
					openid: this.userInfo.openid
				}).get().then(res => {
					if(res.result.data[0].admin){
						this.isAdmin = true
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
/* 顶部用户样式 */
.top{
  box-shadow: 10rpx 10rpx 15rpx 10rpx #e1e1e1;
  background-color: #2eb976;
  border-radius:0 0 50rpx 50rpx;
}

.user-info{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 200rpx;
}

.user-photo {
  margin: 0 auto;
}

.user-photo image{
  border: 10rpx solid #fff;
  border-radius: 50%;
  background-color: #fff;
  height: 130rpx;
  width: 130rpx;
}

.user-name{
  margin: 0 auto;
}

.user-name text{
  color: #fff;
  font-size: 40rpx;
  font-weight: 800;
}

/* 用户信息栏 */
.user-detail{
  display: flex;
  flex-wrap: wrap;
  margin: auto;
  margin-top: 30rpx;
  padding-top: 10rpx;
  align-items: center;
  justify-content: space-around;
}
.type {
	display: flex;
	padding-bottom: 20rpx;
}
.type-name{
  color: rgb(244, 243, 241);
  text-align: center;
  font-size: 30rpx;
  margin-right: 14rpx;
}

.type-num{
  color: rgb(244, 243, 241);
  text-align: center;
  font-size: 35rpx;
  font-weight: 600;
  position: relative;
  top: -5rpx;
}


/* 下面 */
.bottom{
  margin-top: 50rpx;
  
}
.bottom-content{
  width: 95%; 
  border-radius: 5%;
  margin: auto;
  background-color: rgb(253, 253, 253);
  padding-bottom: 35rpx;
  box-shadow: 5rpx 5rpx 10rpx 5rpx #e1e1e1;
}
.me-about{
  display: flex;
  margin: 20rpx 40rpx;
  padding: 30rpx 0rpx;
  justify-content: space-between;
  border-bottom: 2rpx solid rgb(238, 238, 238);
}
.me-about image{
  align-self: center;
  width: 35rpx;
  height: 35rpx;
}
.me-about text {
	font-size: 34rpx;
}
.me-about button {
	width: 100%;
    font-size: 34rpx;
    font-weight: 400;
    text-align: left;
    background-color: #fff;
}
/* 弹出层插槽样式 */
 .u-popup-slot {
 width: 100%;
 height: 530rpx;
 display: flex;
 justify-content: center;
}
.popup-container {
	display: flex;
	flex-direction: column;
	width: 90%;
	padding: 8rpx 0;
}
.popup-title {
	display: flex;
	align-items: center;
}
.popup-title text {
	margin-left: 8rpx;
}
.popup-avatar {
	display: flex;
	align-items: center;
	border-bottom: 1px solid gainsboro;
	margin-top: 30rpx;
	padding-bottom: 30rpx;
}
.popup-avatar text {
	margin-right: 30rpx;
}
.popup-avatar button {
	display: flex;
	flex: 1;
	justify-content: space-between;
	align-items: center;
}
.popup-nickname {
	display: flex;
	align-items: center;
	border-bottom: 1px solid gainsboro;
	margin-top: 30rpx;
	padding-bottom: 30rpx;
}
.popup-nickname text {
	margin-right: 30rpx;
}
.popup-nickname input {
	font-size: 26rpx;
}
.popup-button {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 60rpx 40rpx;
}
.popup-button view {
	width: 100rpx;
	height: 100%;
}
/* 邀请好友海报弹窗 */
.warp {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}
</style>
