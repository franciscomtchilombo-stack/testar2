import React, { useEffect, useState } from 'react';
import { CheckCircle2, Smartphone, WifiOff, X } from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';
import { isNative } from '../utils/native';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isNative || isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-[#1D4ED8] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Instalar App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-[#1D4ED8] bg-[#EFF6FF] hover:bg-[#DBEAFE] rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Instalar</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white border border-[#D4D7DF] p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-[#141518]">
                  Instalar no iPhone / iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Fechar instruções"
                  className="p-1 text-[#64748B] hover:text-[#141518] rounded-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-[#475569] leading-relaxed">
                1. Toque no botão <strong>Compartilhar</strong> na barra do Safari.
                <br />
                2. Role para baixo e toque em{' '}
                <strong>Adicionar à Tela de Início</strong>.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-lg bg-[#EFF1F5] hover:bg-[#E4E7EE] py-2 text-sm font-medium text-[#141518] cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [offlineReadyToast, setOfflineReadyToast] = useState(false);

  useEffect(() => {
    const handleOfflineReady = () => {
      setOfflineReadyToast(true);
      window.setTimeout(() => setOfflineReadyToast(false), 3500);
    };
    window.addEventListener('pwa-offline-ready', handleOfflineReady);
    return () => {
      window.removeEventListener('pwa-offline-ready', handleOfflineReady);
    };
  }, []);

  if (!isOnline) {
    return (
      <div
        role="status"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-[#141518] px-3 py-2 text-xs font-medium text-white shadow-lg"
      >
        <WifiOff className="w-3.5 h-3.5 text-[#FBBF24]" aria-hidden="true" />
        <span>Modo offline — funcionando sem internet.</span>
      </div>
    );
  }

  if (offlineReadyToast) {
    return (
      <div
        role="status"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-[#141518] px-3 py-2 text-xs font-medium text-white shadow-lg"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" aria-hidden="true" />
        <span>Aplicativo salvo para uso offline.</span>
      </div>
    );
  }

  return null;
};
