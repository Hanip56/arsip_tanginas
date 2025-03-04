"use client";

import { FormError } from "@/components/form-error";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateRegisterSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData?: User;
};

const UpsertUserModal = ({ open, handleClose, initialData }: Props) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const router = useRouter();

  const RegisterSchema = generateRegisterSchema(
    initialData ? "UPDATE" : "CREATE"
  );
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: initialData?.username ?? "",
      email: initialData?.email ?? "",
      password: "",
      passwordConfirmation: "",
      role: initialData?.role ?? "USER",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      setError("");
    }
  }, [open, form]);

  useEffect(() => {
    if (initialData) {
      form.setValue("username", initialData.username);
      form.setValue("email", initialData?.email ?? "");
      form.setValue("role", initialData?.role ?? "USER");
    }
  }, [initialData, form, open]);

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    try {
      setError("");

      if (values.password !== values.passwordConfirmation) {
        setError("Password konfirmasi tidak sama");
        return;
      }

      setIsLoading(true);
      const body = {
        ...values,
      };
      const successMessage = initialData
        ? "User telah dirubah"
        : "User telah dibuat";

      if (initialData) {
        // update
        await axios.put(`/api/user/${initialData.id}`, body);
      } else {
        // create
        await axios.post(`/api/auth/register`, body);
      }

      toast.success(successMessage);
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["users"],
        exact: false,
      });
      handleClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data || "Gagal membuat user";
      console.log(error);
      toast.error(errorMessage);
    }

    setIsLoading(false);
  };

  const disabledCondition = isLoading;

  return (
    <Modal
      title={initialData ? "Rubah pengguna" : "Buat pengguna"}
      description=""
      isOpen={open}
      onClose={handleClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    disabled={disabledCondition}
                    {...field}
                    placeholder="Jane doe"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="janedoe@example.com"
                    disabled={disabledCondition}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {session?.user.role === "SUPERADMIN" &&
            initialData?.role !== "SUPERADMIN" && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(e) => field.onChange(e)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">USER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="LAPANGAN">LAPANGAN</SelectItem>
                          <SelectItem value="KONSULTAN">KONSULTAN</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="******"
                    disabled={disabledCondition}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmation password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="******"
                    disabled={disabledCondition}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="my-1">
            <FormError message={error} />
          </div>
          <Button disabled={isLoading}>
            {initialData ? "Rubah" : "Tambah"}
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default UpsertUserModal;
