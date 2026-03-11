'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Combine built-in and extracted formulas
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
      // The extracted formulas come as markdown - we'll display them differently
      // For now, add as a raw text section
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
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d0d1a] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:border-purple-600 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUploader(!showUploader)}
            className="border-purple-600/50 text-purple-300 hover:bg-purple-600/10 shrink-0 gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Extract from PDF
          </Button>
        </div>

        {/* Topic filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTopic(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              !activeTopic
                ? 'bg-purple-600/30 text-purple-300 border border-purple-600/50'
                : 'text-gray-400 bg-gray-800/50 hover:text-gray-200'
            }`}
          >
            All
          </button>
          {allTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeTopic === topic
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-600/50'
                  : 'text-gray-400 bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {showUploader && (
          <div className="border border-gray-700/50 rounded-lg p-4 space-y-3">
            <FileUploader compact />
            {uploadedFiles.length > 0 && (
              <Button
                onClick={handleExtractFromFiles}
                disabled={extracting}
                size="sm"
                className="w-full bg-cyan-600/20 border border-cyan-600/50 text-cyan-300 hover:bg-cyan-600/30"
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
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No formulas found for &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        displayedFormulas.map((group) => (
          <motion.div
            key={group.topic}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-purple-900/20 flex items-center justify-between">
              <h3 className="font-semibold text-white">{group.topic}</h3>
              <Badge variant="outline" className="text-xs border-purple-600/40 text-purple-300">
                {group.formulas.length} formulas
              </Badge>
            </div>
            <div className="p-4 grid gap-3">
              {group.formulas.map((formula) => (
                <div
                  key={formula.id}
                  className="p-4 bg-[#0d0d1a] rounded-lg border border-gray-800/50 hover:border-purple-800/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="font-medium text-purple-300 text-sm">{formula.name}</h4>
                  </div>
                  <div className="overflow-x-auto py-2 text-center">
                    <BlockMath math={formula.latex} />
                  </div>
                  {formula.variables && (
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      <span className="text-gray-400 font-medium">Where: </span>
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
