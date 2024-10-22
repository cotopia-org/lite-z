import { Link } from "react-router-dom"

function Footer() {
  return (
    <div className="p-4 w-full lg:grid lg:grid-cols-6">
      <div className="col-span-1" />
      <p className="text-center col-span-4 text-[14px] text-gray-600 mb-4 lg:mb-0">
        کلیه حقوق مادی و معنوی متعلق به موسسه روانشناسی باتاب هزاره فردا
        می‌باشد.
      </p>
      <div className="col-span-1 w-[150px] mx-auto">
        <Link to={`https://zemtrix.com`} target="_blank">
          <img
            src={"/assets/images/powered-by-zemtrix.svg"}
            alt="zemtrix_logo"
            className="w-full"
          />
        </Link>
      </div>
    </div>
  )
}

export default Footer
