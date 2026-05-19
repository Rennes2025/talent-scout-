"use client";

export default function StatsPage() {
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <>
      <div
        className="min-h-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(46, 54, 61, 0.4) 0%, transparent 70%)",
        }}
      >
        <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop flex flex-col gap-gutter">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-unit mb-unit">
            <div>
              <h1 className="font-display-lg text-display-lg text-on-surface uppercase tracking-tight">
                PLAYER DATABASE
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Comprehensive analytical breakdown and historical performance metrics.
              </p>
            </div>
            <div className="flex gap-unit">
              <button
                onClick={handleExportPDF}
                className="bg-transparent border border-outline-variant/50 text-on-surface font-label-caps text-label-caps px-4 py-2 rounded uppercase hover:border-tertiary transition-colors"
              >
                Export PDF
              </button>
              <button className="bg-tertiary text-on-tertiary font-label-caps text-label-caps px-4 py-2 rounded uppercase font-bold hover:bg-tertiary-fixed transition-colors">
                Compare Stats
              </button>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Key Metrics - Top Row */}
            <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-unit">
              <div className="glass-panel rounded-lg p-unit flex flex-col justify-between h-32 relative overflow-hidden">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase z-10">
                  Matches Played
                </span>
                <span className="font-stat-value text-stat-value text-tertiary z-10">142</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-high">
                  <div className="h-full bg-tertiary w-3/4"></div>
                </div>
              </div>
              <div className="glass-panel rounded-lg p-unit flex flex-col justify-between h-32 relative overflow-hidden">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase z-10">
                  Goals/Assists
                </span>
                <span className="font-stat-value text-stat-value text-on-surface z-10">84</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-high">
                  <div className="h-full bg-primary w-2/3"></div>
                </div>
              </div>
              <div className="glass-panel rounded-lg p-unit flex flex-col justify-between h-32 relative overflow-hidden">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase z-10">
                  Pass Accuracy
                </span>
                <span className="font-stat-value text-stat-value text-on-surface z-10">89%</span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-high">
                  <div className="h-full bg-primary w-11/12"></div>
                </div>
              </div>
              <div className="glass-panel rounded-lg p-unit flex flex-col justify-between h-32 relative overflow-hidden">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase z-10">
                  Top Speed
                </span>
                <span className="font-stat-value text-stat-value text-tertiary z-10">
                  34.2<span className="text-body-sm">km/h</span>
                </span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-high">
                  <div className="h-full bg-tertiary w-5/6"></div>
                </div>
              </div>
            </div>

            {/* Technical Skills & Physical Data */}
            <div className="md:col-span-8 flex flex-col gap-gutter">
              <div className="glass-panel rounded-xl p-gutter h-full">
                <div className="flex justify-between items-center mb-unit border-b border-outline-variant/20 pb-2">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">
                    Technical Attributes
                  </h2>
                  <span className="material-symbols-outlined text-tertiary">radar</span>
                </div>
                <div className="flex flex-col md:flex-row gap-gutter items-center justify-center py-unit">
                  {/* Mock Radar Chart */}
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <svg
                      className="w-full h-full absolute inset-0 text-surface-container-highest stroke-current"
                      style={{ strokeWidth: "0.5", fill: "none" }}
                      viewBox="0 0 100 100"
                    >
                      <polygon points="50,5 95,25 95,75 50,95 5,75 5,25"></polygon>
                      <polygon points="50,20 80,35 80,65 50,80 20,65 20,35"></polygon>
                      <polygon points="50,35 65,45 65,55 50,65 35,55 35,45"></polygon>
                      <line x1="50" x2="50" y1="50" y2="5"></line>
                      <line x1="50" x2="95" y1="50" y2="25"></line>
                      <line x1="50" x2="95" y1="50" y2="75"></line>
                      <line x1="50" x2="50" y1="50" y2="95"></line>
                      <line x1="50" x2="5" y1="50" y2="75"></line>
                      <line x1="50" x2="5" y1="50" y2="25"></line>
                    </svg>
                    <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 100 100">
                      <polygon
                        className="fill-tertiary/20 stroke-tertiary"
                        points="50,15 85,30 75,70 50,85 15,65 25,25"
                        style={{ strokeWidth: "1.5" }}
                      ></polygon>
                    </svg>
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full font-label-caps text-[10px] text-on-surface-variant uppercase">
                      Pace
                    </span>
                    <span className="absolute top-1/4 right-0 translate-x-1/2 font-label-caps text-[10px] text-on-surface-variant uppercase">
                      Shooting
                    </span>
                    <span className="absolute bottom-1/4 right-0 translate-x-1/2 font-label-caps text-[10px] text-on-surface-variant uppercase">
                      Passing
                    </span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full font-label-caps text-[10px] text-on-surface-variant uppercase">
                      Dribbling
                    </span>
                    <span className="absolute bottom-1/4 left-0 -translate-x-1/2 font-label-caps text-[10px] text-on-surface-variant uppercase">
                      Defending
                    </span>
                    <span className="absolute top-1/4 left-0 -translate-x-1/2 font-label-caps text-[10px] text-on-surface-variant uppercase">
                      Physical
                    </span>
                  </div>
                  <div className="flex-grow flex flex-col gap-2 w-full">
                    {[
                      { label: "Vision", value: 92, color: "bg-tertiary", textColor: "text-tertiary" },
                      { label: "Ball Control", value: 88, color: "bg-tertiary", textColor: "text-tertiary" },
                      { label: "Finishing", value: 84, color: "bg-primary", textColor: "text-primary" },
                      { label: "Stamina", value: 95, color: "bg-primary", textColor: "text-primary" },
                    ].map((attr) => (
                      <div key={attr.label} className="flex flex-col">
                        <div className="flex justify-between font-label-caps text-label-caps mb-1">
                          <span className="text-on-surface uppercase">{attr.label}</span>
                          <span className={attr.textColor}>{attr.value}</span>
                        </div>
                        <div className="w-full bg-surface-container-highest h-1 rounded-full">
                          <div
                            className={`${attr.color} h-1 rounded-full`}
                            style={{ width: `${attr.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Heatmap / Pitch Data */}
            <div className="md:col-span-4 flex flex-col gap-gutter">
              <div className="glass-panel rounded-xl p-gutter h-full flex flex-col">
                <div className="flex justify-between items-center mb-unit border-b border-outline-variant/20 pb-2">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase">
                    Influence Zones
                  </h2>
                  <span className="material-symbols-outlined text-tertiary">map</span>
                </div>
                <div className="flex-grow bg-surface-container-lowest rounded border border-outline-variant/30 relative overflow-hidden flex items-center justify-center p-2">
                  <div className="w-full h-full border border-outline-variant/50 relative">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant/50 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full border border-outline-variant/50 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-1/4 right-1/4 w-16 h-24 bg-tertiary/40 rounded-full blur-xl"></div>
                    <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-primary/30 rounded-full blur-xl"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-12 h-16 bg-tertiary/20 rounded-full blur-lg"></div>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="bg-surface-container px-2 py-1 rounded text-label-caps font-label-caps text-on-surface-variant uppercase border border-outline-variant/20">
                    [ATTACKING THIRD]
                  </span>
                  <span className="bg-surface-container px-2 py-1 rounded text-label-caps font-label-caps text-on-surface-variant uppercase border border-outline-variant/20">
                    [RIGHT WING]
                  </span>
                </div>
              </div>
            </div>

            {/* Match History Table */}
            <div className="md:col-span-12">
              <div className="glass-panel rounded-xl overflow-hidden">
                <div className="p-unit border-b border-outline-variant/20 flex justify-between items-center bg-surface-container/50">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface uppercase px-2">
                    Recent Match History
                  </h2>
                  <button className="text-tertiary font-label-caps text-label-caps uppercase hover:underline">
                    View Full Log
                  </button>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/30 bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant uppercase">
                        <th className="p-unit pl-4">Date</th>
                        <th className="p-unit">Opponent</th>
                        <th className="p-unit text-center">Result</th>
                        <th className="p-unit text-center">Mins</th>
                        <th className="p-unit text-center">G</th>
                        <th className="p-unit text-center">A</th>
                        <th className="p-unit text-center">xG</th>
                        <th className="p-unit text-center">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm">
                      <tr className="border-b border-outline-variant/10 hover:bg-surface-variant/30 transition-colors">
                        <td className="p-unit pl-4 text-on-surface-variant">Oct 24, 2024</td>
                        <td className="p-unit font-bold text-on-surface">vs Athletico M.</td>
                        <td className="p-unit text-center text-primary font-bold">W 2-0</td>
                        <td className="p-unit text-center">90&apos;</td>
                        <td className="p-unit text-center">1</td>
                        <td className="p-unit text-center">0</td>
                        <td className="p-unit text-center text-on-surface-variant">0.84</td>
                        <td className="p-unit text-center text-tertiary font-bold">8.4</td>
                      </tr>
                      <tr className="border-b border-outline-variant/10 bg-surface-container-lowest/30 hover:bg-surface-variant/30 transition-colors">
                        <td className="p-unit pl-4 text-on-surface-variant">Oct 17, 2024</td>
                        <td className="p-unit font-bold text-on-surface">@ Real B.</td>
                        <td className="p-unit text-center text-on-surface-variant">D 1-1</td>
                        <td className="p-unit text-center">75&apos;</td>
                        <td className="p-unit text-center">0</td>
                        <td className="p-unit text-center">1</td>
                        <td className="p-unit text-center text-on-surface-variant">0.12</td>
                        <td className="p-unit text-center text-tertiary font-bold">7.2</td>
                      </tr>
                      <tr className="border-b border-outline-variant/10 hover:bg-surface-variant/30 transition-colors">
                        <td className="p-unit pl-4 text-on-surface-variant">Oct 10, 2024</td>
                        <td className="p-unit font-bold text-on-surface">vs Sporting C.</td>
                        <td className="p-unit text-center text-primary font-bold">W 3-1</td>
                        <td className="p-unit text-center">90&apos;</td>
                        <td className="p-unit text-center">2</td>
                        <td className="p-unit text-center">0</td>
                        <td className="p-unit text-center text-on-surface-variant">1.45</td>
                        <td className="p-unit text-center text-tertiary font-bold">9.1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center py-margin-desktop px-margin-desktop gap-unit w-full max-w-container-max mx-auto">
          <div className="font-headline-sm text-headline-sm text-tertiary">ANWAR MEKDADI</div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            © 2026 PROFIL OFFICIEL. TOUS DROITS RÉSERVÉS.
          </div>
          <div className="flex gap-4">
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-tertiary transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-tertiary transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-tertiary transition-colors"
              href="#"
            >
              Agent Portal
            </a>
          </div>
        </div>
      </footer>

    </>
  );
}
