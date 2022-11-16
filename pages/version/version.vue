<template>
	<view>
		<u-toast ref="uToast"></u-toast>
		<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
		<u--form
				labelPosition="left"
				:model="model1"
				ref="form1"
		>
			<u-form-item
					label="版本号"
					prop="version"
					borderBottom
					ref="item1"
			>
				<u--input
						v-model="model1.version"
						border="none"
				></u--input>
			</u-form-item>
			<u-form-item
					label="更新内容"
					prop="content"
					borderBottom
					ref="item1"
			>
				<u--textarea v-model="model1.content" placeholder="请输入版本更新内容" count ></u--textarea>
			</u-form-item>
		</u--form>
		<u-button type="primary" size="large" text="发布更新" @click="publishVersion"></u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			model1: {
				version: 1.0,
				content: ''
			}
		};
	},
	methods: {
		// 发布版本内容更新
		publishVersion(){
			uniCloud.database().collection('version').where({_id:"636e54c95125130001804ab2"}).update({
				version: JSON.parse(this.model1.version),
				content: this.model1.content
			}).then(res=>{
				this.$refs.uToast.show({
					type: 'success',
					title: '版本更新内容发布成功！',
					message: "版本更新内容发布成功！",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'	
				})
			})
		}
	},
	onShow() {
		uniCloud.database().collection('version').get().then(res=>{
			this.model1.version = res.result.data[0].version
			this.model1.content = res.result.data[0].content
		})
	}
};
</script>

<style lang="scss">

</style>
