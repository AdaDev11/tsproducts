import { action, makeAutoObservable, observable } from "mobx";

class StoreLimit {
    products: Product[] = [];
    offset: number = 0;
    limit: number = 10;
    filterSearch: string = "";
    searchProducts: Product[] = [];
    minPrice: string = "";
    maxPrice: string = "";
    priceProducts: Product[] = [];
    categoriesProducts: Product[] = [];
    categoryId: string = "";
    productsForSet: Product[] = []; // Bu yerda productsForSet observable bo'lishi kerak
    error: string | null = null;

    constructor() {
        makeAutoObservable(this, {
            products: observable,
            productsForSet: observable,
            error: observable,
            fetchProducts: action,
            filterSearchFetch: action,
            setFilterSearchMobx: action,
            minPriceMobx: action,
            maxPriceMobx: action,
            fetchProductsByCategory: action,
        });
    }

    fetchProducts = async () => {
        try {
            const response = await fetch(`https://api.escuelajs.co/api/v1/products`);
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            this.productsForSet = data.products;
            console.log(this.productsForSet);
        } catch (err) {
            this.error = err instanceof Error ? err.message : "Unknown error occurred";
        }
    };

    filterSearchFetch(): void {
        fetch(`https://api.escuelajs.co/api/v1/products/?title=${this.filterSearch}`)
            .then(res => res.json())
            .then((json: Product[]) => {
                this.searchProducts = json;
            })
            .catch((error) => console.error("Search filter error:", error));
    }
}

const storeLimit = new StoreLimit();
export default storeLimit;

// import { makeAutoObservable, runInAction } from 'mobx';

// class ProductStore {
//     products: Product[] = [];
//     error: string | null = null; 
//     isLoading: boolean = false;

//     constructor() {
//         makeAutoObservable(this);
//     }

//     fetchProducts = async () => {
//         this.isLoading = true;
//         this.error = null; 
//         try {
//             const response = await fetch('https://api.escuelajs.co/api/v1/products');
            
//             if (!response.ok) { 
//                 throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
//             }
            
//             const data: Product[] = await response.json();
//             runInAction(() => {
//                 this.products = data;
//             });
//         } catch (error: any) {
//             runInAction(() => {
//                 this.error = error.message;
//             });
//         } finally {
//             runInAction(() => {
//                 this.isLoading = false;
//             });
//         }
//     };
// }

// const productStore = new ProductStore();
// export default productStore;
