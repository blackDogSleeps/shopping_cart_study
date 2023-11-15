<template>
  <div>
    <h1>Product List</h1>
    <img
      v-if="loading"
      src="https://i.imgur.com/JfPpwOA.gif">
    <ul v-else>
      <li
        v-for="product in products"
        :key="product.id">
        {{ product.title }} - {{ product.price | currency }}
        <br> In stock: 
        <b>
          {{ product.inventory }}
        </b>
        <button
          :disabled="!product.isInStock"
          @click="addProductToCart(product)"  
        >Add to cart</button>
      </li>
    </ul>
  </div>
  
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      loading: false,
    }
  },
   
  computed: {
    ...mapState({
      products: state => {
        return state.products.products
          .map(product => ({
            ...product,
            isInStock: product.inventory > 0,
          })
          ) 
      },
    }),
  },

  methods: {
    ...mapActions({
      fetchProducts: 'products/fetchProducts',
      addProductToCart: 'cart/addProductToCart',
    }),
  },
  
  created() {
    this.loading = true;
    this.fetchProducts()
      .then(() => this.loading = false);
  }
}
</script>
