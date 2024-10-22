import ModalContentWrapper from "@/components/partials/modal/content-wrapper";
import { OrgButton, OrgIconButton } from "@/components/shared-ui";
import ORawDialog from "@/components/shared-ui/o-dialog/raw-dialog";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/slices/auth/slice";
import { LogOut, LogOutIcon } from "lucide-react";

type Props = {
  justIcon?: boolean;
};

export default function LogoutButton({ justIcon = false }: Props) {
  const dispatch = useAppDispatch();

  const handleLogout = () => dispatch(logout());

  return (
    <ORawDialog
      trigger={(open) =>
        justIcon ? (
          <OrgIconButton onClick={open}>
            <LogOut />
          </OrgIconButton>
        ) : (
          <OrgButton variant={"link"} startIcon={<LogOut />} onClick={open}>
            خروج از حساب کاربری
          </OrgButton>
        )
      }
    >
      {(close) => (
        <ModalContentWrapper onClose={close}>
          <div className='flex flex-col gap-y-12 items-center w-[340px] max-w-full mx-auto pb-8'>
            <div className='flex flex-col rounded-full w-[96px] h-[96px] items-center justify-center bg-red-100 text-red-700'>
              <LogOutIcon size={40} />
            </div>
            <strong className='text-2xl font-medium'>خروج از حساب</strong>
            <p className='text-label text-base font-normal text-center'>
              کاربر گرامی، آیا قصد خروج از حساب خود را دارید؟
            </p>
            <div className='flex flex-row items-center justify-between w-full'>
              <OrgButton
                onClick={close}
                variant={"outline"}
                className='w-auto px-6 h-[64px]'
              >
                انصراف
              </OrgButton>
              <OrgButton
                variant={"default"}
                className='w-auto px-6 h-[64px]'
                onClick={handleLogout}
              >
                خروج از حساب
              </OrgButton>
            </div>
          </div>
        </ModalContentWrapper>
      )}
    </ORawDialog>
  );
}
