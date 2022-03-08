<script setup>
import { computed, inject, onMounted, reactive, ref } from "vue"
// swiper
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, Parallax, Pagination, Navigation } from "swiper"
// gsap
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// cottonjs
import Cotton from 'cottonjs'
// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

gsap.registerPlugin(ScrollTrigger)

const axios = inject('axios')

const url = `${import.meta.env.VITE_HOME_API}`

// variables
const data = reactive({})

// fetch data
axios.get(url)
  .then(res => {
    Object.assign(data, res.data)

    // set banner swiper fraction
    fractionTotalNum.value = Object.keys(res.data.banner.content).length

    // gsap
    setTimeout(() =>{
      useGsap()
      useCotton()
    }, 100)
  })

// banner
const bannerModules = [Parallax, Pagination, Navigation]
const bannerSwiperInstance = ref(null)

const bannerSwiperArrowPrev = ref(null)
const bannerSwiperArrowNext = ref(null)

const fractionActiveNum = ref(1)
const fractionTotalNum = ref(1)
const fractionActiveText = computed(() => fractionActiveNum.value.toString().padStart(2, '0'))
const fractionTotalText = computed(() => fractionTotalNum.value.toString().padStart(2, '0'))

const bannerProgress = ref(0)

// swiper autoplay
const autoplayDelay = 5000
const IntervalDuring = 20
const addValue = 100 / (autoplayDelay / IntervalDuring)

setInterval(() => {
  if (bannerProgress.value >= 100) {
    bannerProgress.value = 0
    bannerSwiperInstance.value.slideNext()
  }
  else {
    bannerProgress.value += addValue
  }
}, IntervalDuring)

// swiper afterinit
const bannerAfterInit = (swiper) => {
  bannerSwiperInstance.value = swiper
}

// swiper slide change
const bannerSlideChange = (swiper) => {
  fractionActiveNum.value = swiper.realIndex + 1
  bannerProgress.value = 0
}


// collection-wrap scroll translate
const collectionBlock = ref(null)
const collectionContent = ref(null)
const collectionWrap = ref(null)

const collectionTranslate = ref(0)

const setCollectionTranslate = () => {
  const collectionBlockRect = collectionBlock.value.getBoundingClientRect()
  const collectionContentRect = collectionContent.value.getBoundingClientRect()
  const collectionWrapRect = collectionWrap.value.getBoundingClientRect()
  const scrollDistance = collectionBlockRect.height - collectionContentRect.height
  const translateDistance = collectionWrapRect.width - collectionContentRect.width
  const translateValue = (- collectionBlockRect.top) / scrollDistance * translateDistance

  if (translateValue === 0 || translateValue === translateDistance) return;
  collectionTranslate.value = translateValue > 0 ? translateValue < translateDistance ? translateValue : translateDistance : 0
}

// collection scroll skew
const collectionSkew = ref(0)
const currentPos = ref(window.pageYOffset)

const skewAnimation = () => {
  // const collectionBlockRect = collectionBlock.value.getBoundingClientRect()
  const newPos = window.pageYOffset
  const diff = newPos - currentPos.value
  const speed = diff * 0.12

  currentPos.value = newPos
  collectionSkew.value = speed

	requestAnimationFrame(skewAnimation)
}

// news swiper
const newsModules = [Autoplay, Parallax]

// news scroll scale
const newsBlock = ref(null)
const newsContent = ref(null)

const originScale = 0.8
const newsScale = ref(originScale)
const originClipTop = window.outerWidth > 1024 ? 12 : window.outerWidth > 767 ? 15 : 20
const originClipLeft = window.outerWidth > 1024 ? 35 : window.outerWidth > 767 ? 25 : 20
const newsClipTop = ref(originClipTop)
const newsClipLeft = ref(originClipLeft)

