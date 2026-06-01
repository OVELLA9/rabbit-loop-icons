'use client'

import React, { useEffect, useRef, useState } from 'react'

interface CanvasElement {
  id:         string
  type:       'emoji' | 'text'
  content:    string
  x:          number
  y:          number
  fontSize:   number
  rotation:   number
  color:      string
  fontFamily?: string
}

const FONTS: { label: string; value: string; weight: string }[] = [
  { label: 'System',           value: '-apple-system, Arial, sans-serif', weight: 'bold'  },
  { label: 'Inter',            value: "'Inter', sans-serif",               weight: 'bold'  },
  { label: 'Poppins',          value: "'Poppins', sans-serif",             weight: 'bold'  },
  { label: 'Montserrat',       value: "'Montserrat', sans-serif",          weight: 'bold'  },
  { label: 'Bebas Neue',       value: "'Bebas Neue', cursive",             weight: '400'   },
  { label: 'Oswald',           value: "'Oswald', sans-serif",              weight: 'bold'  },
  { label: 'Playfair',         value: "'Playfair Display', serif",         weight: 'bold'  },
  { label: 'Space Grotesk',    value: "'Space Grotesk', sans-serif",       weight: 'bold'  },
  { label: 'Nunito',           value: "'Nunito', sans-serif",              weight: 'bold'  },
  { label: 'Syne',             value: "'Syne', sans-serif",                weight: '800'   },
  { label: 'DM Serif',         value: "'DM Serif Display', serif",         weight: '400'   },
]

function fontString(el: CanvasElement, sizeWithScale: number): string {
  const f = FONTS.find(f => f.value === el.fontFamily) ?? FONTS[0]
  return `${f.weight} ${sizeWithScale}px ${f.value}`
}

const CANVAS_SIZE  = 1024
const DISPLAY_SIZE = 512
const SCALE        = DISPLAY_SIZE / CANVAS_SIZE
const SNAP_DIST    = 14  // canvas units (~7px on screen)

// Fake app icons for device previews
const IPHONE_ICONS = [
  { bg: '#007AFF', e: '📞' }, { bg: '#34C759', e: '💬' }, { bg: '#FF9500', e: '🗓' }, { bg: '#FF3B30', e: '🎵' },
  { bg: '#FF2D55', e: '📸' }, { bg: '#5856D6', e: '🔔' }, { bg: '#32ADE6', e: '🌤' }, { bg: '#AF52DE', e: '🗺' },
  { bg: '#1C8EF9', e: '🌐' }, { bg: '#FF6B00', e: '📰' }, { bg: '#30B0C7', e: '📧' }, { bg: '#636366', e: '⚙' },
  { bg: '#FFD60A', e: '📝' }, { bg: '#30D158', e: '🏃' }, { bg: '#BF5AF2', e: '🎙' }, { bg: '#FF453A', e: '🎬' },
]
const IPHONE_DOCK  = [
  { bg: '#007AFF', e: '📞' }, { bg: '#34C759', e: '💬' }, { bg: '#1C8EF9', e: '🌐' }, { bg: '#FF9500', e: '🎵' },
]
const ANDROID_ICONS = [
  { bg: '#1A73E8', e: '🌐' }, { bg: '#34A853', e: '📞' }, { bg: '#EA4335', e: '📧' }, { bg: '#FBBC04', e: '🗺' },
  { bg: '#0F9D58', e: '💬' }, { bg: '#4285F4', e: '📅' }, { bg: '#E37400', e: '▶' }, { bg: '#DB4437', e: '📸' },
  { bg: '#673AB7', e: '🎵' }, { bg: '#00897B', e: '📰' }, { bg: '#F06292', e: '🛒' }, { bg: '#455A64', e: '⚙' },
  { bg: '#7CB342', e: '🌿' }, { bg: '#039BE5', e: '☁' },  { bg: '#F4511E', e: '📋' }, { bg: '#8E24AA', e: '🔮' },
]
const ANDROID_DOCK = [
  { bg: '#1A73E8', e: '🌐' }, { bg: '#34A853', e: '📞' }, { bg: '#0F9D58', e: '💬' }, { bg: '#DB4437', e: '📷' },
]

