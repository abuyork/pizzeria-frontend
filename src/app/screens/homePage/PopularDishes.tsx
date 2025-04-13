import React from 'react';
import { Box, Container, Stack } from '@mui/material';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import {CssVarsProvider} from '@mui/joy/styles';
import CardOverflow from '@mui/joy/CardOverflow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";

/** REDUX SLICE & SELECTOR */
const popularDishesRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) => ({ popularDishes })
);


export default function PopularDishes() {
  const {popularDishes} = useSelector(popularDishesRetriever)
  return (
    <div className="popular-dishes-frame">
      <Container>
        <Stack className="popular-section">
          <Box className="category-title">Popular Dishes</Box>
          <Stack className="cards-frame">
          {popularDishes.length !== 0 ? ( 
            popularDishes.map((product:Product) => {
              const imagePath = `${serverApi}/${product.productImages[0]}`
              return (
                <CssVarsProvider key={product._id}>
                  <Card className="card">
                    <CardCover>
                      <img 
                        src={imagePath} 
                        alt={product.productName} 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = 'none';
                        }}
                      />
                    </CardCover>
                    <CardCover className="card-cover" />
                    <CardContent sx={{ justifyContent: 'flex-end' }}>
                      <Stack flexDirection="row" justifyContent="space-between">
                        <Typography
                          level="h2"
                          fontSize="lg"
                          textColor="#fff"
                          mb={1}
                          sx={{ 
                            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                            fontWeight: 'bold'
                          }}
                        >
                          {product.productName}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 'md',
                            color: '#fff',
                            alignItems: 'center',
                            display: 'flex',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                          }}
                        >
                          {product.productViews}
                          <VisibilityIcon
                            sx={{ fontSize: 20, marginLeft: '5px' }}
                          />
                        </Typography>
                      </Stack>
                      {product.productPrice && (
                        <Typography
                          level="body-sm"
                          textColor="#fff"
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                          }}
                        >
                          <AttachMoneyIcon sx={{ fontSize: 16, marginRight: '2px' }} />
                          {product.productPrice}
                        </Typography>
                      )}
                    </CardContent>
                    <CardOverflow
                      sx={{
                        display: 'flex',
                        gap: 1.5,
                        py: 1.5,
                        px: 'var(--Card-padding)',
                        borderTop: '1px solid',
                        borderColor: 'rgba(215, 182, 134, 0.3)',
                        height: '60px',
                        background: 'rgba(255, 255, 255, 0.95)'
                      }}
                    >
                      <Typography
                        startDecorator={<DescriptionOutlinedIcon sx={{ color: '#d7b686' }} />}
                        textColor="#343434"
                        sx={{
                          fontSize: '0.875rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                       {product.productDesc || 'Delicious dish made with finest ingredients'}
                      </Typography>
                    </CardOverflow>
                  </Card>
                </CssVarsProvider>
              );
            })
        ) : (
            <Box className="no-data"> Popular products are not available!</Box>

        )}
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
