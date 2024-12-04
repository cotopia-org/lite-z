import axios from "axios";

export const fetchEmployeesData = async (accessToken: string) => {
  try {
    const response = await axios.get("/api/employees", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching employees data");
  }
};

export const fetchUserContract = async (
  userId: string,
  accessToken: string
) => {
  try {
    const response = await axios.get(`/api/contracts/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user contract");
  }
};
