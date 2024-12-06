import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {cn} from "@/lib/utils";
import {ReactNode} from "react";

type Tab = {
    value: string;
    title?: ReactNode;
    icon?: ReactNode;
    content: ReactNode;
    badge?: boolean;
};

type Props = {
    title?: ReactNode;
    items: Tab[];
    className?: string;
    titleClassName?: string;
    defaultValue?: string;
    dividerBetweenContentAndTabs?: boolean;
    onChangeTab?: (tab: string) => void;
    stickyTab?: boolean;
};

export default function CTabs({
                                  defaultValue,
                                  title,
                                  items,
                                  className,
                                  titleClassName,
                                  dividerBetweenContentAndTabs = false,
                                  stickyTab = false,
                                  onChangeTab,
                              }: Props) {
    let clss = "w-full flex flex-col";

    if (dividerBetweenContentAndTabs) clss += ` gap-y-4`;
    if (className) clss += ` ${className}`;

    const handleChangeTab = (value: string) => {
        if (onChangeTab) onChangeTab(value);
    };

    return (
        <Tabs
            defaultValue={defaultValue}
            className={clss}
            onValueChange={handleChangeTab}
        >
            <div
                className={cn(
                    "tab-holder flex flex-row items-center justify-between",
                    stickyTab ? "sticky top-0 z-10 bg-background" : ""
                )}
            >
                <TabsList className='tabs-list flex flex-row gap-x-2 justify-start bg-transparent'>
                    {items.map((x) => (

                        <TabsTrigger
                            value={x.value}
                            key={x.value}
                            className='min-w-[48px] min-h-[48px] relative rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white [&_svg_path]:data-[state=active]:stroke-white'
                        >
                            <div className={''}>
                                {x.icon ? x.icon : x.title}


                                {x.badge &&
                                    <div className='absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full'></div>}
                            </div>
                        </TabsTrigger>
                    ))}
                </TabsList>


                {!!title && typeof title === "string" ? (
                    <strong className={titleClassName ?? ""}>{title}</strong>
                ) : (
                    title
                )}
            </div>

            {!!dividerBetweenContentAndTabs && <hr/>}
            {items.map((x) => (
                <TabsContent value={x.value} key={x.value} className='tab-content'>
                    {x.content}
                </TabsContent>
            ))}
        </Tabs>
    );
}
