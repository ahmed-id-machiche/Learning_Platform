"use client";

import { Textarea } from "@/components/ui/textarea";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const Editor = ({ onChange, value }: EditorProps) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write a description for your chapter..."
      className="bg-white"
    />
  );
};
