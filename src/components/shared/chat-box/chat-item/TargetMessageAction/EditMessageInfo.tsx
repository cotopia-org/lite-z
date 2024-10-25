import { useCallback } from "react";
import { Pencil } from "lucide-react";
import TargetMessageAction from ".";
import colors from "tailwindcss/colors";

interface Props {
  title: string;
  desc: string;
  onSelect?: () => void;
  onClose: () => void;
}

const EditMessageInfo = ({ desc, title, onClose, onSelect }: Props) => {
  const selectInfoHandler = useCallback(() => {
    if (onSelect) onSelect();
  }, [onSelect]);

  return (
    <TargetMessageAction
      beforeNode={<Pencil color={colors.blue[700]} size={18} />}
      title={title}
      description={desc}
      onClose={onClose}
      onSelect={selectInfoHandler}
    />
  );
};

export default EditMessageInfo;
