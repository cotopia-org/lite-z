import axios from 'axios';
import { useEffect, useState } from 'react';
import useAuth from './auth';

export default function useGetBalance() {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    async function getBalance() {
      if (!user?.email) return;
      try {
        const response = await axios.get(
          `http://localhost:8080/get-balance/${user.email}`,
        );
        const data = response.data.data;
        setWalletBalance(data.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }

    getBalance();
  }, [user?.email]);

  return { walletBalance };
}
