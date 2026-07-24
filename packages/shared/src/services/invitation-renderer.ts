function resolveFont(font: string): string {
  const systemFallback = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  const safeFonts: Record<string, string> = {
    'Inter': 'Inter, system-ui, sans-serif',
    'Poppins': 'Poppins, system-ui, sans-serif',
    'Playfair Display': '"Playfair Display", Georgia, serif',
    'Nunito': 'Nunito, system-ui, sans-serif',
    'Quicksand': 'Quicksand, system-ui, sans-serif',
    'Georgia': 'Georgia, serif',
    'Lora': 'Lora, Georgia, serif',
    'Cinzel': 'Cinzel, Georgia, serif',
    'Great Vibes': '"Great Vibes", cursive',
    'Dancing Script': '"Dancing Script", cursive',
  }
  return safeFonts[font] || systemFallback
}

async function loadFont(font: string): Promise<void> {
  const fontFamily = font
  const fonts = [
    { family: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
    { family: 'Poppins', url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap' },
    { family: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap' },
    { family: 'Nunito', url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap' },
    { family: 'Quicksand', url: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap' },
    { family: 'Lora', url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap' },
    { family: 'Cinzel', url: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap' },
    { family: 'Great Vibes', url: 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap' },
    { family: 'Dancing Script', url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap' },
  ]

  const found = fonts.find(f => f.family === fontFamily)
  if (!found) return

  try {
    if (document.fonts?.check?.(`16px "${fontFamily}"`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = found.url
    document.head.appendChild(link)
    await document.fonts.load(`16px "${fontFamily}"`)
  } catch {
  }
}

export async function preloadFonts(fonts: string[]): Promise<void> {
  await Promise.all(fonts.map(loadFont))
}

export interface RenderData {
  categoryId: string
  templateName: string
  formData: Record<string, string>
  customization: {
    primaryColor: string
    secondaryColor: string
    font: string
    alignment: 'left' | 'center' | 'right'
    backgroundVariant: number
  }
  background: string
  defaultText: Record<string, string>
}

export async function renderInvitationToCanvas(
  canvas: HTMLCanvasElement,
  data: RenderData,
): Promise<Blob> {
  const w = canvas.width
  const h = canvas.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  await loadFont(data.customization.font)

  ctx.clearRect(0, 0, w, h)

  const bgColors = data.background.match(/#[a-fA-F0-9]{6}/g) || ['#f8fafc', '#e2e8f0']
  const gradient = ctx.createLinearGradient(0, 0, w, h)
  gradient.addColorStop(0, bgColors[0] || '#f8fafc')
  gradient.addColorStop(0.5, bgColors[1] || bgColors[0] || '#e2e8f0')
  gradient.addColorStop(1, bgColors[2] || bgColors[bgColors.length - 1] || '#cbd5e1')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)

  const cardX = w * 0.06
  const cardY = h * 0.06
  const cardW = w * 0.88
  const cardH = h * 0.88
  const radius = 32

  ctx.save()
  roundRect(ctx, cardX, cardY, cardW, cardH, radius)
  ctx.fillStyle = data.secondaryColor + '12'
  ctx.fill()
  ctx.strokeStyle = data.primaryColor + '25'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.textAlign = data.alignment
  ctx.textBaseline = 'middle'
  const centerX = w / 2
  const alignX = data.alignment === 'center' ? centerX : data.alignment === 'left' ? cardX + 36 : cardX + cardW - 36

  const fontFamily = resolveFont(data.customization.font)
  const primaryColor = data.customization.primaryColor

  ctx.fillStyle = primaryColor
  ctx.font = `bold 34px ${fontFamily}`
  const title = data.defaultText?.title || 'DƏVƏT'
  ctx.fillText(title, alignX, cardY + 56)

  let yOffset = cardY + 110

  const isWedding = data.categoryId === 'wedding' || data.categoryId === 'engagement'

  if (isWedding && data.formData.brideName && data.formData.groomName) {
    ctx.fillStyle = primaryColor
    ctx.font = `bold 28px ${fontFamily}`
    ctx.fillText(`${data.formData.brideName} & ${data.formData.groomName}`, alignX, yOffset)
    yOffset += 52
  }

  if (data.formData.hostName && !isWedding) {
    ctx.fillStyle = primaryColor
    ctx.font = `600 26px ${fontFamily}`
    ctx.fillText(data.formData.hostName, alignX, yOffset)
    yOffset += 48
  }

  if (data.formData.eventTitle) {
    ctx.fillStyle = primaryColor
    ctx.font = `500 22px ${fontFamily}`
    ctx.fillText(data.formData.eventTitle, alignX, yOffset)
    yOffset += 42
  }

  yOffset = Math.max(yOffset, cardY + cardH * 0.38)

  ctx.strokeStyle = primaryColor + '30'
  ctx.lineWidth = 1
  ctx.beginPath()
  const lineX1 = cardX + 48
  const lineX2 = cardX + cardW - 48
  ctx.moveTo(lineX1, yOffset)
  ctx.lineTo(lineX2, yOffset)
  ctx.stroke()
  yOffset += 28

  const fields = [
    { label: 'Tarix', value: data.formData.date },
    { label: 'Saat', value: data.formData.time },
    { label: 'Məkan', value: data.formData.location },
    { label: 'Ünvan', value: data.formData.address },
    { label: 'Əlaqə', value: data.formData.phone },
    { label: 'Email', value: data.formData.email },
  ]

  for (const field of fields) {
    if (!field.value) continue
    ctx.fillStyle = primaryColor + 'cc'
    ctx.font = `600 15px ${fontFamily}`
    ctx.fillText(field.label, alignX, yOffset)
    yOffset += 20
    ctx.fillStyle = '#1f2937'
    ctx.font = `500 18px ${fontFamily}`
    ctx.fillText(field.value, alignX, yOffset)
    yOffset += 34
  }

  ctx.fillStyle = '#94a3b8'
  ctx.font = `400 12px ${fontFamily}`
  ctx.fillText('invitely.app', alignX, cardY + cardH - 20)
  ctx.restore()

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to create PNG blob'))
    }, 'image/png')
  })
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}