const setNewsScale = () => {
  const newsBlockRect = newsBlock.value.getBoundingClientRect()
  const newsContentRect = newsContent.value.getBoundingClientRect()
  const scrollDistance = newsBlockRect.height - newsContentRect.height
  // scale
  const scaleDiff = 1 - originScale
  const scaleValue = (- newsBlockRect.top) / scrollDistance * scaleDiff
  // clip-path
  const clipTopDiff = 0 - originClipTop
  const clipLeftDiff = 0 - originClipLeft
  const clipTopValue = (- newsBlockRect.top) / scrollDistance * clipTopDiff
  const clipLeftValue = (- newsBlockRect.top) / scrollDistance * clipLeftDiff

  if (scaleValue === 0 || scaleValue === scaleDiff) return;

  newsScale.value = originScale + (scaleValue > 0 ? scaleValue < scaleDiff ? scaleValue : scaleDiff : 0)
  // console.log(clipTopValue, clipLeftValue)
  newsClipTop.value = originClipTop + (clipTopValue < 0 ? clipTopValue > clipTopDiff ? clipTopValue : clipTopDiff : 0)
  newsClipLeft.value = originClipLeft + (clipLeftValue < 0 ? clipLeftValue > clipLeftDiff ? clipLeftValue : clipLeftDiff : 0)
}


// gasp animation
const useGsap = () => {
  ScrollTrigger.matchMedia({
    // desktop animation
    "(min-width: 768px)": function() {
      // banner term
      gsap.to('.banner-block .block-term', {
        x: 100,
        scrollTrigger: {
          trigger: '.banner-block .block-term',
          start: 'top 20%',
          end: '300 top',
          scrub: true
        }
      })
      // collection term
      gsap.to('.collection-block .block-term', {
        x: '10vw',
        scrollTrigger: {
          trigger: '.collection-block .block-term',
          start: 'top bottom',
          end: 'bottom bottom',
          endTrigger: '.collection-block',
          scrub: true
        }
      })
    },
    // mobile animation
    "(max-width: 767px)": function() {
      // banner term
      gsap.to('.banner-block .block-term', {
        y: -100,
        scrollTrigger: {
          trigger: '.banner-block .block-term',
          start: 'top 20%',
          end: '300 top',
          scrub: true
        }
      })
    },
    "all": function() {
      gsap.to('.news-block .block-term', {
        y: '15vh',
        scrollTrigger: {
          trigger: '.news-block .block-term',
          start: 'top bottom',
          end: 'bottom bottom',
          endTrigger: '.news-block',
          scrub: true
        }
      })
    }
  })
}

// cotton animation
const useCotton = () => {
  new Cotton('.cursor-wrapper .text-content', {
    speed: 0.1,
    models: '[data-curosr-text]',
    centerMouse: false,
    on: {
      enterModel(cursor, model) {
        const text = model.getAttribute('data-curosr-text')
        cursor.textContent = text
        cursor.classList.add('show')
      },
      leaveModel(cursor, model) {
        cursor.classList.remove('show')
      }
    }
  })
}

// onMounted hook
onMounted(() => {
  window.addEventListener('scroll', function() {
    setCollectionTranslate()
    setNewsScale()
  })
  //
  // skewAnimation()
})

</script>


<template lang="pug">
.cursor-wrapper
  .text-content

