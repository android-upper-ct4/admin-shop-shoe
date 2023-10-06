import axios from "axios";
import { adminRequest } from "../utils/axios-config-admin";
import { config } from "../utils/axiosconfig";
import { HTTP_MGMT } from "../utils/domain-config";

export const filterSizeApi = async (data, params) => {
  return await adminRequest.post(`${HTTP_MGMT}/api/size/filter`, data, { params });
};

export const createSizeApi = async (data) => {
  return await adminRequest.post(`${HTTP_MGMT}/api/size/create`, data);
};

export const updateSizeApi = async (data) => {
  return await adminRequest.post(`${HTTP_MGMT}/api/size/update`, data);
};

export const deleteSizeApi = async (data, id) => {
  return await adminRequest.post(`${HTTP_MGMT}/api/size/delete/${id}`, data);
};

export const getSizeByCodeApi = async (id) => {
  return await adminRequest.post(`${HTTP_MGMT}/api/size/${id}`);
};
