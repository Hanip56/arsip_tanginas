"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { MdPerson } from "react-icons/md";
import UpdateOwnProfileModal from "./update-own-profile-modal";

const Profile = () => {
  const { data: session } = useSession();
  const [openEdit, setOpenEdit] = useState(false);

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
    <>
      <UpdateOwnProfileModal
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
      />
      <Card className="w-full h-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Profil Pengguna</CardTitle>
            <Button
              variant={"secondary"}
              size="sm"
              className="text-xs bg-main-2/10 text-main-2 font-semibold"
              onClick={() => setOpenEdit(true)}
            >
              <EditIcon className="size-4" />
            </Button>
          </div>
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
    </>
  );
};

export default Profile;
