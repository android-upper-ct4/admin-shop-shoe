import { Box } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { createSizeApi, updateSizeApi } from "../../api/size.api";
import CustomInput from "../../components/CustomInput";
import HeaderCommon from "../../components/HeaderCommon";

let schema = yup.object().shape({
  sizeName: yup.string().required("Size Name is Required"),
  sizeCode: yup
    .number()
    .typeError("Size Code must be a number") // Thêm kiểm tra kiểu dữ liệu
    .when("isEditing", {
      is: true,
      then: yup.number().required("Size Code is Required"), // Kiểm tra khi sửa
      otherwise: yup.number(), // Không bắt buộc khi thêm mới
    }),
});

const FormSize = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const sizeId = params?.id;

  const isEditing = !!sizeId;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      sizeCode: 0, // Đặt một giá trị mặc định cho sizeCode kiểu số nguyên
      sizeName: "",
      isEditing,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const data = {
        sizeName: values.sizeName,
      };
    
      if (isEditing) {
        data.id = values.sizeCode; // Sử dụng id thay vì sizeCode khi sửa
        data.size = values.sizeName; // Thêm trường size cho dữ liệu gửi đi
      }
    
      const apiMethod = isEditing ? updateSizeApi : createSizeApi;
    
      apiMethod(data)
        .then((res) => {
          if (res) {
            formik.resetForm();
            setTimeout(() => {
              navigate("/admin/list-size");
              toast.success(`${isEditing ? "Update" : "Create"} Size successful !`);
            }, 300);
          } else {
            toast.error("Error !");
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    },    
  });  

  useEffect(() => {
    if (isEditing) {
      // Lấy thông tin Size theo ID và cập nhật giá trị cho sizeCode và sizeName trong form
      const data = {
        id: sizeId, // Sử dụng id thay vì sizeCode khi sửa
      };

      // Gọi API để lấy thông tin Size bằng ID
      // getSizeByIdApi(data).then((res) => {
      //   const sizeData = res?.data?.data;
      //   formik.setFieldValue("sizeCode", sizeData?.id || 0);
      //   formik.setFieldValue("sizeName", sizeData?.sizeName || "");
      // });
    }
  }, [sizeId, isEditing, formik]);

  const handleClickBtnReturn = () => {
    navigate("/admin/list-size");
  };

  return (
    <div>
      <Box>
        <HeaderCommon
          title={isEditing ? "Edit Size" : "Add Size"}
          handleClickBtn={handleClickBtnReturn}
        />
      </Box>

      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          {isEditing && (
            <CustomInput
              type="number" // Đặt kiểu số cho input khi sửa
              label="Enter Product Size Code"
              onChng={formik.handleChange("sizeCode")}
              onBlr={formik.handleBlur("sizeCode")}
              val={formik.values.sizeCode.toString()} // Chuyển số thành chuỗi để tránh lỗi
              id="sizeCode"
            />
          )}
          <div className="error">
            {formik.touched.sizeCode && formik.errors.sizeCode}
          </div>

          <CustomInput
            type="text"
            label="Enter Product Size"
            onChng={formik.handleChange("sizeName")}
            onBlr={formik.handleBlur("sizeName")}
            val={formik.values.sizeName}
            id="sizeName"
          />
          <div className="error">
            {formik.touched.sizeName && formik.errors.sizeName}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {isEditing ? "Edit" : "Add"} Size
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormSize;
