import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { filterColorApi } from "../../api/color.api";
import { PAGE_SIZE } from "../../constants/page.constants";

const FormSearchColor = (props) => {
  const { page, setColorDetail, setTotalPage } = props;

  const initialValues = {
    color: "",
  };

  const validationSchema = Yup.object({});

  const buildBody = (values) => {
    const newValues = {
      ...values,
    };
    return newValues;
  };

  const handleOnSubmit = async (values, formikHelper) => {
    const newValues = buildBody(values);
    const params = {
      page: page,
      limit: PAGE_SIZE,
    };
    filterColorApi(newValues, params).then((res) => {
      const data = res?.data?.data;
      setColorDetail(data);
      setTotalPage(res?.data?.totalPage);
    });
  };

  const handleCancel = (formik) => {
    formik.resetForm();
    const params = {
      page: 1,
      limit: PAGE_SIZE,
    };
    filterColorApi(initialValues, params).then((res) => {
      const data = res?.data?.data;
      setColorDetail(data);
      setTotalPage(res?.data?.totalPage);
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
              <Box>
                <Grid container spacing={2}>
                  {/* <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      id="colorCode"
                      name="colorCode"
                      label="Color Code"
                      value={formik.values.colorCode}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.colorCode &&
                        Boolean(formik.errors.colorCode)
                      }
                      helperText={
                        formik.touched.colorCode && formik.errors.colorCode
                      }
                      size="small"
                    />
                  </Grid> */}

                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      id="color"
                      name="color"
                      label="Color Name"
                      value={formik.values.color}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.color && Boolean(formik.errors.color)
                      }
                      helperText={formik.touched.color && formik.errors.color}
                      size="small"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onMouseDown={() => handleCancel(formik)}
                      >
                        Huỷ
                      </Button>
                      <Button variant="contained" color="primary" type="submit">
                        Tìm kiếm
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default FormSearchColor;
