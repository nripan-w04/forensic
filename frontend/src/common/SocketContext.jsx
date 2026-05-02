import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUI } from './UIContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { showToast } = useUI();

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Forensic-Socket System');
    });

    newSocket.on('case_status_updated', (data) => {
      showToast(`Case ${data.caseId} status updated to ${data.status}`, 'info');
    });

    newSocket.on('evidence_added', (data) => {
      showToast(`New Evidence registered for Case ${data.caseId}`, 'success');
    });

    newSocket.on('report_uploaded', (data) => {
      showToast(`Forensic Report available for Case ${data.caseId}`, 'success');
    });

    newSocket.on('ai_analysis_complete', (data) => {
      showToast(`AI Diagnostic complete for Evidence ${data.evidenceId}`, 'success');
    });

    return () => newSocket.close();
  }, [showToast]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
