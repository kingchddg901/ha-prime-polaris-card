var y="ha-prime-polaris-card",O="0.1.3",R="grill",D={climate:"climate.{prefix}",chamber_temp:"sensor.{prefix}_chamber_temperature",running_status:"sensor.{prefix}_running_status",active_mode:"sensor.{prefix}_active_mode",active_smoke_level:"sensor.{prefix}_active_smoke_level",last_alarm:"sensor.{prefix}_last_alarm",probe_1_temp:"sensor.{prefix}_probe_1_temperature",probe_2_temp:"sensor.{prefix}_probe_2_temperature",probe_1_eta:"sensor.{prefix}_probe_1_eta",probe_2_eta:"sensor.{prefix}_probe_2_eta",setpoint:"number.{prefix}_temperature",smoke_level:"number.{prefix}_smoke_level",probe_1_target:"number.{prefix}_probe_1_target",probe_2_target:"number.{prefix}_probe_2_target",push_dedupe:"number.{prefix}_push_alert_dedupe",smoke_mode:"switch.{prefix}_smoke_mode",winter_mode:"switch.{prefix}_winter_mode",alarm:"switch.{prefix}_temperature_alarm",cook_session:"switch.{prefix}_cook_session",push_alerts:"switch.{prefix}_push_alerts",notes:"text.{prefix}_cook_notes",protein:"text.{prefix}_cook_protein",weight_lb:"text.{prefix}_cook_weight_lb",ambient_override:"text.{prefix}_cook_ambient_override",wind_override:"text.{prefix}_cook_wind_override"},E=4,z=3e4;function I(o,t){if(!o)return null;let e=a=>D[a].replace("{prefix}",t),r=a=>o.states[e(a)]??null,i=a=>{let c=r(a);if(!c)return null;let d=parseFloat(c.state);return Number.isFinite(d)?d:null},l=a=>r(a)?.state==="on",s=a=>{let c=r(a);return c?c.state==="unknown"||c.state==="unavailable"?"":c.state:""},p=a=>{let c=r(a===1?"probe_1_eta":"probe_2_eta");if(!c)return{minutes:null,in_stall:!1,stdev:null,source:null};let d=parseFloat(c.state);return{minutes:Number.isFinite(d)?d:null,in_stall:!!c.attributes?.in_stall,stdev:c.attributes?.stall_stdev??null,source:c.attributes?.prior_source??null,samples:c.attributes?.samples??0}},u=r("climate"),m=i("setpoint")??u?.attributes?.temperature??null;return{prefix:t,entityIds:Object.fromEntries(Object.keys(D).map(a=>[a,e(a)])),chamber:i("chamber_temp")??u?.attributes?.current_temperature??null,setpoint:m,chamberDelta:i("chamber_temp")!=null&&m!=null?i("chamber_temp")-m:null,runningStatus:s("running_status")||null,activeMode:s("active_mode")||"off",smokeLevel:i("active_smoke_level"),smokeOn:l("smoke_mode"),winterOn:l("winter_mode"),alarmOn:l("alarm"),probe1:{temp:i("probe_1_temp"),target:i("probe_1_target"),...p(1)},probe2:{temp:i("probe_2_temp"),target:i("probe_2_target"),...p(2)},cookSession:l("cook_session"),notes:s("notes"),protein:s("protein"),weight_lb:s("weight_lb"),ambient:s("ambient_override"),wind:s("wind_override"),pushOn:l("push_alerts"),pushDedupe:i("push_dedupe"),lastAlarm:(()=>{let a=r("last_alarm");return!a||a.state==="unknown"||a.state==="unavailable"||!a.state?null:{title:a.state,body:a.attributes?.body??"",captured_at:a.attributes?.captured_at??null,source:a.attributes?.source??null}})()}}function F(o,t){if(!o||!t)return{};let e=(r,i,l={})=>o.callService(r,i,l);return{setSetpoint:r=>e("number","set_value",{entity_id:t.entityIds.setpoint,value:r}),setSmokeLevel:r=>e("number","set_value",{entity_id:t.entityIds.smoke_level,value:r}),setProbeTarget:(r,i)=>e("number","set_value",{entity_id:t.entityIds[`probe_${r}_target`],value:i}),toggle:r=>{let i=t.entityIds[r],l=o.states[i]?.state==="on";return e("switch",l?"turn_off":"turn_on",{entity_id:i})},setText:(r,i)=>e("text","set_value",{entity_id:t.entityIds[r],value:i??""}),powerOff:()=>e("climate","set_hvac_mode",{entity_id:t.entityIds.climate,hvac_mode:"off"})}}var n={bg:"#0d1117",panel:"#161b22",panelBorder:"#30363d",text:"#e6edf3",textDim:"#8b949e",accent:"#fb923c",accentDim:"#9a3412",cool:"#3b82f6",hot:"#ef4444",steady:"#22c55e",smoke:"#a78bfa",alarm:"#f87171",stall:"#f59e0b",probe1:"#ef4444",probe2:"#06b6d4",chartChamber:"#fb923c",chartProbe1:"#ef4444",chartProbe2:"#06b6d4"},P=5;var N=`
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
`;var B="apexcharts-card",T=class{constructor(t){this._host=t,this._mode=null,this._apexEl=null,this._canvas=null,this._series={},this._historyLoaded=!1,this._lastConfig=null}async update(t,e){let r=e.join("|");if(r!==this._lastConfig&&(this._lastConfig=r,this._historyLoaded=!1,this._series={},this._host.innerHTML="",this._mode=customElements.get(B)?"apex":"canvas",this._mode==="apex"?this._mountApex(e):this._mountCanvas()),this._mode==="apex"){this._apexEl.hass=t;return}this._historyLoaded||(this._historyLoaded=!0,await this._loadHistory(t,e)),this._appendLive(t,e),this._draw(e)}_mountApex(t){let e=t.map((i,l)=>({entity:i,name:this._labelFor(i),yaxis_id:"temp",color:[n.chartChamber,n.chartProbe1,n.chartProbe2][l]||"#fff",type:l===0?"area":"line",opacity:l===0?.25:1,stroke_width:2})),r=document.createElement(B);r.setConfig({header:{show:!1},graph_span:`${E}h`,update_interval:`${z/1e3}s`,yaxis:[{id:"temp",decimals:0,apex_config:{title:{text:"\xB0F"},forceNiceScale:!0}}],series:e}),this._apexEl=r,this._host.appendChild(r)}_mountCanvas(){this._canvas=document.createElement("canvas"),this._host.appendChild(this._canvas)}async _loadHistory(t,e){let l=`history/period/${new Date(Date.now()-E*3600*1e3).toISOString()}?filter_entity_id=${e.join(",")}&minimal_response`;try{let s=await t.callApi("GET",l);for(let p=0;p<e.length;p++){let u=e[p],m=(s?.[p]??[]).map(a=>[Date.parse(a.last_changed),parseFloat(a.state)]).filter(([a,c])=>Number.isFinite(a)&&Number.isFinite(c));this._series[u]=m}}catch(s){console.warn("[ha-prime-polaris-card] history fetch failed:",s)}}_appendLive(t,e){let r=Date.now(),i=r-E*3600*1e3;for(let l of e){let s=this._series[l]??(this._series[l]=[]),p=parseFloat(t.states[l]?.state);if(Number.isFinite(p)){let u=s.length?s[s.length-1][0]:0;r-u>=5e3&&s.push([r,p])}for(;s.length&&s[0][0]<i;)s.shift()}}_draw(t){let e=this._canvas;if(!e)return;let r=window.devicePixelRatio||1,i=e.clientWidth||600,l=240;e.width=i*r,e.height=l*r;let s=e.getContext("2d");s.scale(r,r),s.clearRect(0,0,i,l);let p=t.flatMap(h=>this._series[h]??[]);if(p.length<2){s.fillStyle=n.textDim,s.font="12px system-ui",s.fillText("collecting data\u2026",16,24);return}let u=p.map(h=>h[0]),m=p.map(h=>h[1]),a=Math.min(...u),c=Math.max(...u),d=Math.min(...m)-5,x=Math.max(...m)+5,_={l:36,r:12,t:12,b:22},v=h=>_.l+(h-a)/Math.max(1,c-a)*(i-_.l-_.r),g=h=>_.t+(1-(h-d)/Math.max(1,x-d))*(l-_.t-_.b);s.strokeStyle=n.panelBorder,s.fillStyle=n.textDim,s.font="11px system-ui",s.lineWidth=1;let k=4;for(let h=0;h<=k;h++){let w=d+h/k*(x-d),b=g(w);s.beginPath(),s.moveTo(_.l,b),s.lineTo(i-_.r,b),s.stroke(),s.fillText(w.toFixed(0),6,b+4)}let S=[n.chartChamber,n.chartProbe1,n.chartProbe2];t.forEach((h,w)=>{let b=this._series[h]??[];if(!(b.length<2)){if(s.strokeStyle=S[w]||"#fff",s.lineWidth=w===0?1.5:2,w===0){s.fillStyle=S[0]+"40",s.beginPath(),s.moveTo(v(b[0][0]),g(d));for(let[C,A]of b)s.lineTo(v(C),g(A));s.lineTo(v(b[b.length-1][0]),g(d)),s.closePath(),s.fill()}s.beginPath(),s.moveTo(v(b[0][0]),g(b[0][1]));for(let[C,A]of b)s.lineTo(v(C),g(A));s.stroke()}})}_labelFor(t){return t.includes("chamber")?"Chamber":t.includes("probe_1")?"Probe 1":t.includes("probe_2")?"Probe 2":t}};var $=-135,M=135,V=M-$;function X(o){let t=o.size??220,e=t/2,r=t/2,i=t/2-18,l=o.min,s=o.max,p=o.current??l,u=o.target??l,m=Y(p,l,s),a=Y(u,l,s),c=o.fillColor??ot(p,u),d=G(e,r,i,$,M),x=G(e,r,i,$,m),_=L(e,r,i,a);return`
    <svg
      viewBox="0 0 ${t} ${t}"
      class="arc-gauge"
      data-gauge="true"
      data-min="${l}"
      data-max="${s}"
      data-cx="${e}"
      data-cy="${r}"
      data-r="${i}">

      <!-- track -->
      <path d="${d}"
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
      <circle cx="${_.x}" cy="${_.y}" r="11"
        fill="${n.accent}"
        stroke="${n.text}"
        stroke-width="2"
        data-thumb="true"
        style="cursor: grab;" />

      <!-- center readout: big chamber temp, small target -->
      <text x="${e}" y="${r-4}"
        text-anchor="middle"
        font-size="44"
        font-weight="600"
        fill="${n.text}"
        style="font-family: inherit;">
        ${o.current!=null?o.current.toFixed(0):"\u2014"}<tspan font-size="22" fill="${n.textDim}">\xB0F</tspan>
      </text>
      <text x="${e}" y="${r+24}"
        text-anchor="middle"
        font-size="13"
        fill="${n.textDim}"
        style="font-family: inherit;">
        target ${o.target??"\u2014"}\xB0F
      </text>
    </svg>
  `}function Y(o,t,e){let i=(Math.max(t,Math.min(e,o))-t)/(e-t);return $+i*V}function et(o,t,e){let r=o;for(;r<$-180;)r+=360;for(;r>M+180;)r-=360;let l=(Math.max($,Math.min(M,r))-$)/V;return Math.round(t+l*(e-t))}function L(o,t,e,r){let i=(r-90)*Math.PI/180;return{x:o+e*Math.cos(i),y:t+e*Math.sin(i)}}function G(o,t,e,r,i){let l=L(o,t,e,r),s=L(o,t,e,i),p=Math.abs(i-r)>180?1:0;return`M ${l.x} ${l.y} A ${e} ${e} 0 ${p} 1 ${s.x} ${s.y}`}function ot(o,t){if(o==null||t==null)return n.accent;let e=o-t;return e>P?n.hot:e<-P?n.cool:n.steady}function q(o,t){if(!o)return;let e=parseFloat(o.dataset.min),r=parseFloat(o.dataset.max),i=parseFloat(o.dataset.cx),l=parseFloat(o.dataset.cy),s=!1,p=null,u=(c,d)=>{let x=o.getBoundingClientRect(),_=o.viewBox.baseVal.width/x.width,v=o.viewBox.baseVal.height/x.height,g=(c-x.left)*_-i,k=(d-x.top)*v-l,S=Math.atan2(k,g)*180/Math.PI+90;return et(S,e,r)},m=c=>{if(!s)return;p=u(c.clientX,c.clientY)},a=()=>{s&&(s=!1,document.removeEventListener("pointermove",m),document.removeEventListener("pointerup",a),p!=null&&t(p))};o.addEventListener("pointerdown",c=>{let d=c.target,x=d.dataset?.thumb==="true";(d.tagName==="path"||x)&&(c.preventDefault(),s=!0,p=u(c.clientX,c.clientY),document.addEventListener("pointermove",m),document.addEventListener("pointerup",a))})}function f(o){return String(o??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function W(o){if(!o)return"";let{chamber:t,setpoint:e,chamberDelta:r}=o,i=r!=null?`\u0394 ${r>0?"+":""}${r.toFixed(0)}\xB0F`:"";return`
    <div class="panel tall arc-panel">
      <div class="panel-label">Chamber</div>
      ${X({min:180,max:500,current:t,target:e})}
      <div class="delta">${i} \xB7 drag the dot to set</div>
    </div>
  `}function j(o){if(!o)return"";let t=[];return o.runningStatus&&t.push({cls:"active",txt:o.runningStatus}),t.push({cls:o.activeMode==="smoke"?"smoke":"active",txt:`mode: ${o.activeMode}`}),o.smokeOn&&o.smokeLevel!=null&&t.push({cls:"smoke",txt:`smoke ${o.smokeLevel.toFixed(0)}`}),o.alarmOn&&t.push({cls:"alarm",txt:"alarm armed"}),o.winterOn&&t.push({cls:"active",txt:"winter"}),o.pushOn&&t.push({cls:"active",txt:"push on"}),`
    <div class="chip-row">
      ${t.map(e=>`<span class="chip ${e.cls}">${f(e.txt)}</span>`).join("")}
    </div>
  `}function Q(o){if(!o)return"";let t=o.cookSession,e=t?o.protein?`${f(o.protein)}${o.weight_lb?" \xB7 "+f(o.weight_lb)+" lb":""}`:"recording":"no active cook",r=o.notes?f(o.notes):t?"":"flip the switch when you start a real cook";return`
    <div class="panel tall">
      <div class="panel-label">Cook session</div>
      <div class="session-toggle">
        <span class="rec-dot ${t?"live":""}"></span>
        <button class="action ${t?"on":""}" data-action="toggle-session">
          ${t?"Stop session":"Start session"}
        </button>
      </div>
      <div class="big-temp" style="font-size:22px; margin-top:8px;">${e}</div>
      <div class="small">${r}</div>
    </div>
  `}function U(o,t){if(t.temp==null)return`
      <div class="panel">
        <div class="probe">
          <div class="probe-label">Probe ${o}</div>
          <div class="small">not connected</div>
        </div>
      </div>
    `;let e="fitting\u2026",r="fitting";if(t.in_stall)e=`\u{1F6D1} in stall \xB7 \u03C3 ${t.stdev?.toFixed(2)??"\u2014"}\xB0F`,r="stall";else if(t.minutes!=null){let i=Math.max(0,t.minutes);e=i>=60?`ETA ${(i/60).toFixed(1)} h`:`ETA ${i.toFixed(0)} min`,r=""}return`
    <div class="panel">
      <div class="probe">
        <div class="probe-label">Probe ${o}</div>
        <div>
          <div class="probe-temp">${t.temp.toFixed(0)}\xB0F</div>
          <div class="probe-target">\u2192 ${t.target??"\u2014"}\xB0F</div>
          <div class="probe-eta ${r}">${f(e)}</div>
          ${t.source?`<div class="small">prior: ${f(t.source)}</div>`:""}
        </div>
      </div>
    </div>
  `}function K(o){return o?`
    <div class="row">
      ${U(1,o.probe1)}
      ${U(2,o.probe2)}
    </div>
  `:""}function J(o){if(!o)return"";let t=o.smokeLevel??0;return`
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
        <button class="action ${o.smokeOn?"on":""}" data-action="toggle-smoke">Smoke</button>
        <button class="action ${o.winterOn?"on":""}" data-action="toggle-winter">Winter</button>
        <button class="action alarm ${o.alarmOn?"on":""}" data-action="toggle-alarm">Alarm</button>
        <button class="action ${o.pushOn?"on":""}" data-action="toggle-push">Push</button>
        <button class="action" data-action="power-off">Power off</button>
      </div>
    </div>
  `}function Z(o){return o?`
    <div class="panel">
      <div class="panel-label">Session inputs</div>
      <div class="session">
        <label>Protein</label>
        <input type="text" data-input="protein"   value="${f(o.protein)}"   placeholder="brisket / pork / ribs">
        <label>Weight (lb)</label>
        <input type="text" data-input="weight_lb" value="${f(o.weight_lb)}" placeholder="16">
        <label>Notes</label>
        <input type="text" data-input="notes"     value="${f(o.notes)}"     placeholder="oak, low and slow">
        <label>Ambient</label>
        <input type="text" data-input="ambient"   value="${f(o.ambient)}"   placeholder="weather.home or 32">
        <label>Wind</label>
        <input type="text" data-input="wind"      value="${f(o.wind)}"      placeholder="entity_id or m/s">
      </div>
    </div>
  `:""}function tt(o){if(!o)return"";let t=o.lastAlarm;return t?`
    <div class="alarm-banner">
      <span><strong>${f(t.title)}</strong> \xB7 ${f(t.body)}</span>
      <span class="small">${f(t.source??"")}</span>
    </div>
  `:'<div class="alarm-banner dim">no alarms</div>'}var H=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._state=null,this._chart=null,this._renderQueued=!1}setConfig(t){this._config={entity_prefix:t?.entity_prefix??R,title:t?.title??null,ambient_entity:t?.ambient_entity??null,...t},this._lastSig=null}set hass(t){this._hass=t,this._config&&(this._state=I(t,this._config.entity_prefix),this._scheduleRender())}getCardSize(){return 8}static getConfigElement(){return null}static getStubConfig(){return{entity_prefix:R}}_scheduleRender(){this._renderQueued||(this._renderQueued=!0,requestAnimationFrame(()=>{this._renderQueued=!1,this._render()}))}_render(){let t=this._state;this.shadowRoot.firstElementChild||(this.shadowRoot.innerHTML=`
        <style>${N}</style>
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
      `,this._wireEvents()),this._fill("alarm",tt(t)),this._fill("chips",j(t)),this._fill("chamber",W(t)),this._fill("cookHeader",Q(t)),this._fill("probes",K(t)),this._fillPreserveFocus("controls",J(t)),this._fillPreserveFocus("session",Z(t));let e=this.shadowRoot.querySelector('[data-gauge="true"]');if(e){let r=F(this._hass,this._state);q(e,i=>r.setSetpoint(i))}if(this._hass&&t){if(!this._chart){let i=this.shadowRoot.querySelector('[data-slot="chart"]');this._chart=new T(i)}let r=[t.entityIds.chamber_temp,t.entityIds.probe_1_temp,t.entityIds.probe_2_temp];this._chart.update(this._hass,r)}}_fill(t,e){let r=this.shadowRoot.querySelector(`[data-slot="${t}"]`);r&&(r.innerHTML=e)}_fillPreserveFocus(t,e){let r=this.shadowRoot.querySelector(`[data-slot="${t}"]`);if(!r)return;let i=this.shadowRoot.activeElement;if(!(i&&i.dataset?.input&&r.contains(i))){r.innerHTML=e;return}let s=i.dataset.input,p=i.value,u=i.selectionStart,m=i.selectionEnd;r.innerHTML=e;let a=r.querySelector(`[data-input="${s}"]`);if(a){a.value=p,a.focus();try{a.setSelectionRange(u,m)}catch{}}}_wireEvents(){this.shadowRoot.addEventListener("click",t=>{let e=t.target.closest("[data-action]");e&&this._dispatchAction(e.dataset.action)}),this.shadowRoot.addEventListener("change",t=>{let e=t.target.closest("[data-input]");if(!e)return;let r=F(this._hass,this._state),i=e.dataset.input;if(i==="setpoint"){let s=parseInt(e.value,10);Number.isFinite(s)&&r.setSetpoint(Math.max(180,Math.min(500,s)));return}if(i==="smoke_level"){let s=parseInt(e.value,10);Number.isFinite(s)&&r.setSmokeLevel(Math.max(0,Math.min(10,s)));return}let l={notes:"notes",protein:"protein",weight_lb:"weight_lb",ambient:"ambient_override",wind:"wind_override"};l[i]&&r.setText(l[i],e.value)}),this.shadowRoot.addEventListener("input",t=>{let e=t.target.closest('[data-input="smoke_level"]');if(!e)return;let r=this.shadowRoot.querySelector('[data-bind="smoke-level-readout"]');r&&(r.textContent=e.value)})}_dispatchAction(t){if(!this._hass||!this._state)return;let e=F(this._hass,this._state),r=this._state.setpoint??225;switch(t){case"toggle-session":e.toggle("cook_session");break;case"toggle-smoke":e.toggle("smoke_mode");break;case"toggle-winter":e.toggle("winter_mode");break;case"toggle-alarm":e.toggle("alarm");break;case"toggle-push":e.toggle("push_alerts");break;case"temp-up":e.setSetpoint(Math.min(500,r+1));break;case"temp-down":e.setSetpoint(Math.max(180,r-1));break;case"power-off":e.powerOff();break}}};customElements.get(y)||customElements.define(y,H);window.customCards=window.customCards||[];window.customCards.some(o=>o.type===y)||window.customCards.push({type:y,name:"Prime Polaris Grill",description:"Live cook dashboard for the Prime Polaris pellet grill integration.",preview:!0});console.info(`%c ${y} %c v${O} `,"color:#fb923c;background:#0d1117;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:600","color:#0d1117;background:#fb923c;padding:2px 6px;border-radius:0 3px 3px 0");
