import { createContext, useContext, useState, useEffect } from 'react';
import { branchApi } from '../services/api';

const PackageContext = createContext(null);

export const PackageProvider = ({ children }) => {
  const [packages, setPackages] = useState([]);
  const [branches, setBranches] = useState([]);
  const [testTimes, setTestTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await branchApi.getAll(true);
        const data = response.data || response;

        setPackages(data.packages || []);
        setBranches(data.branches || []);
        setTestTimes(data.testTimes || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const activePackages = packages
    .filter(pkg => pkg.active)
    .sort((a, b) => a.orders - b.orders);

  const activeBranches = branches.filter(branch => branch.active);

  const value = {
    packages,
    branches,
    testTimes,
    activePackages,
    activeBranches,
    isLoading,
    error,
  };

  return <PackageContext.Provider value={value}>{children}</PackageContext.Provider>;
};

export const usePackages = () => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error('usePackages must be used within a PackageProvider');
  }
  return context;
};

export default PackageContext;