const EMOJI_GROUPS: { label: string; items: string[] }[] = [
  { label: 'Faces', items: [
    '😀','😂','😍','🥰','😎','🤔','🥳','😭','🤯','😴',
    '🤩','🥺','😤','😠','🤬','😈','👿','🤡','👻','💩',
    '🤫','🤭','🧐','🤓','😏','😒','😞','😔','😟','😕',
  ]},
  { label: 'Animals', items: [
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
    '🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🦆','🦅',
    '🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋',
    '🐌','🐞','🐜','🦟','🦗','🕷','🦂','🐢','🐍','🦎',
    '🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟',
    '🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧',
    '🦣','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃',
    '🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩',
    '🦮','🐈','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊',
    '🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🦔',
  ]},
  { label: 'Tech', items: [
    '💻','🖥','🖨','⌨','🖱','🖲','💽','💾','💿','📀',
    '📱','☎','📞','📟','📠','📺','📷','📸','📹','🎥',
    '📡','🔋','🪫','🔌','💡','🔦','🕯','🧯','🔭','🔬',
    '🧬','🧪','🧫','🧲','⚗','🔩','🪛','🔧','🪚','🔨',
    '⛏','⚒','🛠','🔫','🪃','🏹','🛡','🚀','🛸','🛰',
    '🤖','👾','🕹','🎮','🎰','🃏','🎲','🧩','🪀','🪁',
    '💳','🪙','💰','🔑','🗝','📊','📈','📉','🗂','📋',
    '📌','📍','✏','📏','📐','✂','🖊','🖋','✒','🖌',
  ]},
  { label: 'Calendar & Time', items: [
    '📅','📆','🗓','📇','📋','📌','📍','🗂','🗃','🗄',
    '📁','📂','🗑','📝','📓','📔','📒','📕','📗','📘',
    '📙','📚','📖','🔖','🏷','⏰','⏱','⏲','🕰','⌚',
    '📿','🔔','🔕','📣','📢','🗣','💬','💭','🗯','📩',
    '📨','📧','📤','📥','📦','🎁','🎀','🎗','🎟','🎫',
    '📜','📄','📃','📑','🗒','🗞','📰','🗺','🏴','🚩',
  ]},
  { label: 'Nature', items: [
    '🌸','🌹','🥀','🌺','🌻','🌼','💐','🍀','🍁','🍂',
    '🍃','🌿','☘','🌱','🌲','🌳','🌴','🌵','🎋','🎍',
    '🌾','🍄','🐚','🪸','🪨','🌊','💧','💦','🌬','🌀',
    '🌈','⚡','❄','🔥','💥','🌙','⭐','🌟','💫','✨',
    '☀','🌤','⛅','🌥','☁','🌦','🌧','⛈','🌩','🌨',
    '🌪','🌫','🌬','⛄','🌂','☂','⛱','🌍','🌎','🌏',
  ]},
  { label: 'Food & Drink', items: [
    '🍎','🍊','🍋','🍇','🍓','🫐','🥝','🍑','🥭','🍍',
    '🥥','🍆','🥑','🥦','🥬','🌽','🌶','🥒','🥕','🧅',
    '🍕','🍔','🌮','🌯','🥙','🧆','🥚','🍳','🧇','🥞',
    '🥓','🥩','🍗','🍖','🌭','🍿','🧂','🍱','🍜','🍝',
    '🍲','🍛','🍣','🥟','🦪','🍤','🍙','🍚','🍘','🎂',
    '🍰','🧁','🍭','🍬','🍫','🍩','🍪','🌰','🥜','🍯',
    '🧃','🥤','🧋','☕','🫖','🍵','🍺','🍷','🥂','🍸',
  ]},
  { label: 'Travel & Places', items: [
    '🚗','🚕','🚙','🏎','🚓','🚑','🚒','🛻','🚌','🏍',
    '🛵','🚲','🛴','✈','🛩','🛫','🛬','🪂','💺','🚁',
    '🛸','🚀','⛵','🚤','🛥','🛳','⛴','🚢','⚓','🗺',
    '🗼','🗽','🗿','🏛','🏟','🏘','🏠','🏡','🏢','🏣',
    '🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🏯',
    '🏰','⛪','🌁','🌉','🌃','🌆','🌇','🌌','🎠','🎡',
  ]},
  { label: 'Sports & Games', items: [
    '⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱',
    '🏓','🏸','🏒','🥍','🏑','🪃','🏹','🎣','🤿','🥊',
    '🥋','🎽','🛹','🛷','⛸','🥌','🎿','⛷','🏂','🏋',
    '🤼','🤸','🤺','🏇','⛹','🏊','🧗','🚴','🏆','🥇',
    '🥈','🥉','🏅','🎖','🎗','🎯','🎳','🎲','🧩','🎮',
    '🕹','👾','🃏','🀄','🎴','🎪','🎭','🎨','🖼','🎬',
  ]},
]

