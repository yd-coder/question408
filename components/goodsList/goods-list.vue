<template>
	<view class="goods-main">
		<!-- 头部开始 -->
		<view class="goods-header-wrap">
			<view class="goods-header-item" :class="{'goods-header-item-action' : 1 == goodsNav}">商品列表</view>
		</view>
		<!-- 头部结束 -->

		<!-- 商品列表开始 -->
		<view v-for="(item, index) in goodsList" :key="index" class="goods-item-wrap" >
			<image :src="item.image" class="goods-image" />

			<view class="goods-content-wrap">
				<view class="goods-name">{{ item.name }}</view>
				
				<view class="goods-stock-wrap">
					<view class="goods-price">￥{{ item.price }}</view>
					<!-- <view class="goods-stock">库存 {{ item.stock }}</view> -->
					<view class="goods-sell-count">销量 {{ item.count }}</view>
					<button size="mini" type="primary" @click="creatOrder(item)">购买</button>
				</view>
				
			</view>
		</view>
		<!-- 商品列表结束 -->

		<!-- 空白页开始 -->
		<view class="goods-empty-wrap" v-if="goodsList.length <= 0">
			暂无商品
		</view>
		<!-- 空白页结束 -->
	</view>
</template>

<script>
	import {formatDate} from './utils.js'
	export default {
		data() {
			return {
				// goodsList: [{
				// 		id: 1,
				// 		status: 1,
				// 		stock: 999,
				// 		count: 1,
				// 		image: "https://minigroup-v6.oss-cn-beijing.aliyuncs.com/uploads/image/2022-03/e8f761987bebf25f31114c784d15703e.png",
				// 		name: "【小编严选】小程序sketch ui 电商设计稿",
				// 		price: 9.99
				// 	},
				// 	{
				// 		id: 2,
				// 		status: 1,
				// 		stock: 999,
				// 		count: 1,
				// 		image: "https://minigroup-v6.oss-cn-beijing.aliyuncs.com/uploads/image/2022-03/3fa790e17aa5b21fec4c2cf490503139.png",
				// 		name: "【小编严选】Sketch + PS WEB后台管理源文件",
				// 		price: 9.99
				// 	}
				// ],
				goodsNav: 1
			}
		},
		props: {
			goodsList: {
			    type: Array,
			    default () {
			      return []
			    }
			}
		},
		methods: {
			// 创建订单
			creatOrder(item) {
				// 将时间戳转化成date对象
				const date = new Date(+new Date);
				wx.cloud.database().collection('order').add({
					data: {
						creatTime: formatDate(date,'yyyy-MM-dd hh:mm:ss'), // 将date进行格式化
						time: wx.cloud.database().serverDate(),
						name: item.name,
						image: item.image,
						totalFee: item.price,
						status: 0	//0未支付1已支付
					}
				}).then(res=>{
				    uni.showToast({
				    	icon:'success',
				    	title:'订单创建成功'
				    })
					this.goPay(item,res._id)
				})
			},
			// 发起支付
			goPay(item,id) {
				wx.cloud.callFunction({
				  name: 'pay',
				  data: {
					outTradeNo: id,
					goodName:item.name,
				    totalFee:item.price,
				  },
				  success: res => {
				    const payment = res.result.payment
				    wx.requestPayment({
				      ...payment,
				      success (res) {
						wx.cloud.callFunction({
							name: 'goodCount',
							data: {
								goodName:item.name,
								count:item.count
							}
						})
				        console.log('pay success', res)
				      },
				      fail (err) {
				        console.error('pay fail', err)
				      }
				    })
				  }
				})
			}	
		}
	}
</script>

<style scoped>
	.goods-main {
		background: #f7f8fa;
		padding-top: 0rpx;
	}

	.goods-item-wrap {
		background: #FFFFFF;
		display: flex;
		padding: 24rpx;
		margin: 12rpx;
		border-radius: 8rpx;
	}

	.goods-content-wrap {
		width: 100%;
		padding-left: 24rpx;
	}

	.goods-image {
		width: 190rpx;
		height: 200rpx;
		border-radius: 12rpx;
		flex: none;
	}

	.goods-name {
		font-size: 32rpx;
		font-weight: bold;
	}

	.goods-stock-wrap {
		display: flex;
		color: #969696;
		font-size: 28rpx;
		margin-top: 40rpx;
	}

	.goods-stock {
		margin-right: 24rpx;
	}
	.goods-sell-count {
		flex: 1;
		line-height: 62rpx;
		margin: 8rpx 0 0 20rpx;
	}
	.goods-price {
		flex: 1;
		font-size: 48rpx;
		color: #e7612e;
	}
	.goods-item-wrap {
		margin-top: 24rpx;
	}

	.goods-header-wrap {
		display: flex;
		align-items: center;
		padding: 24rpx;
		background: #FFFFFF;
	}

	.goods-header-item-action {
		font-size: 36rpx;
		font-color: #333333;
		font-weight: bold;
		position: relative;
	}

	.goods-header-item-action::after {
		position: absolute;
		left: 0;
		right: 0;
		background: #4372fe;
		height: 8rpx;
		content: "";
		bottom: -12rpx;
	}

	.goods-header-item {
		margin-right: 24rpx;
	}

	.publish-goods-wrap {
		background: rgba(255, 255, 255, .5);
		padding: 24rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.publish-goods-btn {
		margin: 24rpx;
		background: #4f7df5;
		color: #FFFFFF;
		height: 82rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 82rpx;
	}

	.goods-empty-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 40%;
	}
</style>
