<script>
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';

  let status = "Sistem Siap";
  let logs = ["Menunggu aktivitas..."];
  let isAlert = false;

  onMount(() => {
    const socket = io("http://localhost:5000");

    socket.on('network-alert', (data) => {
      isAlert = true;
      status = "Log Terdeteksi";
      // Masukkan log baru di paling atas
      logs = [`[${data.time}] ${data.raw}`, ...logs];
    });
  });

  async function triggerPush() {
    status = "Mengirim Instruksi...";
    const res = await fetch('http://localhost:5000/api/sync-router', { method: 'POST' });
    const data = await res.json();
    status = "Robot GitHub sudah mulai bekerja!";
  }
</script>

<div class="min-h-screen {isAlert ? 'bg-red-950' : 'bg-slate-900'} text-white p-8 transition-colors duration-500">
  
  <div class="flex justify-between items-center border-b border-slate-700 pb-6 mb-8">
    <h1 class="text-4xl font-extrabold tracking-tight {isAlert ? 'text-red-500 animate-pulse' : 'text-blue-400'}">
      NetDevOps Control Center
    </h1>
    <div class="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
      <span class="relative flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full {isAlert ? 'bg-red-400' : 'bg-green-400'} opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 {isAlert ? 'bg-red-500' : 'bg-green-500'}"></span>
      </span>
      <p class="text-sm font-mono font-bold uppercase tracking-widest">{status}</p>
    </div>
  </div>

  {#if isAlert}
    <div class="mb-6">
      <button on:click={() => {isAlert = false; status = "Sistem Siap"}} 
        class="bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded-full font-bold shadow-lg transition-all">
        ✕ Dismiss Alert
      </button>
    </div>
  {/if}

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    
    <div class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
      <h2 class="text-slate-400 text-sm font-bold uppercase mb-6 tracking-widest">Inventory & Provisioning</h2>
      <div class="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-slate-700">
        <div>
          <h3 class="text-xl font-bold">MikroTik - R1</h3>
          <p class="text-slate-500 font-mono text-sm">192.168.10.1</p>
        </div>
        <button on:click={triggerPush}
          class="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-bold transition-all shadow-lg active:scale-95">
          Push Config
        </button>
      </div>
    </div>

    <div class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
      <h2 class="text-yellow-500 text-sm font-bold uppercase mb-4 tracking-widest">System Logs</h2>
      <div class="bg-black/80 rounded-xl p-4 h-64 overflow-y-auto font-mono text-sm border border-slate-800 leading-relaxed">
        {#each logs as log}
          <p class="{log.includes('[ALERT]') ? 'text-red-400 font-bold' : 'text-green-500'} mb-1">
            > {log}
          </p>
        {/each}
      </div>
    </div>

  </div>
</div>