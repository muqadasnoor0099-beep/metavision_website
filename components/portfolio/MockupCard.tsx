'use client'

import { motion } from 'framer-motion'
import type { PortfolioItem } from '@/lib/types'

interface Props {
  item: PortfolioItem
  index: number
}

export default function MockupCard({ item, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group relative glass-card overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
        <button className="bg-gradient-to-r from-gold to-gold-light text-white text-xs font-bold px-4 py-2 rounded-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          View Demo
        </button>
      </div>

      {/* Card body */}
      <div className="p-4">
        <span className="text-[10px] font-bold text-gold tracking-widest uppercase">{item.tag}</span>
        <h3 className="text-white font-semibold text-sm mt-1">{item.title}</h3>
      </div>

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-xl border border-gold/0 group-hover:border-gold/25 transition-all duration-300 pointer-events-none" />
    </motion.div>
  )
}
