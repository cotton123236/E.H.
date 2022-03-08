<script setup>
import { storeToRefs } from 'pinia'
import { useFrontendStore } from '../store/store'

const store = useFrontendStore()

const { pages } = storeToRefs(store)
</script>


<template lang="pug">
header
  .container
    nav
      router-link(
        v-for ="page in pages"
        to="/"
      )
        | {{ page }}
    .menu-btn
      .icon
        svg(xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 20 20")
          <polygon class="cls-1" points="9 0 0 15.73 18 15.73 9 0"/>
      .text
        | Menu
</template>


<style lang="sass">
@keyframes menuIcon
  0%
    stroke-dashoffset: 11
  50%
    stroke-dashoffset: -99
  100%
    stroke-dashoffset: -99

header
  position: absolute
  z-index: 9
  top: 0
  left: 0
  width: 100%
  padding: 30px 80px
  .container
    display: flex
    align-items: center
    justify-content: space-between
  .menu-btn
    display: flex
    align-items: center
    cursor: pointer
    .icon
      width: 25px
      margin-right: 5px
      svg
        width: 100%
        stroke: #333
        stroke-width: .5
        fill: none
        stroke-dasharray: 55
        stroke-dashoffset: 11
        animation: menuIcon 6s infinite var(--transition-timing)
        polygon
          transform: translateY(2px)
</style>