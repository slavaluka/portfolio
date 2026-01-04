'use client';

import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className='fixed top-8 right-8 cursor-pointer'
      aria-label='Toggle theme'
    >
      <div
        className='rounded-full transition-colors'
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: theme === 'dark' ? '#dddddf' : '#3a31fd',
        }}
      />
    </button>
  );
};
