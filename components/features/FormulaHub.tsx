'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Upload, Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlockMath } from 'react-katex';
import { Badge } from '@/components/ui/badge';
import { FileUploader } from '@/components/features/FileUploader';
import { useStore } from '@/lib/store';

// Built-in aerospace formulas
const BUILT_IN_FORMULAS = [
  {
    topic: 'Aerodynamics',
    formulas: [
      { id: 'lift', name: 'Lift Equation', latex: 'L = \\frac{1}{2} \\rho V^2 S C_L', variables: 'ρ = air density, V = velocity, S = wing area, C_L = lift coefficient' },
      { id: 'drag', name: 'Drag Equation', latex: 'D = \\frac{1}{2} \\rho V^2 S C_D', variables: 'ρ = air density, V = velocity, S = reference area, C_D = drag coefficient' },
      { id: 'reynolds', name: 'Reynolds Number', latex: 'Re = \\frac{\\rho V L}{\\mu} = \\frac{VL}{\\nu}', variables: 'ρ = density, V = velocity, L = length, μ = dynamic viscosity, ν = kinematic viscosity' },
      { id: 'mach', name: 'Mach Number', latex: 'M = \\frac{V}{a} = \\frac{V}{\\sqrt{\\gamma R T}}', variables: 'V = flow velocity, a = speed of sound, γ = ratio of specific heats, R = gas constant, T = temperature' },
      { id: 'bernoulli', name: "Bernoulli's Equation", latex: 'p + \\frac{1}{2}\\rho V^2 + \\rho g h = \\text{const}', variables: 'p = pressure, ρ = density, V = velocity, g = gravity, h = height' },
    ],
  },
  {
    topic: 'Orbital Mechanics',
    formulas: [
      { id: 'orbital-vel', name: 'Orbital Velocity', latex: 'v = \\sqrt{\\frac{\\mu}{r}}', variables: 'μ = gravitational parameter (GM), r = orbital radius' },
      { id: 'orbital-period', name: 'Orbital Period', latex: 'T = 2\\pi\\sqrt{\\frac{a^3}{\\mu}}', variables: 'a = semi-major axis, μ = GM' },
      { id: 'vis-viva', name: 'Vis-Viva Equation', latex: 'v^2 = \\mu\\left(\\frac{2}{r} - \\frac{1}{a}\\right)', variables: 'v = velocity, μ = GM, r = current radius, a = semi-major axis' },
      { id: 'delta-v', name: 'Hohmann Transfer Δv', latex: '\\Delta v = \\sqrt{\\frac{\\mu}{r_1}}\\left(\\sqrt{\\frac{2r_2}{r_1+r_2}} - 1\\right)', variables: 'r₁ = initial orbit radius, r₂ = target orbit radius' },
      { id: 'escape-vel', name: 'Escape Velocity', latex: 'v_e = \\sqrt{\\frac{2\\mu}{r}} = \\sqrt{2}\\cdot v_{circ}', variables: 'μ = GM, r = distance from center' },
    ],
  },
  {
    topic: 'Propulsion',
    formulas: [
      { id: 'thrust', name: 'Rocket Thrust', latex: 'F = \\dot{m} V_e + (p_e - p_0)A_e', variables: 'ṁ = mass flow rate, Vₑ = exhaust velocity, pₑ = exit pressure, p₀ = ambient pressure, Aₑ = exit area' },
      { id: 'isp', name: 'Specific Impulse', latex: 'I_{sp} = \\frac{V_e}{g_0} = \\frac{F}{\\dot{m}\\,g_0}', variables: 'Vₑ = effective exhaust velocity, g₀ = standard gravity (9.81 m/s²)' },
      { id: 'tsiolkovsky', name: 'Tsiolkovsky Rocket Equation', latex: '\\Delta v = V_e \\ln\\left(\\frac{m_0}{m_f}\\right) = I_{sp}\\,g_0\\ln\\left(\\frac{m_0}{m_f}\\right)', variables: 'm₀ = initial mass, mf = final mass' },
      { id: 'thrust-coeff', name: 'Thrust Coefficient', latex: 'C_F = \\frac{F}{p_c A_t}', variables: 'F = thrust, pₓ = chamber pressure, At = throat area' },
    ],
  },
  {
    topic: 'Thermodynamics',
    formulas: [
      { id: 'isentropic-T', name: 'Isentropic Temperature Ratio', latex: '\\frac{T_2}{T_1} = \\left(\\frac{p_2}{p_1}\\right)^{\\frac{\\gamma-1}{\\gamma}}', variables: 'T = temperature, p = pressure, γ = ratio of specific heats' },
      { id: 'isentropic-p', name: 'Isentropic Pressure Ratio', latex: '\\frac{p_2}{p_1} = \\left(\\frac{\\rho_2}{\\rho_1}\\right)^\\gamma = \\left(\\frac{T_2}{T_1}\\right)^{\\frac{\\gamma}{\\gamma-1}}', variables: 'p = pressure, ρ = density, T = temperature, γ = Cp/Cv' },
      { id: 'ideal-gas', name: 'Ideal Gas Law', latex: 'p = \\rho R T', variables: 'p = pressure (Pa), ρ = density (kg/m³), R = specific gas constant (J/kg·K), T = temperature (K)' },
      { id: 'stagnation-T', name: 'Stagnation Temperature', latex: 'T_0 = T\\left(1 + \\frac{\\gamma-1}{2}M^2\\right)', variables: 'T₀ = stagnation (total) temperature, T = static temperature, M = Mach number' },
    ],
  },
  {
    topic: 'Structures',
    formulas: [
      { id: 'stress', name: "Hooke's Law (Uniaxial)", latex: '\\sigma = E \\varepsilon', variables: 'σ = stress (Pa), E = Young\'s modulus (Pa), ε = strain (dimensionless)' },
      { id: 'bending', name: 'Bending Stress', latex: '\\sigma = \\frac{M y}{I}', variables: 'M = bending moment, y = distance from neutral axis, I = area moment of inertia' },
      { id: 'torsion', name: 'Torsional Shear Stress', latex: '\\tau = \\frac{T r}{J}', variables: 'T = torque, r = radius, J = polar moment of inertia' },
      { id: 'buckling', name: "Euler's Buckling Load", latex: 'P_{cr} = \\frac{\\pi^2 E I}{(KL)^2}', variables: 'E = Young\'s modulus, I = moment of inertia, K = effective length factor, L = column length' },
    ],
  },
];

