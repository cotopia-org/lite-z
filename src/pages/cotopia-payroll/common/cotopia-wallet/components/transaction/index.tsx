import { CheckCircle, XCircle, Clock } from "lucide-react";
import { FC } from "react";

interface TransactionProps {
  id: string;
  date: string;
  address: string;
  amount: string;
  status: "Completed" | "Pending" | "Failed";
}

const getStatusStyle = (status: TransactionProps["status"]) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: TransactionProps["status"]) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="w-5 h-5 text-green-600" aria-label="Completed" />;
    case "Pending":
      return <Clock className="w-5 h-5 text-yellow-600" aria-label="Pending" />;
    case "Failed":
      return <XCircle className="w-5 h-5 text-red-600" aria-label="Failed" />;
    default:
      return null;
  }
};

const Transaction: FC<TransactionProps> = ({ id, date, address, amount, status }) => (
  <tr
    key={id}
    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
      status === "Completed"
        ? "bg-green-50"
        : status === "Pending"
        ? "bg-yellow-50"
        : "bg-red-50"
    }`}
  >
    <td className="p-4 text-gray-700">{id}</td>
    <td className="p-4 text-gray-700">{date}</td>
    <td className="p-4 text-blue-600 font-medium hover:underline cursor-pointer">
      {address}
    </td>
    <td className="p-4 text-black font-semibold">{amount}</td>
    <td className="p-4 flex items-center gap-x-2">
      {getStatusIcon(status)}
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(status)}`}
        role="status"
        aria-live="polite"
      >
        {status}
      </span>
    </td>
  </tr>
);

export default Transaction;