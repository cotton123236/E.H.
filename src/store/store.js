import { defineStore } from "pinia";

export const useFrontendStore = defineStore('frontend', {
  state: () => ({
    pages: ['HOME', 'NEWS', 'PRODUCTS', 'ABOUT'],
    activePage: 'HOME'
  })
})