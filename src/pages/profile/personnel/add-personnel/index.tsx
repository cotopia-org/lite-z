import { createContext, useContext } from "react";
import AddPersonnelGroup from "./group";
import AddPersonnelSingle from "./single";
import { PersonType } from "@/types/person";

type PersonnelType = "single" | "group";

type Props = {
  onAdded?: (personnel: PersonType) => void;
  type: PersonnelType;
  onClose: () => void;
};

const AddPersonnelContext = createContext<{
  onAdd?: (personnel: PersonType) => void;
  onClose: () => void;
}>({ onAdd: undefined, onClose: () => {} });

export const useAddPersonnel = () => useContext(AddPersonnelContext);

export default function AddPersonnel({ type, onAdded, onClose }: Props) {
  let content = null;

  if (type === "single") content = <AddPersonnelSingle />;
  if (type === "group") content = <AddPersonnelGroup />;

  return (
    <AddPersonnelContext.Provider value={{ onAdd: onAdded, onClose }}>
      {content}
    </AddPersonnelContext.Provider>
  );
}
