import PopularDishes from "./PopularDishes";
import NewDishes from "./NewDishes";
import Advertisement from "./Advertisement";
import { useDispatch} from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setNewDishes, setPopularDishes } from "./slice";
import { Product } from "../../../lib/types/product";
import { useEffect } from "react";
import { ProductCollection } from "../../../lib/enums/product-enum";
import ProductService from "../../services/ProductService"
import '../../../css/home.css'

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
  setNewDishes: (data: Product[]) => dispatch(setNewDishes(data)),
});


export default function HomePage() {
  const { setPopularDishes, setNewDishes } = actionDispatch(useDispatch());

useEffect(() => {
    // Backend server data fetch => Data
    const product = new ProductService();
    product
        .getProducts({
            page: 1,
            limit: 4,
            order: "productViews",
            productCollection: ProductCollection.DISH,
        })
        .then((data) => {
            setPopularDishes(data);
        })
        .catch((err) => console.log(err));

    product
        .getProducts({
            page: 1,
            limit: 4,
            order: "createdAt",
        })
        .then((data) => setNewDishes(data))
        .catch((err) => console.log(err));
    
}, [setPopularDishes, setNewDishes]);



  return (
    <div className="homepage">
      <PopularDishes />
      <NewDishes />
      <Advertisement />
    </div>
  );
}
