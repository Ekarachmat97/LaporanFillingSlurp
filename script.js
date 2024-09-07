// Fungsi untuk menghitung expired date
function calculateExpiredDate() {
    const tanggalInput = document.getElementById('tanggal');  // Ambil elemen tanggal
    const expiredDateInput = document.getElementById('expired_date');  // Ambil elemen expired date

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
            actWaktuFillingInput.value = 'Harap isi semua kolom tanggal dan waktu';
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

function add_report() {
    const form = document.querySelector('form');
    const hasilLaporanDiv = document.getElementById('hasil_laporan');

    // Ambil nilai dari semua input
    const tanggal = document.getElementById('tanggal').value;
    const waktuShift = document.getElementById('waktu_shift').value;
    const mesin = document.getElementById('mesin').value;
    const qtyProduksi = document.getElementById('qty_produksi').value;
    const batch = document.getElementById('batch').value;
    const varianRasa = document.getElementById('varian_rasa').value;
    const expiredDate = document.getElementById('expired_date').value;
    const startFilling = document.getElementById('start_filling').value;
    const stopFilling = document.getElementById('stop_filling').value;
    const totalCounter = document.getElementById('total_counter').value;
    const penggunaanNitrogen = document.getElementById('penggunaan_nitrogen').value;
    const penggunaanPitaCoding = document.getElementById('penggunaan_pita_coding').value;
    const sisaPitaCoding = document.getElementById('sisa_pita_coding').value;
    const totalKeranjang = document.getElementById('total_keranjang').value;
    const estWaktuFilling = document.getElementById('est_waktu_filling').value;
    const actWaktuFilling = document.getElementById('act_waktu_filling').value;
    const totalLossesProduct = document.getElementById('total_losses_product').value;
    const totalDowntime = document.getElementById('total_downtime').value;
    const informasiDowntime = document.getElementById('informasi_downtime').value;

    // Validasi apakah ada input yang kosong
    if (!tanggal || !waktuShift || !mesin || !qtyProduksi || !batch || !varianRasa || !expiredDate || !startFilling || 
        !stopFilling || !totalCounter || !penggunaanNitrogen || !penggunaanPitaCoding || !sisaPitaCoding || 
        !totalKeranjang || !estWaktuFilling || !actWaktuFilling || !totalLossesProduct || !totalDowntime) {
        
        alert('Harap isi semua bidang sebelum menambahkan laporan.');
        return;  // Jika ada yang kosong, hentikan fungsi
    }

    // Format hasil laporan
    const laporan = `
        <h3>LAPORAN FILLING YOGURT SLURP</h3>
        <H3>LAPORAN AKHIR</h3>
        <p><strong>Tanggal               :</strong> ${tanggal}</p>
        <p><strong>Waktu/Shift           :</strong> ${waktuShift}</p>
        <p><strong>Mesin                 :</strong> ${mesin}</p>
        <p><strong>Qty Produksi          :</strong> ${qtyProduksi} Ton</p>
        <p><strong>Batch                 :</strong> ${batch}</p>
        <p><strong>Varian Rasa           :</strong> ${varianRasa}</p>
        <p><strong>Expired Date          :</strong> ${expiredDate}</p>
        <p><strong>Start Filling         :</strong> ${startFilling}</p>
        <p><strong>Stop Filling          :</strong> ${stopFilling}</p>
        <p><strong>Total Counter         :</strong> ${totalCounter} Pcs</p>
        <p><strong>Penggunaan Nitrogen   :</strong> ${penggunaanNitrogen}</p>
        <p><strong>Penggunaan Pita Coding:</strong> ${penggunaanPitaCoding} Pcs</p>
        <p><strong>Sisa Pita Coding      :</strong> ${sisaPitaCoding} Pcs</p>
        <p><strong>Total Keranjang       :</strong> ${totalKeranjang} Keranjang</p>
        <p><strong>Est Waktu Filling     :</strong> ${estWaktuFilling}</p>
        <p><strong>Act Waktu Filling     :</strong> ${actWaktuFilling}</p>
        <p><strong>Total Losses Product  :</strong> ${totalLossesProduct} Kg</p>
        <p><strong>Total Downtime        :</strong> ${totalDowntime}</p>
        <p><strong>Informasi Downtime    :</strong> ${informasiDowntime}</p>
        <hr>
    `;

    // Tambahkan hasil laporan ke elemen hasil_laporan
    hasilLaporanDiv.innerHTML += laporan;

    // Kosongkan form setelah laporan ditambahkan
    form.reset();
}

function send_report() {
    const hasilLaporanDiv = document.getElementById('hasil_laporan');
    let laporanText = hasilLaporanDiv.innerText; // Ambil teks dari div hasil_laporan
    
    if (!laporanText.trim()) {
        alert("Tidak ada laporan untuk dikirim.");
        return;
    }

    // Format nomor tujuan WhatsApp (gunakan format internasional tanpa tanda +)
    
    // Encode teks laporan agar sesuai untuk URL
    const encodedLaporan = encodeURIComponent(laporanText);

    // URL untuk membuka WhatsApp Web atau aplikasi WhatsApp
    const whatsappURL = `https://wa.me/?text=${encodedLaporan}`;

    // Redirect user ke WhatsApp
    window.open(whatsappURL, '_blank');
}



// Panggil fungsi calculateEstimatedFillingTime setelah halaman dimuat
window.onload = function() {
    calculateEstimatedFillingTime();  // Kalkulasi Estimasi Waktu Filling
    calculateActWaktuFilling(); // Kalkulasi Aktual Waktu Filling
    calculateExpiredDate();  // Kalkulasi Expired Date
    
};
