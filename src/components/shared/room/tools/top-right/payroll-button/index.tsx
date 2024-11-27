import CotopiaButton from "@/components/shared-ui/c-button";
import PopupBox from "@/components/shared/popup-box";
import PopupBoxChild from "@/components/shared/popup-box/child";
import ToolButton from "../../tool-button";
import ExpectedPayments from "./expected-payments";
import PreviousPayments from "./previous-payments";
import CTabs from "@/components/shared-ui/c-tabs";
import { MoneyRecive } from "@/components/icons";

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
                    <div className="w-full my-4 flex items-center justify-between px-2">
                      <h3 className="text-lg font-semibold">Expected Payment</h3>
                      <ExpectedPayments />
                    </div>
                    <hr />
                    <PreviousPayments />

                    <div className="w-full flex justify-end">
                      <CotopiaButton
                        className="bg-primary text-white rounded-xl mt-3"
                      >
                        <a href={`${url}/payroll`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-x-5">
                          More
                        </a>
                      </CotopiaButton>
                    </div>
                  </>
                ),
                value: "details",
              },
              {
                title: "Contract",
                content: (
                  <h1>user contract .....</h1>
                ),
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
            left={triggerPosition.left}
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
