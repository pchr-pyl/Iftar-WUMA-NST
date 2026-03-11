import React, { useState, useEffect } from 'react';
import { format, differenceInSeconds } from 'date-fns';
import { Moon, Sun, Clock, Calendar } from 'lucide-react';

interface PrayerTime {
  day: number;
  date: string;
  imsak: string;
  subuh: string;
  syuruk: string;
  zuhur: string;
  asar: string;
  maghrib: string;
  isyak: string;
}

const RAMADAN_1446: PrayerTime[] = [
  { day: 1,  date: '01 Mac 2025', imsak: '05:41', subuh: '05:51', syuruk: '07:10', zuhur: '13:18', asar: '16:35', maghrib: '19:19', isyak: '20:29' },
  { day: 2,  date: '02 Mac 2025', imsak: '05:40', subuh: '05:50', syuruk: '07:09', zuhur: '13:18', asar: '16:35', maghrib: '19:19', isyak: '20:29' },
  { day: 3,  date: '03 Mac 2025', imsak: '05:40', subuh: '05:50', syuruk: '07:09', zuhur: '13:18', asar: '16:35', maghrib: '19:19', isyak: '20:29' },
  { day: 4,  date: '04 Mac 2025', imsak: '05:39', subuh: '05:49', syuruk: '07:08', zuhur: '13:17', asar: '16:34', maghrib: '19:19', isyak: '20:29' },
  { day: 5,  date: '05 Mac 2025', imsak: '05:39', subuh: '05:49', syuruk: '07:08', zuhur: '13:17', asar: '16:34', maghrib: '19:19', isyak: '20:29' },
  { day: 6,  date: '06 Mac 2025', imsak: '05:38', subuh: '05:48', syuruk: '07:07', zuhur: '13:17', asar: '16:34', maghrib: '19:19', isyak: '20:29' },
  { day: 7,  date: '07 Mac 2025', imsak: '05:38', subuh: '05:48', syuruk: '07:07', zuhur: '13:17', asar: '16:34', maghrib: '19:19', isyak: '20:29' },
  { day: 8,  date: '08 Mac 2025', imsak: '05:37', subuh: '05:47', syuruk: '07:06', zuhur: '13:17', asar: '16:34', maghrib: '19:19', isyak: '20:29' },
  { day: 9,  date: '09 Mac 2025', imsak: '05:36', subuh: '05:46', syuruk: '07:06', zuhur: '13:16', asar: '16:33', maghrib: '19:19', isyak: '20:28' },
  { day: 10, date: '10 Mac 2025', imsak: '05:36', subuh: '05:46', syuruk: '07:05', zuhur: '13:16', asar: '16:33', maghrib: '19:19', isyak: '20:28' },
  { day: 11, date: '11 Mac 2025', imsak: '05:35', subuh: '05:45', syuruk: '07:05', zuhur: '13:16', asar: '16:33', maghrib: '19:18', isyak: '20:28' },
  { day: 12, date: '12 Mac 2025', imsak: '05:35', subuh: '05:45', syuruk: '07:04', zuhur: '13:15', asar: '16:33', maghrib: '19:18', isyak: '20:28' },
  { day: 13, date: '13 Mac 2025', imsak: '05:34', subuh: '05:44', syuruk: '07:03', zuhur: '13:15', asar: '16:32', maghrib: '19:18', isyak: '20:28' },
  { day: 14, date: '14 Mac 2025', imsak: '05:33', subuh: '05:43', syuruk: '07:03', zuhur: '13:15', asar: '16:32', maghrib: '19:18', isyak: '20:28' },
  { day: 15, date: '15 Mac 2025', imsak: '05:33', subuh: '05:43', syuruk: '07:02', zuhur: '13:15', asar: '16:32', maghrib: '19:18', isyak: '20:27' },
  { day: 16, date: '16 Mac 2025', imsak: '05:32', subuh: '05:42', syuruk: '07:01', zuhur: '13:14', asar: '16:31', maghrib: '19:18', isyak: '20:27' },
  { day: 17, date: '17 Mac 2025', imsak: '05:31', subuh: '05:41', syuruk: '07:01', zuhur: '13:14', asar: '16:31', maghrib: '19:18', isyak: '20:27' },
  { day: 18, date: '18 Mac 2025', imsak: '05:31', subuh: '05:41', syuruk: '07:00', zuhur: '13:14', asar: '16:31', maghrib: '19:17', isyak: '20:27' },
  { day: 19, date: '19 Mac 2025', imsak: '05:30', subuh: '05:40', syuruk: '06:59', zuhur: '13:13', asar: '16:30', maghrib: '19:17', isyak: '20:27' },
  { day: 20, date: '20 Mac 2025', imsak: '05:29', subuh: '05:39', syuruk: '06:59', zuhur: '13:13', asar: '16:30', maghrib: '19:17', isyak: '20:26' },
  { day: 21, date: '21 Mac 2025', imsak: '05:29', subuh: '05:39', syuruk: '06:58', zuhur: '13:13', asar: '16:30', maghrib: '19:17', isyak: '20:26' },
  { day: 22, date: '22 Mac 2025', imsak: '05:28', subuh: '05:38', syuruk: '06:57', zuhur: '13:12', asar: '16:29', maghrib: '19:17', isyak: '20:26' },
  { day: 23, date: '23 Mac 2025', imsak: '05:27', subuh: '05:37', syuruk: '06:57', zuhur: '13:12', asar: '16:29', maghrib: '19:16', isyak: '20:26' },
  { day: 24, date: '24 Mac 2025', imsak: '05:27', subuh: '05:37', syuruk: '06:56', zuhur: '13:12', asar: '16:29', maghrib: '19:16', isyak: '20:25' },
  { day: 25, date: '25 Mac 2025', imsak: '05:26', subuh: '05:36', syuruk: '06:55', zuhur: '13:11', asar: '16:28', maghrib: '19:16', isyak: '20:25' },
  { day: 26, date: '26 Mac 2025', imsak: '05:25', subuh: '05:35', syuruk: '06:55', zuhur: '13:11', asar: '16:28', maghrib: '19:16', isyak: '20:25' },
  { day: 27, date: '27 Mac 2025', imsak: '05:24', subuh: '05:34', syuruk: '06:54', zuhur: '13:11', asar: '16:27', maghrib: '19:15', isyak: '20:25' },
  { day: 28, date: '28 Mac 2025', imsak: '05:24', subuh: '05:34', syuruk: '06:53', zuhur: '13:10', asar: '16:27', maghrib: '19:15', isyak: '20:24' },
  { day: 29, date: '29 Mac 2025', imsak: '05:23', subuh: '05:33', syuruk: '06:52', zuhur: '13:10', asar: '16:27', maghrib: '19:15', isyak: '20:24' },
  { day: 30, date: '30 Mac 2025', imsak: '05:22', subuh: '05:32', syuruk: '06:52', zuhur: '13:09', asar: '16:26', maghrib: '19:15', isyak: '20:24' },
];

