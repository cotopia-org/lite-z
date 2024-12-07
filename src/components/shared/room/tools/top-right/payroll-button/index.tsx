import CotopiaButton from "@/components/shared-ui/c-button";
import PopupBox from "@/components/shared/popup-box";
import PopupBoxChild from "@/components/shared/popup-box/child";
import ToolButton from "../../tool-button";
import ExpectedPayments from "./expected-payments";
import PreviousPayments from "./previous-payments";
import CTabs from "@/components/shared-ui/c-tabs";
import { MoneyRecive } from "@/components/icons";
import UserContract from "./user-contract";
import CFullDialog from "@/components/shared-ui/c-dialog/full-dialog";
import PayrollPage from "@/pages/cotopia-payroll/user/payroll";

export default function PayrollButton() {
  const currentURL = typeof window !== "undefined" ? window.location.href : "";
  const url = currentURL ? new URL(currentURL).origin : "";

  return (
    <PopupBox
      trigger={(open, isOpen) => (
        <ToolButton
          isOpen={isOpen}
          startIcon={<MoneyRecive size={20} />}
          open={open}
        >
          <ExpectedPayments />
        </ToolButton>
      )}
    >
      {(triggerPosition, open, close) => {
        let content = (
          <CTabs
            defaultValue='details'
            items={[
              {
                title: "Details",
                content: (
                  <>
                    <div className='w-full my-4 flex items-center justify-between px-2'>
                      <h3 className='text-lg font-semibold'>
                        Expected Payment
                      </h3>
                      <ExpectedPayments />
                    </div>
                    <hr />
                    <PreviousPayments />

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
                  </>
                ),
                value: "details",
              },
              {
                title: "Contract",
                content: <UserContract />,
                value: "contract",
              },
            ]}
          />
        );

        return (
          <PopupBoxChild
            onClose={close}
            title='Payroll'
            width={506}
            zIndex={triggerPosition.zIndex}
            top={triggerPosition.top}
            left={300}
          >
            <div className='flex w-full flex-col gap-y-6 items-end'>
              {content}
            </div>
          </PopupBoxChild>
        );
      }}
    </PopupBox>
  );
}
