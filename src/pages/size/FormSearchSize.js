import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { filterSizeApi } from "../../api/size.api";
import { PAGE_SIZE } from "../../constants/page.constants";

const FormSearchCategory = (props) => {
  const { page, setSizeDetail, setTotalPage } = props;

  const initialValues = {
    size: "",
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
    filterSizeApi(newValues, params).then((res) => {
      const data = res?.data?.data;
      setSizeDetail(data);
      setTotalPage(res?.data?.totalPage);
    });
  };

  const handleCancel = (formik) => {
    formik.resetForm();
    const params = {
      page: 1,
      limit: PAGE_SIZE,
    };
    filterSizeApi(initialValues, params).then((res) => {
      const data = res?.data?.data;
      setSizeDetail(data);
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
                      id="sizeCode"
                      name="sizeCode"
                      label="Size Code"
                      value={formik.values.sizeCode}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.sizeCode &&
                        Boolean(formik.errors.sizeCode)
                      }
                      helperText={
                        formik.touched.sizeCode && formik.errors.sizeCode
                      }
                      size="small"
                    />
                  </Grid> */}

                  <Grid item xs={12} md={6} lg={4}>
                    <TextField
                      fullWidth
                      id="size"
                      name="size"
                      label="Size Name"
                      value={formik.values.size}
                      onChange={formik.handleChange}
                      error={formik.touched.size && Boolean(formik.errors.size)}
                      helperText={formik.touched.size && formik.errors.size}
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

export default FormSearchCategory;
