var $="ha-prime-polaris-card",z="0.2.4",T="grill",R={climate:"climate.{prefix}",chamber_temp:"sensor.{prefix}_chamber_temperature",running_status:"sensor.{prefix}_running_status",active_mode:"sensor.{prefix}_active_mode",active_smoke_level:"sensor.{prefix}_active_smoke_level",last_alarm:"sensor.{prefix}_last_alarm",probe_1_temp:"sensor.{prefix}_probe_1_temperature",probe_2_temp:"sensor.{prefix}_probe_2_temperature",probe_1_eta:"sensor.{prefix}_probe_1_eta",probe_2_eta:"sensor.{prefix}_probe_2_eta",setpoint:"number.{prefix}_temperature",smoke_level:"number.{prefix}_smoke_level",probe_1_target:"number.{prefix}_probe_1_target",probe_2_target:"number.{prefix}_probe_2_target",push_dedupe:"number.{prefix}_push_alert_dedupe",smoke_mode:"switch.{prefix}_smoke_mode",winter_mode:"switch.{prefix}_winter_mode",alarm:"switch.{prefix}_temperature_alarm",cook_session:"switch.{prefix}_cook_session",push_alerts:"switch.{prefix}_push_alerts",notes:"text.{prefix}_cook_notes",protein:"text.{prefix}_cook_protein",weight_lb:"text.{prefix}_cook_weight_lb",ambient_override:"text.{prefix}_cook_ambient_override",wind_override:"text.{prefix}_cook_wind_override"},y=4,H=3e4;var ne=/^[a-z_]+\.[a-z0-9_]+$/;function O(t,e,s){let o={value:null,source:""};if(!t||!e)return o;if(ne.test(e)){let a=t.states[e];if(!a)return{value:null,source:`${e} (missing)`};if(e.startsWith("weather.")&&a.attributes?.[s]!=null){let c=parseFloat(a.attributes[s]);return Number.isFinite(c)?{value:c,source:e}:o}let r=parseFloat(a.state);return Number.isFinite(r)?{value:r,source:e}:o}let n=parseFloat(e);return Number.isFinite(n)?{value:n,source:"literal"}:o}function N(t,e){if(!t)return null;let s=l=>R[l].replace("{prefix}",e),o=l=>t.states[s(l)]??null,n=l=>{let p=o(l);if(!p)return null;let d=parseFloat(p.state);return Number.isFinite(d)?d:null},a=l=>o(l)?.state==="on",r=l=>{let p=o(l);return p?p.state==="unknown"||p.state==="unavailable"?"":p.state:""},c=l=>{let p=o(l===1?"probe_1_eta":"probe_2_eta");if(!p)return{minutes:null,in_stall:!1,stdev:null,source:null};let d=parseFloat(p.state);return{minutes:Number.isFinite(d)?d:null,in_stall:!!p.attributes?.in_stall,stdev:p.attributes?.stall_stdev??null,source:p.attributes?.prior_source??null,samples:p.attributes?.samples??0}},m=o("climate"),h=n("setpoint")??m?.attributes?.temperature??null;return{prefix:e,entityIds:Object.fromEntries(Object.keys(R).map(l=>[l,s(l)])),chamber:n("chamber_temp")??m?.attributes?.current_temperature??null,setpoint:h,chamberDelta:n("chamber_temp")!=null&&h!=null?n("chamber_temp")-h:null,runningStatus:r("running_status")||null,activeMode:r("active_mode")||"off",smokeLevel:n("active_smoke_level"),smokeOn:a("smoke_mode"),winterOn:a("winter_mode"),alarmOn:a("alarm"),probe1:{temp:n("probe_1_temp"),target:n("probe_1_target"),...c(1)},probe2:{temp:n("probe_2_temp"),target:n("probe_2_target"),...c(2)},cookSession:a("cook_session"),notes:r("notes"),protein:r("protein"),weight_lb:r("weight_lb"),ambient:r("ambient_override"),wind:r("wind_override"),ambientResolved:O(t,r("ambient_override"),"temperature"),windResolved:O(t,r("wind_override"),"wind_speed"),pushOn:a("push_alerts"),pushDedupe:n("push_dedupe"),account:(()=>{let l=o("climate"),p=l?.attributes?.email??null,d=l?.attributes?.token_expiry??null,x=d?Math.max(0,Math.round((d*1e3-Date.now())/864e5)):null;return{email:p,daysToExpiry:x}})(),lastAlarm:(()=>{let l=o("last_alarm");return!l||l.state==="unknown"||l.state==="unavailable"||!l.state?null:{title:l.state,body:l.attributes?.body??"",captured_at:l.attributes?.captured_at??null,source:l.attributes?.source??null}})()}}function A(t,e){if(!t||!e)return{};let s=(o,n,a={})=>t.callService(o,n,a);return{setSetpoint:o=>s("number","set_value",{entity_id:e.entityIds.setpoint,value:o}),setSmokeLevel:o=>s("number","set_value",{entity_id:e.entityIds.smoke_level,value:o}),setProbeTarget:(o,n)=>s("number","set_value",{entity_id:e.entityIds[`probe_${o}_target`],value:n}),toggle:o=>{let n=e.entityIds[o],a=t.states[n]?.state==="on";return s("switch",a?"turn_off":"turn_on",{entity_id:n})},setText:(o,n)=>s("text","set_value",{entity_id:e.entityIds[o],value:n??""}),powerOff:()=>s("climate","set_hvac_mode",{entity_id:e.entityIds.climate,hvac_mode:"off"})}}var i={bg:"#0d1117",panel:"#161b22",panelBorder:"#30363d",text:"#e6edf3",textDim:"#8b949e",accent:"#fb923c",accentDim:"#9a3412",cool:"#3b82f6",hot:"#ef4444",steady:"#22c55e",smoke:"#a78bfa",alarm:"#f87171",stall:"#f59e0b",probe1:"#ef4444",probe2:"#06b6d4",chartChamber:"#fb923c",chartProbe1:"#ef4444",chartProbe2:"#06b6d4"},M=5;var I=`
  :host {
    display: block;
    color: ${i.text};
    font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
  }
  .card {
    background: ${i.bg};
    border-radius: 14px;
    padding: 16px;
    display: grid;
    gap: 12px;
  }
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .panel {
    background: ${i.panel};
    border: 1px solid ${i.panelBorder};
    border-radius: 10px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .panel.tall { padding: 16px 14px; }
  .panel-label {
    font-size: 11px;
    color: ${i.textDim};
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .big-temp {
    font-size: 44px;
    font-weight: 600;
    line-height: 1;
    margin-top: 2px;
  }
  .big-temp .unit {
    font-size: 22px;
    color: ${i.textDim};
    font-weight: 400;
    margin-left: 4px;
  }
  .big-temp.over   { color: ${i.hot}; }
  .big-temp.under  { color: ${i.cool}; }
  .big-temp.steady { color: ${i.steady}; }
  .delta {
    font-size: 13px;
    color: ${i.textDim};
    margin-top: 2px;
  }
  .chip-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .chip {
    background: ${i.bg};
    border: 1px solid ${i.panelBorder};
    border-radius: 999px;
    padding: 3px 10px;
    font-size: 11px;
    color: ${i.textDim};
  }
  .chip.active   { border-color: ${i.accent}; color: ${i.accent}; }
  .chip.smoke    { border-color: ${i.smoke};  color: ${i.smoke};  }
  .chip.alarm    { border-color: ${i.alarm};  color: ${i.alarm};  }
  .chip.stall    { border-color: ${i.stall};  color: ${i.stall};  }

  .probe {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    align-items: center;
  }
  .probe-label { font-size: 11px; color: ${i.textDim}; text-transform: uppercase; }
  .probe-temp {
    font-size: 28px;
    font-weight: 600;
    line-height: 1;
  }
  .probe-target {
    font-size: 13px;
    color: ${i.textDim};
  }
  .probe-eta {
    font-size: 14px;
    color: ${i.text};
    margin-top: 2px;
  }
  .probe-eta.fitting { color: ${i.textDim}; font-style: italic; }
  .probe-eta.stall   { color: ${i.stall}; font-weight: 500; }

  .controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
  }
  .stepper-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .stepper-label {
    font-size: 12px;
    color: ${i.textDim};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    flex: 0 0 88px;
  }
  .stepper-input {
    background: ${i.bg};
    color: ${i.text};
    border: 1px solid ${i.panelBorder};
    border-radius: 6px;
    padding: 6px 8px;
    width: 80px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    -moz-appearance: textfield;
  }
  .stepper-input::-webkit-outer-spin-button,
  .stepper-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .stepper-input:focus { outline: none; border-color: ${i.accent}; }
  .stepper-unit {
    font-size: 13px;
    color: ${i.textDim};
    min-width: 22px;
  }
  .stepper-btn {
    width: 36px;
    padding: 6px 0;
    font-size: 18px;
    font-weight: 600;
  }
  .slider {
    flex: 1;
    accent-color: ${i.accent};
    height: 6px;
  }
  .arc-panel {
    align-items: center;
  }
  .chamber-setpoint {
    margin: 4px auto 0;
    justify-content: center;
  }
  .chamber-setpoint .stepper-label { flex: 0 0 auto; }
  .arc-gauge {
    width: 100%;
    max-width: 260px;
    height: auto;
    display: block;
    margin: 4px auto 0;
    user-select: none;
    touch-action: none;
  }
  .arc-gauge text {
    font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
  }
  button.action {
    background: ${i.panel};
    color: ${i.text};
    border: 1px solid ${i.panelBorder};
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
    font-size: 13px;
    transition: border-color 0.15s, background 0.15s;
  }
  button.action:hover { border-color: ${i.accent}; }
  button.action.on    { border-color: ${i.accent}; background: ${i.accentDim}; color: ${i.text}; }
  button.action.alarm.on { border-color: ${i.alarm}; background: #4b1d1d; }

  .session {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    align-items: center;
  }
  .session input[type="text"], .session input[type="number"] {
    background: ${i.bg};
    color: ${i.text};
    border: 1px solid ${i.panelBorder};
    border-radius: 6px;
    padding: 6px 8px;
    width: 100%;
    box-sizing: border-box;
    font-size: 13px;
  }
  .session input:focus { outline: none; border-color: ${i.accent}; }
  .session-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rec-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${i.textDim};
  }
  .rec-dot.live { background: ${i.alarm}; box-shadow: 0 0 8px ${i.alarm}; }

  .chart-host {
    width: 100%;
    min-height: 240px;
    background: ${i.panel};
    border: 1px solid ${i.panelBorder};
    border-radius: 10px;
    overflow: hidden;
  }
  .chart-host canvas { display: block; width: 100%; height: 240px; }

  .alarm-banner {
    background: #4b1d1d;
    border: 1px solid ${i.alarm};
    color: ${i.text};
    padding: 8px 12px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
  .alarm-banner.dim {
    background: ${i.panel};
    border-color: ${i.panelBorder};
    color: ${i.textDim};
  }
  .alarm-dismiss {
    background: transparent;
    color: ${i.text};
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px;
    width: 26px;
    height: 26px;
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    flex: 0 0 auto;
    transition: background 0.15s;
  }
  .alarm-dismiss:hover { background: rgba(255,255,255,0.1); }
  .small { font-size: 11px; color: ${i.textDim}; }
  .env-line { margin-top: 6px; }
  .env-line strong { color: ${i.text}; font-weight: 500; }

  @media (max-width: 600px) {
    .row { grid-template-columns: 1fr; }
  }

  /* Tab strip */
  .tab-strip {
    display: flex;
    gap: 4px;
    background: ${i.panel};
    border-radius: 10px;
    padding: 4px;
    border: 1px solid ${i.panelBorder};
  }
  .tab {
    flex: 1;
    background: transparent;
    color: ${i.textDim};
    border: none;
    border-radius: 7px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.15s, color 0.15s;
  }
  .tab:hover { color: ${i.text}; }
  .tab.active {
    background: ${i.bg};
    color: ${i.accent};
    border: 1px solid ${i.panelBorder};
  }

  /* Setup view */
  .setup-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px 16px;
    align-items: center;
  }
  .setup-key { color: ${i.textDim}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
  .setup-val { color: ${i.text}; font-size: 14px; }
  .setup-val.bad { color: ${i.alarm}; }
  .setup-link {
    color: ${i.accent};
    text-decoration: none;
  }
  .setup-link:hover { text-decoration: underline; }
  .resolved-badge {
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .resolved-badge.ok  { color: ${i.steady}; border-color: ${i.steady}; background: rgba(34, 197, 94, 0.08); }
  .resolved-badge.bad { color: ${i.alarm};  border-color: ${i.alarm};  background: rgba(248, 113, 113, 0.08); }
  /* Setup uses 3-col grid for sensor rows (label / input / badge) */
  [data-slot="setup"] .session {
    grid-template-columns: auto 1fr auto;
  }
`;var B="apexcharts-card",k=class{constructor(e){this._host=e,this._mode=null,this._apexEl=null,this._canvas=null,this._series={},this._historyLoaded=!1,this._lastConfig=null}async update(e,s){let o=s.join("|");if(o!==this._lastConfig&&(this._lastConfig=o,this._historyLoaded=!1,this._series={},this._host.innerHTML="",this._mode=customElements.get(B)?"apex":"canvas",this._mode==="apex"?this._mountApex(s):this._mountCanvas()),this._mode==="apex"){this._apexEl.hass=e;return}this._historyLoaded||(this._historyLoaded=!0,await this._loadHistory(e,s)),this._appendLive(e,s),this._draw(s)}_mountApex(e){let s=e.map((n,a)=>({entity:n,name:this._labelFor(n),yaxis_id:"temp",color:[i.chartChamber,i.chartProbe1,i.chartProbe2][a]||"#fff",type:a===0?"area":"line",opacity:a===0?.25:1,stroke_width:2})),o=document.createElement(B);o.setConfig({header:{show:!1},graph_span:`${y}h`,update_interval:`${H/1e3}s`,yaxis:[{id:"temp",decimals:0,apex_config:{title:{text:"\xB0F"},forceNiceScale:!0}}],series:s}),this._apexEl=o,this._host.appendChild(o)}_mountCanvas(){this._canvas=document.createElement("canvas"),this._host.appendChild(this._canvas)}async _loadHistory(e,s){let a=`history/period/${new Date(Date.now()-y*3600*1e3).toISOString()}?filter_entity_id=${s.join(",")}&minimal_response`;try{let r=await e.callApi("GET",a);for(let c=0;c<s.length;c++){let m=s[c],h=(r?.[c]??[]).map(l=>[Date.parse(l.last_changed),parseFloat(l.state)]).filter(([l,p])=>Number.isFinite(l)&&Number.isFinite(p));this._series[m]=h}}catch(r){console.warn("[ha-prime-polaris-card] history fetch failed:",r)}}_appendLive(e,s){let o=Date.now(),n=o-y*3600*1e3;for(let a of s){let r=this._series[a]??(this._series[a]=[]),c=parseFloat(e.states[a]?.state);if(Number.isFinite(c)){let m=r.length?r[r.length-1][0]:0;o-m>=5e3&&r.push([o,c])}for(;r.length&&r[0][0]<n;)r.shift()}}_draw(e){let s=this._canvas;if(!s)return;let o=window.devicePixelRatio||1,n=s.clientWidth||600,a=240;s.width=n*o,s.height=a*o;let r=s.getContext("2d");r.scale(o,o),r.clearRect(0,0,n,a);let c=e.flatMap(u=>this._series[u]??[]);if(c.length<2){r.fillStyle=i.textDim,r.font="12px system-ui",r.fillText("collecting data\u2026",16,24);return}let m=c.map(u=>u[0]),h=c.map(u=>u[1]),l=Math.min(...m),p=Math.max(...m),d=Math.min(...h)-5,x=Math.max(...h)+5,f={l:36,r:12,t:12,b:22},w=u=>f.l+(u-l)/Math.max(1,p-l)*(n-f.l-f.r),v=u=>f.t+(1-(u-d)/Math.max(1,x-d))*(a-f.t-f.b);r.strokeStyle=i.panelBorder,r.fillStyle=i.textDim,r.font="11px system-ui",r.lineWidth=1;let P=4;for(let u=0;u<=P;u++){let g=d+u/P*(x-d),b=v(g);r.beginPath(),r.moveTo(f.l,b),r.lineTo(n-f.r,b),r.stroke(),r.fillText(g.toFixed(0),6,b+4)}let L=[i.chartChamber,i.chartProbe1,i.chartProbe2];e.forEach((u,g)=>{let b=this._series[u]??[];if(!(b.length<2)){if(r.strokeStyle=L[g]||"#fff",r.lineWidth=g===0?1.5:2,g===0){r.fillStyle=L[0]+"40",r.beginPath(),r.moveTo(w(b[0][0]),v(d));for(let[F,E]of b)r.lineTo(w(F),v(E));r.lineTo(w(b[b.length-1][0]),v(d)),r.closePath(),r.fill()}r.beginPath(),r.moveTo(w(b[0][0]),v(b[0][1]));for(let[F,E]of b)r.lineTo(w(F),v(E));r.stroke()}})}_labelFor(e){return e.includes("chamber")?"Chamber":e.includes("probe_1")?"Probe 1":e.includes("probe_2")?"Probe 2":e}};var S=-135,W=135,re=W-S;function G(t){let e=t.size??220,s=e/2,o=e/2,n=e/2-18,a=t.min,r=t.max,c=t.current??a,m=t.target??a,h=Y(c,a,r),l=Y(m,a,r),p=t.fillColor??ae(c,m),d=V(s,o,n,S,W),x=V(s,o,n,S,h),f=C(s,o,n,l);return`
    <svg
      viewBox="0 0 ${e} ${e}"
      class="arc-gauge"
      data-gauge="true"
      data-min="${a}"
      data-max="${r}"
      data-cx="${s}"
      data-cy="${o}"
      data-r="${n}">

      <!-- track -->
      <path d="${d}"
        stroke="${i.panelBorder}"
        stroke-width="12"
        stroke-linecap="round"
        fill="none" />

      <!-- filled arc up to current -->
      <path d="${x}"
        stroke="${p}"
        stroke-width="12"
        stroke-linecap="round"
        fill="none" />

      <!-- setpoint indicator (display-only; setpoint is set via the
           type-in input in the chamber panel) -->
      <circle cx="${f.x}" cy="${f.y}" r="11"
        fill="${i.accent}"
        stroke="${i.text}"
        stroke-width="2" />

      <!-- center readout: big chamber temp, small target -->
      <text x="${s}" y="${o-4}"
        text-anchor="middle"
        font-size="44"
        font-weight="600"
        fill="${i.text}"
        style="font-family: inherit;">
        ${t.current!=null?t.current.toFixed(0):"\u2014"}<tspan font-size="22" fill="${i.textDim}">\xB0F</tspan>
      </text>
      <text x="${s}" y="${o+24}"
        text-anchor="middle"
        font-size="13"
        fill="${i.textDim}"
        style="font-family: inherit;">
        target ${t.target??"\u2014"}\xB0F
      </text>
    </svg>
  `}function Y(t,e,s){let n=(Math.max(e,Math.min(s,t))-e)/(s-e);return S+n*re}function C(t,e,s,o){let n=(o-90)*Math.PI/180;return{x:t+s*Math.cos(n),y:e+s*Math.sin(n)}}function V(t,e,s,o,n){let a=C(t,e,s,o),r=C(t,e,s,n),c=Math.abs(n-o)>180?1:0;return`M ${a.x} ${a.y} A ${s} ${s} 0 ${c} 1 ${r.x} ${r.y}`}function ae(t,e){if(t==null||e==null)return i.accent;let s=t-e;return s>M?i.hot:s<-M?i.cool:i.steady}function _(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function X(t){if(!t)return"";let{chamber:e,setpoint:s,chamberDelta:o}=t,n=o!=null?`\u0394 ${o>0?"+":""}${o.toFixed(0)}\xB0F`:"",a=s??225;return`
    <div class="panel tall arc-panel">
      <div class="panel-label">Chamber</div>
      ${G({min:180,max:500,current:e,target:s})}
      <div class="delta">${n}</div>
      <div class="stepper-row chamber-setpoint">
        <span class="stepper-label">Setpoint</span>
        <button class="action stepper-btn" data-action="temp-down">\u2212</button>
        <input
          type="number"
          inputmode="numeric"
          min="180"
          max="500"
          step="1"
          class="stepper-input"
          data-input="setpoint"
          value="${a}">
        <span class="stepper-unit">\xB0F</span>
        <button class="action stepper-btn" data-action="temp-up">+</button>
      </div>
    </div>
  `}function q(t){if(!t)return"";let e=[];return t.runningStatus&&e.push({cls:"active",txt:U(t.runningStatus)}),e.push({cls:t.activeMode==="smoke"?"smoke":"active",txt:`Mode: ${U(t.activeMode)}`}),t.smokeOn&&t.smokeLevel!=null&&e.push({cls:"smoke",txt:`Smoke ${t.smokeLevel.toFixed(0)}`}),t.alarmOn&&e.push({cls:"alarm",txt:"Alarm Armed"}),t.winterOn&&e.push({cls:"active",txt:"Winter"}),t.pushOn&&e.push({cls:"active",txt:"Push On"}),t.ambient&&e.push(t.ambientResolved.value!=null?{cls:"active",txt:`Ambient ${t.ambientResolved.value.toFixed(0)}\xB0F`}:{cls:"alarm",txt:"Ambient Unresolved"}),t.wind&&e.push(t.windResolved.value!=null?{cls:"active",txt:`Wind ${t.windResolved.value.toFixed(1)}`}:{cls:"alarm",txt:"Wind Unresolved"}),`
    <div class="chip-row">
      ${e.map(s=>`<span class="chip ${s.cls}">${_(s.txt)}</span>`).join("")}
    </div>
  `}function U(t){return t?String(t).split(/(\s+)/).map(e=>e.length===0||/\s+/.test(e)?e:e[0].toUpperCase()+e.slice(1).toLowerCase()).join(""):""}function Q(t){if(!t)return"";let e=t.cookSession,s=e?t.protein?`${_(t.protein)}${t.weight_lb?" \xB7 "+_(t.weight_lb)+" lb":""}`:"recording":"no active cook",o=t.notes?_(t.notes):e?"":"flip the switch when you start a real cook",n=[];t.ambientResolved.value!=null&&n.push(`ambient <strong>${t.ambientResolved.value.toFixed(0)}\xB0F</strong>`),t.windResolved.value!=null&&n.push(`wind <strong>${t.windResolved.value.toFixed(1)}</strong>`);let a=n.length?`<div class="small env-line">${n.join(" \xB7 ")}</div>`:"";return`
    <div class="panel tall">
      <div class="panel-label">Cook session</div>
      <div class="session-toggle">
        <span class="rec-dot ${e?"live":""}"></span>
        <button class="action ${e?"on":""}" data-action="toggle-session">
          ${e?"Stop session":"Start session"}
        </button>
      </div>
      <div class="big-temp" style="font-size:22px; margin-top:8px;">${s}</div>
      <div class="small">${o}</div>
      ${a}
    </div>
  `}function j(t,e){if(e.temp==null)return`
      <div class="panel">
        <div class="probe">
          <div class="probe-label">Probe ${t}</div>
          <div class="small">not connected</div>
        </div>
      </div>
    `;let s="fitting\u2026",o="fitting";if(e.in_stall)s=`\u{1F6D1} in stall \xB7 \u03C3 ${e.stdev?.toFixed(2)??"\u2014"}\xB0F`,o="stall";else if(e.minutes!=null){let n=Math.max(0,e.minutes);s=n>=60?`ETA ${(n/60).toFixed(1)} h`:`ETA ${n.toFixed(0)} min`,o=""}return`
    <div class="panel">
      <div class="probe">
        <div class="probe-label">Probe ${t}</div>
        <div>
          <div class="probe-temp">${e.temp.toFixed(0)}\xB0F</div>
          <div class="probe-target">\u2192 ${e.target??"\u2014"}\xB0F</div>
          <div class="probe-eta ${o}">${_(s)}</div>
          ${e.source?`<div class="small">prior: ${_(e.source)}</div>`:""}
        </div>
      </div>
    </div>
  `}function J(t){return t?`
    <div class="row">
      ${j(1,t.probe1)}
      ${j(2,t.probe2)}
    </div>
  `:""}function K(t){if(!t)return"";let e=t.smokeLevel??0;return`
    <div class="panel">
      <div class="panel-label">Controls</div>
      <div class="stepper-row">
        <span class="stepper-label">Smoke level</span>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          class="slider"
          data-input="smoke_level"
          value="${e}">
        <span class="stepper-unit" data-bind="smoke-level-readout">${e}</span>
      </div>
      <div class="controls">
        <button class="action ${t.smokeOn?"on":""}" data-action="toggle-smoke">Smoke</button>
        <button class="action ${t.winterOn?"on":""}" data-action="toggle-winter">Winter</button>
        <button class="action alarm ${t.alarmOn?"on":""}" data-action="toggle-alarm">Alarm</button>
        <button class="action ${t.pushOn?"on":""}" data-action="toggle-push">Push</button>
        <button class="action" data-action="power-off">Power off</button>
      </div>
    </div>
  `}function Z(t){return t?`
    <div class="panel">
      <div class="panel-label">This cook</div>
      <div class="session">
        <label>Protein</label>
        <input type="text" data-input="protein"   value="${_(t.protein)}"   placeholder="brisket / pork / ribs">
        <label>Weight (lb)</label>
        <input type="text" data-input="weight_lb" value="${_(t.weight_lb)}" placeholder="16">
        <label>Notes</label>
        <input type="text" data-input="notes"     value="${_(t.notes)}"     placeholder="oak, low and slow">
      </div>
      <div class="small" style="margin-top:8px;">
        Ambient / wind sensors are configured once in the
        <strong>Setup</strong> tab and persist across cooks.
      </div>
    </div>
  `:""}function ee(t){let e=(s,o)=>`
    <button class="tab ${t===s?"active":""}"
            data-action="set-view-${s}">
      ${o}
    </button>
  `;return`
    <div class="tab-strip">
      ${e("live","Live")}
      ${e("setup","Setup")}
    </div>
  `}function te(t,e){if(!t)return"";let s=t.lastAlarm;return s?e&&e===s.captured_at?'<div class="alarm-banner dim">no alarms (dismissed)</div>':`
    <div class="alarm-banner">
      <span><strong>${_(s.title)}</strong> \xB7 ${_(s.body)}</span>
      <button class="alarm-dismiss" data-action="dismiss-alarm" title="Dismiss">\u2715</button>
    </div>
  `:'<div class="alarm-banner dim">no alarms</div>'}function ie(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function se(t,e,s,o){let n="";return e&&(n=s&&s.value!=null?`<span class="resolved-badge ok">${s.value.toFixed(1)}${o}</span>`:'<span class="resolved-badge bad">unresolved</span>'),`
    <label>${t}</label>
    <input type="text" data-input="${t.toLowerCase()==="ambient sensor"?"ambient":"wind"}" value="${ie(e)}" placeholder="entity_id (e.g. sensor.outdoor_temp)">
    ${n||"<span></span>"}
  `}function oe(t,e){if(!t||!t.account)return`
      <div class="panel"><div class="small">Loading account info\u2026</div></div>
    `;let s=t.account,o=s.daysToExpiry!=null&&s.daysToExpiry<14?"bad":"";return`
    <div class="panel">
      <div class="panel-label">Account</div>
      <div class="setup-grid">
        <span class="setup-key">Email</span>
        <span class="setup-val">${ie(s.email||"\u2014")}</span>

        <span class="setup-key">Token expires</span>
        <span class="setup-val ${o}">
          ${s.daysToExpiry!=null?`in ${s.daysToExpiry} days`:"\u2014"}
        </span>

        <span class="setup-key">Manage</span>
        <span class="setup-val">
          <a class="setup-link" href="/config/integrations/integration/prime_polaris" target="_top">
            Open in HA Settings \u2192
          </a>
        </span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-label">Push alerts (FCM)</div>
      <div class="setup-grid">
        <span class="setup-key">Enabled</span>
        <span class="setup-val">
          <button class="action ${t.pushOn?"on":""}" data-action="toggle-push">
            ${t.pushOn?"ON":"OFF"}
          </button>
        </span>

        <span class="setup-key">Dedupe window</span>
        <span class="setup-val">
          <input type="number" min="10" max="3600" step="10"
                 class="stepper-input"
                 data-input="push_dedupe"
                 value="${t.pushDedupe??60}">
          <span class="stepper-unit">sec</span>
        </span>
      </div>
      <div class="small" style="margin-top:8px;">
        Pushes for the same alarm category fire every ~25\u201330 s while the
        condition persists; the dedupe window suppresses repeats.
      </div>
    </div>

    <div class="panel">
      <div class="panel-label">Default sensors</div>
      <div class="session">
        ${se("Ambient sensor",t.ambient,t.ambientResolved,"\xB0F")}
        ${se("Wind sensor",t.wind,t.windResolved,"")}
      </div>
      <div class="small" style="margin-top:8px;">
        These persist across cooks \u2014 set once. Per-cook overrides on the
        Live tab take precedence if you ever want to deviate.
      </div>
    </div>
  `}var D=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._state=null,this._chart=null,this._view="live",this._dismissedAlarmId=null,this._renderQueued=!1}setConfig(e){this._config={entity_prefix:e?.entity_prefix??T,title:e?.title??null,ambient_entity:e?.ambient_entity??null,...e},this._lastSig=null}set hass(e){this._hass=e,this._config&&(this._state=N(e,this._config.entity_prefix),this._scheduleRender())}getCardSize(){return 8}static getConfigElement(){return null}static getStubConfig(){return{entity_prefix:T}}_scheduleRender(){this._renderQueued||(this._renderQueued=!0,requestAnimationFrame(()=>{this._renderQueued=!1,this._render()}))}_render(){let e=this._state;(!this.shadowRoot.firstElementChild||this.shadowRoot.firstElementChild.dataset.view!==this._view)&&(this._stampShell(),this._wireEvents()),this._fill("tabs",ee(this._view)),this._view==="live"?this._renderLive(e):this._renderSetup(e)}_stampShell(){let e=`
      <div data-slot="alarm"></div>
      <div data-slot="chips"></div>
      <div class="row">
        <div data-slot="chamber"></div>
        <div data-slot="cookHeader"></div>
      </div>
      <div data-slot="probes"></div>
      <div class="chart-host" data-slot="chart"></div>
      <div data-slot="controls"></div>
      <div data-slot="session"></div>
    `,s=`
      <div data-slot="setup"></div>
    `;this.shadowRoot.innerHTML=`
      <style>${I}</style>
      <div class="card" data-view="${this._view}">
        <div data-slot="tabs"></div>
        ${this._view==="live"?e:s}
      </div>
    `,this._view!=="live"&&(this._chart=null)}_renderLive(e){if(this._fill("alarm",te(e,this._dismissedAlarmId)),this._fill("chips",q(e)),this._fill("cookHeader",Q(e)),this._fill("probes",J(e)),this._fillPreserveFocus("chamber",X(e)),this._fillPreserveFocus("controls",K(e)),this._fillPreserveFocus("session",Z(e)),this._hass&&e){if(!this._chart){let o=this.shadowRoot.querySelector('[data-slot="chart"]');this._chart=new k(o)}let s=[e.entityIds.chamber_temp,e.entityIds.probe_1_temp,e.entityIds.probe_2_temp];this._chart.update(this._hass,s)}}_renderSetup(e){this._fillPreserveFocus("setup",oe(e,this._config))}_fill(e,s){let o=this.shadowRoot.querySelector(`[data-slot="${e}"]`);o&&(o.innerHTML=s)}_fillPreserveFocus(e,s){let o=this.shadowRoot.querySelector(`[data-slot="${e}"]`);if(!o)return;let n=this.shadowRoot.activeElement;if(!(n&&n.dataset?.input&&o.contains(n))){o.innerHTML=s;return}let r=n.dataset.input,c=n.value,m=n.selectionStart,h=n.selectionEnd;o.innerHTML=s;let l=o.querySelector(`[data-input="${r}"]`);if(l){l.value=c,l.focus();try{l.setSelectionRange(m,h)}catch{}}}_wireEvents(){this.shadowRoot.addEventListener("click",e=>{let s=e.target.closest("[data-action]");s&&this._dispatchAction(s.dataset.action)}),this.shadowRoot.addEventListener("change",e=>{let s=e.target.closest("[data-input]");if(!s)return;let o=A(this._hass,this._state),n=s.dataset.input;if(n==="setpoint"){let r=parseInt(s.value,10);Number.isFinite(r)&&o.setSetpoint(Math.max(180,Math.min(500,r)));return}if(n==="smoke_level"){let r=parseInt(s.value,10);Number.isFinite(r)&&o.setSmokeLevel(Math.max(0,Math.min(10,r)));return}if(n==="push_dedupe"){let r=parseInt(s.value,10);Number.isFinite(r)&&this._hass.callService("number","set_value",{entity_id:this._state.entityIds.push_dedupe,value:Math.max(10,Math.min(3600,r))});return}let a={notes:"notes",protein:"protein",weight_lb:"weight_lb",ambient:"ambient_override",wind:"wind_override"};a[n]&&o.setText(a[n],s.value)}),this.shadowRoot.addEventListener("input",e=>{let s=e.target.closest('[data-input="smoke_level"]');if(!s)return;let o=this.shadowRoot.querySelector('[data-bind="smoke-level-readout"]');o&&(o.textContent=s.value)})}_dispatchAction(e){if(!this._hass||!this._state)return;let s=A(this._hass,this._state),o=this._state.setpoint??225;switch(e){case"toggle-session":s.toggle("cook_session");break;case"toggle-smoke":s.toggle("smoke_mode");break;case"toggle-winter":s.toggle("winter_mode");break;case"toggle-alarm":s.toggle("alarm");break;case"toggle-push":s.toggle("push_alerts");break;case"temp-up":s.setSetpoint(Math.min(500,o+1));break;case"temp-down":s.setSetpoint(Math.max(180,o-1));break;case"power-off":s.powerOff();break;case"set-view-live":this._view="live",this._scheduleRender();break;case"set-view-setup":this._view="setup",this._scheduleRender();break;case"dismiss-alarm":this._state?.lastAlarm&&(this._dismissedAlarmId=this._state.lastAlarm.captured_at,this._scheduleRender());break}}};customElements.get($)||customElements.define($,D);window.customCards=window.customCards||[];window.customCards.some(t=>t.type===$)||window.customCards.push({type:$,name:"Prime Polaris Grill",description:"Live cook dashboard for the Prime Polaris pellet grill integration.",preview:!0});console.info(`%c ${$} %c v${z} `,"color:#fb923c;background:#0d1117;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:600","color:#0d1117;background:#fb923c;padding:2px 6px;border-radius:0 3px 3px 0");
