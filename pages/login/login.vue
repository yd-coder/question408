<template>
	<view class="container">
		<view class="logo">
			<image src="../../static/img/logo.png"></image>
		</view>
		<text class="title">让你轻松掌握408</text>
		<view class="login" @click="getUserInfo()">
			<text>使用微信一键登录</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{}
			}
		},
		methods: {
			getUserInfo() {
			    uni.getUserProfile({
			        desc: '用于完善会员资料',
			        success: (res) => {
			            this.userInfo = res.userInfo
			            this.wxLogin()
			        },
			        fail: () => {
			            uni.hideLoading();
			            uni.showModal({
			                content: '获取用户信息失败',
			                showCancel: false
			            })
			        }
			    })
			},
			wxLogin() {
			    uni.showLoading({
			        title: '加载中'
			    });
			
			    uni.login({
			        provider: 'weixin',
			        success: (res) => {
			            // 获取 code
			            if (res.code) {
			                uniCloud.callFunction({
			                    name: 'user',
			                    data: {
			                        action: 'code2Session',
			                        js_code: res.code,
			                        user_info: this.userInfo
			                    },
			                    success: (res) => {
			                        // console.log('云函数返回的值：：：：', res.result)
			                        uni.hideLoading();
			                        if (res.result.result.result._id) {
			                            uni.setStorageSync('userInfo', JSON.stringify(res.result.result.result))
			                        }
									uni.navigateTo({
										url: '/pages/home/home'
									});
			                    },
			                    fail: () => {
			                        uni.hideLoading();
			                        console.log('云函数调用失败')
			                    }
			                })
			            }
			        }
			    })
			}
		}
	}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	margin-top: 120px;
	width: 100%;
	height: 250px;
	justify-content: start;
	align-items: center;
}
.logo {
	width: 70px;
	height: 70px;
	border-radius: 50%;
	border: 5px solid #2eb976;
	background-color: #fff;
	margin: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.logo image {
	width: 50px;
	height: 50px;
}
.title {
	font-size: 16px;
	font-weight: 400;
	margin-bottom: 40px;
}
.login {
	width: 90%;
	height: 50px;
	text-align: center;
	border-radius: 5px;
	background-color: #2eb976;
	color: #fff;
	font-size: 18px;
}
.login text {
	line-height: 50px;
}
</style>
