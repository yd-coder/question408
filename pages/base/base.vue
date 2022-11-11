<template>
	<view class="content" :style="h100">
		<tab ref="fTab" bg-color="#fff" :bold="bold" :active-color="activeColor" :list="list" @change="change" :current="current"
		 :itemWidth="'200rpx'" :is-scroll="isScroll"></tab>
		<!-- #ifdef APP-NVUE -->
		<swiper @change="swiperChange" :current="current" :ref="list_id" class="swiper_item" :style="swiperStyle">
			<template v-for="(listItem, index) in msgList">
				<swiper-item :key="listItem.id" :stye="swiperItemStyle">
					<list class="list_wrapper">
						<cell v-for="item in listItem.msgs" :key="item.id">
							<view class="list_item">
								<view class="img_box">
									<image class="img_size" :src="item.img" mode=""></image>
								</view>
								<view class="item_content">
									<text class="item_title">{{item.title}}</text>
									<text class="item_content_size">{{item.content}}</text>
								</view>
							</view>
						</cell>
					</list>
				</swiper-item>
			</template>
		</swiper>
		<!-- #endif -->

		<!-- #ifndef APP-NVUE -->
		<swiper @change="swiperChange" :current="current" :id="list_id" class="swiper_item" :style="swiperStyle">
			<template v-for="(listItem, index) in msgList">
				<swiper-item :key="listItem.id" :stye="swiperItemStyle">
					<scroll-view scroll-y class="list_wrapper">
						<view v-for="item in listItem.msgs" :key="item.id">
							<view class="list_item" @click="goQuestion(item.url)">
								<!-- <view class="img_box">
									<image class="img_size" :src="item.img" mode="aspectFill"></image>
								</view> -->
								<view class="item_content">
									<text class="item_title">{{item.title}}</text>
									<text class="item_content_size">{{item.content}}</text>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</template>
		</swiper>
		<!-- #endif -->
	</view>


</template>

<script>
	import Tab from '@/components/tab/tab.vue'
	import {
		page
	} from '@/components/tab/mixins.js'
	export default {
		mixins: [page],
		components: {
			Tab
		},
		data() {
			return {
				bold: true,
				activeColor: '#2eb976',
				isScroll: false,
				current: 0,
				tabHeight: 0,
				list_id: 'f_tab' + Math.round(Math.random() * 1000),
				list: [
					{
						name: '数据结构'
					},
					{
						name: '操作系统'
					},
					{
						name: '计算机网络'
					},
					{
						name: '组成原理'
					}
				],
				msgList: [{
						id: 0,
						msgs: [{

								id: 31,
								title: '绪论',
								content: '题目待更新',
								url: 'data_xl'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '线性表',
								content: '题目待更新',
								url: 'data_xxb'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '栈、队列和数组',
								content: '题目待更新',
								url: 'data_zdlhsz'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '树与二叉树',
								content: '题目待更新',
								url: 'data_syecs'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '图',
								content: '题目待更新',
								url: 'data_t'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '查找',
								content: '题目待更新',
								url: 'data_cz'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '排序',
								content: '题目待更新',
								url: 'data_px'
							}
						]
					},
					{
						id: 1,
						msgs: [
							{
								id: 31,
								title: '操作系统概论',
								content: '题目待更新',
								url: 'os_czxtgl'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '进程管理',
								content: '题目待更新',
								url:'os_jcgl'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '内存管理',
								content: '题目待更新',
								url: 'os_ncgl'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '文件管理',
								content: '题目待更新',
								url: 'os_wjgl'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: 'I/O管理',
								content: '题目待更新',
								url: 'os_iogl'
							}
						]
					},
					{
						id: 2,
						msgs: [
							{
								id: 31,
								title: '计算机网络体系结构',
								content: '题目待更新',
								url: 'network_jsjwltxjg'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '物理层',
								content: '题目待更新',
								url: 'network_wlc'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '数据链路层',
								content: '题目待更新',
								url: 'network_sjllc'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '网络层',
								content: '题目待更新',
								url: 'network_wlc'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '传输层',
								content: '题目待更新',
								url: 'network_csc'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '应用层',
								content: '题目待更新',
								url: 'network_yyc'
							}
						]
					},
					{
						id: 3,
						msgs: [
							{
								id: 31,
								title: '计算机发展概述',
								content: '题目待更新',
								url: 'compose_jsjfzgs'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '数值系统',
								content: '题目待更新',
								url: 'compose_szxt'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '存储器',
								content: '题目待更新',
								url: 'compose_ccq'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '指令系统',
								content: '题目待更新',
								url: 'compose_zlxt'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '中央处理器',
								content: '题目待更新',
								url: 'compose_zyclq'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '总线',
								content: '题目待更新',
								url: 'compose_zx'
							},
							{
								id: 'f_tab' + Math.round(Math.random() * 1000),
								title: '输入输出系统',
								content: '题目待更新',
								url: 'compose_srscxt'
							}
						]
					}
				]
			}
		},
		onLoad() {
			this.$nextTick(async () => {
				// tab导航按钮高度 用于消息滚动定位
				this.tabHeight = this.$refs.fTab.height
				const winSize = uni.getSystemInfoSync()
			})
		},
		computed: {
			swiperStyle() {
				let top
				// #ifdef H5
				top = uni.upx2px(this.tabHeight + 20) + this.windowTop
				// #endif
				// #ifndef H5
				top = uni.upx2px(this.tabHeight + 20)
				// #endif
				const height = this.winHeight - uni.upx2px(this.tabHeight + 20)
				let width = 750
				let style = `width: ${width}rpx; top: ${top}px; height: ${height}px;`
				return style
			},
			swiperItemStyle() {
				const height = this.winHeight - uni.upx2px(this.tabHeight + 20)
				let width = 750
				let style = `width: ${width}rpx; height: ${height}px;`
				return style
			}
		},
		methods: {
			change(e) {
				this.current = e
			},
			swiperChange(e) {
				const {
					current
				} = e.detail
				this.current = current
			},
			goQuestion(url) {
				uni.navigateTo({
					url: `/pages/base/question?url=${url}`
				});
			}
		}
	}
</script>

<style scoped>
	.content {
		background-color: #eee;
	}

	.swiper_item {
		position: fixed;
		background-color: #fff;
	}

	.list_wrapper {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.list_item {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		height: 140rpx;
		overflow: hidden;
		padding: 0rpx 20rpx;
		align-items: center;
		border-bottom-color: #eee;
		border-bottom-width: 2rpx;
	}

	.img_box {
		height: 100rpx;
		width: 100rpx;
		overflow: hidden;
		justify-content: center;
		align-items: center;
		border-radius: 200rpx;
		border-width: 4rpx;
		border-color: #C0C0C0;
		margin-right: 20rpx;
	}

	.img_size {
		height: 180rpx;
		width: 180rpx;
	}

	.item_content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
	}

	.item_title {
		color: #333333;
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.item_content_size {
		font-size: 24rpx;
		color: #999999;
	}
</style>
