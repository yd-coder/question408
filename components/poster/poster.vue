<template>
  <view class="container">
    <canvas
      canvas-id="poster-canvas"
      class="poster-canvas"
      :style="{
        width: (posterParams.width || 0) + 'px',
        height: (posterParams.height || 0) + 'px'
      }"
      v-if="isShowCanvas"
    ></canvas>
    <view class="wrapper" v-if="posterImage">
      <image
        :src="posterImage"
        mode="widthFix"
        @tap.stop="previewImage(posterImage)"
        class="poster-image"
        show-menu-by-longpress
      />
      <view class="share-btn" @tap.stop="saveImageToPhotosAlbum">
        保存分享图
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
			userInfo: {},
      posterImage: '',
      isShowCanvas: false,
			posterParams: {
			  width: 750, // 750和1334是1080和1920设计稿的等比例缩小
			  height: 1334,
			  backgroundColor: '',
			  backgroundImageUrl: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-60b4596f-0c8e-4040-b1a2-94ea36bb80d7/a30f2e58-ad95-44cb-b15f-1abc3d11eef4.png',
			  list: [
			    {
			      type: 'block',
			      x: 250,
			      y: 1150,
			      url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-60b4596f-0c8e-4040-b1a2-94ea36bb80d7/e0fdbf4a-8495-4053-bb63-411bc4786a87.jpg',
			      width: 170,
			      height: 170
			    }
			  ]
			},
    }
  },
  methods: {
    async pageInit() {
			if(uni.getStorageSync('userInfo')){
				this.userInfo = JSON.parse(uni.getStorageSync('userInfo'))
			}
			this.posterParams.list.push({
			  type: 'block',
			  x: 120,
			  y: 520,
			  url: this.userInfo.avatarUrl || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
			  width: 150,
			  height: 150,
			  radius: 60
			})
			this.posterParams.list.push({
			  type: 'text',
			  x: 130,
			  y: 690,
			  text: this.userInfo.nickName || '未登录',
			  fontSize: 30,
				fontWeight: 700,
			  color: '#323233',
			  textAlign: 'left'
			})
			this.posterParams.list.push({
			  type: 'text',
			  x: 85,
			  y: 810,
			  text: `    我已刷了${uni.getStorageSync('questionCount') || 0}道题，快来跟我一起刷题吧`,
			  fontSize: 46,
				fontWeight: 700,
			  color: '#323233',
			  textAlign: 'left',
			  lineHeight: 44,
			  maxWidth: 320
			})
      uni.showLoading({
        title: '加载中...',
        mask: true
      })

      this.isShowCanvas = true

			// 等待canvas画完生成图片临时路径
      const [canvasId, tempCanvasFilePaths] = await this.canvasToDraw()

			this.posterImage = tempCanvasFilePaths

      uni.hideLoading()
    },
    // 创建 canvas
    createCanvasContext() {
      const ctx = uni.createCanvasContext('poster-canvas', this)
      return [ctx, 'poster-canvas']
    },
    // 绘制弧矩形路径
    canvasToDrawArcRectPath(ctx, x, y, w, h, r = 0) {
      const [
        topLeftRadius,
        topRightRadius,
        bottomRightRadius,
        BottomLeftRadius
      ] = Array.isArray(r) ? r : [r, r, r, r]
      /**
       * 1. 移动到圆弧起点
       *
       * 2. 绘制上直线
       * 3. 绘制右上角圆弧
       *
       * 4. 绘制右直线
       * 5. 绘制右下圆弧
       *
       * 6. 绘制下直线
       * 7. 绘制左下圆弧
       *
       * 8. 绘制左直线
       * 9. 绘制左上圆弧
       */
      ctx.beginPath()

      ctx.moveTo(x + topLeftRadius, y)

      // 右上
      ctx.lineTo(x + w - topRightRadius, y)
      ctx.arcTo(x + w, y, x + w, y + topRightRadius, topRightRadius)

      // 右下
      ctx.lineTo(x + w, y + h - bottomRightRadius)
      ctx.arcTo(
        x + w,
        y + h,
        x + w - bottomRightRadius,
        y + h,
        bottomRightRadius
      )

      // 左下
      ctx.lineTo(x + BottomLeftRadius, y + h)
      ctx.arcTo(x, y + h, x, y + h - BottomLeftRadius, BottomLeftRadius)

      // 左上
      ctx.lineTo(x, y + topLeftRadius)
      ctx.arcTo(x, y, x + topLeftRadius, y, topLeftRadius)

      ctx.closePath()
    },
    // 绘制文字
    canvasToDrawText(ctx, canvasParam) {
      const {
        x,
        y,
        text,
        fontWeight = 'normal',
        fontSize = 40,
        lineHeight,
        maxWidth,
        textAlign = 'left',
        color = '#323233'
      } = canvasParam

      if (typeof text !== 'string') {
        return
      }

      ctx.font = `normal ${fontWeight} ${fontSize}px sans-serif`

      ctx.setFillStyle(color)
      ctx.textBaseline = 'middle'
      ctx.setTextAlign(textAlign)

      function drawLineText(lineText, __y) {
        let __lineText = lineText
        if (__lineText[0] === ' ') {
          __lineText = __lineText.substr(1)
        }
        ctx.fillText(__lineText, x, __y + fontSize / 2)
      }

      if (maxWidth) {
        const arrayText = text.split('')

        let lineText = ''
        let __y = y
        for (let index = 0; index < arrayText.length; index++) {
          const aryTextItem = arrayText[index]
          lineText += aryTextItem
          /**
           * 1. 计算当前文字加下一个文字的文本宽度
           * 2. 当文本宽度大于最大宽度时, 在画布上绘制被填充的文本
           * 3. __y + fontSize / 2 的问题
           * 4. 设置下一行文本的 y轴位置, 重置当前文本信息
           */
          const { width: textMetrics } = ctx.measureText(
            lineText + (arrayText[index + 1] ?? '')
          )
          if (textMetrics > maxWidth) {
            // 绘制一行文字, 如果第一个文字是空格，则删除
            drawLineText(lineText, __y)
            __y += lineHeight ?? fontSize
            lineText = ''
          }
        }
        // 绘制最后一行文字, 如果第一个文字是空格，则删除
        drawLineText(lineText, __y)
        return
      }
      ctx.fillText(text, x, y + fontSize / 2)
    },
    // 绘制块元素
    canvasToDrawBlock(ctx, params) {
      return new Promise(async (resolve) => {
        const {
          x,
          y,
          url,
          width,
          height,
          radius,
          border,
          borderColor,
          backgroundColor
        } = params

        if (border) {
          ctx.setFillStyle(borderColor ?? '#fff')
          this.canvasToDrawArcRectPath(
            ctx,
            x - border,
            y - border,
            width + border * 2,
            height + border * 2,
            radius
          )
          ctx.fill()
        }

        if (backgroundColor) {
          ctx.setFillStyle(backgroundColor)
          this.canvasToDrawArcRectPath(ctx, x, y, width, height, radius)
          ctx.fill()
        }

        if (url) {
          ctx.save()

          this.canvasToDrawArcRectPath(ctx, x, y, width, height, radius)

          ctx.clip()

          const { path: tempImageUrl } = await this.uniGetImageInfoSync(url)
          ctx.drawImage(tempImageUrl, x, y, width, height)
        }

        ctx.restore()
        resolve()
      })
    },
    // 获取图片信息（主要用于把远程 url转为微信临时文件以绘制图片）
    uniGetImageInfoSync(url) {
      return new Promise((resolve, reject) => {
        uni.getImageInfo({
          src: url,
          success: resolve,
          fail: reject
        })
      })
    },
    // canvas 导出图片临时地址
    canvasToTempFilePath(canvasId, params) {
      return new Promise((resolve, reject) => {
        uni.canvasToTempFilePath(
          {
            canvasId,
            fileType: 'jpg',
            ...params,
            success: resolve,
            fail: reject
          },
          this
        )
      })
    },
    // 绘制 canvas
    canvasToDraw() {
      return new Promise(async (resolve) => {
        const [ctx, canvasId] = this.createCanvasContext()
        const { width, height, backgroundImageUrl, backgroundColor } =
          this.posterParams

        if (backgroundColor) {
          this.canvasToDrawBlock(ctx, {
            x: 0,
            y: 0,
            width,
            height,
            backgroundColor
          })
        }

        // 绘制背景图
        if (backgroundImageUrl) {
          const { path: tempBackgroundImageUrl } =
            await this.uniGetImageInfoSync(backgroundImageUrl)
          ctx.drawImage(tempBackgroundImageUrl, 0, 0, width, height)
        }

        // 绘制其他元素
        for (const canvasParam of this.posterParams.list) {
          const { type } = canvasParam

          if (type === 'text') {
            this.canvasToDrawText(ctx, canvasParam)
          }

          if (type === 'block') {
            await this.canvasToDrawBlock(ctx, canvasParam)
          }
        }

        ctx.draw(false, async () => {
          const { tempFilePath } = await this.canvasToTempFilePath(canvasId, {})
          resolve([canvasId, tempFilePath])
        })
      })
    },
    previewImage(url) {
      uni.previewImage({
        urls: [url]
      })
    },
    saveImageToPhotosAlbum() {
      uni.saveImageToPhotosAlbum({
        filePath: this.posterImage,
        success: () => {
          this.$emit('close-overlay')
          uni.showToast({
            title: '保存图片成功',
            duration: 2000
          })
        },
        fail(err) {
          const { errMsg } = err
          if (errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
            uni.showModal({
              title: '保存失败',
              content: '请授权保存图片到“相册”的权限',
              success: (result) => {
                const { confirm } = result
                if (confirm) {
                  uni.openSetting({})
                }
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  .poster-canvas {
    position: fixed;
    left: -99999999px;
    top: -99999999px;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .poster-image {
      width: 540rpx;
      border-radius: 24rpx;
    }
    .share-btn {
      width: 470rpx;
      height: 40px;
			color: #ffffff;
      border-radius: 40rpx;
      background-color: #2eb976;
      margin: 40rpx auto 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-weight: 500;
    }
  }
}
</style>