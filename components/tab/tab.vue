<template>
	<view :style="{background: bgColor}">
		<view :id="id" :ref="id">
			<scroll-view :scroll-x="isScroll" class="f-scroll" :scroll-left="scrollLeft" scroll-with-animation>
				<view class="f-scroll-box" :style="scrollBox" :class="{'f-tab-scorll-flex': !isScroll, 'f-tabs-scorll-not': isScroll}">
					<view :ref="'jiudian' + index" class="f-tab-item" :id="'f-tab-item-' + index"  v-for="(item, index) in list" :key="index" @tap="clickTab(index)"
					 :style="[tabItemStyle(index)]">
						<!-- #ifdef APP-NVUE -->
						<text :style="[tabTextStyle(index)]"  class="text-center">{{ item[name] || item['name']}}</text>
						<!-- #endif -->
						<!-- #ifndef APP-NVUE -->
						<text  class="text-center">{{ item[name] || item['name']}}</text>
						<!-- #endif -->
					</view>
					<view v-if="showBar" class="f-tab-bar" :style="[tabBarStyle]"></view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {page} from './mixins.js'
	export default {
		mixins: [page],
		props: {
			// 导航菜单是否需要滚动，
			isScroll: {
				type: Boolean,
				default: true
			},
			// 要渲染的数据 必传
			list: {
				type: Array,
				required: true
			},
			// 当前活动tab的索引
			current: {
				type: [Number, String],
				default: 0
			},
			// 导航栏的高度和行高
			height: {
				type: [String, Number],
				default: 80
			},
			// 字体大小
			fontSize: {
				type: [String, Number],
				default: 30
			},
			// 过渡动画时长, 单位ms    nvue要 没有单位
			duration: {
				type: [String, Number],
				default: 500
			},
			// 选中项的主题颜色
			activeColor: {
				type: String,
				default: 'rgba(50, 145, 248, 1)'
			},
			// 未选中项的颜色
			inactiveColor: {
				type: String,
				default: '#303133'
			},
			// 菜单底部移动的bar的宽度，单位rpx
			barWidth: {
				type: [String, Number],
				default: 40
			},
			// 移动bar的高度
			barHeight: {
				type: [String, Number],
				default: 6
			},
			// 单个tab的左或有内边距（左右相同）
			itemPx: {
				type: [String, Number],
				default: 30
			},
			// 导航栏的背景颜色
			bgColor: {
				type: String,
				default: '#ffffff'
			},
			// 读取传入的数组对象的属性(tab名称)
			name: {
				type: String,
				default: 'name'
			},
			// 读取传入的数组对象的属性(徽标数)
			count: {
				type: String,
				default: 'count'
			},
			// 徽标数位置偏x轴移
			offset: {
				type: Number,
				default: 140
			},
			// 活动tab字体是否加粗
			bold: {
				type: Boolean,
				default: true
			},
			// 当前活动tab item的样式
			activeItemStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			// 是否显示底部的滑块
			showBar: {
				type: Boolean,
				default: true
			},
			// 底部滑块的自定义样式
			barStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			// 标签的宽度
			itemWidth: {
				type: [Number, String],
				default: 'auto'
			}
		},
		data() {
			return {
				scrollLeft: 0, // 在可滚动模式下 bar离左侧的距离
				tabQueryInfo: [], // 每个tab选项的尺寸
				componentWidth: 0, // 屏幕宽度，单位为px
				scrollBarLeft: 0, // 移动bar需要通过translateX()移动的距离
				parentLeft: 0, // tab整体组件 到屏幕左边的距离
				id: 'f_tab' + Math.round(Math.random() * 1000), // 随机id值	防止重复
				currentIndex: this.current,
				barFirstTimeMove: true, // 滑块第一次移动时(页面刚生成时)，无需动画，否则给人怪异的感觉
			}
		},
		watch: {
			current: {
				immediate: true,
				handler(nVal, oVal) {
					this.$nextTick(() => {
						this.currentIndex = nVal;
						this.scrollByIndex();
					});
				}
			},
		},
		computed: {
			// bar的样式
			tabBarStyle() {
				let style = {
					width: this.barWidth + 'rpx',
					transform: `translateX(${this.scrollBarLeft}px)`,
					// #ifndef APP-NVUE
					'transition-duration': `${this.barFirstTimeMove ? 0 : this.duration }ms`,
					// #endif
					// #ifdef APP-NVUE
					'transition-duration': `${this.barFirstTimeMove ? 0 : this.duration }`,
					// #endif
					"transition-property": 'transform',
					'background-color': this.activeColor,
					height: this.barHeight + 'rpx',
					'border-radius': `${this.barHeight / 2}px`
				};
				Object.assign(style, this.barStyle);
				return style;
			},
			tabTextStyle() {
				return (index) => {
					let style = {
						'font-size': this.fontSize* 1.1 + 'rpx',
						'line-height': this.fontSize * 2.4 + 'rpx'
					};
					if (index == this.currentIndex) {
						style.color = this.activeColor;
						style = Object.assign(style, this.activeItemStyle);
					} else {
						style.color = this.inactiveColor;
					}
					return style
				}
				
			},
			// tab的样式
			tabItemStyle() {
				return (index) => {
					let style = {
						height: this.height + 'rpx',
						'line-height': this.height + 'rpx',
						'font-size': this.fontSize + 'rpx',
						// #ifndef APP-NVUE
						'transition-duration': `${this.duration}ms`,
						// #endif
						// #ifdef APP-NVUE
						'transition-duration': this.duration,
						// #endif
						padding: this.isScroll ? `0 ${this.itemPx}rpx` : '',
						flex: this.isScroll ? 'auto' : '1', 
						width: typeof this.itemWidth === 'number' ? this.itemWidth + 'rpx' : this.itemWidth
					};
					// 字体加粗
					if (index == this.currentIndex && this.bold) style.fontWeight = 'bold';
					if (index == this.currentIndex) {
						style.color = this.activeColor;
						// 给选中的tab item添加外部自定义的样式
						style = Object.assign(style, this.activeItemStyle);
					} else {
						style.color = this.inactiveColor;
					}
					return style;
				}
			},
			scrollBox()  {
				if (this.tabQueryInfo.length == 0) {
					return 
				}
				let width = this.tabQueryInfo[0].width * this.tabQueryInfo.length
				let style = `width: ${width}px`
				return style
			}
		},
		methods: {
			$uGetRect(selector, all) {
				return new Promise(resolve => {
					uni.createSelectorQuery().
					in(this).select(selector)
						.boundingClientRect(rect => {
							if (all && Array.isArray(rect) && rect.length) {
								resolve(rect)
							}
							if (!all && rect) {
								resolve(rect)
							}
						})
						.exec((res) => {
						})
				})
			},
			nvueQuery() {
				const dom = weex.requireModule('dom')
				dom.getComponentRect(this.$refs[this.id], option => {
					// tabs组件距离屏幕左边的宽度
					this.parentLeft = option.size.left;
					// tabs组件的宽度
					this.componentWidth = option.size.width;
					this.getTabRectNvue();
				})
			},
			// 设置一个init方法，方便多处调用
			async init() {
				// 获取tabs组件的尺寸信息
				// #ifdef APP-NVUE
				this.$nextTick(() => {
					this.nvueQuery()
				})
				//#endif
				// #ifndef APP-NVUE
				let tabRect = await this.$uGetRect('#' + this.id);
				// tabs组件距离屏幕左边的宽度
				this.parentLeft = tabRect.left;
				// tabs组件的宽度
				this.componentWidth = tabRect.width;
				this.getTabRect();
				//#endif
			},
			// 点击某一个tab菜单
			clickTab(index) {
				// 点击当前活动tab，不触发事件
				if (index == this.currentIndex) return;
				// 发送事件给父组件
				this.$emit('change', index);
			},
			getElOption(ref) {
				const dom = weex.requireModule('dom')
				return new Promise(resolve => {
					dom.getComponentRect(this.$refs[`jiudian${ref}`][0], option => {
						resolve(option.size)
					})
				})
			},
			async getTabRectNvue() {
				const list = []
				for (let i = 0; i < this.list.length; i ++) {
					let res = await this.getElOption(i)
					list.push(res)
				}
				this.tabQueryInfo = list
				this.scrollByIndex();
			},
			// 查询tab的布局信息
			getTabRect() {
				// 创建节点查询
				let query = uni.createSelectorQuery().in(this);
				// 历遍所有tab，这里是执行了查询，最终使用exec()会一次性返回查询的数组结果
				for (let i = 0; i < this.list.length; i++) {
					// 只要size和rect两个参数
					query.select(`#f-tab-item-${i}`).fields({
						size: true,
						rect: true
					});
				}
				// 执行查询，一次性获取多个结果
				query.exec(
					function(res) {
						this.tabQueryInfo = res;
						// 初始化滚动条和移动bar的位置
						this.scrollByIndex();
					}.bind(this)
				);
			},
			// 滚动scroll-view	ios在nvue下无法手动滑动 暂未找到解决方案
			scrollByIndex() {
				// 每个选项的尺寸信息
				let tabInfo = this.tabQueryInfo[this.currentIndex];
				if (!tabInfo) return;
				// 活动tab的宽度
				let tabWidth = tabInfo.width;
				// 活动item的左边到tabs组件左边的距离，用item的left减去tabs的left
				let offsetLeft = tabInfo.left - this.parentLeft;
				// 将活动的tabs-item移动到屏幕正中间，实际上是对scroll-view的移动
				let scrollLeft = offsetLeft - (this.componentWidth - tabWidth) / 2;
				this.scrollLeft = scrollLeft < 0 ? 0 : scrollLeft;
				// 当前活动item的中点点到左边的距离减去滑块宽度的一半，即可得到滑块所需的移动距离
				let left = tabInfo.left + tabInfo.width / 2 - this.parentLeft;
				// 计算当前活跃item到组件左边的距离
				this.scrollBarLeft = left - uni.upx2px(this.barWidth) / 2;
				if (this.barFirstTimeMove == true) {
					setTimeout(() => {
						this.barFirstTimeMove = false;
					}, 100)
				}
			}
		},
		mounted() {
			this.init();
		}
	}
</script>

<style scoped>
	.f-scroll {
		/* #ifndef APP-NVUE */
		width: 100%;
		white-space: nowrap;
		/* #endif */
		/* #ifdef APP-NVUE */
		width: 750rpx;
		/* #endif */
		position: relative;
	}
	
	.f-scroll-box {
		overflow: hidden;
		position: relative;
		/* #ifdef MP-TOUTIAO */
		white-space: nowrap;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex-direction: row;
		/* #endif */
	}
	
	.f-tab-scorll-flex {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: row;
		/* #endif */
		justify-content: space-between;
	}
	.f-tabs-scorll-not {
		/* #ifndef APP-NVUE */
		display: block;
		flex-direction: row;
		/* #endif */
	}
	
	.f-tab-item {
		position: relative;
		/* #ifndef APP-NVUE */
		display: inline-block;
		/* #endif */
		text-align: center;
		transition-property: background-color, color;
	}
	
	.f-tab-bar {
		position: absolute;
		bottom: 0;
	}
	.text-center {
		text-align: center;
	}
	
	/* #ifdef H5 */
	// 通过样式穿透，隐藏H5下，scroll-view下的滚动条
	scroll-view ::v-deep ::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}
	
	/* #endif */
</style>
