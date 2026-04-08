'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Brain, DollarSign, Shield, Clock, TrendingUp,
  ChevronDown, ChevronUp, Crown, Swords, Rocket,
  Flame, CheckCircle, Settings, User, AlertTriangle,
  Target, Zap, Star
} from 'lucide-react'

// ─── Primitives ───────────────────────────────────────────────────────────────
function SectionLabel({ n, title, color = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' }: { n: string; title: string; color?: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit text-xs font-black uppercase tracking-widest ${color}`}>
      <span className="opacity-50">{n}</span><span>{title}</span>
    </div>
  )
}

function Accordion({ title, subtitle, accent = 'border-white/[0.08]', children, defaultOpen = false }: {
  title: string; subtitle?: string; accent?: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`rounded-2xl border ${accent} bg-white/[0.02] overflow-hidden`}>
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors">
        <div>
          <div className="text-sm font-bold text-white">{title}</div>
          {subtitle && <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>}
        </div>
        {open ? <ChevronUp size={15} className="text-gray-600 shrink-0" /> : <ChevronDown size={15} className="text-gray-600 shrink-0" />}
      </button>
      {open && <div className="px-4 pb-5 space-y-2.5 border-t border-white/[0.05] pt-4">{children}</div>}
    </div>
  )
}

function Item({ icon, text, color = 'text-gray-300', bold }: { icon?: string; text: string; color?: string; bold?: boolean }) {
  return (
    <div className="flex items-start gap-2.5 py-1">
      <span className="text-sm shrink-0 mt-0.5 leading-none">{icon ?? '▸'}</span>
      <span className={cn('text-sm leading-relaxed', color, bold && 'font-bold')}>{text}</span>
    </div>
  )
}

function Callout({ type, title, children }: { type: 'danger' | 'success' | 'warning' | 'info' | 'purple'; title: string; children: React.ReactNode }) {
  const s = {
    danger:  'bg-red-500/[0.05] border-red-500/20 text-red-400',
    success: 'bg-green-500/[0.05] border-green-500/20 text-green-400',
    warning: 'bg-amber-500/[0.05] border-amber-500/20 text-amber-400',
    info:    'bg-indigo-500/[0.05] border-indigo-500/20 text-indigo-400',
    purple:  'bg-purple-500/[0.05] border-purple-500/20 text-purple-400',
  }
  return (
    <div className={`rounded-xl border p-4 ${s[type]}`}>
      <div className="text-[10px] font-black uppercase tracking-widest mb-2">{title}</div>
      <div className="text-xs text-gray-300 leading-relaxed space-y-1">{children}</div>
    </div>
  )
}

