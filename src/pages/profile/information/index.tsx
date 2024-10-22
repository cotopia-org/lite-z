import NormalPageHolder from "@/components/containers/normal-page-holder";
import EditPasswordButton from "./edit-password-button";
import EditInformation from "./edit-information";

export default function InformationPage() {
  return (
    <NormalPageHolder
      title='اطلاعات سازمان'
      actionNode={<EditPasswordButton />}
    >
      <div className='grid grid-cols-12 mb-12'>
        <div className='col-span-12 md:col-span-6'>
          <EditInformation />
        </div>
        <div className='col-span-12 md:col-span-6 flex flex-col items-center justify-center'>
          <img src='/assets/images/profile-image.jpg' alt='' />
        </div>
      </div>
      <div className='hint text-lg text-label font-light'>
        در صورت مغایرت هر کدام از اطلاعات سازمان، با شماره{" "}
        <strong className='text-black font-bold' dir='ltr'>
          021-1111
        </strong>{" "}
        تماس بگیرید.
      </div>
    </NormalPageHolder>
  );
}
