import { makeAutoObservable, runInAction } from "mobx";

interface Product {
    id: number;
    title: string;
    price: number;
    price: number;
    category: string;
    images: string[];
    description: string;
}

class StoreLimit {
    products: Product[] = [];
    productForSet: Product[] = [];
    cart: {product: Product; quantity: number }[] = [];
    offset: number = 0;
    limit: number = 4;
    error: string | null = null;
    searchQuery: string = "";
    selectedCategory: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    fetchProducts = async () => {
    try {
        const res = fetch(`https://dummyjson.com/products?limit=100`);
        if(!res.ok) {
            throw new Error("Failed to fetch products");
        };
        const data = await res.json();
        runInAction(() => {
            this.products = data.products;
            this.updateFilteredProducts();
        });
    }
    catch(error: any) {
        runInAction(() => {
            this.error = error.message
        });
    }      
    };

    updateFilteredProducts = () => {
        let filteredProducts = this.products;
        if(this.searchQuery) {
            filteredProducts = filteredProducts.filter((product) => {
                product.title.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
        };
        if(this.selectedCategory) {
            filteredProducts = filteredProducts.filter((product) => product.category === this.selectedCategory );
        };
        this.productForSet = filteredProducts.slice(this.offset, this.offset * this.limit);
    }

    setSearchQuery = (query: string) => {
        this.searchQuery = query;
        this.updateFilteredProducts();
    };

    setCategory = (category: string | null) => {
        this.selectedCategory = category;
        this.updateFilteredProducts();
    };

    updatePagination = (offset: number) => {
        this.offset = offset;
        this.updateFilteredProducts();
    }

    addToCart = (product: Product) => {
        const item = this.cart.find((cartItem) => cartItem.product.id === product.id);
        if(item) {
            item.quantity += 1;
        }
        else{
            this.cart.push({product, quantity: 1})
        };
    };

    updateQuantity = (productId: number, quantity: number) => {
        const item = this.cart.find((cartItem) => cartItem.product.id === productId);
        if(item) {
            item.quantity = quantity;
        };
    };

    get totalPrice () {
        return this.cart.reduce((sum, item) => sum + item.product.price * item.quantity,0 );
    };

    changeQuantity = (id: number, newQuantity: number) => {
        const item = this.cart.find((cartItem) => cartItem.product.id === product.id);
        if(item) {
            item.quantity = newQuantity;
        };
    };

    removeFromCart = (id: number) => {
        this.cart.filter((cartItem) => cartItem.product.id !== id);
    };
};

const storeLimit = new StoreLimit();
export default storeLimit;