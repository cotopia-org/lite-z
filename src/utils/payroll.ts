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
  userId: string,
  accessToken: string
) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_PUBLIC_API_URL}/contracts/${userId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user contract");
  }
};
