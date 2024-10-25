import WorkspaceList from "@/components/shared/room/components/workspace-button/workspaces";
import JoinWorkspaceWithLink from "./components/join-with-link";

export default function HomePage() {
  return (
    <div className='max-w-full w-[500px] mx-auto px-4 md:px-0 flex flex-col gap-y-8 py-8'>
      <div className='flex flex-col gap-y-4 w-full'>
        <div className='w-full'>
          <h1 className='md:font-medium text-black 2xs:text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center'>
            Welcome to CotopiaLite
          </h1>
          <p className='font-normal xs:text-small sm:text-base md:text-lg text-gray-700 text-center'>
            Connecting everyone through video conferencing with CotopiaLite.
          </p>
        </div>
        <JoinWorkspaceWithLink />
      </div>
      <WorkspaceList className='!p-0' />
    </div>
  );
}
