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
      const existingProduct = state.products
        .find(item => item.id === product.id);
      if (!existingProduct) {
        return;
      }
      existingProduct.inventory -= 1;
    },

    incrementProductInventory(state, product) {
      const existingProduct = state.products
        .find(item => item.id === product.id);
      if (!existingProduct) {
        return;
      }
      existingProduct.inventory += 1;
    },

    replenishProductInventory(state, dict) {
      const existingProduct = state.products
        .find(item => item.id === dict.item.id);
      if (!existingProduct) {
        return;
      }
      existingProduct.inventory += dict.product.quantity;
    },
  },
}