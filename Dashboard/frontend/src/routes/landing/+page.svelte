<script>
    // Data untuk bagian Workflow agar lebih dinamis dan mudah di-maintain
    const workflows = [
        {
            id: '01',
            phase: 'PLAN',
            colorClass: 'text-blue-500',
            title: 'Git-Driven',
            description: 'Definisikan state jaringan dalam YAML atau Jinja2 templates di repository Git terpusat.'
        },
        {
            id: '02',
            phase: 'TEST',
            colorClass: 'text-emerald-500',
            title: 'CI Validation',
            description: 'Linting otomatis dan pre-deployment checks (via Batfish/pyATS) untuk mencegah error.'
        },
        {
            id: '03',
            phase: 'DEPLOY',
            colorClass: 'text-purple-500',
            title: 'Push to Prod',
            description: 'Eksekusi konfigurasi ke perangkat multi-vendor via Ansible atau Terraform.'
        },
        {
            id: '04',
            phase: 'MONITOR',
            colorClass: 'text-orange-500',
            title: 'Observability',
            description: 'Verifikasi state jaringan secara real-time dengan streaming telemetry pasca-deploy.'
        }
    ];
</script>

<svelte:head>
    <title>NetDevOps Pipeline | Automation</title>
</svelte:head>

<div class="bg-slate-900 text-slate-200 font-sans antialiased overflow-x-hidden min-h-screen">
    <!-- Navigation -->
    <nav class="flex items-center justify-between px-8 py-6 border-b border-slate-800">
        <div class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            NetDevOps.io
        </div>
        <div class="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#solutions" class="hover:text-blue-400 transition">Solutions</a>
            <a href="#docs" class="hover:text-blue-400 transition">Documentation</a>
            <a href="#integrations" class="hover:text-blue-400 transition">Integrations</a>
        </div>
        <button class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition shadow-lg shadow-blue-500/30">
            Launch Console
        </button>
    </nav>

    <!-- Hero Section with Video -->
    <header class="container mx-auto px-6 pt-20 pb-10 text-center relative">
        <!-- Decorative Background Glow -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-blue-600/20 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

        <!-- Perbaikan warna teks agar kontras di dark mode (mengganti text-black menjadi text-white) -->
        <h1 class="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Automate Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Network</span> <br> Like Code.
        </h1>
        <p class="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
            Hilangkan konfigurasi manual. Deploy perubahan infrastruktur jaringan melalui pipeline CI/CD yang teruji, aman, dan scalable.
        </p>
        <div class="flex justify-center space-x-4 mb-16">
            <button class="bg-white text-slate-900 px-8 py-3 rounded-md font-bold hover:bg-slate-200 transition shadow-lg shadow-white/10">Get Started</button>
            <button class="border border-slate-700 bg-slate-800/50 px-8 py-3 rounded-md font-bold hover:bg-slate-700 transition backdrop-blur-sm">View Demo</button>
        </div>

        <!-- Video Mockup Window -->
        <div class="max-w-5xl mx-auto relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            
            <div class="relative bg-slate-950 rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden">
                <div class="flex items-center px-4 py-3 bg-slate-900 border-b border-slate-800">
                    <div class="flex space-x-2">
                        <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div class="mx-auto text-xs text-slate-500 font-mono flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        pipeline-execution-log.sh
                    </div>
                </div>
                
                <video 
                    class="w-full h-auto object-cover aspect-video opacity-80" 
                    autoplay 
                    loop 
                    muted 
                    playsinline
                    poster="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80">
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-227-large.mp4" type="video/mp4">
                    Browser Anda tidak mendukung tag video.
                </video>

                <div class="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-lg pointer-events-none">
                    <p class="text-sm font-mono text-emerald-400 flex items-center">
                        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></span>
                        Pipeline running...
                    </p>
                </div>
            </div>
        </div>
    </header>

    <!-- Workflow Section -->
    <section class="bg-slate-900 py-24 relative z-10">
        <div class="container mx-auto px-6">
            <h2 class="text-3xl font-bold text-center mb-16 text-white">The NetDevOps Workflow</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <!-- Svelte Each Block untuk merender data Workflow secara dinamis -->
                {#each workflows as flow}
                    <div class="relative p-6 bg-slate-800/40 hover:bg-slate-800/80 rounded-xl border border-slate-700/50 shadow-xl transition-colors">
                        <div class="{flow.colorClass} font-mono mb-4 text-lg font-semibold">
                            {flow.id} // {flow.phase}
                        </div>
                        <h3 class="text-xl font-bold mb-2">{flow.title}</h3>
                        <p class="text-slate-400 text-sm leading-relaxed">{flow.description}</p>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        &copy; 2026 NetDevOps Pipeline Project. Built for Speed and Stability.
    </footer>
</div>

<style>
    /* Jika Anda menggunakan integrasi Tailwind di Svelte, 
       biasanya Anda tidak perlu menulis CSS tambahan di sini. 
       Semua sudah diatur lewat utility classes Tailwind di markup. */
</style>