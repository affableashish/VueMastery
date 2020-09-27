Vue.component('product-review', {
    template: `
        <form class = "review-form" @submit.prevent = "onSubmit"> <!--.prevent is event modifier used to prevent page reload on submit-->
            <p class = "error" v-if = "errors.length">
                <i>Please correct the following errors:</i>
                <ul>
                    <li v-for = "error in errors">{{ error }}</li>
                </ul>
            </p>
        
            <p>
                <label for = "name">Name:</label>
                <input id = "name" v-model = "name" placeholder = "Name">
            </p>
            <p>
                <label for = "review">Review:</label>
                <textarea id = "review" v-model = "review"></textarea>
            </p>

            <p>
                <label for = "rating">Rating:</label>
                <select id = "rating" v-model.number = "rating"> <!--ensures data is converted to integer vs. a string-->>
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            <p>
                <input type = "submit" value = "Submit">
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = []
            if(this.name && this.review && this.rating){
                let productReview = {
                    name : this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } 
            else {
                if(!this.name) this.errors.push("Name required.") // Means if name data is empty push msg to errors array.
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }
    }
})
//Simple example with if() with null
// if(!null)  // this.name or this.review or this.rating can equal null in that else block.
//   console.log("yep")
// else
//     console.log("nope")
// => Outputs "yep"

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
            <div>
                <h2>Reviews</h2>
                <p v-if = "!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Ratings: {{review.rating}}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>
            <product-review v-on:review-submitted = "addReview"></product-review>
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
            ],
            reviews: []
        }
    },
    methods: {
        addToCart : function(){
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index){ // index is 0, 1. NOT 2234, 2235 etc.
            this.selectedVariant = index;
        },
        addReview(productReview){
            this.reviews.push(productReview)
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
        cart: []
    },
    methods:{
        updateCart : function(id){
            this.cart.push(id);
        }
    }
})