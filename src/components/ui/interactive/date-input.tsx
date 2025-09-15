"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/interactive/button"
import { Calendar } from "@/components/ui/data/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/general/popover"

export function DateInput({ hintText, onDateChange }: { hintText: string, onDateChange?: (date: Date) => void }) {

    //State
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)

    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="w-48 font-normal flex justify-between items-center"
                    >
                        <span className="text-left">{date ? date.toLocaleDateString("pt-PT").replaceAll('/', '-') : hintText}</span>
                        <span className="ml-auto flex-shrink-0"><ChevronDownIcon /></span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {

                            //Set Date
                            setDate(date)

                            //Close Popover
                            setOpen(false)

                            //Call onDateChange if Provided
                            if (onDateChange) {
                                onDateChange(date ?? new Date())
                            }
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
