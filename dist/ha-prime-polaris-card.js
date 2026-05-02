var y="ha-prime-polaris-card",z="0.1.5",A="grill",D={climate:"climate.{prefix}",chamber_temp:"sensor.{prefix}_chamber_temperature",running_status:"sensor.{prefix}_running_status",active_mode:"sensor.{prefix}_active_mode",active_smoke_level:"sensor.{prefix}_active_smoke_level",last_alarm:"sensor.{prefix}_last_alarm",probe_1_temp:"sensor.{prefix}_probe_1_temperature",probe_2_temp:"sensor.{prefix}_probe_2_temperature",probe_1_eta:"sensor.{prefix}_probe_1_eta",probe_2_eta:"sensor.{prefix}_probe_2_eta",setpoint:"number.{prefix}_temperature",smoke_level:"number.{prefix}_smoke_level",probe_1_target:"number.{prefix}_probe_1_target",probe_2_target:"number.{prefix}_probe_2_target",push_dedupe:"number.{prefix}_push_alert_dedupe",smoke_mode:"switch.{prefix}_smoke_mode",winter_mode:"switch.{prefix}_winter_mode",alarm:"switch.{prefix}_temperature_alarm",cook_session:"switch.{prefix}_cook_session",push_alerts:"switch.{prefix}_push_alerts",notes:"text.{prefix}_cook_notes",protein:"text.{prefix}_cook_protein",weight_lb:"text.{prefix}_cook_weight_lb",ambient_override:"text.{prefix}_cook_ambient_override",wind_override:"text.{prefix}_cook_wind_override"},F=4,N=3e4;var re=/^[a-z_]+\.[a-z0-9_]+$/;function O(t,e,o){let r={value:null,source:""};if(!t||!e)return r;if(re.test(e)){let a=t.states[e];if(!a)return{value:null,source:`${e} (missing)`};if(e.startsWith("weather.")&&a.attributes?.[o]!=null){let d=parseFloat(a.attributes[o]);return Number.isFinite(d)?{value:d,source:e}:r}let i=parseFloat(a.state);return Number.isFinite(i)?{value:i,source:e}:r}let s=parseFloat(e);return Number.isFinite(s)?{value:s,source:"literal"}:r}function I(t,e){if(!t)return null;let o=l=>D[l].replace("{prefix}",e),r=l=>t.states[o(l)]??null,s=l=>{let c=r(l);if(!c)return null;let p=parseFloat(c.state);return Number.isFinite(p)?p:null},a=l=>r(l)?.state==="on",i=l=>{let c=r(l);return c?c.state==="unknown"||c.state==="unavailable"?"":c.state:""},d=l=>{let c=r(l===1?"probe_1_eta":"probe_2_eta");if(!c)return{minutes:null,in_stall:!1,stdev:null,source:null};let p=parseFloat(c.state);return{minutes:Number.isFinite(p)?p:null,in_stall:!!c.attributes?.in_stall,stdev:c.attributes?.stall_stdev??null,source:c.attributes?.prior_source??null,samples:c.attributes?.samples??0}},u=r("climate"),h=s("setpoint")??u?.attributes?.temperature??null;return{prefix:e,entityIds:Object.fromEntries(Object.keys(D).map(l=>[l,o(l)])),chamber:s("chamber_temp")??u?.attributes?.current_temperature??null,setpoint:h,chamberDelta:s("chamber_temp")!=null&&h!=null?s("chamber_temp")-h:null,runningStatus:i("running_status")||null,activeMode:i("active_mode")||"off",smokeLevel:s("active_smoke_level"),smokeOn:a("smoke_mode"),winterOn:a("winter_mode"),alarmOn:a("alarm"),probe1:{temp:s("probe_1_temp"),target:s("probe_1_target"),...d(1)},probe2:{temp:s("probe_2_temp"),target:s("probe_2_target"),...d(2)},cookSession:a("cook_session"),notes:i("notes"),protein:i("protein"),weight_lb:i("weight_lb"),ambient:i("ambient_override"),wind:i("wind_override"),ambientResolved:O(t,i("ambient_override"),"temperature"),windResolved:O(t,i("wind_override"),"wind_speed"),pushOn:a("push_alerts"),pushDedupe:s("push_dedupe"),lastAlarm:(()=>{let l=r("last_alarm");return!l||l.state==="unknown"||l.state==="unavailable"||!l.state?null:{title:l.state,body:l.attributes?.body??"",captured_at:l.attributes?.captured_at??null,source:l.attributes?.source??null}})()}}function E(t,e){if(!t||!e)return{};let o=(r,s,a={})=>t.callService(r,s,a);return{setSetpoint:r=>o("number","set_value",{entity_id:e.entityIds.setpoint,value:r}),setSmokeLevel:r=>o("number","set_value",{entity_id:e.entityIds.smoke_level,value:r}),setProbeTarget:(r,s)=>o("number","set_value",{entity_id:e.entityIds[`probe_${r}_target`],value:s}),toggle:r=>{let s=e.entityIds[r],a=t.states[s]?.state==="on";return o("switch",a?"turn_off":"turn_on",{entity_id:s})},setText:(r,s)=>o("text","set_value",{entity_id:e.entityIds[r],value:s??""}),powerOff:()=>o("climate","set_hvac_mode",{entity_id:e.entityIds.climate,hvac_mode:"off"})}}var n={bg:"#0d1117",panel:"#161b22",panelBorder:"#30363d",text:"#e6edf3",textDim:"#8b949e",accent:"#fb923c",accentDim:"#9a3412",cool:"#3b82f6",hot:"#ef4444",steady:"#22c55e",smoke:"#a78bfa",alarm:"#f87171",stall:"#f59e0b",probe1:"#ef4444",probe2:"#06b6d4",chartChamber:"#fb923c",chartProbe1:"#ef4444",chartProbe2:"#06b6d4"},P=5;var B=`
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
    grid-template-columns: auto 1fr auto;
    gap: 8px 12px;
    align-items: center;
  }
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
  }
  .alarm-banner.dim {
    background: ${n.panel};
    border-color: ${n.panelBorder};
    color: ${n.textDim};
  }
  .small { font-size: 11px; color: ${n.textDim}; }

  @media (max-width: 600px) {
    .row { grid-template-columns: 1fr; }
  }
`;var Y="apexcharts-card",R=class{constructor(e){this._host=e,this._mode=null,this._apexEl=null,this._canvas=null,this._series={},this._historyLoaded=!1,this._lastConfig=null}async update(e,o){let r=o.join("|");if(r!==this._lastConfig&&(this._lastConfig=r,this._historyLoaded=!1,this._series={},this._host.innerHTML="",this._mode=customElements.get(Y)?"apex":"canvas",this._mode==="apex"?this._mountApex(o):this._mountCanvas()),this._mode==="apex"){this._apexEl.hass=e;return}this._historyLoaded||(this._historyLoaded=!0,await this._loadHistory(e,o)),this._appendLive(e,o),this._draw(o)}_mountApex(e){let o=e.map((s,a)=>({entity:s,name:this._labelFor(s),yaxis_id:"temp",color:[n.chartChamber,n.chartProbe1,n.chartProbe2][a]||"#fff",type:a===0?"area":"line",opacity:a===0?.25:1,stroke_width:2})),r=document.createElement(Y);r.setConfig({header:{show:!1},graph_span:`${F}h`,update_interval:`${N/1e3}s`,yaxis:[{id:"temp",decimals:0,apex_config:{title:{text:"\xB0F"},forceNiceScale:!0}}],series:o}),this._apexEl=r,this._host.appendChild(r)}_mountCanvas(){this._canvas=document.createElement("canvas"),this._host.appendChild(this._canvas)}async _loadHistory(e,o){let a=`history/period/${new Date(Date.now()-F*3600*1e3).toISOString()}?filter_entity_id=${o.join(",")}&minimal_response`;try{let i=await e.callApi("GET",a);for(let d=0;d<o.length;d++){let u=o[d],h=(i?.[d]??[]).map(l=>[Date.parse(l.last_changed),parseFloat(l.state)]).filter(([l,c])=>Number.isFinite(l)&&Number.isFinite(c));this._series[u]=h}}catch(i){console.warn("[ha-prime-polaris-card] history fetch failed:",i)}}_appendLive(e,o){let r=Date.now(),s=r-F*3600*1e3;for(let a of o){let i=this._series[a]??(this._series[a]=[]),d=parseFloat(e.states[a]?.state);if(Number.isFinite(d)){let u=i.length?i[i.length-1][0]:0;r-u>=5e3&&i.push([r,d])}for(;i.length&&i[0][0]<s;)i.shift()}}_draw(e){let o=this._canvas;if(!o)return;let r=window.devicePixelRatio||1,s=o.clientWidth||600,a=240;o.width=s*r,o.height=a*r;let i=o.getContext("2d");i.scale(r,r),i.clearRect(0,0,s,a);let d=e.flatMap(b=>this._series[b]??[]);if(d.length<2){i.fillStyle=n.textDim,i.font="12px system-ui",i.fillText("collecting data\u2026",16,24);return}let u=d.map(b=>b[0]),h=d.map(b=>b[1]),l=Math.min(...u),c=Math.max(...u),p=Math.min(...h)-5,x=Math.max(...h)+5,f={l:36,r:12,t:12,b:22},v=b=>f.l+(b-l)/Math.max(1,c-l)*(s-f.l-f.r),g=b=>f.t+(1-(b-p)/Math.max(1,x-p))*(a-f.t-f.b);i.strokeStyle=n.panelBorder,i.fillStyle=n.textDim,i.font="11px system-ui",i.lineWidth=1;let k=4;for(let b=0;b<=k;b++){let w=p+b/k*(x-p),_=g(w);i.beginPath(),i.moveTo(f.l,_),i.lineTo(s-f.r,_),i.stroke(),i.fillText(w.toFixed(0),6,_+4)}let S=[n.chartChamber,n.chartProbe1,n.chartProbe2];e.forEach((b,w)=>{let _=this._series[b]??[];if(!(_.length<2)){if(i.strokeStyle=S[w]||"#fff",i.lineWidth=w===0?1.5:2,w===0){i.fillStyle=S[0]+"40",i.beginPath(),i.moveTo(v(_[0][0]),g(p));for(let[M,C]of _)i.lineTo(v(M),g(C));i.lineTo(v(_[_.length-1][0]),g(p)),i.closePath(),i.fill()}i.beginPath(),i.moveTo(v(_[0][0]),g(_[0][1]));for(let[M,C]of _)i.lineTo(v(M),g(C));i.stroke()}})}_labelFor(e){return e.includes("chamber")?"Chamber":e.includes("probe_1")?"Probe 1":e.includes("probe_2")?"Probe 2":e}};var $=-135,T=135,X=T-$;function q(t){let e=t.size??220,o=e/2,r=e/2,s=e/2-18,a=t.min,i=t.max,d=t.current??a,u=t.target??a,h=V(d,a,i),l=V(u,a,i),c=t.fillColor??se(d,u),p=G(o,r,s,$,T),x=G(o,r,s,$,h),f=L(o,r,s,l);return`
    <svg
      viewBox="0 0 ${e} ${e}"
      class="arc-gauge"
      data-gauge="true"
      data-min="${a}"
      data-max="${i}"
      data-cx="${o}"
      data-cy="${r}"
      data-r="${s}">

      <!-- track -->
      <path d="${p}"
        stroke="${n.panelBorder}"
        stroke-width="12"
        stroke-linecap="round"
        fill="none" />

      <!-- filled arc up to current -->
      <path d="${x}"
        stroke="${c}"
        stroke-width="12"
        stroke-linecap="round"
        fill="none" />

      <!-- setpoint thumb -->
      <circle cx="${f.x}" cy="${f.y}" r="11"
        fill="${n.accent}"
        stroke="${n.text}"
        stroke-width="2"
        data-thumb="true"
        style="cursor: grab;" />

      <!-- center readout: big chamber temp, small target -->
      <text x="${o}" y="${r-4}"
        text-anchor="middle"
        font-size="44"
        font-weight="600"
        fill="${n.text}"
        style="font-family: inherit;">
        ${t.current!=null?t.current.toFixed(0):"\u2014"}<tspan font-size="22" fill="${n.textDim}">\xB0F</tspan>
      </text>
      <text x="${o}" y="${r+24}"
        text-anchor="middle"
        font-size="13"
        fill="${n.textDim}"
        style="font-family: inherit;">
        target ${t.target??"\u2014"}\xB0F
      </text>
    </svg>
  `}function V(t,e,o){let s=(Math.max(e,Math.min(o,t))-e)/(o-e);return $+s*X}function ne(t,e,o){let r=t;for(;r<$-180;)r+=360;for(;r>T+180;)r-=360;let a=(Math.max($,Math.min(T,r))-$)/X;return Math.round(e+a*(o-e))}function L(t,e,o,r){let s=(r-90)*Math.PI/180;return{x:t+o*Math.cos(s),y:e+o*Math.sin(s)}}function G(t,e,o,r,s){let a=L(t,e,o,r),i=L(t,e,o,s),d=Math.abs(s-r)>180?1:0;return`M ${a.x} ${a.y} A ${o} ${o} 0 ${d} 1 ${i.x} ${i.y}`}function se(t,e){if(t==null||e==null)return n.accent;let o=t-e;return o>P?n.hot:o<-P?n.cool:n.steady}function W(t,e){if(!t)return;let o=parseFloat(t.dataset.min),r=parseFloat(t.dataset.max),s=parseFloat(t.dataset.cx),a=parseFloat(t.dataset.cy),i=!1,d=null,u=(c,p)=>{let x=t.getBoundingClientRect(),f=t.viewBox.baseVal.width/x.width,v=t.viewBox.baseVal.height/x.height,g=(c-x.left)*f-s,k=(p-x.top)*v-a,S=Math.atan2(k,g)*180/Math.PI+90;return ne(S,o,r)},h=c=>{if(!i)return;d=u(c.clientX,c.clientY)},l=()=>{i&&(i=!1,document.removeEventListener("pointermove",h),document.removeEventListener("pointerup",l),d!=null&&e(d))};t.addEventListener("pointerdown",c=>{let p=c.target,x=p.dataset?.thumb==="true";(p.tagName==="path"||x)&&(c.preventDefault(),i=!0,d=u(c.clientX,c.clientY),document.addEventListener("pointermove",h),document.addEventListener("pointerup",l))})}function m(t){return String(t??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function Q(t){if(!t)return"";let{chamber:e,setpoint:o,chamberDelta:r}=t,s=r!=null?`\u0394 ${r>0?"+":""}${r.toFixed(0)}\xB0F`:"";return`
    <div class="panel tall arc-panel">
      <div class="panel-label">Chamber</div>
      ${q({min:180,max:500,current:e,target:o})}
      <div class="delta">${s} \xB7 drag the dot to set</div>
    </div>
  `}function J(t){if(!t)return"";let e=[];return t.runningStatus&&e.push({cls:"active",txt:t.runningStatus}),e.push({cls:t.activeMode==="smoke"?"smoke":"active",txt:`mode: ${t.activeMode}`}),t.smokeOn&&t.smokeLevel!=null&&e.push({cls:"smoke",txt:`smoke ${t.smokeLevel.toFixed(0)}`}),t.alarmOn&&e.push({cls:"alarm",txt:"alarm armed"}),t.winterOn&&e.push({cls:"active",txt:"winter"}),t.pushOn&&e.push({cls:"active",txt:"push on"}),`
    <div class="chip-row">
      ${e.map(o=>`<span class="chip ${o.cls}">${m(o.txt)}</span>`).join("")}
    </div>
  `}function K(t){if(!t)return"";let e=t.cookSession,o=e?t.protein?`${m(t.protein)}${t.weight_lb?" \xB7 "+m(t.weight_lb)+" lb":""}`:"recording":"no active cook",r=t.notes?m(t.notes):e?"":"flip the switch when you start a real cook",s=[];if(t.ambientResolved.value!=null){let a=t.ambientResolved.source==="literal"?"":` (${m(t.ambientResolved.source)})`;s.push(`ambient ${t.ambientResolved.value.toFixed(0)}\xB0F${a}`)}else t.ambient&&s.push(`ambient: <span style="color:#f87171">${m(t.ambient)} unresolved</span>`);return t.windResolved.value!=null&&s.push(`wind ${t.windResolved.value.toFixed(1)}`),`
    <div class="panel tall">
      <div class="panel-label">Cook session</div>
      <div class="session-toggle">
        <span class="rec-dot ${e?"live":""}"></span>
        <button class="action ${e?"on":""}" data-action="toggle-session">
          ${e?"Stop session":"Start session"}
        </button>
      </div>
      <div class="big-temp" style="font-size:22px; margin-top:8px;">${o}</div>
      <div class="small">${r}</div>
      ${s.length?`<div class="small" style="margin-top:6px;">${s.join(" \xB7 ")}</div>`:""}
    </div>
  `}function j(t,e){if(e.temp==null)return`
      <div class="panel">
        <div class="probe">
          <div class="probe-label">Probe ${t}</div>
          <div class="small">not connected</div>
        </div>
      </div>
    `;let o="fitting\u2026",r="fitting";if(e.in_stall)o=`\u{1F6D1} in stall \xB7 \u03C3 ${e.stdev?.toFixed(2)??"\u2014"}\xB0F`,r="stall";else if(e.minutes!=null){let s=Math.max(0,e.minutes);o=s>=60?`ETA ${(s/60).toFixed(1)} h`:`ETA ${s.toFixed(0)} min`,r=""}return`
    <div class="panel">
      <div class="probe">
        <div class="probe-label">Probe ${t}</div>
        <div>
          <div class="probe-temp">${e.temp.toFixed(0)}\xB0F</div>
          <div class="probe-target">\u2192 ${e.target??"\u2014"}\xB0F</div>
          <div class="probe-eta ${r}">${m(o)}</div>
          ${e.source?`<div class="small">prior: ${m(e.source)}</div>`:""}
        </div>
      </div>
    </div>
  `}function Z(t){return t?`
    <div class="row">
      ${j(1,t.probe1)}
      ${j(2,t.probe2)}
    </div>
  `:""}function ee(t){if(!t)return"";let e=t.smokeLevel??0;return`
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
  `}function te(t){if(!t)return"";let e=U(t.ambient,t.ambientResolved,"\xB0F"),o=U(t.wind,t.windResolved,"");return`
    <div class="panel">
      <div class="panel-label">Session inputs</div>
      <div class="session">
        <label>Protein</label>
        <input type="text" data-input="protein"   value="${m(t.protein)}"   placeholder="brisket / pork / ribs">
        <span></span>

        <label>Weight (lb)</label>
        <input type="text" data-input="weight_lb" value="${m(t.weight_lb)}" placeholder="16">
        <span></span>

        <label>Notes</label>
        <input type="text" data-input="notes"     value="${m(t.notes)}"     placeholder="oak, low and slow">
        <span></span>

        <label>Ambient</label>
        <input type="text" data-input="ambient"   value="${m(t.ambient)}"   placeholder="weather.home, sensor.outdoor_temp, or 32">
        ${e}

        <label>Wind</label>
        <input type="text" data-input="wind"      value="${m(t.wind)}"      placeholder="sensor.wind_speed or m/s value">
        ${o}
      </div>
    </div>
  `}function U(t,e,o){return t?e&&e.value!=null?`<span class="resolved-badge ok">${e.value.toFixed(1)}${o}</span>`:'<span class="resolved-badge bad">unresolved</span>':"<span></span>"}function oe(t){if(!t)return"";let e=t.lastAlarm;return e?`
    <div class="alarm-banner">
      <span><strong>${m(e.title)}</strong> \xB7 ${m(e.body)}</span>
      <span class="small">${m(e.source??"")}</span>
    </div>
  `:'<div class="alarm-banner dim">no alarms</div>'}var H=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._state=null,this._chart=null,this._renderQueued=!1}setConfig(e){this._config={entity_prefix:e?.entity_prefix??A,title:e?.title??null,ambient_entity:e?.ambient_entity??null,...e},this._lastSig=null}set hass(e){this._hass=e,this._config&&(this._state=I(e,this._config.entity_prefix),this._scheduleRender())}getCardSize(){return 8}static getConfigElement(){return null}static getStubConfig(){return{entity_prefix:A}}_scheduleRender(){this._renderQueued||(this._renderQueued=!0,requestAnimationFrame(()=>{this._renderQueued=!1,this._render()}))}_render(){let e=this._state;this.shadowRoot.firstElementChild||(this.shadowRoot.innerHTML=`
        <style>${B}</style>
        <div class="card">
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
        </div>
      `,this._wireEvents()),this._fill("alarm",oe(e)),this._fill("chips",J(e)),this._fill("chamber",Q(e)),this._fill("cookHeader",K(e)),this._fill("probes",Z(e)),this._fillPreserveFocus("controls",ee(e)),this._fillPreserveFocus("session",te(e));let o=this.shadowRoot.querySelector('[data-gauge="true"]');if(o){let r=E(this._hass,this._state);W(o,s=>r.setSetpoint(s))}if(this._hass&&e){if(!this._chart){let s=this.shadowRoot.querySelector('[data-slot="chart"]');this._chart=new R(s)}let r=[e.entityIds.chamber_temp,e.entityIds.probe_1_temp,e.entityIds.probe_2_temp];this._chart.update(this._hass,r)}}_fill(e,o){let r=this.shadowRoot.querySelector(`[data-slot="${e}"]`);r&&(r.innerHTML=o)}_fillPreserveFocus(e,o){let r=this.shadowRoot.querySelector(`[data-slot="${e}"]`);if(!r)return;let s=this.shadowRoot.activeElement;if(!(s&&s.dataset?.input&&r.contains(s))){r.innerHTML=o;return}let i=s.dataset.input,d=s.value,u=s.selectionStart,h=s.selectionEnd;r.innerHTML=o;let l=r.querySelector(`[data-input="${i}"]`);if(l){l.value=d,l.focus();try{l.setSelectionRange(u,h)}catch{}}}_wireEvents(){this.shadowRoot.addEventListener("click",e=>{let o=e.target.closest("[data-action]");o&&this._dispatchAction(o.dataset.action)}),this.shadowRoot.addEventListener("change",e=>{let o=e.target.closest("[data-input]");if(!o)return;let r=E(this._hass,this._state),s=o.dataset.input;if(s==="setpoint"){let i=parseInt(o.value,10);Number.isFinite(i)&&r.setSetpoint(Math.max(180,Math.min(500,i)));return}if(s==="smoke_level"){let i=parseInt(o.value,10);Number.isFinite(i)&&r.setSmokeLevel(Math.max(0,Math.min(10,i)));return}let a={notes:"notes",protein:"protein",weight_lb:"weight_lb",ambient:"ambient_override",wind:"wind_override"};a[s]&&r.setText(a[s],o.value)}),this.shadowRoot.addEventListener("input",e=>{let o=e.target.closest('[data-input="smoke_level"]');if(!o)return;let r=this.shadowRoot.querySelector('[data-bind="smoke-level-readout"]');r&&(r.textContent=o.value)})}_dispatchAction(e){if(!this._hass||!this._state)return;let o=E(this._hass,this._state),r=this._state.setpoint??225;switch(e){case"toggle-session":o.toggle("cook_session");break;case"toggle-smoke":o.toggle("smoke_mode");break;case"toggle-winter":o.toggle("winter_mode");break;case"toggle-alarm":o.toggle("alarm");break;case"toggle-push":o.toggle("push_alerts");break;case"temp-up":o.setSetpoint(Math.min(500,r+1));break;case"temp-down":o.setSetpoint(Math.max(180,r-1));break;case"power-off":o.powerOff();break}}};customElements.get(y)||customElements.define(y,H);window.customCards=window.customCards||[];window.customCards.some(t=>t.type===y)||window.customCards.push({type:y,name:"Prime Polaris Grill",description:"Live cook dashboard for the Prime Polaris pellet grill integration.",preview:!0});console.info(`%c ${y} %c v${z} `,"color:#fb923c;background:#0d1117;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:600","color:#0d1117;background:#fb923c;padding:2px 6px;border-radius:0 3px 3px 0");
