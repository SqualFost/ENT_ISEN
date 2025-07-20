import NavBar from "@/components/Navbar";
import CardConteneur from "@/components/CardConteneur";

export default function HomePage() {
  return (
    <div className="flex h-screen bg-gray-50 p-4 gap-4">
      {/* Navbar verticale */}
      <NavBar />

      {/* Contenu principal */}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          {/* Card Notes */}
          <CardConteneur />
        </div>
      </div>
    </div>
  );
}
