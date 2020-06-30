var app = new Vue({
    el: '#app',
    data:{
        product: 'Socks',
        image: './assets/vmSocks-green-onWhite.jpg',
        altText: 'A pair of socks',
        inventory: 8,
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        variants:[
            {
                variantId: 2234,
                variantColor: "green",
                variantImage: "./assets/vmSocks-green-onWhite.jpg"
            },
            {
                variantId: 2235,
                variantColor: "blue",
                variantImage: "./assets/vmSocks-blue-onWhite.jpg"
            }
        ],
        cart: 0
    },
    methods:{
        addToCart : function(){
            this.cart++; //this refers to the data of the instance we’re currently in
        },
        changeSocksColor : function(variantImage){
            this.image = variantImage;
        }
    }
})