<script>
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';

  // --- State Konten File (Data Ansible Kamu) ---
  let hostsContent = `[router]
R1 ansible_host=192.168.10.1 ansible_user=admin ansible_password=admin 

[router:vars]
ansible_connection=network_cli
ansible_network_os=routeros`;

  let yamlContent = `---
- name: Fase 3 - Automasi Konfigurasi Dasar dan Layanan
  hosts: router
  gather_facts: false

  tasks:
    - name: 0. Konfigurasi IP Interface
      community.routeros.command:
        commands:
          - /ip address add address=192.168.11.10/24 interface=ether1 comment="WAN"
          - /ip address add address=192.168.10.1/24 interface=ether2 comment="LAN_to_R2"
      ignore_errors: true

    - name: 1. Mengubah Hostname
      community.routeros.command:
        commands:
          - /system identity set name="{{ inventory_hostname }}"

    - name: 2. Konfigurasi DNS Server
      community.routeros.command:
        commands:
          - /ip dns set servers=8.8.8.8,8.8.4.4 allow-remote-requests=yes

    - name: 3. Konfigurasi NTP Client
      community.routeros.command:
        commands:
          - /system ntp client set enabled=yes servers=0.id.pool.ntp.org,1.id.pool.ntp.org

    - name: 4. Membuat User Management Baru (Keamanan)
      community.routeros.command:
        commands:
          - /user add name=netdevops password=amanaman group=full
      ignore_errors: true

    - name: 5. Konfigurasi Routing (Default Route ke Internet)
      community.routeros.command:
        commands:
          - /ip route add dst-address=0.0.0.0/0 gateway=192.168.11.1
      ignore_errors: true

    - name: 5.5 Tambahkan Rute ke LAN R2 via WAN
      community.routeros.command:
        commands:
          - /ip route add dst-address=192.168.20.0/24 gateway=192.168.11.153 comment="Rute ke R2"
      ignore_errors: true

    - name: 6. Konfigurasi NAT/Firewall (Masquerade)
      community.routeros.command:
        commands:
          - /ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade

    - name: 6.5 Konfigurasi DHCP Server untuk LAN
      community.routeros.command:
        commands:
          - /ip pool add name=pool-lan ranges=192.168.10.10-192.168.10.100
          - /ip dhcp-server add name=server-lan interface=ether2 address-pool=pool-lan disabled=no
          - /ip dhcp-server network add address=192.168.10.0/24 gateway=192.168.10.1 dns-server=8.8.8.8
      ignore_errors: true

    - name: 7. Pengujian/Validasi Koneksi (Ping ke DNS Google)
      community.routeros.command:
        commands:
          - /ping 8.8.8.8 count=4
      register: hasil_ping

    - name: 8. Menampilkan Hasil Validasi di Terminal
      debug:
        msg: "{{ hasil_ping.stdout_lines }}"

    - name: 9. Konfigurasi SNMP (Monitoring)
      community.routeros.command:
        commands:
          - /snmp set enabled=yes contact="Admin NetDevOps" location="Lab Data Center"

    - name: 10. Konfigurasi Syslog (Remote Logging)
      community.routeros.command:
        commands:
          - /system logging action set [find name="remote"] target=remote remote=192.168.10.10 remote-port=5514
          - /system logging add action=remote topics=info
          - /system logging add action=remote topics=error
          - /system logging add action=remote topics=warning
      ignore_errors: true

    - name: 11. Menarik konfigurasi (Stdout Mode)
      community.routeros.command:
        commands:
          - /export
      register: hasil_export

    - name: 11.5 Memastikan folder backup ada
      ansible.builtin.file:
        path: "./backups"
        state: directory
      delegate_to: localhost

    - name: 12. Menyimpan hasil export ke laptop
      ansible.builtin.copy:
        content: "{{ hasil_export.stdout[0] }}"
        dest: "./backups/backup_{{ inventory_hostname }}_{{ lookup('pipe', 'date +%Y%m%d_%H%M%S') }}.rsc"
      delegate_to: localhost`;

  // --- UI State ---
  let status = "system ready";
  let isLoading = false;
  let alerts = []; // Array untuk menampung log dari backend
  let stats = { ok: 0, failed: 0, runs: 0 };

  // --- Socket.io Logic ---
  onMount(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('network-alert', (data) => {
      // Logic untuk mendeteksi tipe alert berdasarkan isi pesan
      const isSecurity = data.message.toLowerCase().includes('security') || 
                         data.message.toLowerCase().includes('critical') || 
                         data.message.toLowerCase().includes('failure');
      
      const newLog = {
        ...data,
        type: isSecurity ? 'SECURITY' : 'INFO',
        time: data.time || new Date().toLocaleTimeString()
      };

      alerts = [newLog, ...alerts];
      
      // Update stats sederhana
      if (isSecurity) stats.failed += 1;
      else stats.ok += 1;
    });

    return () => socket.disconnect();
  });

  // --- API Handlers ---
  async function handleDeploy() {
    isLoading = true;
    status = "running pipeline...";
    stats.runs += 1;
    try {
      const res = await fetch('http://localhost:5000/api/save-and-deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hosts: hostsContent, yaml: yamlContent })
      });
      status = res.ok ? "pipeline success" : "pipeline failed";
    } catch (e) {
      status = "connection error";
    } finally {
      isLoading = false;
    }
  }

  function clearLogs() {
    alerts = [];
  }
