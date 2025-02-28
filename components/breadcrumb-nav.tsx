"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const BreadcrumbNav = () => {
  const pathname = usePathname();
  const splitedPathname = pathname.split("/");

  const history = splitedPathname
    .filter((_, i) => i !== 0)
    .map((route, idx) => ({
      href: splitedPathname.filter((_, i) => idx >= i - 1).join("/"),
      label: route
        .split("-")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" "),
    }));

  const routes = [
    {
      href: "/",
      label: "Dashboard",
    },
    ...history,
  ];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {routes.map((route, i) => {
          return i !== routes.length - 1 ? (
            <Fragment key={route.href}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="text-primary/60 hover:text-primary"
                >
                  <Link href={route.href}>{route.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-primary/60" />
            </Fragment>
          ) : (
            <BreadcrumbItem key={route.href}>
              <BreadcrumbPage className="text-primary">
                {route.label}
              </BreadcrumbPage>
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
