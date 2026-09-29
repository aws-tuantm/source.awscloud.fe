import React, { useState, useRef } from 'react';
import { X, Mail, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  // RFC-compliant email regex
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim().toLowerCase());
};

export default function EmailChipInput({ 
  emails = [], 
  onChange, 
  placeholder = 'Nhập email và nhấn Enter hoặc dấu phẩy...', 
  disabled = false 
}) {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef(null);

  const addEmailsFromText = (text) => {
    if (!text || !text.trim()) return;
    setErrorMessage('');

    const rawTokens = text.split(/[\n,; ]+/).map(t => t.trim().toLowerCase()).filter(Boolean);
    if (rawTokens.length === 0) return;

    const validNewTokens = [];
    let invalidCount = 0;
    let duplicateCount = 0;

    for (const token of rawTokens) {
      if (!isValidEmail(token)) {
        invalidCount++;
      } else if (emails.includes(token) || validNewTokens.includes(token)) {
        duplicateCount++;
      } else {
        validNewTokens.push(token);
      }
    }

    if (validNewTokens.length > 0) {
      onChange([...emails, ...validNewTokens]);
      setInputValue('');
    }

    if (invalidCount > 0 && duplicateCount > 0) {
      setErrorMessage(`Đã bỏ qua: ${invalidCount} email không hợp lệ và ${duplicateCount} email bị trùng.`);
    } else if (invalidCount > 0) {
      setErrorMessage(`${invalidCount} địa chỉ email không đúng định dạng (VD: name@domain.com).`);
    } else if (duplicateCount > 0) {
      setErrorMessage(`Email này đã tồn tại trong danh sách.`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';' || e.key === 'Tab') {
      e.preventDefault();
      if (inputValue.trim()) {
        addEmailsFromText(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && emails.length > 0) {
      e.preventDefault();
      removeEmail(emails.length - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    if (pasteData) {
      addEmailsFromText(pasteData);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addEmailsFromText(inputValue);
    }
  };

  const removeEmail = (indexToRemove) => {
    const updated = emails.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
    setErrorMessage('');
  };

  const clearAll = () => {
    onChange([]);
    setInputValue('');
    setErrorMessage('');
  };

  return (
    <div className="space-y-1.5 w-full">
      <div 
        onClick={() => inputRef.current?.focus()}
        className={`min-h-[96px] max-h-[220px] overflow-y-auto w-full bg-zinc-950 border rounded-lg p-2.5 text-xs sm:text-sm flex flex-wrap gap-1.5 items-start transition cursor-text shadow-inner ${
          errorMessage
            ? 'border-red-500/70 focus-within:ring-1 focus-within:ring-red-500/50'
            : 'border-zinc-800 focus-within:ring-1 focus-within:ring-zinc-500 focus-within:border-zinc-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* Email Chips */}
        {emails.map((email, idx) => (
          <span
            key={`${email}-${idx}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-750 text-xs text-zinc-200 font-mono shadow-sm group hover:border-zinc-600 transition animate-in fade-in zoom-in-95 duration-150"
          >
            <Mail className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 shrink-0" />
            <span className="truncate max-w-[200px]">{email}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeEmail(idx);
              }}
              className="cursor-pointer text-zinc-500 hover:text-red-400 p-0.5 rounded transition shrink-0"
              title="Xóa email này"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (errorMessage) setErrorMessage('');
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={handleBlur}
          placeholder={emails.length === 0 ? placeholder : 'Thêm email khác...'}
          className="flex-1 min-w-[150px] bg-transparent border-none outline-none text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 p-1 font-mono"
        />
      </div>

      {/* Error Feedback if invalid or duplicate */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-[11px] text-red-400 animate-in fade-in duration-150 px-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Footer Helper info & Clear Button */}
      <div className="flex items-center justify-between text-[11px] text-zinc-500 px-0.5">
        <span className="truncate">
          Đã hợp lệ: <strong className="text-zinc-200 font-semibold">{emails.length}</strong> email
        </span>
        {emails.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="cursor-pointer text-zinc-500 hover:text-red-400 transition ml-2 shrink-0"
          >
            Xóa tất cả
          </button>
        )}
      </div>
    </div>
  );
}

