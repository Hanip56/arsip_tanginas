import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal, ScanSearch, Trash } from "lucide-react";
import Link from "next/link";
import { UpdateIcon } from "@radix-ui/react-icons";

type Props = {
  detailHref?: string;
  handleUpdate: () => void;
  handleDelete: () => void;
};

const RowOptionGeneral = ({
  detailHref,
  handleUpdate,
  handleDelete,
}: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-8 h-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {detailHref && (
          <DropdownMenuItem asChild>
            <Link href={detailHref} className="flex items-center">
              <ScanSearch className="mr-2 size-4" /> Detail
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleUpdate}>
          <UpdateIcon className="mr-2 size-4" /> Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash className="mr-2 size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowOptionGeneral;
