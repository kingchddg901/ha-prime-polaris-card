var y="ha-prime-polaris-card",H="0.2.1",C="grill",D={climate:"climate.{prefix}",chamber_temp:"sensor.{prefix}_chamber_temperature",running_status:"sensor.{prefix}_running_status",active_mode:"sensor.{prefix}_active_mode",active_smoke_level:"sensor.{prefix}_active_smoke_level",last_alarm:"sensor.{prefix}_last_alarm",probe_1_temp:"sensor.{prefix}_probe_1_temperature",probe_2_temp:"sensor.{prefix}_probe_2_temperature",probe_1_eta:"sensor.{prefix}_probe_1_eta",probe_2_eta:"sensor.{prefix}_probe_2_eta",setpoint:"number.{prefix}_temperature",smoke_level:"number.{prefix}_smoke_level",probe_1_target:"number.{prefix}_probe_1_target",probe_2_target:"number.{prefix}_probe_2_target",push_dedupe:"number.{prefix}_push_alert_dedupe",smoke_mode:"switch.{prefix}_smoke_mode",winter_mode:"switch.{prefix}_winter_mode",alarm:"switch.{prefix}_temperature_alarm",cook_session:"switch.{prefix}_cook_session",push_alerts:"switch.{prefix}_push_alerts",notes:"text.{prefix}_cook_notes",protein:"text.{prefix}_cook_protein",weight_lb:"text.{prefix}_cook_weight_lb",ambient_override:"text.{prefix}_cook_ambient_override",wind_override:"text.{prefix}_cook_wind_override"},E=4,O=3e4;var ae=/^[a-z_]+\.[a-z0-9_]+$/;function N(t,e,s){let o={value:null,source:""};if(!t||!e)return o;if(ae.test(e)){let n=t.states[e];if(!n)return{value:null,source:`${e} (missing)`};if(e.startsWith("weather.")&&n.attributes?.[s]!=null){let d=parseFloat(n.attributes[s]);return Number.isFinite(d)?{value:d,source:e}:o}let a=parseFloat(n.state);return Number.isFinite(a)?{value:a,source:e}:o}let r=parseFloat(e);return Number.isFinite(r)?{value:r,source:"literal"}:o}function I(t,e){if(!t)return null;let s=l=>D[l].replace("{prefix}",e),o=l=>t.states[s(l)]??null,r=l=>{let c=o(l);if(!c)return null;let p=parseFloat(c.state);return Number.isFinite(p)?p:null},n=l=>o(l)?.state==="on",a=l=>{let c=o(l);return c?c.state==="unknown"||c.state==="unavailable"?"":c.state:""},d=l=>{let c=o(l===1?"probe_1_eta":"probe_2_eta");if(!c)return{minutes:null,in_stall:!1,stdev:null,source:null};let p=parseFloat(c.state);return{minutes:Number.isFinite(p)?p:null,in_stall:!!c.attributes?.in_stall,stdev:c.attributes?.stall_stdev??null,source:c.attributes?.prior_source??null,samples:c.attributes?.samples??0}},u=o("climate"),m=r("setpoint")??u?.attributes?.temperature??null;return{prefix:e,entityIds:Object.fromEntries(Object.keys(D).map(l=>[l,s(l)])),chamber:r("chamber_temp")??u?.attributes?.current_temperature??null,setpoint:m,chamberDelta:r("chamber_temp")!=null&&m!=null?r("chamber_temp")-m:null,runningStatus:a("running_status")||null,activeMode:a("active_mode")||"off",smokeLevel:r("active_smoke_level"),smokeOn:n("smoke_mode"),winterOn:n("winter_mode"),alarmOn:n("alarm"),probe1:{temp:r("probe_1_temp"),target:r("probe_1_target"),...d(1)},probe2:{temp:r("probe_2_temp"),target:r("probe_2_target"),...d(2)},cookSession:n("cook_session"),notes:a("notes"),protein:a("protein"),weight_lb:a("weight_lb"),ambient:a("ambient_override"),wind:a("wind_override"),ambientResolved:N(t,a("ambient_override"),"temperature"),windResolved:N(t,a("wind_override"),"wind_speed"),pushOn:n("push_alerts"),pushDedupe:r("push_dedupe"),account:(()=>{let l=o("climate"),c=l?.attributes?.email??null,p=l?.attributes?.token_expiry??null,_=p?Math.max(0,Math.round((p*1e3-Date.now())/864e5)):null;return{email:c,daysToExpiry:_}})(),lastAlarm:(()=>{let l=o("last_alarm");return!l||l.state==="unknown"||l.state==="unavailable"||!l.state?null:{title:l.state,body:l.attributes?.body??"",captured_at:l.attributes?.captured_at??null,source:l.attributes?.source??null}})()}}function F(t,e){if(!t||!e)return{};let s=(o,r,n={})=>t.callService(o,r,n);return{setSetpoint:o=>s("number","set_value",{entity_id:e.entityIds.setpoint,value:o}),setSmokeLevel:o=>s("number","set_value",{entity_id:e.entityIds.smoke_level,value:o}),setProbeTarget:(o,r)=>s("number","set_value",{entity_id:e.entityIds[`probe_${o}_target`],value:r}),toggle:o=>{let r=e.entityIds[o],n=t.states[r]?.state==="on";return s("switch",n?"turn_off":"turn_on",{entity_id:r})},setText:(o,r)=>s("text","set_value",{entity_id:e.entityIds[o],value:r??""}),powerOff:()=>s("climate","set_hvac_mode",{entity_id:e.entityIds.climate,hvac_mode:"off"})}}var i={bg:"#0d1117",panel:"#161b22",panelBorder:"#30363d",text:"#e6edf3",textDim:"#8b949e",accent:"#fb923c",accentDim:"#9a3412",cool:"#3b82f6",hot:"#ef4444",steady:"#22c55e",smoke:"#a78bfa",alarm:"#f87171",stall:"#f59e0b",probe1:"#ef4444",probe2:"#06b6d4",chartChamber:"#fb923c",chartProbe1:"#ef4444",chartProbe2:"#06b6d4"},P=5;var B=`
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
`;var Y="apexcharts-card",T=class{constructor(e){this._host=e,this._mode=null,this._apexEl=null,this._canvas=null,this._series={},this._historyLoaded=!1,this._lastConfig=null}async update(e,s){let o=s.join("|");if(o!==this._lastConfig&&(this._lastConfig=o,this._historyLoaded=!1,this._series={},this._host.innerHTML="",this._mode=customElements.get(Y)?"apex":"canvas",this._mode==="apex"?this._mountApex(s):this._mountCanvas()),this._mode==="apex"){this._apexEl.hass=e;return}this._historyLoaded||(this._historyLoaded=!0,await this._loadHistory(e,s)),this._appendLive(e,s),this._draw(s)}_mountApex(e){let s=e.map((r,n)=>({entity:r,name:this._labelFor(r),yaxis_id:"temp",color:[i.chartChamber,i.chartProbe1,i.chartProbe2][n]||"#fff",type:n===0?"area":"line",opacity:n===0?.25:1,stroke_width:2})),o=document.createElement(Y);o.setConfig({header:{show:!1},graph_span:`${E}h`,update_interval:`${O/1e3}s`,yaxis:[{id:"temp",decimals:0,apex_config:{title:{text:"\xB0F"},forceNiceScale:!0}}],series:s}),this._apexEl=o,this._host.appendChild(o)}_mountCanvas(){this._canvas=document.createElement("canvas"),this._host.appendChild(this._canvas)}async _loadHistory(e,s){let n=`history/period/${new Date(Date.now()-E*3600*1e3).toISOString()}?filter_entity_id=${s.join(",")}&minimal_response`;try{let a=await e.callApi("GET",n);for(let d=0;d<s.length;d++){let u=s[d],m=(a?.[d]??[]).map(l=>[Date.parse(l.last_changed),parseFloat(l.state)]).filter(([l,c])=>Number.isFinite(l)&&Number.isFinite(c));this._series[u]=m}}catch(a){console.warn("[ha-prime-polaris-card] history fetch failed:",a)}}_appendLive(e,s){let o=Date.now(),r=o-E*3600*1e3;for(let n of s){let a=this._series[n]??(this._series[n]=[]),d=parseFloat(e.states[n]?.state);if(Number.isFinite(d)){let u=a.length?a[a.length-1][0]:0;o-u>=5e3&&a.push([o,d])}for(;a.length&&a[0][0]<r;)a.shift()}}_draw(e){let s=this._canvas;if(!s)return;let o=window.devicePixelRatio||1,r=s.clientWidth||600,n=240;s.width=r*o,s.height=n*o;let a=s.getContext("2d");a.scale(o,o),a.clearRect(0,0,r,n);let d=e.flatMap(h=>this._series[h]??[]);if(d.length<2){a.fillStyle=i.textDim,a.font="12px system-ui",a.fillText("collecting data\u2026",16,24);return}let u=d.map(h=>h[0]),m=d.map(h=>h[1]),l=Math.min(...u),c=Math.max(...u),p=Math.min(...m)-5,_=Math.max(...m)+5,b={l:36,r:12,t:12,b:22},g=h=>b.l+(h-l)/Math.max(1,c-l)*(r-b.l-b.r),v=h=>b.t+(1-(h-p)/Math.max(1,_-p))*(n-b.t-b.b);a.strokeStyle=i.panelBorder,a.fillStyle=i.textDim,a.font="11px system-ui",a.lineWidth=1;let k=4;for(let h=0;h<=k;h++){let w=p+h/k*(_-p),f=v(w);a.beginPath(),a.moveTo(b.l,f),a.lineTo(r-b.r,f),a.stroke(),a.fillText(w.toFixed(0),6,f+4)}let S=[i.chartChamber,i.chartProbe1,i.chartProbe2];e.forEach((h,w)=>{let f=this._series[h]??[];if(!(f.length<2)){if(a.strokeStyle=S[w]||"#fff",a.lineWidth=w===0?1.5:2,w===0){a.fillStyle=S[0]+"40",a.beginPath(),a.moveTo(g(f[0][0]),v(p));for(let[M,A]of f)a.lineTo(g(M),v(A));a.lineTo(g(f[f.length-1][0]),v(p)),a.closePath(),a.fill()}a.beginPath(),a.moveTo(g(f[0][0]),v(f[0][1]));for(let[M,A]of f)a.lineTo(g(M),v(A));a.stroke()}})}_labelFor(e){return e.includes("chamber")?"Chamber":e.includes("probe_1")?"Probe 1":e.includes("probe_2")?"Probe 2":e}};var $=-135,R=135,q=R-$;function X(t){let e=t.size??220,s=e/2,o=e/2,r=e/2-18,n=t.min,a=t.max,d=t.current??n,u=t.target??n,m=V(d,n,a),l=V(u,n,a),c=t.fillColor??le(d,u),p=G(s,o,r,$,R),_=G(s,o,r,$,m),b=L(s,o,r,l);return`
    <svg
      viewBox="0 0 ${e} ${e}"
      class="arc-gauge"
      data-gauge="true"
      data-min="${n}"
      data-max="${a}"
      data-cx="${s}"
      data-cy="${o}"
      data-r="${r}">

      <!-- track -->
      <path d="${p}"
        stroke="${i.panelBorder}"
        stroke-width="12"
        stroke-linecap="round"
        fill="none" />

      <!-- filled arc up to current -->
      <path d="${_}"
        stroke="${c}"
        stroke-width="12"
        stroke-linecap="round"
        fill="none" />

      <!-- setpoint thumb -->
      <circle cx="${b.x}" cy="${b.y}" r="11"
        fill="${i.accent}"
        stroke="${i.text}"
        stroke-width="2"
        data-thumb="true"
        style="cursor: grab;" />

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
  `}function V(t,e,s){let r=(Math.max(e,Math.min(s,t))-e)/(s-e);return $+r*q}function ne(t,e,s){let o=t;for(;o<$-180;)o+=360;for(;o>R+180;)o-=360;let n=(Math.max($,Math.min(R,o))-$)/q;return Math.round(e+n*(s-e))}function L(t,e,s,o){let r=(o-90)*Math.PI/180;return{x:t+s*Math.cos(r),y:e+s*Math.sin(r)}}function G(t,e,s,o,r){let n=L(t,e,s,o),a=L(t,e,s,r),d=Math.abs(r-o)>180?1:0;return`M ${n.x} ${n.y} A ${s} ${s} 0 ${d} 1 ${a.x} ${a.y}`}function le(t,e){if(t==null||e==null)return i.accent;let s=t-e;return s>P?i.hot:s<-P?i.cool:i.steady}function W(t,e){if(!t)return;let s=parseFloat(t.dataset.min),o=parseFloat(t.dataset.max),r=parseFloat(t.dataset.cx),n=parseFloat(t.dataset.cy),a=!1,d=null,u=(c,p)=>{let _=t.getBoundingClientRect(),b=t.viewBox.baseVal.width/_.width,g=t.viewBox.baseVal.height/_.height,v=(c-_.left)*b-r,k=(p-_.top)*g-n,S=Math.atan2(k,v)*180/Math.PI+90;return ne(S,s,o)},m=c=>{if(!a)return;d=u(c.clientX,c.clientY)},l=()=>{a&&(a=!1,document.removeEventListener("pointermove",m),document.removeEventListener("pointerup",l),d!=null&&e(d))};t.addEventListener("pointerdown",c=>{let p=c.target,_=p.dataset?.thumb==="true";(p.tagName==="path"||_)&&(c.preventDefault(),a=!0,d=u(c.clientX,c.clientY),document.addEventListener("pointermove",m),document.addEventListener("pointerup",l))})}function x(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function j(t){if(!t)return"";let{chamber:e,setpoint:s,chamberDelta:o}=t,r=o!=null?`\u0394 ${o>0?"+":""}${o.toFixed(0)}\xB0F`:"";return`
    <div class="panel tall arc-panel">
      <div class="panel-label">Chamber</div>
      ${X({min:180,max:500,current:e,target:s})}
      <div class="delta">${r} \xB7 drag the dot to set</div>
    </div>
  `}function Q(t){if(!t)return"";let e=[];return t.runningStatus&&e.push({cls:"active",txt:t.runningStatus}),e.push({cls:t.activeMode==="smoke"?"smoke":"active",txt:`mode: ${t.activeMode}`}),t.smokeOn&&t.smokeLevel!=null&&e.push({cls:"smoke",txt:`smoke ${t.smokeLevel.toFixed(0)}`}),t.alarmOn&&e.push({cls:"alarm",txt:"alarm armed"}),t.winterOn&&e.push({cls:"active",txt:"winter"}),t.pushOn&&e.push({cls:"active",txt:"push on"}),t.ambient&&e.push(t.ambientResolved.value!=null?{cls:"active",txt:`ambient ${t.ambientResolved.value.toFixed(0)}\xB0F`}:{cls:"alarm",txt:"ambient unresolved"}),t.wind&&e.push(t.windResolved.value!=null?{cls:"active",txt:`wind ${t.windResolved.value.toFixed(1)}`}:{cls:"alarm",txt:"wind unresolved"}),`
    <div class="chip-row">
      ${e.map(s=>`<span class="chip ${s.cls}">${x(s.txt)}</span>`).join("")}
    </div>
  `}function J(t){if(!t)return"";let e=t.cookSession,s=e?t.protein?`${x(t.protein)}${t.weight_lb?" \xB7 "+x(t.weight_lb)+" lb":""}`:"recording":"no active cook",o=t.notes?x(t.notes):e?"":"flip the switch when you start a real cook";return`
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
    </div>
  `}function U(t,e){if(e.temp==null)return`
      <div class="panel">
        <div class="probe">
          <div class="probe-label">Probe ${t}</div>
          <div class="small">not connected</div>
        </div>
      </div>
    `;let s="fitting\u2026",o="fitting";if(e.in_stall)s=`\u{1F6D1} in stall \xB7 \u03C3 ${e.stdev?.toFixed(2)??"\u2014"}\xB0F`,o="stall";else if(e.minutes!=null){let r=Math.max(0,e.minutes);s=r>=60?`ETA ${(r/60).toFixed(1)} h`:`ETA ${r.toFixed(0)} min`,o=""}return`
    <div class="panel">
      <div class="probe">
        <div class="probe-label">Probe ${t}</div>
        <div>
          <div class="probe-temp">${e.temp.toFixed(0)}\xB0F</div>
          <div class="probe-target">\u2192 ${e.target??"\u2014"}\xB0F</div>
          <div class="probe-eta ${o}">${x(s)}</div>
          ${e.source?`<div class="small">prior: ${x(e.source)}</div>`:""}
        </div>
      </div>
    </div>
  `}function K(t){return t?`
    <div class="row">
      ${U(1,t.probe1)}
      ${U(2,t.probe2)}
    </div>
  `:""}function Z(t){if(!t)return"";let e=t.smokeLevel??0;return`
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
  `}function ee(t){return t?`
    <div class="panel">
      <div class="panel-label">This cook</div>
      <div class="session">
        <label>Protein</label>
        <input type="text" data-input="protein"   value="${x(t.protein)}"   placeholder="brisket / pork / ribs">
        <label>Weight (lb)</label>
        <input type="text" data-input="weight_lb" value="${x(t.weight_lb)}" placeholder="16">
        <label>Notes</label>
        <input type="text" data-input="notes"     value="${x(t.notes)}"     placeholder="oak, low and slow">
      </div>
      <div class="small" style="margin-top:8px;">
        Ambient / wind sensors are configured once in the
        <strong>Setup</strong> tab and persist across cooks.
      </div>
    </div>
  `:""}function te(t){let e=(s,o)=>`
    <button class="tab ${t===s?"active":""}"
            data-action="set-view-${s}">
      ${o}
    </button>
  `;return`
    <div class="tab-strip">
      ${e("live","Live")}
      ${e("setup","Setup")}
    </div>
  `}function se(t,e){if(!t)return"";let s=t.lastAlarm;return s?e&&e===s.captured_at?'<div class="alarm-banner dim">no alarms (dismissed)</div>':`
    <div class="alarm-banner">
      <span><strong>${x(s.title)}</strong> \xB7 ${x(s.body)}</span>
      <button class="alarm-dismiss" data-action="dismiss-alarm" title="Dismiss">\u2715</button>
    </div>
  `:'<div class="alarm-banner dim">no alarms</div>'}function ie(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function oe(t,e,s,o){let r="";return e&&(r=s&&s.value!=null?`<span class="resolved-badge ok">${s.value.toFixed(1)}${o}</span>`:'<span class="resolved-badge bad">unresolved</span>'),`
    <label>${t}</label>
    <input type="text" data-input="${t.toLowerCase()==="ambient sensor"?"ambient":"wind"}" value="${ie(e)}" placeholder="entity_id (e.g. sensor.outdoor_temp)">
    ${r||"<span></span>"}
  `}function re(t,e){if(!t||!t.account)return`
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
        ${oe("Ambient sensor",t.ambient,t.ambientResolved,"\xB0F")}
        ${oe("Wind sensor",t.wind,t.windResolved,"")}
      </div>
      <div class="small" style="margin-top:8px;">
        These persist across cooks \u2014 set once. Per-cook overrides on the
        Live tab take precedence if you ever want to deviate.
      </div>
    </div>
  `}var z=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._state=null,this._chart=null,this._view="live",this._dismissedAlarmId=null,this._renderQueued=!1}setConfig(e){this._config={entity_prefix:e?.entity_prefix??C,title:e?.title??null,ambient_entity:e?.ambient_entity??null,...e},this._lastSig=null}set hass(e){this._hass=e,this._config&&(this._state=I(e,this._config.entity_prefix),this._scheduleRender())}getCardSize(){return 8}static getConfigElement(){return null}static getStubConfig(){return{entity_prefix:C}}_scheduleRender(){this._renderQueued||(this._renderQueued=!0,requestAnimationFrame(()=>{this._renderQueued=!1,this._render()}))}_render(){let e=this._state;(!this.shadowRoot.firstElementChild||this.shadowRoot.firstElementChild.dataset.view!==this._view)&&(this._stampShell(),this._wireEvents()),this._fill("tabs",te(this._view)),this._view==="live"?this._renderLive(e):this._renderSetup(e)}_stampShell(){let e=`
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
      <style>${B}</style>
      <div class="card" data-view="${this._view}">
        <div data-slot="tabs"></div>
        ${this._view==="live"?e:s}
      </div>
    `,this._view!=="live"&&(this._chart=null)}_renderLive(e){this._fill("alarm",se(e,this._dismissedAlarmId)),this._fill("chips",Q(e)),this._fill("chamber",j(e)),this._fill("cookHeader",J(e)),this._fill("probes",K(e)),this._fillPreserveFocus("controls",Z(e)),this._fillPreserveFocus("session",ee(e));let s=this.shadowRoot.querySelector('[data-gauge="true"]');if(s){let o=F(this._hass,this._state);W(s,r=>o.setSetpoint(r))}if(this._hass&&e){if(!this._chart){let r=this.shadowRoot.querySelector('[data-slot="chart"]');this._chart=new T(r)}let o=[e.entityIds.chamber_temp,e.entityIds.probe_1_temp,e.entityIds.probe_2_temp];this._chart.update(this._hass,o)}}_renderSetup(e){this._fillPreserveFocus("setup",re(e,this._config))}_fill(e,s){let o=this.shadowRoot.querySelector(`[data-slot="${e}"]`);o&&(o.innerHTML=s)}_fillPreserveFocus(e,s){let o=this.shadowRoot.querySelector(`[data-slot="${e}"]`);if(!o)return;let r=this.shadowRoot.activeElement;if(!(r&&r.dataset?.input&&o.contains(r))){o.innerHTML=s;return}let a=r.dataset.input,d=r.value,u=r.selectionStart,m=r.selectionEnd;o.innerHTML=s;let l=o.querySelector(`[data-input="${a}"]`);if(l){l.value=d,l.focus();try{l.setSelectionRange(u,m)}catch{}}}_wireEvents(){this.shadowRoot.addEventListener("click",e=>{let s=e.target.closest("[data-action]");s&&this._dispatchAction(s.dataset.action)}),this.shadowRoot.addEventListener("change",e=>{let s=e.target.closest("[data-input]");if(!s)return;let o=F(this._hass,this._state),r=s.dataset.input;if(r==="setpoint"){let a=parseInt(s.value,10);Number.isFinite(a)&&o.setSetpoint(Math.max(180,Math.min(500,a)));return}if(r==="smoke_level"){let a=parseInt(s.value,10);Number.isFinite(a)&&o.setSmokeLevel(Math.max(0,Math.min(10,a)));return}if(r==="push_dedupe"){let a=parseInt(s.value,10);Number.isFinite(a)&&this._hass.callService("number","set_value",{entity_id:this._state.entityIds.push_dedupe,value:Math.max(10,Math.min(3600,a))});return}let n={notes:"notes",protein:"protein",weight_lb:"weight_lb",ambient:"ambient_override",wind:"wind_override"};n[r]&&o.setText(n[r],s.value)}),this.shadowRoot.addEventListener("input",e=>{let s=e.target.closest('[data-input="smoke_level"]');if(!s)return;let o=this.shadowRoot.querySelector('[data-bind="smoke-level-readout"]');o&&(o.textContent=s.value)})}_dispatchAction(e){if(!this._hass||!this._state)return;let s=F(this._hass,this._state),o=this._state.setpoint??225;switch(e){case"toggle-session":s.toggle("cook_session");break;case"toggle-smoke":s.toggle("smoke_mode");break;case"toggle-winter":s.toggle("winter_mode");break;case"toggle-alarm":s.toggle("alarm");break;case"toggle-push":s.toggle("push_alerts");break;case"temp-up":s.setSetpoint(Math.min(500,o+1));break;case"temp-down":s.setSetpoint(Math.max(180,o-1));break;case"power-off":s.powerOff();break;case"set-view-live":this._view="live",this._scheduleRender();break;case"set-view-setup":this._view="setup",this._scheduleRender();break;case"dismiss-alarm":this._state?.lastAlarm&&(this._dismissedAlarmId=this._state.lastAlarm.captured_at,this._scheduleRender());break}}};customElements.get(y)||customElements.define(y,z);window.customCards=window.customCards||[];window.customCards.some(t=>t.type===y)||window.customCards.push({type:y,name:"Prime Polaris Grill",description:"Live cook dashboard for the Prime Polaris pellet grill integration.",preview:!0});console.info(`%c ${y} %c v${H} `,"color:#fb923c;background:#0d1117;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:600","color:#0d1117;background:#fb923c;padding:2px 6px;border-radius:0 3px 3px 0");
