import * as Yup from "yup";
import { useFormik } from "formik";
import axiosInstance from "@/services/axios";
import { toast } from "sonner";
import CotopiaInput from "@/components/shared-ui/c-input";
import CotopiaButton from "@/components/shared-ui/c-button";
import { useRoomContext } from "@/components/shared/room/room-context";
import { useAppDispatch } from "@/store";
import { ChatType } from "@/types/chat2";
import { addNewChat } from "@/store/slices/chat-slice";
import { __BUS } from "@/const/bus";
import { dispatch as busDispatch } from "use-bus";
type Props = {
  onCreated: () => void;
};
export default function AddGroupForm({ onCreated }: Props) {
  const dispatch = useAppDispatch();
  const { workspace_id } = useRoomContext();

  const { isSubmitting, touched, errors, getFieldProps, handleSubmit } =
    useFormik({
      enableReinitialize: true,
      initialValues: {
        title: "",
      },
      validationSchema: Yup.object().shape({
        title: Yup.string().required("Title is required"),
      }),
      onSubmit: (values, actions) => {
        actions.setSubmitting(true);
        axiosInstance
          .post(`/chats/createGroup`, { ...values, workspace_id })
          .then((res) => {
            const chat: ChatType = res.data.data;

            dispatch(addNewChat(chat));

            busDispatch({
              type: __BUS.selectChat,
              chat,
            });

            actions.setSubmitting(false);
            toast.success("Your group has been created.");
            if (onCreated) onCreated();
          })
          .catch((err) => {
            actions.setSubmitting(false);
          });
      },
    });

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-y-8'>
      <CotopiaInput
        {...getFieldProps("title")}
        placeholder='Title'
        hasError={!!touched.title && !!errors.title}
        helperText={!!touched.title && !!errors.title && errors.title}
      />
      <CotopiaButton
        loading={isSubmitting}
        type='submit'
        className='w-[100px] max-w-full'
      >
        Submit
      </CotopiaButton>
    </form>
  );
}
