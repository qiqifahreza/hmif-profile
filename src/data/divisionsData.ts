import type { DivisionDetail, Lecturer } from '../types';

export const divisionsData: DivisionDetail[] = [
  {
    slug: 'kahim-wakahim',
    name: 'Ketua & Wakil Himpunan',
    shortName: 'BPH Inti',
    about: 'Pimpinan tertinggi Kabinet Samvaya yang memegang kemudi strategis, representasi internal & eksternal, dan penjamin keselarasan visi himpunan.',
    leader: { 
      name: 'Muhammad Arya Ivandy Rohman', 
      role: 'Ketua Himpunan', 
      nim: '3012410062',
      imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/cf92973d7bbaf9fb991c2a24a7031c43.png' 
    },
    coLeader: { 
      name: 'Muhammad Faidza Airlangga', 
      role: 'Wakil Ketua Himpunan', 
      nim: '3012410043',
      imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/c38c2ff66ca3d01bee33d2cb45165306.png' 
    },
    members: [],
    programs: [
      {
        title: 'N/A',
        description: 'none',
        period: 'Time_Interval|Periodicity'
      },
      {
        title: 'N/A',
        description: 'none',
        period: 'Time_Interval|Periodicity'
      }
    ]
  },
  {
    slug: 'sekretaris',
    name: 'Sekretariat',
    shortName: 'Sekretaris',
    about: 'Pusat tata kelola administrasi organisasi, pengarsipan surat dinamis, notulensi koordinasi, dan standardisasi dokumen resmi.',
    leader: { 
      name: 'Achmad Ricky Hariono', 
      role: 'Sekretaris 1', 
      nim: '3012410009',
      imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/e491fc811303549e5e6ea53f6ccff251.png' 
    },
    coLeader: { 
      name: 'Siti Amelia Istiqomah', 
      role: 'Sekretaris 2', 
      nim: '3012510701',
      imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/41ef63ba1d35a5b83bf4a1b217b5ef6f.jpg' 
    },
    members: [],
    programs: [
      {
        title: 'N/A',
        description: 'none',
        period: 'Time_Interval|Periodicity'
      },
      {
        title: 'N/A',
        description: 'none',
        period: 'Time_Interval|Periodicity'
      }
    ]
  },
  {
    slug: 'bendahara',
    name: 'Kebendaharaan',
    shortName: 'Bendahara',
    about: 'Pengelola sirkulasi finansial, transparansi kas masuk-keluar, pembukuan anggaran, dan penjamin akuntabilitas dana himpunan.',
    leader: { 
      name: 'Rafael Sucah Agustino', 
      role: 'Bendahara 1', 
      nim: '3012410054',
      imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/66d89322a9f5db2415dcb4cbd5406362.png' 
    },
    coLeader: { 
      name: 'Stephani Chris Anna', 
      role: 'Bendahara 2', 
      nim: '3012510036',
      imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/492c3b889eef64d6474cd181f6f16cc5.jpg' 
    },
    members: [],
    programs: [
      {
        title: 'N/A',
        description: 'none',
        period: ''
      },
      {
        title: 'N/A',
        description: 'none',
        period: 'Time_Interval|Periodicity'
      }
    ]
  },
  {
    slug: 'psdm',
    name: 'Pengembangan Sumber Daya Manusia',
    shortName: 'PSDM',
    about: 'Katalisator penguatan integritas, kaderisasi mahasiswa baru, peningkatan kompetensi kepemimpinan, dan solidaritas keluarga besar Informatika UISI.',
    leader: { 
      name: 'Tegar Adidtya Pratama', 
      role: 'Kepala Divisi PSDM', 
      nim: '3012510035',
      imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/707c885ae6327aa7b4abff3cc781c669.jpg' 
    },
    members: [
      {
        name: 'Rendy Alfiansyah',
        role: 'Anggota Divisi',
        nim: '3012510013',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/256442de7311552b18395ce7163061e8.jpg'
      },
      {
        name: 'Teti Ina Pangaribuan',
        role: 'Anggota Divisi',
        nim: '3012510709',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/25fef209ec80d217575c3662f5b41265.jpg'
      },
      {
        name: 'Muhammad Rendra Basyori',
        role: 'Anggota Divisi',
        nim: '3012510039',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/bab5618e3b9c72e0418e3503ad43ed84.jpg'
      },
      {
        name: 'Adelina Elsandra Mackayla Putri',
        role: 'Anggota Divisi',
        nim: '3012510707',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/e41c72e3188797393193a72ed592b2ca.jpg'
      },
      {
        name: 'Rifqi Muhamad Rosadi',
        role: 'Anggota Divisi',
        nim: '3012510028',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/19988256cd852d406c2ada8aa48996c0.jpg'
      }
    ],
    programs: [
      {
        title: 'N/A',
        description: 'none',
        period: 'Time_Interval|Periodicity'
      },
      { 
        title: 'N/A', 
        description: 'none', 
        period: 'Time_Interval|Periodicity' 
      }
    ]
  },
  {
    slug: 'kewirausahaan',
    name: 'Kewirausahaan',
    shortName: 'Kewirausahaan',
    about: 'Pilar kemandirian ekonomi himpunan melalui inovasi merchandise, technopreneurship, dan pendanaan kreatif.',
    leader: { 
      name: 'Muhammad Awaludin Ikbar', 
      role: 'Kepala Divisi Kewirausahaan', 
      nim: '3012410025',
      imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/7aee7bb26cc1cb9f3557991031a4e5a1.png' 
    },
    members: [
      {
        name: "Farisha Na'ila Zahronissa",
        role: 'Anggota Divisi',
        nim: '3012510710',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/77d2e0b126acc5242e232fb1384437fd.jpg'
      },
      {
        name: 'Rio Al Kaseno',
        role: 'Anggota Divisi',
        nim: '3012510018',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/93cbf546c51f5d68fbfd57f6c65a3ff9.jpg'
      },
      {
        name: 'Muhammad Revaldo Pratama',
        role: 'Anggota Divisi',
        nim: '3012510031',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/3e10c04336b93e0ae70ce939473bfa0b.jpg'
      },
      {
        name: 'Andini Dwi Rismayani',
        role: 'Anggota Divisi',
        nim: '3012510009',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/e8438ca80ee01533cd2ee7a04e185999.jpg'
      }
    ],
    programs: [
      {
        title: 'N/A',
        description: 'none',
        period: 'Time_Interval|Periodicity'
      },
      {
        title: 'N/A', 
        description: 'none', 
        period: 'Time_Interval|Periodicity' 
      }
    ]
  },
  {
    slug: 'humas',
    name: 'Hubungan Masyarakat',
    shortName: 'Humas',
    about: 'Garda terdepan diplomasi eksternal, jejaring alumni, kolaborasi antar kampus, dan relasi industri teknologi informasi.',
    leader: { 
      name: 'Rendy Hikmawan Saputro', 
      role: 'Kepala Divisi Humas', 
      nim: '3012410049',
      imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/6193995382d99831cb37d0e1532f5d8b.png' 
    },
    members: [
      {
        name: 'Ahmad Andi Alfiansyah',
        role: 'Anggota Divisi',
        nim: '3012410053',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/c48657ecff8aa5e1e316bbd46e120968.png'
      },
      {
        name: 'Jafar Sodiq',
        role: 'Anggota Divisi',
        nim: '3012510038',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/ae8ef6ff088490cb100b0a1848e7e0ac.jpg'
      },
      {
        name: 'Ahmad Ubaydillah',
        role: 'Anggota Divisi',
        nim: '3012510027',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/c7f86cc319c4a55bc1e470d3b2649e22.jpg'
      },
      {
        name: 'Fatir Awaluddin Putra',
        role: 'Anggota Divisi',
        nim: '3012410027',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/3779fccc850cdea1443d0eb91b75a33b.png'
      },
      {
        name: 'Dinda Auliaul Qibtiyah',
        role: 'Anggota Divisi',
        nim: '3012510704',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/5bb6159cb63d1737f17c594a13820c06.jpg'
      }
    ],
    programs: [
      { 
        title: 'N/A', 
        description: 'none', 
        period: 'Time_Interval|Periodicity' 
      },
      { 
        title: 'N/A', 
        description: 'none', 
        period: 'Time_Interval|Periodicity' 
      }
    ]
  },
  {
    slug: 'kominfo',
    name: 'Komunikasi & Informasi',
    shortName: 'Kominfo',
    about: 'Pusat publikasi informasi, branding visual organisasi, pembuatan konten kreatif, dan pengelolaan media sosial resmi HMIF UISI.',
    leader: { 
      name: 'Alfian Khusnul Fatoni', 
      role: 'Kepala Divisi Kominfo', 
      nim: '3012410017',
      imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/6dc99fda35743df49831385fbdbc16ff.jpg' 
    },
    members: [
      {
        name: 'Raditya Arva Messi Jagaddhita',
        role: 'Anggota Divisi',
        nim: '3012510034',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/b1918ea87e90b635331f206900559b36.jpg'
      },
      {
        name: 'Almaziidah Rihhadatul Aisya',
        role: 'Anggota Divisi',
        nim: '3012510012',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/835b5f754f3a92a10a90a572c3fb12b0.jpg'
      },
      {
        name: 'Reynata Mahessa Mulia Efendi',
        role: 'Anggota Divisi',
        nim: '3012510703',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/1420cdbd0b40dfe52ce7c8c42fdabe9b.jpg'
      },
      {
        name: 'M Faisal Afdani',
        role: 'Anggota Divisi',
        nim: '3012510010',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/ecbc6da0630f3a7221fe496af5ee279e.jpg'
      }
    ],
    programs: [
      {
        title: 'N/A', 
        description: 'none', 
        period: 'Time_Interval|Periodicity' 
      },
      { 
        title: 'N/A', 
        description: 'none', 
        period: 'Time_Interval|Periodicity' 
      }
    ]
  },
  {
    slug: 'ristek',
    name: 'Riset & Teknologi',
    shortName: 'Ristek & Teknologi',
    about: 'Inkubasi keterampilan teknikal mahasiswa melalui coding camp, riset software, persiapan lomba kompetitif, dan proyek open-source.',
    leader: { 
      name: 'Nia Ramadani', 
      role: 'Kepala Divisi Ristek', 
      nim: '3012410702',
      imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/6c388f737290391c76c4a2a07fd41abf.png' 
    },
    members: [
      {
        name: 'Mochamad Rifki Al Farizi',
        role: 'Anggota Divisi',
        nim: '3012510011',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/2e4cf2b316a9026599e7a043f7e6fb8f.jpg'
      },
      {
        name: 'M. Aliefta Rizky Alvansyah',
        role: 'Anggota Divisi',
        nim: '3012510019',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/c6e2335151090d46dd02372690efc9cd.jpg'
      },
      {
        name: 'Chandra Mahendra Alam Pramudita',
        role: 'Anggota Divisi',
        nim: '3012510008',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/c28a90f32b6fc0e60e9d754529a2c607.jpg'
      },
      {
        name: 'Muhammad Fata Azzaki',
        role: 'Anggota Divisi',
        nim: '3012510021',
        imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/9f0443f28a64626c56751c8a8b6cf56e.jpg'
      }
    ],
    programs: [
      {
        title: 'N/A', 
        description: 'none', 
        period: 'Time_Interval|Periodicity' 
      },
      { 
        title: 'N/A', 
        description: 'none', 
        period: 'Time_Interval|Periodicity' 
      }
    ]
  }
];

