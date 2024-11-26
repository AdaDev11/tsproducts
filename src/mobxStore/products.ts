    // const fetchProducts = async (offset, limit) => {
    //   try {
    //     const response = await fetch(`https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${limit}`);
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch products");
    //     }
    //     const data = await response.json();
    //     setProducts(data);
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };