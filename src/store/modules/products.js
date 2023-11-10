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
  },

  mutations: {
    setProducts(state, products) {
      // update the state and set the projects array
      state.products = products;
    },
  },
}