const SYMBOL_GROUPS: { label: string; items: string[] }[] = [
  { label: 'Shapes', items: [
    '★','☆','●','○','■','□','▲','△','▶','▷',
    '◀','◁','◆','◇','◈','◉','◎','◐','◑','◒',
    '◓','◔','◕','◖','◗','❖','⬟','⬠','⬡','⬢',
    '⬣','⬤','⬥','⬦','⬧','⬨','⬩','⬪','⬫','⬬',
    '▪','▫','▬','▭','▮','▯','▰','▱','▴','▵',
    '▸','▹','▾','▿','◂','◃','◄','►','◅','▻',
  ]},
  { label: 'Arrows', items: [
    '←','→','↑','↓','↔','↕','↖','↗','↘','↙',
    '⬆','⬇','⬅','➡','⬋','⬊','⬉','⬈','⇧','⇩',
    '⇦','⇨','⇪','⇫','⇬','⇭','⇮','⇯','⇰','⇱',
    '⇲','⇳','⇴','⇵','⇶','⇷','⇸','⇹','⇺','⇻',
    '↰','↱','↲','↳','↴','↵','↶','↷','↸','↹',
    '⤴','⤵','⤶','⤷','⤸','⤹','⤺','⤻','⤼','⤽',
  ]},
  { label: 'Stars & Flowers', items: [
    '✦','✧','✩','✪','✫','✬','✭','✮','✯','✰',
    '✱','✲','✳','✴','✵','✶','✷','✸','✹','✺',
    '✻','✼','✽','✾','✿','❀','❁','❂','❃','❄',
    '❅','❆','❇','❈','❉','❊','❋','❍','❏','❐',
    '❑','❒','❖','❛','❜','❝','❞','❡','❢','❣',
    '❤','❥','❦','❧','⁂','⁎','⁑','⁕','⁜','※',
  ]},
  { label: 'Tech & UI', items: [
    '⌘','⌥','⌫','⌦','⏎','⎋','⌧','⌨','⌲','⌳',
    '⏏','⏐','⏑','⏒','⏓','⏔','⏕','⏖','⏗','⏘',
    '⏙','⏚','⏛','⏜','⏝','⏞','⏟','⏠','⏡','⏢',
    '⊕','⊗','⊙','⊚','⊛','⊜','⊝','⊞','⊟','⊠',
    '⊡','⊢','⊣','⊤','⊥','⊦','⊧','⊨','⊩','⊪',
    '⌀','⌁','⌂','⌃','⌄','⌅','⌆','⌇','⌈','⌉',
  ]},
  { label: 'Music & Math', items: [
    '♪','♫','♬','♭','♮','♯',
    '∞','∑','∏','√','∛','∜','∂','∇','∆','∈',
    '∉','∊','∋','∌','∍','∎','∐','−','∓','∔',
    '∕','∖','∗','∘','∙','∝','∟','∠','∡','∢',
    '∣','∤','∥','∦','∧','∨','∩','∪','∫','∬',
    '∭','∮','∯','∰','∱','∲','∳','∴','∵','∶',
  ]},
  { label: 'Misc', items: [
    '⚙','⚡','☁','☀','☽','☾','☎','⚑','⚐','⚒',
    '⚓','⚔','⚕','⚖','⚗','⚘','⚙','⚚','⚛','⚜',
    '♠','♣','♥','♦','♤','♧','♡','♢','♰','♱',
    '✓','✗','✘','✚','✛','✜','✝','✞','✟','✠',
    '✡','✢','✣','✤','✥','☯','☮','☸','⛎','☦',
    '♈','♉','♊','♋','♌','♍','♎','♏','♐','♑',
  ]},
  { label: 'Circled', items: [
    '⓪','①','②','③','④','⑤','⑥','⑦','⑧','⑨',
    '⑩','⑪','⑫','⑬','⑭','⑮','⑯','⑰','⑱','⑲',
    '⑳','❶','❷','❸','❹','❺','❻','❼','❽','❾',
    '❿','⓫','⓬','⓭','⓮','⓯','⓰','⓱','⓲','⓳',
  ]},
  { label: 'Greek', items: [
    'Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ',
    'Λ','Μ','Ν','Ξ','Ο','Π','Ρ','Σ','Τ','Υ',
    'Φ','Χ','Ψ','Ω','α','β','γ','δ','ε','ζ',
    'η','θ','ι','κ','λ','μ','ν','ξ','ο','π',
    'ρ','σ','τ','υ','φ','χ','ψ','ω',
  ]},
  { label: 'Currency', items: [
    '$','€','£','¥','¢','₿','₽','₩','₪','₫',
    '₭','₮','₱','₲','₳','₴','₵','₷','₸','₹',
    '₺','₼','₾','¤','₠','₡','₢','₣','₤','₦',
  ]},
  { label: 'Chess & Cards', items: [
    '♔','♕','♖','♗','♘','♙','♚','♛','♜','♝',
    '♞','♟','♠','♣','♥','♦','♤','♧','♡','♢',
  ]},
  { label: 'Planets & Sky', items: [
    '☉','☽','☾','☿','♀','♁','♂','♃','♄','♅',
    '♆','♇','☄','⊕','⊙','♒','♓','☀','☁','☂',
    '☃','⛄','☈','⛈','⛅','🌤','⛆','☔','⛱','❄',
  ]},
  { label: 'Lines & Blocks', items: [
    '─','│','┌','┐','└','┘','├','┤','┬','┴',
    '┼','╔','╗','╚','╝','║','═','╠','╣','╦',
    '╩','╬','╭','╮','╯','╰','╱','╲','╳','░',
    '▒','▓','█','▀','▄','▌','▐','▏','▎','▍',
  ]},
  { label: 'Hands & Signs', items: [
    '☞','☜','☝','☟','☛','☚','✌','✍','✏','✒',
    '✑','✐','✎','✄','✃','✂','☡','☠','☢','☣',
  ]},
]

