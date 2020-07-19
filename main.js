var app = new Vue({
    el: '#app',
    data:{
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
        cart: 0
    },
    methods:{
        addToCart : function(){
            this.cart++; //this refers to the data of the instance we’re currently in
        },
        updateProduct(index){
            this.selectedVariant = index;
        }
    },
    computed:{
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        }
    }
})