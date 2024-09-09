
// Fungsi untuk menghitung expired date
function calculateExpiredDate() {
    const tanggalInput = document.getElementById('tanggal');  // Ambil elemen tanggal
    const expiredDateInput = document.getElementById('expired_date');  // Ambil elemen expired date
    const selfLife = document.getElementById('self_life');
    // Event listener ketika tanggal diubah
    tanggalInput.addEventListener('change', function() {
        let selectedDate = new Date(tanggalInput.value);  // Ambil tanggal yang dipilih
        if (isNaN(selectedDate.getTime())) {
            return;  // Jika tanggal tidak valid, hentikan proses
        }

        selectedDate.setMonth(selectedDate.getMonth() + 7);  // Tambahkan 7 bulan ke tanggal yang dipilih

        // Format tanggal expired menjadi YYYY-MM-DD
        let day = String(selectedDate.getDate()).padStart(2, '0');
        let month = String(selectedDate.getMonth() + 1).padStart(2, '0');  // Bulan di JavaScript dari 0-11
        let year = selectedDate.getFullYear();

        let formattedExpiredDate = `EXP ${day}-${month}-${year}`;
        expiredDateInput.value = formattedExpiredDate;  // Set value ke input expired date
    });
}


function calculateEstimatedFillingTime() {
    const estWaktuFillingInput = document.getElementById('est_waktu_filling');
    const qtyProduksiInput = document.getElementById('qty_produksi');

    // Ketika qty produksi berubah, hitung ulang estimasi waktu
    qtyProduksiInput.addEventListener('input', function() {
        const qtyProduksiTon = parseFloat(qtyProduksiInput.value); // Ambil nilai Qty Produksi dalam ton

        if (isNaN(qtyProduksiTon) || qtyProduksiTon <= 0) {
            estWaktuFillingInput.value = ''; // Jika tidak valid, kosongkan estimasi
            return;
        }

        // Konversi dari ton ke gram
        const qtyProduksiGram = qtyProduksiTon * 1000000;

        // Langkah-langkah perhitungan
        const jumlahPcs = qtyProduksiGram / 46; // Jumlah pcs
        const jumlahPcsPerMesin = jumlahPcs / 6; // Jumlah pcs per mesin
        const waktu = jumlahPcs / 28; // Waktu dalam menit
        const jam = waktu / 60; // Waktu dalam jam
        const jamPerMesin = jam / 6; // Jam per mesin

        // Format hasil menjadi jam dan menit
        const hours = Math.floor(jamPerMesin); // Hitung jam
        const minutes = Math.round((jamPerMesin - hours) * 60); // Hitung menit sisa

        const formattedEstWaktuFilling = `${hours} jam ${minutes} menit`;
        estWaktuFillingInput.value = formattedEstWaktuFilling; // Set value ke input
    });
}

function calculateActWaktuFilling() {
    const startFillingInput = document.getElementById('start_filling');
    const stopFillingInput = document.getElementById('stop_filling');
    const tanggalInput = document.getElementById('tanggal');
    const actWaktuFillingInput = document.getElementById('act_waktu_filling');

    function calculateDuration() {
        const startDate = tanggalInput.value;  // Ambil tanggal dari input
        const startTime = startFillingInput.value;
        const stopDate = tanggalInput.value;   // Ambil tanggal dari input
        const stopTime = stopFillingInput.value;

        if (!startDate || !startTime || !stopDate || !stopTime) {
            actWaktuFillingInput.value = '';
            return;
        }

        // Gabungkan tanggal dan waktu
        const startDateTime = new Date(`${startDate}T${startTime}:00`);
        let stopDateTime = new Date(`${stopDate}T${stopTime}:00`);

        // Jika waktu stop lebih kecil dari waktu start, tambahkan satu hari ke waktu stop
        if (stopDateTime < startDateTime) {
            stopDateTime.setDate(stopDateTime.getDate() + 1);
        }

        // Hitung durasi dalam menit
        const durationMinutes = (stopDateTime - startDateTime) / (1000 * 60); // Durasi dalam menit
        const hours = Math.floor(durationMinutes / 60); // Hitung jam
        const minutes = Math.round(durationMinutes % 60); // Hitung menit sisa

        // Set nilai ke input act waktu filling
        actWaktuFillingInput.value = `${hours} jam ${minutes} menit`;
    }

    // Event listeners untuk menghitung setiap kali waktu start atau stop diubah
    startFillingInput.addEventListener('change', calculateDuration);
    stopFillingInput.addEventListener('change', calculateDuration);
    tanggalInput.addEventListener('change', calculateDuration); // Tambahkan listener untuk tanggal
}

// Variabel untuk melacak apakah laporan pertama sudah ditambahkan
let isFirstReport = true;