// banner-block
section.banner-block(
  v-if="data.banner"
)
  // scroll-btn
  .scroll-btn.brown
    span SCROLL
  // block-content
  .block-content
    // block-front
    .block-front
      // swiper
      swiper(
        :speed="800"
        :loop="true"
        :parallax="true"
        :modules="bannerModules"
        :navigation="{ prevEl: bannerSwiperArrowPrev, nextEl: bannerSwiperArrowNext }"
        @afterInit="bannerAfterInit"
        @slideChange="bannerSlideChange"
      )
        swiper-slide(
          v-for="(slide, key) in data.banner.content"
          :key="key"
        )
          .slide-inner(data-swiper-parallax-x="80%")
            .photo-box
              .photo
                .image
                  img(
                    :src="slide.image"
                  )
            .text-box
              p(
                v-if="slide.text"
              ) {{ slide.text }}
      // term
      .block-term
        .title(
          data-title-xl
          v-if="data.banner.title"
          v-html="data.banner.title"
        )
        .sub-title(
          data-brief-m
          v-if="data.banner.subTitle"
          v-html="data.banner.subTitle"
        )
      // swiper-tools
      .swiper-tools
        .fraction {{ fractionActiveText }} / {{ fractionTotalText }}
        .progress
          .line(
            :style="{ width: `${bannerProgress}%` }"
          )
        .swiper-arrows
          .swiper-arrow-prev(ref="bannerSwiperArrowPrev")
          .swiper-arrow-next(ref="bannerSwiperArrowNext")
    // block-back
    .block-back
      .block-term
        .title(
          data-title-xl
          v-if="data.banner.title"
          v-html="data.banner.title"
        )
        .sub-title(
          data-brief-m
          v-if="data.banner.subTitle"
          v-html="data.banner.subTitle"
        )
      // swiper-tools
      .swiper-tools
        .fraction
        .progress
          .line(
            :style="{ width: `${bannerProgress}%` }"
          )
        .swiper-arrows
          .swiper-arrow-prev
          .swiper-arrow-next

// collection-block
section.collection-block(
  v-if="data.collection"
  ref="collectionBlock"
)
  .block-content(
    ref="collectionContent"
  )
    .block-term
      .title(
        data-title-l
        v-if="data.collection.title"
        v-html="data.collection.title"
      )
      .sub-title(
        data-brief-s
        v-if="data.collection.subTitle"
        v-html="data.collection.subTitle"
      )
    .collection-wrap.space-lr(
        ref="collectionWrap"
        :style="{ transform: `translateX(-${collectionTranslate}px)` }"
      )
      .collection-inner(
        :style="{ transform: `skew(${collectionSkew}deg)` }"
      )
        a.each-collection(
          v-for="(item, key) in data.collection.content"
          :key="key"
          :class="[`${item.direction}-${item.size}`, `pos-${item.position}`]"
          :href="item.href"
          :data-curosr-text="item.text"
        )
          .photo
            .image.front
              img(
                :src="item.imageFront"
              )
            .image.back
              img(
                :src="item.imageBack"
              )

// news-block
section.news-block(
  v-if="data.news"
  ref="newsBlock"
)
  .block-content(
    ref="newsContent"
  )
    .news-wrap
      .block-front(
        :style="{ 'clip-path': `inset(${newsClipTop}% ${newsClipLeft}%)` }"
      )
        // block-term
        .block-term
          .title(
            data-title-l
            v-if="data.news.title"
            v-html="data.news.title"
          )
          .sub-title(
            data-brief-s
            v-if="data.news.subTitle"
            v-html="data.news.subTitle"
          )
        // swiper
        swiper(
          :speed="800"
          :loop="true"
          :parallax="true"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :modules="newsModules"
          :style="{ transform: `scale(${newsScale})` }"
        )
          swiper-slide(
            v-for="(slide, key) in data.news.content"
            :key="key"
          )
            a.slide-inner(
              :href="slide.href"
            )
              .photo-box(data-swiper-parallax-x="80%")
                .photo
                  .image
                    img(
                      :src="slide.image"
                    )
              .text-box
                .title(
                  data-title-s
                  v-if="slide.title"
                ) {{ slide.title }}
                p(
                  data-brief-s
                  v-if="slide.text"
                ) {{ slide.text }}
      .block-back
        // block-term
        .block-term
          .title(
            data-title-l
            v-if="data.news.title"
            v-html="data.news.title"
          )
          .sub-title(
            data-brief-s
            v-if="data.news.subTitle"
            v-html="data.news.subTitle"
          )

