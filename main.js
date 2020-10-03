var eventBus = new Vue()

Vue.component('product-tabs', {
    props:{
        reviews:{
            type: Array,
            required: false
        }
    },
    template:`
        <div>
            <div>
                <!-- v-on:click = "selectedTab = tab": a click on this span will set value of selectedTab in data. -->
                <!-- v-bind:class = "{activeTab: selectedTab === tab}": apply activeTab class when it is true that selectedTab is equal to tab. -->
                <!-- For eg: When first tab is clicked, selectedTab will be 'Reviews' and the tab will be 'Reviews'. So activeTab will be applied since they're equivalent. -->

                <span class = "tab" 
                     v-for = "(tab, index) in tabs"
                     v-bind:key = "index"
                     v-on:click = "selectedTab = tab" 
                     v-bind:class = "{activeTab: selectedTab === tab}"
                >{{ tab }}</span>
            </div>

            <!-- moved here from the product component. Displays when "Reviews is clicked." -->
            <!-- reviews lives in product comp. so it needs to be sent here using props. -->

            <div v-show = "selectedTab === 'Reviews'">
                <p v-if = "!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Ratings: {{review.rating}}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>
            <div v-show = "selectedTab === 'Make a review'">
                <!-- moved here from product component.  -->
                <!-- <product-review v-on:review-submitted = "addReview"></product-review> will throw this error: Property or method "addReview" is not defined on the instance but referenced during render. -->
                <!-- product-review emits review-submitted event and that is catched here but addReview is the method in the product component and not in the product-tabs component. -->
                <!-- product-review component is a child of product-tabs component, which is a child of the product component. So, product-review is a grandchild of product. -->

                <product-review></product-review>
            </div>
        </div>
    `,
    data(){
        return{
            tabs: ['Reviews', 'Make a review'], // Will be using them as title for each tab
            selectedTab: 'Reviews' // This will be set from v-on:click
        }
    }
})

Vue.component('product-review', {
    template: `
        <!--.prevent is event modifier used to prevent page reload on submit-->

        <form class = "review-form" @submit.prevent = "onSubmit">
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
                //this.$emit('review-submitted', productReview)
                // After this we no longer need to listen for review-submitted event on the product-tabs component. So that can be removed.
                // <product-review v-on:review-submitted = "addReview"></product-review> TO <product-review></product-review>
                eventBus.$emit('review-submitted', productReview)

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
                <p v-if="inStock">In Stock</p>
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

            <product-tabs v-bind:reviews = "reviews"></product-tabs>
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
    },
    // mounted() SHOULD NOT BE PUT INSIDE methods array
    // addReview(productReview){
    //     this.reviews.push(productReview)
    // }
    //when the eventBus emits the review-submitted event, take its payload (the productReview) and push it into product's reviews array.
    // mounted is a lifecycle hook (which is a function) that is called once the component is mounted to the DOM.
    //Once product component has mounted, it will be listening for the review-submitted event.
    // mounted(){
    //     eventBus.$on('review-submitted', productReview => {
    //         this.reviews.push(productReview)
    //     })
    // }
    //arrow function syntax here because an arrow function is bound to its parent’s context. In other words, when we say this inside the function, it refers to this component/instance.
    //If no arrow, we need to manually bind the component's this to that function.
    mounted(){
        eventBus.$on('review-submitted', function(productReview) {
            debugger
            this.reviews.push(productReview)
            }.bind(this))
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