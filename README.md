# 🌐 Zero-Touch Branch Network Provisioning

An automated remote network management system (*Zero-Touch Provisioning*) built upon modern **NetDevOps** architecture using **Infrastructure as Code (IaC)** principles. This project integrates an interactive web-based monitoring dashboard with automated CI/CD pipelines to handle centralized configuration, deployment, and performance monitoring of remote branch routers.

---

## 🚀 System Workflow

The system automates network provisioning seamlessly through a 4-tier coordinated pipeline:

1. **Configuration & Inventory Management**: Users manage network parameters (such as `hosts.ini` inventory files and `setup_sistem.yml` scripts) directly via the visual dashboard interface.
2. **Git-Driven Synchronization**: Clicking the **Push Config** button triggers the Node.js backend to automatically commit changes to the main GitHub repository using the GitHub API.
3. **Automated Pipeline Trigger**: GitHub detects file changes on the `main` branch, triggering the `deploy.yml` workflow via a *Self-Hosted Runner* running in a local WSL 2 environment.
4. **Automated Configuration Deployment**: The *Runner* pulls the latest configuration scripts and executes the Ansible Engine to push settings (including Routing, NAT, DNS, and Firewall rules) to the remote MikroTik Router over a secure SSH connection.

---

## 🛠️ Dashboard & Data Management

The control interface is built using **Svelte** and **Tailwind CSS** to provide a highly responsive, data-driven experience focused on:
* **Inventory Management**: Instant validation and slot mapping of branch routers.
* **Playbook Editor**: An integrated visual YAML text workspace to update network policies without touching the terminal.
* **Deployment Status Indicators**: Real-time visual feedback tracking active GitHub Action pipelines to simplify troubleshooting and isolate system errors.
* **Telemetry Data Dashboard**: Check the live log monitor to see activity on the router.

---

## 💻 Tech Stack & Core Tools

* **Ansible**: The core automation driver handling *agentless* configuration injection onto targeted devices.
* **Svelte & Node.js**: The full-stack web environment backing the provisioning and data visualization dashboard.
* **GitHub Actions & Self-Hosted Runner**: The CI/CD engine bridging cloud repository management with local network simulations.
* **MikroTik RouterOS**: The target branch routing infrastructure.
* **SSH & YAML**: Secure transit protocols and industry-standard declarative IaC structures.

---

## 📂 Repository Layout

```text
.
├── .github/workflows/
│   └── deploy.yml          # GitHub Actions pipeline configuration
├── dashboard/
│   ├── backend/            # Node.js backend server (API & GitHub API Integration)
│   └── fronntend/          # Dashboard UI source files (Svelte Frontend)
├── hosts.ini               # Branch router inventory management file
├── setup_sistem.yml        # Main Ansible Playbook containing declarative IaC configurations
└── README.md               # Main repository documentation
```
---

This project serves as a functional implementation of modern NetDevOps meant to completely eliminate human error during manual infrastructure deployments in branch network environments.
