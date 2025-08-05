import { useState } from "react";
import { FiX } from "react-icons/fi";
import Header from "../Header";

type Props = {
  children: React.ReactNode;
};

const menuLinks = [
  { label: "Início", href: "/home" },
  { label: "Transferências", href: "/transferencias" },
  { label: "Investimentos", href: "/investments" },
  { label: "Outros serviços", href: "/outros-servicos" },
];

export default function MainLayout({ children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = menuLinks.map((item, i) => (
    <a key={i} href={item.href}>
      <span className={`text-[var(--primary-blue)] text-[16px] cursor-pointer ${i === 0 ? "font-bold border-b-[2px]" : "lg:border-b-[2px]"} pb-2`}>
        {item.label}
      </span>
    </a>
  ));

  return (
    <div className="min-h-screen bg-[#eaf0e9]">
      <Header onToggleMenu={() => setMenuOpen(!menuOpen)} />

      <nav className="hidden md:flex lg:hidden justify-around py-4 bg-white shadow text-sm">
        {menuItems}
      </nav>

      {menuOpen && (
        <aside className="fixed top-0 left-0 w-64 h-full bg-[#eaf0e9] shadow-md z-50 p-4 flex flex-col gap-4">
          <button className="self-end mb-4" onClick={() => setMenuOpen(false)}>
            <FiX size={24} />
          </button>
          <nav className="flex flex-col gap-4 text-lg">
            {menuItems}
          </nav>
        </aside>
      )}

      <div className="w-full max-w-6xl mx-auto flex gap-4 px-4 py-6">
       <aside className="hidden lg:block w-50 bg-white rounded-lg shadow-md p-8 text-center sticky top-2 self-start ">
          <nav className="flex flex-col gap-4 text-sm">
            {menuItems}
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
