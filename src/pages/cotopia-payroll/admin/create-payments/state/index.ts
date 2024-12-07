import { UserContractType } from "@/types/contract";
import { EmployeesRowData } from "@/types/payroll-table";

interface State {
  employees: EmployeesRowData[];
  selectedEmployee: EmployeesRowData | null;
  userContract: UserContractType | null;
  userIdError: string | null;
  contractIdError: string | null;
}

export const PayrollInitialState: State = {
  employees: [],
  selectedEmployee: null,
  userContract: null,
  userIdError: null,
  contractIdError: null,
};

export function payrollReducer(state: State, action: any): State {
  switch (action.type) {
    case "SET_EMPLOYEES":
      return { ...state, employees: action.payload };
    case "SET_SELECTED_EMPLOYEE":
      return { ...state, selectedEmployee: action.payload };
    case "SET_USER_CONTRACT":
      return { ...state, userContract: action.payload };
    case "SET_USER_ID_ERROR":
      return { ...state, userIdError: action.payload };
    case "SET_CONTRACT_ID_ERROR":
      return { ...state, contractIdError: action.payload };
    default:
      return state;
  }
}
