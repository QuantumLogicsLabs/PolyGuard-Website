import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ExternalLink, Shield, Zap, Brain, Code2, ChevronRight } from "lucide-react";

const LINKS = [
  { label: "GitHub Repo",   sub: "QuantumLogicsLabs/PolyGuard",     dot: "#aaa",          url: "https://github.com/QuantumLogicsLabs/PolyGuard" },
  { label: "HF Model",      sub: "MUHAMMADSAADAMIN/polyguard-model", dot: "var(--purple)", url: "https://huggingface.co/MUHAMMADSAADAMIN/polyguard-model" },
  { label: "HF Spaces API", sub: "polyguard-api · LIVE",             dot: "var(--orange)", url: "https://huggingface.co/spaces/MUHAMMADSAADAMIN/polyguard-api" },
  { label: "Google Drive",  sub: "Dataset & Model Weights",          dot: "var(--green)",  url: "https://drive.google.com/drive/folders/1GLYwUq0kIhaX1s5MeCYJO_2YXClMZ7bV" },
];

const FEATURES = [
  { icon: Shield, color: "var(--cyan)",   title: "Vulnerability Detection",      desc: "SQL injection, XSS, buffer overflows, hardcoded secrets — 50+ patterns detected across 8 languages. Every scan maps to a real CVE class." },
  { icon: Brain,  color: "var(--green)",  title: "ML-Powered Confidence Scores", desc: "Fine-tuned CodeBERT outputs separate clean/vuln confidence percentages — not just a binary verdict. You see exactly how certain the model is." },
  { icon: Zap,    color: "var(--amber)",  title: "Sub-500ms Analysis",           desc: "Results in milliseconds via our 24/7 HuggingFace Spaces endpoint. No signup, no API key, no rate limits. Paste and scan." },
  { icon: Code2,  color: "var(--purple)", title: "8-Language Support",           desc: "Python, JavaScript, Java, C, C++, PHP, Ruby, Go — each with language-aware vulnerability patterns tailored to its specific attack surface." },
];

const STATS = [
  { val: 50,  suf: "+",  label: "VULNERABILITY PATTERNS" },
  { val: 8,   suf: "",   label: "LANGUAGES SUPPORTED" },
  { val: 99,  suf: "%",  label: "API UPTIME" },
  { val: 500, suf: "ms", label: "AVG RESPONSE TIME" },
];

function HexGrid() {
  return (
    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.038 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <polygon points="15,2 45,2 58,26 45,50 15,50 2,26" fill="none" stroke="#00e5ff" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
    </svg>
  );
}

const WORDS = ["DETECT.", "PROTECT.", "ANALYZE.", "SECURE."];

function TypedText() {
  const [wi]                    = useState(0);
  const [chars, setChars]       = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = WORDS[wi];
    let delay;
    if (!deleting && chars < word.length)        delay = setTimeout(() => setChars(c => c + 1), 65);
    else if (!deleting && chars === word.length) delay = setTimeout(() => setDeleting(true), 2200);
    else if (deleting && chars > 0)              delay = setTimeout(() => setChars(c => c - 1), 38);
    else                                          delay = setTimeout(() => setDeleting(false), 2200);
    return () => clearTimeout(delay);
  }, [chars, deleting, wi]);
  return (
    <span style={{ color: "var(--cyan)" }}>
      {WORDS[wi].slice(0, chars)}<span className="blink">▋</span>
    </span>
  );
}

function StatNum({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let cur = 0; const step = to / 40;
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) { setVal(to); clearInterval(t); } else setVal(Math.floor(cur));
    }, 28);
    return () => clearInterval(t);
  }, [to]);
  return <>{val}{suffix}</>;
}

