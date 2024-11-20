import BlurFade from "@/components/magicui/blur-fade";

export default function Reactions() {
  return (
    <div className='flex flex-row items-center gap-x-4 w-[240px] px-6 py-4 overflow-x-auto bg-gray-700 rounded-full shadow-md'>
      {["❤️", "✨", "🔥", "😊", "⭐", "😭", "🎉"].map((item, index) => (
        <BlurFade
          inView
          key={index}
          delay={0.01 + index * 0.05}
          className='flex !w-6 !h-4 items-center justify-center'
        >
          <button className='relative top-1 text-2xl'>{item}</button>
        </BlurFade>
      ))}
    </div>
  );
}
