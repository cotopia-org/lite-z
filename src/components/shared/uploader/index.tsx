import { OrgButton } from "@/components/shared-ui";
import { CloudUpload, X } from "lucide-react";
import { ChangeEvent, Fragment, useState } from "react";

export type UploaderProps = {
  title: string;
  formats?: string[];
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  backToNormalState?: () => void;
};

export default function Uploader({
  title,
  formats = ["image/jpg", "image/png", "image/gif", "video/mp4"],
  onChange,
  backToNormalState,
}: UploaderProps) {
  const [file, setFile] = useState<File>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleBack = () => {
    setFile(undefined);
    if (backToNormalState) backToNormalState();
  };

  let content = (
    <Fragment>
      <OrgButton type='button' startIcon={<CloudUpload />} variant={"outline"}>
        {title}
      </OrgButton>
      <input
        type='file'
        placeholder=''
        className='absolute top-0 left-0 w-full h-full cursor-pointer opacity-0'
        onChange={handleChange}
        accept={formats.join(", ")}
      />
    </Fragment>
  );

  if (file) {
    content = (
      <OrgButton
        endIcon={<X size={16} />}
        onClick={handleBack}
        variant={"outline"}
        type='button'
      >
        {`${file?.name}`}
      </OrgButton>
    );
  }

  return <div className='relative uploader-holder'>{content}</div>;
}