export const lecturersData: Lecturer[] = [
  { 
    name: 'Doni Setio Pambudi, S.Kom., M.Kom., MCE', 
    role: 'Dosen Departemen Informatika',
    imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/99ce877d565fac657685503c58a22800.jpg' 
  },
  { 
    name: 'Lailatul Hidayah, S.Kom., M.S., MCE', 
    role: 'Dosen Departemen Informatika',
    imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/d65a77f0599a4361c8b94bacbdcfc428.jpg' 
  },
  { 
    name: 'Moch. Nurul Indra Al Fauzan, S.Kom., M.Eng.', 
    role: 'Dosen Departemen Informatika',
    imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/45aa961708cff739422a610f1e98c407.JPG' 
  },
  { 
    name: 'Mohammad Arif Rasyidi, S.Kom., M.Sc., MCE', 
    role: 'Dosen Departemen Informatika',
    imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/02fd2ef79f8c319fa31de58d2b91493c.jpg' 
  },
  { 
    name: 'Muhammad Zain Fawwaz Nuruddin Siswantoro, S.Kom., M.Kom., MCE', 
    role: 'Dosen Departemen Informatika',
    imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/34ec0f87f4d8a199bbfde598e4f8ee0a.JPG' 
  },
  { 
    name: 'Ngatini, S.Si., M.Si., MCE, MOS', 
    role: 'Dosen Departemen Informatika',
    imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/f5a58d878b70c27eb0a72167af542a57.jpg' 
  },
  { 
    name: 'Puji Andayani, S.Si., M.Si., M.Sc., MCE, MOS', 
    role: 'Dosen Departemen Informatika',
    imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/e8d567cae3e309fe9069fec5bb4cbd43.jpg' 
  },
  { 
    name: 'Rangga Kurnia Putra Wiratama, S.Kom, M.Kom., MOS', 
    role: 'Dosen Departemen Informatika',
    imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/061ccf6b544236dabb4c4191b97a9d75.jpg' 
  },
  { 
    name: 'Ruktin Handayani, S.Kom., M.Kom., MCE', 
    role: 'Dosen Departemen Informatika',
    imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/5def761788c4addc22cc0ad5315fbb06.jpg' 
  },
  { 
    name: 'Taufiqotul Bariyah, S.Kom., M.IM., MCE', 
    role: 'Dosen Departemen Informatika',
    imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/9fcf2caadcad72fa0e54c79d5b5efcc7.jpg' 
  },
  { 
    name: 'Yohanes Indra Riskajaya, S.Kom., M.Kom., MTA, MCE', 
    role: 'Dosen Departemen Informatika',
    imageUrl: 'https://gapura.uisi.ac.id/assets/upload/user/300x300/fc3191b04b697104342d8dfce9a0db2f.jpg' 
  }
];