import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import mermaid from 'mermaid';
import { Hexagon, ArrowLeft, Menu, X } from 'lucide-react';
import { WHITEPAPER_MARKDOWN } from '../constants/whitepaperContent';

interface WhitepaperProps {
  onClose: () => void;
}

// Mermaid Renderer Component
const MermaidDiagram = ({ code }: { code: string }) => {
  const [svg, setSvg] = useState<string>('');
  const id = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`).current;

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: '"Space Grotesk", sans-serif',
    });

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render(id, code);
        setSvg(svg);
      } catch (error) {
        console.error('Mermaid render error:', error);
        setSvg('<div class="text-red-500 text-xs p-2">Diagram Error</div>');
      }
    };

    renderDiagram();
  }, [code, id]);

  return (
    <div 
        className="mermaid-container flex justify-center bg-[#0d1117] p-4 rounded-lg border border-gray-800 my-6 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
};

export const Whitepaper: React.FC<WhitepaperProps> = ({ onClose }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auto-generate TOC from Markdown
  const headings = WHITEPAPER_MARKDOWN.match(/^##\s+(.+)$/gm)?.map(h => ({
    text: h.replace(/^##\s+/, ''),
    id: h.replace(/^##\s+/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  })) || [];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#030712] flex font-sans text-gray-300">
      
      {/* Sidebar Navigation (Desktop) */}
      <div className="hidden md:flex w-72 flex-shrink-0 bg-[#0d1117] border-r border-gray-800 flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
           <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onClose}>
             <Hexagon className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
             <span className="font-bold text-white tracking-tight">Sentia Docs</span>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
           <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">Table of Contents</div>
           {headings.map((h, i) => (
             <button 
               key={i}
               onClick={() => scrollToSection(h.id)}
               className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#161b22] rounded transition-colors truncate"
             >
               {h.text}
             </button>
           ))}
        </div>

        <div className="p-4 border-t border-gray-800">
           <button onClick={onClose} className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors w-full justify-center py-2 hover:bg-[#161b22] rounded">
              <ArrowLeft className="w-3 h-3" /> Back to App
           </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0d1117] border-b border-gray-800 flex items-center justify-between px-4 z-50">
           <span className="font-bold text-white flex items-center gap-2">
             <Hexagon className="w-5 h-5 text-indigo-500" /> Docs
           </span>
           <div className="flex items-center gap-2">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-400 hover:text-white">
                 {isSidebarOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5" />}
              </button>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
                 <ArrowLeft className="w-5 h-5" />
              </button>
           </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm pt-14">
           <div className="w-64 h-full bg-[#0d1117] border-r border-gray-800 p-4 space-y-1">
             {headings.map((h, i) => (
               <button 
                 key={i}
                 onClick={() => scrollToSection(h.id)}
                 className="w-full text-left px-3 py-3 text-sm text-gray-300 border-b border-gray-800/50"
               >
                 {h.text}
               </button>
             ))}
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative pt-14 md:pt-0">
        <div className="flex-1 overflow-y-auto bg-[#030712] custom-scrollbar">
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
            
            <div className="prose prose-invert max-w-none">
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeSlug]}
                    components={{
                        code({node, inline, className, children, ...props}: any) {
                            const match = /language-(\w+)/.exec(className || '')
                            const codeContent = String(children).replace(/\n$/, '')
                            
                            if (!inline && match && match[1] === 'mermaid') {
                                return <MermaidDiagram code={codeContent} />;
                            }
                            
                            return !inline && match ? (
                            <div className="rounded-lg overflow-hidden border border-gray-800 my-4">
                                <div className="bg-[#161b22] px-3 py-1 text-xs text-gray-500 border-b border-gray-800 font-mono">
                                    {match[1]}
                                </div>
                                <pre className="!bg-[#0d1117] !m-0 !p-4 overflow-x-auto">
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                            ) : (
                            <code className={`${className} bg-gray-800/50 px-1 py-0.5 rounded text-indigo-300`} {...props}>
                                {children}
                            </code>
                            )
                        }
                    }}
                >
                    {WHITEPAPER_MARKDOWN}
                </ReactMarkdown>
            </div>

            <div className="mt-20 pt-10 border-t border-gray-800 flex justify-between text-sm text-gray-500">
               <div>Sentia Whitepaper v1.0</div>
               <div>© 2024 Amadeus Genesis</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
