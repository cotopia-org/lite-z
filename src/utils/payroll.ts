import { UserContractType } from "@/types/contract";
import axios from "axios";

export const fetchEmployeesData = async (accessToken: string) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_PUBLIC_API_URL}/workspaces/1/users`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error("Error fetching employees data");
  }
};

export const fetchUserContract = async (
  userId: number,
  accessToken: string
) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_PUBLIC_API_URL}/contracts`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = response.data.data;
    const filteredData = data.filter(
      (item: UserContractType) => item.user_id === userId
    );
    const lastContract = filteredData.pop() as UserContractType;

    return lastContract;
  } catch (error) {
    throw new Error("Error fetching user contract");
  }
};