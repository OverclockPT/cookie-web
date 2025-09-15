import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils/utils";
import { CheckIcon } from "lucide-react";

type DropdownMenuCheckboxItemProps = React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & {
    checkedIcon?: React.ReactNode;
    uncheckedIcon?: React.ReactNode;
};

export function DropdownMenuCheckboxItem({
    className,
    children,
    checked,
    checkedIcon,
    uncheckedIcon,
    ...props
}: DropdownMenuCheckboxItemProps) {
    return (
        <DropdownMenuPrimitive.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            className={cn(
                "focus:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none",
                className
            )}
            checked={checked}
            {...props}
        >
            <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
                {checked
                    ? checkedIcon ?? <CheckIcon className="size-4" />
                    : uncheckedIcon ?? null}
            </span>
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    );
}