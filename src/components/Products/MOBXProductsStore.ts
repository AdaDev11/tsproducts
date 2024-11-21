import { makeAutoObservable, runInAction } from "mobx";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  images: string[];
  description: string;
}

class StoreLimit {
  products: Product[] = [];
  cart: { product: Product; quantity: number }[] = [];
  currentPage: number = 1;
  limit: number = 4;
  offset: number = 0;
  totalProducts: number = 0;
  totalPages: number = 0;
  error: string | null = null;
  searchQuery: string = "";
  selectedCategory: string | null = null;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  fetchProducts = async () => {
    this.isLoading = true;
    try {
      const response = await fetch(
        `https://dummyjson.com/products?limit=${this.limit}&skip=${this.offset}&select=title,price,category,images,description`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      runInAction(() => {
        this.products = data.products;
        this.totalProducts = data.total;
        this.totalPages = Math.ceil(this.totalProducts / this.limit);
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
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
    this.fetchProducts();
  };

  setCategory = (category: string | null) => {
    this.selectedCategory = category;
    this.fetchProducts();
  };

  updatePagination = (page: number) => {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.offset = (page - 1) * this.limit;
      this.fetchProducts();
    }
  };
  
  addToCart = (product: Product) => {
    const item = this.cart.find((cartItem) => cartItem.product.id === product.id);
    if (item) {
      item.quantity += 1;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
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
      const item = this.cart.find((cartItem) => cartItem.product.id === id);
      if(item) {
          item.quantity = newQuantity;
      };
  };

  removeFromCart = (id: number) => {
      this.cart = this.cart.filter((cartItem) => cartItem.product.id !== id);
  };

  clearCart() {
    this.cart = [];
  }
  


  get productsForSet() {
    return this.products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }
  }

const storeLimit = new StoreLimit();
export default storeLimit;
