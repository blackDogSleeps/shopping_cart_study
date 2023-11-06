import Vue from 'vue'
import Vuex from 'vuex'
import shop from '../api/shop.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: { // data
    products: [],
    cart: [], // {id, quantity}
    setCheckoutStatus: null,
  },

  getters: { // computed
    availableProducts(state) {
      return state.products.filter(
        product => product.inventory > 0);
    },

    productsInCart(state) {
      return state.cart.map(cartItem => {
        const product = state.products.find(
          product => product.id === cartItem.id);
        return {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity,
        };
      });

    },

    cartTotal(state, getters) {
      let total = 0;

      getters.productsInCart.forEach(product =>
        total += product.price * product.quantity);
      
      return total.toFixed(2);
    },
  },
  
  actions: { // like 'methods'
             // Can be complex but should NEVER UPDATE THE STATE
    fetchProducts({commit}) {
      // make AJAX call
      // call setProducts() mutation
      return new Promise(
        (resolve) => {
          shop.getProducts(products => {
            commit('setProducts', products);
            resolve();
          });
        }
      );
    },

    addProductToCart(context, product) {
      if (product.inventory > 0) {
        const cartItem = context.state.cart.find(item => item.id === product.id);
        if (!cartItem) {
          // pushProductToCart
          context.commit('pushProductToCart', product.id);
        } else {
          // incrementItemQuantity
          context.commit('incrementItemQuantity', cartItem);
        }
        context.commit('decrementProductInventory', product);
      }
      // find cartItem
    },

    removeProductFromCart({ state, commit }, product) {
      commit('removeFromCart', state.cart.filter(
          (item) => item.id !== product.id
      ));

      const item = state.products.find(
        (item) => item.id === product.id); 
      
      commit(
        'replenishProductInventory',
        { item, 
          product },
        );
    },

    decreaseProductAmount({ state, commit }, product) {
      const cartItem = state.cart.find(
        (item) => item.id === product.id
      );
      const productsItem = state.products.find(
        (item) => item.id === product.id
      );
      console.log(cartItem.quantity);
      if (cartItem.quantity <= 1) {
        this.dispatch('removeProductFromCart', product);
        console.log(cartItem.quantity);
      } else {
        commit('decrementItemQuantity', cartItem);
        commit(
          'incrementProductInventory',
          productsItem,
        );
      }
      
    },

    increaseProductAmount({state, commit}, product) {
      const cartItem = state.cart.find(
        (item) => item.id === product.id
      );
      const productsItem = state.products.find(
        (item) => item.id === product.id
      );

      if (cartItem && productsItem.inventory > 0) {
        commit('incrementItemQuantity', cartItem);
        commit('decrementProductInventory', productsItem);
      }
    },

    checkout({ commit, state }) {
      shop.buyProducts(
        state.cart,
        () => {
          commit('emptyCart');
          commit('setCheckoutStatus', 'success');
        },
        () => {
          commit('setCheckoutStatus', 'failed');
        }
      );
    },
  },

  mutations: {  // should be super simple and used to UPDATE STATE ONLY
    setProducts(state, products) {
      // update the state and set the projects array
      state.products = products;
    },

    pushProductToCart(state, productId) {
      state.cart.push({ 
        id: productId, 
        quantity: 1 
      });
    },

    removeFromCart(state, refreshedCart) {
      state.cart = refreshedCart;
    },

    incrementItemQuantity(state, cartItem) {
      cartItem.quantity++;
    },

    decrementItemQuantity(state, cartItem) {
      cartItem.quantity--;
    },
    
    decrementProductInventory(state, product) {
      product.inventory--;
    },

    incrementProductInventory(state, product) {
      product.inventory++;
    },

    replenishProductInventory(state, dict) {
      dict.item.inventory += dict.product.quantity;
    },

    setCheckoutStatus(state, status) {
      state.setCheckoutStatus = status;
    },

    emptyCart(state) {
      state.cart = [];
    },
  },

  modules: {
  }
})
