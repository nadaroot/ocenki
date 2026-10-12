'use client';

import React, { useState } from 'react';
import { GraduationCap, Lock, User, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';

interface LoginFormProps {
  onLogin: (credentials: {
    login: string;
    password?: string;
  }) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isLoading,
  errorMessage,
}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      login: login.trim(),
      password,
    });
  };

  return (
    <div className="relative z-10 w-full max-w-sm px-4 select-none">
      <div className="p-6 md:p-8 rounded-2xl bg-zinc-950/90 backdrop-blur-md border border-zinc-800 shadow-2xl">
        {/* Шапка формы */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-black border border-zinc-800 flex items-center justify-center text-zinc-100 shadow-inner mb-3">
            <GraduationCap className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h1 className="text-base md:text-lg font-bold text-zinc-100 tracking-tight">
            Электронный Дневник
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Авторизация в системе
          </p>
        </div>

        {/* Баннер ошибки */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-surface border border-surface-border text-zinc-300 text-xs font-mono flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Логин */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Логин
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Имя пользователя"
                spellCheck={false}
                autoComplete="username"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono transition-colors"
              />
            </div>
          </div>

          {/* Пароль */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Пароль
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono transition-colors"
              />
            </div>
          </div>

          {/* Кнопка входа */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs tracking-tight flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Проверка учетных данных...</span>
              </>
            ) : (
              <>
                <span>Войти в дневник</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-900 text-center">
          <p className="text-[10px] text-zinc-400 font-mono leading-relaxed">
            Прямое защищенное соединение. Данные сессии шифруются и хранятся локально.
          </p>
        </div>
      </div>
    </div>
  );
};
