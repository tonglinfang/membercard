import { Routes, Route } from 'react-router-dom';
import { useLiff } from './hooks/useLiff';
import { LoadingScreen, ErrorScreen } from './components/States';
import { SafeAreaWrapper } from './components/SafeAreaWrapper';
import { TaskProvider } from './contexts/TaskContext';
import Home from './pages/Home';
import { useEffect } from 'react';

export default function App() {
  const { ready, error, retry } = useLiff();

  useEffect(() => {
    console.log('App state updated:', { ready, error });
  }, [ready, error]);

  if (error) {
    return <ErrorScreen message={error} onRetry={retry} />;
  }

  // 10秒以上待っても準備ができない場合はエラーを表示
  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <TaskProvider>
      <SafeAreaWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </SafeAreaWrapper>
    </TaskProvider>
  );
}