</script>

<div class="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans selection:bg-emerald-100">
  
  <header class="bg-white px-8 py-3 flex justify-between items-center border-b border-slate-200 shadow-sm sticky top-0 z-50">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
        <span class="text-white font-black text-xs">ND</span>
      </div>
      <h1 class="text-[11px] font-bold tracking-[0.25em] text-slate-400 uppercase">NetDevOps • Automation Pipeline</h1>
    </div>
    <div class="flex items-center gap-3 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-200">
      <div class="h-2 w-2 rounded-full {isLoading ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}"></div>
      <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">{status}</span>
    </div>
  </header>

  <main class="p-8 max-w-[1700px] mx-auto grid grid-cols-12 gap-8">
    
    <div class="col-span-8">
      <div class="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-xl shadow-slate-200/50">
        
        <div class="flex justify-between items-start mb-10">
          <div>
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Live Configuration Editor</h3>
            <div class="flex items-center gap-5">
              <h2 class="text-4xl font-bold text-slate-800 tracking-tight">MikroTik — R1</h2>
              <div class="flex gap-2">
                
              </div>
            </div>
          </div>
          <button 
            on:click={handleDeploy}
            disabled={isLoading}
            class="bg-[#059669] hover:bg-[#047857] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-200 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLoading ? 'Synchronizing...' : 'Push Config'}
          </button>
        </div>

        <div class="space-y-10">
          <div class="relative group">
            <div class="flex justify-between items-center mb-3 px-2">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inventory (hosts.ini)</label>
              <span class="text-[9px] bg-slate-800 text-white px-2 py-0.5 rounded font-mono uppercase">INI</span>
            </div>
            <div class="relative">
              <textarea 
                bind:value={hostsContent} 
                spellcheck="false"
                class="w-full h-36 p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono text-[13px] text-blue-600 outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none shadow-inner custom-scrollbar"
              ></textarea>
            </div>
          </div>

          <div class="relative group">
            <div class="flex justify-between items-center mb-3 px-2">
              <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Playbook (setup_sistem.yml)</label>
              <span class="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded font-mono uppercase tracking-tighter">YAML</span>
            </div>
            <div class="relative">
              <textarea 
                bind:value={yamlContent} 
                spellcheck="false"
                class="w-full h-[500px] p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono text-[13px] text-blue-600 outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none shadow-inner custom-scrollbar leading-relaxed"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-4 space-y-6">
    
      <div class="bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 flex flex-col h-[765px] overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div class="flex items-center gap-3">
            <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Log Monitor</h3>
            <span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[9px] text-slate-400 font-mono">Port: 5514</span>
            <button 
              on:click={clearLogs}
              class="text-[9px] font-black text-slate-400 hover:text-red-500 border border-slate-200 px-3 py-1 rounded-lg uppercase transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FCFDFF] custom-scrollbar">
          {#each alerts as a}
            <div class="group border-l-4 {a.type === 'SECURITY' ? 'border-red-500 bg-red-50/50 shadow-red-100' : 'border-emerald-500 bg-emerald-50/50 shadow-emerald-100'} p-4 rounded-r-2xl transition-all hover:translate-x-1 shadow-sm">
              <div class="flex justify-between items-start mb-2">
                <span class="text-[9px] font-mono font-black {a.type === 'SECURITY' ? 'text-red-600' : 'text-emerald-700'} uppercase">
                  {a.type === 'SECURITY' ? '!! [ALERT SECURITY]' : '>> [INFO SYSTEM]'}
                </span>
                <span class="text-[9px] text-slate-400 font-mono font-bold tracking-tighter">{a.time}</span>
              </div>
              <p class="text-[12px] font-mono leading-relaxed {a.type === 'SECURITY' ? 'text-red-900 font-bold' : 'text-slate-600'}">
                {a.message}
              </p>
            </div>
          {:else}
            <div class="flex flex-col items-center justify-center h-full text-center opacity-40">
              <div class="w-12 h-12 border-4 border-slate-200 border-dashed rounded-full mb-6 animate-spin-slow"></div>
              <p class="text-[11px] text-slate-400 uppercase tracking-[0.3em] italic font-bold">Waiting for MikroTik traffic...</p>
            </div>
          {/each}
        </div>
      </div>

    </div>
  </main>
</div>

<style>
  /* Styling Scrollbar Modern */
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow { animation: spin-slow 12s linear infinite; }

  /* Menambahkan feel interaktif pada textarea */
  textarea:focus {
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.05);
  }
</style>