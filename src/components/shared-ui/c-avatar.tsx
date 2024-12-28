import { AvatarProps } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRandomColor } from "@/lib/utils";
import { BellOff } from "lucide-react";
import { ReactNode } from "react";

type Props = AvatarProps & {
  title?: string;
  src?: string;
  date?: number;
  icon?: ReactNode;
  status?: ReactNode;
};

export default function CotopiaAvatar({
  title,
  src,
  date,
  icon,
  status,
  ...rest
}: Props) {
  return (
    <div>
      <Avatar {...rest}>
        <AvatarImage
          draggable={false}
          className="object-cover object-center"
          src={src}
        />
        <AvatarFallback
          className={`avatar-fallback uppercase text-white`}
          style={{ backgroundColor: getRandomColor(date) }}
        >
          {title}
        </AvatarFallback>
      </Avatar>
      {status && (
        <div className={"relative"}>
          <div
            className={
              "absolute bottom-0 right-0 border-2 border-white bg-white text-black w-3 h-3  rounded-full flex justify-center items-center"
            }
          >
            {status}
          </div>
        </div>
      )}
      {icon && (
        <div className={"relative"}>
          <div
            className={
              "absolute bottom-0 left-0 border-2 border-white bg-white text-black w-4 h-4  rounded-full flex justify-center items-center"
            }
          >
            {icon}
          </div>
        </div>
      )}
    </div>
  );
}
