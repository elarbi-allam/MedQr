"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
    const [time, setTime] = React.useState({
        hours: date ? date.getHours().toString().padStart(2, "0") : "00",
        minutes: date ? date.getMinutes().toString().padStart(2, "0") : "00",
    });

    const handleTimeChange = (type: "hours" | "minutes", value: string) => {
        const newTime = { ...time, [type]: value };
        setTime(newTime);

        if (date) {
            const newDate = new Date(date);
            newDate.setHours(parseInt(newTime.hours) || 0);
            newDate.setMinutes(parseInt(newTime.minutes) || 0);
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
            setDate(newDate);
        }
    };

    const incrementTime = (type: "hours" | "minutes") => {
        const current = parseInt(time[type]);
        let newValue: number;

        if (type === "hours") {
            newValue = current >= 23 ? 0 : current + 1;
        } else {
            newValue = current >= 59 ? 0 : current + 1;
        }

        handleTimeChange(type, newValue.toString().padStart(2, "0"));
    };

    const decrementTime = (type: "hours" | "minutes") => {
        const current = parseInt(time[type]);
        let newValue: number;

        if (type === "hours") {
            newValue = current <= 0 ? 23 : current - 1;
        } else {
            newValue = current <= 0 ? 59 : current - 1;
        }

        handleTimeChange(type, newValue.toString().padStart(2, "0"));
    };

    // Synchroniser avec la prop date si elle change
    React.useEffect(() => {
        if (date) {
            setTime({
                hours: date.getHours().toString().padStart(2, "0"),
                minutes: date.getMinutes().toString().padStart(2, "0"),
            });
        }
    }, [date]);

    return (
        <div className="flex items-center space-x-2">
            <div className="grid gap-1 text-center">
                <Label htmlFor="hours" className="text-xs">
                    Heures
                </Label>
                <div className="flex flex-col items-center space-y-1">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 w-8 p-0"
                        onClick={() => incrementTime("hours")}
                    >
                        +
                    </Button>
                    <Input
                        id="hours"
                        className="w-16 text-center h-8"
                        value={time.hours}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || (/^\d{0,2}$/.test(value) && parseInt(value) <= 23)) {
                                handleTimeChange("hours", value);
                            }
                        }}
                        onBlur={() => {
                            const hours = parseInt(time.hours) || 0;
                            const validHours = Math.max(0, Math.min(23, hours));
                            handleTimeChange("hours", validHours.toString().padStart(2, "0"));
                        }}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 w-8 p-0"
                        onClick={() => decrementTime("hours")}
                    >
                        -
                    </Button>
                </div>
            </div>

            <div className="flex items-center">
                <Clock className="h-4 w-4" />
            </div>

            <div className="grid gap-1 text-center">
                <Label htmlFor="minutes" className="text-xs">
                    Minutes
                </Label>
                <div className="flex flex-col items-center space-y-1">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 w-8 p-0"
                        onClick={() => incrementTime("minutes")}
                    >
                        +
                    </Button>
                    <Input
                        id="minutes"
                        className="w-16 text-center h-8"
                        value={time.minutes}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || (/^\d{0,2}$/.test(value) && parseInt(value) <= 59)) {
                                handleTimeChange("minutes", value);
                            }
                        }}
                        onBlur={() => {
                            const minutes = parseInt(time.minutes) || 0;
                            const validMinutes = Math.max(0, Math.min(59, minutes));
                            handleTimeChange("minutes", validMinutes.toString().padStart(2, "0"));
                        }}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 w-8 p-0"
                        onClick={() => decrementTime("minutes")}
                    >
                        -
                    </Button>
                </div>
            </div>
        </div>
    );
}