function renderIcon(elements: CanvasElement[], bgColor: string, size: number, tinted = false, watermark = false): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx   = canvas.getContext('2d')!
  const scale = size / CANVAS_SIZE
  ctx.fillStyle = tinted ? '#000000' : bgColor
  ctx.fillRect(0, 0, size, size)
  for (const el of elements) {
    ctx.save()
    ctx.translate(el.x * scale, el.y * scale)
    ctx.rotate((el.rotation * Math.PI) / 180)
    ctx.font         = fontString(el, el.fontSize * scale)
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle    = tinted ? '#ffffff' : el.color
    ctx.fillText(el.content, 0, 0)
    ctx.restore()
  }
  if (watermark) {
    const pad      = size * 0.05
    const fontSize = size * 0.1
    ctx.save()
    ctx.font         = `bold ${fontSize}px -apple-system, Arial, sans-serif`
    ctx.fillStyle    = 'rgba(255,255,255,0.45)'
    ctx.textAlign    = 'right'
    ctx.textBaseline = 'bottom'
    ctx.fillText('RL', size - pad, size - pad)
    ctx.restore()
  }
  return canvas
}

function AppIconCell({ bg, e, size, radius }: { bg: string; e: string; size: number; radius: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: bg, overflow: 'hidden', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.5,
    }}>
      {e}
    </div>
  )
}

