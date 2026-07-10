'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Send } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface FormState {
  name: string
  email: string
  company: string
  message: string
  interest: string
}

const EMPTY: FormState = { name: '', email: '', company: '', message: '', interest: '' }

const SERVICES = [
  { value: 'medical',     label: 'NexLink MedAI' },
  { value: 'accounting',  label: 'Workflow Management System' },
  { value: 'consulting',  label: 'IT Consulting' },
  { value: 'development', label: 'Custom Software Development' },
  { value: 'other',       label: 'Other' },
]

export default function ContactForm() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = (): boolean => {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required'
    if (!form.interest.trim()) e.interest = 'Please select a service'
    if (!form.message.trim()) e.message = 'Please tell us about your project'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSending(true)
    setSendError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Send failed')
      setSubmitted(true)
    } catch {
      setSendError('Failed to send. Please email us directly at admin@metavision.world')
    } finally {
      setSending(false)
    }
  }

  const tok = {
    cardBg:     isDark ? 'rgba(255,255,255,0.035)' : '#ffffff',
    cardBorder: isDark ? 'rgba(255,255,255,0.08)'  : 'rgba(15,23,42,0.07)',
    cardShadow: isDark ? 'none' : '0 4px 24px rgba(15,23,42,0.05)',
    heading:    isDark ? '#ffffff' : '#0f172a',
    label:      isDark ? 'rgba(255,255,255,0.65)' : '#334155',
    inputBg:    isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
    inputBorder:isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)',
    inputText:  isDark ? '#ffffff' : '#0f172a',
    placeholder:isDark ? 'rgba(255,255,255,0.30)' : 'rgba(15,23,42,0.35)',
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-10 flex flex-col items-center text-center gap-4 rounded-2xl"
        style={{ background: tok.cardBg, border: `1px solid ${tok.cardBorder}`, boxShadow: tok.cardShadow }}
      >
        <CheckCircle size={40} className="text-gold" />
        <h3 className="font-heading font-bold text-xl" style={{ color: tok.heading }}>Message Sent!</h3>
        <p className="text-sm" style={{ color: tok.label }}>We&apos;ll get back to you within 24 hours.</p>
        <button onClick={() => { setForm(EMPTY); setSubmitted(false) }} className="text-gold text-sm hover:underline">
          Send another message
        </button>
      </motion.div>
    )
  }

  const fieldStyle = (key: keyof FormState): React.CSSProperties => ({
    background: tok.inputBg,
    border: `1px solid ${errors[key] ? '#ef4444' : tok.inputBorder}`,
    color: tok.inputText,
  })

  return (
    <form
      onSubmit={handleSubmit}
      className="p-7 lg:p-8 flex flex-col gap-5 rounded-2xl"
      style={{ background: tok.cardBg, border: `1px solid ${tok.cardBorder}`, boxShadow: tok.cardShadow }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#2563eb' }}>
          <Send size={17} style={{ color: '#ffffff' }} />
        </div>
        <h2 className="font-heading font-bold text-xl" style={{ color: tok.heading }}>Send Us a Message</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: tok.label }}>Full Name *</label>
          <input
            className="w-full rounded-lg px-4 py-3 text-sm placeholder:opacity-100 focus:outline-none focus:border-gold/50 transition-colors"
            style={{ ...fieldStyle('name'), ['--tw-placeholder-opacity' as string]: 1 }}
            placeholder="Enter your full name"
            value={form.name}
            onChange={set('name')}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: tok.label }}>Business Email *</label>
          <input
            className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors"
            style={fieldStyle('email')}
            placeholder="Enter your email address"
            type="email"
            value={form.email}
            onChange={set('email')}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: tok.label }}>Company Name</label>
        <input
          className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors"
          style={fieldStyle('company')}
          placeholder="Enter your company name"
          value={form.company}
          onChange={set('company')}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: tok.label }}>Service Required *</label>
        <select
          className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors"
          style={fieldStyle('interest')}
          value={form.interest}
          onChange={set('interest')}
        >
          <option value="" disabled>Select a service</option>
          {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {errors.interest && <p className="text-red-400 text-xs mt-1">{errors.interest}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: tok.label }}>Tell Us About Your Project *</label>
        <textarea
          className="w-full rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-gold/50 transition-colors"
          style={fieldStyle('message')}
          placeholder="Write your message here..."
          value={form.message}
          onChange={set('message')}
          rows={5}
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
      </div>

      {sendError && <p className="text-red-400 text-xs">{sendError}</p>}

      <button
        type="submit"
        disabled={sending}
        className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
        style={{ background: '#2563eb', boxShadow: '0 4px 16px rgba(37,99,235,0.35)', color: '#ffffff' }}
      >
        <Send size={15} />
        {sending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
