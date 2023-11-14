<template>
  <div>
    <h1>Shopping Cart</h1>
    <ul>
      <li
        v-for="product in products"
        :key="product.id"
      >
        {{ product.title }} — {{ product.price | currency }} — {{ product.quantity }}
        <button
          @click="decreaseProductAmount(product)"
          class="btn">-</button>
        <button
          :disabled="!inStock(product)"
          @click="increaseProductAmount(product)"
          class="btn">+</button>
        <button
          class="btn"
          @click="removeProductFromCart(product)"
        >Remove</button>
      </li>
    </ul>
    <p>
      Total: {{ cartTotal | currency }}
    </p>
    <button
      v-if="!cartIsEmpty"
      @click="checkout"
    >
      Checkout
    </button>
    <p v-if="checkoutStatus">
      {{ checkoutStatus }}
    </p>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters('cart', {
      products: 'productsInCart',
      cartTotal: 'cartTotal',
    }),

    ...mapGetters('products', {
      availableProducts: 'availableProducts',  
    }),
    
    ...mapState({
      cart: state => state.cart.cart,
      checkoutStatus: state => state.cart.checkoutStatus,
    }),

    cartIsEmpty() {
      return this.cart.length < 1;
    },
  },

  methods: {
    ...mapActions('cart', {
      checkout: 'checkout',
      decreaseProductAmount: 'decreaseProductAmount',
      increaseProductAmount: 'increaseProductAmount',
      removeProductFromCart: 'removeProductFromCart',
    }),

    inStock(product) {
      const cartItem = this.availableProducts.find(
        item => item.id === product.id
      );
      return cartItem.inventory > 0;
    },
  },
}

</script>

<style lang="css">
.btn {
  margin-right: 5px;
  margin-right: 5px;
}
</style>