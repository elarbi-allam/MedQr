"use client";

import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Circle, ChevronRight } from "lucide-react";
import { VerificationPhase } from "@/features/enterprise/verification/types/verification.type";

interface VerificationProgressProps {
    currentPhase: VerificationPhase;
    className?: string;
}

export function VerificationProgress({ currentPhase, className = "" }: VerificationProgressProps) {
    const steps = [
        { name: "Entreprise", phase: VerificationPhase.ENTERPRISE_CREATION },
        { name: "Documents", phase: VerificationPhase.DOCUMENT_UPLOAD },
        { name: "Vérification", phase: VerificationPhase.VERIFICATION_PENDING },
    ];

    const currentStepIndex = steps.findIndex((step) => step.phase === currentPhase);
    const progressValue = ((currentStepIndex + 1) / steps.length) * 100;

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    // const isUpcoming = index > currentStepIndex;

                    return (
                        <div key={step.name} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                                        isCompleted
                                            ? "bg-green-500 border-green-500 text-white"
                                            : isCurrent
                                              ? "bg-blue-500 border-blue-500 text-white"
                                              : "border-gray-300 text-gray-400"
                                    }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : isCurrent ? (
                                        <Clock className="w-4 h-4" />
                                    ) : (
                                        <Circle className="w-4 h-4" />
                                    )}
                                </div>
                                <span
                                    className={`text-xs mt-2 font-medium ${
                                        isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
                                    }`}
                                >
                                    {step.name}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <ChevronRight
                                    className={`w-4 h-4 mx-4 ${isCompleted ? "text-green-500" : "text-gray-300"}`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            <Progress value={progressValue} className="h-2" />
        </div>
    );
}
