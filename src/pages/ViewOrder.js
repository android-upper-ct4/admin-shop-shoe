import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getOrderByUser, getOrders } from "../features/auth/authSlice";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import HeaderCommon from "../components/HeaderCommon";
import { getOrderByIdApi } from "../api/order.api";
import moment from "moment/moment";

const ViewOrder = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const orderId = params.id;

  const [orderDetail, setOrderDetail] = useState(null);
  console.log("orderDetail...", orderDetail);

  const getOrderDetail = () => {
    getOrderByIdApi(orderId).then((res) => {
      const data = res?.data?.data;
      setOrderDetail(data);
    });
  };

  useEffect(() => {
    getOrderDetail();
  }, []);

  const handleClickBtnReturn = () => {
    navigate("/admin/orders");
  };

  const RowContext = (props) => {
    const { title, value } = props;
    return (
      <Stack direction="row" spacing={2} sx={{ margin: "1rem 0" }}>
        <Typography component={"h5"}>{title} </Typography>
        <Typography>{value}</Typography>
      </Stack>
    );
  };

  return (
    <div>
      <Box>
        <HeaderCommon
          title={"View order"}
          handleClickBtn={handleClickBtnReturn}
        />
      </Box>
      <div>
        <Paper elevation={3} sx={{ padding: "2rem" }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <RowContext title={"ID: "} value={orderDetail?.ordering_id} />
              <RowContext
                title={"Order Number: "}
                value={orderDetail?.order_number}
              />
              <RowContext
                title={"Order Date: "}
                value={moment(orderDetail?.order_date).format("DD-MM-YYYY")}
              />
              <RowContext title={"Status: "} value={orderDetail?.status} />
              <RowContext
                title={"Name On Card: "}
                value={orderDetail?.name_on_card}
              />
              <RowContext
                title={"Expiration Date: "}
                value={moment(orderDetail?.expiration_date).format(
                  "DD-MM-YYYY"
                )}
              />
              <RowContext
                title={"User name: "}
                value={orderDetail?.user?.userName}
              />

              <RowContext title={"Email: "} value={orderDetail?.user?.email} />
              <RowContext
                title={"Product Name: "}
                value={orderDetail?.product?.productName}
              />
              <RowContext
                title={"Product color: "}
                value={orderDetail?.product.color}
              />
              <RowContext title={"Product size: "} value={orderDetail?.product.size} />
              <RowContext
                title={"Product price: "}
                value={orderDetail?.product.price}
              />
              <RowContext
                title={"Product category: "}
                value={orderDetail?.product?.category}
              />
              <RowContext
                title={"Product supplier: "}
                value={orderDetail?.product?.supplier}
              />
            </Grid>
          </Grid>
        </Paper>
      </div>
    </div>
  );
};

export default ViewOrder;
