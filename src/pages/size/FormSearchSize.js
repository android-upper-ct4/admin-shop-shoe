import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { filterSizeApi } from "../../api/size.api";
import { PAGE_SIZE } from "../../constants/page.constants";

const FormSearchCategory = (props) => {
  const { page, setSizeDetail, setTotalPage } = props;

  const initialValues = {
    sizeName: "",
  };

  const validationSchema = Yup.object({
    sizeName: Yup.string(),
  });

  const buildBody = (values) => {
    const newValues = {
      size: values.sizeName,
    };
    return newValues;
  };

  const handleOnSubmit = async (values) => {
    const newValues = buildBody(values);
    const params = {
      page: page,
      limit: PAGE_SIZE,
    };
    filterSizeApi(newValues, params)
      .then((res) => {
        const data = res?.data?.data;
        setSizeDetail(data);
        setTotalPage(res?.data?.pagination?.totalPages);
      })
      .catch((error) => {
        console.error("Error searching sizes:", error);
      });
  };

  const handleCancel = () => {
    const newValues = {
      sizeName: "",
    };
    const params = {
      page: 1,
      limit: PAGE_SIZE,
    };
    filterSizeApi(newValues, params)
      .then((res) => {
        const data = res?.data?.data;
        setSizeDetail(data);
        setTotalPage(res?.data?.pagination?.totalPages);
      })
      .catch((error) => {
        console.error("Error clearing search:", error);
      });
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleOnSubmit}
        validationSchema={validationSchema}
        enableReinitialize={true}
      >
        {(formik) => (
          <Form noValidate autoComplete="off">
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    fullWidth
                    id="sizeName"
                    name="sizeName"
                    label="Size Name"
                    value={formik.values.sizeName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.sizeName &&
                      Boolean(formik.errors.sizeName)
                    }
                    helperText={
                      formik.touched.sizeName && formik.errors.sizeName
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} justifyContent="center" alignItems="center">
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                      variant="contained"
                      color="secondary"
                      type="button"
                      onClick={handleCancel}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Search
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormSearchCategory;
