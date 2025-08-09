"use client";

import Link from "next/link";
import { BookOpenCheck, Lock, Mail, Rocket, UserRound } from "lucide-react";
import { Input, PasswordInput } from "@/components/common/input";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-sky-50 to-indigo-50">
      {/* Left: Hero */}
      <div className="relative hidden md:flex flex-col items-center justify-center overflow-hidden p-12">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(56,189,248,0.35)_0%,rgba(99,102,241,0.15)_35%,transparent_70%)]" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 max-w-md text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-200 backdrop-blur">
            <Rocket size={14} />
            Luyện thi tiếng Anh thông minh
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">
            Tăng tốc chinh phục chứng chỉ tiếng Anh
          </h1>
          <p className="mt-3 text-slate-600">
            Bài học ngắn gọn, luyện đề sát thực tế, phân tích điểm yếu và lộ
            trình cá nhân hóa cho IELTS/Aptis/TOEIC.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {["Từ vựng", "Ngữ pháp", "Luyện đề"].map((t) => (
              <div
                key={t}
                className="rounded-xl bg-white/70 px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200 backdrop-blur"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center py-14 px-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-600/10 px-3 py-1 text-indigo-700 ring-1 ring-indigo-200">
              <BookOpenCheck size={16} />
              <span className="text-xs font-semibold">AptisPro</span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Chào mừng trở lại
            </h2>
            <p className="mt-2 text-slate-600">
              Đăng nhập để tiếp tục lộ trình luyện thi của bạn.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <Input
              label="Email"
              type="email"
              required
              placeholder="you@example.com"
              leftIcon={<Mail size={18} />}
            />

            <PasswordInput
              containerClassName="mt-4"
              label="Mật khẩu"
              required
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
            />

            <div className="mt-4 flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <Link href="#" className="text-indigo-600 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Đăng nhập
            </button>

            <p className="mt-4 text-center text-sm text-slate-600">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="font-medium text-indigo-600 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </form>

          <div className="mt-8 flex items-center gap-3 text-xs text-slate-500">
            <UserRound size={16} />
            <span>
              Tip: Mỗi ngày 15 phút luyện tập sẽ giúp bạn tăng điểm đều ở 4 kỹ
              năng.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
