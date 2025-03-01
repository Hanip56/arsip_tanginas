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
import { generateRegisterSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
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
};

const UpdateOwnProfileModal = ({ open, handleClose }: Props) => {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const router = useRouter();

  const RegisterSchema = generateRegisterSchema("UPDATE");
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: user?.username ?? "",
      email: user?.email ?? "",
      password: "",
      passwordConfirmation: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      setError("");
    }
  }, [open, form]);

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
      const successMessage = "Berhasil diperbarui";

      const res = await axios.put(`/api/user/${user?.id}`, body);

      if (res.status == 200) {
        await update(res.data);
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
      title={"Rubah profil"}
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
          <Button disabled={isLoading}>Ubah</Button>
        </form>
      </Form>
    </Modal>
  );
};

export default UpdateOwnProfileModal;
