"use client";

import Link from "next/link";
import { useState } from "react";
import { BookMarked, Check, Mail, Phone, User2 } from "lucide-react";
import { Input } from "@/components/common/input";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-emerald-50 to-sky-50">
      {/* Left: Form */}
      <div className="flex items-center justify-center py-14 px-6 order-2 md:order-1">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-600/10 px-3 py-1 text-emerald-700 ring-1 ring-emerald-200">
              <BookMarked size={16} />
              <span className="text-xs font-semibold">Đăng ký tư vấn</span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Bắt đầu lộ trình học cá nhân
            </h2>
            <p className="mt-2 text-slate-600">
              Điền thông tin để nhận tư vấn miễn phí về khóa luyện thi phù hợp.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Đã gửi thông tin!</h3>
              <p className="mt-2 text-slate-600">
                Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Về trang đăng nhập
              </Link>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <Input
                label="Họ và tên"
                required
                placeholder="Nguyễn Văn A"
                leftIcon={<User2 size={18} />}
              />

              <Input
                containerClassName="mt-4"
                label="Email"
                type="email"
                required
                placeholder="you@example.com"
                leftIcon={<Mail size={18} />}
              />

              <Input
                containerClassName="mt-4"
                label="Số điện thoại"
                inputMode="tel"
                required
                placeholder="0987 654 321"
                leftIcon={<Phone size={18} />}
              />

              <label className="mt-4 block text-sm font-medium text-slate-700">
                Nhu cầu học tập
              </label>
              <textarea
                rows={3}
                className="mt-1 w-full resize-none rounded-xl bg-transparent px-3 py-3 text-sm ring-1 ring-slate-300 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ví dụ: Luyện Aptis B1 trong 6 tuần, yếu kỹ năng Speaking"
              />

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Gửi thông tin
              </button>

              <Link
                href="/login"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Đăng nhập
              </Link>
            </form>
          )}
        </div>
      </div>

      {/* Right: Visual */}
      <div className="relative order-1 md:order-2 hidden md:flex items-center justify-center overflow-hidden p-12">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(16,185,129,0.35)_0%,rgba(56,189,248,0.15)_35%,transparent_70%)]" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative z-10 max-w-md text-center">
          <h3 className="text-4xl font-semibold tracking-tight text-slate-900">
            Mục tiêu rõ ràng, tiến bộ từng ngày
          </h3>
          <p className="mt-3 text-slate-600">
            Hệ thống theo dõi tiến độ, nhắc học thông minh và đề xuất bài tập
            phù hợp.
          </p>
          <ul className="mt-8 grid gap-3 text-left">
            {[
              "Tổng hợp từ vựng theo chủ đề",
              "Giải thích đáp án chi tiết",
              "Mock test chuẩn cấu trúc",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
                  <Check size={16} />
                </span>
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
