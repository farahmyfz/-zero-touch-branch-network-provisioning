const express = require('express');
const cors = require('cors');
const { Octokit } = require("@octokit/rest");
const dgram = require('dgram'); 
const http = require('http');
const { Server } = require("socket.io");
require('dotenv').config();

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const syslogServer = dgram.createSocket('udp4');

// 1. Listen Syslog dari MikroTik (Port 514)
syslogServer.on('message', (msg, rinfo) => {
    const logRaw = msg.toString();
    
    // DEBUG: Munculkan APAPUN yang masuk tanpa filter
    console.log(`--- PAKET MASUK dari ${rinfo.address} ---`);
    console.log(`Isi: ${logRaw}`);

    // Kirim ke Svelte agar kita tahu ada aktivitas
    io.emit('network-alert', {
        message: "Log Terdeteksi",
        raw: logRaw,
        time: new Date().toLocaleTimeString()
    });

    if (logRaw.includes("logged in") || logRaw.includes("changed by")) {
        console.log("🎯 ALERT MATCHED!");
    }
});

syslogServer.bind(5514, '0.0.0.0', () => {
    console.log("Kuping Syslog aktif di SEMUA interface port 5514");
});

// 2. API Push Config 
app.post('/api/sync-router', async (req, res) => {
    try {
        await octokit.actions.createWorkflowDispatch({
            owner: 'farahmyfz',
            repo: '-zero-touch-branch-network-provisioning',
            workflow_id: 'deploy.yml',
            ref: 'main',
        });
        res.json({ message: "Robot GitHub jalan!" });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

server.listen(5000, () => console.log("Otak Dashboard + Socket jalan di port 5000"));