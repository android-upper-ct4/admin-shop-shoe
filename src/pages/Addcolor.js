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
  code: yup.string().required("code is Required"),
  color: yup.string().required("colorName is Required"),
});
const Addcolor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const colorId = params.id;
  console.log("colorId...", colorId);
  const colorCodeLocation = location.state?.colorCode;
  console.log("colorCodeLocation...", colorCodeLocation);

  const [colorCodeDetail, setColorCodeDetail] = useState("");
  const [colorNameDetail, setColorNameDetail] = useState("");

  useEffect(() => {
    if (colorId !== undefined) {
      // const data = {
      //   code: colorCodeLocation,
      // };
      getColorByCodeApi(colorId).then((res) => {
        const data = res?.data?.data[0];
        console.log("data...", data);
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
      code: colorCodeDetail || "",
      color: colorNameDetail || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (colorId !== undefined) {
        const data = {
          ...values,
          id: colorId,
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
      <h3 className="mb-4 title">
        {colorId !== undefined ? "Edit" : "Add"} Color
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="color"
            label="Enter Product Color Code"
            onChng={formik.handleChange("code")}
            onBlr={formik.handleBlur("code")}
            val={formik.values.code}
            id="code"
          />
          <div className="error">
            {formik.touched.code && formik.errors.code}
          </div>

          <CustomInput
            type="text"
            label="Enter Product Color"
            onChng={formik.handleChange("color")}
            onBlr={formik.handleBlur("color")}
            val={formik.values.color}
            id="color"
          />
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {colorId !== undefined ? "Edit" : "Add"} Color
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addcolor;
