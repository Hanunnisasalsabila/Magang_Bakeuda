import React from 'react';
import logoPurbalingga from '../assets/logo-purbalingga.png';

export default function PaperHeader() {
  return (
    <div className="bg-white border border-gray-200 p-6 mb-8 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-6">
      <img
        alt="Logo Kabupaten Purbalingga"
        className="h-20 w-auto object-contain"
        src={logoPurbalingga}
      />
      <div className="text-center md:text-left flex-1">
        <p className="font-bold text-sm tracking-widest text-blue-900 mb-1">
          PEMERINTAH KABUPATEN PURBALINGGA
        </p>
        <h3 className="text-2xl font-extrabold text-blue-900 mb-1 uppercase tracking-tight">
          Badan Keuangan Daerah
        </h3>
        <p className="text-sm font-medium text-gray-600">
          Jl. Onje No. 4 Purbalingga Telp. (0281) 891098, Fax. 896216
        </p>
      </div>
      <div className="border-2 border-blue-900 p-4 rounded text-center min-w-[140px] bg-white">
        <span className="block text-2xl font-black text-blue-900 leading-none mb-1">
          SPOP
        </span>
        <span className="text-[9px] uppercase font-bold text-gray-600 leading-none block">
          Surat Pemberitahuan<br />Objek Pajak
        </span>
      </div>
    </div>
  );
}
