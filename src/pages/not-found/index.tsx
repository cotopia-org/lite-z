import Logo from "@/components/shared/logo";
import { routeResolver } from "@/lib/utils";
import { paths } from "@/routes/paths";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className='h-screen w-screen relative'>
      <div className='flex flex-col gap-y-4 items-center justify-center'>
        <Logo />
        <strong className='text-4xl font-bold'>404</strong>
        <p>There is nothing here!</p>
        <Link to={routeResolver(paths.dashboard)}>Back to dashboard</Link>
      </div>
    </div>
  );
}
