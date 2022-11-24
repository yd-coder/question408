<template>
	<view id="app">
		<!-- 版本更新内容推送 -->
		<u-alert v-if="isShowAlert"  type = "primary" effect="dark" :show-icon="true" :closable="true" :description = "description"></u-alert>
		<!-- 轮播图 -->
		<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :duration="500" indicator-active-color="#fff">
			<swiper-item v-for="item in swiper" :key="item.imgUrl">
				<view class="swiper-item"><image :src="item.imgUrl"></image></view>
			</swiper-item>
		</swiper>
		<!-- 功能列表 -->
		<view class="functionList">
			<view class="list-item" @click="goOrder"><image src="../../static/img/functionList/order.png"></image><text>我的订单</text></view>
			<view class="list-item" @click="goCollect"><image src="../../static/img/functionList/question.png"></image><text>我的收藏</text></view>
			<view class="list-item" @click="goRank"><image src="../../static/img/functionList/ranking.png"></image><text>个人排行</text></view>
			<view class="list-item" @click="goProfile"><image src="../../static/img/functionList/more.png"></image><text>更多功能</text></view>
		</view>
		<!-- 刷题分区 -->
		<view class="questionList">
			<view class="base" @click="goBase"><text>基础练习</text></view>
			<view class="true" @click="goIndex"><text>真题强化</text></view>
		</view>
		<!-- 商品列表 -->
		<goods-list v-if="isShow" class="goodsList" :goodsList="goodsList" ></goods-list>
	</view>
</template>

<script>
	import goodsList from '@/components/goodsList/goods-list.vue';
	export default {
		data() {
			return {
				swiper:[],
				goodsList: [],
				isShow: false,
				isShowAlert: false,
				description:'',
				version: 1.0
			};
		},
		components: {
			goodsList
		},
		onShow() {
			uniCloud.database().collection('version').get().then(res=>{
				this.version = res.result.data[0].version
				this.description = res.result.data[0].content
				if(!uni.getStorageSync('version')){
					uni.setStorageSync('version',this.version)
					this.isShowAlert = true
				}else{
					if(uni.getStorageSync('version') < this.version){
						this.isShowAlert = true
						uni.setStorageSync('version',this.version)
					}
				}
			})
			uniCloud.database().collection('swiper').get().then(res=>{
			    this.swiper = res.result.data
			})
			uniCloud.database().collection('goods').get().then(res=>{
			    this.goodsList = res.result.data
			})
			// 判断设备，IOS限制虚拟支付
			uni.getSystemInfo({
				success: res => {
					if(res.model.search('iPhone') === -1){
						this.isShow = true
					}
				}
			});
		},
		onShareAppMessage() {
		    
		},
		methods: {
			goProfile(){
				uni.navigateTo({
					url: '/pages/me/me'
				});
			},
			goBase() {
				if(uni.getStorageSync('userInfo')){
					uni.navigateTo({
						url: '/pages/base/base'
					});
				}else{
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			},
			goIndex() {
				if(uni.getStorageSync('userInfo')){
					uni.navigateTo({
						url: '/pages/index/index'
					});
				}else{
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			},
			goOrder() {
				if(uni.getStorageSync('userInfo')){
					uni.navigateTo({
						url: '/pages/order/order'
					});
				}else{
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			},
			goCollect() {
				if(uni.getStorageSync('userInfo')){
					uni.navigateTo({
						url: '/pages/collect/collect'
					});
				}else{
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			},
			goRank() {
				if(uni.getStorageSync('userInfo')){
					uni.navigateTo({
						url: '/pages/rank/rank'
					});
				}else{
					uni.navigateTo({
						url: '/pages/login/login'
					});
				}
			},
			__e(){
				this.isShowAlert = false
			}
		}
	}
</script>

<style lang="scss">
	#app::after {
		content: '';
		width: 130%;
		height: 230rpx;
		position: absolute;
		left: -15%;
		top: 0;
		z-index: -1;
		border-radius: 0 0 50% 50%;
		background: #2eb976;
	}
	#app {
		.u-alert {
			z-index: 999;
		}
		.swiper {
			width: 90%;
			height: 280rpx;
			box-shadow: 0 16rpx 16rpx rgba(10, 16, 20, 0.24), 0 0 16rpx rgba(10, 16, 20, 0.12);
			position: absolute;
			top: 180rpx;
			left: 50%;
			transform: translate(-50%,-50%);
			border-radius: 18rpx;
			z-index: 0;
			swiper-item {
				border-radius: 18rpx;
				.swiper-item {
					width: 100%;
					height: 100%;
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.functionList {
			display: flex;
			position: absolute;
			top: 380rpx;
			width: 100%;
			height: 150rpx;
			.list-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				image {
					width: 80rpx;
					height: 80rpx;
				}
				text {
					color: #999999;
					font-size: 25rpx;
					font-weight: lighter;
					line-height: 70rpx;
				}
			}
		}
		.questionList {
			display: flex;
			justify-content: space-between;
			position: absolute;
			top: 660rpx;
			left: 50%;
			transform: translate(-50%,-50%);
			width: 90%;
			height: 220rpx;
			.base {
				width: 48%;
				border-radius: 12rpx;
				color: #fff;
				font-size: 36rpx;
				font-weight: 700;
				background: #2eb976 url('@/static/img/questionList/question1.png') no-repeat;
				background-size:100% 100%;
				text {
					position: absolute;
					top: 18%;
					left: 30rpx;
				}
			}
			.true {
				width: 48%;
				border-radius: 12rpx;
				color: #fff;
				font-size: 36rpx;
				font-weight: 700;
				background: #9966CC url('@/static/img/questionList/question2.png') no-repeat;
				background-size:100% 100%;
				text {
					position: absolute;
					top: 18%;
					right: 140rpx;
				}
			}
		}
		.goodsList {
			position: absolute;
			top: 800rpx;
			width: 100%;
		}
	}
</style>
