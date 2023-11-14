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

    cartTotal(state, getters) {
      let total = 0;

      getters.productsInCart.forEach(product =>
        total += product.price * product.quantity);
      
      return total.toFixed(2);
    },
  },

  actions: {
    addProductToCart({ state, commit, rootState }, product) {
      if (product.inventory > 0) {
        const cartItem = state.cart.find(item => item.id === product.id);
        if (!cartItem) {
          commit('pushProductToCart', product.id);
        } else {
          commit('incrementItemQuantity', cartItem);
        }
        const existingProduct = rootState.products.products
          .find(item => item.id === product.id);
        
          if (existingProduct.inventory > 0) {
          commit(
            'products/decrementProductInventory', 
            existingProduct,
            { root: true }); 
        }
        
      }
    },

    removeProductFromCart({ state, commit, rootState }, product) {
      commit('removeFromCart', state.cart.filter(
          (item) => item.id !== product.id
      ));

      const item = rootState.products.products.find(
        (item) => item.id === product.id); 
      
      commit(
        'products/replenishProductInventory',
        { item, product },
        { root: true }
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
        commit(
          'decrementItemQuantity', 
          cartItem);
        commit(
          'products/incrementProductInventory',
          productsItem,
          { root: true }
        );
      }
      
    },

    increaseProductAmount({state, commit, rootState}, product) {
      const cartItem = state.cart.find(
        (item) => item.id === product.id
      );
      const productsItem = rootState.products.products.find(
        (item) => item.id === product.id
      );

      if (cartItem && productsItem.inventory > 0) {
        commit(
          'incrementItemQuantity', 
          cartItem,);
        commit(
          'products/decrementProductInventory', 
          productsItem,
          { root: true });
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
      state.cart.find(item => item.id === cartItem.id).quantity--;
    },

    incrementItemQuantity(state, cartItem) {
      state.cart.find(item => item.id === cartItem.id).quantity++;
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