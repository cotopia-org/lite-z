import CotopiaButton from "@/components/shared-ui/c-button";
import PopupBox from "@/components/shared/popup-box";
import PopupBoxChild from "@/components/shared/popup-box/child";
import ToolButton from "../../tool-button";
import ExpectedPayments from "./expected-payments";
import CTabs from "@/components/shared-ui/c-tabs";
import CFullDialog from "@/components/shared-ui/c-dialog/full-dialog";
import PayrollPage from "@/pages/cotopia-payroll/user/payroll";
import { Coins } from "lucide-react";
import useAuth from "@/hooks/auth";
import { useRoomContext } from "../../../room-context";
import CotopiaTable from "@/components/shared-ui/c-table";
import { UserContractType } from "@/types/contract";
import moment from "moment";
import UserPayments from "@/components/shared/cotopia-payroll/payments";
import { useMemo } from "react";
import NotFound from "@/components/shared/layouts/not-found";
import ContractDetails from "./contract-details";
import EditContract from "./edit-contract";

const box_width = 506;

export default function PayrollButton() {
  const { user } = useAuth();
  const { workspaceUsers, payments } = useRoomContext();

  const myUser = workspaceUsers?.find((a) => a.id === user?.id);

  const totalPendingPaymentsAmount = useMemo(() => {
    return payments
      .filter((a) => a.status === "ongoing")
      .reduce((prev, crt) => crt.amount + prev, 0);
  }, [payments]);

  return (
    <PopupBox
      trigger={(open, isOpen) => (
        <ToolButton isOpen={isOpen} startIcon={<Coins size={20} />} open={open}>
          <ExpectedPayments amount={totalPendingPaymentsAmount} />
        </ToolButton>
      )}
    >
      {(triggerPosition, open, close) => {
        const hasContract = myUser?.active_contract;

        return (
          <PopupBoxChild
            onClose={close}
            title='Payroll'
            width={box_width}
            zIndex={triggerPosition.zIndex}
            top={triggerPosition.top}
            left={triggerPosition.left - (box_width - triggerPosition.width)}
          >
            <div className='flex w-full flex-col gap-y-6 items-end'>
              {hasContract ? (
                <CTabs
                  defaultValue='active-contract'
                  items={[
                    {
                      value: "active-contract",
                      title: "Contract",
                      content: (
                        <div className='py-3'>
                          <div className='flex flex-col w-full my-4'>
                            <strong className='px-4'>My Active Contract</strong>
                            <CotopiaTable
                              items={[myUser.active_contract]}
                              tableHeadItems={[
                                {
                                  title: "Starts at",
                                  render: (item: UserContractType) =>
                                    moment(item.start_at).format("YYYY/MM/DD"),
                                },
                                {
                                  title: "Ends at",
                                  render: (item: UserContractType) =>
                                    moment(item.end_at).format("YYYY/MM/DD"),
                                },
                                {
                                  title: "Per hour",
                                  render: (item: UserContractType) =>
                                    item.amount,
                                },
                                {
                                  title: "Status",
                                  render: (item: UserContractType) => {
                                    let status = "Draft";

                                    if (
                                      item.contractor_sign_status === 1 &&
                                      item.user_sign_status === 0
                                    )
                                      status = "Waiting for admin to sign";

                                    if (
                                      item.user_sign_status === 1 &&
                                      item.contractor_sign_status === 0
                                    )
                                      status = "Waiting for you to sign";

                                    if (
                                      item.user_sign_status === 1 &&
                                      item.contractor_sign_status === 1
                                    )
                                      status = "Signed";

                                    return status;
                                  },
                                },
                                {
                                  title: "",
                                  render: (item: UserContractType) => (
                                    <div className='flex flex-row items-center gap-x-1'>
                                      <EditContract contract={item} />
                                      <ContractDetails contract={item} />
                                    </div>
                                  ),
                                },
                              ]}
                            />
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Payments",
                      value: "payments",
                      content: <UserPayments endpoint='/users/me/payments' />,
                    },
                  ]}
                />
              ) : (
                <NotFound title='There is no contract!' className='w-full' />
              )}
              <div className='w-full flex justify-end'>
                <CFullDialog
                  trigger={(open) => (
                    <CotopiaButton
                      onClick={open}
                      className='bg-primary text-white rounded-xl mt-3'
                    >
                      More
                    </CotopiaButton>
                  )}
                >
                  {(close) => {
                    return <PayrollPage onClose={close} />;
                  }}
                </CFullDialog>
              </div>
            </div>
          </PopupBoxChild>
        );
      }}
    </PopupBox>
  );
}