function ScheduleRow({ time, task, type }: { time: string; task: string; type: 'power' | 'build' | 'rest' | 'grind' | 'critical' }) {
  const s = {
    power:    'bg-indigo-500/10 border-indigo-500/20 text-indigo-200',
    build:    'bg-amber-500/10 border-amber-500/20 text-amber-200',
    rest:     'bg-green-500/10 border-green-500/20 text-green-200',
    grind:    'bg-red-500/10 border-red-500/20 text-red-200',
    critical: 'bg-purple-500/10 border-purple-500/20 text-purple-200',
  }
  return (
    <div className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border text-xs ${s[type]}`}>
      <span className="font-black shrink-0 w-16 opacity-80 pt-0.5">{time}</span>
      <span className="font-medium leading-relaxed">{task}</span>
    </div>
  )
}

function MindsetRow({ poor, rich }: { poor: string; rich: string }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-3">
        <div className="text-[10px] text-red-400 font-black mb-1.5 uppercase tracking-wider">❌ Broke Thinking</div>
        <div className="text-xs text-gray-400 leading-relaxed">{poor}</div>
      </div>
      <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-3">
        <div className="text-[10px] text-green-400 font-black mb-1.5 uppercase tracking-wider">✅ Millionaire Thinking</div>
        <div className="text-xs text-gray-300 leading-relaxed">{rich}</div>
      </div>
    </div>
  )
}

function MetricCard({ value, label, sub, color }: { value: string; label: string; sub: string; color: string }) {
  return (
    <div className="glass rounded-xl p-4 border border-white/[0.06] text-center">
      <div className={`text-2xl font-black ${color} mb-0.5`}>{value}</div>
      <div className="text-xs font-bold text-white">{label}</div>
      <div className="text-[10px] text-gray-600 mt-0.5">{sub}</div>
    </div>
  )
}

// ─── Tab + Sub-nav config ─────────────────────────────────────────────────────
const TABS = [
  { id: 'identity', label: 'Who You Are',     icon: User,     color: 'text-amber-400',  activeBg: 'bg-amber-500',   activeBorder: 'border-amber-500/30' },
  { id: 'systems',  label: 'Systems',          icon: Settings, color: 'text-indigo-400', activeBg: 'bg-indigo-500',  activeBorder: 'border-indigo-500/30' },
  { id: 'books',    label: 'Frameworks',       icon: Brain,    color: 'text-purple-400', activeBg: 'bg-purple-500',  activeBorder: 'border-purple-500/30' },
  { id: 'execute',  label: 'Execution',        icon: Flame,    color: 'text-orange-400', activeBg: 'bg-orange-500',  activeBorder: 'border-orange-500/30' },
] as const
type TabId = typeof TABS[number]['id']

const SUBS: Record<TabId, { id: string; label: string }[]> = {
  identity: [
    { id: 'declaration', label: 'Identity & DCA' },
    { id: 'mindset',     label: 'Mindset Audit' },
    { id: 'fears',       label: 'Kill Your Fears' },
  ],
  systems: [
    { id: 'schedule',    label: 'Daily Schedule' },
    { id: 'phases',      label: '90-Day Phases' },
    { id: 'discipline',  label: 'Discipline Protocol' },
  ],
  books: [
    { id: 'atomic',      label: 'Atomic Habits' },
    { id: 'richdad',     label: 'Rich Dad / Cashflow' },
    { id: 'napoleon',    label: 'Think & Grow Rich' },
  ],
  execute: [
    { id: 'nightly',     label: 'Nightly Review' },
    { id: 'weekly',      label: 'Weekly Plan' },
    { id: 'products',    label: 'Product Roadmap' },
  ],
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BlueprintClient() {
  const [tab, setTab] = useState<TabId>('identity')
  const [sub, setSub] = useState('declaration')

  const activeTab = TABS.find(t => t.id === tab)!

  function switchTab(id: TabId) {
    setTab(id)
    setSub(SUBS[id][0].id)
  }

  return (
    <div className="p-6 md:p-8 space-y-5 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown size={16} className="text-amber-400" />
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Elijah Nartey · CSE → Millionaire CEO</span>
          </div>
          <h1 className="text-2xl font-black text-white">90-Day Millionaire Blueprint</h1>
          <p className="text-sm text-gray-500 mt-0.5">Ruthless. Disciplined. Unbreakable. Your empire starts today.</p>
        </div>
        <div className="glass rounded-xl px-4 py-3 text-right shrink-0 border border-amber-500/20">
          <div className="text-xl font-black text-amber-400">$1M</div>
          <div className="text-[10px] text-gray-600 uppercase tracking-wider">by age 27</div>
        </div>
      </div>

      {/* ── DCA Banner ── */}
      <div className="glass rounded-2xl p-4 border border-amber-500/20 bg-amber-500/[0.03]">
        <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1.5">🔥 Definite Chief Aim — Read This Every Morning</div>
        <p className="text-xs text-gray-200 leading-relaxed font-medium">
          "I, <strong className="text-white">Elijah Nartey</strong>, will accumulate a minimum net worth of <strong className="text-amber-400">$1,000,000 USD</strong> by{' '}
          <strong className="text-amber-400">December 31, 2030</strong> — through <strong className="text-indigo-400">RushPay</strong>,{' '}
          <strong className="text-indigo-400">ShopKeeper</strong> &amp; my <strong className="text-indigo-400">AI Trading Bot</strong> — while graduating top of class.
          I give in return: relentless execution, iron discipline, and world-class products that transform West Africa's financial infrastructure.
          This is not a wish. <strong className="text-white">This is a decision.</strong>"
        </p>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-4 gap-2">
        <MetricCard value="90" label="Days" sub="Full program" color="text-indigo-400" />
        <MetricCard value="4h" label="Sleep Floor" sub="Non-negotiable" color="text-red-400" />
        <MetricCard value="$1M" label="5-Year Target" sub="USD net worth" color="text-amber-400" />
        <MetricCard value="3" label="Products" sub="Building now" color="text-green-400" />
      </div>

      {/* ── Main Tab Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => switchTab(t.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left',
              tab === t.id ? `${t.activeBg} text-white shadow-lg` : 'glass text-gray-500 hover:text-gray-200 hover:bg-white/5 border border-white/[0.06]'
            )}>
            <t.icon size={15} className={tab === t.id ? 'text-white' : t.color} />
            <span className="leading-tight">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Sub-nav ── */}
      <div className="flex gap-2 flex-wrap">
        {SUBS[tab].map(s => (
          <button key={s.id} onClick={() => setSub(s.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-bold transition-all border',
              sub === s.id
                ? `${activeTab.activeBorder} ${activeTab.color} bg-white/[0.05]`
                : 'border-white/[0.06] text-gray-600 hover:text-gray-400 hover:border-white/10'
            )}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════
          TAB 1 — WHO YOU ARE
      ════════════════════════════════════════════ */}
      {tab === 'identity' && (
        <div className="space-y-4">

          {/* Identity & DCA */}
          {sub === 'declaration' && (
            <div className="space-y-4">
              <SectionLabel n="01" title="Identity & Definite Chief Aim" color="bg-amber-500/10 text-amber-300 border-amber-500/20" />

              <div className="glass rounded-2xl p-5 border border-amber-500/20">
                <div className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3">The Fundamental Shift — Identity FIRST</div>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  James Clear proved it: behavior change is <em>identity</em> change. Most people try to change habits — you need to change who you <strong className="text-white">are</strong>.
                  You are not a student trying to get rich. You are a <strong className="text-amber-400">tech CEO who happens to be in school right now</strong>.
                  Every decision flows from that identity. Phone in another room? CEOs protect their focus. Skipping the party? CEOs have a product to ship.
                </p>
                <div className="space-y-2">
                  {[
                    { icon: '👑', label: 'Builder', text: 'I create systems that generate wealth while I sleep. RushPay earns. ShopKeeper earns. My Bot earns. I sleep.' },
                    { icon: '⚔️', label: 'Executor', text: "I ship ugly and iterate. A 60% done product in users' hands beats a perfect product in my head 100x." },
                    { icon: '📈', label: 'Investor', text: 'Every hour, every cedi, every line of code — I treat as capital deployed. ROI thinking always.' },
                    { icon: '🔥', label: 'Disciplined', text: "I don't negotiate with my schedule. The plan runs me, not the other way around." },
                    { icon: '🌍', label: 'Visionary', text: "I'm not building for Ghana. I'm building for West Africa first, then the continent, then the world." },
                    { icon: '🧠', label: 'Student of Wealth', text: 'I read, I study markets, I analyze companies. Knowledge is leverage and I compound it daily.' },
                  ].map(({ icon, label, text }) => (
                    <div key={label} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <span className="text-lg shrink-0">{icon}</span>
                      <div>
                        <div className="text-xs font-black text-amber-400 uppercase tracking-wider mb-0.5">{label}</div>
                        <div className="text-sm text-gray-300 leading-relaxed">{text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Accordion title="The Full DCA Card — Write This by Hand Today" subtitle="Napoleon Hill's most powerful exercise — personalized for Elijah" accent="border-amber-500/20" defaultOpen>
                <div className="bg-amber-500/[0.04] border border-amber-500/20 rounded-xl p-5">
                  <div className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3">Copy this word for word. Hand-write it. Sign it.</div>
                  <div className="text-sm text-gray-200 leading-loose space-y-3">
                    <p>"I, <strong className="text-white">Elijah Nartey</strong>, am fully committed to building a net worth of no less than <strong className="text-amber-400">One Million United States Dollars ($1,000,000)</strong> by the <strong className="text-amber-400">31st of December, 2030</strong>.</p>
                    <p>In exchange for this wealth, I offer the world: <strong className="text-indigo-400">RushPay</strong> — frictionless digital payments for the unbanked millions across West Africa; <strong className="text-indigo-400">ShopKeeper</strong> — the operating system for Ghana's SME market; and a <strong className="text-indigo-400">Proprietary AI Trading System</strong> that generates passive income through intelligent algorithmic strategies.</p>
                    <p>My plan: graduate with distinction, ship products to market within 90 days, acquire first paying users within 60 days, build recurring revenue of $10,000/month within 24 months, and invest no less than 20% of all income into appreciating assets from this day forward.</p>
                    <p>I acknowledge that I will face rejection, failure, loneliness, and doubt. I accept all of it as the price of admission to a life of extraordinary wealth and freedom. I will persist without exception until this goal is achieved.</p>
                    <p>This is not a wish. This is a binding commitment — signed, dated, and executed upon daily."</p>
                    <div className="pt-3 border-t border-white/10">
                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div>Signed: _____________________</div>
                        <div>Date: _______________________</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Callout type="warning" title="How to Use Your DCA — The Hill Method">
                  <div>▸ Read it every morning — out loud, standing up, with conviction</div>
                  <div>▸ Read it every night before sleep — slowly, emotionally, picturing it done</div>
                  <div>▸ Read it 3x on hard days — when you want to quit, it pulls you back</div>
                  <div>▸ Carry a photo of it. Put it on your wall. Make it impossible to ignore.</div>
                </Callout>
              </Accordion>

              <Accordion title="Auto-Suggestion Sleep Script — Read Nightly" subtitle="Your subconscious is most receptive right before sleep" accent="border-purple-500/20">
                <div className="bg-indigo-500/[0.04] border border-indigo-500/15 rounded-xl p-5 space-y-3 text-sm text-gray-300 leading-loose">
                  <p className="font-medium text-white">[Read this slowly. Eyes closed. Lying in bed. Picture each sentence vividly.]</p>
                  <p>"I am Elijah Nartey. I am building an empire that will impact millions of people across Africa."</p>
                  <p>"Every day my skills grow sharper. My code gets cleaner. My products get stronger."</p>
                  <p>"RushPay is processing millions of cedis. Ghanaian businesses are scaling with ShopKeeper. My AI Bot is earning money as I sleep."</p>
                  <p>"I am surrounded by brilliant, ambitious people who believe in my vision and help me execute it."</p>
                  <p>"Money flows to me easily because I provide enormous value. I invest wisely. I grow consistently."</p>
                  <p>"Tomorrow I will wake at 6am with fire. I will build. I will ship. I will win."</p>
                  <p className="font-medium text-amber-400">"The million dollars is already mine. I am simply executing the plan to receive it."</p>
                </div>
                <div className="text-xs text-gray-600 pt-1">Science: the hypnagogic state (just before sleep) is when your brain is most receptive to suggestion. This is what top performers and athletes use. It works.</div>
              </Accordion>

              <Accordion title="The 3 Daily Declarations — Say These Out Loud" accent="border-amber-500/20">
                <div className="space-y-3">
                  {[
                    { n: '01', time: 'Morning (6:05am)', decl: "I am Elijah Nartey — a world-class engineer and entrepreneur. I am building systems that will make me a millionaire by 27. Today I will out-work, out-think, and out-execute everyone around me.", bg: 'bg-amber-500/5 border-amber-500/15', tc: 'text-amber-400' },
                    { n: '02', time: 'Midday (During a break)', decl: "My products solve real problems for real people. RushPay, ShopKeeper, and my AI Bot are not ideas — they are inevitabilities. I am the right person, in the right place, at the right time.", bg: 'bg-indigo-500/5 border-indigo-500/15', tc: 'text-indigo-400' },
                    { n: '03', time: 'Night (Before sleep)', decl: "I invest in assets. I build equity. I protect my time. Every decision I make moves me closer to financial freedom. The wealth I seek is already in motion. I only need to persist.", bg: 'bg-green-500/5 border-green-500/15', tc: 'text-green-400' },
                  ].map(({ n, time, decl, bg, tc }) => (
                    <div key={n} className={`rounded-xl border p-4 ${bg}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`text-[10px] font-black uppercase tracking-wider ${tc}`}>Declaration #{n}</div>
                        <div className="text-[10px] text-gray-600">{time}</div>
                      </div>
                      <div className="text-sm text-gray-200 leading-relaxed italic">"{decl}"</div>
                    </div>
                  ))}
                </div>
              </Accordion>
            </div>
          )}

          {/* Mindset Audit */}
          {sub === 'mindset' && (
            <div className="space-y-4">
              <SectionLabel n="02" title="Mindset Audit — Rich vs Broke" color="bg-red-500/10 text-red-300 border-red-500/20" />
              <Callout type="danger" title="⚠️ Instruction — Be Brutally Honest">
                <div>Read every row. For each one, ask yourself: "Which side am I actually on right now — not which side I want to be on?"</div>
                <div>Circle the ones you're failing. Those are your priority targets this week.</div>
              </Callout>
              <div className="space-y-3">
                <MindsetRow poor="'I'll launch when the product is ready and polished.'" rich="'I launch now with an MVP. Real users teach me more in one week than 3 months of planning.'" />
                <MindsetRow poor="'I don't have enough money to invest or save.'" rich="'I invest GH₵ 20 today. The habit matters more than the amount. Compounding starts NOW.'" />
                <MindsetRow poor="'I'm too young / I'm a student / the timing isn't right.'" rich="'Being a student is an advantage — low expenses, free time, university resources. I use it all.'" />
                <MindsetRow poor="'I need a break. I worked hard this week.'" rich="'Rest is scheduled. Unscheduled breaks are procrastination wearing a costume.'" />
                <MindsetRow poor="'I'll reach out to that investor/founder when I have more traction.'" rich="'I reach out now. Relationships take time to build. I plant seeds 12 months early.'" />
                <MindsetRow poor="'My competitors are bigger. I can't beat them.'" rich="'I don't beat them. I serve the niche they're ignoring. Ghana SMEs. The unbanked. That's mine.'" />
                <MindsetRow poor="'I'll read that book when I have more time.'" rich="'20 pages a day = 12-18 books a year. That knowledge compounds into my decisions daily.'" />
                <MindsetRow poor="'I work hard and that should be enough.'" rich="'Hard work without leverage is a hamster wheel. I build systems, assets, and teams.'" />
                <MindsetRow poor="'I need motivation to start working.'" rich="'I don't wait for motivation. I execute the schedule. Discipline beats motivation 100% of the time.'" />
                <MindsetRow poor="'Failed again. Maybe this isn't for me.'" rich="'Failed again. Good. I just paid tuition. What did I learn? Adjust and go again.'" />
                <MindsetRow poor="'The economy is bad. Ghana doesn't support entrepreneurs.'" rich="'Every broken system is a business. Ghana's financial infrastructure is broken. RushPay fixes it.'" />
                <MindsetRow poor="'I'll spend this GH₵ 200 on clothes / going out — I deserve it.'" rich="'I deploy this GH₵ 200: GH₵ 100 to product (domain/server/tool), GH₵ 100 to savings. Reward comes later.'" />
              </div>
              <div className="glass rounded-2xl p-5 border border-amber-500/20 bg-amber-500/[0.03]">
                <div className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3">Your Choleric Temperament — The Edge & The Risk</div>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  Choleric types are <strong className="text-white">natural leaders, decisive, action-oriented, and goal-driven</strong> — exactly the profile of every great entrepreneur. But unchecked, the same traits destroy businesses.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-3">
                    <div className="text-xs font-black text-green-400 mb-2">YOUR ADVANTAGES</div>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div>✅ You make decisions fast</div>
                      <div>✅ You push through obstacles</div>
                      <div>✅ You inspire others to follow</div>
                      <div>✅ You see the finish line clearly</div>
                      <div>✅ You execute when others freeze</div>
                    </div>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-3">
                    <div className="text-xs font-black text-red-400 mb-2">BLIND SPOTS TO MANAGE</div>
                    <div className="space-y-1 text-xs text-gray-400">
                      <div>⚠️ Building without validating</div>
                      <div>⚠️ Burning people out around you</div>
                      <div>⚠️ Impatience with compounding</div>
                      <div>⚠️ Dismissing feedback too fast</div>
                      <div>⚠️ Starting 5 things, finishing 0</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Kill Your Fears */}
          {sub === 'fears' && (
            <div className="space-y-4">
              <SectionLabel n="03" title="Kill Your Fears — Napoleon Hill's 6 Ghosts" color="bg-purple-500/10 text-purple-300 border-purple-500/20" />
              <div className="glass rounded-xl p-4 border border-purple-500/20">
                <p className="text-xs text-gray-400 leading-relaxed">Napoleon Hill identified 6 basic fears that destroy more wealth than any recession. Every one of them lives in your head rent-free. Identify them. Name them. Eliminate them.</p>
              </div>
              <div className="space-y-3">
                {[
                  {
                    fear: 'Fear of Poverty',
                    symptom: 'You hesitate to invest even GH₵ 20. You keep money idle because "what if I need it." You take a part-time job instead of building.',
                    cost: 'You stay broke trying to avoid being broke. The safest path is building assets — a salary disappears in one termination letter.',
                    kill: 'Open an investment account this week. Put GH₵ 50 in it. Watch it sit there. Repeat monthly. The habit of investing destroys the fear of poverty.',
                    color: 'border-red-500/20 bg-red-500/[0.03]', tc: 'text-red-400'
                  },
                  {
                    fear: 'Fear of Failure',
                    symptom: 'You don\'t launch RushPay because it\'s "not ready." You over-research. You redesign the logo 5 times. You add features instead of shipping.',
                    cost: 'Your competitor — who is worse than you — ships first and captures the market while you\'re still planning.',
                    kill: 'Set a launch date. Public commit. Tell 10 people. Deadlines kill perfectionism faster than any mindset shift.',
                    color: 'border-orange-500/20 bg-orange-500/[0.03]', tc: 'text-orange-400'
                  },
                  {
                    fear: 'Fear of Criticism / Judgment',
                    symptom: 'You don\'t post your builds publicly. You don\'t tell people what you\'re working on. You minimize your ambitions to sound "realistic."',
                    cost: 'You never build an audience, network, or brand. The people who go far are the ones who were willing to be seen failing.',
                    kill: 'Post your product publicly this week — even a screenshot. Tweet your progress daily for 30 days. Build in public ruthlessly.',
                    color: 'border-yellow-500/20 bg-yellow-500/[0.03]', tc: 'text-yellow-400'
                  },
                  {
                    fear: 'Fear of Loss of Love / Approval',
                    symptom: 'You skip Deep Work sessions to hang with friends. You abandon the schedule when your roommates are having fun. You explain your goals to people who don\'t believe in them.',
                    cost: 'Your social life now costs you your financial future. Friends who don\'t support your mission will naturally fall away — and that\'s correct.',
                    kill: 'Find 1-2 people who are building too. Make them your environment. Protect your schedule like it\'s worth GH₵ 1,000/hour — because it is.',
                    color: 'border-pink-500/20 bg-pink-500/[0.03]', tc: 'text-pink-400'
                  },
                  {
                    fear: 'Fear of Ill Health / Burnout',
                    symptom: 'You use tiredness as an excuse to skip exercise, coding sessions, or reading. "I\'ll do it when I feel better" is your go-to.',
                    cost: 'Energy is your most valuable resource. Managing it poorly means no Deep Work, no creativity, no breakthroughs.',
                    kill: 'Exercise 5x/week. Protect sleep floor of 4.5 hours. Eat real food. Your body is a machine that needs maintenance.',
                    color: 'border-green-500/20 bg-green-500/[0.03]', tc: 'text-green-400'
                  },
                  {
                    fear: 'Fear of Old Age / Running Out of Time',
                    symptom: 'Paradoxically: you feel like you\'re too young to be taken seriously. Or that there\'s "plenty of time" and you don\'t need to rush.',
                    cost: 'Every month you delay costs you compounding — both financial and skill-based. Elon Musk, Gates, Zuckerberg all started companies before 25.',
                    kill: 'Calculate: if you start investing $100/month at 22 vs 32, you end up with 2x the wealth at 60. Every month costs you thousands. Act NOW.',
                    color: 'border-indigo-500/20 bg-indigo-500/[0.03]', tc: 'text-indigo-400'
                  },
                ].map(({ fear, symptom, cost, kill, color, tc }) => (
                  <div key={fear} className={`rounded-2xl border p-5 ${color}`}>
                    <div className={`text-sm font-black mb-3 ${tc}`}>😨 {fear}</div>
                    <div className="space-y-2 text-xs">
                      <div><span className="text-gray-500 font-bold uppercase tracking-wider">How it shows up: </span><span className="text-gray-400">{symptom}</span></div>
                      <div><span className="text-red-400 font-bold uppercase tracking-wider">What it costs you: </span><span className="text-gray-400">{cost}</span></div>
                      <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-3 py-2.5">
                        <span className="text-green-400 font-bold">⚡ How to kill it: </span><span className="text-gray-300">{kill}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════
          TAB 2 — SYSTEMS
      ════════════════════════════════════════════ */}
      {tab === 'systems' && (
        <div className="space-y-4">

          {/* Daily Schedule */}
          {sub === 'schedule' && (
            <div className="space-y-4">
              <SectionLabel n="01" title="24-Hour Military Schedule" color="bg-indigo-500/10 text-indigo-300 border-indigo-500/20" />
              <div className="flex gap-2 flex-wrap">
                {[['bg-indigo-500/20 text-indigo-300', '🔵 Power'], ['bg-amber-500/20 text-amber-300', '🟡 Build'], ['bg-green-500/20 text-green-300', '🟢 Rest'], ['bg-red-500/20 text-red-300', '🔴 Grind'], ['bg-purple-500/20 text-purple-300', '🟣 Mission-Critical']].map(([cls, label]) => (
                  <span key={label} className={`px-2.5 py-1 rounded-full text-[10px] font-black ${cls}`}>{label}</span>
                ))}
              </div>
              <div className="glass rounded-2xl p-4 space-y-2">
                <div className="text-xs font-black text-white uppercase tracking-widest mb-3">☀️ 6:00am — Morning Power Ritual</div>
                <ScheduleRow time="6:00am" task="Wake. No snooze — ever. Alarm goes off, feet hit floor. Cold face wash immediately." type="power" />
                <ScheduleRow time="6:03am" task="Stand up straight. Read your DCA out loud. Feel it. Then the 3 daily declarations." type="critical" />
                <ScheduleRow time="6:10am" task="Empire Journal (10 min): Yesterday's top win. Today's #1 goal. 3 tasks. 1 fear to face." type="power" />
                <ScheduleRow time="6:20am" task="Exercise — 30 min: 50 push-ups + 50 squats + 20-min run OR gym. Non-negotiable." type="power" />
                <ScheduleRow time="6:50am" task="Cold shower — 60 seconds cold at end. Builds mental toughness daily." type="power" />
                <ScheduleRow time="7:05am" task="Eat: protein + complex carbs. No junk. Your brain runs on this for 6 hours." type="rest" />
                <ScheduleRow time="7:25am" task="Deep Work Block #1 — Product code (RushPay or ShopKeeper). No distractions." type="build" />
              </div>
              <div className="glass rounded-2xl p-4 space-y-2">
                <div className="text-xs font-black text-white uppercase tracking-widest mb-3">🎓 8:30am — Class Block</div>
                <ScheduleRow time="8:30am" task="Class: be fully present. Take real notes. CSE skills = your technical moat for life." type="grind" />
                <ScheduleRow time="Between" task="Between lectures: Anki flashcards, read fintech articles, or review product code." type="grind" />
                <ScheduleRow time="Lunch" task="Eat in 10 min. Use remaining time: product thinking, reading, or 1 cold outreach message." type="grind" />
              </div>
              <div className="glass rounded-2xl p-4 space-y-2">
                <div className="text-xs font-black text-white uppercase tracking-widest mb-3">💻 4:00pm — Empire Block</div>
                <ScheduleRow time="4:00pm" task="Deep Work Block #2 — 2 hrs minimum. Phone off. Headphones on. One feature only." type="build" />
                <ScheduleRow time="6:00pm" task="Financial hour: study investing, update expense tracker, research Ghana/Africa markets." type="build" />
                <ScheduleRow time="7:00pm" task="Dinner + 20-min walk. No phone. Let your brain consolidate and generate ideas." type="rest" />
                <ScheduleRow time="7:30pm" task="Deep Work Block #3 — Backend, API integrations, AI Bot algorithm, or exam study." type="build" />
                <ScheduleRow time="9:30pm" task="Read 20 pages — rotate: Intelligent Investor, Cashflow Quadrant, tech books." type="rest" />
                <ScheduleRow time="10:15pm" task="Discipline Challenge of the day (see Discipline Protocol section)." type="critical" />
                <ScheduleRow time="10:45pm" task="Deep Work Block #4 — Final sprint, bug fixes, or exam prep. Push until done." type="build" />
              </div>
              <div className="glass rounded-2xl p-4 space-y-2">
                <div className="text-xs font-black text-white uppercase tracking-widest mb-3">🌙 12:30am — Wind-Down Protocol</div>
                <ScheduleRow time="12:30am" task="All screens off. No more code. Brain needs to decompress before sleep." type="rest" />
                <ScheduleRow time="12:35am" task="Empire Journal: Daily score (1–60). Top win. Top failure. Lesson learned." type="critical" />
                <ScheduleRow time="12:50am" task="Write tomorrow's 3 non-negotiable tasks + 1 financial action. Clarity = speed." type="rest" />
                <ScheduleRow time="1:05am" task="Auto-suggestion script: read DCA + sleep script 3x slowly, eyes closed, lying down." type="critical" />
                <ScheduleRow time="1:20am" task="Sleep. 4.5–5 hrs of quality sleep. Your subconscious solves problems overnight." type="rest" />
              </div>
              <Callout type="danger" title="🚫 Inviolable Rules — Breaking Any = Failed Day">
                <div>▸ Phone stays in another room during ALL Deep Work blocks. No exceptions.</div>
                <div>▸ No social media scrolling before 4pm on weekdays.</div>
                <div>▸ No sleeping past 7am — not even on weekends (max 8am Sundays only).</div>
                <div>▸ Zero alcohol until your first product hits $1K MRR. Your brain is a tool — stop dulling it.</div>
                <div>▸ Never skip exercise 2 days in a row. Ever. Your discipline score depends on it.</div>
              </Callout>
            </div>
          )}

          {/* 90-Day Phases */}
          {sub === 'phases' && (
            <div className="space-y-4">
              <SectionLabel n="02" title="90-Day Phase Breakdown" color="bg-indigo-500/10 text-indigo-300 border-indigo-500/20" />
              <div className="grid grid-cols-3 gap-3">
                {[
                  { n: 'Phase 1', t: 'Foundation', r: 'Days 1–30', c: 'text-green-400', border: 'border-green-500/25 bg-green-500/[0.04]' },
                  { n: 'Phase 2', t: 'Build & Ship', r: 'Days 31–60', c: 'text-indigo-400', border: 'border-indigo-500/25 bg-indigo-500/[0.04]' },
                  { n: 'Phase 3', t: 'Scale & Cash', r: 'Days 61–90', c: 'text-amber-400', border: 'border-amber-500/25 bg-amber-500/[0.04]' },
                ].map(({ n, t, r, c, border }) => (
                  <div key={n} className={`glass rounded-xl p-4 border ${border} text-center`}>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${c} mb-1`}>{n}</div>
                    <div className="text-sm font-black text-white">{t}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{r}</div>
                  </div>
                ))}
              </div>

              <Accordion title="Phase 1: Foundation (Days 1–30)" subtitle="Install the OS. No empire is built on a broken foundation." accent="border-green-500/25" defaultOpen>
                <Callout type="success" title="Phase 1 Mission">
                  <div>Lock in habits. Know your numbers. Set up your infrastructure. Get your identity right.</div>
                </Callout>
                <div className="text-xs font-black text-green-400 uppercase tracking-wider mt-1 mb-1">MINDSET TASKS</div>
                <Item icon="📝" text="Write your DCA by hand. Sign it. Photograph it. Set it as your phone wallpaper." color="text-amber-300" />
                <Item icon="🪞" text="Do the full Mindset Audit — identify which 3 mindset rows you're currently losing on." />
                <Item icon="📖" text="Re-read Atomic Habits chapters 1–5. Build your Morning and Evening Stacks on paper." />
                <div className="text-xs font-black text-green-400 uppercase tracking-wider mt-3 mb-1">FINANCIAL TASKS</div>
                <Item icon="📋" text="Complete Rich Dad Financial Audit: list every asset and every liability you currently own." />
                <Item icon="🏦" text="Open a dedicated savings account if you don't have one. Deposit GH₵ 50 this week." color="text-green-300" />
                <Item icon="💸" text="Track every single cedi in and out for 30 days. Use a spreadsheet or notes app." />
                <Item icon="📊" text="Calculate your personal cashflow: income minus expenses = net. Know this number cold." />
                <div className="text-xs font-black text-green-400 uppercase tracking-wider mt-3 mb-1">PRODUCT TASKS</div>
                <Item icon="💻" text="Create GitHub repos for RushPay, ShopKeeper, and AI Bot. Define clear folder structure." color="text-indigo-300" />
                <Item icon="🗺️" text="Write a 1-page PRD (Product Requirements Doc) for each product. What does it do? Who is it for? How does it earn?" />
                <Item icon="📱" text="Build and deploy a simple landing page for your #1 priority product. Collect emails." />
                <Item icon="🤝" text="Identify 5 potential beta users. Contact all 5 this week. Get 1 conversation scheduled." />
                <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-3 mt-2">
                  <div className="text-xs font-bold text-green-400 mb-1">✅ Phase 1 Win Condition (Day 30 Check)</div>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <div>□ Morning/evening habit stack running for 20+ consecutive days</div>
                    <div>□ Financial audit complete — assets, liabilities, cashflow known</div>
                    <div>□ DCA written, signed, and displayed</div>
                    <div>□ All 3 product repos live with README</div>
                    <div>□ At least 1 user conversation completed</div>
                    <div>□ GH₵ 50+ invested or saved</div>
                  </div>
                </div>
              </Accordion>

              <Accordion title="Phase 2: Build & Ship (Days 31–60)" subtitle="Stop planning. Start shipping. Users teach you what planning never will." accent="border-indigo-500/25">
                <Callout type="info" title="Phase 2 Mission">
                  <div>Your #1 priority product goes live. Real users. Real feedback. First revenue attempt.</div>
                </Callout>
                <div className="text-xs font-black text-indigo-400 uppercase tracking-wider mt-1 mb-1">PRODUCT MILESTONES</div>
                <Item icon="🚀" text="RushPay MVP: P2P payment flow OR merchant payment gateway. Basic UI. It works." color="text-indigo-300" />
                <Item icon="🏪" text="ShopKeeper MVP: Inventory management + sales tracking. Deployable. Used by at least 1 real shop." color="text-indigo-300" />
                <Item icon="🤖" text="AI Bot v0.1: Define your trading strategy. Implement backtesting on 1 year of historical data." />
                <Item icon="📊" text="Set up product analytics (Posthog or Mixpanel free tier). Track what users actually do." />
                <div className="text-xs font-black text-indigo-400 uppercase tracking-wider mt-3 mb-1">GROWTH TASKS</div>
                <Item icon="👥" text="Recruit 10 beta users. Real people. Not family. Run structured feedback sessions." color="text-green-300" />
                <Item icon="💵" text="Attempt first charge. Even GH₵ 10. If someone pays — product-market fit signal exists." color="text-amber-300" />
                <Item icon="📣" text="Tweet or post your build progress publicly 3x this month. Start building audience." />
                <Item icon="🌍" text="Research 1 potential investor or accelerator in Ghana/Africa. Send 1 cold email." />
                <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-3 mt-2">
                  <div className="text-xs font-bold text-indigo-400 mb-1">✅ Phase 2 Win Condition (Day 60 Check)</div>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <div>□ At least 1 product publicly live (URL exists)</div>
                    <div>□ 10+ beta users with documented feedback</div>
                    <div>□ First paying transaction completed (any amount)</div>
                    <div>□ 90+ days of habit streak running</div>
                    <div>□ GH₵ 200+ in savings/investments</div>
                    <div>□ 1 investor or founder email sent</div>
                  </div>
                </div>
              </Accordion>

              <Accordion title="Phase 3: Scale & Cash (Days 61–90)" subtitle="Double what works. Cut what doesn't. Build recurring revenue." accent="border-amber-500/25">
                <Callout type="warning" title="Phase 3 Mission">
                  <div>GH₵ 1,000/month MRR. Clear 12-month plan. First investment returns visible.</div>
                </Callout>
                <div className="text-xs font-black text-amber-400 uppercase tracking-wider mt-1 mb-1">REVENUE TASKS</div>
                <Item icon="💡" text="Analyze: which product has most traction? Double all resources there. Pause the others temporarily." color="text-amber-300" />
                <Item icon="🔁" text="Build a referral mechanism: every user can refer 1 business. Word of mouth in Ghana = gold." />
                <Item icon="💰" text="Raise prices if users are paying. Cheap pricing signals low value. Know your worth." color="text-green-300" />
                <Item icon="📑" text="Apply to: Tony Elumelu Foundation, Google for Startups Africa, Norrsken Foundation Africa." color="text-indigo-300" />
                <div className="text-xs font-black text-amber-400 uppercase tracking-wider mt-3 mb-1">SCALE TASKS</div>
                <Item icon="📣" text="Launch content marketing: document your journey weekly on LinkedIn, Twitter/X, or YouTube." />
                <Item icon="🤝" text="Secure 1 strategic partnership: a bank, a university, or a popular local business." />
                <Item icon="🌍" text="Research your first expansion market: Nigeria (largest), Kenya (tech-forward), or Diaspora UK/US." />
                <Item icon="🗺️" text="Write your 6-month roadmap post-90 days. The blueprint was ignition. Now you navigate." />
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 mt-2">
                  <div className="text-xs font-bold text-amber-400 mb-1">✅ Phase 3 Win Condition (Day 90 Check)</div>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <div>□ GH₵ 1,000+/month MRR achieved</div>
                    <div>□ 50+ active product users</div>
                    <div>□ 1 grant application submitted or partnership secured</div>
                    <div>□ 6-month post-blueprint roadmap written</div>
                    <div>□ Net worth higher than Day 1</div>
                    <div>□ 90-day habit completion rate: 80%+</div>
                  </div>
                </div>
              </Accordion>
            </div>
          )}

          {/* Discipline Protocol */}
          {sub === 'discipline' && (
            <div className="space-y-4">
              <SectionLabel n="03" title="Discipline Protocol — Iron Will System" color="bg-blue-500/10 text-blue-300 border-blue-500/20" />

              <div className="glass rounded-2xl p-5 border border-blue-500/20">
                <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">The Core Law</div>
                <p className="text-sm text-gray-300 leading-relaxed">"Motivation is what gets you started. Discipline is what keeps you going. Inspiration is what makes you great. But only one of these three can be controlled — and it's <strong className="text-white">discipline</strong>. The other two are weather. Build systems that run regardless of how you feel."</p>
              </div>

              <Accordion title="The 6 Life Areas — 90-Day Targets" subtitle="Neglect any one of these and the others collapse" accent="border-blue-500/25" defaultOpen>
                {[
                  { area: '💻 Product / Engineering', color: 'text-indigo-400', goal: 'Ship 1 live product with paying users by Day 60. Commit meaningful code every single day — no exceptions.', daily: '2+ hrs deep work on product. 1 GitHub commit minimum.', kpi: 'Live product URL + first paid user' },
                  { area: '💰 Financial Intelligence', color: 'text-amber-400', goal: 'Build the HABIT of tracking, saving, and investing. Target: 20%+ savings rate. GH₵ 500 invested by Day 90.', daily: 'Log every expense. Review cashflow weekly. Study 1 financial concept.', kpi: 'GH₵ 500 saved/invested, cashflow positive' },
                  { area: '🎓 Academic Excellence', color: 'text-green-400', goal: 'Pass all modules with distinction where possible. Your CSE degree is your technical passport — protect it.', daily: 'Attend all classes. Review notes same evening. Exam prep scheduled 3 weeks early.', kpi: 'No fails. Minimum B in all modules.' },
                  { area: '🏋️ Physical Dominance', color: 'text-red-400', goal: 'Exercise 5x/week without fail. Eat protein + complex carbs. Sleep 4.5 hrs minimum. Energy is the foundation of everything.', daily: '30 min exercise, no junk food days, track sleep quality.', kpi: 'Exercise streak 80%+, weight/body stable' },
                  { area: '🧠 Mental Sharpness', color: 'text-purple-400', goal: 'Read 2 books/month minimum. Journal daily. Zero mindless consumption before 4pm. Feed the machine premium content.', daily: '20 pages reading. Empire Journal entry. 1 new concept studied.', kpi: '60 pages/month, journal 90% completion rate' },
                  { area: '🤝 Strategic Network', color: 'text-cyan-400', goal: 'Build relationships with 5 high-quality people in Ghana/Africa tech. Find 1 mentor actively. Give value before asking for anything.', daily: '1 message to someone in your network. Post 1 insight online.', kpi: '1 mentor secured, 5 founders connected' },
                ].map(({ area, color, goal, daily, kpi }) => (
                  <div key={area} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                    <div className={`text-sm font-black mb-2 ${color}`}>{area}</div>
                    <div className="text-xs text-gray-400 mb-2">{goal}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/[0.03] rounded-lg p-2.5">
                        <div className="text-gray-600 font-bold mb-0.5">Daily Action</div>
                        <div className="text-gray-400">{daily}</div>
                      </div>
                      <div className="bg-white/[0.03] rounded-lg p-2.5">
                        <div className="text-gray-600 font-bold mb-0.5">KPI (Day 90)</div>
                        <div className={color + ' font-bold'}>{kpi}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </Accordion>

              <Accordion title="30-Day Discipline Gauntlet" subtitle="One challenge per day — never repeat an excuse" accent="border-blue-500/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { d: 1, c: '🧊', t: 'Cold shower — 90 seconds. No hesitation. Shows you can override comfort.' },
                    { d: 2, c: '📵', t: 'Zero social media all day. Notice what you feel. Fear? Relief? Both?' },
                    { d: 3, c: '🏃', t: 'Run 5km without stopping. Even if it hurts. Especially if it hurts.' },
                    { d: 4, c: '🍽️', t: 'Eat zero junk food today. Not one biscuit, one sip of soda. Clean fuel only.' },
                    { d: 5, c: '⏰', t: 'Wake at 5am. 1 hour of pure product building before the world wakes up.' },
                    { d: 6, c: '📞', t: 'Send a cold message to 1 founder or investor you admire. No template. Be real.' },
                    { d: 7, c: '✍️', t: '1,000 words: exactly why you will be a millionaire. Specific. Ruthless. Deadline-driven.' },
                    { d: 8, c: '🔕', t: '4 hours of work in total silence. No music. No podcasts. Pure focus.' },
                    { d: 9, c: '⏱️', t: 'Track your time for every hour of the day. Audit where it really goes.' },
                    { d: 10, c: '🚫', t: 'Say no to 3 requests that don\'t serve your goal. Practice the word NO.' },
                    { d: 11, c: '💸', t: 'Calculate your exact net worth today. Assets minus liabilities. Face the number.' },
                    { d: 12, c: '📤', t: 'Post your product publicly online. Even a screenshot. Build in public starts now.' },
                    { d: 13, c: '💪', t: 'Do 200 push-ups throughout the day. Any intervals. Just hit 200.' },
                    { d: 14, c: '🤐', t: 'Speak zero complaints today. Not one. Every negative thought gets reframed.' },
                    { d: 15, c: '📚', t: 'Read 50 pages in one sitting. No breaks longer than 5 minutes.' },
                    { d: 16, c: '📧', t: 'Apply to 1 startup grant or accelerator program. Do it today. Not next week.' },
                    { d: 17, c: '🧹', t: 'Organize your workspace, files, repos, and financial records completely.' },
                    { d: 18, c: '🌅', t: 'Skip your last Deep Work session and sleep 1 hour early. Discipline includes rest.' },
                    { d: 19, c: '🎙️', t: 'Explain your product out loud like you\'re pitching to an investor. Film yourself.' },
                    { d: 20, c: '🏦', t: 'Make your first real investment — any amount. GH₵ 20 minimum. Today.' },
                    { d: 21, c: '🔁', t: 'Review your habit scorecard. What\'s your 3-week average? Fix the 3 worst.' },
                    { d: 22, c: '👥', t: 'Get feedback on your product from 3 strangers. Not friends. Real users.' },
                    { d: 23, c: '⚡', t: 'Build and ship 1 complete feature today. Not started. Not planned. SHIPPED.' },
                    { d: 24, c: '🧠', t: 'Summarize your 3 biggest learnings this month in writing. Teach what you know.' },
                    { d: 25, c: '🏋️', t: 'Your hardest physical workout yet. Set a new personal record of any kind.' },
                    { d: 26, c: '💬', t: 'Have 1 honest conversation with someone about your biggest business obstacle.' },
                    { d: 27, c: '📅', t: 'Time-block your entire next 7 days before today ends. Full schedule written.' },
                    { d: 28, c: '🌙', t: 'Write the next 30-day chapter of your blueprint. What does Day 60 look like?' },
                    { d: 29, c: '📊', t: 'Review all metrics: product, financial, habits, network. Rate each 1-10 with evidence.' },
                    { d: 30, c: '🏆', t: 'Write your Phase 1 retrospective. What you built, what you learned, what you became.' },
                  ].map(({ d, c, t }) => (
                    <div key={d} className="flex items-start gap-2.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-[10px] font-black text-gray-600 w-5 shrink-0 mt-0.5">D{d}</span>
                      <span className="text-sm shrink-0">{c}</span>
                      <span className="text-xs text-gray-400 leading-relaxed">{t}</span>
                    </div>
                  ))}
                </div>
              </Accordion>

              <Accordion title="The Sunday CEO Review — 90-Min Session" subtitle="Block this every Sunday evening — your most important meeting" accent="border-blue-500/20">
                <div className="space-y-4">
                  {[
                    { title: 'WINS (10 min)', color: 'text-green-400', qs: ['What shipped or completed this week?', 'What financial move did I execute?', 'What relationship did I strengthen?', 'What was my best moment?'] },
                    { title: 'METRICS REVIEW (15 min)', color: 'text-indigo-400', qs: ['Product: active users, revenue GH₵, commits this week', 'Financial: savings balance, investment value, cashflow', 'Discipline: habit streak %, exercise days, reading pages', 'Network: new connections, messages sent, responses received'] },
                    { title: 'HONEST AUTOPSY (20 min)', color: 'text-red-400', qs: ["What was my #1 time waster this week? How do I eliminate it?", 'Where did I compromise on standards? Why?', 'What did I avoid that I should have faced?', 'What would my millionaire self say about this week?'] },
                    { title: 'NEXT WEEK PLAN (30 min)', color: 'text-amber-400', qs: ['3 must-ship product tasks (specific, not vague)', '1 financial action to execute', '1 network action (outreach, post, or call)', 'Full time-blocked schedule written out'] },
                    { title: 'RECHARGE (15 min)', color: 'text-purple-400', qs: ['Read DCA again. Feel the goal.', 'Identify 1 person to express gratitude to this week.', 'Set your wake-up time for Monday.', 'Sleep by 1:30am tonight.'] },
                  ].map(({ title, color, qs }) => (
                    <div key={title} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                      <div className={`text-xs font-black uppercase tracking-wider ${color} mb-2`}>{title}</div>
                      {qs.map(q => <div key={q} className="text-xs text-gray-400 py-1 border-b border-white/[0.04] last:border-0">▸ {q}</div>)}
                    </div>
                  ))}
                </div>
              </Accordion>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════
          TAB 3 — FRAMEWORKS
      ════════════════════════════════════════════ */}
      {tab === 'books' && (
        <div className="space-y-4">

          {/* Atomic Habits */}
          {sub === 'atomic' && (
            <div className="space-y-4">
              <SectionLabel n="01" title="Atomic Habits — Applied" color="bg-orange-500/10 text-orange-300 border-orange-500/20" />
              <div className="glass rounded-xl p-4 border border-orange-500/20">
                <p className="text-xs text-gray-400 italic">"Every action you take is a vote for the type of person you wish to become." — James Clear</p>
                <p className="text-xs text-gray-500 mt-1">The framework: make good habits obvious, attractive, easy, and satisfying. Make bad habits invisible, unattractive, hard, and unsatisfying.</p>
              </div>

              <Accordion title="5 Habits to Break — The Full Loop Analysis" subtitle="Cue → Craving → Response → Reward — break it at the cue" accent="border-red-500/25" defaultOpen>
                {[
                  { habit: 'Mindless Social Media Scrolling', cue: 'Boredom, phone nearby, between tasks', craving: 'Stimulation, social validation, dopamine', response: 'Open TikTok/YouTube/IG, consume for 45+ minutes', reward: 'Temporary numbing, avoid discomfort', fix: 'Remove apps from home screen. Put phone in a drawer during work. Replace with: open product repo, read 5 pages, or do 20 push-ups. Make friction so high you choose the productive alternative.' },
                  { habit: 'Checking Messages First in the Morning', cue: 'Alarm goes off → phone in hand', craving: 'Connection, avoiding FOMO, ease', response: 'Open WhatsApp/socials before doing anything intentional', reward: 'Feel connected, reduce anxiety temporarily', fix: 'Alarm clock separate from phone. Phone stays face-down until journal is complete. First input every day must be YOUR agenda — your DCA, your goals — not someone else\'s demands.' },
                  { habit: 'Procrastinating on Product Work', cue: 'Open laptop, feel overwhelmed by complexity', craving: 'Clarity and certainty before starting', response: 'Open YouTube "research", check Twitter, reorganize files', reward: 'Feel busy without the vulnerability of actually shipping', fix: '2-minute rule: just open the file and write 1 line. Commit to 2 minutes only. 95% of the time you\'ll keep going. Momentum is everything.' },
                  { habit: 'Late Night Junk Eating', cue: 'Stressed, 11pm, Deep Work session winding down', craving: 'Quick energy, comfort, reward', response: 'Grab biscuits, soft drinks, fried food', reward: 'Dopamine spike, temporary relief', fix: 'Pre-prepare evening snack: nuts, fruit, or protein. When the cue hits, the healthy option is the only available one. Remove the junk from your space entirely.' },
                  { habit: 'Oversleeping / Snooze', cue: 'Alarm at 6am, body still tired', craving: 'More sleep, avoid discomfort of waking', response: 'Snooze 3-4 times. Wake at 7:30 or 8am. Day already compromised.', reward: '15 minutes more rest (that isn\'t actually restful)', fix: 'Place alarm across the room. First movement is commitment. Add an immediate reward: cold water + your DCA. The identity of someone who never snoozes is worth building.' },
                ].map(({ habit, cue, craving, response, reward, fix }) => (
                  <div key={habit} className="bg-red-500/[0.03] border border-red-500/15 rounded-xl p-4">
                    <div className="text-sm font-black text-red-300 mb-3">❌ {habit}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="bg-white/[0.03] rounded-lg p-2"><span className="text-gray-500 font-bold">Cue: </span><span className="text-gray-400">{cue}</span></div>
                      <div className="bg-white/[0.03] rounded-lg p-2"><span className="text-gray-500 font-bold">Craving: </span><span className="text-gray-400">{craving}</span></div>
                      <div className="bg-white/[0.03] rounded-lg p-2"><span className="text-gray-500 font-bold">Response: </span><span className="text-gray-400">{response}</span></div>
                      <div className="bg-white/[0.03] rounded-lg p-2"><span className="text-gray-500 font-bold">Reward: </span><span className="text-gray-400">{reward}</span></div>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/15 rounded-xl px-3 py-2.5 text-xs text-green-300">🔧 <strong>Break it:</strong> {fix}</div>
                  </div>
                ))}
              </Accordion>

              <Accordion title="5 Keystone Habits to Stack" subtitle="These one habits trigger 3-4 others automatically" accent="border-orange-500/25">
                {[
                  { h: '6am Wake-Up', why: 'This is the master keystone. It sets the tone, creates uninterrupted morning time, and is the single best signal you are taking your life seriously.', stack: 'Wake → water → DCA out loud → journal → exercise → shower → build', bonus: 'People who wake early consistently report higher energy, better focus, and more discipline in ALL other areas.' },
                  { h: 'Daily Product Build Session', why: 'Building something every day makes you a builder — not someone who wants to be one. The identity compounds with every commit.', stack: 'Laptop open → close all tabs → open repo → timer 25 min → build → break → repeat', bonus: '90 days × 2 hours = 180 hours of product work. That\'s a serious product.' },
                  { h: 'Evening Empire Journal', why: 'The feedback loop is the most underrated growth mechanism. 1% better per day = 37x improvement in a year. The journal IS the feedback loop.', stack: 'Score day → identify #1 win → identify #1 lesson → write tomorrow\'s 3 tasks → read DCA', bonus: 'Journaling makes you 23% more likely to achieve your goals (Harvard study on written goals).' },
                  { h: 'Daily Exercise', why: 'Releases BDNF — your brain\'s performance enhancer. Millionaire-level focus requires millionaire-level physical conditioning.', stack: '50 push-ups + 50 squats + 20 min run (minimum viable workout when time-poor)', bonus: 'Steve Jobs walked to solve problems. Tim Cook wakes at 4:30am to work out. Your body is your CPU.' },
                  { h: 'No-Screen First 10 Min & Last 30 Min', why: 'Your first and last thoughts of the day set your mental programming. Own them completely.', stack: 'Morning: DCA → journal → then phone. Night: journal → DCA → sleep script → sleep', bonus: 'Blue light suppresses melatonin. Even 30 min off screens before sleep improves sleep quality by 40%.' },
                ].map(({ h, why, stack, bonus }) => (
                  <div key={h} className="bg-orange-500/[0.04] border border-orange-500/15 rounded-xl p-4">
                    <div className="text-sm font-black text-orange-300 mb-2">🔑 {h}</div>
                    <div className="text-xs text-gray-400 mb-2 leading-relaxed">{why}</div>
                    <div className="text-xs text-indigo-300 bg-indigo-500/5 border border-indigo-500/15 rounded-lg px-3 py-2 mb-2">📎 Stack: {stack}</div>
                    <div className="text-xs text-amber-400 bg-amber-500/5 rounded-lg px-3 py-1.5">💡 {bonus}</div>
                  </div>
                ))}
              </Accordion>

              <Accordion title="Daily Habit Scorecard" subtitle="Track every morning. Print this. Tick it." accent="border-orange-500/20">
                <div className="text-xs text-gray-500 mb-3">Every tick = 1 vote for the person you're becoming. Every miss = a vote for who you're escaping.</div>
                <div className="space-y-1.5">
                  {[
                    { h: 'Woke at 6am (or earlier)', pts: 3 },
                    { h: 'No snooze', pts: 2 },
                    { h: 'Read DCA out loud', pts: 2 },
                    { h: 'Empire Journal completed', pts: 3 },
                    { h: 'Exercise 30+ min', pts: 3 },
                    { h: 'Deep Work 2+ hours', pts: 4 },
                    { h: 'GitHub commit pushed', pts: 2 },
                    { h: 'Read 20+ pages', pts: 2 },
                    { h: 'Financial task done', pts: 2 },
                    { h: 'No social media before 4pm', pts: 3 },
                    { h: 'No junk food', pts: 2 },
                    { h: 'Nightly review completed', pts: 3 },
                    { h: 'Sleep by 2am', pts: 2 },
                    { h: 'Auto-suggestion script done', pts: 1 },
                  ].map(({ h, pts }) => (
                    <div key={h} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-white/20 shrink-0" />
                        <span className="text-xs text-gray-300">{h}</span>
                      </div>
                      <span className="text-[10px] font-black text-indigo-400 shrink-0">+{pts}pts</span>
                    </div>
                  ))}
                </div>
                <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-3 mt-2">
                  <div className="text-xs font-bold text-indigo-400">Total: ___ / 34 pts daily</div>
                  <div className="text-xs text-gray-500 mt-0.5">28–34: Elite day. 20–27: Solid. 12–19: Needs work. Below 12: What happened?</div>
                </div>
              </Accordion>
            </div>
          )}

          {/* Rich Dad */}
          {sub === 'richdad' && (
            <div className="space-y-4">
              <SectionLabel n="02" title="Rich Dad / Cashflow Quadrant" color="bg-yellow-500/10 text-yellow-300 border-yellow-500/20" />
              <div className="glass rounded-xl p-4 border border-yellow-500/20">
                <p className="text-xs text-gray-400 italic">"The poor and middle class work for money. The rich have money work for them." — Robert Kiyosaki</p>
              </div>

              <Accordion title="Your Full Financial Audit — Complete Today" subtitle="Most people never do this. That's why most people stay broke." accent="border-yellow-500/25" defaultOpen>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-4">
                    <div className="text-xs font-black text-green-400 mb-3">📈 ASSETS — What Earns You Money</div>
                    <div className="space-y-1.5 text-xs text-gray-400">
                      <div className="flex justify-between"><span>RushPay equity (future)</span><span className="text-gray-600">GH₵ ___</span></div>
                      <div className="flex justify-between"><span>ShopKeeper equity (future)</span><span className="text-gray-600">GH₵ ___</span></div>
                      <div className="flex justify-between"><span>AI Bot (future income)</span><span className="text-gray-600">GH₵ ___</span></div>
                      <div className="flex justify-between"><span>Savings account</span><span className="text-gray-600">GH₵ ___</span></div>
                      <div className="flex justify-between"><span>Any investments</span><span className="text-gray-600">GH₵ ___</span></div>
                      <div className="flex justify-between border-t border-white/10 pt-1 mt-1"><span className="font-bold text-green-400">TOTAL ASSETS</span><span className="font-bold text-green-400">GH₵ ___</span></div>
                    </div>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                    <div className="text-xs font-black text-red-400 mb-3">📉 LIABILITIES — What Costs You Money</div>
                    <div className="space-y-1.5 text-xs text-gray-400">
                      <div className="flex justify-between"><span>Monthly subscriptions</span><span className="text-gray-600">GH₵ ___</span></div>
                      <div className="flex justify-between"><span>Phone data / airtime</span><span className="text-gray-600">GH₵ ___</span></div>
                      <div className="flex justify-between"><span>Food / transport</span><span className="text-gray-600">GH₵ ___</span></div>
                      <div className="flex justify-between"><span>Entertainment / outings</span><span className="text-gray-600">GH₵ ___</span></div>
                      <div className="flex justify-between"><span>Any debts / loans</span><span className="text-gray-600">GH₵ ___</span></div>
                      <div className="flex justify-between border-t border-white/10 pt-1 mt-1"><span className="font-bold text-red-400">TOTAL LIABILITIES</span><span className="font-bold text-red-400">GH₵ ___</span></div>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
                  <div className="text-xs font-black text-amber-400 mb-3">💡 MONTHLY CASHFLOW STATEMENT</div>
                  <div className="space-y-1.5 text-xs text-gray-400">
                    <div className="flex justify-between"><span>Monthly income (allowance + any revenue)</span><span className="text-gray-600">GH₵ ___</span></div>
                    <div className="flex justify-between"><span>Monthly expenses (total)</span><span className="text-gray-600">GH₵ ___</span></div>
                    <div className="flex justify-between"><span>Amount saved this month</span><span className="text-gray-600">GH₵ ___</span></div>
                    <div className="flex justify-between"><span>Amount invested this month</span><span className="text-gray-600">GH₵ ___</span></div>
                    <div className="flex justify-between border-t border-white/10 pt-1 mt-1">
                      <span className="font-bold text-amber-400">Net Cashflow</span>
                      <span className="font-bold text-amber-400">GH₵ ___ (+/-)</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">Target: savings rate of 20%+. If cashflow is negative — you're funding lifestyle instead of assets. Fix immediately.</div>
                </div>
              </Accordion>

              <Accordion title="The 4 Quadrants — Your 5-Year Migration Path" subtitle="E → S → B → I: This is the map to financial freedom" accent="border-yellow-500/20">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { q: 'E', full: 'Employee', desc: 'You work for someone. You trade time for a fixed income. Job security is an illusion — one letter ends it all. Most people live here forever.', pct: '95%', color: 'border-red-500/20 bg-red-500/5', tc: 'text-red-400' },
                    { q: 'S', full: 'Self-Employed', desc: 'You work for yourself. Freelance, consultant, one-man hustle. Still trading time for money — just at a higher rate. If you stop working, income stops.', pct: '4%', color: 'border-orange-500/20 bg-orange-500/5', tc: 'text-orange-400' },
                    { q: 'B', full: 'Business Owner', desc: 'You own a SYSTEM that works without you. RushPay earns while you sleep. ShopKeeper earns while you\'re in class. This is where wealth begins.', pct: '0.9%', color: 'border-green-500/20 bg-green-500/5', tc: 'text-green-400' },
                    { q: 'I', full: 'Investor', desc: 'Money works for you 24/7. Stocks, equity, real estate, your AI Bot. This is the quadrant where millionaires live. Get here by 27.', pct: '0.1%', color: 'border-amber-500/20 bg-amber-500/5', tc: 'text-amber-400' },
                  ].map(({ q, full, desc, pct, color, tc }) => (
                    <div key={q} className={`rounded-xl border p-4 ${color}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className={`text-2xl font-black ${tc}`}>{q}</div>
                        <div className="text-[10px] text-gray-600">{pct} of people</div>
                      </div>
                      <div className="text-xs font-black text-white mb-1">{full}</div>
                      <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
                    </div>
                  ))}
                </div>
                <Callout type="info" title="Your Migration Timeline">
                  <div>📌 Now (age 22): Mostly S (student + freelancer mindset)</div>
                  <div>📌 Age 23 (90 days): Entry into B — first paying users on RushPay or ShopKeeper</div>
                  <div>📌 Age 24: Firmly in B — $1K/month MRR, small team or contractors</div>
                  <div>📌 Age 25: B + I — investing product profits into stocks, ETFs, and AI Bot returns</div>
                  <div>📌 Age 27: Majority income from B and I. Net worth: $1M+ target zone.</div>
                </Callout>
              </Accordion>

              <Accordion title="Ghana-Specific Wealth Moves — Elijah's Playbook" subtitle="Your market. Your edge. Use it." accent="border-yellow-500/20">
                <Item icon="🏦" text="Open a USD savings account (Absa Ghana, Stanbic, or GCB Forex). Deposit GH₵ equivalent of $20/month. Protects against cedi depreciation — which averages 15-20%/year." color="text-amber-300" />
                <Item icon="📈" text="Ghana Stock Exchange (GSE): MTN Ghana, CalBank, Ecobank Ghana, Total Petroleum Ghana. Research 1 company per month. Start with GH₵ 100." />
                <Item icon="💵" text="Bamboo, Chaka, or Risevest: invest in US ETFs from Ghana/Nigeria. Even $10/month into S&P 500 index fund starts the habit and the compounding." color="text-green-300" />
                <Item icon="⚡" text="MoMo API (MTN Mobile Money) integration in RushPay is your unfair advantage. 17 million+ MoMo users in Ghana. Most fintech startups still ignore the GHS↔USD bridge." color="text-indigo-300" />
                <Item icon="🌍" text="Price RushPay in USD for the diaspora market. Ghanaians in UK, US, and Canada sending money home = massive untapped corridor. Average transfer: $200-$500." />
                <Item icon="🏠" text="Long-term play: Land in Accra (East Legon, Adenta, Tema) appreciates 20-30%/year. Aim for first land purchase by 25. Start saving toward it now." color="text-amber-300" />
                <Item icon="📑" text="Apply to: Tony Elumelu Foundation ($5,000 grant + mentorship), Google for Startups Black Founders Fund Africa, Founders Factory Africa, Norrsken Africa." color="text-purple-300" />
                <Item icon="🤝" text="MEST Africa, Ghana Tech Lab, Accra Tech Hub, KNUST IdeaLab — these are your network hubs. Show up to 1 event per month. Meet 3 founders minimum." />
              </Accordion>
            </div>
          )}

          {/* Napoleon Hill */}
          {sub === 'napoleon' && (
            <div className="space-y-4">
              <SectionLabel n="03" title="Think & Grow Rich — The 13 Steps" color="bg-purple-500/10 text-purple-300 border-purple-500/20" />
              <div className="glass rounded-xl p-4 border border-purple-500/20">
                <p className="text-xs text-gray-400 italic">"The starting point of all achievement is desire. Keep this constantly in mind. Weak desires bring weak results." — Napoleon Hill</p>
              </div>

              <Accordion title="The 13 Steps — Applied to Elijah" subtitle="Hill's complete framework — condensed and personalized" accent="border-purple-500/25" defaultOpen>
                <div className="space-y-3">
                  {[
                    { n: '01', step: 'Desire', apply: 'Your desire is $1M by 27 through tech products. Write it. Make it burning — not a wish, an obsession. If you can go a day without thinking about it, your desire is too weak.' },
                    { n: '02', step: 'Faith', apply: 'Act AS IF it\'s already done. Make decisions the way a millionaire would. The brain cannot distinguish between vivid imagination and reality — use this.' },
                    { n: '03', step: 'Auto-Suggestion', apply: 'Read your DCA and sleep script every single night. Flood your subconscious with the goal until it\'s more familiar than failure.' },
                    { n: '04', step: 'Specialized Knowledge', apply: 'You need: fintech architecture, mobile money APIs, product growth frameworks, basic accounting, and investor pitch skills. Study 1 per month.' },
                    { n: '05', step: 'Imagination', apply: 'Spend 10 min per week visualizing: what does life look like when RushPay is processing $1M/month? Who are you? Who is on your team? Build this picture in detail.' },
                    { n: '06', step: 'Organized Planning', apply: 'This blueprint IS your organized plan. Execute it. Adjust it weekly. Plans must be living documents — review and update every Sunday.' },
                    { n: '07', step: 'Decision', apply: 'You have already decided. No second-guessing. No "let me see how it goes." Your product ships. Your schedule runs. Your investments compound. Decided.' },
                    { n: '08', step: 'Persistence', apply: 'The only difference between people who make it and people who don\'t is persistence through the point where most quit. That point is coming. When it does — this step is your weapon.' },
                    { n: '09', step: 'Power of the Mastermind', apply: 'You need 4-6 people around you who are smarter than you in specific areas. Right now: find 1 technical co-founder candidate, 1 mentor, 1 accountability partner.' },
                    { n: '10', step: 'The Mystery of Sex Transmutation', apply: 'Hill\'s chapter on channeling intense creative energy into work. For you: redirect the time/energy spent on entertainment, relationships, or distraction into building. That energy is jet fuel.' },
                    { n: '11', step: 'The Subconscious Mind', apply: 'Your subconscious is being programmed 24/7 — by what you read, watch, and say to yourself. Make it intentional. Sleep script + DCA = daily programming of your success OS.' },
                    { n: '12', step: 'The Brain', apply: 'Surround yourself with ambitious people. Your brain literally picks up thought frequencies from the people around you. Seek out the most successful minds you can access.' },
                    { n: '13', step: 'The Sixth Sense', apply: 'After months of intense focused work on your goals, you will develop intuition about your business and market. Trust it. This is pattern recognition at its highest form.' },
                  ].map(({ n, step, apply }) => (
                    <div key={n} className="flex items-start gap-3 bg-purple-500/[0.03] border border-purple-500/15 rounded-xl p-3.5">
                      <div className="text-[10px] font-black text-purple-400 opacity-60 w-5 shrink-0 mt-0.5">{n}</div>
                      <div>
                        <div className="text-xs font-black text-purple-300 mb-1">{step}</div>
                        <div className="text-xs text-gray-400 leading-relaxed">{apply}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Accordion>

              <Accordion title="Your Mastermind Group — Build It in 30 Days" subtitle="Every great empire was built by a group of minds, not one" accent="border-purple-500/20">
                <p className="text-xs text-gray-400 mb-3">A mastermind is NOT a friend group. It is a strategic alliance of minds working toward complementary goals. Every meeting should produce insights, connections, or accountability.</p>
                {[
                  { role: 'Technical Co-Founder Candidate', n: '1', desc: 'Another CSE student or developer who codes at your level or above. Complementary skills (if you\'re backend, find frontend, and vice versa). Must share your ambition level.', find: 'Your CSE class, GitHub Ghana community, Dev communities on Twitter/X.' },
                  { role: 'Senior Mentor', n: '1', desc: 'A founder or CTO who is 10+ years ahead of you in fintech, payments, or SaaS. Can make intros, prevent costly mistakes, and cut your learning curve by 5 years.', find: 'MEST Africa alumni, LinkedIn Ghana fintech, Accra Tech Hub mentors.' },
                  { role: 'Accountability Partner', n: '1', desc: 'Someone who is also building. Weekly check-in call (30 min). You both share metrics: what you committed, what you shipped. No soft talk — hold each other to standards.', find: 'Another ambitious student, startup community Slack/Discord groups.' },
                  { role: 'Business / Growth Mind', n: '1', desc: 'Someone who thinks about customers, revenue, and marketing while you think about code. Could be a business student, a marketer, or someone who sold something before.', find: 'Business school at your university, startup competitions, Y Combinator SAFE forums.' },
                ].map(({ role, n, desc, find }) => (
                  <div key={role} className="bg-purple-500/[0.04] border border-purple-500/15 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 rounded-full w-5 h-5 flex items-center justify-center">{n}</span>
                      <div className="text-xs font-black text-purple-300">{role}</div>
                    </div>
                    <div className="text-xs text-gray-400 mb-2 leading-relaxed">{desc}</div>
                    <div className="text-xs text-indigo-300 bg-indigo-500/5 border border-indigo-500/15 rounded-lg px-2.5 py-1.5">🔍 Find here: {find}</div>
                  </div>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════
          TAB 4 — EXECUTION
      ════════════════════════════════════════════ */}
      {tab === 'execute' && (
        <div className="space-y-4">

          {/* Nightly Review */}
          {sub === 'nightly' && (
            <div className="space-y-4">
              <SectionLabel n="01" title="Nightly Review — The Empire Debrief" color="bg-cyan-500/10 text-cyan-300 border-cyan-500/20" />
              <div className="glass rounded-xl p-4 border border-cyan-500/20">
                <p className="text-xs text-gray-400">"What gets measured gets managed. What gets reviewed gets improved. What gets scored gets taken seriously." — 15 minutes every night without exception.</p>
              </div>
              <div className="glass rounded-2xl border border-cyan-500/20 divide-y divide-white/[0.05]">
                {[
                  {
                    part: '01', time: '5 min', title: 'The Day Debrief', color: 'text-cyan-400',
                    qs: [
                      { q: 'What was my #1 achievement today? What tangibly moved forward?', type: 'win' },
                      { q: 'Where did my time actually go? (Not where I planned — where it actually went)', type: 'audit' },
                      { q: 'What financial action did I take or learn today?', type: 'money' },
                      { q: 'What did I learn or build today that I could not 24 hours ago?', type: 'growth' },
                      { q: 'On a scale of 1–10, how hard did I actually push today?', type: 'score' },
                    ]
                  },
                  {
                    part: '02', time: '3 min', title: 'Score Your Day', color: 'text-amber-400',
                    qs: [
                      { q: 'Deep Work quality (1–10)', type: 'score' },
                      { q: 'Discipline — no compromises made (1–10)', type: 'score' },
                      { q: 'Progress on product (1–10)', type: 'score' },
                      { q: 'Financial intelligence used (1–10)', type: 'score' },
                      { q: 'Physical health — exercise + diet (1–10)', type: 'score' },
                      { q: 'Schedule adherence (1–10)', type: 'score' },
                    ]
                  },
                  {
                    part: '03', time: '5 min', title: 'Accountability Mirror', color: 'text-red-400',
                    qs: [
                      { q: 'Did I act like the millionaire version of Elijah Nartey today? Give honest evidence.', type: 'hard' },
                      { q: 'Where did I compromise, settle, or avoid? What was the root cause?', type: 'hard' },
                      { q: "What's the #1 thing that will make tomorrow exceptional?", type: 'win' },
                      { q: "Write tomorrow's 3 non-negotiable tasks RIGHT NOW before closing this journal.", type: 'action' },
                    ]
                  },
                  {
                    part: '04', time: '2 min', title: 'Sleep Ritual', color: 'text-purple-400',
                    qs: [
                      { q: 'Read DCA 3x out loud. Slowly. Feel the reality of it.', type: 'ritual' },
                      { q: 'Read auto-suggestion sleep script. Eyes closed. Picture it done.', type: 'ritual' },
                      { q: 'One sentence: "I am grateful for ___ because it made me stronger today."', type: 'ritual' },
                      { q: 'Sleep. Your subconscious keeps building your empire overnight.', type: 'ritual' },
                    ]
                  },
                ].map(({ part, time, title, color, qs }) => (
                  <div key={part} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider opacity-50 ${color}`}>PART {part}</span>
                        <span className="text-sm font-black text-white">{title}</span>
                      </div>
                      <span className="text-xs text-gray-600 font-bold">{time}</span>
                    </div>
                    <div className="space-y-1.5">
                      {qs.map(({ q }) => (
                        <div key={q} className="text-xs text-gray-400 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">▸ {q}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="glass rounded-xl p-3 border border-green-500/15 text-center">
                  <div className="text-lg font-black text-green-400">45+</div>
                  <div className="text-[10px] text-gray-500">Elite Day Score</div>
                  <div className="text-[10px] text-gray-600">out of 60</div>
                </div>
                <div className="glass rounded-xl p-3 border border-amber-500/15 text-center">
                  <div className="text-lg font-black text-amber-400">35–44</div>
                  <div className="text-[10px] text-gray-500">Solid Day</div>
                  <div className="text-[10px] text-gray-600">keep pushing</div>
                </div>
                <div className="glass rounded-xl p-3 border border-red-500/15 text-center">
                  <div className="text-lg font-black text-red-400">&lt;35</div>
                  <div className="text-[10px] text-gray-500">Red Flag</div>
                  <div className="text-[10px] text-gray-600">what happened?</div>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Plan */}
          {sub === 'weekly' && (
            <div className="space-y-4">
              <SectionLabel n="02" title="Weekly Execution Plan" color="bg-pink-500/10 text-pink-300 border-pink-500/20" />
              <div className="space-y-3">
                {[
                  { day: 'Monday', emoji: '🚀', label: 'Empire Launch Day', color: 'border-indigo-500/20 bg-indigo-500/[0.03]', tc: 'text-indigo-400', items: [
                    'Set your #1 product goal for the week — ONE priority above everything else. Write it first.',
                    'Review last week\'s metrics: users, revenue, commits, savings balance',
                    '30-min product planning session: what specific feature ships by Friday?',
                    'Financial action: execute any investment or savings plan from Sunday review',
                    'Send 1 cold outreach message to a potential user, partner, or investor',
                  ]},
                  { day: 'Tue–Thu', emoji: '⚡', label: 'Deep Build Days (x3)', color: 'border-amber-500/20 bg-amber-500/[0.03]', tc: 'text-amber-400', items: [
                    '4+ hours of pure Deep Work per day — all 3 days. No exceptions, no meetings.',
                    'Phone on airplane mode during every build session. Remove friction completely.',
                    'Push at least 1 meaningful GitHub commit every single day',
                    '20-page minimum reading each night (rotate books)',
                    'Log daily habit scorecard before bed — see what\'s slipping',
                  ]},
                  { day: 'Friday', emoji: '🌍', label: 'Growth & Network Day', color: 'border-green-500/20 bg-green-500/[0.03]', tc: 'text-green-400', items: [
                    'Reach out to 1 person in Ghana / Africa tech. Genuine message. Not copy-paste.',
                    'Post 1 piece of content: build update, lesson learned, or product screenshot',
                    'Research: 1 competitor deep-dive, 1 grant opportunity, 1 potential investor',
                    'User feedback session: call or message 1 beta user. Ask what they hate about your product.',
                    'Financial review: check all balances, log expenses, update net worth tracker',
                  ]},
                  { day: 'Saturday', emoji: '📚', label: 'Wealth Education Day', color: 'border-purple-500/20 bg-purple-500/[0.03]', tc: 'text-purple-400', items: [
                    '2+ hours dedicated reading — finance, business model analysis, or technical learning',
                    'Study 1 successful African tech company in depth: how they grew, funded, and scaled',
                    'AI Bot: 1 hour on strategy refinement, backtesting improvement, or data analysis',
                    'Update your personal financial statement — assets, liabilities, net worth',
                    'Write 1 reflection: what you learned this week that changed how you think',
                  ]},
                  { day: 'Sunday', emoji: '🔁', label: 'CEO Review Day', color: 'border-cyan-500/20 bg-cyan-500/[0.03]', tc: 'text-cyan-400', items: [
                    '90-minute Empire Review: wins, metrics, autopsy, next week plan (see Nightly section)',
                    'Time-block the entire coming week — every hour has a purpose written in advance',
                    'Read your DCA and declarations. Reconnect with WHY this matters.',
                    'Intentional rest: walk, cook, or read something non-business. Recharge = better output.',
                    'Set tomorrow\'s alarm. Be in bed by 1:30am. No excuses.',
                  ]},
                ].map(({ day, emoji, label, color, tc, items }) => (
                  <Accordion key={day} title={`${emoji} ${day} — ${label}`} accent={`${color.split(' ')[0]}`} defaultOpen={day === 'Monday'}>
                    <div className={`text-[10px] font-black uppercase tracking-wider ${tc} mb-2`}>MUST-DO LIST</div>
                    {items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 py-1.5">
                        <div className={`text-[10px] font-black ${tc} shrink-0 mt-0.5 w-4`}>{i + 1}.</div>
                        <div className="text-sm text-gray-300 leading-relaxed">{item}</div>
                      </div>
                    ))}
                  </Accordion>
                ))}
              </div>
              <Callout type="warning" title="The Golden Rule of Weekly Planning">
                <div>If it's not written and time-blocked, it will not happen. Intention without structure is fantasy.</div>
                <div>Block your Deep Work sessions as non-negotiable appointments — treat them like a class with a strict professor.</div>
                <div>Review your week plan every morning for 2 minutes. Stay on track or consciously adjust — never just drift.</div>
              </Callout>
            </div>
          )}

          {/* Product Roadmap */}
          {sub === 'products' && (
            <div className="space-y-4">
              <SectionLabel n="03" title="Product Roadmap — 3 Bets" color="bg-indigo-500/10 text-indigo-300 border-indigo-500/20" />

              <Accordion title="RushPay — West Africa Payments Infrastructure" subtitle="Your highest-potential product. Biggest market. Biggest prize." accent="border-indigo-500/25" defaultOpen>
                <div className="text-xs font-black text-indigo-400 uppercase tracking-wider mb-2">PRODUCT VISION</div>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">The problem: sending and receiving money across Ghana (and West Africa) is expensive, slow, and excludes millions of unbanked people. RushPay is the fix — fast, cheap, accessible payments via MoMo, bank, and diaspora corridors.</p>
                <div className="space-y-3">
                  {[
                    { phase: 'MVP (Day 60)', color: 'text-green-400', border: 'border-green-500/15', tasks: ['P2P transfers via MoMo number', 'Basic user registration + KYC', 'Transaction history', 'Simple fee structure (0.5-1%)'] },
                    { phase: 'v1.0 (Month 4)', color: 'text-indigo-400', border: 'border-indigo-500/15', tasks: ['Merchant payment links (like Paystack but for GHS)', 'Business dashboard + analytics', 'Recurring payment support', 'API for developers to integrate'] },
                    { phase: 'v2.0 (Month 9)', color: 'text-amber-400', border: 'border-amber-500/15', tasks: ['GHS ↔ USD exchange corridor', 'Diaspora remittance (UK/US → Ghana)', 'WhatsApp payment bot integration', 'Multi-currency wallet'] },
                  ].map(({ phase, color, border, tasks }) => (
                    <div key={phase} className={`rounded-xl border ${border} p-3`}>
                      <div className={`text-xs font-black ${color} mb-2`}>{phase}</div>
                      {tasks.map(t => <div key={t} className="text-xs text-gray-400 py-0.5">▸ {t}</div>)}
                    </div>
                  ))}
                </div>
                <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-3 mt-1">
                  <div className="text-xs font-bold text-indigo-400 mb-1">Revenue Model</div>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <div>• 0.8% per transaction (standard for Africa payments)</div>
                    <div>• GH₵ 99/month business plan (unlimited transactions)</div>
                    <div>• 1.5% spread on currency exchange</div>
                    <div>• Target: GH₵ 5,000/month MRR by Month 12</div>
                  </div>
                </div>
              </Accordion>

              <Accordion title="ShopKeeper — The SME Operating System" subtitle="17M+ SMEs in Ghana. Most run on pen and paper. You fix that." accent="border-green-500/25">
                <div className="text-xs font-black text-green-400 uppercase tracking-wider mb-2">PRODUCT VISION</div>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">The problem: Ghana's 4.5 million+ small businesses use notebooks, WhatsApp, and guesswork to manage inventory, sales, and money. ShopKeeper is their digital brain — simple, affordable, offline-capable.</p>
                <div className="space-y-3">
                  {[
                    { phase: 'MVP (Day 60)', color: 'text-green-400', border: 'border-green-500/15', tasks: ['Product inventory management', 'Sales recording + daily revenue summary', 'Low stock alerts', 'Simple profit calculator'] },
                    { phase: 'v1.0 (Month 5)', color: 'text-indigo-400', border: 'border-indigo-500/15', tasks: ['Customer records + credit tracking', 'Receipt generation (WhatsApp-shareable)', 'Multi-user (shop owner + staff)', 'Expense tracking'] },
                    { phase: 'v2.0 (Month 10)', color: 'text-amber-400', border: 'border-amber-500/15', tasks: ['RushPay integration (accept digital payments)', 'Supplier ordering system', 'Business credit score (for loans)', 'USSD version (feature phones)'] },
                  ].map(({ phase, color, border, tasks }) => (
                    <div key={phase} className={`rounded-xl border ${border} p-3`}>
                      <div className={`text-xs font-black ${color} mb-2`}>{phase}</div>
                      {tasks.map(t => <div key={t} className="text-xs text-gray-400 py-0.5">▸ {t}</div>)}
                    </div>
                  ))}
                </div>
                <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-3 mt-1">
                  <div className="text-xs font-bold text-green-400 mb-1">Revenue Model</div>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <div>• GH₵ 49/month (basic) | GH₵ 99/month (pro with multi-user)</div>
                    <div>• Annual plan: GH₵ 399/year (2 months free)</div>
                    <div>• B2B: GH₵ 299/month for chains and franchise stores</div>
                    <div>• Target: 100 paying shops × GH₵ 49 = GH₵ 4,900 MRR by Month 9</div>
                  </div>
                </div>
              </Accordion>

              <Accordion title="AI Trading Bot — The Passive Income Machine" subtitle="Your long game. Build it right. Let it compound." accent="border-amber-500/25">
                <div className="text-xs font-black text-amber-400 uppercase tracking-wider mb-2">PRODUCT VISION</div>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">An algorithmic trading system that runs 24/7, executing trades based on predefined strategies and ML models. Initial focus: forex pairs (USD/GHS) and crypto (BTC/ETH). Scale to US equities as capital grows.</p>
                <div className="space-y-3">
                  {[
                    { phase: 'v0.1 (Day 90) — Research & Backtest', color: 'text-amber-400', border: 'border-amber-500/15', tasks: ['Define 1 core trading strategy (moving average crossover, RSI, or trend-following)', 'Backtest on 2+ years of historical data', 'Paper trading (simulated, no real money yet)', 'Build performance dashboard: win rate, Sharpe ratio, max drawdown'] },
                    { phase: 'v1.0 (Month 6) — Live, Small Stakes', color: 'text-green-400', border: 'border-green-500/15', tasks: ['Deploy with $50 real capital. Risk only what you can lose.', 'Automated execution via broker API (OANDA, Alpaca, or Binance)', 'Risk management: max 2% of capital per trade, stop-losses required', 'Daily monitoring + performance logging'] },
                    { phase: 'v2.0 (Year 2) — Scale Up', color: 'text-indigo-400', border: 'border-indigo-500/15', tasks: ['Scale to $500-$1,000 capital as performance is proven', 'ML layer: LSTM or reinforcement learning for pattern recognition', 'Add Ghana Stock Exchange (GSE) data when available', 'Consider offering bot as a service to other investors (SaaS model)'] },
                  ].map(({ phase, color, border, tasks }) => (
                    <div key={phase} className={`rounded-xl border ${border} p-3`}>
                      <div className={`text-xs font-black ${color} mb-2`}>{phase}</div>
                      {tasks.map(t => <div key={t} className="text-xs text-gray-400 py-0.5">▸ {t}</div>)}
                    </div>
                  ))}
                </div>
                <Callout type="danger" title="⚠️ Critical Warning — The Intelligent Investor Rule">
                  <div>Never trade money you can't afford to lose. Never invest borrowed money. Never go all-in on any single strategy.</div>
                  <div>Run paper trading for minimum 3 months before deploying real capital. A positive backtest does NOT guarantee live profits.</div>
                  <div>Your edge: compound learnings + long time horizon. Most retail traders lose. You will not, because you build systems — not gamble.</div>
                </Callout>
              </Accordion>

              <div className="glass rounded-2xl p-5 border border-amber-500/20">
                <div className="text-xs font-black text-amber-400 uppercase tracking-widest mb-3">💰 5-Year Revenue Projection</div>
                <div className="space-y-2">
                  {[
                    { year: 'Year 1 (2026)', rushpay: 'GH₵ 2,000', shopkeeper: 'GH₵ 3,000', bot: '$0', total: '~GH₵ 5,000 MRR', color: 'text-gray-400' },
                    { year: 'Year 2 (2027)', rushpay: 'GH₵ 15,000', shopkeeper: 'GH₵ 12,000', bot: '$200/mo', total: '~GH₵ 30,000 MRR', color: 'text-green-400' },
                    { year: 'Year 3 (2028)', rushpay: '$3,000', shopkeeper: '$2,000', bot: '$500/mo', total: '~$5,500 MRR', color: 'text-indigo-400' },
                    { year: 'Year 4 (2029)', rushpay: '$8,000', shopkeeper: '$5,000', bot: '$2,000/mo', total: '~$15,000 MRR', color: 'text-amber-400' },
                    { year: 'Year 5 (2030)', rushpay: '$20,000', shopkeeper: '$12,000', bot: '$5,000/mo', total: '~$37,000 MRR → $444K ARR', color: 'text-amber-300' },
                  ].map(({ year, rushpay, shopkeeper, bot, total, color }) => (
                    <div key={year} className="grid grid-cols-5 gap-2 text-xs px-3 py-2 rounded-xl bg-white/[0.02]">
                      <span className={`font-bold ${color}`}>{year}</span>
                      <span className="text-gray-500">{rushpay}</span>
                      <span className="text-gray-500">{shopkeeper}</span>
                      <span className="text-gray-500">{bot}</span>
                      <span className={`font-bold ${color} text-right`}>{total}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-5 gap-2 text-[10px] px-3 py-1 text-gray-600">
                    <span></span><span>RushPay</span><span>ShopKeeper</span><span>AI Bot</span><span className="text-right">Total</span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2">+ Investment portfolio compounding from Year 1 savings → target $100K+ by Year 5 = total net worth $500K-$1M by 2030.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="glass rounded-2xl p-4 border border-white/[0.05] text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle size={14} className="text-green-400" />
          <span className="text-xs text-gray-500 font-medium">Built for Elijah Nartey · Ghana → Global · 2026–2030</span>
        </div>
        <p className="text-xs text-gray-600">"The distance between who you are and who you want to be is what you <strong className="text-gray-400">do daily</strong> — not what you plan, not what you wish. What you <strong className="text-gray-400">execute</strong>."</p>
      </div>

    </div>
  )
}
