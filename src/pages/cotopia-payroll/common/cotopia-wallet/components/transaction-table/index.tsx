import Transaction from "../transaction";

interface TransactionsTableProps {
  transactions: {
    id: string;
    date: string;
    address: string;
    amount: string;
    status: "Completed" | "Pending" | "Failed";
  }[];
}

function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="w-full text-left border-collapse bg-white rounded-lg">

        <thead>
          <tr className="bg-gray-700 text-white uppercase text-sm font-medium">
            <th className="p-3">ID</th>
            <th className="p-3">Date</th>
            <th className="p-3">Address</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>


        <tbody>

          {/* {transactions.map((tx) => (
              <Transaction key={tx.id} {...tx} />
            ))} */}

          <tr>
            <td colSpan={5} className="text-center p-6 font-medium text-sm">No transactions found</td>
          </tr>

        </tbody>


      </table>
    </div>
  );
}

export default TransactionsTable;