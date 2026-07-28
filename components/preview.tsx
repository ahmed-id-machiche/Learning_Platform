"use client";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  return (
    <div className="text-sm text-slate-700 whitespace-pre-wrap">
      {value}
    </div>
  );
};
