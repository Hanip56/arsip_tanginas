import { IconType } from "react-icons/lib";
import { RiDashboardLine } from "react-icons/ri";
import { MdOutlineCategory } from "react-icons/md";
import { PiBuildingOffice, PiFileArchive } from "react-icons/pi";
import { BiCategory, BiUser } from "react-icons/bi";
import { UserRole } from "@prisma/client";
import { ISADMIN } from "./role";

type NavType = {
  label: string;
  href: string;
  icon: IconType;
};

type NavListType = {
  type: "subtitle" | "single" | "multiple";
  label?: string;
  subtitle?: string;
  href?: string;
  icon?: IconType;
  sub?: NavType[];
};

export const navigations = (role: UserRole | undefined) => {
  const isAdmin = ISADMIN(role);
  const isSemiAdmin = role === "KONSULTAN" || role === "LAPANGAN";

  let routes: NavListType[] = [
    {
      type: "subtitle",
      subtitle: "Workspace",
    },
    {
      type: "single",
      label: "Dashboard",
      href: "/",
      icon: RiDashboardLine,
    },
    {
      type: "single",
      label: "Prasarana",
      href: "/prasarana",
      icon: PiBuildingOffice,
    },
  ];

  if (!isSemiAdmin) {
    routes = [
      ...routes,
      {
        type: "single",
        label: "Files",
        href: "/files",
        icon: PiFileArchive,
      },
    ];
  }

  if (isAdmin) {
    routes = [
      ...routes,
      {
        type: "subtitle",
        subtitle: "Kategori",
      },
      {
        type: "single",
        label: "Kategori Prasarana",
        href: "/kategori",
        icon: MdOutlineCategory,
      },
      {
        type: "single",
        label: "Kategori Arsip",
        href: "/arsip-kategori",
        icon: BiCategory,
      },
      {
        type: "subtitle",
        subtitle: "Pengguna",
      },
      {
        type: "single",
        label: "Kelola Pengguna",
        href: "/user",
        icon: BiUser,
      },
    ];
  }

  return routes;
};

export const daftarTahunAnggaran = [
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
];

export const daftarSumberDana = [
  "APBD 1",
  "APBD 2",
  "APBN TP Mandiri",
  "APBN SATKER Pusat",
  "APBN SATKER Provinsi",
  "DAK",
  "DBHCHT (Dana Bagi Hasil Cukai Hasil Tembakau)",
  "DID",
  "BANGUB",
];

export const kecamatans = [
  "Arjasari",
  "Baleendah",
  "Banjaran",
  "Bojongsoang",
  "Cangkuang",
  "Cicalengka",
  "Cikancung",
  "Cilengkrang",
  "Cileunyi",
  "Cimaung",
  "Cimenyan",
  "Ciparay",
  "Ciwidey",
  "Dayeuhkolot",
  "Ibun",
  "Katapang",
  "Kertasari",
  "Kutawaringin",
  "Majalaya",
  "Margaasih",
  "Margahayu",
  "Nagreg",
  "Pacet",
  "Pameungpeuk",
  "Pangalengan",
  "Paseh",
  "Pasirjambu",
  "Rancabali",
  "Rancaekek",
  "Solokanjeruk",
  "Soreang",
];