function add_report() {
    const form = document.querySelector('form');
    const hasilLaporanDiv = document.getElementById('hasil_laporan');

    // Ambil nilai dari semua input tanpa `\n` setelah `.value`
    const jenisLaporan = document.getElementById('jenis_laporan').value;
    const tanggal = document.getElementById('tanggal').value;
    const waktuShift = document.getElementById('waktu_shift').value;
    const mesin = document.getElementById('mesin').value;
    const qtyProduksi = document.getElementById('qty_produksi').value;
    const batch = document.getElementById('batch').value;
    const varianRasa = document.getElementById('varian_rasa').value;
    const expiredDate = document.getElementById('expired_date').value;
    const totalCounter = document.getElementById('total_counter').value;
    const penggunaanNitrogen = document.getElementById('penggunaan_nitrogen').value;
    const penggunaanPitaCoding = document.getElementById('penggunaan_pita_coding').value;
    const sisaPitaCoding = document.getElementById('sisa_pita_coding').value;
    const totalKeranjang = document.getElementById('total_keranjang').value;
    const keteranganKeranjang = document.getElementById('keterangan_keranjang').value;
    const totalLossesProduct = document.getElementById('total_losses_product').value;
    const totalDowntime = document.getElementById('total_downtime').value;
    const informasiDowntime = document.getElementById('informasi_downtime').value;

    // Field khusus Laporan Akhir
    const startFilling = document.getElementById('start_filling').value;
    const stopFilling = document.getElementById('stop_filling').value;
    const startdateFilling = document.getElementById('startdate_filling').value;
    const stopdateFilling = document.getElementById('stopdate_filling').value;
    
    const estWaktuFilling = document.getElementById('est_waktu_filling').value;
    const actWaktuFilling = document.getElementById('act_waktu_filling').value;

    // Validasi apakah ada input yang kosong (untuk field yang diperlukan)
    if (!tanggal || !waktuShift || !mesin || !qtyProduksi || !batch || !varianRasa) {
        
        Swal.fire(`Harap isi semua bidang sebelum menambahkan laporan.`);
        return;  // Jika ada yang kosong, hentikan fungsi
    }

    let laporan = "";

    // Hanya tambahkan header jika ini laporan pertama
    if (isFirstReport) {
        laporan += `
*LAPORAN FILLING YOGURT SLURP*
*${jenisLaporan}*
------------------------------------------------
Tanggal: ${tanggal}
Shift/Waktu: ${waktuShift}
------------------------------------------------
Mesin: ${mesin}
Qty Produksi: ${qtyProduksi} Kg
Batch: ${batch}
Varian Rasa: ${varianRasa}
Expired Date: ${expiredDate}
`;
        isFirstReport = false;
    } else {
        laporan += `
------------------------------------------------
Mesin: ${mesin}
Qty Produksi: ${qtyProduksi} Kg
Batch: ${batch}
Varian Rasa: ${varianRasa}
Expired Date: ${expiredDate}
`;
    }
    if (jenisLaporan === 'Laporan Akhir') {
        laporan += `
Start Filling: ${startdateFilling} - [${startFilling}]
Stop Filling: ${stopdateFilling} - [${stopFilling}]
Est Waktu Filling: ${estWaktuFilling}
Act Waktu Filling: ${actWaktuFilling}
`;
    }

    laporan += `
Total Counter: ${totalCounter} Pcs
Penggunaan Nitrogen: ${penggunaanNitrogen}
Penggunaan Pita Coding: ${penggunaanPitaCoding} Pcs
Sisa Pita Coding: ${sisaPitaCoding} Pcs
Total Keranjang: ${totalKeranjang} Keranjang
Note: ${keteranganKeranjang}
Total Losses Product: ${totalLossesProduct} Kg
Total Downtime: ${totalDowntime}
Informasi Downtime: 
${informasiDowntime}
------------------------------------------------
`;

    // Tambahkan hasil laporan ke elemen hasil_laporan
    hasilLaporanDiv.innerHTML += laporan;

    // Kosongkan form setelah laporan ditambahkan
    form.reset();
}



function send_report() {
    const hasilLaporanDiv = document.getElementById('hasil_laporan');
    
    // Ambil teks dari div hasil_laporan menggunakan textContent untuk hasil yang lebih konsisten
    let laporanText = hasilLaporanDiv.textContent.trim();

    // Validasi jika tidak ada laporan yang akan dikirim
    if (!laporanText) {
        Swal.fire(`Tidak ada laporan untuk di kirim!`);
        return;
    }

    // Encode teks laporan agar sesuai dengan format URL dan WhatsApp
    const encodedLaporan = encodeURIComponent(laporanText)
        .replace(/%20/g, '+')  // Mengganti spasi dengan plus untuk konsistensi URL encoding
        .replace(/%0A/g, '%0A');  // Pertahankan newline agar sesuai dengan format teks WhatsApp
    
    // URL untuk membuka WhatsApp Web atau aplikasi WhatsApp
    const whatsappURL = `https://wa.me/?text=${encodedLaporan}`;

    // Redirect user ke WhatsApp
    window.open(whatsappURL, '_blank');
}

