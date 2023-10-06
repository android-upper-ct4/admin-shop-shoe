import React, { useState } from "react";
import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { filterColorApi } from "../../api/color.api";
import { PAGE_SIZE } from "../../constants/page.constants";

const FormSearchColor = ({ page, setColorDetail, setTotalPage }) => {
  const initialValues = {
    colorName: "",
  };

  const validationSchema = Yup.object({
    colorName: Yup.string().trim().max(255, "Tên màu không được vượt quá 255 ký tự"),
  });

  const handleSearch = (values) => {
    const newValues = {
      color: values.colorName,
    };
    const params = {
      page: page,
      limit: PAGE_SIZE,
    };
    filterColorApi(newValues, params)
      .then((res) => {
        const data = res?.data?.data;
        setColorDetail(data);
        setTotalPage(res?.data?.pagination?.totalPages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        handleSearch(values);
      }}
      validationSchema={validationSchema}
    >
      {(formik) => (
        <Form noValidate autoComplete="off">
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  id="colorName"
                  name="colorName"
                  label="Color Name"
                  value={formik.values.colorName}
                  onChange={formik.handleChange}
                  error={formik.touched.colorName && Boolean(formik.errors.colorName)}
                  helperText={formik.touched.colorName && formik.errors.colorName}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} justifyContent="center" alignItems="center">
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={() => {
                      formik.resetForm();
                      handleSearch({ colorName: "" });
                    }}
                  >
                    Clear
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Search
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default FormSearchColor;
