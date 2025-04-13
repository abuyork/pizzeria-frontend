import { Route, Switch, useRouteMatch } from "react-router-dom";
import ChosenProduct from "./ChosenProduct";
import Products from "./Products";
import { CartItem } from "../../../lib/types/search";
import "../../../css/products.css"


interface ProductsPageProps{
  onAdd: (item: CartItem) => void
}

export default function ProductsPage(props: ProductsPageProps) {
  const {onAdd} = props
  const products = useRouteMatch();
  console.log("products:", products);

  return (
    <div className="products-page">
      <Switch>
        <Route path={`${products.path}/:productId`}>
          <ChosenProduct  onAdd={onAdd} />
        </Route>
        <Route path={`${products.path}`}>
          <Products onAdd={onAdd} />
        </Route>
      </Switch>

    </div>

    
  );
}
