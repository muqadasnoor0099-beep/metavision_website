'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import GoldButton from '@/components/ui/GoldButton'

interface FormState {
  name: string
  email: string
  phone: string
  company: string
  message: string
  interest: string
}

const EMPTY: FormState = { name: '', email: '', phone: '', company: '', message: '', interest: '' }

export default function ContactForm() {
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
    if (!form.message.trim()) e.message = 'Message is required'
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

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-10 flex flex-col items-center text-center gap-4"
      >
        <CheckCircle size={40} className="text-gold" />
        <h3 className="text-white font-heading font-bold text-xl">Message Sent!</h3>
        <p className="text-white/50 text-sm">We'll get back to you within 24 hours.</p>
        <button onClick={() => { setForm(EMPTY); setSubmitted(false) }} className="text-gold text-sm hover:underline">
          Send another message
        </button>
      </motion.div>
    )
  }

  const inputClass = (key: keyof FormState) =>
    `w-full bg-white/[0.04] border ${errors[key] ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors`

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <input className={inputClass('name')} placeholder="Full Name *" value={form.name} onChange={set('name')} />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <input className={inputClass('email')} placeholder="Email Address *" value={form.email} onChange={set('email')} type="email" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <input className={inputClass('phone')} placeholder="Phone Number" value={form.phone} onChange={set('phone')} />
        <input className={inputClass('company')} placeholder="Company / Practice Name" value={form.company} onChange={set('company')} />
      </div>
      <select className={inputClass('interest')} value={form.interest} onChange={set('interest')}>
        <option value="" disabled>I'm interested in...</option>
        <option value="medical">NexLink MedAI</option>
        <option value="accounting">Accounting Software</option>
        <option value="both">Both Products</option>
      </select>
      <div>
        <textarea
          className={`${inputClass('message')} resize-none`}
          placeholder="Your message *"
          value={form.message}
          onChange={set('message')}
          rows={5}
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
      </div>
      {sendError && <p className="text-red-400 text-xs text-center">{sendError}</p>}
      <GoldButton type="submit" className="w-full justify-center" disabled={sending}>
        {sending ? 'Sending…' : 'Send Message'}
      </GoldButton>
    </form>
  )
}
