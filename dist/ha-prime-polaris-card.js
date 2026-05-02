var $="ha-prime-polaris-card",O="0.2.12",C="grill",M={climate:"climate.{prefix}",chamber_temp:"sensor.{prefix}_chamber_temperature",running_status:"sensor.{prefix}_running_status",active_mode:"sensor.{prefix}_active_mode",active_smoke_level:"sensor.{prefix}_active_smoke_level",last_alarm:"sensor.{prefix}_last_alarm",probe_1_temp:"sensor.{prefix}_probe_1_temperature",probe_2_temp:"sensor.{prefix}_probe_2_temperature",probe_1_eta:"sensor.{prefix}_probe_1_eta",probe_2_eta:"sensor.{prefix}_probe_2_eta",setpoint:"number.{prefix}_temperature",smoke_level:"number.{prefix}_smoke_level",probe_1_target:"number.{prefix}_probe_1_target",probe_2_target:"number.{prefix}_probe_2_target",push_dedupe:"number.{prefix}_push_alert_dedupe",smoke_mode:"switch.{prefix}_smoke_mode",winter_mode:"switch.{prefix}_winter_mode",alarm:"switch.{prefix}_temperature_alarm",cook_session:"switch.{prefix}_cook_session",push_alerts:"switch.{prefix}_push_alerts",notes:"text.{prefix}_cook_notes",protein:"text.{prefix}_cook_protein",weight_lb:"text.{prefix}_cook_weight_lb",ambient_override:"text.{prefix}_cook_ambient_override",wind_override:"text.{prefix}_cook_wind_override"},k=4,H=3e4;var ae=/^[a-z_]+\.[a-z0-9_]+$/;function L(s,e,t){let i={value:null,source:""};if(!s||!e)return i;if(ae.test(e)){let a=s.states[e];if(!a)return{value:null,source:`${e} (missing)`};if(e.startsWith("weather.")&&a.attributes?.[t]!=null){let c=parseFloat(a.attributes[t]);return Number.isFinite(c)?{value:c,source:e}:i}let r=parseFloat(a.state);return Number.isFinite(r)?{value:r,source:e}:i}let o=parseFloat(e);return Number.isFinite(o)?{value:o,source:"literal"}:i}function I(s,e){if(!s)return null;let t=l=>M[l].replace("{prefix}",e),i=l=>s.states[t(l)]??null,o=l=>{let p=i(l);if(!p)return null;let d=parseFloat(p.state);return Number.isFinite(d)?d:null},a=l=>i(l)?.state==="on",r=l=>{let p=i(l);return p?p.state==="unknown"||p.state==="unavailable"?"":p.state:""},c=l=>{let p=i(l===1?"probe_1_eta":"probe_2_eta");if(!p)return{minutes:null,in_stall:!1,stdev:null,source:null};let d=parseFloat(p.state);return{minutes:Number.isFinite(d)?d:null,in_stall:!!p.attributes?.in_stall,stdev:p.attributes?.stall_stdev??null,source:p.attributes?.prior_source??null,samples:p.attributes?.samples??0}},u=i("climate"),m=o("setpoint")??u?.attributes?.temperature??null;return{prefix:e,entityIds:Object.fromEntries(Object.keys(M).map(l=>[l,t(l)])),chamber:o("chamber_temp")??u?.attributes?.current_temperature??null,setpoint:m,chamberDelta:o("chamber_temp")!=null&&m!=null?o("chamber_temp")-m:null,runningStatus:r("running_status")||null,activeMode:r("active_mode")||"off",smokeLevel:o("active_smoke_level"),smokeOn:a("smoke_mode"),winterOn:a("winter_mode"),alarmOn:a("alarm"),probe1:{temp:o("probe_1_temp"),target:o("probe_1_target"),...c(1)},probe2:{temp:o("probe_2_temp"),target:o("probe_2_target"),...c(2)},cookSession:a("cook_session"),notes:r("notes"),protein:r("protein"),weight_lb:r("weight_lb"),ambient:r("ambient_override"),wind:r("wind_override"),ambientResolved:L(s,r("ambient_override"),"temperature"),windResolved:L(s,r("wind_override"),"wind_speed"),pushOn:a("push_alerts"),pushDedupe:o("push_dedupe"),account:(()=>{let l=i("climate"),p=l?.attributes?.email??null,d=l?.attributes?.token_expiry??null,x=d?Math.max(0,Math.round((d*1e3-Date.now())/864e5)):null;return{email:p,daysToExpiry:x}})(),lastAlarm:(()=>{let l=i("last_alarm");return!l||l.state==="unknown"||l.state==="unavailable"||!l.state?null:{title:l.state,body:l.attributes?.body??"",captured_at:l.attributes?.captured_at??null,source:l.attributes?.source??null}})()}}function S(s,e){if(!s||!e)return{};let t=(i,o,a={})=>s.callService(i,o,a);return{setSetpoint:i=>t("number","set_value",{entity_id:e.entityIds.setpoint,value:i}),setSmokeLevel:i=>t("number","set_value",{entity_id:e.entityIds.smoke_level,value:i}),setProbeTarget:(i,o)=>t("number","set_value",{entity_id:e.entityIds[`probe_${i}_target`],value:o}),toggle:i=>{let o=e.entityIds[i],a=s.states[o]?.state==="on";return t("switch",a?"turn_off":"turn_on",{entity_id:o})},setText:(i,o)=>t("text","set_value",{entity_id:e.entityIds[i],value:o??""}),powerOff:()=>t("climate","set_hvac_mode",{entity_id:e.entityIds.climate,hvac_mode:"off"})}}var n={bg:"#0d1117",panel:"#161b22",panelBorder:"#30363d",text:"#e6edf3",textDim:"#8b949e",accent:"#fb923c",accentDim:"#9a3412",cool:"#3b82f6",hot:"#ef4444",steady:"#22c55e",smoke:"#a78bfa",alarm:"#f87171",stall:"#f59e0b",probe1:"#ef4444",probe2:"#06b6d4",chartChamber:"#fb923c",chartProbe1:"#ef4444",chartProbe2:"#06b6d4"},D=5;var B=`
  :host {
    display: block;
    color: ${n.text};
    font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
  }
  .card {
    background: ${n.bg};
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
    background: ${n.panel};
    border: 1px solid ${n.panelBorder};
    border-radius: 10px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .panel.tall { padding: 16px 14px; }
  .panel-label {
    font-size: 11px;
    color: ${n.textDim};
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
    color: ${n.textDim};
    font-weight: 400;
    margin-left: 4px;
  }
  .big-temp.over   { color: ${n.hot}; }
  .big-temp.under  { color: ${n.cool}; }
  .big-temp.steady { color: ${n.steady}; }
  .delta {
    font-size: 13px;
    color: ${n.textDim};
    margin-top: 2px;
  }
  .chip-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .chip {
    background: ${n.bg};
    border: 1px solid ${n.panelBorder};
    border-radius: 999px;
    padding: 3px 10px;
    font-size: 11px;
    color: ${n.textDim};
  }
  .chip.active   { border-color: ${n.accent}; color: ${n.accent}; }
  .chip.smoke    { border-color: ${n.smoke};  color: ${n.smoke};  }
  .chip.alarm    { border-color: ${n.alarm};  color: ${n.alarm};  }
  .chip.stall    { border-color: ${n.stall};  color: ${n.stall};  }

  .probe {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    align-items: center;
  }
  .probe-label { font-size: 11px; color: ${n.textDim}; text-transform: uppercase; }
  .probe-temp {
    font-size: 28px;
    font-weight: 600;
    line-height: 1;
  }
  .probe-target {
    font-size: 13px;
    color: ${n.textDim};
  }
  .probe-eta {
    font-size: 14px;
    color: ${n.text};
    margin-top: 2px;
  }
  .probe-eta.fitting { color: ${n.textDim}; font-style: italic; }
  .probe-eta.stall   { color: ${n.stall}; font-weight: 500; }

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
    color: ${n.textDim};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    flex: 0 0 88px;
  }
  .stepper-input {
    background: ${n.bg};
    color: ${n.text};
    border: 1px solid ${n.panelBorder};
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
  .stepper-input:focus { outline: none; border-color: ${n.accent}; }
  .stepper-unit {
    font-size: 13px;
    color: ${n.textDim};
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
    accent-color: ${n.accent};
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
    background: ${n.panel};
    color: ${n.text};
    border: 1px solid ${n.panelBorder};
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
    font-size: 13px;
    transition: border-color 0.15s, background 0.15s;
  }
  button.action:hover { border-color: ${n.accent}; }
  button.action.on    { border-color: ${n.accent}; background: ${n.accentDim}; color: ${n.text}; }
  button.action.alarm.on { border-color: ${n.alarm}; background: #4b1d1d; }

  .session {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    align-items: center;
  }
  .session input[type="text"], .session input[type="number"] {
    background: ${n.bg};
    color: ${n.text};
    border: 1px solid ${n.panelBorder};
    border-radius: 6px;
    padding: 6px 8px;
    width: 100%;
    box-sizing: border-box;
    font-size: 13px;
  }
  .session input:focus { outline: none; border-color: ${n.accent}; }
  .session-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rec-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${n.textDim};
  }
  .rec-dot.live { background: ${n.alarm}; box-shadow: 0 0 8px ${n.alarm}; }

  .chart-host {
    width: 100%;
    min-height: 240px;
    background: ${n.panel};
    border: 1px solid ${n.panelBorder};
    border-radius: 10px;
    overflow: hidden;
  }
  .chart-host canvas { display: block; width: 100%; height: 240px; }

  .alarm-banner {
    background: #4b1d1d;
    border: 1px solid ${n.alarm};
    color: ${n.text};
    padding: 8px 12px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
  .alarm-banner.dim {
    background: ${n.panel};
    border-color: ${n.panelBorder};
    color: ${n.textDim};
  }
  .alarm-dismiss {
    background: transparent;
    color: ${n.text};
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
  .small { font-size: 11px; color: ${n.textDim}; }
  .env-line { margin-top: 6px; }
  .env-line strong { color: ${n.text}; font-weight: 500; }

  @media (max-width: 600px) {
    .row { grid-template-columns: 1fr; }
  }

  /* Tab strip */
  .tab-strip {
    display: flex;
    gap: 4px;
    background: ${n.panel};
    border-radius: 10px;
    padding: 4px;
    border: 1px solid ${n.panelBorder};
  }
  .tab {
    flex: 1;
    background: transparent;
    color: ${n.textDim};
    border: none;
    border-radius: 7px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.15s, color 0.15s;
  }
  .tab:hover { color: ${n.text}; }
  .tab.active {
    background: ${n.bg};
    color: ${n.accent};
    border: 1px solid ${n.panelBorder};
  }

  /* Setup view */
  .setup-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px 16px;
    align-items: center;
  }
  .setup-key { color: ${n.textDim}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
  .setup-val { color: ${n.text}; font-size: 14px; }
  .setup-val.bad { color: ${n.alarm}; }
  .setup-link {
    color: ${n.accent};
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
  .resolved-badge.ok  { color: ${n.steady}; border-color: ${n.steady}; background: rgba(34, 197, 94, 0.08); }
  .resolved-badge.bad { color: ${n.alarm};  border-color: ${n.alarm};  background: rgba(248, 113, 113, 0.08); }
  /* Setup uses 3-col grid for sensor rows (label / input / badge) */
  [data-slot="setup"] .sensor-grid {
    grid-template-columns: auto 1fr auto;
  }
  .cand-host {
    grid-column: 2 / -1;
    margin-top: -2px;
  }
  .cand-row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .cand-chip {
    background: ${n.bg};
    color: ${n.textDim};
    border: 1px solid ${n.panelBorder};
    border-radius: 999px;
    padding: 3px 10px;
    cursor: pointer;
    font-size: 11px;
    font-family: monospace;
    transition: border-color 0.15s, color 0.15s;
  }
  .cand-chip:hover    { border-color: ${n.accent}; color: ${n.text}; }
  .cand-chip.selected { border-color: ${n.accent}; color: ${n.accent}; background: ${n.accentDim}; }
  code {
    background: ${n.bg};
    border: 1px solid ${n.panelBorder};
    border-radius: 4px;
    padding: 1px 4px;
    font-size: 11px;
  }
`;var W="apexcharts-card",E=class{constructor(e){this._host=e,this._mode=null,this._apexEl=null,this._canvas=null,this._series={},this._historyLoaded=!1,this._lastConfig=null}async update(e,t){let i=t.join("|");if(i!==this._lastConfig&&(this._lastConfig=i,this._historyLoaded=!1,this._series={},this._host.innerHTML="",this._mode=customElements.get(W)?"apex":"canvas",this._mode==="apex"?this._mountApex(t):this._mountCanvas()),this._mode==="apex"){this._apexEl.hass=e;return}this._historyLoaded||(this._historyLoaded=!0,await this._loadHistory(e,t)),this._appendLive(e,t),this._draw(t)}_mountApex(e){let t=e.map((o,a)=>({entity:o,name:this._labelFor(o),yaxis_id:"temp",color:[n.chartChamber,n.chartProbe1,n.chartProbe2][a]||"#fff",type:a===0?"area":"line",opacity:a===0?.25:1,stroke_width:2})),i=document.createElement(W);i.setConfig({header:{show:!1},graph_span:`${k}h`,update_interval:`${H/1e3}s`,yaxis:[{id:"temp",decimals:0,apex_config:{title:{text:"\xB0F"},forceNiceScale:!0}}],series:t}),this._apexEl=i,this._host.appendChild(i)}_mountCanvas(){this._canvas=document.createElement("canvas"),this._host.appendChild(this._canvas)}async _loadHistory(e,t){let a=`history/period/${new Date(Date.now()-k*3600*1e3).toISOString()}?filter_entity_id=${t.join(",")}&minimal_response`;try{let r=await e.callApi("GET",a);for(let c=0;c<t.length;c++){let u=t[c],m=(r?.[c]??[]).map(l=>[Date.parse(l.last_changed),parseFloat(l.state)]).filter(([l,p])=>Number.isFinite(l)&&Number.isFinite(p));this._series[u]=m}}catch(r){console.warn("[ha-prime-polaris-card] history fetch failed:",r)}}_appendLive(e,t){let i=Date.now(),o=i-k*3600*1e3;for(let a of t){let r=this._series[a]??(this._series[a]=[]),c=parseFloat(e.states[a]?.state);if(Number.isFinite(c)){let u=r.length?r[r.length-1][0]:0;i-u>=5e3&&r.push([i,c])}for(;r.length&&r[0][0]<o;)r.shift()}}_draw(e){let t=this._canvas;if(!t)return;let i=window.devicePixelRatio||1,o=t.clientWidth||600,a=240;t.width=o*i,t.height=a*i;let r=t.getContext("2d");r.scale(i,i),r.clearRect(0,0,o,a);let c=e.flatMap(h=>this._series[h]??[]);if(c.length<2){r.fillStyle=n.textDim,r.font="12px system-ui",r.fillText("collecting data\u2026",16,24);return}let u=c.map(h=>h[0]),m=c.map(h=>h[1]),l=Math.min(...u),p=Math.max(...u),d=Math.min(...m)-5,x=Math.max(...m)+5,f={l:36,r:12,t:12,b:22},v=h=>f.l+(h-l)/Math.max(1,p-l)*(o-f.l-f.r),g=h=>f.t+(1-(h-d)/Math.max(1,x-d))*(a-f.t-f.b);r.strokeStyle=n.panelBorder,r.fillStyle=n.textDim,r.font="11px system-ui",r.lineWidth=1;let z=4;for(let h=0;h<=z;h++){let w=d+h/z*(x-d),b=g(w);r.beginPath(),r.moveTo(f.l,b),r.lineTo(o-f.r,b),r.stroke(),r.fillText(w.toFixed(0),6,b+4)}let N=[n.chartChamber,n.chartProbe1,n.chartProbe2];e.forEach((h,w)=>{let b=this._series[h]??[];if(!(b.length<2)){if(r.strokeStyle=N[w]||"#fff",r.lineWidth=w===0?1.5:2,w===0){r.fillStyle=N[0]+"40",r.beginPath(),r.moveTo(v(b[0][0]),g(d));for(let[T,A]of b)r.lineTo(v(T),g(A));r.lineTo(v(b[b.length-1][0]),g(d)),r.closePath(),r.fill()}r.beginPath(),r.moveTo(v(b[0][0]),g(b[0][1]));for(let[T,A]of b)r.lineTo(v(T),g(A));r.stroke()}})}_labelFor(e){return e.includes("chamber")?"Chamber":e.includes("probe_1")?"Probe 1":e.includes("probe_2")?"Probe 2":e}};var F=-135,V=135,le=V-F;function Y(s){let e=s.size??220,t=e/2,i=e/2,o=e/2-18,a=s.min,r=s.max,c=s.current??a,u=s.target??a,m=j(c,a,r),l=j(u,a,r),p=s.fillColor??ce(c,u),d=U(t,i,o,F,V),x=U(t,i,o,F,m),f=R(t,i,o-10,l),v=R(t,i,o+10,l);return`
    <svg
      viewBox="0 0 ${e} ${e}"
      class="arc-gauge"
      data-gauge="true"
      data-min="${a}"
      data-max="${r}"
      data-cx="${t}"
      data-cy="${i}"
      data-r="${o}">

      <!-- track -->
      <path d="${d}"
        stroke="${n.panelBorder}"
        stroke-width="12"
        stroke-linecap="round"
        fill="none" />

      <!-- filled arc up to current -->
      <path d="${x}"
        stroke="${p}"
        stroke-width="12"
        stroke-linecap="round"
        fill="none" />

      <!-- setpoint marker tick -->
      <line
        x1="${f.x}" y1="${f.y}"
        x2="${v.x}" y2="${v.y}"
        stroke="${n.accent}"
        stroke-width="3"
        stroke-linecap="round" />

      <!-- center readout: big chamber temp, small target -->
      <text x="${t}" y="${i-4}"
        text-anchor="middle"
        font-size="44"
        font-weight="600"
        fill="${n.text}"
        style="font-family: inherit;">
        ${s.current!=null?s.current.toFixed(0):"\u2014"}<tspan font-size="22" fill="${n.textDim}">\xB0F</tspan>
      </text>
      <text x="${t}" y="${i+24}"
        text-anchor="middle"
        font-size="13"
        fill="${n.textDim}"
        style="font-family: inherit;">
        target ${s.target??"\u2014"}\xB0F
      </text>
    </svg>
  `}function j(s,e,t){let o=(Math.max(e,Math.min(t,s))-e)/(t-e);return F+o*le}function R(s,e,t,i){let o=(i-90)*Math.PI/180;return{x:s+t*Math.cos(o),y:e+t*Math.sin(o)}}function U(s,e,t,i,o){let a=R(s,e,t,i),r=R(s,e,t,o),c=Math.abs(o-i)>180?1:0;return`M ${a.x} ${a.y} A ${t} ${t} 0 ${c} 1 ${r.x} ${r.y}`}function ce(s,e){if(s==null||e==null)return n.accent;let t=s-e;return t>D?n.hot:t<-D?n.cool:n.steady}function _(s){return String(s??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function X(s){if(!s)return"";let{chamber:e,setpoint:t,chamberDelta:i}=s,o=i!=null?`\u0394 ${i>0?"+":""}${i.toFixed(0)}\xB0F`:"",a=t??225;return`
    <div class="panel tall arc-panel">
      <div class="panel-label">Chamber</div>
      ${Y({min:180,max:500,current:e,target:t})}
      <div class="delta">${o}</div>
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
  `}function Q(s){if(!s)return"";let e=[];return s.runningStatus&&e.push({cls:"active",txt:G(s.runningStatus)}),e.push({cls:s.activeMode==="smoke"?"smoke":"active",txt:`Mode: ${G(s.activeMode)}`}),s.smokeOn&&s.smokeLevel!=null&&e.push({cls:"smoke",txt:`Smoke ${s.smokeLevel.toFixed(0)}`}),s.alarmOn&&e.push({cls:"alarm",txt:"Alarm Armed"}),s.winterOn&&e.push({cls:"active",txt:"Winter"}),s.pushOn&&e.push({cls:"active",txt:"Push On"}),s.ambient&&e.push(s.ambientResolved.value!=null?{cls:"active",txt:`Ambient ${s.ambientResolved.value.toFixed(0)}\xB0F`}:{cls:"alarm",txt:"Ambient Unresolved"}),s.wind&&e.push(s.windResolved.value!=null?{cls:"active",txt:`Wind ${s.windResolved.value.toFixed(1)}`}:{cls:"alarm",txt:"Wind Unresolved"}),`
    <div class="chip-row">
      ${e.map(t=>`<span class="chip ${t.cls}">${_(t.txt)}</span>`).join("")}
    </div>
  `}function G(s){return s?String(s).split(/(\s+)/).map(e=>e.length===0||/\s+/.test(e)?e:e[0].toUpperCase()+e.slice(1).toLowerCase()).join(""):""}function Z(s){if(!s)return"";let e=s.cookSession,t=e?s.protein?`${_(s.protein)}${s.weight_lb?" \xB7 "+_(s.weight_lb)+" lb":""}`:"recording":"no active cook",i=s.notes?_(s.notes):e?"":"flip the switch when you start a real cook",o=[];s.ambientResolved.value!=null&&o.push(`ambient <strong>${s.ambientResolved.value.toFixed(0)}\xB0F</strong>`),s.windResolved.value!=null&&o.push(`wind <strong>${s.windResolved.value.toFixed(1)}</strong>`);let a=o.length?`<div class="small env-line">${o.join(" \xB7 ")}</div>`:"";return`
    <div class="panel tall">
      <div class="panel-label">Cook session</div>
      <div class="session-toggle">
        <span class="rec-dot ${e?"live":""}"></span>
        <button class="action ${e?"on":""}" data-action="toggle-session">
          ${e?"Stop session":"Start session"}
        </button>
      </div>
      <div class="big-temp" style="font-size:22px; margin-top:8px;">${t}</div>
      <div class="small">${i}</div>
      ${a}
    </div>
  `}function q(s,e){if(e.temp==null)return`
      <div class="panel">
        <div class="probe">
          <div class="probe-label">Probe ${s}</div>
          <div class="small">not connected</div>
        </div>
      </div>
    `;let t="fitting\u2026",i="fitting";if(e.in_stall)t=`\u{1F6D1} in stall \xB7 \u03C3 ${e.stdev?.toFixed(2)??"\u2014"}\xB0F`,i="stall";else if(e.minutes!=null){let o=Math.max(0,e.minutes);t=o>=60?`ETA ${(o/60).toFixed(1)} h`:`ETA ${o.toFixed(0)} min`,i=""}return`
    <div class="panel">
      <div class="probe">
        <div class="probe-label">Probe ${s}</div>
        <div>
          <div class="probe-temp">${e.temp.toFixed(0)}\xB0F</div>
          <div class="probe-target">\u2192 ${e.target??"\u2014"}\xB0F</div>
          <div class="probe-eta ${i}">${_(t)}</div>
          ${e.source?`<div class="small">prior: ${_(e.source)}</div>`:""}
        </div>
      </div>
    </div>
  `}function J(s){return s?`
    <div class="row">
      ${q(1,s.probe1)}
      ${q(2,s.probe2)}
    </div>
  `:""}function K(s){if(!s)return"";let e=s.smokeLevel??0;return`
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
        <button class="action ${s.smokeOn?"on":""}" data-action="toggle-smoke">Smoke</button>
        <button class="action ${s.winterOn?"on":""}" data-action="toggle-winter">Winter</button>
        <button class="action alarm ${s.alarmOn?"on":""}" data-action="toggle-alarm">Alarm</button>
        <button class="action ${s.pushOn?"on":""}" data-action="toggle-push">Push</button>
        <button class="action" data-action="power-off">Power off</button>
      </div>
    </div>
  `}function ee(s){return s?`
    <div class="panel">
      <div class="panel-label">This cook</div>
      <div class="session">
        <label>Protein</label>
        <input type="text" data-input="protein"   value="${_(s.protein)}"   placeholder="brisket / pork / ribs">
        <label>Weight (lb)</label>
        <input type="text" data-input="weight_lb" value="${_(s.weight_lb)}" placeholder="16">
        <label>Notes</label>
        <input type="text" data-input="notes"     value="${_(s.notes)}"     placeholder="oak, low and slow">
      </div>
      <div class="small" style="margin-top:8px;">
        Ambient / wind sensors are configured once in the
        <strong>Setup</strong> tab and persist across cooks.
      </div>
    </div>
  `:""}function te(s){let e=(t,i)=>`
    <button class="tab ${s===t?"active":""}"
            data-action="set-view-${t}">
      ${i}
    </button>
  `;return`
    <div class="tab-strip">
      ${e("live","Live")}
      ${e("setup","Setup")}
    </div>
  `}function se(s,e){if(!s)return"";let t=s.lastAlarm;return t?e&&e===t.captured_at?'<div class="alarm-banner dim">no alarms (dismissed)</div>':`
    <div class="alarm-banner">
      <span><strong>${_(t.title)}</strong> \xB7 ${_(t.body)}</span>
      <button class="alarm-dismiss" data-action="dismiss-alarm" title="Dismiss">\u2715</button>
    </div>
  `:'<div class="alarm-banner dim">no alarms</div>'}function y(s){return String(s??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}var ne=/\b(indoor|inside|bedroom|bathroom|kitchen|living|hallway|office|garage|attic|basement|fridge|freezer|oven|refrigerator|dishwasher|washer|dryer|cpu|gpu|battery|server|chip|water_heater|coolant|pool|spa|jacuzzi|hot_tub|aquarium|fishtank|car|vehicle|engine)\b/i,pe=/(?<![a-zA-Z])(feels[ _-]?like|apparent[ _-]?(?:temp|temperature)|dew[ _-]?point|heat[ _-]?index|wind[ _-]?chill|windchill)(?![a-zA-Z])/i,de=/\b(outdoor|outside|exterior|patio|deck|porch|backyard|yard|weather|ambient|station|pws|awn|tempest|davis|ecowitt|netatmo)\b/i,oe=/(ambient[a-z]*network|ambientweather|tempest|weatherflow|openweathermap|dark[- ]?sky|met\.no|met office|accuweather|weather\.gov|nws|pirate weather|aemet|wunderground|weatherapi|netatmo|ecowitt|davis\b|wxinsight|meteo|aprs|ambientcwop|cwop|airnow)/i,ue=/\b(mph|m\/s|km\/h|knots?)\b/i,me=/\bwind\b/i,he=/(?<![a-zA-Z])gust(?![a-zA-Z])/i;function be(s,e){if(!s)return[];let t=e?new RegExp(`^[a-z_]+\\.${e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}_`,"i"):null,i=[];for(let[o,a]of Object.entries(s.states)){if(t&&t.test(o)||ne.test(o)||pe.test(o))continue;if(o.startsWith("weather.")){let x=parseFloat(a.attributes?.temperature);Number.isFinite(x)&&i.push({eid:o,value:x,unit:"\xB0F"});continue}let r=a.attributes?.device_class,c=a.attributes?.unit_of_measurement||"";if(!(r==="temperature"||/°[FC]|degf|degc/i.test(c)))continue;let m=de.test(o),l=String(a.attributes?.attribution||""),p=oe.test(l);if(!m&&!p)continue;let d=parseFloat(a.state);Number.isFinite(d)&&i.push({eid:o,value:d,unit:c||"\xB0F"})}return i.sort((o,a)=>{let r=o.eid.startsWith("weather.")?0:1,c=a.eid.startsWith("weather.")?0:1;return r-c||o.eid.localeCompare(a.eid)}).slice(0,6)}function fe(s,e){if(!s)return[];let t=e?new RegExp(`^[a-z_]+\\.${e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}_`,"i"):null,i=[];for(let[o,a]of Object.entries(s.states)){if(t&&t.test(o)||ne.test(o)||he.test(o))continue;let r=a.attributes?.unit_of_measurement||"";if(!ue.test(r))continue;let c=me.test(o),u=String(a.attributes?.attribution||""),m=oe.test(u);if(!c&&!m)continue;let l=parseFloat(a.state);Number.isFinite(l)&&i.push({eid:o,value:l,unit:r})}return i.sort((o,a)=>o.eid.localeCompare(a.eid)).slice(0,4)}function _e(s,e,t){return s.length?`
    <div class="cand-row">
      ${s.map(i=>`
        <button class="cand-chip ${i.eid===t?"selected":""}"
                data-action="apply-default"
                data-purpose="${e}"
                data-value="${y(i.eid)}"
                title="Click to use this sensor">
          ${y(i.eid)} \xB7 ${i.value.toFixed(1)}${i.unit?" "+y(i.unit):""}
        </button>`).join("")}
    </div>
  `:""}function ie(s,e,t,i,o,a){let r="";return t&&(r=i&&i.value!=null?`<span class="resolved-badge ok">${i.value.toFixed(1)}${o}</span>`:'<span class="resolved-badge bad">unresolved</span>'),`
    <label>${s}</label>
    <input type="text" data-input="${e}" value="${y(t)}" placeholder="entity_id (e.g. sensor.outdoor_temp)">
    ${r||"<span></span>"}
    <span></span>
    <div class="cand-host">${_e(a,e,t)}</div>
    <span></span>
  `}function re(s,e,t){if(!s||!s.account)return`
      <div class="panel"><div class="small">Loading account info\u2026</div></div>
    `;let i=s.account,o=i.daysToExpiry!=null&&i.daysToExpiry<14?"bad":"";return`
    <div class="panel">
      <div class="panel-label">Account</div>
      <div class="setup-grid">
        <span class="setup-key">Email</span>
        <span class="setup-val">${y(i.email||"\u2014")}</span>

        <span class="setup-key">Token expires</span>
        <span class="setup-val ${o}">
          ${i.daysToExpiry!=null?`in ${i.daysToExpiry} days`:"\u2014"}
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
          <button class="action ${s.pushOn?"on":""}" data-action="toggle-push">
            ${s.pushOn?"ON":"OFF"}
          </button>
        </span>

        <span class="setup-key">Dedupe window</span>
        <span class="setup-val">
          <input type="number" min="10" max="3600" step="10"
                 class="stepper-input"
                 data-input="push_dedupe"
                 value="${s.pushDedupe??60}">
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
      <div class="small" style="margin-bottom:10px;">
        Point these at any HA temperature / wind sensor. Common picks:
        a <strong>weather.*</strong> entity (HA's default weather integration),
        a <strong>sensor.*</strong> from your weather station / Ambient Weather Network,
        or just a fixed number (e.g. <code>32</code>) for cooks at a known temp.
        Set once \u2014 per-cook overrides on the Live tab take precedence if you ever deviate.
      </div>
      <div class="session sensor-grid">
        ${ie("Ambient sensor","ambient",s.ambient,s.ambientResolved,"\xB0F",be(t,e?.entity_prefix))}
        ${ie("Wind sensor","wind",s.wind,s.windResolved,"",fe(t,e?.entity_prefix))}
      </div>
      <div class="small" style="margin-top:8px;">
        \u{1F4A1} Suggestions match weather-integration sources:
        <strong>weather.*</strong> entities, sensors with outdoor hints in their
        entity_id, OR sensors whose <em>attribution</em> attribute names a known
        weather provider (AWN, Tempest, OpenWeatherMap, NWS, AccuWeather, etc).
        If yours doesn't appear, just type the entity_id manually.
      </div>
    </div>
  `}var P=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._state=null,this._chart=null,this._view="live",this._dismissedAlarmId=null,this._renderQueued=!1}setConfig(e){this._config={entity_prefix:e?.entity_prefix??C,title:e?.title??null,ambient_entity:e?.ambient_entity??null,...e},this._lastSig=null}set hass(e){this._hass=e,this._config&&(this._state=I(e,this._config.entity_prefix),this._scheduleRender())}getCardSize(){return 8}static getConfigElement(){return null}static getStubConfig(){return{entity_prefix:C}}_scheduleRender(){this._renderQueued||(this._renderQueued=!0,requestAnimationFrame(()=>{this._renderQueued=!1,this._render()}))}_render(){let e=this._state;(!this.shadowRoot.firstElementChild||this.shadowRoot.firstElementChild.dataset.view!==this._view)&&(this._stampShell(),this._wireEvents()),this._fill("tabs",te(this._view)),this._view==="live"?this._renderLive(e):this._renderSetup(e)}_stampShell(){let e=`
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
    `,t=`
      <div data-slot="setup"></div>
    `;this.shadowRoot.innerHTML=`
      <style>${B}</style>
      <div class="card" data-view="${this._view}">
        <div data-slot="tabs"></div>
        ${this._view==="live"?e:t}
      </div>
    `,this._view!=="live"&&(this._chart=null)}_renderLive(e){if(this._fill("alarm",se(e,this._dismissedAlarmId)),this._fill("chips",Q(e)),this._fill("cookHeader",Z(e)),this._fill("probes",J(e)),this._fillPreserveFocus("chamber",X(e)),this._fillPreserveFocus("controls",K(e)),this._fillPreserveFocus("session",ee(e)),this._hass&&e){if(!this._chart){let i=this.shadowRoot.querySelector('[data-slot="chart"]');this._chart=new E(i)}let t=[e.entityIds.chamber_temp,e.entityIds.probe_1_temp,e.entityIds.probe_2_temp];this._chart.update(this._hass,t)}}_renderSetup(e){this._fillPreserveFocus("setup",re(e,this._config,this._hass))}_fill(e,t){let i=this.shadowRoot.querySelector(`[data-slot="${e}"]`);i&&(i.innerHTML=t)}_fillPreserveFocus(e,t){let i=this.shadowRoot.querySelector(`[data-slot="${e}"]`);if(!i)return;let o=this.shadowRoot.activeElement;if(!(o&&o.dataset?.input&&i.contains(o))){i.innerHTML=t;return}let r=o.dataset.input,c=o.value,u=o.selectionStart,m=o.selectionEnd;i.innerHTML=t;let l=i.querySelector(`[data-input="${r}"]`);if(l){l.value=c,l.focus();try{l.setSelectionRange(u,m)}catch{}}}_wireEvents(){this.shadowRoot.addEventListener("click",e=>{let t=e.target.closest("[data-action]");if(t){if(t.dataset.action==="apply-default"){let i=t.dataset.purpose,o=t.dataset.value;if(!this._hass||!this._state||!i)return;let r={ambient:"ambient_override",wind:"wind_override"}[i];r&&S(this._hass,this._state).setText(r,o);return}this._dispatchAction(t.dataset.action)}}),this.shadowRoot.addEventListener("change",e=>{let t=e.target.closest("[data-input]");if(!t)return;let i=S(this._hass,this._state),o=t.dataset.input;if(o==="setpoint"){let r=parseInt(t.value,10);Number.isFinite(r)&&i.setSetpoint(Math.max(180,Math.min(500,r)));return}if(o==="smoke_level"){let r=parseInt(t.value,10);Number.isFinite(r)&&i.setSmokeLevel(Math.max(0,Math.min(10,r)));return}if(o==="push_dedupe"){let r=parseInt(t.value,10);Number.isFinite(r)&&this._hass.callService("number","set_value",{entity_id:this._state.entityIds.push_dedupe,value:Math.max(10,Math.min(3600,r))});return}let a={notes:"notes",protein:"protein",weight_lb:"weight_lb",ambient:"ambient_override",wind:"wind_override"};a[o]&&i.setText(a[o],t.value)}),this.shadowRoot.addEventListener("input",e=>{let t=e.target.closest('[data-input="smoke_level"]');if(!t)return;let i=this.shadowRoot.querySelector('[data-bind="smoke-level-readout"]');i&&(i.textContent=t.value)})}_dispatchAction(e){if(!this._hass||!this._state)return;let t=S(this._hass,this._state),i=this._state.setpoint??225;switch(e){case"toggle-session":t.toggle("cook_session");break;case"toggle-smoke":t.toggle("smoke_mode");break;case"toggle-winter":t.toggle("winter_mode");break;case"toggle-alarm":t.toggle("alarm");break;case"toggle-push":t.toggle("push_alerts");break;case"temp-up":t.setSetpoint(Math.min(500,i+1));break;case"temp-down":t.setSetpoint(Math.max(180,i-1));break;case"power-off":t.powerOff();break;case"set-view-live":this._view="live",this._scheduleRender();break;case"set-view-setup":this._view="setup",this._scheduleRender();break;case"dismiss-alarm":this._state?.lastAlarm&&(this._dismissedAlarmId=this._state.lastAlarm.captured_at,this._scheduleRender());break}}};customElements.get($)||customElements.define($,P);window.customCards=window.customCards||[];window.customCards.some(s=>s.type===$)||window.customCards.push({type:$,name:"Prime Polaris Grill",description:"Live cook dashboard for the Prime Polaris pellet grill integration.",preview:!0});console.info(`%c ${$} %c v${O} `,"color:#fb923c;background:#0d1117;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:600","color:#0d1117;background:#fb923c;padding:2px 6px;border-radius:0 3px 3px 0");
