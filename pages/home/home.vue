<template>
	<view id="app">
		<!-- 轮播图 -->
		<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :duration="500" indicator-active-color="#fff">
			<swiper-item v-for="item in swiper" :key="item.imgUrl">
				<view class="swiper-item"><image :src="item.imgUrl"></image></view>
			</swiper-item>
		</swiper>
		<!-- 功能列表 -->
		<view class="functionList">
			<view class="list-item" @click="goOrder"><image src="../../static/img/functionList/order.png"></image><text>我的订单</text></view>
			<view class="list-item" @click="more"><image src="../../static/img/functionList/question.png"></image><text>我的错题</text></view>
			<view class="list-item" @click="more"><image src="../../static/img/functionList/ranking.png"></image><text>个人排行</text></view>
			<view class="list-item" @click="more"><image src="../../static/img/functionList/more.png"></image><text>更多功能</text></view>
		</view>
		<!-- 刷题分区 -->
		<view class="questionList">
			<view class="base" @click="goIndex"><text>基础练习</text></view>
			<view class="true" @click="more"><text>真题强化</text></view>
		</view>
		<!-- 商品列表 -->
		<goods-list class="goodsList" :goodsList="goodsList"></goods-list>
	</view>
</template>

<script>
	import goodsList from '@/components/goodsList/goods-list.vue';
	export default {
		data() {
			return {
				swiper:[],
				goodsList: []
			};
		},
		components: {
			goodsList
		},
		onShow() {
			wx.cloud.database().collection('swiper').get().then(res=>{
			    this.swiper = res.data
			})
			wx.cloud.database().collection('goods').get().then(res=>{
			    this.goodsList = res.data
			})
		},
		onShareAppMessage() {
		    
		},
		methods: {
			goIndex(){
				uni.navigateTo({
					url: '/pages/index/index'
				});
			},
			goOrder() {
				uni.navigateTo({
					url: '/pages/order/order'
				});
			},
			more() {
				uni.showToast({
					icon:'none',
					title:'敬请期待'
				})
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
		.swiper {
			width: 90%;
			height: 280rpx;
			box-shadow: 0 16rpx 16rpx rgba(10, 16, 20, 0.24), 0 0 16rpx rgba(10, 16, 20, 0.12);
			position: absolute;
			top: 180rpx;
			left: 50%;
			transform: translate(-50%,-50%);
			border-radius: 18rpx;
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
