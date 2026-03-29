export default function Particles() {
  const emojis = ['🍅', '🌿', '🍕', '🍜', '🍔', '🌶️']
  return (
    <div className="particles">
      {emojis.map((e, i) => <span key={i}>{e}</span>)}
    </div>
  )
}
