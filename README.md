# Sistem Scan Kehadiran

Sistem Scan Kehadiran adalah aplikasi berbasis Google Apps Script untuk mencatat kehadiran menggunakan QR code atau barcode.

## Fitur

- Scan QR code/barcode untuk mencatat kehadiran
- Generate data testing dan QR code
- Tampilan web responsif
- Mode testing untuk simulasi

## Cara Penggunaan

1. Buka spreadsheet Google Sheets
2. Buka Tools > Script editor
3. Salin konten `Code.gs` ke editor script
4. Buat file HTML baru, beri nama 'Index', dan salin konten `Index.html`
5. Simpan dan jalankan fungsi `onOpen()` untuk membuat menu custom
6. Gunakan menu "QR Code Tools" untuk generate data testing
7. Deploy sebagai web app untuk mengakses sistem

## Kontribusi

Kontribusi selalu diterima. Untuk perubahan besar, harap buka issue terlebih dahulu untuk mendiskusikan apa yang ingin Anda ubah.

## Lisensi

[MIT](https://choosealicense.com/licenses/mit/)

## Author

@motului