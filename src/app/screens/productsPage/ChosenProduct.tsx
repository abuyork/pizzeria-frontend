import React, { useEffect } from "react";
import { Container, Stack, Box, Typography, Paper } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import StarIcon from "@mui/icons-material/Star";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PhoneIcon from "@mui/icons-material/Phone";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { FreeMode, Navigation, Thumbs, Autoplay, EffectFade } from "swiper";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setRestaurant, setChosenProduct } from "./slice";
import { createSelector } from "reselect";
import { retrieveChosenProduct, retrieveRestaurant } from "./selector";
import { Product } from "../../../lib/types/product";
import { Member } from "../../../lib/types/member";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
    setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
    setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
});

const chosenProductRetriever = createSelector(
    retrieveChosenProduct,
    (chosenProduct) => ({
        chosenProduct,
    })
);

const restaurantRetriever = createSelector(
    retrieveRestaurant,
    (restaurant) => ({
        restaurant,
    })
);

interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProductProps) {
  const { onAdd } = props;
  const { setChosenProduct, setRestaurant } = actionDispatch(useDispatch());
  const { productId } = useParams<{ productId: string }>();
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);

  useEffect(() => {
    const product = new ProductService();
    const member = new MemberService();
    product
      .getProduct(productId)
      .then((data) => {
        setChosenProduct(data);
      })
      .catch((err) => console.log(err));

    member
      .getRestaurant()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));
  }, []);

  if (!chosenProduct) return null;

  return (
    <div className="chosen-product">
      <Typography variant="h1" className="title">
      </Typography>
      <Container className="product-container">
        <Stack className="chosen-product-slider">
          <Swiper
            loop={true}
            spaceBetween={0}
            navigation={true}
            effect="fade"
            modules={[FreeMode, Navigation, Thumbs, Autoplay, EffectFade]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="swiper-area"
          >
            {chosenProduct?.productImages.map((ele: string, index: number) => {
              const imagePath = `${serverApi}/${ele}`;
              return (
                <SwiperSlide key={index}>
                  <img className="slider-image" src={imagePath} alt={`${chosenProduct.productName} view ${index + 1}`} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Stack>
        <Stack className="chosen-product-info">
          <Box className="info-box">
            <Typography variant="h2" className="product-name">
              {chosenProduct?.productName}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle1" className="resto-name">
                <StorefrontIcon sx={{ fontSize: 20, marginRight: 1 }} />
                {restaurant?.memberNick}
              </Typography>
              <Typography variant="subtitle2" className="resto-name">
                <PhoneIcon sx={{ fontSize: 20, marginRight: 1 }} />
                {restaurant?.memberPhone}
              </Typography>
            </Box>
            
            <Paper elevation={0} className="rating-box">
              <Rating 
                name="product-rating" 
                value={2.5} 
                precision={0.5} 
                readOnly
                icon={<StarIcon sx={{ color: '#f44336' }} />}
                emptyIcon={<StarIcon sx={{ color: '#ffcdd2' }} />}
              />
              <Box className="evaluation-box">
                <Box className="product-view">
                  <RemoveRedEyeIcon sx={{ mr: 1 }} />
                  <span>{chosenProduct.productViews} views</span>
                </Box>
              </Box>
            </Paper>

            <Paper elevation={0} className="product-desc">
              {chosenProduct?.productDesc
                ? chosenProduct.productDesc
                : "A delicious pizza made with fresh ingredients and baked to perfection in our wood-fired oven."}
            </Paper>

            <Paper elevation={0} className="product-price">
              <span>Price</span>
              <span>${chosenProduct?.productPrice}</span>
            </Paper>

            <Box className="button-box">
              <Button
                variant="contained"
                onClick={(e) => {
                  onAdd({
                    _id: chosenProduct._id,
                    quantity: 1,
                    name: chosenProduct.productName,
                    price: chosenProduct.productPrice,
                    image: chosenProduct.productImages[0],
                  });
                  e.stopPropagation();
                }}
                startIcon={<LocalPizzaIcon />}
              >
                Add To Basket
              </Button>
            </Box>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}