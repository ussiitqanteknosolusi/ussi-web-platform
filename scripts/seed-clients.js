const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const clients = [
  { name: "BMT Investa Mubarokah" },
  { name: "BMT Mitra Usaha Mulia" },
  { name: "Koperasi Baiturrahim Syari’ah" },
  { name: "KSPPS bmt itQan" },
  { name: "Koperasi Karyawan Unisba" },
  { name: "Koperasi Jasa Syari’ah Manba’ul Rizki Investama" },
  { name: "Koperasi Syari’ah 212" },
  { name: "Koperasi Keluarga Besar NTP" },
  { name: "Koperasi Gugus Karya Nusantara" },
  { name: "Koperasi Berkah Raharja Bersama" },
  { name: "BPR Cipatujah" },
  { name: "Yayasan Asy-Syahidiyah Al Falah" },
  { name: "Koperasi Jasa Sinar Nirwana AL Amin" },
  { name: "BMT ALQARYAH" },
  { name: "PT. BPR Pinang Artha" },
  { name: "PT. BPR Mahkota Artha Sejahtera" },
  { name: "PT. BPR Gunung Slamet" },
  { name: "PT. BPR Gunung Simping Artha" },
  { name: "PT. BPR Bumi Prima Dana" },
  { name: "PT. BPR Dian Binarta" },
  { name: "PD. BPR BANK PURWOREJO" },
  { name: "PT. BPR Agrimakmur Lestari" },
  { name: "CU Keling Kumang" },
  { name: "KSPPS BMT Bahtera" },
  { name: "CU Semandang Jaya" },
  { name: "PT. BPR Bapas Temanggung" },
  { name: "PT. BPR Klepu Mitra Kencana" },
  { name: "BMT Amanah Sultra" },
  { name: "PT. BPR Candi Agung Amuntai" },
  { name: "KSPPS BMT ELMIZAN" },
  { name: "PT. BPR NAGA" },
  { name: "PT. BPR GUNUNG RIZKY" },
  { name: "KSPPS CITRA PASUNDAN UTAMA" },
  { name: "YAYASAN PENDIDIKAN ITQAN" },
  { name: "KOPMEN ITQAN SINERGI SEJAHTERA" },
  { name: "BAITULMAAL ITQAN" },
  { name: "KOPERASI MITRA MANDIRI SINERGI" },
];

async function main() {
  console.log('Seeding clients...');
  
  for (const client of clients) {
    const existing = await prisma.client.findFirst({
        where: { name: client.name }
    });
    
    if (!existing) {
        await prisma.client.create({
            data: {
                name: client.name,
                industry: 'Lainnya', // Default
            }
        });
        console.log(`Created client: ${client.name}`);
    } else {
        console.log(`Skipped (exists): ${client.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
