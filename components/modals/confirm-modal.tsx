"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
}

export const ConfirmModal = ({
  children,
  onConfirm,
}: ConfirmModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <span onClick={() => setIsOpen(true)}>{children}</span>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4 m-4">
            <h3 className="text-lg font-semibold">Are you absolutely sure?</h3>
            <p className="text-sm text-slate-600">
              This action cannot be undone. This will permanently delete your chapter.
            </p>
            <div className="flex items-center justify-end gap-x-2">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsOpen(false);
                  onConfirm();
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
