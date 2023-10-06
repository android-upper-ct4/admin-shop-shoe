import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  createColor,
  getAColor,
  resetState,
  updateAColor,
} from "../features/color/colorSlice";
import {
  createColorApi,
  getColorByCodeApi,
  updateColorApi,
} from "../api/color.api";
let schema = yup.object().shape({
  colorCode: yup.string().required("colorCode is Required"),
  colorName: yup.string().required("colorName is Required"),
});
const Addcolor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const colorId = params.id;
  const colorCodeLocation = location.state?.colorCode;

  const [colorCodeDetail, setColorCodeDetail] = useState("");
  const [colorNameDetail, setColorNameDetail] = useState("");

  useEffect(() => {
    if (colorId !== undefined) {
      const data = {
        colorCode: colorCodeLocation,
      };
      getColorByCodeApi(data).then((res) => {
        const data = res?.data?.data;
        setColorCodeDetail(data?.colorCode);
        setColorNameDetail(data?.colorName);
      });
    } else {
      dispatch(resetState());
    }
  }, [colorId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      colorCode: colorCodeDetail || "",
      colorName: colorNameDetail || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (colorId !== undefined) {
        const data = {
          ...values,
        };
        updateColorApi(data, colorId)
          .then((res) => {
            if (res) {
              formik.resetForm();
              setTimeout(() => {
                dispatch(resetState());
              }, 300);
              navigate("/admin/list-color");
              toast.success("Update Color successful !");
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
        createColorApi(data)
          .then((res) => {
            if (res) {
              formik.resetForm();
              setTimeout(() => {
                dispatch(resetState());
              }, 300);
              navigate("/admin/list-color");
              toast.success("Create Color successful !");
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
  return (
    <div>
      <h3 className="mb-4 title">Add Color</h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="color"
            label="Enter Product Color Code"
            onChng={formik.handleChange("colorCode")}
            onBlr={formik.handleBlur("colorCode")}
            val={formik.values.colorCode}
            id="colorCode"
          />
          <div className="error">
            {formik.touched.colorCode && formik.errors.colorCode}
          </div>

          <CustomInput
            type="text"
            label="Enter Product Color"
            onChng={formik.handleChange("colorName")}
            onBlr={formik.handleBlur("colorName")}
            val={formik.values.colorName}
            id="colorName"
          />
          <div className="error">
            {formik.touched.colorName && formik.errors.colorName}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            Add Color
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addcolor;
