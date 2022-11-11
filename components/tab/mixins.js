export const page = {
	data() {
		return {
			winHeight: 0,
			winWidth: 0,
			windowTop: 0
		}
	},
	methods: {
		getWin() { // 获取窗口 宽高
			let {
				windowHeight,
				windowWidth,
				// #ifdef H5
				windowTop
				// #endif
			} = uni.getSystemInfoSync()
			this.winHeight = windowHeight
			this.winWidth = windowWidth
			// #ifdef H5
			this.windowTop = windowTop
			// #endif
		},
		getElMsgNvue(el) { // 获取元素宽高 nvue
			// #ifdef APP-NVUE
			const dom = weex.requireModule('dom')
			// #endif
			const isArr = Array.isArray(this.$refs[el])
			
			return new Promise(resolve => {
				dom.getComponentRect(isArr ? this.$refs[el][0] : this.$refs[el], option => {
					console.log(option)
					resolve(option.size)
				})
			})
		},
		getElMsg(el, all) { // 获取元素宽高
			// #ifndef APP-NVUE
			const dom = uni.createSelectorQuery()
			// #endif
			return new Promise(resolve => {
					uni.createSelectorQuery().
					in(this).select(el)
						.boundingClientRect(rect => {
							console.log(rect)
							if (all && Array.isArray(rect) && rect.length) {
								resolve(rect)
							}
							if (!all && rect) {
								resolve(rect)
							}
						})
						.exec((res) => {
							console.log(res)
						})
				})
		}
	},
	computed: {
		h100() {
			const height = this.winHeight
			return `height: ${height}px;`
		}
	},
	onLoad() {
		this.getWin()
	}
}