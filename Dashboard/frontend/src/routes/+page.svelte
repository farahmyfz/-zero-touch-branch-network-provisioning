<script>
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';

  // State Konten File
  let hostsContent = "[router]\nR1 ansible_host=192.168.10.1 ansible_user=admin ansible_password=admin \n\n[router:vars]\nansible_connection=network_cli\nansible_network_os=routeros";
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
  
  let alerts = [];
  let status = "SYSTEM READY";
  let isLoading = false;

  onMount(() => {
  const socket = io('http://localhost:5000');
  
  socket.on('network-alert', (data) => {
    alerts = [data, ...alerts];
  });
});

  async function handleDeploy() {
    isLoading = true;
    status = "SYNCHRONIZED TO REPOSITORY...";
    try {
      const res = await fetch('http://localhost:5000/api/save-and-deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hosts: hostsContent, yaml: yamlContent })
      });
      status = res.ok ? "PIPELINE SUCCESSFULLY RUN" : "DEPLOY FAILED";
    } catch (e) {
      status = "BACKEND CONNECTION ERROR";
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-[#ED1C24]">
  <header class="bg-[#ED1C24] p-4 flex justify-between items-center shadow-2xl border-b-4 border-[#C1121F]">
    <div class="flex items-center gap-4">
      <div class="bg-white px-3 py-1 rounded-sm">
        <span class="text-[#ED1C24] font-black italic text-xl">Telkom</span>
      </div>
      <h1 class="text-white font-bold tracking-widest text-sm uppercase">NetDevOps Automation Pipeline</h1>
    </div>
    <div class="flex items-center gap-3">
      <div class="h-2 w-2 rounded-full {isLoading ? 'bg-amber-400 animate-ping' : 'bg-green-400 animate-pulse'}"></div>
      <span class="text-white text-[10px] font-bold tracking-widest uppercase">{status}</span>
    </div>
  </header>

  <main class="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    <div class="lg:col-span-2 bg-[#1E293B] border border-slate-700 rounded-3xl p-8 shadow-xl flex flex-col h-[850px]">
  
  <div class="border-b border-slate-800 pb-4 mb-6">
      <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Live Configuration Editor</h3>
  </div>
  
  <div class="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 flex justify-between items-center mb-8">
    <div>
      <p class="text-white font-bold text-lg italic">MikroTik - R1</p>
      <p class="text-xs text-blue-400 font-mono tracking-widest uppercase">Target: Primary Branch</p>
    </div>
    <button 
      on:click={handleDeploy} 
      disabled={isLoading} 
      class="bg-[#ED1C24] hover:bg-[#C1121F] px-8 py-3 rounded-xl font-black text-xs text-white uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:bg-slate-700 disabled:cursor-not-allowed"
    >
      {isLoading ? 'SYNCING & DEPLOYING...' : 'PUSH CONFIG TO ROUTER'}
    </button>
  </div>

  <div class="flex-1 flex flex-col space-y-6 overflow-hidden">
    
    <div class="space-y-2">
      <label class="text-[10px] font-bold text-[#ED1C24] uppercase tracking-widest italic ml-1">Inventory (hosts.ini)</label>
      <textarea bind:value={hostsContent} spellcheck="false" class="w-full h-32 bg-black text-emerald-400 p-5 rounded-2xl font-mono text-[11px] border border-slate-800 focus:border-[#ED1C24] outline-none transition-all shadow-inner custom-scrollbar resize-none"></textarea>
    </div>
    
    <div class="flex-1 flex flex-col space-y-2 min-h-0">
      <label class="text-[10px] font-bold text-[#ED1C24] uppercase tracking-widest italic ml-1">Playbook (setup_sistem.yml)</label>
      <textarea bind:value={yamlContent} spellcheck="false" class="flex-1 w-full bg-black text-amber-400 p-5 rounded-2xl font-mono text-[11px] border border-slate-800 focus:border-[#ED1C24] outline-none transition-all shadow-inner custom-scrollbar resize-none"></textarea>
    </div>

  </div>
</div>

    <div class="bg-[#1E293B] border border-slate-700 rounded-3xl p-8 shadow-xl flex flex-col h-[850px]">
      <div class="border-b border-[#ED1C24] pb-4 mb-6 flex justify-between items-center">
          <h3 class="text-[10px] font-black text-white uppercase tracking-widest italic">Live Log Monitor</h3>
          <span class="text-[9px] text-slate-500 font-mono tracking-tighter italic">Port: 5514</span>
      </div>
      <div class="flex-1 bg-black p-6 rounded-2xl overflow-y-auto font-mono text-[10px] leading-relaxed custom-scrollbar">
        {#each alerts as a}
            <div class="mb-3 border-b border-white/5 pb-2">
              <span class="text-slate-500">[{a.time}]</span>
              <span class={a.type === 'SECURITY' ? 'text-red-500 font-bold' : 'text-emerald-400'}>
                {a.type === 'SECURITY' ? '!! [ALERT]' : '>> [INFO]'}
              </span>
              <p class="text-slate-300 mt-1 pl-2">{a.message}</p>
            </div>
        {:else}
            <p class="text-slate-700 italic text-center mt-20 uppercase tracking-widest opacity-50">Waiting for MikroTik Log...</p>
        {/each}
      </div>
    </div>

  </main>
</div>

<style>
  @keyframes bounce-short {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-15px); }
  }
  .animate-bounce-short { animation: bounce-short 0.4s ease-in-out; }
  
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
</style>