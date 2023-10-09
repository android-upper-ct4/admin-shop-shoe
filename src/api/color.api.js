import axios from "axios";
import { adminRequest } from "../utils/axios-config-admin";
import { config } from "../utils/axiosconfig";
import { HTTP_MGMT } from "../utils/domain-config";

export const filterColorApi = async (data, params) => {
  return await adminRequest.post(`${HTTP_MGMT}/api/color/filter`, data, {
    params,
  });
};

export const createColorApi = async (data) => {
  return await adminRequest.post(`${HTTP_MGMT}/api/color/create`, data);
};

export const updateColorApi = async (data, id) => {
  return await adminRequest.post(`${HTTP_MGMT}/api/color/update`, data);
};

export const deleteColorApi = async (data) => {
  return await adminRequest.post(`${HTTP_MGMT}/api/color/delete`, data);
};

export const getColorByCodeApi = async (id) => {
  return await adminRequest.get(`${HTTP_MGMT}/api/color/${id}`);
};
