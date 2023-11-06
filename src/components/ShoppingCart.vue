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
          @click="$store.dispatch(
            'decreaseProductAmount',
            product)"
          class="btn">-</button>
        <button
          @click="$store.dispatch(
            'increaseProductAmount',
            product)"
          class="btn">+</button>
        <button
          class="btn"
          @click="$store.dispatch(
            'removeProductFromCart',
            product)"
        >Remove</button>
      </li>
    </ul>
    <p>
      Total: {{ cartTotal | currency }}
    </p>
    <button
      v-if="!cartIsEmpty"
      @click="$store.dispatch('checkout')"
    >
      Checkout
    </button>
    <p v-if="$store.state.setCheckoutStatus">
      {{ $store.state.setCheckoutStatus }}
    </p>
  </div>
</template>

<script>
export default {
  computed: {
    products() {
      return this.$store.getters.productsInCart;
    },

    cartIsEmpty() {
      return this.$store.state.cart.length < 1;
    },

    cartTotal() {
      return this.$store.getters.cartTotal;
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