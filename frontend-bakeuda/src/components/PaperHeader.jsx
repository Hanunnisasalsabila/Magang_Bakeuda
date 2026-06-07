import React from 'react';

export default function PaperHeader() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 mb-8 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-6">
      <img
        alt="Logo Kabupaten Purbalingga"
        className="h-20 w-auto object-contain"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmdRTYE-kT3KT5Aoa6biuTYm31qkLe0pppEuYY3774-S7UZWGu0MECx0tmIvwxwwhm4xbXEGOD2xLPvkKpy0eV3zb9xnbDc6hMG-NT01dHtrcJ8UOdcVl_qBa5AWiVzJfAx9IzUaxYCe0t1T_WaBWToUdUYUml9hZtmxMRmh5bfcZca-NN9138w9PdkgLRVsaQmSzPlweGqbU8qeWYNX_aAaMwlewCL4OF46_H7ATXkZABTdW0-M7XV83AgDxPF6kTFJCY4lpjJrVw"
      />
      <div className="text-center md:text-left flex-1">
        <p className="font-section-header text-section-header tracking-widest text-primary mb-1">
          PEMERINTAH KABUPATEN PURBALINGGA
        </p>
        <h3 className="font-headline-md text-headline-md font-extrabold text-on-primary-fixed mb-1 uppercase">
          Badan Keuangan Daerah
        </h3>
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          Jl. Onje No. 4 Purbalingga Telp. (0281) 891098, Fax. 896216
        </p>
      </div>
      <div className="border-2 border-primary p-4 rounded text-center min-w-[140px] bg-white">
        <span className="block font-headline-md font-black text-primary leading-none mb-1">
          SPOP
        </span>
        <span className="text-[9px] uppercase font-bold text-on-surface-variant leading-none block">
          Surat Pemberitahuan<br />Objek Pajak
        </span>
      </div>
    </div>
  );
}
