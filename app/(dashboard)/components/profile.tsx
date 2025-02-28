"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { MdPerson } from "react-icons/md";

const Profile = () => {
  const { data: session } = useSession();

  const profileData = [
    {
      label: "Nama",
      value: session?.user.username,
    },
    {
      label: "Email",
      value: session?.user.email,
    },
    {
      label: "Role",
      value: session?.user.role,
    },
    {
      label: "Password",
      value: "******",
    },
  ];

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Profil Pengguna</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center gap-16">
        <div>
          <div className="size-32 flex items-center justify-center rounded-xl overflow-hidden bg-main-2/10">
            <MdPerson className="size-32 text-main-2" />
          </div>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {profileData.map((pd) => (
            <div
              key={pd.label}
              className="rounded-md border p-4 flex items-center"
            >
              <div className="basis-[30%] text-sm font-semibold">
                {pd.label}
              </div>
              <div className="flex-1 text-sm">{pd.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
