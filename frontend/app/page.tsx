import NavBar from "@/components/Navbar";
import CardConteneur from "@/components/CardConteneur";

export default function HomePage() {
  return (
    <div className="flex flex-col lg:flex-row lg:h-screen p-4 gap-4">
      {/* Navbar verticale */}
      <NavBar />

      {/* Contenu principal */}
      <div className="flex-1 lg:pt-0 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full lg:pt-0 pt-4">
          {/* Card Notes */}
          <CardConteneur />
        </div>
      </div>
    </div>
  );
}