export function FormulaHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const { uploadedFiles, formulaHub } = useStore();

  const allFormulas = [...BUILT_IN_FORMULAS, ...formulaHub];

  const displayedFormulas = allFormulas
    .map((group) => ({
      ...group,
      formulas: group.formulas.filter(
        (f) =>
          (!searchQuery ||
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.variables?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.latex.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (!activeTopic || group.topic === activeTopic)
      ),
    }))
    .filter((group) => group.formulas.length > 0);

  const handleExtractFromFiles = async () => {
    if (uploadedFiles.length === 0) return;
    setExtracting(true);

    const combinedText = uploadedFiles
      .map((f) => `=== ${f.name} ===\n${f.text}`)
      .join('\n\n')
      .slice(0, 8000);

    try {
      const response = await fetch('/api/formulas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfText: combinedText }),
      });
      const data = await response.json();
      alert('Formulas extracted! Check the "From Documents" section below.');
    } catch {
      alert('Failed to extract formulas');
    } finally {
      setExtracting(false);
    }
  };

  const allTopics = allFormulas.map((g) => g.topic);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search & controls */}
      <div style={{ background: '#111111', border: '1px solid #1F1F1F', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#888888' }} />
            <input
              type="text"
              placeholder="Search formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '36px',
                paddingRight: '16px',
                paddingTop: '10px',
                paddingBottom: '10px',
                fontSize: '14px',
                background: '#0A0A0A',
                border: '1px solid #1F1F1F',
                color: '#FFFFFF',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4ADE80')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#1F1F1F')}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888888', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowUploader(!showUploader)}
            style={{
              flexShrink: 0,
              border: '1px solid #1F1F1F',
              background: 'transparent',
              color: '#888888',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#4ADE80'; (e.currentTarget as HTMLElement).style.color = '#4ADE80'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1F1F1F'; (e.currentTarget as HTMLElement).style.color = '#888888'; }}
          >
            <Upload style={{ width: '14px', height: '14px' }} />
            Extract from PDF
          </button>
        </div>

        {/* Topic filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <button
            onClick={() => setActiveTopic(null)}
            style={{
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: !activeTopic ? '1px solid #4ADE80' : '1px solid #1F1F1F',
              background: !activeTopic ? '#4ADE80' : 'transparent',
              color: !activeTopic ? '#0A0A0A' : '#888888',
              letterSpacing: '0.04em',
              transition: 'all 0.15s',
            }}
          >
            All
          </button>
          {allTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}
              style={{
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: activeTopic === topic ? '1px solid #4ADE80' : '1px solid #1F1F1F',
                background: activeTopic === topic ? '#4ADE80' : 'transparent',
                color: activeTopic === topic ? '#0A0A0A' : '#888888',
                letterSpacing: '0.04em',
                transition: 'all 0.15s',
              }}
            >
              {topic}
            </button>
          ))}
        </div>

        {showUploader && (
          <div style={{ border: '1px solid #1F1F1F', padding: '16px', background: '#0A0A0A', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <FileUploader compact />
            {uploadedFiles.length > 0 && (
              <button
                onClick={handleExtractFromFiles}
                disabled={extracting}
                style={{
                  width: '100%',
                  background: extracting ? '#1F1F1F' : '#4ADE80',
                  color: extracting ? '#888888' : '#0A0A0A',
                  padding: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: extracting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {extracting ? (
                  <><Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />Extracting...</>
                ) : (
                  <><Plus style={{ width: '14px', height: '14px' }} />Extract Formulas from {uploadedFiles.length} File(s)</>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Formula groups */}
      {displayedFormulas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#888888' }}>
          <BookOpen style={{ width: '40px', height: '40px', margin: '0 auto 12px', opacity: 0.3 }} />
          <p style={{ fontSize: '15px' }}>No formulas found for &ldquo;{searchQuery}&rdquo;</p>
        </div>
      ) : (
        displayedFormulas.map((group) => (
          <motion.div
            key={group.topic}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: '#111111', border: '1px solid #1F1F1F', overflow: 'hidden' }}
          >
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #1F1F1F', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em' }}>{group.topic}</h3>
              <span style={{ color: '#888888', fontSize: '12px' }}>{group.formulas.length} formulas</span>
            </div>
            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {group.formulas.map((formula) => (
                <div
                  key={formula.id}
                  style={{
                    padding: '16px',
                    background: '#0A0A0A',
                    border: '1px solid #1F1F1F',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#4ADE80')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1F1F1F')}
                >
                  <h4 style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '13px', marginBottom: '12px', letterSpacing: '-0.01em' }}>
                    {formula.name}
                  </h4>
                  <div style={{ overflowX: 'auto', paddingTop: '8px', paddingBottom: '8px', textAlign: 'center' }}>
                    <BlockMath math={formula.latex} />
                  </div>
                  {formula.variables && (
                    <p style={{ color: '#888888', fontSize: '12px', marginTop: '8px', lineHeight: 1.6 }}>
                      <span style={{ color: '#CCCCCC', fontWeight: 500 }}>Where: </span>
                      {formula.variables}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