function toggleFillingFields() {
    const jenisLaporan = document.getElementById('jenis_laporan').value;
    const fillingFields = document.getElementById('filling_fields');  // Field Start dan Stop Filling
    const timeFields = document.getElementById('time_fields');  // Field Est Waktu dan Act Waktu Filling

    // Jika "Laporan Shift", sembunyikan fields Start/Stop Filling dan Est/Act Waktu Filling
    if (jenisLaporan === 'Laporan Shift') {
        fillingFields.classList.add('hidden');
        timeFields.classList.add('hidden');
    } else {
        // Jika "Laporan Akhir", tampilkan fields yang terkait
        fillingFields.classList.remove('hidden');
        timeFields.classList.remove('hidden');
    }
}

// Panggil toggleFillingFields ketika jenis laporan diubah
document.getElementById('jenis_laporan').addEventListener('change', toggleFillingFields);

// Panggil fungsi calculateEstimatedFillingTime setelah halaman dimuat
window.onload = function() {

    Swal.fire("Hai para pekerja keras! silahkan isi form dengan benar yah :)");


    calculateEstimatedFillingTime();  // Kalkulasi Estimasi Waktu Filling
    calculateActWaktuFilling(); // Kalkulasi Aktual Waktu Filling
    calculateExpiredDate();  // Kalkulasi Expired Date
    
};


// Variabel untuk menyimpan event sebelum install
let deferredPrompt;

// Ambil elemen tombol install
const installBtn = document.getElementById('installBtn');

// Cek di localStorage apakah aplikasi sudah diinstall
if (localStorage.getItem('appInstalled') === 'true') {
    // Jika aplikasi sudah diinstall, sembunyikan tombol
    installBtn.style.display = 'none';
} else {
    // Jika belum diinstall, tampilkan tombol
    installBtn.style.display = 'block';
}

// Event listener untuk menangkap event "beforeinstallprompt"
window.addEventListener('beforeinstallprompt', (e) => {
    // Cegah browser agar tidak langsung menampilkan prompt install
    e.preventDefault();

    // Simpan event yang tertunda
    deferredPrompt = e;

    // Tampilkan tombol install jika belum diinstall
    if (localStorage.getItem('appInstalled') !== 'true') {
        installBtn.style.display = 'block';
    }
});

// Event listener untuk tombol install
installBtn.addEventListener('click', async () => {
    // Sembunyikan tombol install
    installBtn.style.display = 'none';

    if (deferredPrompt) {
        // Tampilkan prompt install ke pengguna
        deferredPrompt.prompt();

        // Tunggu sampai pengguna merespon prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Hapus prompt yang tertunda setelah digunakan
        deferredPrompt = null;
    }
});

// Event listener untuk mendeteksi jika aplikasi sudah diinstal
window.addEventListener('appinstalled', () => {
    console.log('Aplikasi telah terinstal');

    // Simpan status instalasi di localStorage
    localStorage.setItem('appInstalled', 'true');
    Swal.fire("Aplikasi sudah di install");

    // Sembunyikan tombol setelah instalasi
    installBtn.style.display = 'none';
});


// Ambil elemen modal dan tombol
const feedbackBtn = document.getElementById('feedback');
const modal = document.getElementById('feedbackModal');
const closeModal = document.getElementById('closeModal');
const sendBugReportBtn = document.getElementById('sendBugReport');
const bugReportText = document.getElementById('bugReportText');

// Tampilkan modal ketika tombol feedback ditekan
feedbackBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Tutup modal ketika tombol 'x' ditekan
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Tutup modal jika pengguna mengklik di luar konten modal
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Kirim bug report ke WhatsApp
sendBugReportBtn.addEventListener('click', () => {
    const bugReport = bugReportText.value.trim(); // Ambil isi textarea

    if (!bugReport) {
        Swal.fire("Harap masukan deskripsi");
        return;
    }

    // Pesan otomatis sebelum isi bug report
    const autoMessage = "Halo Bang Jago, ini ada bug atau fitur yang belum ditambahkan.\n\n";

    // Gabungkan pesan otomatis dengan isi textarea
    const fullMessage = `${autoMessage}${bugReport}`;

    // Encode teks laporan agar sesuai dengan format URL dan WhatsApp
    const encodedBugReport = encodeURIComponent(fullMessage)
        .replace(/%20/g, '+')  // Ganti spasi dengan plus
        .replace(/%0A/g, '%0A');  // Pertahankan newline agar sesuai dengan format teks WhatsApp
    
    // URL untuk membuka WhatsApp Web dengan pesan yang sudah dikodekan
    const whatsappURL = `https://wa.me/+6289691213179?text=${encodedBugReport}`;

    // Buka WhatsApp untuk mengirimkan pesan bug
    window.open(whatsappURL, '_blank');

    // Kosongkan textarea dan tutup modal setelah laporan dikirim
    bugReportText.value = '';
    modal.style.display = 'none';
});

