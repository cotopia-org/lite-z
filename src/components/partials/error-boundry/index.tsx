import { paths } from "@/routes/paths";
import { Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
export default function ErrorElement() {
  const navigate = useNavigate();

  const backToHome = () => navigate(paths.home);

  const reloadThePage = () => window.location.reload();

  return (
    <div
      role='alert'
      className='p-4 bg-red-100 text-red-700 rounded w-[700px] max-w-full mx-auto my-8 flex flex-col gap-y-4 items-center'
    >
      <h2 className='text-lg font-semibold'>خطایی صورت گرفته است!</h2>
      <div className='flex flex-row items-center gap-x-2'>
        <Button className='mt-4 p-2 rounded' onClick={backToHome} color='gray'>
          بازگشت به خانه
        </Button>
        <Button
          className='mt-4 p-2 rounded'
          onClick={reloadThePage}
          color='red'
        >
          درخواست دوباره
        </Button>
      </div>
    </div>
  );
}
