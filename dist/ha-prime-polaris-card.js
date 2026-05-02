var $="ha-prime-polaris-card",z="0.2.2",T="grill",R={climate:"climate.{prefix}",chamber_temp:"sensor.{prefix}_chamber_temperature",running_status:"sensor.{prefix}_running_status",active_mode:"sensor.{prefix}_active_mode",active_smoke_level:"sensor.{prefix}_active_smoke_level",last_alarm:"sensor.{prefix}_last_alarm",probe_1_temp:"sensor.{prefix}_probe_1_temperature",probe_2_temp:"sensor.{prefix}_probe_2_temperature",probe_1_eta:"sensor.{prefix}_probe_1_eta",probe_2_eta:"sensor.{prefix}_probe_2_eta",setpoint:"number.{prefix}_temperature",smoke_level:"number.{prefix}_smoke_level",probe_1_target:"number.{prefix}_probe_1_target",probe_2_target:"number.{prefix}_probe_2_target",push_dedupe:"number.{prefix}_push_alert_dedupe",smoke_mode:"switch.{prefix}_smoke_mode",winter_mode:"switch.{prefix}_winter_mode",alarm:"switch.{prefix}_temperature_alarm",cook_session:"switch.{prefix}_cook_session",push_alerts:"switch.{prefix}_push_alerts",notes:"text.{prefix}_cook_notes",protein:"text.{prefix}_cook_protein",weight_lb:"text.{prefix}_cook_weight_lb",ambient_override:"text.{prefix}_cook_ambient_override",wind_override:"text.{prefix}_cook_wind_override"},y=4,H=3e4;var oe=/^[a-z_]+\.[a-z0-9_]+$/;function O(s,e,t){let o={value:null,source:""};if(!s||!e)return o;if(oe.test(e)){let a=s.states[e];if(!a)return{value:null,source:`${e} (missing)`};if(e.startsWith("weather.")&&a.attributes?.[t]!=null){let c=parseFloat(a.attributes[t]);return Number.isFinite(c)?{value:c,source:e}:o}let n=parseFloat(a.state);return Number.isFinite(n)?{value:n,source:e}:o}let r=parseFloat(e);return Number.isFinite(r)?{value:r,source:"literal"}:o}function N(s,e){if(!s)return null;let t=l=>R[l].replace("{prefix}",e),o=l=>s.states[t(l)]??null,r=l=>{let p=o(l);if(!p)return null;let d=parseFloat(p.state);return Number.isFinite(d)?d:null},a=l=>o(l)?.state==="on",n=l=>{let p=o(l);return p?p.state==="unknown"||p.state==="unavailable"?"":p.state:""},c=l=>{let p=o(l===1?"probe_1_eta":"probe_2_eta");if(!p)return{minutes:null,in_stall:!1,stdev:null,source:null};let d=parseFloat(p.state);return{minutes:Number.isFinite(d)?d:null,in_stall:!!p.attributes?.in_stall,stdev:p.attributes?.stall_stdev??null,source:p.attributes?.prior_source??null,samples:p.attributes?.samples??0}},m=o("climate"),h=r("setpoint")??m?.attributes?.temperature??null;return{prefix:e,entityIds:Object.fromEntries(Object.keys(R).map(l=>[l,t(l)])),chamber:r("chamber_temp")??m?.attributes?.current_temperature??null,setpoint:h,chamberDelta:r("chamber_temp")!=null&&h!=null?r("chamber_temp")-h:null,runningStatus:n("running_status")||null,activeMode:n("active_mode")||"off",smokeLevel:r("active_smoke_level"),smokeOn:a("smoke_mode"),winterOn:a("winter_mode"),alarmOn:a("alarm"),probe1:{temp:r("probe_1_temp"),target:r("probe_1_target"),...c(1)},probe2:{temp:r("probe_2_temp"),target:r("probe_2_target"),...c(2)},cookSession:a("cook_session"),notes:n("notes"),protein:n("protein"),weight_lb:n("weight_lb"),ambient:n("ambient_override"),wind:n("wind_override"),ambientResolved:O(s,n("ambient_override"),"temperature"),windResolved:O(s,n("wind_override"),"wind_speed"),pushOn:a("push_alerts"),pushDedupe:r("push_dedupe"),account:(()=>{let l=o("climate"),p=l?.attributes?.email??null,d=l?.attributes?.token_expiry??null,x=d?Math.max(0,Math.round((d*1e3-Date.now())/864e5)):null;return{email:p,daysToExpiry:x}})(),lastAlarm:(()=>{let l=o("last_alarm");return!l||l.state==="unknown"||l.state==="unavailable"||!l.state?null:{title:l.state,body:l.attributes?.body??"",captured_at:l.attributes?.captured_at??null,source:l.attributes?.source??null}})()}}function M(s,e){if(!s||!e)return{};let t=(o,r,a={})=>s.callService(o,r,a);return{setSetpoint:o=>t("number","set_value",{entity_id:e.entityIds.setpoint,value:o}),setSmokeLevel:o=>t("number","set_value",{entity_id:e.entityIds.smoke_level,value:o}),setProbeTarget:(o,r)=>t("number","set_value",{entity_id:e.entityIds[`probe_${o}_target`],value:r}),toggle:o=>{let r=e.entityIds[o],a=s.states[r]?.state==="on";return t("switch",a?"turn_off":"turn_on",{entity_id:r})},setText:(o,r)=>t("text","set_value",{entity_id:e.entityIds[o],value:r??""}),powerOff:()=>t("climate","set_hvac_mode",{entity_id:e.entityIds.climate,hvac_mode:"off"})}}var i={bg:"#0d1117",panel:"#161b22",panelBorder:"#30363d",text:"#e6edf3",textDim:"#8b949e",accent:"#fb923c",accentDim:"#9a3412",cool:"#3b82f6",hot:"#ef4444",steady:"#22c55e",smoke:"#a78bfa",alarm:"#f87171",stall:"#f59e0b",probe1:"#ef4444",probe2:"#06b6d4",chartChamber:"#fb923c",chartProbe1:"#ef4444",chartProbe2:"#06b6d4"},A=5;var I=`
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
`;var B="apexcharts-card",k=class{constructor(e){this._host=e,this._mode=null,this._apexEl=null,this._canvas=null,this._series={},this._historyLoaded=!1,this._lastConfig=null}async update(e,t){let o=t.join("|");if(o!==this._lastConfig&&(this._lastConfig=o,this._historyLoaded=!1,this._series={},this._host.innerHTML="",this._mode=customElements.get(B)?"apex":"canvas",this._mode==="apex"?this._mountApex(t):this._mountCanvas()),this._mode==="apex"){this._apexEl.hass=e;return}this._historyLoaded||(this._historyLoaded=!0,await this._loadHistory(e,t)),this._appendLive(e,t),this._draw(t)}_mountApex(e){let t=e.map((r,a)=>({entity:r,name:this._labelFor(r),yaxis_id:"temp",color:[i.chartChamber,i.chartProbe1,i.chartProbe2][a]||"#fff",type:a===0?"area":"line",opacity:a===0?.25:1,stroke_width:2})),o=document.createElement(B);o.setConfig({header:{show:!1},graph_span:`${y}h`,update_interval:`${H/1e3}s`,yaxis:[{id:"temp",decimals:0,apex_config:{title:{text:"\xB0F"},forceNiceScale:!0}}],series:t}),this._apexEl=o,this._host.appendChild(o)}_mountCanvas(){this._canvas=document.createElement("canvas"),this._host.appendChild(this._canvas)}async _loadHistory(e,t){let a=`history/period/${new Date(Date.now()-y*3600*1e3).toISOString()}?filter_entity_id=${t.join(",")}&minimal_response`;try{let n=await e.callApi("GET",a);for(let c=0;c<t.length;c++){let m=t[c],h=(n?.[c]??[]).map(l=>[Date.parse(l.last_changed),parseFloat(l.state)]).filter(([l,p])=>Number.isFinite(l)&&Number.isFinite(p));this._series[m]=h}}catch(n){console.warn("[ha-prime-polaris-card] history fetch failed:",n)}}_appendLive(e,t){let o=Date.now(),r=o-y*3600*1e3;for(let a of t){let n=this._series[a]??(this._series[a]=[]),c=parseFloat(e.states[a]?.state);if(Number.isFinite(c)){let m=n.length?n[n.length-1][0]:0;o-m>=5e3&&n.push([o,c])}for(;n.length&&n[0][0]<r;)n.shift()}}_draw(e){let t=this._canvas;if(!t)return;let o=window.devicePixelRatio||1,r=t.clientWidth||600,a=240;t.width=r*o,t.height=a*o;let n=t.getContext("2d");n.scale(o,o),n.clearRect(0,0,r,a);let c=e.flatMap(u=>this._series[u]??[]);if(c.length<2){n.fillStyle=i.textDim,n.font="12px system-ui",n.fillText("collecting data\u2026",16,24);return}let m=c.map(u=>u[0]),h=c.map(u=>u[1]),l=Math.min(...m),p=Math.max(...m),d=Math.min(...h)-5,x=Math.max(...h)+5,_={l:36,r:12,t:12,b:22},w=u=>_.l+(u-l)/Math.max(1,p-l)*(r-_.l-_.r),v=u=>_.t+(1-(u-d)/Math.max(1,x-d))*(a-_.t-_.b);n.strokeStyle=i.panelBorder,n.fillStyle=i.textDim,n.font="11px system-ui",n.lineWidth=1;let P=4;for(let u=0;u<=P;u++){let g=d+u/P*(x-d),b=v(g);n.beginPath(),n.moveTo(_.l,b),n.lineTo(r-_.r,b),n.stroke(),n.fillText(g.toFixed(0),6,b+4)}let L=[i.chartChamber,i.chartProbe1,i.chartProbe2];e.forEach((u,g)=>{let b=this._series[u]??[];if(!(b.length<2)){if(n.strokeStyle=L[g]||"#fff",n.lineWidth=g===0?1.5:2,g===0){n.fillStyle=L[0]+"40",n.beginPath(),n.moveTo(w(b[0][0]),v(d));for(let[F,E]of b)n.lineTo(w(F),v(E));n.lineTo(w(b[b.length-1][0]),v(d)),n.closePath(),n.fill()}n.beginPath(),n.moveTo(w(b[0][0]),v(b[0][1]));for(let[F,E]of b)n.lineTo(w(F),v(E));n.stroke()}})}_labelFor(e){return e.includes("chamber")?"Chamber":e.includes("probe_1")?"Probe 1":e.includes("probe_2")?"Probe 2":e}};var S=-135,G=135,ne=G-S;function X(s){let e=s.size??220,t=e/2,o=e/2,r=e/2-18,a=s.min,n=s.max,c=s.current??a,m=s.target??a,h=Y(c,a,n),l=Y(m,a,n),p=s.fillColor??re(c,m),d=V(t,o,r,S,G),x=V(t,o,r,S,h),_=C(t,o,r,l);return`
    <svg
      viewBox="0 0 ${e} ${e}"
      class="arc-gauge"
      data-gauge="true"
      data-min="${a}"
      data-max="${n}"
      data-cx="${t}"
      data-cy="${o}"
      data-r="${r}">

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
      <circle cx="${_.x}" cy="${_.y}" r="11"
        fill="${i.accent}"
        stroke="${i.text}"
        stroke-width="2" />

      <!-- center readout: big chamber temp, small target -->
      <text x="${t}" y="${o-4}"
        text-anchor="middle"
        font-size="44"
        font-weight="600"
        fill="${i.text}"
        style="font-family: inherit;">
        ${s.current!=null?s.current.toFixed(0):"\u2014"}<tspan font-size="22" fill="${i.textDim}">\xB0F</tspan>
      </text>
      <text x="${t}" y="${o+24}"
        text-anchor="middle"
        font-size="13"
        fill="${i.textDim}"
        style="font-family: inherit;">
        target ${s.target??"\u2014"}\xB0F
      </text>
    </svg>
  `}function Y(s,e,t){let r=(Math.max(e,Math.min(t,s))-e)/(t-e);return S+r*ne}function C(s,e,t,o){let r=(o-90)*Math.PI/180;return{x:s+t*Math.cos(r),y:e+t*Math.sin(r)}}function V(s,e,t,o,r){let a=C(s,e,t,o),n=C(s,e,t,r),c=Math.abs(r-o)>180?1:0;return`M ${a.x} ${a.y} A ${t} ${t} 0 ${c} 1 ${n.x} ${n.y}`}function re(s,e){if(s==null||e==null)return i.accent;let t=s-e;return t>A?i.hot:t<-A?i.cool:i.steady}function f(s){return String(s??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function W(s){if(!s)return"";let{chamber:e,setpoint:t,chamberDelta:o}=s,r=o!=null?`\u0394 ${o>0?"+":""}${o.toFixed(0)}\xB0F`:"",a=t??225;return`
    <div class="panel tall arc-panel">
      <div class="panel-label">Chamber</div>
      ${X({min:180,max:500,current:e,target:t})}
      <div class="delta">${r}</div>
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
  `}function j(s){if(!s)return"";let e=[];return s.runningStatus&&e.push({cls:"active",txt:s.runningStatus}),e.push({cls:s.activeMode==="smoke"?"smoke":"active",txt:`mode: ${s.activeMode}`}),s.smokeOn&&s.smokeLevel!=null&&e.push({cls:"smoke",txt:`smoke ${s.smokeLevel.toFixed(0)}`}),s.alarmOn&&e.push({cls:"alarm",txt:"alarm armed"}),s.winterOn&&e.push({cls:"active",txt:"winter"}),s.pushOn&&e.push({cls:"active",txt:"push on"}),s.ambient&&e.push(s.ambientResolved.value!=null?{cls:"active",txt:`ambient ${s.ambientResolved.value.toFixed(0)}\xB0F`}:{cls:"alarm",txt:"ambient unresolved"}),s.wind&&e.push(s.windResolved.value!=null?{cls:"active",txt:`wind ${s.windResolved.value.toFixed(1)}`}:{cls:"alarm",txt:"wind unresolved"}),`
    <div class="chip-row">
      ${e.map(t=>`<span class="chip ${t.cls}">${f(t.txt)}</span>`).join("")}
    </div>
  `}function U(s){if(!s)return"";let e=s.cookSession,t=e?s.protein?`${f(s.protein)}${s.weight_lb?" \xB7 "+f(s.weight_lb)+" lb":""}`:"recording":"no active cook",o=s.notes?f(s.notes):e?"":"flip the switch when you start a real cook";return`
    <div class="panel tall">
      <div class="panel-label">Cook session</div>
      <div class="session-toggle">
        <span class="rec-dot ${e?"live":""}"></span>
        <button class="action ${e?"on":""}" data-action="toggle-session">
          ${e?"Stop session":"Start session"}
        </button>
      </div>
      <div class="big-temp" style="font-size:22px; margin-top:8px;">${t}</div>
      <div class="small">${o}</div>
    </div>
  `}function q(s,e){if(e.temp==null)return`
      <div class="panel">
        <div class="probe">
          <div class="probe-label">Probe ${s}</div>
          <div class="small">not connected</div>
        </div>
      </div>
    `;let t="fitting\u2026",o="fitting";if(e.in_stall)t=`\u{1F6D1} in stall \xB7 \u03C3 ${e.stdev?.toFixed(2)??"\u2014"}\xB0F`,o="stall";else if(e.minutes!=null){let r=Math.max(0,e.minutes);t=r>=60?`ETA ${(r/60).toFixed(1)} h`:`ETA ${r.toFixed(0)} min`,o=""}return`
    <div class="panel">
      <div class="probe">
        <div class="probe-label">Probe ${s}</div>
        <div>
          <div class="probe-temp">${e.temp.toFixed(0)}\xB0F</div>
          <div class="probe-target">\u2192 ${e.target??"\u2014"}\xB0F</div>
          <div class="probe-eta ${o}">${f(t)}</div>
          ${e.source?`<div class="small">prior: ${f(e.source)}</div>`:""}
        </div>
      </div>
    </div>
  `}function Q(s){return s?`
    <div class="row">
      ${q(1,s.probe1)}
      ${q(2,s.probe2)}
    </div>
  `:""}function J(s){if(!s)return"";let e=s.smokeLevel??0;return`
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
  `}function K(s){return s?`
    <div class="panel">
      <div class="panel-label">This cook</div>
      <div class="session">
        <label>Protein</label>
        <input type="text" data-input="protein"   value="${f(s.protein)}"   placeholder="brisket / pork / ribs">
        <label>Weight (lb)</label>
        <input type="text" data-input="weight_lb" value="${f(s.weight_lb)}" placeholder="16">
        <label>Notes</label>
        <input type="text" data-input="notes"     value="${f(s.notes)}"     placeholder="oak, low and slow">
      </div>
      <div class="small" style="margin-top:8px;">
        Ambient / wind sensors are configured once in the
        <strong>Setup</strong> tab and persist across cooks.
      </div>
    </div>
  `:""}function Z(s){let e=(t,o)=>`
    <button class="tab ${s===t?"active":""}"
            data-action="set-view-${t}">
      ${o}
    </button>
  `;return`
    <div class="tab-strip">
      ${e("live","Live")}
      ${e("setup","Setup")}
    </div>
  `}function ee(s,e){if(!s)return"";let t=s.lastAlarm;return t?e&&e===t.captured_at?'<div class="alarm-banner dim">no alarms (dismissed)</div>':`
    <div class="alarm-banner">
      <span><strong>${f(t.title)}</strong> \xB7 ${f(t.body)}</span>
      <button class="alarm-dismiss" data-action="dismiss-alarm" title="Dismiss">\u2715</button>
    </div>
  `:'<div class="alarm-banner dim">no alarms</div>'}function se(s){return String(s??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function te(s,e,t,o){let r="";return e&&(r=t&&t.value!=null?`<span class="resolved-badge ok">${t.value.toFixed(1)}${o}</span>`:'<span class="resolved-badge bad">unresolved</span>'),`
    <label>${s}</label>
    <input type="text" data-input="${s.toLowerCase()==="ambient sensor"?"ambient":"wind"}" value="${se(e)}" placeholder="entity_id (e.g. sensor.outdoor_temp)">
    ${r||"<span></span>"}
  `}function ie(s,e){if(!s||!s.account)return`
      <div class="panel"><div class="small">Loading account info\u2026</div></div>
    `;let t=s.account,o=t.daysToExpiry!=null&&t.daysToExpiry<14?"bad":"";return`
    <div class="panel">
      <div class="panel-label">Account</div>
      <div class="setup-grid">
        <span class="setup-key">Email</span>
        <span class="setup-val">${se(t.email||"\u2014")}</span>

        <span class="setup-key">Token expires</span>
        <span class="setup-val ${o}">
          ${t.daysToExpiry!=null?`in ${t.daysToExpiry} days`:"\u2014"}
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
      <div class="session">
        ${te("Ambient sensor",s.ambient,s.ambientResolved,"\xB0F")}
        ${te("Wind sensor",s.wind,s.windResolved,"")}
      </div>
      <div class="small" style="margin-top:8px;">
        These persist across cooks \u2014 set once. Per-cook overrides on the
        Live tab take precedence if you ever want to deviate.
      </div>
    </div>
  `}var D=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._state=null,this._chart=null,this._view="live",this._dismissedAlarmId=null,this._renderQueued=!1}setConfig(e){this._config={entity_prefix:e?.entity_prefix??T,title:e?.title??null,ambient_entity:e?.ambient_entity??null,...e},this._lastSig=null}set hass(e){this._hass=e,this._config&&(this._state=N(e,this._config.entity_prefix),this._scheduleRender())}getCardSize(){return 8}static getConfigElement(){return null}static getStubConfig(){return{entity_prefix:T}}_scheduleRender(){this._renderQueued||(this._renderQueued=!0,requestAnimationFrame(()=>{this._renderQueued=!1,this._render()}))}_render(){let e=this._state;(!this.shadowRoot.firstElementChild||this.shadowRoot.firstElementChild.dataset.view!==this._view)&&(this._stampShell(),this._wireEvents()),this._fill("tabs",Z(this._view)),this._view==="live"?this._renderLive(e):this._renderSetup(e)}_stampShell(){let e=`
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
      <style>${I}</style>
      <div class="card" data-view="${this._view}">
        <div data-slot="tabs"></div>
        ${this._view==="live"?e:t}
      </div>
    `,this._view!=="live"&&(this._chart=null)}_renderLive(e){if(this._fill("alarm",ee(e,this._dismissedAlarmId)),this._fill("chips",j(e)),this._fill("cookHeader",U(e)),this._fill("probes",Q(e)),this._fillPreserveFocus("chamber",W(e)),this._fillPreserveFocus("controls",J(e)),this._fillPreserveFocus("session",K(e)),this._hass&&e){if(!this._chart){let o=this.shadowRoot.querySelector('[data-slot="chart"]');this._chart=new k(o)}let t=[e.entityIds.chamber_temp,e.entityIds.probe_1_temp,e.entityIds.probe_2_temp];this._chart.update(this._hass,t)}}_renderSetup(e){this._fillPreserveFocus("setup",ie(e,this._config))}_fill(e,t){let o=this.shadowRoot.querySelector(`[data-slot="${e}"]`);o&&(o.innerHTML=t)}_fillPreserveFocus(e,t){let o=this.shadowRoot.querySelector(`[data-slot="${e}"]`);if(!o)return;let r=this.shadowRoot.activeElement;if(!(r&&r.dataset?.input&&o.contains(r))){o.innerHTML=t;return}let n=r.dataset.input,c=r.value,m=r.selectionStart,h=r.selectionEnd;o.innerHTML=t;let l=o.querySelector(`[data-input="${n}"]`);if(l){l.value=c,l.focus();try{l.setSelectionRange(m,h)}catch{}}}_wireEvents(){this.shadowRoot.addEventListener("click",e=>{let t=e.target.closest("[data-action]");t&&this._dispatchAction(t.dataset.action)}),this.shadowRoot.addEventListener("change",e=>{let t=e.target.closest("[data-input]");if(!t)return;let o=M(this._hass,this._state),r=t.dataset.input;if(r==="setpoint"){let n=parseInt(t.value,10);Number.isFinite(n)&&o.setSetpoint(Math.max(180,Math.min(500,n)));return}if(r==="smoke_level"){let n=parseInt(t.value,10);Number.isFinite(n)&&o.setSmokeLevel(Math.max(0,Math.min(10,n)));return}if(r==="push_dedupe"){let n=parseInt(t.value,10);Number.isFinite(n)&&this._hass.callService("number","set_value",{entity_id:this._state.entityIds.push_dedupe,value:Math.max(10,Math.min(3600,n))});return}let a={notes:"notes",protein:"protein",weight_lb:"weight_lb",ambient:"ambient_override",wind:"wind_override"};a[r]&&o.setText(a[r],t.value)}),this.shadowRoot.addEventListener("input",e=>{let t=e.target.closest('[data-input="smoke_level"]');if(!t)return;let o=this.shadowRoot.querySelector('[data-bind="smoke-level-readout"]');o&&(o.textContent=t.value)})}_dispatchAction(e){if(!this._hass||!this._state)return;let t=M(this._hass,this._state),o=this._state.setpoint??225;switch(e){case"toggle-session":t.toggle("cook_session");break;case"toggle-smoke":t.toggle("smoke_mode");break;case"toggle-winter":t.toggle("winter_mode");break;case"toggle-alarm":t.toggle("alarm");break;case"toggle-push":t.toggle("push_alerts");break;case"temp-up":t.setSetpoint(Math.min(500,o+1));break;case"temp-down":t.setSetpoint(Math.max(180,o-1));break;case"power-off":t.powerOff();break;case"set-view-live":this._view="live",this._scheduleRender();break;case"set-view-setup":this._view="setup",this._scheduleRender();break;case"dismiss-alarm":this._state?.lastAlarm&&(this._dismissedAlarmId=this._state.lastAlarm.captured_at,this._scheduleRender());break}}};customElements.get($)||customElements.define($,D);window.customCards=window.customCards||[];window.customCards.some(s=>s.type===$)||window.customCards.push({type:$,name:"Prime Polaris Grill",description:"Live cook dashboard for the Prime Polaris pellet grill integration.",preview:!0});console.info(`%c ${$} %c v${z} `,"color:#fb923c;background:#0d1117;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:600","color:#0d1117;background:#fb923c;padding:2px 6px;border-radius:0 3px 3px 0");