// product-block
section.product-block(
  v-if="data.product"
)
  // block-term
  .block-term
    .title(
      data-title-l
      v-if="data.product.title"
      v-html="data.product.title"
    )
    .sub-title(
      data-brief-s
      v-if="data.product.subTitle"
      v-html="data.product.subTitle"
    )
  .block-content
    swiper(
      :speed="800"
      :loop="true"
      :slidesPerView="2"
      :parallax="true"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
    )
      swiper-slide(
        
      )

</template>


<style lang="sass">
@import './../../assets/sass/mixins'
// cursor-wrapper
.cursor-wrapper
  position: fixed
  z-index: 99
  top: 0
  left: 0
  right: 0
  bottom: 0
  pointer-events: none
  .text-content
    position: fixed
    top: 10px
    left: 15px
    color: #fff
    font-size: px(18)
    line-height: 1.5
    opacity: 0
    transition: opacity .2s
    &.show
      opacity: 1

// common
.block-term
  .sub-title
    margin-top: 15px
    +rwdmax(767)
      margin-top: 10px

// banner-block
.banner-block
  position: relative
  width: 100%
  padding: min(10vh, 100px) 100px
  overflow: hidden
  +rwdmax(1200)
    padding-left: 0
    padding-top: min(10vh, 80px)
  +rwdmax(767)
    padding-top: 0
    padding-bottom: 0
    padding-right: 0
  .scroll-btn
    position: absolute
    right: 4.5%
    bottom: 20px
    +rwdmax(1024)
      display: none
  .block-content
    position: relative
    width: 80%
    max-width: 1280px
    +rwdmax(1200)
      width: 100%
  .block-front
    position: relative
    z-index: 1
    overflow: hidden
    .block-term
      .title, .sub-title
        color: var(--white-color)
  .block-back
    z-index: -1
    +posFill
    .block-term
      .title, .sub-title
        color: var(--main-color)
    .progress
      .line
        background-color: var(--main-color)
  .swiper
    z-index: 1
    .swiper-wrapper
      transition-timing-function: var(--transition-timing)
    .swiper-slide
      overflow: hidden
      &.swiper-slide-active, &.swiper-slide-duplicate-active
        .image
          filter: grayscale(0)
          transform: scale(1)
          transition: filter var(--transition-l) .2s, transform 2.5s var(--transition-timing)
    .slide-inner
      position: relative
      width: 100%
      transition-timing-function: var(--transition-timing)
    .photo
      position: relative
      width: 100%
      height: 80vh
      min-height: 500px
      max-height: 950px
      +rwdmax(767)
        height: 100vh
    .image
      filter: grayscale(1)
      transform: scale(1.1)
      transition: filter 0s var(--transition-l), transform 0s var(--transition-l)
    .text-box
      position: absolute
      left: 20%
      bottom: 10%
  .block-term
    position: absolute
    z-index: 2
    top: 10vh
    right: -15%
    max-width: 800px
    text-align: right
    +rwdmax(1200)
      right: -5%
    +rwdmax(767)
      top: 20vh
      left: 20px
      right: auto
      text-align: left
    .sub-title
      margin-top: 40px
      +rwdmax(767)
        margin-top: 30px
  .swiper-tools
    position: absolute
    z-index: 2
    right: -15%
    bottom: 50px
    +rwdmax(1200)
      right: -5%
    +rwdmax(767)
      left: 20px
      right: auto
  .fraction
    font-size: px(16)
    margin-bottom: 20px
  .progress
    position: relative
    width: 250px
    height: 1px
    background-color: var(--black-color)
    margin-bottom: 40px
    .line
      position: absolute
      top: 0
      left: 0
      width: 0
      height: 1px
      background-color: var(--white-color)

