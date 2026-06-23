"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const EmployeeProfileWizard = dynamic(
  () => import("@/app/apply/components/EmployeeProfileWizard"),
  { ssr: false }
);

export default function ApplyFormPage() {
  const router = useRouter();

  return (
    <EmployeeProfileWizard onClose={() => router.push("/")} />
  );
}
