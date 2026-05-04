<script>
    // State untuk form login
    let email = '';
    let password = '';
    let isLoading = false;

    // Fungsi simulasi login
    const handleLogin = async () => {
        isLoading = true;
        // Simulasi request ke backend API
        setTimeout(() => {
            console.log('Login attempt with:', email);
            isLoading = false;
        }, 1500);
    };
</script>

<svelte:head>
    <title>Login | NetDevOps Console</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Decorative Background Glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Login Card -->
    <div class="w-full max-w-md bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
        
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                NetDevOps.io
            </h1>
            <p class="text-sm text-slate-400">
                Sign in to access your automation dashboard
            </p>
        </div>

        <!-- Login Form -->
        <form on:submit|preventDefault={handleLogin} class="space-y-5">
            
            <!-- Email Input -->
            <div>
                <label for="email" class="block text-sm font-medium text-slate-300 mb-1.5">Work Email</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                    <input 
                        type="email" 
                        id="email" 
                        bind:value={email}
                        required
                        class="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors sm:text-sm"
                        placeholder="engineer@company.com"
                    >
                </div>
            </div>

            <!-- Password Input -->
            <div>
                <div class="flex items-center justify-between mb-1.5">
                    <label for="password" class="block text-sm font-medium text-slate-300">Password</label>
                    <a href="#forgot" class="text-xs font-medium text-blue-400 hover:text-blue-300 transition">Forgot password?</a>
                </div>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <input 
                        type="password" 
                        id="password" 
                        bind:value={password}
                        required
                        class="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors sm:text-sm"
                        placeholder="••••••••"
                    >
                </div>
            </div>

            <!-- Submit Button -->
            <button 
                type="submit" 
                disabled={isLoading}
                class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {#if isLoading}
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                {:else}
                    Sign In
                {/if}
            </button>
        </form>

        <!-- Divider -->
        <div class="mt-8">
            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-700"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-slate-950 text-slate-500">Or continue with</span>
                </div>
            </div>

            <!-- SSO Buttons -->
            <div class="mt-6 grid grid-cols-2 gap-3">
                <button type="button" class="w-full inline-flex justify-center py-2.5 px-4 border border-slate-700 rounded-lg shadow-sm bg-slate-900 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                    </svg>
                    GitHub
                </button>
                <button type="button" class="w-full inline-flex justify-center py-2.5 px-4 border border-slate-700 rounded-lg shadow-sm bg-slate-900 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                    <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                        <path d="M22.65 14.39L12 22.13 1.35 14.39a2.13 2.13 0 0 1-.22-2.95l1.83-2.45L5.78 1l3.52 10.74h5.4L18.22 1l2.82 7.99 1.83 2.45a2.13 2.13 0 0 1-.22 2.95z" fill="#E24329"/>
                        <path d="M12 22.13L5.78 1 2.96 8.99 12 22.13z" fill="#FC6D26"/>
                        <path d="M2.96 8.99L1.13 11.44a2.13 2.13 0 0 0 .22 2.95L12 22.13 2.96 8.99z" fill="#FCA326"/>
                        <path d="M12 22.13L18.22 1l2.82 7.99L12 22.13z" fill="#FC6D26"/>
                        <path d="M21.04 8.99l1.83 2.45a2.13 2.13 0 0 1-.22 2.95L12 22.13l9.04-13.14z" fill="#FCA326"/>
                    </svg>
                    GitLab
                </button>
            </div>
        </div>
        
    </div>

    <!-- Footer link -->
    <p class="absolute bottom-6 text-sm text-slate-500">
        Need help? <a href="#support" class="text-blue-400 hover:underline">Contact Support</a>
    </p>
</div>