import { toast } from "sonner";

export const toastSuccess = (title: string, desc: string = "") => {
  toast(title, {
    description: desc,
    classNames: {
      title: "text-main-2 font-semibold",
      description: "text-slate-600",
    },
  });
};
