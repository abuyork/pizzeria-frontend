import React, { SyntheticEvent, useEffect, useState } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import PausedOrders from "./PausedOrders";

import FinishedOrders from "./FinishedOrders";
import { Order, OrderInquery } from "../../../lib/types/order";
import { setFinishedOrders, setPausedOrders, setProcessOrders } from "./slice";
import { OrderStatus } from "../../../lib/enums/order-enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import "../../../css/order.css";
import { useHistory } from "react-router-dom";
import ProcessOrders from "./ProcessedOrders";


const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});



export default function OrdersPage() {
  const [value, setValue] = useState("1");
  const {setPausedOrders, setProcessOrders, setFinishedOrders} = actionDispatch(useDispatch());
  const {orderBuilder, authMember} = useGlobals();
  const history = useHistory();
  const [orderInquiry, setOrderInquiry] = useState<OrderInquery>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  useEffect(() => {
    const order = new OrderService();

    order.getMyOrders({...orderInquiry, orderStatus: OrderStatus.PAUSE})
    .then((data) => setPausedOrders(data))
    .catch((err) => console.log(err));

    order.getMyOrders({...orderInquiry, orderStatus: OrderStatus.PROCESS})
    .then((data) => setProcessOrders(data))
    .catch((err) => console.log(err));

    order.getMyOrders({...orderInquiry, orderStatus: OrderStatus.FINISH})
    .then((data) => setFinishedOrders(data))
    .catch((err) => console.log(err));

  }, [orderInquiry, orderBuilder]);

  const handleChange = (e: SyntheticEvent, newValue: string)  => {
    setValue(newValue);
  };
    if (!authMember) history.push("/");
    return (
      <div className={"order-page"}>
        <Container className={"order-container"}>
          <Stack className={"order-left"}>
            <TabContext value={value}>
              <Box className={"order-nav-frame"}>
                <Box sx={{ borderBottom: 1, borderColor: "divider"}}>
                  <Tabs 
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className={"table_list"}
                  >
                    <Tab label="PAUSED ORDERS" value={"1"} />
                    <Tab label="PROCESS ORDERS" value={"2"} />
                    <Tab label="FINISHED ORDERS" value={"3"} />
                  </Tabs>
                </Box>
              </Box>
              <Stack className={"order-main-content"}>
                <PausedOrders setValue={setValue}/>
                <ProcessOrders setValue={setValue}/>
                <FinishedOrders />
              </Stack>
            </TabContext>
            <Box 
              sx={{ 
                padding: "20px", 
                textAlign: "center", 
                borderTop: "1px solid #e5e7eb",
                marginTop: "30px"
              }}
            >
              <Typography 
                sx={{ 
                  color: "#6b7280", 
                  fontSize: "14px", 
                  fontFamily: "'Inter', sans-serif" 
                }}
              >
                View all your orders in one place
              </Typography>
            </Box>
          </Stack>
        </Container>
      </div>
    );
  }