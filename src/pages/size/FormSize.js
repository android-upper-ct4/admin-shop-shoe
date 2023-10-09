import { Box } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
  createSizeApi,
  getSizeByCodeApi,
  updateSizeApi,
} from "../../api/size.api";
import CustomInput from "../../components/CustomInput";
import HeaderCommon from "../../components/HeaderCommon";

let schema = yup.object().shape({
  // sizeCode: yup.string().required("sizeCode is Required"),
  size: yup.string().required("size is Required"),
});

const FormSize = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const sizeId = params?.id;

  const [sizeNameDetail, setSizeNameDetail] = useState("");

  useEffect(() => {
    if (sizeId !== undefined) {
      getSizeByCodeApi(sizeId).then((res) => {
        const data = res?.data?.data[0];
        setSizeNameDetail(data?.sizeName);
      });
    }
  }, [sizeId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      size: sizeNameDetail || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (sizeId !== undefined) {
        const data = {
          ...values,
          id: sizeId,
        };
        updateSizeApi(data)
          .then((res) => {
            if (res) {
              formik.resetForm();
              setTimeout(() => {
                navigate("/admin/list-size");
                toast.success("Update Size successful !");
              }, 300);
            } else {
              toast.error("Error !");
            }
          })
          .catch((err) => {
            toast.error(err);
          });
      } else {
        const data = {
          ...values,
        };
        createSizeApi(data)
          .then((res) => {
            if (res) {
              formik.resetForm();
              setTimeout(() => {
                navigate("/admin/list-size");
                toast.success("Create Size successful !");
              }, 300);
            } else {
              toast.error("Error !");
            }
          })
          .catch((err) => {
            toast.error(err);
          });
      }
    },
  });

  const handleClickBtnReturn = () => {
    navigate("/admin/list-size");
  };

  return (
    <div>
      <Box>
        <HeaderCommon
          title={sizeId !== undefined ? "Edit Size" : "Add Size"}
          handleClickBtn={handleClickBtnReturn}
        />
      </Box>

      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          {/* <CustomInput
            type="text"
            label="Enter Product Size Code"
            onChng={formik.handleChange("sizeCode")}
            onBlr={formik.handleBlur("sizeCode")}
            val={formik.values.sizeCode}
            id="sizeCode"
          />
          <div className="error">
            {formik.touched.sizeCode && formik.errors.sizeCode}
          </div> */}

          <CustomInput
            type="text"
            label="Enter Product Size"
            onChng={formik.handleChange("size")}
            onBlr={formik.handleBlur("size")}
            val={formik.values.size}
            id="size"
          />
          <div className="error">
            {formik.touched.size && formik.errors.size}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {sizeId !== undefined ? "Edit" : "Add"} Size
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormSize;