export default function IconBuilder({ isPremium = false }: { isPremium?: boolean }) {
  const canvasRef   = useRef<HTMLDivElement>(null)
  const iphoneRef   = useRef<HTMLCanvasElement>(null)
  const androidRef  = useRef<HTMLCanvasElement>(null)

  const [elements,     setElements]     = useState<CanvasElement[]>([])
  const [bgColor,      setBgColor]      = useState('#0a0a0a')
  const [selectedId,   setSelectedId]   = useState<string | null>(null)
  const [showEmojis,   setShowEmojis]   = useState(false)
  const [showText,     setShowText]     = useState(false)
  const [pickerTab,    setPickerTab]    = useState<'emoji' | 'symbols'>('emoji')
  const [emojiGroup,   setEmojiGroup]   = useState(0)
  const [symbolGroup,  setSymbolGroup]  = useState(0)
  const [textInput,    setTextInput]    = useState('')
  const [textColor,    setTextColor]    = useState('#ffffff')
  const [selectedFont, setSelectedFont] = useState(FONTS[0].value)
  const [snapLines,    setSnapLines]    = useState<{ axis: 'x'|'y'; pos: number }[]>([])
  const [zoomDevice,   setZoomDevice]   = useState<'iphone'|'android'|null>(null)

  const [dragging, setDragging] = useState<{
    id: string; startX: number; startY: number; origX: number; origY: number
  } | null>(null)
  const [resizing, setResizing] = useState<{
    id: string; centerX: number; centerY: number; origSize: number; origDist: number
  } | null>(null)
  const [rotating, setRotating] = useState<{
    id: string; centerX: number; centerY: number; startAngle: number; origRotation: number
  } | null>(null)

  const selected = elements.find(e => e.id === selectedId) ?? null

  function update(id: string, patch: Partial<CanvasElement>) {
    setElements(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))
  }

  function addEmoji(emoji: string) {
    const el: CanvasElement = {
      id: crypto.randomUUID(), type: 'emoji', content: emoji,
      x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2, fontSize: 200, rotation: 0, color: '#ffffff',
    }
    setElements(prev => [...prev, el])
    setSelectedId(el.id)
    setShowEmojis(false)
  }

  function addText() {
    if (!textInput.trim()) return
    const el: CanvasElement = {
      id: crypto.randomUUID(), type: 'text', content: textInput.trim(),
      x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2, fontSize: 120, rotation: 0, color: textColor, fontFamily: selectedFont,
    }
    setElements(prev => [...prev, el])
    setSelectedId(el.id)
    setTextInput('')
    setShowText(false)
  }

  function deleteSelected() {
    if (!selectedId) return
    setElements(prev => prev.filter(e => e.id !== selectedId))
    setSelectedId(null)
  }

  function bringForward() {
    if (!selectedId) return
    setElements(prev => {
      const i = prev.findIndex(e => e.id === selectedId)
      if (i >= prev.length - 1) return prev
      const a = [...prev];[a[i], a[i + 1]] = [a[i + 1], a[i]]; return a
    })
  }

  function sendBack() {
    if (!selectedId) return
    setElements(prev => {
      const i = prev.findIndex(e => e.id === selectedId)
      if (i <= 0) return prev
      const a = [...prev];[a[i - 1], a[i]] = [a[i], a[i - 1]]; return a
    })
  }

  function getCenterScreen(el: CanvasElement) {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { cx: rect.left + el.x * SCALE, cy: rect.top + el.y * SCALE }
  }

  function onElementMouseDown(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setSelectedId(id)
    const el = elements.find(el => el.id === id)!
    setDragging({ id, startX: e.clientX, startY: e.clientY, origX: el.x, origY: el.y })
  }

  function onResizeMouseDown(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    const el = elements.find(el => el.id === id)!
    const { cx, cy } = getCenterScreen(el)
    setResizing({ id, centerX: cx, centerY: cy, origSize: el.fontSize, origDist: Math.max(Math.hypot(e.clientX - cx, e.clientY - cy), 1) })
  }

  function onRotateMouseDown(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    const el = elements.find(el => el.id === id)!
    const { cx, cy } = getCenterScreen(el)
    setRotating({ id, centerX: cx, centerY: cy, startAngle: Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI, origRotation: el.rotation })
  }

  useEffect(() => {
    function snap(val: number, points: number[]): { val: number; snapped: number | null } {
      for (const p of points) {
        if (Math.abs(val - p) < SNAP_DIST) return { val: p, snapped: p }
      }
      return { val, snapped: null }
    }

    function onMouseMove(e: MouseEvent) {
      if (dragging) {
        const dx  = (e.clientX - dragging.startX) / SCALE
        const dy  = (e.clientY - dragging.startY) / SCALE
        let newX  = Math.max(0, Math.min(CANVAS_SIZE, dragging.origX + dx))
        let newY  = Math.max(0, Math.min(CANVAS_SIZE, dragging.origY + dy))

        const others  = elements.filter(el => el.id !== dragging.id)
        const snapX   = [0, CANVAS_SIZE / 2, CANVAS_SIZE, ...others.map(el => el.x)]
        const snapY   = [0, CANVAS_SIZE / 2, CANVAS_SIZE, ...others.map(el => el.y)]
        const sx      = snap(newX, snapX)
        const sy      = snap(newY, snapY)
        newX = sx.val
        newY = sy.val

        const lines: { axis: 'x'|'y'; pos: number }[] = []
        if (sx.snapped !== null) lines.push({ axis: 'x', pos: sx.snapped })
        if (sy.snapped !== null) lines.push({ axis: 'y', pos: sy.snapped })
        setSnapLines(lines)

        update(dragging.id, { x: newX, y: newY })
      }
      if (resizing) {
        const dist = Math.hypot(e.clientX - resizing.centerX, e.clientY - resizing.centerY)
        update(resizing.id, { fontSize: Math.max(20, Math.min(CANVAS_SIZE * 0.9, resizing.origSize * (dist / resizing.origDist))) })
      }
      if (rotating) {
        const angle = Math.atan2(e.clientY - rotating.centerY, e.clientX - rotating.centerX) * 180 / Math.PI
        update(rotating.id, { rotation: rotating.origRotation + (angle - rotating.startAngle) })
      }
    }
    function onMouseUp() {
      setDragging(null)
      setResizing(null)
      setRotating(null)
      setSnapLines([])
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [dragging, resizing, rotating, elements])

  // Update device preview canvases
  useEffect(() => {
    const targets = [{ ref: iphoneRef, size: 60 }, { ref: androidRef, size: 57 }]
    for (const { ref, size } of targets) {
      const src = ref.current
      if (!src) continue
      const dst = src.getContext('2d')!
      const rendered = renderIcon(elements, bgColor, size)
      dst.clearRect(0, 0, size, size)
      dst.drawImage(rendered, 0, 0)
    }
  }, [elements, bgColor])

  function download(canvas: HTMLCanvasElement, filename: string) {
    const a = document.createElement('a')
    a.download = filename
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  const wm = !isPremium
  async function exportPng()    { await document.fonts.ready; download(renderIcon(elements, bgColor,   CANVAS_SIZE, false, wm), 'icon.png')        }
  async function exportDark()   { await document.fonts.ready; download(renderIcon(elements, '#000000', CANVAS_SIZE, false, wm), 'icon-dark.png')   }
  async function exportTinted() { await document.fonts.ready; download(renderIcon(elements, '#000000', CANVAS_SIZE, true,  wm), 'icon-tinted.png') }

  // Phone grid helper
  function phoneGrid(icons: typeof IPHONE_ICONS, yourIconIdx: number, iconSize: number, radius: number, gap: number, cols: number) {
    const rows: React.ReactElement[] = []
    let idx = 0
    for (let r = 0; r < Math.ceil(icons.length / cols); r++) {
      const cells: React.ReactElement[] = []
      for (let c = 0; c < cols; c++) {
        const isYours = idx === yourIconIdx
        cells.push(
          <div key={c} style={{ width: iconSize, height: iconSize, borderRadius: radius, overflow: 'hidden', flexShrink: 0 }}>
            {isYours
              ? <canvas ref={r === Math.floor(yourIconIdx / cols) && c === yourIconIdx % cols ? (yourIconIdx === 0 ? iphoneRef : androidRef) : undefined}
                  width={60} height={60} style={{ width: iconSize, height: iconSize, display: 'block' }} />
              : <AppIconCell bg={icons[idx]?.bg ?? '#333'} e={icons[idx]?.e ?? ''} size={iconSize} radius={radius} />
            }
          </div>
        )
        idx++
      }
      rows.push(<div key={r} style={{ display: 'flex', gap, justifyContent: 'center' }}>{cells}</div>)
    }
    return rows
  }

  return (
    <div className="space-y-5">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Background</span>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
        </div>
        <div className="w-px h-5 bg-gray-700" />
        <button onClick={() => { setShowEmojis(v => !v); setShowText(false) }}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${showEmojis ? 'bg-white text-black' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}>
          + Emoji
        </button>
        <button onClick={() => { setShowText(v => !v); setShowEmojis(false) }}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${showText ? 'bg-white text-black' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}>
          + Text
        </button>
        {selected && (
          <>
            <div className="w-px h-5 bg-gray-700" />
            <button onClick={sendBack}    className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg">↓ Back</button>
            <button onClick={bringForward} className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg">↑ Forward</button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">Colour</span>
              <input type="color" value={selected.color} onChange={e => update(selected.id, { color: e.target.value })}
                className="w-7 h-7 rounded cursor-pointer bg-transparent border-0" />
            </div>
            {selected.type === 'text' && (
              <select value={selected.fontFamily ?? FONTS[0].value}
                onChange={e => update(selected.id, { fontFamily: e.target.value })}
                className="bg-gray-800 text-white text-xs px-2 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500">
                {FONTS.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            )}
            <button onClick={deleteSelected} className="px-2.5 py-1.5 bg-red-950 hover:bg-red-900 text-red-400 text-sm rounded-lg">Delete</button>
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={exportPng}    className="px-3 py-1.5 bg-white hover:bg-gray-200 text-black text-sm font-semibold rounded-lg transition-colors">Export</button>
          <button onClick={exportDark}   className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg border border-gray-700 transition-colors">Dark</button>
          <button onClick={exportTinted} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg border border-gray-700 transition-colors">Tinted</button>
        </div>
      </div>

      {/* Emoji / Symbol picker */}
      {showEmojis && (
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setPickerTab('emoji')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${pickerTab === 'emoji' ? 'bg-white text-black font-semibold' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              Emoji
            </button>
            <button onClick={() => setPickerTab('symbols')}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${pickerTab === 'symbols' ? 'bg-white text-black font-semibold' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              Symbols
            </button>
            {pickerTab === 'symbols' && <span className="text-xs text-gray-600 ml-1">Renders in element colour</span>}
          </div>
          <div className="flex flex-wrap gap-1">
            {(pickerTab === 'emoji' ? EMOJI_GROUPS : SYMBOL_GROUPS).map((g, i) => (
              <button key={i}
                onClick={() => pickerTab === 'emoji' ? setEmojiGroup(i) : setSymbolGroup(i)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                  (pickerTab === 'emoji' ? emojiGroup : symbolGroup) === i
                    ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-500 hover:text-gray-300'
                }`}>
                {g.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-10 gap-1 max-h-48 overflow-y-auto">
            {(pickerTab === 'emoji' ? EMOJI_GROUPS[emojiGroup].items : SYMBOL_GROUPS[symbolGroup].items).map((item, i) => (
              <button key={i} onClick={() => addEmoji(item)}
                className="text-2xl hover:bg-gray-800 rounded-lg p-1.5 transition-colors leading-none text-white">
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Text input */}
      {showText && (
        <div className="flex flex-col gap-3 bg-gray-950 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <input value={textInput} onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addText()} placeholder="Enter text…" autoFocus
              className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 placeholder-gray-600" />
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-400">Colour</span>
              <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
            </div>
            <button onClick={addText}
              className="px-3 py-2 bg-white hover:bg-gray-200 text-black text-sm font-medium rounded-lg transition-colors shrink-0">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {FONTS.map(f => (
              <button key={f.value} onClick={() => setSelectedFont(f.value)}
                style={{ fontFamily: f.value }}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${selectedFont === f.value ? 'bg-white text-black border-white' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {elements.length > 0 && (
        <p className="text-xs text-gray-600 text-center">
          Drag to move · <span className="text-gray-500">○</span> rotate · <span className="text-gray-500">□</span> resize · elements snap to centre and each other
        </p>
      )}

      {/* Canvas + device previews */}
      <div className="flex flex-wrap gap-8 justify-center items-start">

        {/* Main canvas */}
        <div>
          <div
            ref={canvasRef}
            className="relative select-none rounded-2xl border border-gray-800"
            style={{ width: DISPLAY_SIZE, height: DISPLAY_SIZE, backgroundColor: bgColor }}
            onClick={() => setSelectedId(null)}
          >
            {/* Snap guide lines */}
            {snapLines.map((line, i) => (
              <div key={i} style={{
                position: 'absolute', pointerEvents: 'none', zIndex: 100,
                background: 'rgba(59,130,246,0.6)',
                ...(line.axis === 'x'
                  ? { left: line.pos * SCALE - 0.5, top: 0, width: 1, height: DISPLAY_SIZE }
                  : { top: line.pos * SCALE - 0.5, left: 0, height: 1, width: DISPLAY_SIZE }),
              }} />
            ))}

            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-700 text-sm">Add emojis or text to get started</p>
              </div>
            )}

            {elements.map(el => {
              const isSel = selectedId === el.id
              return (
                <div key={el.id} style={{
                  position: 'absolute', left: el.x * SCALE, top: el.y * SCALE,
                  fontSize: el.fontSize * SCALE,
                  transform: `translate(-50%, -50%) rotate(${el.rotation}deg)`,
                  cursor: dragging?.id === el.id ? 'grabbing' : 'grab',
                  lineHeight: 1, userSelect: 'none', color: el.color,
                  whiteSpace: 'nowrap', fontWeight: el.type === 'text' ? 700 : undefined,
                  zIndex: isSel ? 10 : undefined,
                }}
                  onMouseDown={e => onElementMouseDown(e, el.id)}
                  onClick={e => e.stopPropagation()}
                >
                  {el.content}
                  {isSel && (
                    <>
                      <div style={{ position: 'absolute', inset: -8, border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 6, pointerEvents: 'none' }} />
                      <div title="Drag to rotate" style={{
                        position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                        width: 14, height: 14, background: '#3b82f6', border: '2px solid #fff',
                        borderRadius: '50%', cursor: 'crosshair', zIndex: 20,
                      }} onMouseDown={e => { e.stopPropagation(); onRotateMouseDown(e, el.id) }} />
                      <div title="Drag to resize" style={{
                        position: 'absolute', bottom: -10, right: -10,
                        width: 14, height: 14, background: '#fff', border: '2px solid #3b82f6',
                        borderRadius: 3, cursor: 'se-resize', zIndex: 20,
                      }} onMouseDown={e => { e.stopPropagation(); onResizeMouseDown(e, el.id) }} />
                    </>
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">512px preview — exports at 1024×1024</p>
        </div>

        {/* Device previews */}
        <div className="flex gap-6">

          {/* iPhone */}
          <div className="flex flex-col items-center gap-2">
            <div
              onClick={() => setZoomDevice('iphone')}
              title="Click for closer look"
              style={{
                width: 170, height: 340, background: '#1c1c1e', borderRadius: 40,
                border: '2px solid #3a3a3c', padding: '10px 8px 12px',
                display: 'flex', flexDirection: 'column', gap: 5,
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)', cursor: 'zoom-in',
              }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                <div style={{ width: 64, height: 10, background: '#000', borderRadius: 999 }} />
              </div>
              {[0,4,8,12].map(start => (
                <div key={start} style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                  {IPHONE_ICONS.slice(start, start + 4).map((icon, i) => {
                    const isYours = start === 0 && i === 0
                    return (
                      <div key={i} style={{ width: 30, height: 30, borderRadius: 7, overflow: 'hidden', flexShrink: 0 }}>
                        {isYours
                          ? <canvas ref={iphoneRef} width={60} height={60} style={{ width: 30, height: 30, display: 'block' }} />
                          : <AppIconCell bg={icon.bg} e={icon.e} size={30} radius={7} />
                        }
                      </div>
                    )
                  })}
                </div>
              ))}
              <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '6px 8px', display: 'flex', gap: 6, justifyContent: 'center' }}>
                {IPHONE_DOCK.map((icon, i) => (
                  <AppIconCell key={i} bg={icon.bg} e={icon.e} size={28} radius={7} />
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-500">iPhone · click to zoom</span>
          </div>

          {/* Android */}
          <div className="flex flex-col items-center gap-2">
            <div
              onClick={() => setZoomDevice('android')}
              title="Click for closer look"
              style={{
                width: 170, height: 340, background: '#121212', borderRadius: 32,
                border: '2px solid #2a2a2a', padding: '10px 8px 12px',
                display: 'flex', flexDirection: 'column', gap: 5,
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)', cursor: 'zoom-in',
              }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                <div style={{ width: 10, height: 10, background: '#111', borderRadius: '50%', border: '1px solid #222' }} />
              </div>
              {[0,4,8,12].map(start => (
                <div key={start} style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                  {ANDROID_ICONS.slice(start, start + 4).map((icon, i) => {
                    const isYours = start === 0 && i === 0
                    return (
                      <div key={i} style={{ width: 30, height: 30, borderRadius: 15, overflow: 'hidden', flexShrink: 0 }}>
                        {isYours
                          ? <canvas ref={androidRef} width={57} height={57} style={{ width: 30, height: 30, display: 'block' }} />
                          : <AppIconCell bg={icon.bg} e={icon.e} size={30} radius={15} />
                        }
                      </div>
                    )
                  })}
                </div>
              ))}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: 6 }}>
                {ANDROID_DOCK.map((icon, i) => (
                  <AppIconCell key={i} bg={icon.bg} e={icon.e} size={28} radius={14} />
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-500">Android · click to zoom</span>
          </div>
        </div>
      </div>

      {/* Zoom modal */}
      {zoomDevice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setZoomDevice(null)}
        >
          <div onClick={e => e.stopPropagation()} style={{ padding: 32 }}>
            {zoomDevice === 'iphone' ? (
              <div style={{
                width: 320, height: 640, background: '#1c1c1e', borderRadius: 72,
                border: '3px solid #3a3a3c', padding: '18px 14px 22px',
                display: 'flex', flexDirection: 'column', gap: 9,
                boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                  <div style={{ width: 110, height: 18, background: '#000', borderRadius: 999 }} />
                </div>
                {[0,4,8,12].map(start => (
                  <div key={start} style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    {IPHONE_ICONS.slice(start, start + 4).map((icon, i) => {
                      const isYours = start === 0 && i === 0
                      return (
                        <div key={i} style={{ width: 56, height: 56, borderRadius: 13, overflow: 'hidden', flexShrink: 0 }}>
                          {isYours
                            ? <div style={{ width: 56, height: 56, borderRadius: 13, overflow: 'hidden', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {elements.length > 0
                                  ? <img src={renderIcon(elements, bgColor, 112).toDataURL()} style={{ width: 56, height: 56, borderRadius: 13 }} />
                                  : <div style={{ width: 56, height: 56, background: bgColor, borderRadius: 13 }} />
                                }
                              </div>
                            : <AppIconCell bg={icon.bg} e={icon.e} size={56} radius={13} />
                          }
                        </div>
                      )
                    })}
                  </div>
                ))}
                <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.08)', borderRadius: 28, padding: '10px 14px', display: 'flex', gap: 10, justifyContent: 'center' }}>
                  {IPHONE_DOCK.map((icon, i) => <AppIconCell key={i} bg={icon.bg} e={icon.e} size={52} radius={13} />)}
                </div>
              </div>
            ) : (
              <div style={{
                width: 320, height: 640, background: '#121212', borderRadius: 56,
                border: '3px solid #2a2a2a', padding: '18px 14px 22px',
                display: 'flex', flexDirection: 'column', gap: 9,
                boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                  <div style={{ width: 18, height: 18, background: '#111', borderRadius: '50%', border: '2px solid #1e1e1e' }} />
                </div>
                {[0,4,8,12].map(start => (
                  <div key={start} style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    {ANDROID_ICONS.slice(start, start + 4).map((icon, i) => {
                      const isYours = start === 0 && i === 0
                      return (
                        <div key={i} style={{ width: 56, height: 56, borderRadius: 28, overflow: 'hidden', flexShrink: 0 }}>
                          {isYours
                            ? <div style={{ width: 56, height: 56, borderRadius: 28, overflow: 'hidden', background: bgColor }}>
                                {elements.length > 0
                                  ? <img src={renderIcon(elements, bgColor, 112).toDataURL()} style={{ width: 56, height: 56, borderRadius: 28 }} />
                                  : <div style={{ width: 56, height: 56, background: bgColor }} />
                                }
                              </div>
                            : <AppIconCell bg={icon.bg} e={icon.e} size={56} radius={28} />
                          }
                        </div>
                      )
                    })}
                  </div>
                ))}
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: 10 }}>
                  {ANDROID_DOCK.map((icon, i) => <AppIconCell key={i} bg={icon.bg} e={icon.e} size={52} radius={26} />)}
                </div>
              </div>
            )}
            <p className="text-center text-xs text-gray-500 mt-4">Click anywhere to close</p>
          </div>
        </div>
      )}

    </div>
  )
}
