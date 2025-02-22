import ClientComp from "./components/client-comp";

const ArsipKategoriPage = async () => {
  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <p className="font-medium">✨ Arsip kategori</p>
        <h1 className="text-3xl font-semibold my-1">Daftar arsip kategori</h1>
      </header>

      <ClientComp />
    </div>
  );
};

export default ArsipKategoriPage;
