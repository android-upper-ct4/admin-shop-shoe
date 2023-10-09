import React, { useEffect, useState } from "react";
import { Form, Formik, useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import Select from "react-select";
import { getProduct, updateProduct } from "../../api/product.api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { filterSizeApi } from "../../api/size.api";
import { MdOutlineClose } from "react-icons/md";
import { filterColorApi } from "../../api/color.api";
import { base_url } from "../../utils/baseUrl";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    height: "60px",
    background: "#f5f5f5",
  }),
  option: (provided, state) => ({
    ...provided,
    zIndex: 100,
  }),
};

const FormUpdateProduct = () => {
  const defaultInitialValues = {
    name: "",
    price: "",
    quantity: "",
    supplier: "",
    category: "",
    size: "",
    color: "",
    image: "",
  };

  const navigate = useNavigate();
  const params = useParams();
  const paramProductCode = params.productCode;

  const [initialValues, setInitialValues] = useState(defaultInitialValues);
  const [colorDetail, setColorDetail] = useState([]);
  const [sizeDetail, setSizeDetail] = useState([]);
  const [productDetail, setProductDetail] = useState(null);
  const [images, setImages] = useState([]);
  const [arrImageIdDels, setArrImageIdDels] = useState([]);
  const [imageDetails, setImageDetails] = useState([]);

  const validationSchema = Yup.object({
    name: Yup.string().nullable().required("Name is Required"),
    supplier: Yup.string().required("supplier is Required"),
    category: Yup.string().required("category is Required"),
    price: Yup.number().required("Price is Required"),
    quantity: Yup.number().required("Quantity is Required"),
    size: Yup.array()
      .nullable()
      .min(1, "Pick at least one size")
      .required("Size is required"),
    color: Yup.array()
      .nullable()
      .min(1, "Pick at least one color")
      .required("Color is Required"),
    image: Yup.string().nullable().required("image is Required"),
  });

  const getColorsDetail = async () => {
    const data = {
      color: "",
    };
    const params = {
      page: 1,
      limit: 10000,
    };
    await filterColorApi(data, params).then((res) => {
      const data = res?.data?.data;
      setColorDetail(data);
    });
  };

  const buildInitialValues = (product) => {
    const valueForm = {
      name: product?.product_name,
      price: product?.price,
      quantity: product?.quantity,
      supplier: product?.supplier,
      category: product?.category,
      size: product?.sizes,
      color: product?.colors,
      image: product.image,
    };
    return valueForm;
  };

  const getSizesDetail = async () => {
    const data = {
      size: "",
    };
    const params = {
      page: 1,
      limit: 10000,
    };

    filterSizeApi(data, params)
      .then((res) => {
        const data = res?.data?.data;
        setSizeDetail(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const convertToBlob = async (filePath, fileName) => {
  //   const response = await fetch(filePath);
  //   const blob = await response.blob();
  //   return new File([blob], fileName);
  // };

  // const convertToFiles = async (filePaths) => {
  //   const files = await Promise.all(
  //     filePaths.map(async (filePath) => {
  //       const fileName = filePath.substring(filePath.lastIndexOf("\\") + 1);
  //       return convertToBlob(filePath, fileName);
  //     })
  //   );
  //   setImages(files);
  // };

  const getProductDetail = async () => {
    getProduct(paramProductCode)
      .then((res) => {
        setProductDetail(res?.data?.data);
        setInitialValues(buildInitialValues(res?.data?.data));
        setImageDetails(res?.data?.data?.images);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    getColorsDetail();
    getSizesDetail();
    getProductDetail();
  }, []);

  const handleChangeSize = (formik) => (e) => {
    formik.setFieldValue("size", e);
  };

  const handleChangeColor = (formik) => (e) => {
    formik.setFieldValue("color", e);
  };

  const handleChangeImage = (formik) => (e) => {
    const files = e.target.files;
    const arrFile = [];
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      arrFile.push(element);
    }
    setImages(arrFile);
  };

  const handleDeleteImage = (item, index) => {
    if (item?.id) {
      const newArrFile = imageDetails?.filter((item_1, i) => index !== i);
      const arrId = imageDetails
        ?.filter((item_1, i) => item_1?.id === item?.id)
        ?.map((j) => j.id);
      let newArrId = [...arrImageIdDels, ...arrId];
      setArrImageIdDels(newArrId);
      setImageDetails(newArrFile);
    } else {
      const newArrFile = images?.filter((item_1, i) => index !== i);
      setImages(newArrFile);
    }
  };

  const buildBodyUpload = (values) => {
    const arrSize = values?.size?.map((item) => (item?.id ? item?.id : item));

    const arrColor = values?.color?.map((item) => (item?.id ? item?.id : item));

    const bodyFormData = new FormData();
    bodyFormData.append("id", Number(paramProductCode));
    bodyFormData.append("name", values.name);
    bodyFormData.append("price", Number(values?.price));
    bodyFormData.append("quantity", Number(values?.quantity));
    bodyFormData.append("supplier", values.supplier);
    bodyFormData.append("category", values.category);

    for (let index = 0; index < arrSize.length; index++) {
      const element = arrSize[index];
      bodyFormData.append("sizeIds", element);
    }

    for (let index = 0; index < arrColor.length; index++) {
      const element = arrColor[index];
      bodyFormData.append("colorIds", element);
    }

    for (let index = 0; index < images.length; index++) {
      const element = images[index];
      bodyFormData.append("image", element);
    }

    for (let index = 0; index < arrImageIdDels.length; index++) {
      const element = arrImageIdDels[index];
      bodyFormData.append("imageDel", element);
    }
    return bodyFormData;
  };

  const handleOnSubmit = async (formik) => {
    const values = formik?.values;
    const newValues = buildBodyUpload(values);
    await updateProduct(newValues, paramProductCode)
      .then((res) => {
        toast.success("Update product successful !");
        navigate("/admin/list-product");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleOnSubmit}
        validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={true}
        enableReinitialize={true}
      >
        {(formik) => (
          <>
            <Form noValidate autoComplete="off">
              {/* <pre>{JSON.stringify(formik.values, undefined, 2)}</pre> */}
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} lg={12}>
                    <TextField
                      fullWidth
                      id="name"
                      name="name"
                      label="Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                  </Grid>

                  <Grid item xs={12} md={12} lg={12}>
                    <TextField
                      fullWidth
                      id="price"
                      name="price"
                      label="Price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.price && Boolean(formik.errors.price)
                      }
                      helperText={formik.touched.price && formik.errors.price}
                    />
                  </Grid>

                  {/* Quantity */}
                  <Grid item xs={12} md={12} lg={12}>
                    <TextField
                      fullWidth
                      id="quantity"
                      name="quantity"
                      label="quantity"
                      value={formik.values.quantity}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.quantity &&
                        Boolean(formik.errors.quantity)
                      }
                      helperText={
                        formik.touched.quantity && formik.errors.quantity
                      }
                    />
                  </Grid>

                  {/* supplier */}
                  <Grid item xs={12} md={12} lg={12}>
                    <TextField
                      fullWidth
                      id="supplier"
                      name="supplier"
                      label="supplier"
                      value={formik.values.supplier}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.supplier &&
                        Boolean(formik.errors.supplier)
                      }
                      helperText={
                        formik.touched.supplier && formik.errors.supplier
                      }
                    />
                  </Grid>

                  {/* category */}
                  <Grid item xs={12} md={12} lg={12}>
                    <TextField
                      fullWidth
                      id="category"
                      name="category"
                      label="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.category &&
                        Boolean(formik.errors.category)
                      }
                      helperText={
                        formik.touched.category && formik.errors.category
                      }
                    />
                  </Grid>

                  {/* Size */}
                  <Grid item xs={12} md={12} lg={12}>
                    <Typography>Size</Typography>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      fullWidth
                      isMulti
                      isClearable={true}
                      name="size"
                      id="size"
                      type="text"
                      placeholder="Select Size"
                      onBlur={formik.handleBlur}
                      onChange={handleChangeSize(formik)}
                      value={formik.values.size}
                      options={sizeDetail}
                      getOptionLabel={(option) => option.sizeName}
                      getOptionValue={(option) => option.id}
                      styles={customStyles}
                    />
                    <div className="error">
                      {formik.touched.size && formik.errors.size}
                    </div>
                  </Grid>

                  {/* Color */}
                  <Grid item xs={12} md={12} lg={12}>
                    <Typography>Color</Typography>
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      fullWidth
                      isMulti
                      isClearable={true}
                      name="color"
                      id="color"
                      type="text"
                      placeholder="Select color"
                      onBlur={formik.handleBlur}
                      onChange={handleChangeColor(formik)}
                      value={formik.values.color}
                      options={colorDetail}
                      getOptionLabel={(option) => option.colorName}
                      getOptionValue={(option) => option.id}
                      styles={customStyles}
                      menuPlacement="top"
                    />
                    <div className="error">
                      {formik.touched.color && formik.errors.color}
                    </div>
                  </Grid>

                  <Grid item xs={12} md={12} lg={12}>
                    <input
                      type="file"
                      label="Enter Product image"
                      name="image"
                      id="image"
                      multiple
                      onChange={handleChangeImage(formik)}
                    />
                    <div style={{ display: "flex" }}>
                      {images?.length > 0 &&
                        images?.map((item, index) => {
                          item.preview = URL.createObjectURL(item);
                          return (
                            <div
                              key={index}
                              style={{
                                margin: "0 0.4rem",
                                position: "relative",
                              }}
                            >
                              <img
                                src={item?.preview}
                                alt="images"
                                style={{
                                  height: "76px",
                                  width: "112px",
                                }}
                              />
                              <div
                                style={{
                                  cursor: "pointer",
                                  position: "absolute",
                                  right: 0,
                                  top: 0,
                                  fontSize: "1.6rem",
                                }}
                                onClick={() => handleDeleteImage(item, index)}
                              >
                                <MdOutlineClose />
                              </div>
                            </div>
                          );
                        })}

                      {imageDetails?.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            margin: "0 0.4rem",
                            position: "relative",
                          }}
                        >
                          <img
                            src={`${base_url}${item?.image}`}
                            alt="images"
                            style={{
                              height: "76px",
                              width: "112px",
                            }}
                          />

                          <div
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              right: 0,
                              top: 0,
                              fontSize: "1.6rem",
                            }}
                            onClick={() => handleDeleteImage(item, index)}
                          >
                            <MdOutlineClose />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ marginTop: "1rem" }}>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={() => handleOnSubmit(formik)}
                >
                  Submit
                </Button>
              </Box>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default FormUpdateProduct;