export default function Home() {
  const navigate = useNavigate();
  const mouseX = useMotionValue(0), mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness:55, damping:22 });
  const springY = useSpring(mouseY, { stiffness:55, damping:22 });
  const heroRef = useRef(null);
  const handleMouse = useCallback((e) => {
    const r = heroRef.current?.getBoundingClientRect(); if (!r) return;
    mouseX.set((e.clientX - r.left - r.width/2) / 28);
    mouseY.set((e.clientY - r.top - r.height/2) / 28);
  }, [mouseX, mouseY]);
  const glowX = useTransform(springX, v => `${50+v}%`);
  const glowY = useTransform(springY, v => `${40+v}%`);

  return (
    <div className="page">
      {/* ════ HERO ════ */}
      <section ref={heroRef} onMouseMove={handleMouse} style={{ minHeight:"calc(100vh - 66px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"5rem 2rem", position:"relative", overflow:"hidden", textAlign:"center" }}>
        <HexGrid />
        <motion.div style={{ position:"absolute", left:glowX, top:glowY, width:900, height:900, background:"radial-gradient(circle, rgba(0,229,255,0.055) 0%, transparent 60%)", transform:"translate(-50%,-50%)", pointerEvents:"none" }} />
        {[0,1].map(i => <div key={i} style={{ position:"absolute", [i===0?"left":"right"]:"7%", top:"20%", bottom:"20%", width:1, background:"linear-gradient(to bottom, transparent, rgba(0,229,255,0.12), transparent)" }} />)}
        {[{top:"28px",left:"28px",bt:"border-top",bs:"border-left"},{top:"28px",right:"28px",bt:"border-top",bs:"border-right"},{bottom:"28px",left:"28px",bt:"border-bottom",bs:"border-left"},{bottom:"28px",right:"28px",bt:"border-bottom",bs:"border-right"}].map((pos,i) => (
          <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5+i*0.1}} style={{ position:"absolute", width:28, height:28, ...Object.fromEntries(Object.entries(pos).filter(([k])=>!["bt","bs"].includes(k))), [pos.bt]:"1px solid rgba(0,229,255,0.32)", [pos.bs]:"1px solid rgba(0,229,255,0.32)" }} />
        ))}

        <div style={{ position:"relative", maxWidth:960, width:"100%" }}>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.6}} className="pill pill--cyan" style={{marginBottom:"2.5rem"}}>
            <span className="dot dot--sm" style={{background:"var(--cyan)",boxShadow:"0 0 10px var(--cyan)"}} />
            ML-POWERED · CODEBERT · REAL-TIME ANALYSIS
            <span className="dot dot--sm" style={{background:"var(--cyan)",boxShadow:"0 0 10px var(--cyan)"}} />
          </motion.div>

          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.38,duration:0.7,ease:[0.16,1,0.3,1]}} style={{fontFamily:"var(--display)",fontWeight:800,fontSize:"clamp(3.4rem,10vw,7.5rem)",lineHeight:0.88,letterSpacing:"-0.045em",marginBottom:"1.75rem"}}>
            <span style={{display:"block",color:"var(--text)"}}>SCAN.</span>
            <span style={{display:"block"}}><TypedText /></span>
            <span style={{display:"block",color:"var(--text2)"}}>SHIP SAFE.</span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.52,duration:0.6}} style={{fontSize:17,color:"var(--text2)",lineHeight:1.8,maxWidth:580,margin:"0 auto 3rem",fontWeight:300}}>
            PolyGuard uses a fine-tuned CodeBERT model to detect vulnerabilities in your code — SQL injection, XSS, buffer overflows, hardcoded secrets and 50+ more patterns — and returns actionable security intelligence instantly.
          </motion.p>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.66,duration:0.6}} className="flex-center" style={{gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <motion.button onClick={() => navigate("/developers/docs/analyzer")} whileHover={{scale:1.03,boxShadow:"0 0 40px rgba(0,229,255,0.35)"}} whileTap={{scale:0.97}} className="btn-primary btn-primary--lg">
              <Zap size={14} /> ANALYZE CODE <ArrowRight size={14} />
            </motion.button>
            <motion.button onClick={() => navigate("/developers/docs/architecture")} whileHover={{scale:1.03}} whileTap={{scale:0.97}} className="btn-ghost">
              HOW IT WORKS <ChevronRight size={14} />
            </motion.button>
          </motion.div>
        </div>

        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.3}} style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)"}}>
          <div className="flex-col" style={{alignItems:"center",gap:4}}>
            <div className="float" style={{width:1,height:40,background:"linear-gradient(to bottom, rgba(0,229,255,0.5), transparent)"}} />
            <span className="meta-text" style={{letterSpacing:"0.24em"}}>SCROLL</span>
          </div>
        </motion.div>
      </section>

      {/* ════ STATS BAR ════ */}
      <motion.section initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} style={{borderTop:"1px solid rgba(0,229,255,0.07)",borderBottom:"1px solid rgba(0,229,255,0.07)",background:"rgba(0,229,255,0.02)",padding:"2rem",display:"flex",justifyContent:"center",gap:"clamp(2rem,6vw,7rem)",flexWrap:"wrap"}}>
        {STATS.map((s,i) => (
          <motion.div key={i} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}} style={{textAlign:"center"}}>
            <div style={{fontFamily:"var(--mono)",fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:700,color:"var(--cyan)",lineHeight:1}}><StatNum to={s.val} suffix={s.suf} /></div>
            <div className="meta-text" style={{marginTop:7}}>{s.label}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* ════ FEATURES ════ */}
      <section style={{padding:"6rem 2rem",maxWidth:1100,margin:"0 auto"}}>
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          <div className="label mb-label">// CAPABILITIES</div>
          <h2 style={{fontFamily:"var(--display)",fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:800,letterSpacing:"-0.03em",marginBottom:"3.5rem"}}>
            Everything you need to<br /><span style={{color:"var(--cyan)"}}>ship secure code.</span>
          </h2>
        </motion.div>
        <div className="grid-auto">
          {FEATURES.map((f,i) => (
            <motion.div key={i} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1,duration:0.5}} whileHover={{y:-5,borderColor:`${f.color}28`,boxShadow:"0 20px 40px rgba(0,0,0,0.4)"}} className="feature-card">
              <div className="feature-card__icon-wrap" style={{background:`${f.color}12`,border:`1px solid ${f.color}22`}}>
                <f.icon size={22} color={f.color} strokeWidth={1.5} />
              </div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════ API PREVIEW + LINKS ════ */}
      <section style={{padding:"0 2rem 6rem",maxWidth:1100,margin:"0 auto"}}>
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{marginBottom:"2rem"}}>
          <div className="label mb-label">// INTEGRATION</div>
          <h2 style={{fontFamily:"var(--display)",fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:800,letterSpacing:"-0.03em"}}>
            One endpoint.<br /><span style={{color:"var(--cyan)"}}>Full security intelligence.</span>
          </h2>
        </motion.div>

        <div className="grid-2--gap-lg">
          <motion.div initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} className="card" style={{background:"var(--bg1)"}}>
            <div className="card-header">
              <div className="mac-dots"><span className="mac-dot mac-dot--red"/><span className="mac-dot mac-dot--amber"/><span className="mac-dot mac-dot--green"/></div>
              <span className="meta-text" style={{marginLeft:8}}>POST /analyze → Response</span>
            </div>
            <pre className="pre-panel">
              <span style={{color:"var(--text3)"}}>{"{"}</span>{"\n"}
              <span style={{color:"var(--text3)"}}> </span><span style={{color:"var(--purple)"}}>"score"</span><span style={{color:"var(--text3)"}}>: </span><span style={{color:"var(--amber)"}}>4.4</span><span style={{color:"var(--text3)"}}>,</span>{"\n"}
              <span style={{color:"var(--text3)"}}> </span><span style={{color:"var(--purple)"}}>"risk"</span><span style={{color:"var(--text3)"}}>: </span><span style={{color:"var(--red)"}}>"high"</span><span style={{color:"var(--text3)"}}>,</span>{"\n"}
              <span style={{color:"var(--text3)"}}> </span><span style={{color:"var(--purple)"}}>"verdict"</span><span style={{color:"var(--text3)"}}>: </span><span style={{color:"var(--red)"}}>"VULNERABLE"</span><span style={{color:"var(--text3)"}}>,</span>{"\n"}
              <span style={{color:"var(--text3)"}}> </span><span style={{color:"var(--purple)"}}>"findings"</span><span style={{color:"var(--text3)"}}>: [</span>{"\n"}
              <span style={{color:"var(--text3)"}}>   </span><span style={{color:"var(--green)"}}>"SQL injection via string concat"</span>{"\n"}
              <span style={{color:"var(--text3)"}}> ],</span>{"\n"}
              <span style={{color:"var(--text3)"}}> </span><span style={{color:"var(--purple)"}}>"tips"</span><span style={{color:"var(--text3)"}}>: [</span>{"\n"}
              <span style={{color:"var(--text3)"}}>   </span><span style={{color:"var(--cyan)"}}>"Use f-strings for formatting"</span>{"\n"}
              <span style={{color:"var(--text3)"}}> ]</span>{"\n"}
              <span style={{color:"var(--text3)"}}>{"}"}</span>
            </pre>
          </motion.div>

          <motion.div initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
            <div className="label mb-label-lg">// PROJECT LINKS</div>
            <div className="flex-col--gap">
              {LINKS.map((l,i) => (
                <motion.a key={i} href={l.url} target="_blank" rel="noreferrer" whileHover={{x:4}} className="link-row">
                  <div className="flex-center--gap">
                    <div className="dot dot--md" style={{background:l.dot,boxShadow:`0 0 8px ${l.dot}70`}} />
                    <div>
                      <div style={{fontFamily:"var(--mono)",fontSize:12,fontWeight:600}}>{l.label}</div>
                      <div className="meta-text" style={{marginTop:2}}>{l.sub}</div>
                    </div>
                  </div>
                  <ExternalLink size={13} color="var(--text3)" />
                </motion.a>
              ))}
            </div>
            <div className="alert--info" style={{marginTop:16,padding:"14px 16px"}}>
              <div className="label mb-label">ENDPOINT</div>
              <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--cyan)",wordBreak:"break-all"}}>
                POST https://muhammadsaadamin-polyguard-api.hf.space/analyze
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
