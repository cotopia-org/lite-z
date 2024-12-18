import CotopiaButton from "@/components/shared-ui/c-button"
import CotopiaDropdown from "@/components/shared-ui/c-dropdown"
import CotopiaInput from "@/components/shared-ui/c-input"
import { DropdownMenu } from "@/components/ui/dropdown"
import axiosInstance, { FetchDataType } from "@/services/axios"
import { WorkspaceRoomShortType } from "@/types/room"
import { useFormik } from "formik"
import { toast } from "sonner"
import * as Yup from "yup"

type Props = {
  workspace_id: string
  onSubmit?: () => void
  onCreated: (room: WorkspaceRoomShortType) => void
}
export default function AddRoomForm({
  workspace_id,
  onSubmit,
  onCreated,
}: Props) {
  const {
    values,
    touched,
    errors,
    isSubmitting,
    getFieldProps,
    setFieldValue,
    handleSubmit,
  } = useFormik({
    initialValues: {
      title: "",
      type: "flow",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Title is required"),
      type: Yup.string().required("Type is required"),
    }),
    onSubmit: async (values, actions) => {
      actions.setSubmitting(true)
      try {
        const res = await axiosInstance.post<
          FetchDataType<WorkspaceRoomShortType>
        >(`/rooms`, {
          workspace_id,
          title: values.title,
          type: values.type,
        })
        toast.success("Room has been created in your workspace.")
        if (onCreated) onCreated(res.data.data)
        actions.setSubmitting(false)
        if (onSubmit) onSubmit()
      } catch (e) {
        actions.setSubmitting(false)
      }
    },
  })

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start gap-y-6">
      <CotopiaInput
        {...getFieldProps("title")}
        placeholder="Enter the room title"
        label="Room title"
        hasError={!!touched.title && !!errors.title}
        helperText={!!touched.title && !!errors.title && errors.title}
      />
      <CotopiaDropdown
        items={[
          { title: "flow", value: "flow" },
          { title: "grid", value: "grid" },
        ]}
        label="Room type"
        defaultValue={values.type}
        onSelect={(item) => setFieldValue("type", item.value)}
        triggerClassName="h-10 w-[200px]"
      />
      <CotopiaButton
        type="submit"
        className="w-full"
        disabled={!values.title}
        loading={isSubmitting}
      >
        Create
      </CotopiaButton>
    </form>
  )
}
