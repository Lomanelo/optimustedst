'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ClientLayout from '../components/ClientLayout';
import { useCMS } from '../contexts/cms-context';
import meetingAvailabilityService, {
  DEFAULT_MEETING_AVAILABILITY,
  MeetingAvailabilitySettings,
  WeekdayKey
} from '../../src/services/meetingAvailabilityService';
import { Calendar, Clock, Phone, Mail, User, Send, CheckCircle, AlertCircle } from 'lucide-react';

type Slot = { start: Date; end: Date; label: string };

const WEEKDAY_ORDER: WeekdayKey[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

const WEEKDAY_LABELS: Record<WeekdayKey, { en: string; ar: string }> = {
  sunday: { en: 'Sunday', ar: 'الأحد' },
  monday: { en: 'Monday', ar: 'الاثنين' },
  tuesday: { en: 'Tuesday', ar: 'الثلاثاء' },
  wednesday: { en: 'Wednesday', ar: 'الأربعاء' },
  thursday: { en: 'Thursday', ar: 'الخميس' },
  friday: { en: 'Friday', ar: 'الجمعة' },
  saturday: { en: 'Saturday', ar: 'السبت' }
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function parseHHMM(hhmm: string): { h: number; m: number } {
  const [hRaw, mRaw] = (hhmm || '').split(':');
  const h = Math.max(0, Math.min(23, parseInt(hRaw || '0', 10)));
  const m = Math.max(0, Math.min(59, parseInt(mRaw || '0', 10)));
  return { h, m };
}

function toWeekdayKey(date: Date): WeekdayKey {
  // JS: 0=Sun...6=Sat
  const map: WeekdayKey[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return map[date.getDay()]!;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateInputValue(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatTimeLabel(d: Date, locale: string) {
  // Uses user's locale, but for Arabic we force ar-SA to show Arabic numerals/AM-PM wording
  const resolvedLocale = locale === 'ar' ? 'ar-SA' : 'en-US';
  return new Intl.DateTimeFormat(resolvedLocale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(d);
}

function buildSlotsForDate(
  date: Date,
  settings: MeetingAvailabilitySettings,
  locale: 'en' | 'ar'
): Slot[] {
  const dayKey = toWeekdayKey(date);
  const day = settings.weekly[dayKey];
  if (!day?.isOpen) return [];

  const { h: oh, m: om } = parseHHMM(day.openTime);
  const { h: ch, m: cm } = parseHHMM(day.closeTime);

  const start = new Date(date);
  start.setHours(oh, om, 0, 0);
  const end = new Date(date);
  end.setHours(ch, cm, 0, 0);

  const slotMs = Math.max(5, settings.slotDurationMinutes) * 60 * 1000;
  const slots: Slot[] = [];
  for (let t = start.getTime(); t + slotMs <= end.getTime(); t += slotMs) {
    const s = new Date(t);
    const e = new Date(t + slotMs);
    slots.push({
      start: s,
      end: e,
      label: `${formatTimeLabel(s, locale)} - ${formatTimeLabel(e, locale)}`
    });
  }
  return slots;
}

export default function BookACallPage() {
  const { currentLanguage, getContent } = useCMS();
  const isArabic = currentLanguage === 'ar';

  // Resolve title/subtitle with safe fallbacks if CMS returns the key itself or empty
  const rawTitle = getContent('book_call_title');
  const titleText =
    rawTitle && rawTitle !== 'book_call_title'
      ? rawTitle
      : (isArabic ? 'احجز موعد مكالمة' : 'Book a Call');

  const rawSubtitle = getContent('book_call_subtitle');
  const subtitleText =
    rawSubtitle && rawSubtitle !== 'book_call_subtitle'
      ? rawSubtitle
      : (isArabic
          ? 'اختر التاريخ والوقت المناسب لك ضمن أوقات العمل المتاحة. مدة كل اجتماع ٣٠ دقيقة.'
          : 'Choose a date and time within our available hours. Each meeting is 30 minutes.');

  const [settings, setSettings] = useState<MeetingAvailabilitySettings>(DEFAULT_MEETING_AVAILABILITY);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const [dateValue, setDateValue] = useState(() => formatDateInputValue(addDays(new Date(), 1)));
  const selectedDate = useMemo(() => {
    const [y, m, d] = dateValue.split('-').map((x) => parseInt(x, 10));
    const dt = new Date(y, (m || 1) - 1, d || 1);
    dt.setHours(0, 0, 0, 0);
    return dt;
  }, [dateValue]);

  const weekdayKey = useMemo(() => toWeekdayKey(selectedDate), [selectedDate]);
  const slots = useMemo(
    () => buildSlotsForDate(selectedDate, settings, currentLanguage),
    [selectedDate, settings, currentLanguage]
  );

  const [selectedSlotStartIso, setSelectedSlotStartIso] = useState<string>('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [calendarInfo, setCalendarInfo] = useState<{ created: boolean; link?: string; error?: any } | null>(null);

  useEffect(() => {
    // Reset slot when date changes
    setSelectedSlotStartIso('');
  }, [dateValue]);

  useEffect(() => {
    // Load availability (best-effort). If Firestore rules block it, page still works with defaults.
    meetingAvailabilityService
      .getSettings()
      .then((s) => {
        setSettings(s);
        setSettingsLoaded(true);
      })
      .catch(() => setSettingsLoaded(true));
  }, []);

  const minDate = useMemo(() => formatDateInputValue(addDays(new Date(), 1)), []);
  const maxDate = useMemo(() => formatDateInputValue(addDays(new Date(), 30)), []);

  const dayAvailability = settings.weekly[weekdayKey];
  const isClosed = !dayAvailability?.isOpen;

  const weekdayLabel = isArabic ? WEEKDAY_LABELS[weekdayKey].ar : WEEKDAY_LABELS[weekdayKey].en;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setCalendarInfo(null);

    if (!form.name || !form.email || !selectedSlotStartIso) {
      setError(isArabic ? 'يرجى تعبئة الاسم والبريد الإلكتروني واختيار موعد.' : 'Please fill name, email, and pick a time slot.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
          preferredLanguage: currentLanguage,
          slotStartIso: selectedSlotStartIso,
          timezone: settings.timezone,
          slotDurationMinutes: settings.slotDurationMinutes
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to submit');

      if (data?.calendar) {
        setCalendarInfo({
          created: !!data.calendar.created,
          link: data.calendar.link,
          error: data.calendar.error
        });
      }

      setSuccess(
        isArabic
          ? 'تم إرسال طلبك بنجاح. سيتواصل معك فريقنا لتأكيد الموعد.'
          : 'Your request was submitted successfully. Our team will contact you to confirm.'
      );
      setForm({ name: '', email: '', phone: '', notes: '' });
      setSelectedSlotStartIso('');
    } catch (err) {
      console.error(err);
      setError(isArabic ? 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.' : 'Something went wrong while submitting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ClientLayout>
      <div className="pt-20 pb-16 bg-gray-50" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Loading overlay while submitting */}
          {submitting ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg px-6 py-5 w-[min(92vw,420px)]">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300 border-t-accent animate-spin" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {isArabic ? 'جارٍ تأكيد الحجز...' : 'Confirming your booking...'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {isArabic ? 'يرجى الانتظار قليلًا.' : 'Please wait a moment.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-primary mb-3">
              {titleText}
            </h1>
            <p className="text-gray-600">
              {subtitleText}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
                    <AlertCircle className="text-red-600 mt-0.5" size={18} />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start gap-3">
                    <CheckCircle className="text-green-600 mt-0.5" size={18} />
                    <div className="text-green-700 text-sm space-y-2">
                      <p>{success}</p>
                      {calendarInfo ? (
                        <div className="text-xs text-green-800">
                          {calendarInfo.created ? (
                            <div className="space-y-1">
                              <p>{isArabic ? 'تم إنشاء الموعد في تقويم Google.' : 'A Google Calendar event was created.'}</p>
                              {/* Link removed per request */}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p>
                                {isArabic
                                  ? 'لم يتم إنشاء الموعد تلقائيًّا في تقويم Google (تم إرسال الطلب فقط).'
                                  : 'The request was submitted, but the event was not auto-created in Google Calendar.'}
                              </p>
                              {calendarInfo.error?.message ? (
                                <p className="text-gray-700">
                                  {isArabic ? 'السبب:' : 'Reason:'} {String(calendarInfo.error.message)}
                                </p>
                              ) : null}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        {isArabic ? 'الاسم الكامل' : 'Full Name'}*
                      </label>
                      <div className="relative">
                        <User className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} size={18} />
                        <input
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          className={`w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
                            isArabic ? 'text-right' : 'text-left'
                          }`}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        {isArabic ? 'البريد الإلكتروني' : 'Email'}*
                      </label>
                      <div className="relative">
                        <Mail className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} size={18} />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                          className={`w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
                            isArabic ? 'text-right' : 'text-left'
                          }`}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">{isArabic ? 'رقم الهاتف' : 'Phone'}</label>
                      <div className="relative">
                        <Phone className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} size={18} />
                        <input
                          value={form.phone}
                          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                          className={`w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
                            isArabic ? 'text-right' : 'text-left'
                          }`}
                          placeholder={isArabic ? 'اختياري' : 'Optional'}
                        />
                      </div>
                    </div>
                  </div>

              {/* Mobile-only availability block (shown between contact info and date) */}
              <div className="bg-white rounded-lg shadow-md p-6 md:hidden">
                <h2 className="text-xl font-bold text-primary mb-4">{isArabic ? 'مواعيدنا المتاحة' : 'Our availability'}</h2>
                <p className="text-sm text-gray-600 mb-4">
                  {isArabic ? 'مدة كل اجتماع: ٣٠ دقيقة' : 'Meeting duration: 30 minutes'}
                  {settings.timezone ? ` · ${settings.timezone}` : ''}
                </p>
                <div className="space-y-3 text-sm">
                  {WEEKDAY_ORDER.map((day) => {
                    const d = settings.weekly[day];
                    const label = isArabic ? WEEKDAY_LABELS[day].ar : WEEKDAY_LABELS[day].en;
                    return (
                      <div key={day} className="flex items-start justify-between gap-4">
                        <span className="font-medium text-gray-800">{label}</span>
                        <span className="text-gray-600">
                          {d.isOpen ? `${d.openTime} - ${d.closeTime}` : isArabic ? 'مغلق' : 'Closed'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {!settingsLoaded && (
                  <p className="mt-4 text-xs text-gray-500">
                    {isArabic ? 'جارٍ تحميل الإعدادات...' : 'Loading settings...'}
                  </p>
                )}
              </div>

              {/* Date picker moved below contact info and after mobile availability */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {isArabic ? 'التاريخ' : 'Date'}*
                </label>
                <div className="relative">
                  <Calendar className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} size={18} />
                  <input
                    type="date"
                    value={dateValue}
                    min={minDate}
                    max={maxDate}
                    onChange={(e) => setDateValue(e.target.value)}
                    className={`w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
                      isArabic ? 'text-right' : 'text-left'
                    }`}
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {isArabic ? `اليوم المختار: ${weekdayLabel}` : `Selected day: ${weekdayLabel}`}
                </p>
              </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {isArabic ? 'اختر وقت الاجتماع (٣٠ دقيقة)' : 'Pick a time (30 minutes)'}*
                    </label>

                    {isClosed ? (
                      <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-600">
                        {isArabic ? 'لا توجد مواعيد متاحة في هذا اليوم. يرجى اختيار يوم آخر.' : 'No availability for this day. Please choose another date.'}
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-600">
                        {isArabic ? 'لا توجد فترات متاحة ضمن ساعات العمل لهذا اليوم.' : 'No slots available within working hours for this day.'}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {slots.map((s) => {
                          const key = s.start.toISOString();
                          const selected = selectedSlotStartIso === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setSelectedSlotStartIso(key)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors ${
                                selected
                                  ? 'border-accent bg-accent text-white'
                                  : 'border-gray-200 hover:border-accent hover:bg-accent/5 text-gray-700'
                              }`}
                            >
                              <Clock size={16} className={selected ? 'text-white' : 'text-gray-500'} />
                              <span className="whitespace-nowrap">{s.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">{isArabic ? 'ملاحظات' : 'Notes'}</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                      rows={4}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
                        isArabic ? 'text-right' : 'text-left'
                      }`}
                      placeholder={isArabic ? 'اختياري: اكتب أي تفاصيل أو أسئلة' : 'Optional: add any details or questions'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    <Send size={16} />
                    {submitting ? (isArabic ? 'جارٍ الإرسال...' : 'Submitting...') : isArabic ? 'إرسال الطلب' : 'Submit request'}
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6 hidden lg:block">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-primary mb-4">{isArabic ? 'مواعيدنا المتاحة' : 'Our availability'}</h2>
                <p className="text-sm text-gray-600 mb-4">
                  {isArabic ? 'مدة كل اجتماع: ٣٠ دقيقة' : 'Meeting duration: 30 minutes'}
                  {settings.timezone ? ` · ${settings.timezone}` : ''}
                </p>

                <div className="space-y-3 text-sm">
                  {WEEKDAY_ORDER.map((day) => {
                    const d = settings.weekly[day];
                    const label = isArabic ? WEEKDAY_LABELS[day].ar : WEEKDAY_LABELS[day].en;
                    return (
                      <div key={day} className="flex items-start justify-between gap-4">
                        <span className="font-medium text-gray-800">{label}</span>
                        <span className="text-gray-600">
                          {d.isOpen ? `${d.openTime} - ${d.closeTime}` : isArabic ? 'مغلق' : 'Closed'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {!settingsLoaded && (
                  <p className="mt-4 text-xs text-gray-500">
                    {isArabic ? 'جارٍ تحميل الإعدادات...' : 'Loading settings...'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}


