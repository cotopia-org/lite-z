import { ReactNode } from "react";
import MicButtonHandler from "./mic";
import TextButtonHandler from "./text";
import CotopiaIconButton from "@/components/shared-ui/c-icon-button";

type Props = {
  text: string;
  icon?: ReactNode
};
export default function SendHandlerButton({ text, icon }: Props) {
  let content = <MicButtonHandler />;

  if (text) content = <TextButtonHandler />;

  if ( icon ) content = <CotopiaIconButton type="submit" className="text-primary">{icon}</CotopiaIconButton>

  return <>{content}</>;
}
