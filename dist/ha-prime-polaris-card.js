var y="ha-prime-polaris-card",N="0.1.6",A="grill",D={climate:"climate.{prefix}",chamber_temp:"sensor.{prefix}_chamber_temperature",running_status:"sensor.{prefix}_running_status",active_mode:"sensor.{prefix}_active_mode",active_smoke_level:"sensor.{prefix}_active_smoke_level",last_alarm:"sensor.{prefix}_last_alarm",probe_1_temp:"sensor.{prefix}_probe_1_temperature",probe_2_temp:"sensor.{prefix}_probe_2_temperature",probe_1_eta:"sensor.{prefix}_probe_1_eta",probe_2_eta:"sensor.{prefix}_probe_2_eta",setpoint:"number.{prefix}_temperature",smoke_level:"number.{prefix}_smoke_level",probe_1_target:"number.{prefix}_probe_1_target",probe_2_target:"number.{prefix}_probe_2_target",push_dedupe:"number.{prefix}_push_alert_dedupe",smoke_mode:"switch.{prefix}_smoke_mode",winter_mode:"switch.{prefix}_winter_mode",alarm:"switch.{prefix}_temperature_alarm",cook_session:"switch.{prefix}_cook_session",push_alerts:"switch.{prefix}_push_alerts",notes:"text.{prefix}_cook_notes",protein:"text.{prefix}_cook_protein",weight_lb:"text.{prefix}_cook_weight_lb",ambient_override:"text.{prefix}_cook_ambient_override",wind_override:"text.{prefix}_cook_wind_override"},F=4,z=3e4;var ot=/^[a-z_]+\.[a-z0-9_]+$/;function O(e,t,o){let r={value:null,source:""};if(!e||!t)return r;if(ot.test(t)){let a=e.states[t];if(!a)return{value:null,source:`${t} (missing)`};if(t.startsWith("weather.")&&a.attributes?.[o]!=null){let d=parseFloat(a.attributes[o]);return Number.isFinite(d)?{value:d,source:t}:r}let s=parseFloat(a.state);return Number.isFinite(s)?{value:s,source:t}:r}let n=parseFloat(t);return Number.isFinite(n)?{value:n,source:"literal"}:r}function I(e,t){if(!e)return null;let o=l=>D[l].replace("{prefix}",t),r=l=>e.states[o(l)]??null,n=l=>{let c=r(l);if(!c)return null;let p=parseFloat(c.state);return Number.isFinite(p)?p:null},a=l=>r(l)?.state==="on",s=l=>{let c=r(l);return c?c.state==="unknown"||c.state==="unavailable"?"":c.state:""},d=l=>{let c=r(l===1?"probe_1_eta":"probe_2_eta");if(!c)return{minutes:null,in_stall:!1,stdev:null,source:null};let p=parseFloat(c.state);return{minutes:Number.isFinite(p)?p:null,in_stall:!!c.attributes?.in_stall,stdev:c.attributes?.stall_stdev??null,source:c.attributes?.prior_source??null,samples:c.attributes?.samples??0}},u=r("climate"),m=n("setpoint")??u?.attributes?.temperature??null;return{prefix:t,entityIds:Object.fromEntries(Object.keys(D).map(l=>[l,o(l)])),chamber:n("chamber_temp")??u?.attributes?.current_temperature??null,setpoint:m,chamberDelta:n("chamber_temp")!=null&&m!=null?n("chamber_temp")-m:null,runningStatus:s("running_status")||null,activeMode:s("active_mode")||"off",smokeLevel:n("active_smoke_level"),smokeOn:a("smoke_mode"),winterOn:a("winter_mode"),alarmOn:a("alarm"),probe1:{temp:n("probe_1_temp"),target:n("probe_1_target"),...d(1)},probe2:{temp:n("probe_2_temp"),target:n("probe_2_target"),...d(2)},cookSession:a("cook_session"),notes:s("notes"),protein:s("protein"),weight_lb:s("weight_lb"),ambient:s("ambient_override"),wind:s("wind_override"),ambientResolved:O(e,s("ambient_override"),"temperature"),windResolved:O(e,s("wind_override"),"wind_speed"),pushOn:a("push_alerts"),pushDedupe:n("push_dedupe"),lastAlarm:(()=>{let l=r("last_alarm");return!l||l.state==="unknown"||l.state==="unavailable"||!l.state?null:{title:l.state,body:l.attributes?.body??"",captured_at:l.attributes?.captured_at??null,source:l.attributes?.source??null}})()}}function E(e,t){if(!e||!t)return{};let o=(r,n,a={})=>e.callService(r,n,a);return{setSetpoint:r=>o("number","set_value",{entity_id:t.entityIds.setpoint,value:r}),setSmokeLevel:r=>o("number","set_value",{entity_id:t.entityIds.smoke_level,value:r}),setProbeTarget:(r,n)=>o("number","set_value",{entity_id:t.entityIds[`probe_${r}_target`],value:n}),toggle:r=>{let n=t.entityIds[r],a=e.states[n]?.state==="on";return o("switch",a?"turn_off":"turn_on",{entity_id:n})},setText:(r,n)=>o("text","set_value",{entity_id:t.entityIds[r],value:n??""}),powerOff:()=>o("climate","set_hvac_mode",{entity_id:t.entityIds.climate,hvac_mode:"off"})}}var i={bg:"#0d1117",panel:"#161b22",panelBorder:"#30363d",text:"#e6edf3",textDim:"#8b949e",accent:"#fb923c",accentDim:"#9a3412",cool:"#3b82f6",hot:"#ef4444",steady:"#22c55e",smoke:"#a78bfa",alarm:"#f87171",stall:"#f59e0b",probe1:"#ef4444",probe2:"#06b6d4",chartChamber:"#fb923c",chartProbe1:"#ef4444",chartProbe2:"#06b6d4"},P=5;var B=`
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
  }
  .alarm-banner.dim {
    background: ${i.panel};
    border-color: ${i.panelBorder};
    color: ${i.textDim};
  }
  .small { font-size: 11px; color: ${i.textDim}; }

  @media (max-width: 600px) {
    .row { grid-template-columns: 1fr; }
  }
`;var Y="apexcharts-card",T=class{constructor(t){this._host=t,this._mode=null,this._apexEl=null,this._canvas=null,this._series={},this._historyLoaded=!1,this._lastConfig=null}async update(t,o){let r=o.join("|");if(r!==this._lastConfig&&(this._lastConfig=r,this._historyLoaded=!1,this._series={},this._host.innerHTML="",this._mode=customElements.get(Y)?"apex":"canvas",this._mode==="apex"?this._mountApex(o):this._mountCanvas()),this._mode==="apex"){this._apexEl.hass=t;return}this._historyLoaded||(this._historyLoaded=!0,await this._loadHistory(t,o)),this._appendLive(t,o),this._draw(o)}_mountApex(t){let o=t.map((n,a)=>({entity:n,name:this._labelFor(n),yaxis_id:"temp",color:[i.chartChamber,i.chartProbe1,i.chartProbe2][a]||"#fff",type:a===0?"area":"line",opacity:a===0?.25:1,stroke_width:2})),r=document.createElement(Y);r.setConfig({header:{show:!1},graph_span:`${F}h`,update_interval:`${z/1e3}s`,yaxis:[{id:"temp",decimals:0,apex_config:{title:{text:"\xB0F"},forceNiceScale:!0}}],series:o}),this._apexEl=r,this._host.appendChild(r)}_mountCanvas(){this._canvas=document.createElement("canvas"),this._host.appendChild(this._canvas)}async _loadHistory(t,o){let a=`history/period/${new Date(Date.now()-F*3600*1e3).toISOString()}?filter_entity_id=${o.join(",")}&minimal_response`;try{let s=await t.callApi("GET",a);for(let d=0;d<o.length;d++){let u=o[d],m=(s?.[d]??[]).map(l=>[Date.parse(l.last_changed),parseFloat(l.state)]).filter(([l,c])=>Number.isFinite(l)&&Number.isFinite(c));this._series[u]=m}}catch(s){console.warn("[ha-prime-polaris-card] history fetch failed:",s)}}_appendLive(t,o){let r=Date.now(),n=r-F*3600*1e3;for(let a of o){let s=this._series[a]??(this._series[a]=[]),d=parseFloat(t.states[a]?.state);if(Number.isFinite(d)){let u=s.length?s[s.length-1][0]:0;r-u>=5e3&&s.push([r,d])}for(;s.length&&s[0][0]<n;)s.shift()}}_draw(t){let o=this._canvas;if(!o)return;let r=window.devicePixelRatio||1,n=o.clientWidth||600,a=240;o.width=n*r,o.height=a*r;let s=o.getContext("2d");s.scale(r,r),s.clearRect(0,0,n,a);let d=t.flatMap(h=>this._series[h]??[]);if(d.length<2){s.fillStyle=i.textDim,s.font="12px system-ui",s.fillText("collecting data\u2026",16,24);return}let u=d.map(h=>h[0]),m=d.map(h=>h[1]),l=Math.min(...u),c=Math.max(...u),p=Math.min(...m)-5,x=Math.max(...m)+5,_={l:36,r:12,t:12,b:22},v=h=>_.l+(h-l)/Math.max(1,c-l)*(n-_.l-_.r),g=h=>_.t+(1-(h-p)/Math.max(1,x-p))*(a-_.t-_.b);s.strokeStyle=i.panelBorder,s.fillStyle=i.textDim,s.font="11px system-ui",s.lineWidth=1;let k=4;for(let h=0;h<=k;h++){let w=p+h/k*(x-p),f=g(w);s.beginPath(),s.moveTo(_.l,f),s.lineTo(n-_.r,f),s.stroke(),s.fillText(w.toFixed(0),6,f+4)}let S=[i.chartChamber,i.chartProbe1,i.chartProbe2];t.forEach((h,w)=>{let f=this._series[h]??[];if(!(f.length<2)){if(s.strokeStyle=S[w]||"#fff",s.lineWidth=w===0?1.5:2,w===0){s.fillStyle=S[0]+"40",s.beginPath(),s.moveTo(v(f[0][0]),g(p));for(let[M,C]of f)s.lineTo(v(M),g(C));s.lineTo(v(f[f.length-1][0]),g(p)),s.closePath(),s.fill()}s.beginPath(),s.moveTo(v(f[0][0]),g(f[0][1]));for(let[M,C]of f)s.lineTo(v(M),g(C));s.stroke()}})}_labelFor(t){return t.includes("chamber")?"Chamber":t.includes("probe_1")?"Probe 1":t.includes("probe_2")?"Probe 2":t}};var $=-135,R=135,X=R-$;function q(e){let t=e.size??220,o=t/2,r=t/2,n=t/2-18,a=e.min,s=e.max,d=e.current??a,u=e.target??a,m=V(d,a,s),l=V(u,a,s),c=e.fillColor??it(d,u),p=G(o,r,n,$,R),x=G(o,r,n,$,m),_=L(o,r,n,l);return`
    <svg
      viewBox="0 0 ${t} ${t}"
      class="arc-gauge"
      data-gauge="true"
      data-min="${a}"
      data-max="${s}"
      data-cx="${o}"
      data-cy="${r}"
      data-r="${n}">

      <!-- track -->
      <path d="${p}"
        stroke="${i.panelBorder}"
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
      <circle cx="${_.x}" cy="${_.y}" r="11"
        fill="${i.accent}"
        stroke="${i.text}"
        stroke-width="2"
        data-thumb="true"
        style="cursor: grab;" />

      <!-- center readout: big chamber temp, small target -->
      <text x="${o}" y="${r-4}"
        text-anchor="middle"
        font-size="44"
        font-weight="600"
        fill="${i.text}"
        style="font-family: inherit;">
        ${e.current!=null?e.current.toFixed(0):"\u2014"}<tspan font-size="22" fill="${i.textDim}">\xB0F</tspan>
      </text>
      <text x="${o}" y="${r+24}"
        text-anchor="middle"
        font-size="13"
        fill="${i.textDim}"
        style="font-family: inherit;">
        target ${e.target??"\u2014"}\xB0F
      </text>
    </svg>
  `}function V(e,t,o){let n=(Math.max(t,Math.min(o,e))-t)/(o-t);return $+n*X}function rt(e,t,o){let r=e;for(;r<$-180;)r+=360;for(;r>R+180;)r-=360;let a=(Math.max($,Math.min(R,r))-$)/X;return Math.round(t+a*(o-t))}function L(e,t,o,r){let n=(r-90)*Math.PI/180;return{x:e+o*Math.cos(n),y:t+o*Math.sin(n)}}function G(e,t,o,r,n){let a=L(e,t,o,r),s=L(e,t,o,n),d=Math.abs(n-r)>180?1:0;return`M ${a.x} ${a.y} A ${o} ${o} 0 ${d} 1 ${s.x} ${s.y}`}function it(e,t){if(e==null||t==null)return i.accent;let o=e-t;return o>P?i.hot:o<-P?i.cool:i.steady}function W(e,t){if(!e)return;let o=parseFloat(e.dataset.min),r=parseFloat(e.dataset.max),n=parseFloat(e.dataset.cx),a=parseFloat(e.dataset.cy),s=!1,d=null,u=(c,p)=>{let x=e.getBoundingClientRect(),_=e.viewBox.baseVal.width/x.width,v=e.viewBox.baseVal.height/x.height,g=(c-x.left)*_-n,k=(p-x.top)*v-a,S=Math.atan2(k,g)*180/Math.PI+90;return rt(S,o,r)},m=c=>{if(!s)return;d=u(c.clientX,c.clientY)},l=()=>{s&&(s=!1,document.removeEventListener("pointermove",m),document.removeEventListener("pointerup",l),d!=null&&t(d))};e.addEventListener("pointerdown",c=>{let p=c.target,x=p.dataset?.thumb==="true";(p.tagName==="path"||x)&&(c.preventDefault(),s=!0,d=u(c.clientX,c.clientY),document.addEventListener("pointermove",m),document.addEventListener("pointerup",l))})}function b(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function j(e){if(!e)return"";let{chamber:t,setpoint:o,chamberDelta:r}=e,n=r!=null?`\u0394 ${r>0?"+":""}${r.toFixed(0)}\xB0F`:"";return`
    <div class="panel tall arc-panel">
      <div class="panel-label">Chamber</div>
      ${q({min:180,max:500,current:t,target:o})}
      <div class="delta">${n} \xB7 drag the dot to set</div>
    </div>
  `}function Q(e){if(!e)return"";let t=[];return e.runningStatus&&t.push({cls:"active",txt:e.runningStatus}),t.push({cls:e.activeMode==="smoke"?"smoke":"active",txt:`mode: ${e.activeMode}`}),e.smokeOn&&e.smokeLevel!=null&&t.push({cls:"smoke",txt:`smoke ${e.smokeLevel.toFixed(0)}`}),e.alarmOn&&t.push({cls:"alarm",txt:"alarm armed"}),e.winterOn&&t.push({cls:"active",txt:"winter"}),e.pushOn&&t.push({cls:"active",txt:"push on"}),e.ambient&&t.push(e.ambientResolved.value!=null?{cls:"active",txt:`ambient ${e.ambientResolved.value.toFixed(0)}\xB0F`}:{cls:"alarm",txt:"ambient unresolved"}),e.wind&&t.push(e.windResolved.value!=null?{cls:"active",txt:`wind ${e.windResolved.value.toFixed(1)}`}:{cls:"alarm",txt:"wind unresolved"}),`
    <div class="chip-row">
      ${t.map(o=>`<span class="chip ${o.cls}">${b(o.txt)}</span>`).join("")}
    </div>
  `}function J(e){if(!e)return"";let t=e.cookSession,o=t?e.protein?`${b(e.protein)}${e.weight_lb?" \xB7 "+b(e.weight_lb)+" lb":""}`:"recording":"no active cook",r=e.notes?b(e.notes):t?"":"flip the switch when you start a real cook";return`
    <div class="panel tall">
      <div class="panel-label">Cook session</div>
      <div class="session-toggle">
        <span class="rec-dot ${t?"live":""}"></span>
        <button class="action ${t?"on":""}" data-action="toggle-session">
          ${t?"Stop session":"Start session"}
        </button>
      </div>
      <div class="big-temp" style="font-size:22px; margin-top:8px;">${o}</div>
      <div class="small">${r}</div>
    </div>
  `}function U(e,t){if(t.temp==null)return`
      <div class="panel">
        <div class="probe">
          <div class="probe-label">Probe ${e}</div>
          <div class="small">not connected</div>
        </div>
      </div>
    `;let o="fitting\u2026",r="fitting";if(t.in_stall)o=`\u{1F6D1} in stall \xB7 \u03C3 ${t.stdev?.toFixed(2)??"\u2014"}\xB0F`,r="stall";else if(t.minutes!=null){let n=Math.max(0,t.minutes);o=n>=60?`ETA ${(n/60).toFixed(1)} h`:`ETA ${n.toFixed(0)} min`,r=""}return`
    <div class="panel">
      <div class="probe">
        <div class="probe-label">Probe ${e}</div>
        <div>
          <div class="probe-temp">${t.temp.toFixed(0)}\xB0F</div>
          <div class="probe-target">\u2192 ${t.target??"\u2014"}\xB0F</div>
          <div class="probe-eta ${r}">${b(o)}</div>
          ${t.source?`<div class="small">prior: ${b(t.source)}</div>`:""}
        </div>
      </div>
    </div>
  `}function K(e){return e?`
    <div class="row">
      ${U(1,e.probe1)}
      ${U(2,e.probe2)}
    </div>
  `:""}function Z(e){if(!e)return"";let t=e.smokeLevel??0;return`
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
          value="${t}">
        <span class="stepper-unit" data-bind="smoke-level-readout">${t}</span>
      </div>
      <div class="controls">
        <button class="action ${e.smokeOn?"on":""}" data-action="toggle-smoke">Smoke</button>
        <button class="action ${e.winterOn?"on":""}" data-action="toggle-winter">Winter</button>
        <button class="action alarm ${e.alarmOn?"on":""}" data-action="toggle-alarm">Alarm</button>
        <button class="action ${e.pushOn?"on":""}" data-action="toggle-push">Push</button>
        <button class="action" data-action="power-off">Power off</button>
      </div>
    </div>
  `}function tt(e){return e?`
    <div class="panel">
      <div class="panel-label">Session inputs</div>
      <div class="session">
        <label>Protein</label>
        <input type="text" data-input="protein"   value="${b(e.protein)}"   placeholder="brisket / pork / ribs">
        <label>Weight (lb)</label>
        <input type="text" data-input="weight_lb" value="${b(e.weight_lb)}" placeholder="16">
        <label>Notes</label>
        <input type="text" data-input="notes"     value="${b(e.notes)}"     placeholder="oak, low and slow">
        <label>Ambient</label>
        <input type="text" data-input="ambient"   value="${b(e.ambient)}"   placeholder="entity_id or fixed \xB0F">
        <label>Wind</label>
        <input type="text" data-input="wind"      value="${b(e.wind)}"      placeholder="entity_id or fixed value">
      </div>
    </div>
  `:""}function et(e){if(!e)return"";let t=e.lastAlarm;return t?`
    <div class="alarm-banner">
      <span><strong>${b(t.title)}</strong> \xB7 ${b(t.body)}</span>
      <span class="small">${b(t.source??"")}</span>
    </div>
  `:'<div class="alarm-banner dim">no alarms</div>'}var H=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._state=null,this._chart=null,this._renderQueued=!1}setConfig(t){this._config={entity_prefix:t?.entity_prefix??A,title:t?.title??null,ambient_entity:t?.ambient_entity??null,...t},this._lastSig=null}set hass(t){this._hass=t,this._config&&(this._state=I(t,this._config.entity_prefix),this._scheduleRender())}getCardSize(){return 8}static getConfigElement(){return null}static getStubConfig(){return{entity_prefix:A}}_scheduleRender(){this._renderQueued||(this._renderQueued=!0,requestAnimationFrame(()=>{this._renderQueued=!1,this._render()}))}_render(){let t=this._state;this.shadowRoot.firstElementChild||(this.shadowRoot.innerHTML=`
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
      `,this._wireEvents()),this._fill("alarm",et(t)),this._fill("chips",Q(t)),this._fill("chamber",j(t)),this._fill("cookHeader",J(t)),this._fill("probes",K(t)),this._fillPreserveFocus("controls",Z(t)),this._fillPreserveFocus("session",tt(t));let o=this.shadowRoot.querySelector('[data-gauge="true"]');if(o){let r=E(this._hass,this._state);W(o,n=>r.setSetpoint(n))}if(this._hass&&t){if(!this._chart){let n=this.shadowRoot.querySelector('[data-slot="chart"]');this._chart=new T(n)}let r=[t.entityIds.chamber_temp,t.entityIds.probe_1_temp,t.entityIds.probe_2_temp];this._chart.update(this._hass,r)}}_fill(t,o){let r=this.shadowRoot.querySelector(`[data-slot="${t}"]`);r&&(r.innerHTML=o)}_fillPreserveFocus(t,o){let r=this.shadowRoot.querySelector(`[data-slot="${t}"]`);if(!r)return;let n=this.shadowRoot.activeElement;if(!(n&&n.dataset?.input&&r.contains(n))){r.innerHTML=o;return}let s=n.dataset.input,d=n.value,u=n.selectionStart,m=n.selectionEnd;r.innerHTML=o;let l=r.querySelector(`[data-input="${s}"]`);if(l){l.value=d,l.focus();try{l.setSelectionRange(u,m)}catch{}}}_wireEvents(){this.shadowRoot.addEventListener("click",t=>{let o=t.target.closest("[data-action]");o&&this._dispatchAction(o.dataset.action)}),this.shadowRoot.addEventListener("change",t=>{let o=t.target.closest("[data-input]");if(!o)return;let r=E(this._hass,this._state),n=o.dataset.input;if(n==="setpoint"){let s=parseInt(o.value,10);Number.isFinite(s)&&r.setSetpoint(Math.max(180,Math.min(500,s)));return}if(n==="smoke_level"){let s=parseInt(o.value,10);Number.isFinite(s)&&r.setSmokeLevel(Math.max(0,Math.min(10,s)));return}let a={notes:"notes",protein:"protein",weight_lb:"weight_lb",ambient:"ambient_override",wind:"wind_override"};a[n]&&r.setText(a[n],o.value)}),this.shadowRoot.addEventListener("input",t=>{let o=t.target.closest('[data-input="smoke_level"]');if(!o)return;let r=this.shadowRoot.querySelector('[data-bind="smoke-level-readout"]');r&&(r.textContent=o.value)})}_dispatchAction(t){if(!this._hass||!this._state)return;let o=E(this._hass,this._state),r=this._state.setpoint??225;switch(t){case"toggle-session":o.toggle("cook_session");break;case"toggle-smoke":o.toggle("smoke_mode");break;case"toggle-winter":o.toggle("winter_mode");break;case"toggle-alarm":o.toggle("alarm");break;case"toggle-push":o.toggle("push_alerts");break;case"temp-up":o.setSetpoint(Math.min(500,r+1));break;case"temp-down":o.setSetpoint(Math.max(180,r-1));break;case"power-off":o.powerOff();break}}};customElements.get(y)||customElements.define(y,H);window.customCards=window.customCards||[];window.customCards.some(e=>e.type===y)||window.customCards.push({type:y,name:"Prime Polaris Grill",description:"Live cook dashboard for the Prime Polaris pellet grill integration.",preview:!0});console.info(`%c ${y} %c v${N} `,"color:#fb923c;background:#0d1117;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:600","color:#0d1117;background:#fb923c;padding:2px 6px;border-radius:0 3px 3px 0");
