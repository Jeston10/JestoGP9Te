import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/wallet">Wallet</Link>
      <Link to="/blockchain">Blockchain</Link>
      <Link to="/mining">Mining</Link>
      <Link to="/tokens">Tokens</Link>
      <Link to="/peers">Peers</Link>
      <Link to="/transaction">Transactions</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
};

export default Navbar;
