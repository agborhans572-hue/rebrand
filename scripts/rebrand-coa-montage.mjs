import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

// Edit the original marketing montage, retaining the issued reports separately.
// Pale watermark ink is removed inside the reviewed branding polygons only.
export async function rebrandCoaMontage() {
  const source = await readFile('public/assets/coa-documents.png')
  const { data: original, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const cleaned = Buffer.from(original)
  const masks = [
    [[122,389],[234,382],[234,449],[139,461]],
    [[249,275],[472,275],[424,352],[249,352]],
    [[450,315],[854,423],[838,494],[427,404]],
  ]
  function inside(x,y,polygon) {
    let result = false
    for(let i=0,j=polygon.length-1;i<polygon.length;j=i++) {
      const [xi,yi]=polygon[i], [xj,yj]=polygon[j]
      if((yi>y)!==(yj>y) && x<(xj-xi)*(y-yi)/(yj-yi)+xi) result=!result
    }
    return result
  }
  for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
    const i=(y*info.width+x)*4
    const chartAxis = (x>=266 && x<=269 && y<353)
      || (Math.abs(x-430)<1.2 && y<353)
      || (Math.abs(x-(472-(y-302)*39/146))<1.1 && y>=302 && y<=448)
      || (Math.abs(x-(650-(y-353)*35/132))<1.1 && y>=353 && y<=485)
      || (Math.abs(x-(835-(y-395)*48/165))<1.2 && y>=395 && y<=560)
    if(!chartAxis && masks.some(p=>inside(x,y,p)) && Math.min(cleaned[i],cleaned[i+1],cleaned[i+2])>208) {
      for(let c=0;c<3;c++) cleaned[i+c]=inside(x,y,masks[0]) ? original[(470*info.width+x)*4+c] : 255
    }
  }
  const molecule=(await readFile('public/assets/molecule-static.svg','utf8')).match(/<g[\s\S]*<\/g>/)[0]
  const wordmark=(await readFile('public/assets/wordmark.svg','utf8')).match(/<g[\s\S]*<\/g>/)[0].replace('<g ', '<g fill="none" ')
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="998" height="723">
    <defs>
      <clipPath id="left"><path d="M0 0H234V723H0Z"/></clipPath>
      <clipPath id="center"><path d="M234 27H536L389 521H234Z"/></clipPath>
    </defs>
    <g clip-path="url(#left)" opacity=".075"><g transform="translate(143 395) rotate(-15 38 33) scale(1.2)">${molecule}</g></g>
    <g clip-path="url(#center)" opacity=".075">
      <g transform="translate(273 278) scale(1.2)">${molecule}</g>
      <g transform="translate(382 294) scale(1.1)">${wordmark}</g>
    </g>
    <g transform="translate(450 320) rotate(15)" opacity=".075">
      <g transform="translate(19 1) scale(1.25)">${molecule}</g>
      <g transform="translate(139 19) scale(1.42)">${wordmark}</g>
      <text x="155" y="69" font-family="Arial,sans-serif" font-size="15" letter-spacing="10" fill="#243167">PEPTIDES</text>
    </g>
  </svg>`
  const overlay=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer()
  for(let i=0;i<cleaned.length;i+=4) {
    // Keep chart ink above the watermark, as it is on the original papers.
    if(Math.min(original[i],original[i+1],original[i+2])<208) continue
    const alpha=overlay[i+3]/255
    for(let c=0;c<3;c++) cleaned[i+c]=Math.round(cleaned[i+c]*(1-alpha)+overlay[i+c]*alpha)
  }
  // Only the store's client name and URL are replaced; lab identity is untouched.
  const clientSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="998" height="723"><g transform="translate(732 268) rotate(15)"><rect x="-3" y="-2" width="125" height="25" fill="white"/><text y="7" font-family="Arial,sans-serif" font-size="5" font-weight="600">Peptalith</text><text y="17" font-family="Arial,sans-serif" font-size="5.1" fill="#69b5f3" text-decoration="underline">https://peptalith.com/</text></g></svg>`
  const client=await sharp(Buffer.from(clientSvg)).ensureAlpha().raw().toBuffer()
  for(let i=0;i<cleaned.length;i+=4) {
    const alpha=client[i+3]/255
    for(let c=0;c<3;c++) cleaned[i+c]=Math.round(cleaned[i+c]*(1-alpha)+client[i+c]*alpha)
    assert.equal(cleaned[i+3],original[i+3], 'Original transparency is preserved')
  }
  const approved = [[122,382,234,470],[249,275,474,353],[427,315,854,494],[725,264,854,323]]
  let changed = 0
  for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
    const i=(y*info.width+x)*4
    if(!cleaned.subarray(i,i+4).equals(original.subarray(i,i+4))) {
      assert.ok(approved.some(([l,t,r,b])=>x>=l && x<=r && y>=t && y<=b), `Unexpected edit outside branding at ${x},${y}`)
      changed++
    }
  }
  await sharp(cleaned,{raw:info}).png().toFile('public/assets/peptalith-coa-montage.png')
  await mkdir('artifacts', {recursive:true})
  await writeFile('artifacts/coa-montage-pixel-check.json', JSON.stringify({width:info.width,height:info.height,changedPixels:changed,unchangedPercent:100*(1-changed/(info.width*info.height)),outsideBrandingChangedPixels:0,alphaChangedPixels:0},null,2))
  console.log(`Rebranded original COA montage: ${changed} branding pixels changed; all other pixels and transparency preserved.`)
}
