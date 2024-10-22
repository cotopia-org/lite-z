import { OrgButton } from "@/components/shared-ui";
import OrgRadio from "@/components/shared-ui/o-radio";
import AutocompleteInput from "@/components/shared/autocomplete-input";
import Chips from "@/components/shared/chips";
import { cn, urlWithQueryParams } from "@/lib/utils";
import axiosInstance from "@/services/axios";
import { PersonAutocompleteType, PersonType } from "@/types/person";
import { useFormik } from "formik";
import { CheckIcon } from "lucide-react";

type Props = {
  defaultItems: PersonAutocompleteType[];
  onCancel: () => void;
  onSave: (items: PersonAutocompleteType[], type: "all" | "partials") => void;
};
export default function Content({ defaultItems, onCancel, onSave }: Props) {
  const { values, setFieldValue, handleSubmit } = useFormik<{
    persons: PersonAutocompleteType[];
    type: "all" | "partials";
  }>({
    enableReinitialize: true,
    initialValues: {
      persons: defaultItems,
      type: defaultItems.length === 0 ? "all" : "partials",
    },
    onSubmit: async (values) => {
      let newPersons = [...values.persons];

      if (values.type === "all") {
        const res = await axiosInstance.get(
          urlWithQueryParams(`/person`, { per_page: -1 })
        );
        const persons: PersonType[] = res?.data?.items ?? [];
        newPersons = persons.map((x) => ({
          fullname: x.fullname,
          id: x.id,
          mobile: x.mobile,
          national_code: x.national_code,
        }));
      }

      if (onCancel) onCancel();
      if (onSave) onSave(newPersons, values.type);
    },
  });

  const handleAddPersons = async (person: PersonAutocompleteType) => {
    const prev = values.persons ?? [];

    const prevIds = prev.map((x) => x.id);

    let newPersons: PersonAutocompleteType[] = [];

    if (prevIds.includes(person.id)) {
      newPersons = prev.filter((x) => x.id !== person.id);
    } else {
      newPersons = [...prev, person];
    }

    setFieldValue("persons", newPersons);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-y-8'>
      <p>کد برای چه کسانی قابل استفاده باشد؟</p>
      <OrgRadio
        value={values.type}
        onValueChange={(value) => setFieldValue("type", value)}
        className='gap-y-4'
        items={[
          {
            label: "تمام پرسنل",
            value: "all",
          },
          {
            label: "انتخاب دستی",
            value: "partials",
          },
        ]}
      />
      <div
        className={cn(
          "flex flex-col gap-y-4",
          values.type === "all" ? "pointer-events-none opacity-50" : ""
        )}
      >
        {values.type === "partials" && (
          <AutocompleteInput<PersonAutocompleteType>
            keyToSearch='text'
            endpoint='/person/listing'
            render={(item, close) => {
              const isSelected = !!values.persons.find((x) => x.id === item.id);

              return (
                <div
                  key={item.id}
                  className='flex flex-row items-center gap-x-2 person-item hover:bg-black/5 p-2 cursor-pointer'
                  onClick={async () => {
                    await handleAddPersons(item);
                    close();
                  }}
                >
                  {!!isSelected && <CheckIcon size={16} />}
                  {item.fullname}
                </div>
              );
            }}
            variant='filled'
            label='نام پرسنل یا شماره موبایل'
          />
        )}
        <Chips
          items={values.persons.map((item) => ({
            label: item.fullname,
            value: item.id,
          }))}
          onRemove={(value) =>
            setFieldValue(
              "persons",
              values.persons.filter((x) => x.id !== value)
            )
          }
          limitShow={5}
        />
      </div>
      <div className='flex flex-row items-center justify-between'>
        <OrgButton onClick={onCancel} className='w-auto' variant={"outline"}>
          انصراف
        </OrgButton>
        <OrgButton className='w-auto'>ذخیره</OrgButton>
      </div>
    </form>
  );
}
