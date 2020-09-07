Vue.component('product', {
    props: {
        premium: {          //Product component is expected to receive this
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image" :alt="altText"/>
            </div>
            <div class="product-info">
                <h1>{{ product }}</h1>
                <p v-if="inventory > 10">In Stock</p>
                <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
                <p v-else>Out of stock</p>
                <p>Shipping: {{ shipping }}</p>
                <ul>
                    <li v-for="detail in details"> {{ detail }}</li>
                </ul>

                <div class="color-box"
                    v-for="(variant, index) in variants"
                    v-bind:key="variant.variantId"
                    v-bind:style="{ backgroundColor: variant.variantColor }"
                    v-on:mouseover="updateProduct(index)"
                >
                </div>
                <button v-on:click="addToCart"
                        v-bind:disabled="!inStock"
                        v-bind:class="{ disabledButton: !inStock }"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    `,
    data() {                                // returns a fresh data object for each component
        return {
            product: 'Socks',
            selectedVariant: 0,
            altText: 'A pair of socks',
            inventory: 8,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants:[
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ]
        }
    },
    methods: {
        addToCart : function(){
            this.$emit('add-to-cart');
        },
        updateProduct(index){ // index is 0, 1. NOT 2234, 2235 etc.
            this.selectedVariant = index;
        }
    },
    computed:{
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            let abc = this.variants[this.selectedVariant].variantQuantity; // returns quantity eg: 10 or 0 here.
            return abc;
        },
        shipping(){
            if(this.premium){
                return "You get free shipping"
            } else{
                return "2.99"
            }
        }
    }
})

var app = new Vue({
    el: '#app', // Plugging into an element in the DOM
    data: {
        premium: true,
        cart: 0
    },
    methods:{
        updateCart : function(){
            this.cart++;
        }
    }
})