function parseTime(timeStr: string, date: Date = new Date()): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export default function App() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayDay = now.getDate();
  const todayMonth = now.getMonth(); // 0-indexed; March = 2
  const todayYear = now.getFullYear();
  // Ramadan 1446H: 1–30 March 2025
  const isRamadan = todayYear === 2025 && todayMonth === 2 && todayDay >= 1 && todayDay <= 30;
  const todayEntry = isRamadan ? RAMADAN_1446[todayDay - 1] : null;

  let countdownLabel = '';
  let countdownSeconds = 0;

  if (todayEntry) {
    const maghribTime = parseTime(todayEntry.maghrib, now);
    const secondsToMaghrib = differenceInSeconds(maghribTime, now);

    if (secondsToMaghrib > 0) {
      countdownLabel = 'เวลาที่เหลือก่อนอิฟตาร์';
      countdownSeconds = secondsToMaghrib;
    } else {
      // After Maghrib — count down to tomorrow's Imsak if available
      const nextEntry = todayDay < 30 ? RAMADAN_1446[todayDay] : null;
      if (nextEntry) {
        const tomorrow = addDays(now, 1);
        const tomorrowImsak = parseTime(nextEntry.imsak, tomorrow);
        countdownLabel = 'เวลาที่เหลือก่อนอิมซัก (พรุ่งนี้)';
        countdownSeconds = Math.max(0, differenceInSeconds(tomorrowImsak, now));
      } else {
        countdownLabel = 'สิ้นสุดรอมฎอน 1446H';
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 to-green-900 text-white">
      {/* Header */}
      <header className="bg-green-900/80 backdrop-blur border-b border-green-700/50 py-6 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <Moon className="w-8 h-8 text-yellow-300" />
            <h1 className="text-3xl font-bold tracking-wide">ตารางอิฟตาร์</h1>
            <Moon className="w-8 h-8 text-yellow-300" />
          </div>
          <p className="text-green-300 text-sm font-medium">
            รอมฎอน 1446H · WUMA – NST · มีนาคม 2025
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Clock & Countdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-green-800/50 border border-green-700/40 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-green-300">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">เวลาปัจจุบัน</span>
            </div>
            <p className="text-4xl font-mono font-bold text-white">
              {format(now, 'HH:mm:ss')}
            </p>
            <p className="text-green-300 mt-1 text-sm">{format(now, 'EEEE, d MMMM yyyy')}</p>
          </div>

          {todayEntry ? (
            <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2 text-yellow-300">
                <Sun className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  {countdownLabel}
                </span>
              </div>
              <p className="text-4xl font-mono font-bold text-yellow-200">
                {formatCountdown(countdownSeconds)}
              </p>
              <p className="text-yellow-300 mt-1 text-sm">
                อิฟตาร์วันนี้ (มัฆริบ): <strong>{todayEntry.maghrib}</strong>
              </p>
            </div>
          ) : (
            <div className="bg-green-800/50 border border-green-700/40 rounded-2xl p-6 text-center flex items-center justify-center">
              <div>
                <Calendar className="w-10 h-10 text-green-400 mx-auto mb-2" />
                <p className="text-green-300 text-sm">ดูตารางอิฟตาร์</p>
                <p className="text-green-200 text-sm">รอมฎอน 1446H มีนาคม 2025</p>
              </div>
            </div>
          )}
        </div>

        {/* Today highlight */}
        {todayEntry && (
          <div className="bg-green-700/30 border-2 border-yellow-400/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-yellow-300 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              วันที่ {todayEntry.day} รอมฎอน – {todayEntry.date}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'อิมซัก', time: todayEntry.imsak },
                { label: 'ซุบฮฺ', time: todayEntry.subuh },
                { label: 'ชุรุก', time: todayEntry.syuruk },
                { label: 'ซุฮฺร', time: todayEntry.zuhur },
                { label: 'อัสร', time: todayEntry.asar },
                { label: 'มัฆริบ', time: todayEntry.maghrib, highlight: true },
                { label: 'อิชาอ์', time: todayEntry.isyak },
              ].map(({ label, time, highlight }) => (
                <div
                  key={label}
                  className={`rounded-xl p-3 text-center ${
                    highlight
                      ? 'bg-yellow-500/30 border border-yellow-400/50'
                      : 'bg-green-800/40 border border-green-700/30'
                  }`}
                >
                  <p className={`text-xs font-medium mb-1 ${highlight ? 'text-yellow-300' : 'text-green-400'}`}>
                    {label}
                  </p>
                  <p className={`text-lg font-bold font-mono ${highlight ? 'text-yellow-200' : 'text-white'}`}>
                    {time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full schedule table */}
        <div className="bg-green-800/30 border border-green-700/30 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-green-800/50 border-b border-green-700/30">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Moon className="w-5 h-5 text-yellow-300" />
              ตารางเวลาละหมาดรอมฎอน 1446H · WUMA NST
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-900/60 text-green-300 text-xs uppercase tracking-wider">
                  <th className="px-3 py-3 text-left w-8">วัน</th>
                  <th className="px-3 py-3 text-left">วันที่</th>
                  <th className="px-3 py-3 text-center">อิมซัก</th>
                  <th className="px-3 py-3 text-center">ซุบฮฺ</th>
                  <th className="px-3 py-3 text-center">ชุรุก</th>
                  <th className="px-3 py-3 text-center">ซุฮฺร</th>
                  <th className="px-3 py-3 text-center">อัสร</th>
                  <th className="px-3 py-3 text-center text-yellow-300">มัฆริบ</th>
                  <th className="px-3 py-3 text-center">อิชาอ์</th>
                </tr>
              </thead>
              <tbody>
                {RAMADAN_1446.map((row) => {
                  const isToday = isRamadan && row.day === todayDay;
                  return (
                    <tr
                      key={row.day}
                      className={`border-b border-green-800/40 transition-colors ${
                        isToday
                          ? 'bg-yellow-500/10 border-yellow-500/20'
                          : 'hover:bg-green-800/20'
                      }`}
                    >
                      <td className="px-3 py-2.5 text-green-400 font-medium">{row.day}</td>
                      <td className="px-3 py-2.5 text-green-200 whitespace-nowrap">{row.date}</td>
                      <td className="px-3 py-2.5 text-center font-mono">{row.imsak}</td>
                      <td className="px-3 py-2.5 text-center font-mono">{row.subuh}</td>
                      <td className="px-3 py-2.5 text-center font-mono">{row.syuruk}</td>
                      <td className="px-3 py-2.5 text-center font-mono">{row.zuhur}</td>
                      <td className="px-3 py-2.5 text-center font-mono">{row.asar}</td>
                      <td className="px-3 py-2.5 text-center font-mono font-bold text-yellow-300">
                        {row.maghrib}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono">{row.isyak}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-green-500 text-xs pb-4">
          เวลาที่แสดงเป็นเวลามาตรฐาน WUMA – NST · ปีฮิจเราะห์ศักราช 1446
        </p>
      </main>
    </div>
  );
}
