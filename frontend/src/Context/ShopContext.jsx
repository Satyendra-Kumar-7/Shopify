import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () =>{
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
    }
    return cart;
}
const ShopContextProvider = (props) => {
    const[all_product,setAll_Product] =useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());
    
    useEffect(() => {
        // Fetch all products
        fetch('http://localhost:4000/allproducts')
            .then((response) => response.json())
            .then((data) => setAll_Product(data))
            .catch((error) => console.error('Error fetching products:', error));
    
        // Fetch cart data if auth token exists
        const authToken = localStorage.getItem('auth-token');
        if (authToken) {
            fetch('http://localhost:4000/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/formdata',
                    'auth-token': authToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}), // Empty body for POST request
            })
            .then((response) => response.json())
            .then((data) => setCartItems(data))
            .catch((error) => console.error('Error fetching cart:', error));
        }
    }, []);
    
    const addToCart = (itemId)=>{
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]+1}))
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/addtocart',{
                method:'POST',
                headers:{
                    Accept:'application/formdata',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    itemId :itemId
            })
        })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1 // Decrement the count of the item in local state
        }));
    
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/formdata',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId: itemId
                })
            })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error('Error removing item from cart:', error)); // Add error handling
        }
    };
    

    const getTotalCartAmount = () =>{
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo = all_product.find((product)=>product.id===Number(item))
                totalAmount += itemInfo.new_price * cartItems[item];
            }
        }
        return totalAmount;
    }
    const getTotalCartItems = () =>{
        let totalItem = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totalItem+=cartItems[item];
            }
        }
        return totalItem;
    }

    const contextValue = {getTotalCartItems, getTotalCartAmount, all_product, cartItems,addToCart, removeFromCart};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>   
    );
};

export default ShopContextProvider;


