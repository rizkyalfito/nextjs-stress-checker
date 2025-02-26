'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";

interface ModalProps {
  message: string;
  onClose?: () => void;
}

interface SuccessModalProps extends ModalProps {
  redirectLink?: string;
  redirectText?: string;
}

export const SuccessModal = ({ message, redirectLink, redirectText }: SuccessModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Short delay before showing modal for smoother animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Clean search params from URL without navigating
    window.history.replaceState({}, document.title, window.location.pathname);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (redirectLink) {
        router.push(redirectLink);
      } else {
        router.refresh();
      }
    }, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`w-full max-w-md bg-white rounded-lg shadow-lg transition-all duration-300 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="p-6">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">Berhasil!</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            
            {redirectLink && (
              <Link
                href={redirectLink}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md transition-colors text-center"
              >
                {redirectText || "Lanjutkan"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ErrorModal = ({ message }: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Short delay before showing modal for smoother animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Clean search params from URL without navigating
    window.history.replaceState({}, document.title, window.location.pathname);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      router.refresh();
    }, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`w-full max-w-md bg-white rounded-lg shadow-lg transition-all duration-300 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="p-6">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">Gagal</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            
            <button
              onClick={handleClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors text-center"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
