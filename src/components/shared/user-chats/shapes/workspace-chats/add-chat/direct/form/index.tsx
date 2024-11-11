import UserSelector from "@/components/shared/user-selector";
import axiosInstance from "@/services/axios";
import { UserMinimalType } from "@/types/user";

export default function AddDirectForm() {
  const handleCreateChat = (user: UserMinimalType) => {
    axiosInstance.post(`/chats/createDirect`, {
      user_id: user.id,
    });
  };

  return (
    <div>
      <UserSelector onPick={handleCreateChat} />
    </div>
  );
}
