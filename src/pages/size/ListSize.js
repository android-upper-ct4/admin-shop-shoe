import { Box, Button, Pagination } from "@mui/material";
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteSizeApi, filterSizeApi } from "../../api/size.api";
import CustomModal from "../../components/CustomModal";
import { PAGE_SIZE } from "../../constants/page.constants";
import FormSearchCategory from "./FormSearchSize";

const columns = [
  {
    title: "SNo",
    dataIndex: "SNo", // Chỉnh sửa dataIndex thành "SNo"
  },
  {
    title: "Size Code",
    dataIndex: "sizeCode",
  },
  {
    title: "Size Name",
    dataIndex: "sizeName",
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const ListSize = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [sizeId, setSizeId] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [sizeDetail, setSizeDetail] = useState([]);
  const [sizeItem, setSizeItem] = useState(null);

  const showModal = (item) => {
    setOpen(true);
    setSizeId(item.id.toString());
    setSizeItem(item);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const getSizeDetail = async () => {
    const data = {
      sizeCode: "",
      sizeName: "",
    };
    const params = {
      page: page,
      limit: PAGE_SIZE,
    };
    filterSizeApi(data, params)
      .then((res) => {
        setSizeDetail(res?.data?.data);
        setTotalPage(res?.data?.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getSizeDetail();
  }, [page]);

  const data1 = sizeDetail.map((item, index) => ({
    key: item.id,
    sizeCode: item.id.toString(),
    sizeName: item.size_name,
    SNo: index + 1,
    action: (
      <>
        <Link
          to={`/admin/size/${item.id}`}
          state={{ sizeCode: item.id.toString() }}
          className=" fs-3 text-danger"
        >
          <BiEdit />
        </Link>
        <button
          className="ms-3 fs-3 text-danger bg-transparent border-0"
          onClick={() => showModal(item)}
        >
          <AiFillDelete />
        </button>
      </>
    ),
  }));

  const handleClickBtnAddSize = () => {
    navigate("/admin/size");
  };

  const deleteSize = () => {
    if (sizeItem) {
      const data = {
        sizeCode: sizeItem.sizeCode,
      };
  
      deleteSizeApi(data, sizeItem.id)
        .then((res) => {
          if (res) {
            setOpen(false);
            setTimeout(() => {
              getSizeDetail();
            }, 100);
            toast.success("Delete size successful");
          } else {
            toast.error("Error");
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };  

  const onChangePage = (pageNumber) => {
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
        <h3 className="mb-4 title">Sizes</h3>
        <Button sx={{ marginBottom: "1.5rem" }} onClick={handleClickBtnAddSize}>
          Add size
        </Button>
      </Box>
      <Box sx={{ marginBottom: "1rem" }}>
        <FormSearchCategory
          page={page}
          setSizeDetail={setSizeDetail}
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
          deleteSize();
        }}
        title="Are you sure you want to delete this size?"
      />
    </div>
  );
};

export default ListSize;
