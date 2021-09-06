import { useState, useEffect } from 'preact/hooks';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../connectors';
import { formatEther } from '@ethersproject/units';
import { useEagerConnect, useInactiveListener } from '../hooks';

const Index = () => {
  const context = useWeb3React<Web3Provider>();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context;

  const handleClickedInjected = () => {
    activate(injected);
  };

  const [balance, setBalance] = useState();

  useEffect((): any => {
    if (!!account && !!library) {
      let stale = false;

      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null);
          }
        });

      return () => {
        stale = true;
        setBalance(undefined);
      };
    }
  }, [account, library, chainId]);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager);

  return (
    <div className='flex justify-center flex-col items-center'>
      <div className='mt-10'>
        <button
          onClick={handleClickedInjected}
          className='bg-gray-400 text-gray-800 font-semibold hover:bg-gray-600 hover:text-gray-900 flex items-center h-9 py-1.5 pr-2.5 pl-2 rounded-xl border-none cursor-pointer normal-case overflow-visible appearance-none'>
          Injected
        </button>
      </div>
      <div className='mt-10'>
        <span className='block mt-4'>Chain Id: {`${chainId ?? ''}`}</span>
        <span className='block mt-4'>
          Account: {`${account ? account : ''}`}
        </span>
        <span className='block mt-4'>
          Balance:{' '}
          {balance === null
            ? 'Error'
            : balance
            ? `${formatEther(balance).substr(0, 4)} ETH`
            : ''}
        </span>
      </div>
      {(active || error) && (
        <div className='mt-10'>
          <button
            onClick={() => {
              deactivate();
            }}
            className='bg-red-400 text-red-800 font-semibold hover:bg-red-600 hover:text-red-900 flex items-center h-9 py-1.5 pr-2.5 pl-2 rounded-xl border-none cursor-pointer normal-case overflow-visible appearance-none'>
            Deactivate
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
