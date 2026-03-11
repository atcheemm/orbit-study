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
    <div className="flex flex-col gap-5 max-w-4xl mx-auto">
      {/* Search & controls */}
      <div style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '16px' }} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#546E7A' }} />
            <input
              type="text"
              placeholder="Search formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm focus:outline-none"
              style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', color: '#37474F' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#1565C0')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#B0BEC5')}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#546E7A' }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUploader(!showUploader)}
            className="shrink-0 gap-1.5"
            style={{ borderColor: '#B0BEC5', color: '#1565C0' }}
          >
            <Upload className="w-3.5 h-3.5" />
            Extract from PDF
          </Button>
        </div>

        {/* Topic filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTopic(null)}
            className="px-3 py-1 text-xs font-medium transition-colors"
            style={{
              border: !activeTopic ? '1px solid #1565C0' : '1px solid #B0BEC5',
              background: !activeTopic ? '#1565C0' : '#FFFFFF',
              color: !activeTopic ? '#FFFFFF' : '#546E7A',
            }}
          >
            All
          </button>
          {allTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}
              className="px-3 py-1 text-xs font-medium transition-colors"
              style={{
                border: activeTopic === topic ? '1px solid #1565C0' : '1px solid #B0BEC5',
                background: activeTopic === topic ? '#1565C0' : '#FFFFFF',
                color: activeTopic === topic ? '#FFFFFF' : '#546E7A',
              }}
            >
              {topic}
            </button>
          ))}
        </div>

        {showUploader && (
          <div style={{ border: '1px solid #B0BEC5', padding: '16px' }} className="space-y-3">
            <FileUploader compact />
            {uploadedFiles.length > 0 && (
              <Button
                onClick={handleExtractFromFiles}
                disabled={extracting}
                size="sm"
                className="w-full"
                style={{ background: '#1565C0', color: '#FFFFFF' }}
              >
                {extracting ? (
                  <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />Extracting...</>
                ) : (
                  <><Plus className="w-3.5 h-3.5 mr-2" />Extract Formulas from {uploadedFiles.length} File(s)</>
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Formula groups */}
      {displayedFormulas.length === 0 ? (
        <div className="text-center py-12" style={{ color: '#546E7A' }}>
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No formulas found for &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        displayedFormulas.map((group) => (
          <motion.div
            key={group.topic}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}
          >
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #B0BEC5', background: '#F0F4F8' }}>
              <h3 className="font-semibold" style={{ color: '#0A1628' }}>{group.topic}</h3>
              <span className="text-xs" style={{ color: '#546E7A' }}>{group.formulas.length} formulas</span>
            </div>
            <div className="p-4 grid gap-3">
              {group.formulas.map((formula) => (
                <div
                  key={formula.id}
                  className="p-4 transition-colors"
                  style={{ background: '#FFFFFF', border: '1px solid #B0BEC5' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1565C0')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#B0BEC5')}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="font-medium text-sm" style={{ color: '#0A1628' }}>{formula.name}</h4>
                  </div>
                  <div className="overflow-x-auto py-2 text-center">
                    <BlockMath math={formula.latex} />
                  </div>
                  {formula.variables && (
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: '#546E7A' }}>
                      <span className="font-medium" style={{ color: '#37474F' }}>Where: </span>
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
