import AddChatNew from "./new";

type Props = {
  workspace_id: string | number;
};

export default function AddChat({ workspace_id }: Props) {
  return <AddChatNew />;
}
