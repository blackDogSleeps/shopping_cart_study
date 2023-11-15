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
        .find(item => item.id === dict.productInStock.id);
      if (!existingProduct) {
        return;
      }
      existingProduct.inventory += dict.productToRemove.quantity;
    },
  },
}