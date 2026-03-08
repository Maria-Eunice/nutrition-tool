import { NavLink } from "react-router-dom";
import { Leaf, BookOpen, ChefHat, CheckCircle, CalendarDays, BarChart3, HelpCircle } from "lucide-react";
import { C, font, surface } from "../../data/brand";
import { useAppStore } from "../../store/useAppStore";
import { cn } from "../../lib/utils";

const NAV = [
  { to: "/", label: "Recipe Book", Icon: BookOpen },
  { to: "/builder", label: "Recipe Builder", Icon: ChefHat },
  { to: "/checker", label: "Meal Pattern", Icon: CheckCircle },
  { to: "/planner", label: "Menu Planner", Icon: CalendarDays },
  { to: "/reports", label: "Reports", Icon: BarChart3 },
];

/** Reusable NavLink renderer — shared between the main and bottom nav lists. */
const NavItem = ({
  to,
  label,
  Icon,
  end = false,
  onNavigate,
}: {
  to: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; fill?: string; color?: string }>;
  end?: boolean;
  onNavigate: () => void;
}) => (
  <NavLink
    to={to}
    end={end}
    onClick={onNavigate}
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all no-underline"
    style={({ isActive }) =>
      isActive
        ? { backgroundColor: C.green, color: "#fff", fontFamily: font.body }
        : { backgroundColor: "transparent", color: "rgba(255,255,255,0.65)", fontFamily: font.body }
    }
  >
    {({ isActive }) => (
      <>
        <Icon size={18} fill={isActive ? "#fff" : "none"} color={isActive ? "#fff" : "rgba(255,255,255,0.5)"} />
        {label}
        {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.yellow }} />}
      </>
    )}
  </NavLink>
);

export const AppSidebar = () => {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const close = () => setSidebarOpen(false);

  return (
    <aside
      className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-60 flex flex-col",
        "transform transition-transform lg:transform-none",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
      style={{ backgroundColor: surface.sidebar }}
    >
      {/* ── Logo ── */}
      <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center justify-center gap-1">
          <span className="text-lg font-black tracking-tight" style={{ fontFamily: font.header, fontWeight: 900, color: C.green }}>
            Sprou<span className="relative">t<span className="absolute -top-0.5 -right-0.5" style={{ color: C.green, fontSize: 8 }}>🌿</span></span>
          </span>
          <span className="text-lg font-black tracking-tight" style={{ fontFamily: font.header, fontWeight: 900, color: C.lightBlue }}>CNP</span>
        </div>
        <div className="text-center mt-1 text-xs font-medium tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.4)", fontFamily: font.body }}>Menu Manager</div>
      </div>

      {/* ── Main navigation ── */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ to, label, Icon }) => (
          <NavItem key={to} to={to} label={label} Icon={Icon} end={to === "/"} onNavigate={close} />
        ))}
      </nav>

      {/* ── Help link — sits above the footer, separated by a subtle divider ── */}
      <div className="px-3 pb-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="pt-2">
          <NavItem to="/help" label="Help" Icon={HelpCircle} onNavigate={close} />
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Leaf size={14} color={C.green} fill={C.green} />
          <span className="text-xs font-semibold" style={{ color: C.green, fontFamily: font.body }}>USDA Compliant</span>
        </div>
        <div className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)", fontFamily: font.body }}>v1.0 · © 2026 SproutCNP</div>
      </div>
    </aside>
  );
};
