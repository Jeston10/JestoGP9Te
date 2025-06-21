# JestoGP9Te Blockchain Frontend

A modern, responsive React frontend for the JestoGP9Te blockchain platform. This application provides a comprehensive interface for interacting with the blockchain, managing wallets, mining blocks, and exploring the network.

## 🚀 Features

### 📊 Dashboard & Monitoring
- **System Health Dashboard**: Real-time monitoring of blockchain status
- **Network Statistics**: Block height, transaction counts, peer connections
- **Blockchain Integrity**: Validation status and chain health indicators

### 💼 Wallet Management
- **Create Wallets**: Generate new cryptographic key pairs
- **Digital Signatures**: Sign and verify data with private keys
- **Balance Tracking**: View token balances and transaction history
- **Address Management**: Copy and manage wallet addresses

### 💸 Transaction Handling
- **Create Transactions**: Send tokens between addresses
- **Transaction History**: View pending and confirmed transactions
- **Real-time Updates**: Live transaction status monitoring

### 🔗 Blockchain Explorer
- **Block Details**: View individual block information
- **Chain Visualization**: Browse the entire blockchain
- **Transaction Tracking**: Find transactions across blocks
- **Hash Verification**: Copy and verify block hashes

### ⛏️ Mining Interface
- **Mining Controls**: Start and stop mining operations
- **Mining Statistics**: Difficulty, rewards, and performance metrics
- **Block Mining**: Mine new blocks with pending transactions
- **Mining History**: Track mining activities and rewards

### 🌐 Peer Network Management
- **Peer Discovery**: View connected network peers
- **Add Peers**: Connect to new network nodes
- **Network Status**: Monitor peer connectivity and health
- **P2P Communication**: Real-time peer status updates

### 🪙 Token Management
- **Token Minting**: Create new tokens and increase supply
- **Token Transfers**: Send tokens between addresses
- **Balance Queries**: Check token balances for any address
- **Operation History**: Track all token-related activities

## 🛠️ Technology Stack

- **React 19**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API communication
- **Vite**: Fast build tool and development server

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8080
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### API Configuration
The frontend connects to the JestoGP9Te blockchain backend API. Ensure the backend is running on the configured URL (default: `http://localhost:8080`).

### Environment Variables
- `VITE_API_URL`: Backend API base URL

## 📱 Usage

### Getting Started
1. **Start the Backend**: Ensure the JestoGP9Te blockchain backend is running
2. **Launch Frontend**: Start the React development server
3. **Create Wallet**: Navigate to the Wallet page and create your first wallet
4. **Explore**: Use the navigation to explore different features

### Key Workflows

#### Creating and Managing Wallets
1. Navigate to **Wallet** page
2. Click "Create Wallet" to generate a new key pair
3. Copy and securely store your private key
4. Use the wallet address for transactions

#### Sending Transactions
1. Go to **Transactions** page
2. Fill in sender, recipient, and amount
3. Click "Create Transaction"
4. Monitor transaction status in the pending transactions list

#### Mining Blocks
1. Navigate to **Mining** page
2. Ensure there are pending transactions
3. Click "Start Mining" to begin block mining
4. Monitor mining progress and rewards

#### Exploring the Blockchain
1. Visit **Blockchain** page
2. Browse the chain of blocks
3. Click on any block to view detailed information
4. Explore transaction details within blocks

#### Managing Network Peers
1. Go to **Peers** page
2. View currently connected peers
3. Add new peers by entering their addresses
4. Monitor peer connectivity status

## 🎨 UI Components

### Navigation
- **Responsive Navbar**: Mobile-friendly navigation with active state indicators
- **Breadcrumb Navigation**: Clear page hierarchy and navigation
- **Quick Actions**: Direct access to common operations

### Data Display
- **Status Cards**: Real-time system health indicators
- **Data Tables**: Sortable and filterable transaction/block lists
- **Progress Indicators**: Loading states and operation progress
- **Copy-to-Clipboard**: Easy copying of addresses and hashes

### Forms and Inputs
- **Validation**: Real-time form validation with error messages
- **Auto-completion**: Smart address suggestions and validation
- **Responsive Design**: Mobile-optimized form layouts

## 🔒 Security Features

- **Private Key Protection**: Secure display and handling of private keys
- **Input Validation**: Client-side validation for all user inputs
- **Secure Communication**: HTTPS API communication
- **Session Management**: Proper session handling and state management

## 📊 Performance

- **Lazy Loading**: Components loaded on demand
- **Optimized Bundles**: Tree-shaking and code splitting
- **Caching**: API response caching for better performance
- **Real-time Updates**: WebSocket-like polling for live data

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation

## 🔄 Updates

Stay updated with the latest features and improvements by:
- Following the repository
- Checking the changelog
- Reviewing release notes

---

Built with ❤️ using React, Tailwind CSS, and modern web technologies.
