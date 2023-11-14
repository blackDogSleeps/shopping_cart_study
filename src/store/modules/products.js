import shop from '../../api/shop'

export default {
  namespaced: true,

  state: {
    products: [],
  },

  getters: {
    availableProducts(state) {
      return state.products;
    },
  },

  actions: {
    fetchProducts({ commit }) {
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

    isInStock({getters}, product) {
      return getters.availableProducts
        .find(item => item.id === product.id).inventory === 0;
    }
  },

  mutations: {
    setProducts(state, products) {
      // update the state and set the projects array
      state.products = products;
    },

    decrementProductInventory(state, product) {
      state.products
        .find(item => item.id === product.id)
          .inventory--;
    },

    incrementProductInventory(state, product) {
      state.products
        .find(item => item.id === product.id)
          .inventory++;
    },

    replenishProductInventory(state, dict) {
      state.products
        .find(item => item.id === dict.item.id)
          .inventory += dict.product.quantity;
    },
  },
}