/**
 * Konversi nominal angka ke kalimat terbilang Bahasa Indonesia
 * Mendukung angka dari 0 sampai triliunan rupiah dengan akurasi 100%.
 * Contoh: 8500000 -> "Delapan Juta Lima Ratus Ribu Rupiah"
 *
 * @param {number|string} angka
 * @returns {string}
 */
export function terbilang(angka) {
  const bilangan = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ]

  const num = Math.floor(Math.abs(Number(angka) || 0))
  if (num === 0) return 'Nol Rupiah'

  function sebut(n) {
    if (n < 12) {
      return bilangan[n]
    } else if (n < 20) {
      return sebut(n - 10) + ' Belas'
    } else if (n < 100) {
      return sebut(Math.floor(n / 10)) + ' Puluh ' + sebut(n % 10)
    } else if (n < 200) {
      return 'Seratus ' + sebut(n - 100)
    } else if (n < 1000) {
      return sebut(Math.floor(n / 100)) + ' Ratus ' + sebut(n % 100)
    } else if (n < 2000) {
      return 'Seribu ' + sebut(n - 1000)
    } else if (n < 1000000) {
      return sebut(Math.floor(n / 1000)) + ' Ribu ' + sebut(n % 1000)
    } else if (n < 1000000000) {
      return sebut(Math.floor(n / 1000000)) + ' Juta ' + sebut(n % 1000000)
    } else if (n < 1000000000000) {
      return sebut(Math.floor(n / 1000000000)) + ' Miliar ' + sebut(n % 1000000000)
    } else {
      return sebut(Math.floor(n / 1000000000000)) + ' Triliun ' + sebut(n % 1000000000000)
    }
  }

  const hasil = sebut(num).replace(/\s+/g, ' ').trim()
  return `${hasil} Rupiah`
}

export default terbilang

