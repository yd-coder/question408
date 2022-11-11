<template>
	<view class="bg">
		<view class="container">
			<view class="rank-item" v-for="(item,index) in rankList" :key="index">
				<image class="item-rankimg" v-if="index === 0" src="../../static/img/ranking/one.png"></image>
				<image class="item-rankimg" v-else-if="index === 1" src="../../static/img/ranking/two.png"></image>
				<image class="item-rankimg" v-else-if="index === 2" src="../../static/img/ranking/three.png"></image>
				<text class="item-rankimg" v-else>{{index+1}}</text>
				<view class="user">
					<image class="item-avatar" :src="item.avatarUrl"></image>
					<text class="item-nickname">{{item.nickName}}</text>
				</view>
				<text class="item-count">{{item.count}}&nbsp;题</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rankList:[]
			}
		},
		onShow() {
			uniCloud.database().collection('user').orderBy("count", "desc").get().then(res => {
				this.rankList = res.result.data
			})
		},
		methods: {
			
		}
	}
</script>

<style>
.bg {
	width: 100%;
	background-color: #2EB976;
	display: flex;
	justify-content: center;
}
.container {
	width: 90%;
	background-color: #fff;
	border-radius: 6px;
	box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 3%);
	margin-top: 15px;
	margin-bottom: 15px;
	padding: 10px;
}
.rank-item {
	width: 100%;
	height: 70px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid gainsboro;
}
.item-rankimg {
	width: 42px;
	height: 42px;
	border-radius: 50%;
	text-align: center;
}
.item-avatar {
	width: 46px;
	height: 46px;
	border: 1px solid gainsboro;
	border-radius: 50%;
}
.item-nickname {
	margin-left: 10px;
}
.item-count {
	margin-right: 10px;
}
.user {
	width: 70%;
	height: 100%;
	display: flex;
	align-items: center;
}
text {
	font-size: 18px;
	font-weight: 400;
}
</style>
