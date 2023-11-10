import shop from '../../api/shop'

export default {
  namespaced: true,

  state: {
    cart: [],
    checkoutStatus: null,
  },

  getters: {
    productsInCart(state, getters, rootState) {
      return state.cart.map(cartItem => {
        const product = rootState.products.products.find(
          product => product.id === cartItem.id);
        return {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity,
        };
      });
    },

    productInStock() {
      return (product) => {
        return product.inventory > 0;
      };
    },

    cartTotal(state, getters) {
      let total = 0;

      getters.productsInCart.forEach(product =>
        total += product.price * product.quantity);
      
      return total.toFixed(2);
    },
  },

  actions: {
    addProductToCart({ state, commit, getters }, product) {
      if (getters.productInStock(product)) {
        const cartItem = state.cart.find(item => item.id === product.id);
        if (!cartItem) {
          commit('pushProductToCart', product.id);
        } else {
          commit('incrementItemQuantity', cartItem);
        }
        commit('decrementProductInventory', product);
      }
    },

    removeProductFromCart({ state, commit, rootState }, product) {
      commit('removeFromCart', state.cart.filter(
          (item) => item.id !== product.id
      ));

      const item = rootState.products.products.find(
        (item) => item.id === product.id); 
      
      commit(
        'replenishProductInventory',
        { item, 
          product },
        );
    },

    decreaseProductAmount({ state, commit, rootState }, product) {
      const cartItem = state.cart.find(
        (item) => item.id === product.id
      );
      const productsItem = rootState.products.products.find(
        (item) => item.id === product.id
      );
      if (cartItem.quantity <= 1) {
        this.dispatch('cart/removeProductFromCart', product);
      } else {
        commit('decrementItemQuantity', cartItem);
        commit(
          'incrementProductInventory',
          productsItem,
        );
      }
      
    },

    increaseProductAmount({state, commit, getters, rootState}, product) {
      const cartItem = state.cart.find(
        (item) => item.id === product.id
      );
      const productsItem = rootState.products.products.find(
        (item) => item.id === product.id
      );

      if (cartItem && getters.productInStock(productsItem)) {
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

  mutations: {
    pushProductToCart(state, productId) {
      state.cart.push({ 
        id: productId, 
        quantity: 1 
      });
    },

    decrementItemQuantity(state, cartItem) {
      cartItem.quantity--;
    },

    incrementItemQuantity(state, cartItem) {
      cartItem.quantity++;
    },

    replenishProductInventory(state, dict) {
      dict.item.inventory += dict.product.quantity;
    },

    decrementProductInventory(state, product) {
      product.inventory--;
    },

    incrementProductInventory(state, product) {
      product.inventory++;
    },

    removeFromCart(state, refreshedCart) {
      state.cart = refreshedCart;
    },

    emptyCart(state) {
      state.cart = [];
    },

    setCheckoutStatus(state, status) {
      state.checkoutStatus = status;
    },

  },


}