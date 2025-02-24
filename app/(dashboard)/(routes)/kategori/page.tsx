import ClientComp from "./components/client-comp";

const KategoriPage = async () => {
  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <p className="font-medium">✨ Kategori</p>
        <h1 className="text-3xl font-semibold my-1">
          Daftar Kategori Prasarana
        </h1>
      </header>

      <ClientComp />
    </div>
  );
};

export default KategoriPage;