// collection-block
.collection-block
  height: 250vh
  .block-content
    position: sticky
    top: 0
    left: 0
    width: 100%
    display: flex
    align-items: center
    height: 100vh
    padding-top: 10vh
    padding-bottom: 10vh
    overflow: hidden
    +rwdmax(1024)
      +rwdLand
        padding-top: 10vh
      +rwdPort
        padding-top: 25vh
  .block-term
    position: absolute
    z-index: 2
    top: 5vh
    left: 20px
    max-width: 350px
    +rwdmax(1024)
      +rwdLand
        top: 5vh
      +rwdPort
        top: 7vh
    +rwdmax(767)
      max-width: 250px
  .collection-wrap
    position: relative
    z-index: 1
    height: 100%
  .collection-inner
    height: 100%
    display: flex
    align-items: flex-start
  .each-collection
    display: block
    &:hover
      .image
        &.front
          transform: scale(2, 1) skew(-5deg)
          opacity: 0
          filter: blur(5px)
        &.back
          transform: scale(1, 1) skew(0)
          opacity: 1
          filter: blur(0)
    &:not(:last-child)
      margin-right: 100px
    &.vert-l
      height: 85%
      .photo
        height: 100%
        aspect-ratio: 3 /4
    &.vert-m
      height: 65%
      .photo
        height: 100%
        aspect-ratio: 3 /4
    &.vert-s
      height: 50%
      .photo
        height: 100%
        aspect-ratio: 3 /4
    &.hori-l
      height: 80%
      .photo
        height: 100%
        aspect-ratio: 4 / 3
    &.hori-m
      height: 60%
      .photo
        height: 100%
        aspect-ratio: 4 / 3
    &.hori-s
      height: 40%
      .photo
        height: 100%
        aspect-ratio: 4 / 3
    &.pos-top
      align-self: flex-start
    &.pos-subtop
      align-self: flex-start
      transform: translateY(50px)
    &.pos-center
      align-self: center
    &.pos-subbot
      align-self: flex-end
      transform: translateY(-50px)
    &.pos-bot
      align-self: flex-end
    .photo
      position: relative
      overflow: hidden
    .image
      transition: opacity var(--transition-m) var(--transition-timing), filter var(--transition-m) var(--transition-timing), transform var(--transition-l) var(--transition-timing), filter
      &.front
        z-index: 1
      &.back
        z-index: -1
        transform: scale(2, 1) skew(-5deg)
        opacity: 0
        filter: blur(5px)

// news-block
.news-block
  height: 200vh
  .block-content
    position: sticky
    top: 0
    left: 0
    width: 100%
    padding: 10vh 100px
    +rwdmax(1024)
      padding: 10vh 60px
    +rwdmax(767)
      padding: 10vh 0
  .news-wrap
    position: relative
    max-width: 1400px
    margin: auto
  .block-front
    position: relative
    z-index: 1
    .block-term
      .title, .sub-title
        color: var(--white-color)
      .sub-title
        opacity: 0.7
  .block-back
    z-index: -1
    +posFill
  .block-term
    position: absolute
    z-index: 2
    top: -10vh
    left: 50px
    max-width: 38%
    +rwdmax(767)
      left: 20px
      max-width: 300px
  .swiper
    position: relative
    z-index: 1
    &::before
      z-index: 2
      background-image: linear-gradient(175deg, rgba(0, 0, 0, .4) 0, rgba(0, 0, 0, 0) 45%, rgba(0, 0, 0, 0) 100%)
      pointer-events: none
      +posFill
      +pseudo
    .swiper-wrapper
      transition-timing-function: var(--transition-timing)
    .swiper-slide
      overflow: hidden
      &.swiper-slide-duplicate-active, &.swiper-slide-active
        .text-box
          opacity: 1
          transform: translate(0)
          transition: var(--transition-m) .7s
    .slide-inner
      position: relative
      display: block
    .photo-box
      transition-timing-function: var(--transition-timing)
    .photo
      position: relative
      width: 100%
      height: 80vh
      min-height: 500px
      max-height: 950px
    .text-box
      position: absolute
      right: 50px
      bottom: 10%
      text-align: right
      opacity: 0
      transform: translateY(50px)
      transition: 0s .8s
      .title
        color: var(--sec-color)
      p
        margin-top: 10px
        line-height: 1.8
        color: #ccc
        +ellipsis

</style>