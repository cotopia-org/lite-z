import { useState, useEffect } from "react";
import axios from "axios";
import { UserContractType } from "@/types/contract";
import { useAppSelector } from "@/store";

export default function useUserContract() {
  const userData = useAppSelector((store) => store.auth);
  const [userContract, setUserContract] = useState<UserContractType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userData?.user?.id) return;

    async function fetchContract() {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_PUBLIC_API_URL}/contracts`,
          {
            headers: {
              Authorization: `Bearer ${userData.accessToken}`,
            },
          }
        );

        const data = response.data.data as UserContractType[];
        const filteredContracts = data.filter(
          (contract) => contract.user_id === userData.user?.id
        );

        const latestContract =
          filteredContracts.length > 1
            ? filteredContracts[filteredContracts.length - 1]
            : filteredContracts[0];

        setUserContract(latestContract || null);
      } catch (err) {
        setError("Failed to fetch user contract");
      } finally {
        setIsLoading(false);
      }
    }

    fetchContract();
  }, [userData]);

  return { userContract, isLoading, error };
}
