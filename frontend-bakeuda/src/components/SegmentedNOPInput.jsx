import React, { useRef, useState, useEffect } from 'react';

const charMap = [
  { seg: 'prov', len: 2 },
  { seg: 'kab', len: 2 },
  { seg: 'kec', len: 3 },
  { seg: 'kel', len: 3 },
  { seg: 'blok', len: 3 },
  { seg: 'nourut', len: 4 },
  { seg: 'kode', len: 1 }
];

export default function SegmentedNOPInput({ value, onChange, label, showHeaders, optional }) {
  const [chars, setChars] = useState(Array(18).fill(''));
  const refs = useRef([]);

  useEffect(() => {
    if (value) {
      let newChars = [];
      charMap.forEach(({ seg, len }) => {
        const segStr = (value[seg] || '').padEnd(len, '');
        for (let i = 0; i < len; i++) {
          newChars.push(segStr[i] || '');
        }
      });
      setChars(newChars);
    }
  }, [value]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '');
    const char = val.slice(-1);

    if (char) {
      updateChar(index, char);
      if (index < 17) {
        refs.current[index + 1]?.focus();
      }
    } else {
      updateChar(index, '');
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (chars[index]) {
        updateChar(index, '');
      } else if (index > 4) { // Don't go back into KAB (indices 0-3)
        updateChar(index - 1, '');
        refs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 17) {
      refs.current[index + 1]?.focus();
    }
  };

  const updateChar = (index, char) => {
    if (index < 4) return; // prov and kab are read-only
    const newChars = [...chars];
    newChars[index] = char;

    // Reconstruct value object
    let cIdx = 0;
    const newValue = {};
    charMap.forEach(({ seg, len }) => {
      let segStr = '';
      for (let i = 0; i < len; i++) {
        segStr += newChars[cIdx] || '';
        cIdx++;
      }
      newValue[seg] = segStr;
    });

    if (onChange) {
      onChange(newValue);
    }
  };

  // Groups for rendering
  const groups = [
    { label: 'PROV', count: 2 },
    { label: 'KAB', count: 2 },
    { label: 'KEC', count: 3 },
    { label: 'KEL/DES', count: 3 },
    { label: 'BLOK', count: 3 },
    { label: 'No. URUT', count: 4 },
    { label: 'KODE', count: 1 }
  ];

  let boxIndex = 0;

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full">
      {label && (
        <div className="w-32 font-bold text-on-surface md:text-left flex-shrink-0 flex items-center flex-wrap gap-1">
          {label}
          {optional && <span className="text-on-surface-variant font-normal text-[11px] normal-case">(Opsional)</span>}
        </div>
      )}
      <div className="flex flex-nowrap gap-2 sm:gap-3">
        {groups.map((g, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-1 items-center">
            {/* Header always takes space so alignment matches even if showHeaders is false, just invisible */}
            <span className={`text-[10px] sm:text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ${!showHeaders && 'invisible'}`}>
              {g.label}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: g.count }).map((_, i) => {
                const currentIndex = boxIndex++;
                const isReadOnly = currentIndex < 4;
                return (
                  <input
                    key={currentIndex}
                    ref={el => refs.current[currentIndex] = el}
                    type="text"
                    inputMode="numeric"
                    className={`w-7 h-9 sm:w-9 sm:h-11 border rounded-md text-center font-data-mono font-bold text-base sm:text-lg focus:outline-none transition-all ${isReadOnly
                        ? 'bg-surface-container-high text-on-surface border-outline cursor-not-allowed select-none'
                        : 'bg-white text-on-surface border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary shadow-sm'
                      }`}
                    value={chars[currentIndex]}
                    onChange={(e) => handleChange(e, currentIndex)}
                    onKeyDown={(e) => handleKeyDown(e, currentIndex)}
                    readOnly={isReadOnly}
                    onClick={() => {
                      if (!isReadOnly) refs.current[currentIndex]?.select();
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
