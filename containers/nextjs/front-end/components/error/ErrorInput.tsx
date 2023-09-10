import { AlertCircle } from "lucide-react";

interface errorInputProps {
  message?: string | null;
  type?: string | null;
  className?: string;
}
export const ErrorInput = ({ message = null, type = "error", className = "" }: errorInputProps) => {
    type;
  const containtMsg = (
    <div className={`text-sm text-[#F2F7A1] flex gap-2 mt-1 ${className}`} >
      <AlertCircle color="red" /> <span>{message}</span>
    </div>
  );

  return <>{message === null ? "" : containtMsg}</>;
};
