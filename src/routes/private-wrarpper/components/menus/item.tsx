import CotopiaButton from "@/components/shared-ui/c-button"
import DashboardMenus, { DashboardMenuItemType } from "."
import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

type Props = {
  item: DashboardMenuItemType
  isChild?: boolean
}

export default function DashboardMenuItem({ item, isChild = false }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (item?.showByDefault !== undefined) setIsOpen(item.showByDefault)
  }, [item?.showByDefault])

  const navigate = useNavigate()
  const location = useLocation()
  const isSelected = location.pathname.includes(item.href)

  //has child
  const hasChild = !!item?.children

  const handleClickMenu = () => {
    //Means item is normal menu without any children
    if (!hasChild) {
      navigate(item.href)
      return
    }

    setIsOpen((prev) => !prev)
  }

  let buttonClass = "w-full justify-between"
  if (isSelected && isChild) buttonClass += ` text-primary`
  if (isSelected && !isChild)
    buttonClass += ` !bg-primaryBackground text-primary`

  let buttonIcon = item.icon

  if (isChild) {
    if (isSelected) {
      buttonIcon = <div className="w-2 h-2 mr-2 bg-primary rounded-full"></div>
    } else {
      buttonIcon = <div className="w-2 h-2 mr-2"></div>
    }
  }

  return (
    <div className="flex flex-col items-start w-full">
      <CotopiaButton
        variant={isSelected ? (isChild ? "ghost" : "default") : "ghost"}
        startIcon={buttonIcon}
        className={buttonClass}
        endIcon={
          !!hasChild ? isOpen ? <ChevronUp /> : <ChevronDown /> : undefined
        }
        onClick={handleClickMenu}
      >
        {item.title}
      </CotopiaButton>
      {hasChild && isOpen && (
        <div className="py-2 pl-4 w-full">
          <DashboardMenus
            items={item.children as DashboardMenuItemType[]}
            isChild
          />
        </div>
      )}
      {!!item?.after && (
        <div className="flex flex-col w-full pt-2 mt-2 border-t">
          {item.after}
        </div>
      )}
    </div>
  )
}