const desaKelurahanKabupatenBandungTemp = [
  // Kecamatan Arjasari
  "Ancolmekar",
  "Arjasari",
  "Baros",
  "Batukarut",
  "Lebakwangi",
  "Mangunjaya",
  "Mekarjaya",
  "Patrolsari",
  "Pinggirsari",
  "Rancakole",
  "Wargaluyu",
  // Kecamatan Baleendah
  "Andir",
  "Baleendah",
  "Jelekong",
  "Manggahang",
  "Wargamekar",
  "Bojongmalaka",
  "Malakasari",
  "Rancamanyar",
  // Kecamatan Banjaran
  "Banjaran",
  "Banjaran Wetan",
  "Ciapus",
  "Kamasan",
  "Kiangroke",
  "Margahurip",
  "Mekarjaya",
  "Neglasari",
  "Pasirmulya",
  "Sindangpanon",
  "Tarajusari",
  // Kecamatan Bojongsoang
  "Bojongsari",
  "Bojongsoang",
  "Buahbatu",
  "Cipagalo",
  "Lengkong",
  "Tegalluar",
  // Kecamatan Cangkuang
  "Bandasari",
  "Cangkuang",
  "Ciluncat",
  "Jatisari",
  "Nagrak",
  "Pananjung",
  "Tanjungsari",
  // Kecamatan Cicalengka
  "Babakan Peuteuy",
  "Cicalengka Kulon",
  "Cicalengka Wetan",
  "Cikuya",
  "Dampit",
  "Margaasih",
  "Nagrog",
  "Narawita",
  "Panenjoan",
  "Tanjungwangi",
  "Tenjolaya",
  "Waluya",
  // Kecamatan Cikancung
  "Cihanyir",
  "Cikancung",
  "Cikasungka",
  "Ciluluk",
  "Hegarmanah",
  "Mandalasari",
  "Mekarlaksana",
  "Srirahayu",
  "Tanjunglaya",
  // Kecamatan Cilengkrang
  "Cilengkrang",
  "Cipanjalu",
  "Ciporeat",
  "Girimekar",
  "Jatiendah",
  "Melatiwangi",
  // Kecamatan Cileunyi
  "Cibiru Hilir",
  "Cibiru Wetan",
  "Cileunyi Kulon",
  "Cileunyi Wetan",
  "Cimekar",
  "Cinunuk",
  // Kecamatan Cimaung
  "Campakamulya",
  "Cikalong",
  "Cimaung",
  "Cipinang",
  "Jagabaya",
  "Malasari",
  "Mekarsari",
  "Pasirhuni",
  "Sukamaju",
  "Warjabakti",
  // Kecamatan Cimenyan
  "Ciburial",
  "Cikadut",
  "Cimenyan",
  "Mandalamekar",
  "Mekarmanik",
  "Mekarsaluyu",
  "Padasuka",
  "Sindanglaya",
  "Cibeunying",
  // Kecamatan Ciparay
  "Babakan",
  "Bumiwangi",
  "Ciheulang",
  "Cikoneng",
  "Ciparay",
  "Gunungleutik",
  "Manggungharja",
  "Mekarlaksana",
  "Mekarsari",
  "Pakutandang",
  "Sagaracipta",
  "Sarimahi",
  "Serangmekar",
  "Sumbersari",
  // Kecamatan Ciwidey
  "Ciwidey",
  "Lebakmuncang",
  "Nengkelan",
  "Panundaan",
  "Panyocokan",
  "Rawabogo",
  "Sukawening",
  // Kecamatan Dayeuhkolot
  "Cangkuang Kulon",
  "Cangkuang Wetan",
  "Citeureup",
  "Dayeuhkolot",
  "Sukapura",
  "Pasawahan",
  // Kecamatan Ibun
  "Cibeet",
  "Dukuh",
  "Ibun",
  "Karyalaksana",
  "Laksana",
  "Lampegan",
  "Mekarwangi",
  "Neglasari",
  "Pangguh",
  "Sudi",
  "Talun",
  "Tanggulun",
  // Kecamatan Katapang
  "Banyusari",
  "Cilampeni",
  "Gandasari",
  "Katapang",
  "Pangauban",
  "Sangkanhurip",
  "Sukamukti",
  // Kecamatan Kertasari
  "Cibeureum",
  "Cihawuk",
  "Cikembang",
  "Neglawangi",
  "Resmitingal",
  "Santosa",
  "Sukapura",
  "Tarumajaya",
  // Kecamatan Kutawaringin
  "Buninagara",
  "Cibodas",
  "Cilame",
  "Gajahmekar",
  "Jatisari",
  "Jelegong",
  "Kopo",
  "Kutawaringin",
  "Padasuka",
  "Pameuntasan",
  "Sukamulya",
  // Kecamatan Majalaya
  "Biru",
  "Bojong",
  "Majakerta",
  "Majalaya",
  "Majasetra",
  "Neglasari",
  "Padamulya",
  "Padaulun",
  "Sukamaju",
  "Sukamukti",
  "Wangisagara",
  // Kecamatan Margaasih
  "Cigondewah Hilir",
  "Lagadar",
  "Margaasih",
  "Mekar Rahayu",
  "Nanjung",
  "Rahayu",
  // Kecamatan Margahayu
  "Margahayu Selatan",
  "Margahayu Tengah",
  "Sayati",
  "Sukamenak",
  "Sulaeman",
  // Kecamatan Nagreg
  "Bojong",
  "Ciaro",
  "Ciherang",
  "Citaman",
  "Ganjarsabar",
  "Mandalawangi",
  "Nagreg",
  "Nagreg Kendan",
  // Kecamatan Pacet
  "Cikawao",
  "Cikitu",
  "Cinanggela",
  "Cipeujeuh",
  "Girimulya",
  "Mandalahaji",
  "Maruyung",
  "Mekarjaya",
  "Mekarsari",
  "Nagrak",
  "Pangauban",
  "Sukarame",
  "Tanjungwangi",
  // Kecamatan Pameungpeuk
  "Bojongkunci",
  "Bojongmanggu",
  "Langonsari",
  "Rancamulya",
  "Rancatungku",
  "Sukasari",
  // Kecamatan Pangalengan
  "Banjarsari",
  "Lamajang",
  "Margaluyu",
  "Margamekar",
  "Margamukti",
  "Margamulya",
  "Pangalengan",
  "Pulosari",
  "Sukaluyu",
  "Sukamanah",
  "Tribaktimulya",
  "Wanasuka",
  "Warnasari",
  // Kecamatan Paseh
  "Cigentur",
  "Cijagra",
  "Cipaku",
  "Cipedes",
  "Drawati",
  "Karangtunggal",
  "Loa",
  "Mekarpawitan",
  "Sindangsari",
  "Sukamanah",
  "Sukamantri",
  "Tangsimekar",
  // Kecamatan Pasirjambu

  "Cibodas",
  "Cikoneng",
  "Cisondari",
  "Cukanggenteng",
  "Margamulya",
  "Mekarmaju",
  "Mekarsari",
  "Pasirjambu",
  "Sugihmukti",
  "Tenjolaya",
  // Kecamatan Rancabali
  "Alamendah",
  "Cipelah",
  "Indragiri",
  "Patengan",
  "Sukaresmi",
  // Kecamatan Rancaekek

  "Bojongloa",
  "Bojongsalam",
  "Cangkuang",
  "Haurpugur",
  "Jelegong",
  "Linggar",
  "Nanjungmekar",
  "Rancaekek Kulon",
  "Rancaekek Wetan",
  "Sangiang",
  "Sukamanah",
  "Sukamulya",
  "Tegalsumedang",
  "Rancaekek",
  "Kencana",
  // Kecamatan Solokanjeruk
  "Bojongemas",
  "Cibodas",
  "Langensari",
  "Padamukti",
  "Panyadap",
  "Rancakasumba",
  "Solokanjeruk",
  // Kecamatan Soreang
  "Cingcin",
  "Karamatmulya",
  "Pamekaran",
  "Panyirapan",
  "Parungserab",
  "Sadu",
  "Sekarwangi",
  "Soreang",
  "Sukajadi",
  "Sukanagara",
];

export const desaKelurahanKabupatenBandung = [
  ...new Set(desaKelurahanKabupatenBandungTemp),
].sort();
