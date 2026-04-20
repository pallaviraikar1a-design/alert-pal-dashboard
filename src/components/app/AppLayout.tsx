import { Outlet, Link } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Package, Bell, Tag, Truck, Settings, Hourglass } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const items = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, end: true },
  { title: "Inventory", url: "/app/inventory", icon: Package },
  { title: "Alerts", url: "/app/alerts", icon: Bell },
  { title: "Categories", url: "/app/categories", icon: Tag },
  { title: "Suppliers", url: "/app/suppliers", icon: Truck },
  { title: "Settings", url: "/app/settings", icon: Settings },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-4 py-5 flex items-center gap-2 font-display font-bold">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-pill shadow-pill">
            <Hourglass className="h-4 w-4 text-accent" />
          </span>
          {!collapsed && <span className="text-sm">Expiry Manager <span className="text-accent">Pro</span></span>}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className="hover:bg-sidebar-accent rounded-md"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center gap-3 px-4 border-b border-border/60 bg-background/60 backdrop-blur">
            <SidebarTrigger />
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to site</Link>
          </header>
          <main className="flex-1 p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
