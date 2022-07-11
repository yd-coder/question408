<template>
	<section class="aui-flexView">
		<section class="aui-scrollView">
			<div class="aui-tab" data-ydui-tab>
				<ul class="tab-nav">
					<block v-for="(menuTab,index) in menuTabs" :key="index">
						<li v-bind:id="'tabNum'+index" @click="swichMenu(index)" :class="[currentTab==index ? 'tab-nav-item tab-active' : 'tab-nav-item']">
							{{menuTab.name}}
						</li>
					</block>
				</ul>
				<div class="divHeight"></div>
				<div class="tab-panel">
					<block v-for="(item,index) in orderList" :key="index">
						<div class="tab-item">
							<a href="javascript:void(0);" class="aui-well-item aui-well-item-clear">
								<div class="aui-well-item-bd">
									<h3>下单时间:{{item.creatTime}}</h3>
								</div>
								<span class="aui-well-item-fr" @click="deleteOrder(item._id)">删除订单</span>
							</a>
							<div class="aui-mail-product">
								<a href="javascript:;" class="aui-mail-product-item">
									<div class="aui-mail-product-item-hd">
										<img :src="item.image" alt="">
									</div>
									<div class="aui-mail-product-item-bd">
										<p>{{item.name}}</p>
									</div>
								</a>
							</div>
							<a href="javascript:;" class="aui-mail-payment">
								<p>
									共1件商品 实付款: ￥{{item.totalFee}}
								</p>
							</a>
							<div class="aui-mail-button">
								<!-- <a href="javascript:;" :class="[item.status===0 ? 'aui-df-color' :'hd']">等待收货</a> -->
								<span  :class="[item.status===1 ? 'aui-df-color' :'hd']">查看物流</span>
								<!-- <a href="javascript:;" :class="[item.status===1 ? 'aui-df-color' :'hd']">再次购买</a> -->
								<span  :class="[item.status===1 ? 'aui-df-color' :'hd']">评价晒单</span>
								<span  :class="[item.status===1 ? 'aui-df-color' :'hd']">查看发票</span>
								<span  :class="[item.status===0 ? 'aui-red-color' :'hd']" @click="goPay(item)">去支付</span>
							</div>
						</div>
						<div :class="[index+1==menuList.length ? 'hd':'divHeight']"></div>
					</block>
				</div>
			</div>
		</section>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				scrollLeft: 0,
				isClickChange: false,
				currentTab: 0,
				menuTabs: [
					{
						name: '全部'
					}, {
						name: '待付款'
					}, {
						name: '已完成'
					}, {
						name: '已取消'
					},
				],
				orderList: [
					// {
					// 	"logoimg": '../../static/icon-logo.png',
					// 	"dname":"自营Apple产品专营店",
					// 	"zt":"已取消",
					// 	"img": '../../static/pd-001.png',
					// 	"name":"Apple 苹果 iPhone8 Plus 4G手机 深空灰 移动联通版64G裸机Apple 苹果 iPhone8 Plus 4G手机 深空灰 移动联通版64G裸机",
					// 	"sum":"1",
					// 	"pri":"6899.00",
					// 	// 0=没有,1=有,2=标红
					// 	"but_rebuy":2,
					// 	"but_pingjia":1,
					// 	"but_fapiao":1,
					// 	"but_zhifu":0,
					// 	"but_wuliu":0,
					// 	"but_ddshouhuo":0,
					// },
					// {
					// 	"logoimg": '../../static/icon-logo.png',
					// 	"dname":"自营Apple产品专营店",
					// 	"zt":"已取消",
					// 	"img": '../../static/pd-002.png',
					// 	"name":"Apple 苹果 iPhone8 Plus 4G手机 深空灰 移动联通版64G裸机Apple 苹果 iPhone8 Plus 4G手机 深空灰 移动联通版64G裸机",
					// 	"sum":"1",
					// 	"pri":"3899.00",
					// 	"but_rebuy":2,
					// 	"but_pingjia":0,
					// 	"but_fapiao":0,
					// 	"but_zhifu":0,
					// 	"but_wuliu":0,
					// 	"but_ddshouhuo":0,
					// },
					// {
					// 	"logoimg": '../../static/icon-logo.png',
					// 	"dname":"自营Apple产品专营店",
					// 	"zt":"已取消",
					// 	"img": '../../static/pd-003.png',
					// 	"name":"Apple 苹果 iPhone8 Plus 4G手机 深空灰 移动联通版64G裸机Apple 苹果 iPhone8 Plus 4G手机 深空灰 移动联通版64G裸机",
					// 	"sum":"1",
					// 	"pri":"4899.00",
					// 	"but_rebuy":2,
					// 	"but_pingjia":1,
					// 	"but_fapiao":0,
					// 	"but_zhifu":0,
					// 	"but_wuliu":0,
					// 	"but_ddshouhuo":0,
					// }
				]
			}
		},
		onLoad() {
			
		},
		onShow() {
			wx.cloud.database().collection('order').orderBy('time','desc').get().then(res=>{
			    this.orderList = res.data
			})
		},
		methods: {
			swichMenu: async function(current) { //点击其中一个选项
				if (this.currentTab == current) {
					return false;
				} else {
					this.currentTab = current;
				}
				if(current === 0){
					wx.cloud.database().collection('order').orderBy('time','desc').get().then(res=>{
					    this.orderList = res.data
					})
				}else{
					wx.cloud.database().collection('order').orderBy('time','desc').where({
						status: current-1
					}).get().then(res=>{
					    this.orderList = res.data
					})
				}
			},
			swiperChange: async function(e) {
				let index = e.target.current;
				this.setScrollLeft(index);
				this.currentTab = index;
			},
			getWidth: function(id) { //得到元素的宽高
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},
			// 删除订单
			deleteOrder(id) {
				wx.cloud.database().collection('order').doc(id).remove().then(res=>{
				    uni.showToast({
				    	icon:"success",
						title: "删除成功"
				    })
				})
			},
			// 订单去支付
			goPay(item) {
				wx.cloud.callFunction({
				  name: 'pay',
				  data: {
					outTradeNo: item._id,
					goodName:item.name,
				    totalFee:item.totalFee,
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

<style>

.aui-scrollView {
    width: 100%;
    height: 100%;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    position: relative;
    /* margin-top: -44px; */
}


.tab-nav {
    background: #FFFFFF;
    height: 40px;
    line-height: 40px;
    /* border-radius: 80px; */
    display: block;
    /* margin: 0 auto; */
    position: fixed;
	width: 100%;
	margin-bottom: 15%;
    /* width: 185px; */
	z-index: 9999;
}

.tab-nav:after {
    content: '';
    position: fixed;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #bbbbbb;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
}

.tab-nav-item {
    height: 40px;
    line-height: 40px;
    position: relative;
    text-align: center;
    color: #585858;
    font-size: 0.9rem;
    display: block;
    float: left;
    border-radius: 80px;
    /* padding: 0 15px; */
    width: 20%;
    margin: 0 auto;
}

.tab-nav-item.tab-active {
    /* background-color: #51bd03; */
}

.tab-nav-item.tab-active a {
    color: #000000;
    font-weight: bold;
}

.tab-nav-item a {
    display: inherit;
    color: inherit;
    font-size: 0.8rem;
    color: #464646;
}

.tab-panel {
    position: relative;
    overflow: hidden;
}

.tab-panel .tab-panel-item {
    width: 100%;
    position: absolute;
    top: 0;
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
}

.tab-nav-item.tab-active:before {
    content: '';
    width: 40%;
    height: 0px;
    position: absolute;
    left: 50%;
    bottom: 0;
    margin-left: -20%;
    z-index: 4;
    background-color: #f23030;
    border-radius: 120px;
    border: 1px solid #f23030;
}

.tab-panel .tab-panel-item.tab-active ~ .tab-panel-item {
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
}

.tab-panel .tab-panel-item.tab-active {
    position: relative;
    -webkit-transition: -webkit-transform .15s;
    transition: -webkit-transform .15s;
    transition: transform .15s;
    transition: transform .15s, -webkit-transform .15s;
    -webkit-transform: translateX(0);
    transform: translateX(0);
}

.divHeight {
    background: #f0f2f5;
    width: 100%;
    height: 10px;
	padding-top: 20px;
}

.aui-well-item {
    padding: 20px 15px 20px 20px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}

.aui-well-item-hd {
    margin-right: .4em;
    width: 19px;
    height: 19px;
    line-height: 19px;
    text-align: center;
}

.aui-well-item-hd img {
    width: 100%;
    max-height: 100%;
    vertical-align: top;
    display: block;
    border: none;
    margin-top: 3px;
}

.aui-well-item-bd {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    min-width: 0;
}

.aui-well-item-bd h3 {
    color: #333;
    font-size: 0.9rem;
    position: relative;
    /* padding-left: 20px; */
    font-weight: normal;
    padding-bottom: 0;
    text-align: left;
}

.aui-well-item-fr {
    font-size: 0.85rem;
    text-align: right;
    color: #999999;
    padding-right: 25px;
    position: relative;
}

.aui-well-item-fr:after {
    content: " ";
    display: inline-block;
    height: 18px;
    width: 18px;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAEQ0lEQVRYR+3YbYgVVRgH8Oc/3VX7sLK9sRVpWyCYCiEYvVCylh9cKlx2vefMtiCGUR8KjAyUiloSesMQDEJWsBTTc55h3RJqkcpeJArDEMTdCqEsgwqslDZQd+cfM11lsd17585OYOB8usw5z/P8Zs45M+cO5AI/cIH75CJwsiNU9x201i6HyGIRmSFk1XiKxACOUeQD7/22PNh6gAiNeUuArjyFhNzuVJeLCOuJzww0xqwOgPVJcpIEcEDI4VrFKDIHwFVJv5h8UlVfrRUztj0z0BpzGMAcERkejePboyg6lKVQa2trqbm5eRNEVpIc9Kpzs8Sd7ZMZGFp7dmj2Oe8X1lOkq1y+m0HwYRLjvM9cM+n/r85jIPUYJt13Ivj/EGhMD4GZEHkwXRAi20B+N+lbNCYBRRYBWJguNpHn06FX7RmvxrjzIQzDBUJ+WVl596rqe0UCrTHrAawm+adXbayWe1xgV2fnbJZKQxWgVVUtGLgJwCMkf/aq19QN7OjouG5KQ8OPaSC50qluKRRo7XaIdJM84lVn1Q1sb29vmjZ16u8V4CqnurFg4NsQWUryoFedXzewp6cn+HpoaLQyxE+p6ovJ7zAMWyWOW8+f1GEYtkgcr0gLBcGbzrnvK/3HPW+NeR/AYpKfedU76wYmAdaYUwCmCPmCU306LWhMjwDPnf/ATeHkR2khYJFz7uNzFzTOeWvM5wBuI7nHqy7JCzwO4HIhNzrVVYUCrT0EkXkk+7zqsrzAowBmCrnFqa4sEhhamzxXW4Tc6lT/mRoTHBO+F621gxC5SUS88z4sEmiN+TXZ4ZB83as+mg9ozH4Atwj5rlO9r2DgXwAuJfmKV12TF7gXwCIhP3Gq6cotYpGMfUII+axTXZcXuBvA/UIecKoLigJ2d3dPHx0ZOZGiyCec6oZcwNCYHcn2nuQ3XnV2UcAwDK8V8qcK8GGnujkX0Fq7GSIPCXnMqc4oCvhAZ+esuFT6NkXFcbeLoh35gMZsAPA4yT+86mVFAcPOzvlSKn1VAS51UbQ7FzA0Zp0AzyTX6by/pDBgGN4l5KdJPsTxPTujaG9e4BoBXkqCT5w8OW1gYOBUEavYWtsGkXR/ORrHt0ZRtD8X0Fr7GEReqyS6Ioqi36olytoWlsvLJAii9A6OjMzb2dd3OBcwLJdXSBC8UQFeH0XRD1kR1fqNzRucOdOyY9euo3mB5650NI7nRlE0WARw7MicOn36yv7+/uO5gF3l8hIGwUDWuZIVb61dC5F0f3l2bucCWmtvhsjBdK6QK3aqbs2KqDrE1ibTJtnB/OK8v7pWzgl3M8k7c2hw8AiAG5J/XxA5UCtZrXaKlETkDgAQ8mWnurZWTNXPENbaeRB5R0RurJWornayf3pTk+3t7T1TK67md5K2trapjY2NbQDmgmyolbBaO4FhAF845/ZlzVMTmDXRf9XvInCyd/ZvI9y6Rxr69GgAAAAASUVORK5CYII=");
    background-size: 18px;
    top: -2px;
    position: absolute;
    top: 50%;
    margin-top: -9px;
    right: 0px;
    border-radius: 2px;
}

.aui-mail-product {
    background: #f7f7f7;
    padding: 20px;
    position: relative;
    overflow: hidden;
}

.aui-mail-product-item {
    /* padding: 15px; */
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}

.aui-mail-product-item-hd {
    margin-right: .8em;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
}

.aui-mail-product-item-hd img {
    width: 100%;
    max-height: 100%;
	border-radius: 12rpx;
    vertical-align: top;
}

.aui-mail-product-item-bd {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    min-width: 0;
}

.aui-mail-product-item-bd p {
    color: #404040;
    font-size: 34rpx;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}

.aui-mail-payment {
    padding: 10px 15px;
    position: relative;
    text-align: right;
    font-size: 0.8rem;
    color: #333;
    overflow: hidden;
    display: block;
}

.aui-mail-payment p em {
    font-style: normal;
}

.aui-mail-payment p i {
    font-size: 1.3rem;
    font-style: normal;
}

.aui-mail-payment:after {
    content: '';
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #e2e2e2;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
}

.aui-mail-button {
    padding: 15px 20px 15px 0;
    overflow: hidden;
}

.aui-mail-button span {
    background: none;
    border: 1px solid #f0250f;
    color: #f0250f;
    font-size: 0.8rem;
    border-radius: 40px;
    /* display: block; */
    padding: 2px 14px;
    /* display: inline-block; */
    float: right;
    margin-left: 8px;
}

.aui-mail-button .aui-df-color {
    color: #333;
    border: 1px solid #ddd;
}

.aui-mail-button .aui-red-color {
    border: 1px solid #f0250f;
    color: #f0250f;
}
.aui-well-wait {
    text-align: right;
    color: #f0250f;
    font-size: 0.8rem;
}

.hd{
	display: none;
}
</style>
