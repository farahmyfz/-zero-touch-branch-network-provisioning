# Fase 7: Integrasi Telemetri & Log Terpusat

Setelah router terkonfigurasi otomatis dan terhubung ke internet, infrastruktur perlu diawasi sehingga perlu membuat sebuah dashboard monitoring terpusat dengan cara memperbarui script Ansible untuk men-setup parameter Syslog dan SNMP pada kedua router. Log dan metrik ini diarahkan ke sebuah server monitoring terpusat. 
Konfigurasi monitoring berhasil di push, dan PC kontrol dapat menerima log message dari router (misalnya saat ada interface yang down atau percobaan login yang gagal).

---

## *Pada WSL*

**1. Masuk ke Folder Proyek Di WSL**
```routeros
cd proyek
```
**2. Buat folder baru bernama "monitoring"**
```routeros
mkdir monitoring
```
**3. Buat file baru di dalam folder monitoring bernama "docker-compose.yml"**
```routeros
nano docker-compose.yml
```
**4. Buat file baru di dalam folder monitoring bernama "prometheus.yml"**
```routeros
nano prometheus.yml
```
**5. Buat file baru di dalam folder monitoring bernama "promtail.yml"**
```routeros
nano promtail.yml
```
```text
project/
│
├── hosts.ini
├── setup_sistem.yml
├── monitoring/
│   └── docker-compose.yml
│   └── prometheus.yml
│   └── promtail.yml

---
```

## *Pada WEB*

**1. Masuk Dasboard Grafana** 
```routeros
http://localhost:3000
```
**2. Login menggunakan user router sebelumnya** 
```routeros
*USER=admin PASS=admin*
```
**3. Konfigurasi Grafana & Prometheus**

Setelah infrastruktur berjalan, ikuti langkah-langkah berikut untuk menghubungkan Prometheus ke Grafana dan melakukan import dashboard:

#### A. Menambahkan Data Source Prometheus
1. Pada menu di sisi kiri, pilih **Connections** > **Data Sources**.
2. Klik tombol **Add new data source**, lalu pilih **Prometheus**.
3. Di kolom **Connection**, masukkan URL:
   ```text
   http://prometheus:9090
    ```
4. Scroll ke bawah dan klik `Save & Test`. Pastikan muncul notifikasi hijau "Data source is working".

**4. Import Dashboard Grafana**
1. Kembali ke dashboard utama, pilih menu Dashboards > New > Import.
2. Pada kolom Import via grafana.com, masukkan ID berikut:
   ```text
   14420
   ```
3. Klik tombol `Load`
4. Pada opsi Selection, bagian `DS_PROMETHEUS` (atau Prometheus), pilih data source Prometheus yang baru saja kamu buat
5. Klik Import
