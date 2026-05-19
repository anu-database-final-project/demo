import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

interface MermaidProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: svgCode } = await mermaid.render(id, chart);
        setSvg(svgCode);
      } catch (err) {
        console.error("Mermaid parsing error:", err);
      }
    };
    renderDiagram();
  }, [chart]);

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center w-full" 
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}
