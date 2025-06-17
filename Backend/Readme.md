# 🚀 JestoGP9Te - Java Blockchain Platform

**JestoGP9Te** is a fully-featured Java 19 blockchain platform inspired by Seele and built with modern technologies like Spring Boot, LevelDB, Merkle Trees, and P2P Networking. It implements core blockchain features along with advanced innovations such as sharding, MPoW consensus, JRC-20 token support, and more.

---

## ✅ Features

| Component               | Status | Description |
|------------------------|--------|-------------|
| Core Blockchain & Ledger | ✅     | Block structure, transaction pool, Merkle Tree hashing |
| Wallet & Cryptography  | ✅     | ECDSA key pairs, signing, verification |
| MPoW Consensus         | ✅     | Simple mining with adjustable difficulty |
| Merkle Tree & Hashing  | ✅     | Transaction integrity via Merkle root |
| P2P Networking         | ✅     | Node sync, broadcasting, peer communication |
| Sharding & Routing     | ✅     | Smart transaction routing based on shard ID |
| REST API               | ✅     | Full HTTP endpoints (mining, wallet, tokens, peers, etc.) |
| JRC-20 Token Standard  | ✅     | Token creation, transfer, balance checks |
| LevelDB Persistence    | ✅     | Fast and durable local storage |
| Docker Support         | ✅     | Lightweight container deployment |
| Java 19 & Spring Boot  | ✅     | Clean, modular architecture with modern Java stack |

---

## 🧰 Technologies

- Java 19
- Spring Boot 3.1.12
- LevelDB (via IQ80)
- SLF4J for logging
- Jackson for serialization
- Maven for project build
- Docker for containerization

---

## 📦 Getting Started

### 1. Clone or Download

```bash
git clone https://github.com/your-org/jestogp9te.git
cd jestogp9te

## mvn clean install

## java -jar target/jestogp9te-backend-1.0.0.jar