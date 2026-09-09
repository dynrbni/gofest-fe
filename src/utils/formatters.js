// Helper formatting functions for Indonesian currency, date, and category tags

export function formatRupiah(amount) {
  if (amount === undefined || amount === null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s+/g, '');
}

export function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function formatDateRange(startDateStr, endDateStr) {
  if (!startDateStr) return '-';
  if (!endDateStr || startDateStr === endDateStr) {
    return formatDateIndo(startDateStr);
  }
  return `${formatDateIndo(startDateStr)} - ${formatDateIndo(endDateStr)}`;
}

export function formatDateTimeIndo(dateTimeStr) {
  if (!dateTimeStr) return '-';
  try {
    const d = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d) + ' WIB';
  } catch {
    return dateTimeStr;
  }
}

export function getCategoryColor(category) {
  switch ((category || '').toLowerCase()) {
    case 'musik':
    case 'konser':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        pill: 'bg-blue-600 text-white',
      };
    case 'festival':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        pill: 'bg-amber-500 text-white',
      };
    case 'fanmeeting':
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        pill: 'bg-purple-600 text-white',
      };
    case 'seminar':
    case 'workshop':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        pill: 'bg-emerald-600 text-white',
      };
    case 'pameran':
    case 'kreatif':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        pill: 'bg-rose-600 text-white',
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        pill: 'bg-slate-800 text-white',
      };
  }
}
