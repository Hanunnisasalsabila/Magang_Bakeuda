import React, { useRef, useState, useEffect } from 'react';

export default function SegmentedNOPInput({ value, onChange }) {
  const [segments, setSegments] = useState({
    prov: '33',
    kab: '03',
    kec: '',
    kel: '',
    blok: '',
    nourut: '',
    kode: ''
  });

  const refs = {
    kec: useRef(null),
    kel: useRef(null),
    blok: useRef(null),
    nourut: useRef(null),
    kode: useRef(null),
  };

  useEffect(() => {
    if (value) {
      setSegments(prev => ({ ...prev, ...value }));
    }
  }, [value]);

  const handleChange = (field, length, nextField, e) => {
    const val = e.target.value.replace(/\D/g, ''); // Numbers only
    const updated = { ...segments, [field]: val };
    setSegments(updated);
    if (onChange) {
      onChange(updated);
    }

    if (val.length === length && nextField) {
      refs[nextField].current?.focus();
    }
  };

  const handleKeyDown = (field, prevField, e) => {
    if (e.key === 'Backspace' && segments[field].length === 0 && prevField) {
      refs[prevField].current?.focus();
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-1 items-center">
        <input
          type="text"
          className="nop-box bg-surface-container text-on-surface-variant cursor-not-allowed select-none"
          maxLength={2}
          readOnly
          value={segments.prov}
        />
        <input
          type="text"
          className="nop-box bg-surface-container text-on-surface-variant cursor-not-allowed select-none"
          maxLength={2}
          readOnly
          value={segments.kab}
        />
        <span className="self-center font-bold text-outline">.</span>
        
        <input
          ref={refs.kec}
          type="text"
          className="nop-box focus:border-primary"
          maxLength={3}
          placeholder="000"
          value={segments.kec}
          onChange={(e) => handleChange('kec', 3, 'kel', e)}
          onKeyDown={(e) => handleKeyDown('kec', null, e)}
        />
        <span className="self-center font-bold text-outline">.</span>

        <input
          ref={refs.kel}
          type="text"
          className="nop-box focus:border-primary"
          maxLength={3}
          placeholder="000"
          value={segments.kel}
          onChange={(e) => handleChange('kel', 3, 'blok', e)}
          onKeyDown={(e) => handleKeyDown('kel', 'kec', e)}
        />
        <span className="self-center font-bold text-outline">.</span>

        <input
          ref={refs.blok}
          type="text"
          className="nop-box focus:border-primary"
          maxLength={3}
          placeholder="000"
          value={segments.blok}
          onChange={(e) => handleChange('blok', 3, 'nourut', e)}
          onKeyDown={(e) => handleKeyDown('blok', 'kel', e)}
        />
        <span className="self-center font-bold text-outline">.</span>

        <input
          ref={refs.nourut}
          type="text"
          className="nop-box focus:border-primary"
          maxLength={4}
          placeholder="0000"
          value={segments.nourut}
          onChange={(e) => handleChange('nourut', 4, 'kode', e)}
          onKeyDown={(e) => handleKeyDown('nourut', 'blok', e)}
        />
        <span className="self-center font-bold text-outline">.</span>

        <input
          ref={refs.kode}
          type="text"
          className="nop-box focus:border-primary"
          maxLength={1}
          placeholder="0"
          value={segments.kode}
          onChange={(e) => handleChange('kode', 1, null, e)}
          onKeyDown={(e) => handleKeyDown('kode', 'nourut', e)}
        />
      </div>
      <p className="text-[12px] text-on-surface-variant italic mt-1">Format: Prov.Kab.Kec.Kel.Blok.NoUrut.Kode</p>
    </div>
  );
}
