import CotopiaButton from "@/components/shared-ui/c-button";
import ModalBox, { FullModalBox } from "@/components/shared/modal-box";
import React from "react";
import AddChannelForm from "./form";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import { Plus } from "lucide-react";
import AddChatNew from "./new";

type Props = {
  workspace_id: string | number;
};

export default function AddChat({ workspace_id }: Props) {
  return <AddChatNew />;
}
