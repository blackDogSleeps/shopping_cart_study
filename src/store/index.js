import Vue from 'vue'
import Vuex from 'vuex'
import cart from './modules/cart'
import products from './modules/products'


Vue.use(Vuex)

export default new Vuex.Store({
  state: { // data // {id, quantity}
    checkoutStatus: cart.checkoutStatus,
  },
  
  modules: {
    cart,
    products,
  },
})
