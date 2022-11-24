<template>
	<view class="u-page">
		<u-list>
			<u-empty
				v-if="favorite.length===0"
				mode="favor"
				iconSize=120
				textSize=18
				marginTop=150
			  text="暂无收藏"
			>
			</u-empty>
			<u-list-item v-for="(item, index) in favorite" :key="index">
				<u-swipe-action>
					<u-swipe-action-item :options="options" @click="cancel(item)">
						<view class="swipe-action u-border-top u-border-bottom">
							<view class="swipe-action__content">
								<text class="swipe-action__content__text">{{item.title}}</text>
							</view>
						</view>
					</u-swipe-action-item>
				</u-swipe-action>
			</u-list-item>
		</u-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				favorite: [],
				options: [{
					text: '取消收藏',
					icon: 'star-fill',
					iconSize: '20',
					style: {
						backgroundColor: '#f56c6c'
					}
				}],
			};
		},
		onLoad() {
			const openid = JSON.parse(uni.getStorageSync('userInfo')).openid
			uniCloud.database().collection('user').where({openid:openid}).get().then(res=>{
				this.favorite = res.result.data[0].favorite
			})
		},
		onShow() {
			const openid = JSON.parse(uni.getStorageSync('userInfo')).openid
			uniCloud.database().collection('user').where({openid:openid}).get().then(res=>{
				this.favorite = res.result.data[0].favorite
			})
		},
		methods: {
			cancel(item) {
				const openid = JSON.parse(uni.getStorageSync('userInfo')).openid
				let newItem = JSON.parse(JSON.stringify(this.favorite.filter(obj=> obj._id !== item._id )))
				uniCloud.database().collection('user').where({openid:openid}).update({
					favorite: newItem
				}).then(res=>{
					uniCloud.database().collection('user').where({openid:openid}).get().then(res=>{
						this.favorite = res.result.data[0].favorite
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-page {
		padding: 0;
	}

	.u-demo-block__title {
		padding: 10px 0 2px 15px;
	}

	.swipe-action {
		&__content {
			padding: 25rpx 0;

			&__text {
				font-size: 15px;
				color: $u-main-color;
				padding-left: 30rpx;
			}
		}
	}
</style>
