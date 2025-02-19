import { create } from "zustand";

type AcademicYear = {
  id: string;
  label: string;
  yearStart: Date;
  yearEnd: Date;
};

type UseAcademicYear = {
  academicYear: AcademicYear | undefined;
  setActiveYear: (academicYear: AcademicYear) => void;
};

export const useAcademicYear = create<UseAcademicYear>((set) => ({
  academicYear: undefined,
  setActiveYear: (academicYear: AcademicYear) =>
    set((state) => ({ ...state, academicYear })),
}));
