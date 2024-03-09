import { User } from "../types/user";
import api from "../utils/api";
import { AxiosResponse } from "axios";

type resType = {
  message: string;
};

// const getUsers = async (): Promise<AxiosResponse<User[]>> => {
//   return api.get("/users");
// };

// const getUserId = async (id: string): Promise<User> => {
//   return api.get(`/users/${id}`);
// };

// const deleteUser = async (id: string): Promise<AxiosResponse<resType>> => {
//   return api.delete(`/users/${id}`);
// };

// const editUser = async (
//   email: string | undefined,
//   firstName: string | undefined,
//   lastName: string | undefined,
//   id: string | undefined
// ): Promise<AxiosResponse<User>> => {
//   return api.put(`/users/${id}`, {
//     email,
//     firstName,
//     lastName,
//   });
// };

// const createUser = async (
//   email: string,
//   password: string,
//   lastName: string,
//   firstName: string
// ): Promise<AxiosResponse<User>> => {
//   return api.post("/users", { email, password, firstName, lastName });
// };

// export { getUsers, deleteUser, editUser, getUserId, createUser };
