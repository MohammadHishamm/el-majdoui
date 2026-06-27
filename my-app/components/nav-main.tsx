"use client"

import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react"

import { useAdminT } from "@/components/admin/i18n"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { locale } = useAdminT()
  const isArabic = locale === "ar"

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Collapsible
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton
                    tooltip={item.title}
                    dir={isArabic ? "rtl" : "ltr"}
                  />
                }
              >
                {item.icon && <item.icon className="shrink-0" />}
                <span className="flex-1 truncate text-start">{item.title}</span>
                {isArabic ? (
                  <ChevronLeft
                    className="size-4 shrink-0 transition-transform duration-200 group-data-open/collapsible:-rotate-90"
                    aria-hidden
                  />
                ) : (
                  <ChevronRight
                    className="ms-auto size-4 shrink-0 transition-transform duration-200 group-data-open/collapsible:rotate-90"
                    aria-hidden
                  />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton href={subItem.url}>
                        <span className="text-start">{subItem.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
