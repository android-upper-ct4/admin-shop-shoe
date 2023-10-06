import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAColor,
  getColors,
  resetState,
} from "../features/color/colorSlice";
import { AiFillDelete } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import CustomModal from "../components/CustomModal";
import { PAGE_SIZE } from "../constants/page.constants";
import { deleteColorApi, filterColorApi } from "../api/color.api";
import { toast } from "react-toastify";
import { Box, Button, Pagination } from "@mui/material";
import FormSearchColor from "./color/FormSearchColor";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Code",
    dataIndex: "colorCode",
  },
  {
    title: "Name",
    dataIndex: "colorName",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Colorlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [colorId, setColorId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [colorDetail, setColorDetail] = useState([]);
  const [colorItem, setColorItem] = useState(null);

  const showModal = (item) => {
    setOpen(true);
    setColorId(item?.id); // Sửa thành item?.id
    setColorItem(item);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const getColorDetail = async () => {
    const data = {
      colorCode: "",
      colorName: "",
    };
    const params = {
      page: page,
      limit: PAGE_SIZE,
    };
    filterColorApi(data, params)
      .then((res) => {
        setColorDetail(res?.data?.data);
        setTotalPage(res?.data?.pagination?.totalPages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    dispatch(resetState());
    getColorDetail();
  }, []);

  const data1 = [];
  for (let i = 0; i < colorDetail.length; i++) {
    data1.push({
      key: i + 1,
      colorCode: colorDetail[i].color_code,
      colorName: colorDetail[i].color_name,
      action: (
        <>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => showModal(colorDetail[i])}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }

  const handleClickBtnAddColor = () => {
    navigate("/admin/color");
  };

  const deleteColor = () => {
    if (colorItem) {
      const data = {
        colorCode: colorItem.colorCode,
      };
  
      deleteColorApi(data, colorItem.id)
        .then((res) => {
          if (res) {
            setOpen(false);
            setTimeout(() => {
              getColorDetail();
            }, 100);
            toast.success("Delete color successful");
          } else {
            toast.error("Error");
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  const onChangePage = (e, pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 className="mb-4 title">Colors</h3>
        <Button
          sx={{ marginBottom: "1.5rem" }}
          onClick={handleClickBtnAddColor}
        >
          Add color
        </Button>
      </Box>
      <Box sx={{ marginBottom: "1rem" }}>
        <FormSearchColor
          page={page}
          setColorDetail={setColorDetail}
          setTotalPage={setTotalPage}
        />
      </Box>
      <div>
        <Table pagination={false} columns={columns} dataSource={data1} />
        <Pagination page={page} count={totalPage} onChange={onChangePage} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteColor();
        }}
        title="Are you sure you want to delete this color?"
      />
    </div>
  );
};

export default Colorlist;
