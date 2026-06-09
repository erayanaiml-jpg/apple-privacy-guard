'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Activity,
  Gauge,
  KeyRound,
  Lock,
  ScanLine,
  ShieldHalf,
  Sparkles,
} from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { ShieldStatus } from './shield-status'
import { StatCard } from './stat-card'
import { ModuleToggle, type ModuleDef, type ModuleKey } from './module-toggle'
import {
  EVENT_TEMPLATES,
  EventFeed,
  type EventItem,
} from './event-feed'

const MODULES: ModuleDef[] = [
  {
    key: 'interceptor',
    icon: ScanLine,
    title: 'AI Prompt Interceptor',
    description: 'Scans prompts before they reach AI models',
  },
  {
    key: 'scrambler',
    icon: ShieldHalf,
    title: 'Form Field Scrambler',
    description: 'Obfuscates sensitive fields in real time',
  },
  {
    key: 'vault',
    icon: Lock,
    title: 'Local Vault Encryption',
    description: 'AES-256 on-device secret storage',
  },
]

let eventId = 100

function makeEvent(): EventItem {
  const template =
    EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)]
  return { ...template, id: eventId++, time: Date.now() }
}

export function Dashboard() {
  const [protectedOn, setProtectedOn] = useState(true)
  const [modules, setModules] = useState<Record<ModuleKey, boolean>>({
    interceptor: true,
    scrambler: true,
    vault: true,
  })

  const [intercepted, setIntercepted] = useState(1284)
  const [blockedFields, setBlockedFields] = useState(372)
  const [privacyScore, setPrivacyScore] = useState(98)

  const [events, setEvents] = useState<EventItem[]>(() => {
    const now = Date.now()
    return [
      { ...EVENT_TEMPLATES[0], id: 1, time: now - 8000 },
      { ...EVENT_TEMPLATES[1], id: 2, time: now - 42000 },
      { ...EVENT_TEMPLATES[3], id: 3, time: now - 95000 },
      { ...EVENT_TEMPLATES[2], id: 4, time: now - 180000 },
      { ...EVENT_TEMPLATES[6], id: 5, time: now - 320000 },
    ]
  })

  // tick to refresh relative timestamps
  const [, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const activeModuleCount = Object.values(modules).filter(Boolean).length
  const fullyActive = protectedOn && activeModuleCount > 0

  // derive privacy score from active modules + protection state
  useEffect(() => {
    if (!protectedOn) {
      setPrivacyScore(34)
      return
    }
    setPrivacyScore(60 + activeModuleCount * 13 - (3 - activeModuleCount))
  }, [protectedOn, activeModuleCount])

  // live event simulation
  const protectedRef = useRef(fullyActive)
  protectedRef.current = fullyActive
  useEffect(() => {
    const schedule = () => {
      const delay = 3500 + Math.random() * 4000
      return setTimeout(() => {
        if (protectedRef.current) {
          const e = makeEvent()
          setEvents((prev) => [e, ...prev].slice(0, 8))
          setIntercepted((n) => n + 1)
          setBlockedFields((n) => n + (Math.random() > 0.5 ? 1 : 0))
        }
        timer = schedule()
      }, delay)
    }
    let timer = schedule()
    return () => clearTimeout(timer)
  }, [])

  const toggleModule = useCallback((key: ModuleKey) => {
    setModules((m) => ({ ...m, [key]: !m[key] }))
  }, [])

  const threatsToday = intercepted - 1200

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <KeyRound className="size-5" strokeWidth={2.3} />
          </span>
          <div className="leading-tight">
            <h1 className="text-[15px] font-semibold tracking-tight">
              Privacy-Guard
            </h1>
            <p className="text-xs text-muted-foreground">Safari Extension</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex">
            <Sparkles className="size-3.5 text-primary" />
            On-device · Private
          </span>
          <ThemeToggle />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left column: shield + master switch */}
        <section className="flex flex-col gap-4 lg:col-span-1">
          <ShieldStatus active={fullyActive} threatsToday={threatsToday} />

          <div className="flex items-center justify-between rounded-[1.4rem] border border-border bg-card p-5">
            <div>
              <p className="text-sm font-medium">Protection</p>
              <p className="text-xs text-muted-foreground">
                Master shield switch
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={protectedOn}
              aria-label="Toggle master protection"
              onClick={() => setProtectedOn((p) => !p)}
              className={`relative inline-flex h-8 w-[54px] shrink-0 items-center rounded-full transition-colors duration-300 ${
                protectedOn ? 'bg-success' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className={`inline-block size-[26px] rounded-full bg-white shadow-md transition-transform duration-300 ${
                  protectedOn ? 'translate-x-[26px]' : 'translate-x-[3px]'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Right column: stats + modules + feed */}
        <section className="flex flex-col gap-4 lg:col-span-2">
          {/* Counters */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={Activity}
              label="Intercepted Prompts"
              value={intercepted}
              accent="primary"
              trend="+12%"
            />
            <StatCard
              icon={ShieldHalf}
              label="Blocked Data Fields"
              value={blockedFields}
              accent="warning"
              trend="+5%"
            />
            <StatCard
              icon={Gauge}
              label="Privacy Score"
              value={privacyScore}
              suffix="%"
              accent="success"
            />
          </div>

          {/* Modules */}
          <div className="rounded-[1.4rem] border border-border bg-card/40 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">
                Scanning Modules
              </h2>
              <span className="text-xs text-muted-foreground">
                {activeModuleCount}/3 active
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {MODULES.map((m) => (
                <ModuleToggle
                  key={m.key}
                  module={m}
                  enabled={modules[m.key]}
                  onToggle={toggleModule}
                />
              ))}
            </div>
          </div>

          {/* Live feed */}
          <div className="rounded-[1.4rem] border border-border bg-card/40 p-5">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">
                Live Activity
              </h2>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className={`size-1.5 rounded-full ${fullyActive ? 'animate-pulse bg-success' : 'bg-muted-foreground/40'}`}
                />
                {fullyActive ? 'Monitoring' : 'Paused'}
              </span>
            </div>
            {events.length > 0 ? (
              <EventFeed events={events} />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No activity yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
