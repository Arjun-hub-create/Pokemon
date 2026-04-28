import React, { useEffect, useState } from 'react'

function FloatingParticles() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Generate 3 floating particles with random positions
    const newParticles = [
      {
        id: 1,
        top: `${Math.random() * 40}%`,
        left: `${Math.random() * 40}%`,
        className: 'floating-particle floating-particle-1',
      },
      {
        id: 2,
        top: `${Math.random() * 60 + 20}%`,
        left: `${Math.random() * 60 + 40}%`,
        className: 'floating-particle floating-particle-2',
      },
      {
        id: 3,
        top: `${Math.random() * 50}%`,
        left: `${Math.random() * 30 + 65}%`,
        className: 'floating-particle floating-particle-3',
      },
    ]
    setParticles(newParticles)
  }, [])

  return (
    <>
      {particles.map(particle => (
        <div
          key={particle.id}
          className={particle.className}
          style={{
            top: particle.top,
            left: particle.left,
          }}
        />
      ))}
    </>
  )
}

export default FloatingParticles
