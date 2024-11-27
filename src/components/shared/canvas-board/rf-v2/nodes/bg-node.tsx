import { useRoomContext } from "@/components/shared/room/room-context";

export default function BgNode({ data }: any) {
  const { room } = useRoomContext();

  return (
    <div
      className='flex flex-col pointer-events-none z-0'
      style={{
        width: 4000,
        height: 2160,
        backgroundImage: `url(${room?.background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
}
