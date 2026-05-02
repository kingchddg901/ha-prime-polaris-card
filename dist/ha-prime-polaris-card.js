var v="ha-prime-polaris-card",P="0.1.2",E="grill",T={climate:"climate.{prefix}",chamber_temp:"sensor.{prefix}_chamber_temperature",running_status:"sensor.{prefix}_running_status",active_mode:"sensor.{prefix}_active_mode",active_smoke_level:"sensor.{prefix}_active_smoke_level",last_alarm:"sensor.{prefix}_last_alarm",probe_1_temp:"sensor.{prefix}_probe_1_temperature",probe_2_temp:"sensor.{prefix}_probe_2_temperature",probe_1_eta:"sensor.{prefix}_probe_1_eta",probe_2_eta:"sensor.{prefix}_probe_2_eta",setpoint:"number.{prefix}_temperature",smoke_level:"number.{prefix}_smoke_level",probe_1_target:"number.{prefix}_probe_1_target",probe_2_target:"number.{prefix}_probe_2_target",push_dedupe:"number.{prefix}_push_alert_dedupe",smoke_mode:"switch.{prefix}_smoke_mode",winter_mode:"switch.{prefix}_winter_mode",alarm:"switch.{prefix}_temperature_alarm",cook_session:"switch.{prefix}_cook_session",push_alerts:"switch.{prefix}_push_alerts",notes:"text.{prefix}_cook_notes",protein:"text.{prefix}_cook_protein",weight_lb:"text.{prefix}_cook_weight_lb",ambient_override:"text.{prefix}_cook_ambient_override",wind_override:"text.{prefix}_cook_wind_override"},$=4,L=3e4;function H(i,e){if(!i)return null;let t=a=>T[a].replace("{prefix}",e),o=a=>i.states[t(a)]??null,n=a=>{let p=o(a);if(!p)return null;let m=parseFloat(p.state);return Number.isFinite(m)?m:null},l=a=>o(a)?.state==="on",r=a=>{let p=o(a);return p?p.state==="unknown"||p.state==="unavailable"?"":p.state:""},c=a=>{let p=o(a===1?"probe_1_eta":"probe_2_eta");if(!p)return{minutes:null,in_stall:!1,stdev:null,source:null};let m=parseFloat(p.state);return{minutes:Number.isFinite(m)?m:null,in_stall:!!p.attributes?.in_stall,stdev:p.attributes?.stall_stdev??null,source:p.attributes?.prior_source??null,samples:p.attributes?.samples??0}},b=o("climate"),_=n("setpoint")??b?.attributes?.temperature??null;return{prefix:e,entityIds:Object.fromEntries(Object.keys(T).map(a=>[a,t(a)])),chamber:n("chamber_temp")??b?.attributes?.current_temperature??null,setpoint:_,chamberDelta:n("chamber_temp")!=null&&_!=null?n("chamber_temp")-_:null,runningStatus:r("running_status")||null,activeMode:r("active_mode")||"off",smokeLevel:n("active_smoke_level"),smokeOn:l("smoke_mode"),winterOn:l("winter_mode"),alarmOn:l("alarm"),probe1:{temp:n("probe_1_temp"),target:n("probe_1_target"),...c(1)},probe2:{temp:n("probe_2_temp"),target:n("probe_2_target"),...c(2)},cookSession:l("cook_session"),notes:r("notes"),protein:r("protein"),weight_lb:r("weight_lb"),ambient:r("ambient_override"),wind:r("wind_override"),pushOn:l("push_alerts"),pushDedupe:n("push_dedupe"),lastAlarm:(()=>{let a=o("last_alarm");return!a||a.state==="unknown"||a.state==="unavailable"||!a.state?null:{title:a.state,body:a.attributes?.body??"",captured_at:a.attributes?.captured_at??null,source:a.attributes?.source??null}})()}}function F(i,e){if(!i||!e)return{};let t=(o,n,l={})=>i.callService(o,n,l);return{setSetpoint:o=>t("number","set_value",{entity_id:e.entityIds.setpoint,value:o}),setSmokeLevel:o=>t("number","set_value",{entity_id:e.entityIds.smoke_level,value:o}),setProbeTarget:(o,n)=>t("number","set_value",{entity_id:e.entityIds[`probe_${o}_target`],value:n}),toggle:o=>{let n=e.entityIds[o],l=i.states[n]?.state==="on";return t("switch",l?"turn_off":"turn_on",{entity_id:n})},setText:(o,n)=>t("text","set_value",{entity_id:e.entityIds[o],value:n??""}),powerOff:()=>t("climate","set_hvac_mode",{entity_id:e.entityIds.climate,hvac_mode:"off"})}}var s={bg:"#0d1117",panel:"#161b22",panelBorder:"#30363d",text:"#e6edf3",textDim:"#8b949e",accent:"#fb923c",accentDim:"#9a3412",cool:"#3b82f6",hot:"#ef4444",steady:"#22c55e",smoke:"#a78bfa",alarm:"#f87171",stall:"#f59e0b",probe1:"#ef4444",probe2:"#06b6d4",chartChamber:"#fb923c",chartProbe1:"#ef4444",chartProbe2:"#06b6d4"},C=5;var O=`
  :host {
    display: block;
    color: ${s.text};
    font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
  }
  .card {
    background: ${s.bg};
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
    background: ${s.panel};
    border: 1px solid ${s.panelBorder};
    border-radius: 10px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .panel.tall { padding: 16px 14px; }
  .panel-label {
    font-size: 11px;
    color: ${s.textDim};
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
    color: ${s.textDim};
    font-weight: 400;
    margin-left: 4px;
  }
  .big-temp.over   { color: ${s.hot}; }
  .big-temp.under  { color: ${s.cool}; }
  .big-temp.steady { color: ${s.steady}; }
  .delta {
    font-size: 13px;
    color: ${s.textDim};
    margin-top: 2px;
  }
  .chip-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .chip {
    background: ${s.bg};
    border: 1px solid ${s.panelBorder};
    border-radius: 999px;
    padding: 3px 10px;
    font-size: 11px;
    color: ${s.textDim};
  }
  .chip.active   { border-color: ${s.accent}; color: ${s.accent}; }
  .chip.smoke    { border-color: ${s.smoke};  color: ${s.smoke};  }
  .chip.alarm    { border-color: ${s.alarm};  color: ${s.alarm};  }
  .chip.stall    { border-color: ${s.stall};  color: ${s.stall};  }

  .probe {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    align-items: center;
  }
  .probe-label { font-size: 11px; color: ${s.textDim}; text-transform: uppercase; }
  .probe-temp {
    font-size: 28px;
    font-weight: 600;
    line-height: 1;
  }
  .probe-target {
    font-size: 13px;
    color: ${s.textDim};
  }
  .probe-eta {
    font-size: 14px;
    color: ${s.text};
    margin-top: 2px;
  }
  .probe-eta.fitting { color: ${s.textDim}; font-style: italic; }
  .probe-eta.stall   { color: ${s.stall}; font-weight: 500; }

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
    color: ${s.textDim};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    flex: 0 0 88px;
  }
  .stepper-input {
    background: ${s.bg};
    color: ${s.text};
    border: 1px solid ${s.panelBorder};
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
  .stepper-input:focus { outline: none; border-color: ${s.accent}; }
  .stepper-unit {
    font-size: 13px;
    color: ${s.textDim};
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
    accent-color: ${s.accent};
    height: 6px;
  }
  button.action {
    background: ${s.panel};
    color: ${s.text};
    border: 1px solid ${s.panelBorder};
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
    font-size: 13px;
    transition: border-color 0.15s, background 0.15s;
  }
  button.action:hover { border-color: ${s.accent}; }
  button.action.on    { border-color: ${s.accent}; background: ${s.accentDim}; color: ${s.text}; }
  button.action.alarm.on { border-color: ${s.alarm}; background: #4b1d1d; }

  .session {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    align-items: center;
  }
  .session input[type="text"], .session input[type="number"] {
    background: ${s.bg};
    color: ${s.text};
    border: 1px solid ${s.panelBorder};
    border-radius: 6px;
    padding: 6px 8px;
    width: 100%;
    box-sizing: border-box;
    font-size: 13px;
  }
  .session input:focus { outline: none; border-color: ${s.accent}; }
  .session-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rec-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${s.textDim};
  }
  .rec-dot.live { background: ${s.alarm}; box-shadow: 0 0 8px ${s.alarm}; }

  .chart-host {
    width: 100%;
    min-height: 240px;
    background: ${s.panel};
    border: 1px solid ${s.panelBorder};
    border-radius: 10px;
    overflow: hidden;
  }
  .chart-host canvas { display: block; width: 100%; height: 240px; }

  .alarm-banner {
    background: #4b1d1d;
    border: 1px solid ${s.alarm};
    color: ${s.text};
    padding: 8px 12px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .alarm-banner.dim {
    background: ${s.panel};
    border-color: ${s.panelBorder};
    color: ${s.textDim};
  }
  .small { font-size: 11px; color: ${s.textDim}; }

  @media (max-width: 600px) {
    .row { grid-template-columns: 1fr; }
  }
`;var I="apexcharts-card",k=class{constructor(e){this._host=e,this._mode=null,this._apexEl=null,this._canvas=null,this._series={},this._historyLoaded=!1,this._lastConfig=null}async update(e,t){let o=t.join("|");if(o!==this._lastConfig&&(this._lastConfig=o,this._historyLoaded=!1,this._series={},this._host.innerHTML="",this._mode=customElements.get(I)?"apex":"canvas",this._mode==="apex"?this._mountApex(t):this._mountCanvas()),this._mode==="apex"){this._apexEl.hass=e;return}this._historyLoaded||(this._historyLoaded=!0,await this._loadHistory(e,t)),this._appendLive(e,t),this._draw(t)}_mountApex(e){let t=e.map((n,l)=>({entity:n,name:this._labelFor(n),yaxis_id:"temp",color:[s.chartChamber,s.chartProbe1,s.chartProbe2][l]||"#fff",type:l===0?"area":"line",opacity:l===0?.25:1,stroke_width:2})),o=document.createElement(I);o.setConfig({header:{show:!1},graph_span:`${$}h`,update_interval:`${L/1e3}s`,yaxis:[{id:"temp",decimals:0,apex_config:{title:{text:"\xB0F"},forceNiceScale:!0}}],series:t}),this._apexEl=o,this._host.appendChild(o)}_mountCanvas(){this._canvas=document.createElement("canvas"),this._host.appendChild(this._canvas)}async _loadHistory(e,t){let l=`history/period/${new Date(Date.now()-$*3600*1e3).toISOString()}?filter_entity_id=${t.join(",")}&minimal_response`;try{let r=await e.callApi("GET",l);for(let c=0;c<t.length;c++){let b=t[c],_=(r?.[c]??[]).map(a=>[Date.parse(a.last_changed),parseFloat(a.state)]).filter(([a,p])=>Number.isFinite(a)&&Number.isFinite(p));this._series[b]=_}}catch(r){console.warn("[ha-prime-polaris-card] history fetch failed:",r)}}_appendLive(e,t){let o=Date.now(),n=o-$*3600*1e3;for(let l of t){let r=this._series[l]??(this._series[l]=[]),c=parseFloat(e.states[l]?.state);if(Number.isFinite(c)){let b=r.length?r[r.length-1][0]:0;o-b>=5e3&&r.push([o,c])}for(;r.length&&r[0][0]<n;)r.shift()}}_draw(e){let t=this._canvas;if(!t)return;let o=window.devicePixelRatio||1,n=t.clientWidth||600,l=240;t.width=n*o,t.height=l*o;let r=t.getContext("2d");r.scale(o,o),r.clearRect(0,0,n,l);let c=e.flatMap(d=>this._series[d]??[]);if(c.length<2){r.fillStyle=s.textDim,r.font="12px system-ui",r.fillText("collecting data\u2026",16,24);return}let b=c.map(d=>d[0]),_=c.map(d=>d[1]),a=Math.min(...b),p=Math.max(...b),m=Math.min(..._)-5,M=Math.max(..._)+5,f={l:36,r:12,t:12,b:22},w=d=>f.l+(d-a)/Math.max(1,p-a)*(n-f.l-f.r),x=d=>f.t+(1-(d-m)/Math.max(1,M-m))*(l-f.t-f.b);r.strokeStyle=s.panelBorder,r.fillStyle=s.textDim,r.font="11px system-ui",r.lineWidth=1;let A=4;for(let d=0;d<=A;d++){let g=m+d/A*(M-m),h=x(g);r.beginPath(),r.moveTo(f.l,h),r.lineTo(n-f.r,h),r.stroke(),r.fillText(g.toFixed(0),6,h+4)}let D=[s.chartChamber,s.chartProbe1,s.chartProbe2];e.forEach((d,g)=>{let h=this._series[d]??[];if(!(h.length<2)){if(r.strokeStyle=D[g]||"#fff",r.lineWidth=g===0?1.5:2,g===0){r.fillStyle=D[0]+"40",r.beginPath(),r.moveTo(w(h[0][0]),x(m));for(let[y,S]of h)r.lineTo(w(y),x(S));r.lineTo(w(h[h.length-1][0]),x(m)),r.closePath(),r.fill()}r.beginPath(),r.moveTo(w(h[0][0]),x(h[0][1]));for(let[y,S]of h)r.lineTo(w(y),x(S));r.stroke()}})}_labelFor(e){return e.includes("chamber")?"Chamber":e.includes("probe_1")?"Probe 1":e.includes("probe_2")?"Probe 2":e}};function u(i){return String(i??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function N(i){if(!i)return"";let{chamber:e,setpoint:t,chamberDelta:o}=i,n="steady";o!=null&&(o>C&&(n="over"),o<-C&&(n="under"));let l=o!=null?`\u0394 ${o>0?"+":""}${o.toFixed(0)}\xB0F`:"";return`
    <div class="panel tall">
      <div class="panel-label">Chamber</div>
      <div class="big-temp ${n}">
        ${e!=null?e.toFixed(0):"\u2014"}<span class="unit">\xB0F</span>
      </div>
      <div class="delta">setpoint ${t??"\u2014"}\xB0F \xB7 ${l}</div>
    </div>
  `}function B(i){if(!i)return"";let e=[];return i.runningStatus&&e.push({cls:"active",txt:i.runningStatus}),e.push({cls:i.activeMode==="smoke"?"smoke":"active",txt:`mode: ${i.activeMode}`}),i.smokeOn&&i.smokeLevel!=null&&e.push({cls:"smoke",txt:`smoke ${i.smokeLevel.toFixed(0)}`}),i.alarmOn&&e.push({cls:"alarm",txt:"alarm armed"}),i.winterOn&&e.push({cls:"active",txt:"winter"}),i.pushOn&&e.push({cls:"active",txt:"push on"}),`
    <div class="chip-row">
      ${e.map(t=>`<span class="chip ${t.cls}">${u(t.txt)}</span>`).join("")}
    </div>
  `}function Y(i){if(!i)return"";let e=i.cookSession,t=e?i.protein?`${u(i.protein)}${i.weight_lb?" \xB7 "+u(i.weight_lb)+" lb":""}`:"recording":"no active cook",o=i.notes?u(i.notes):e?"":"flip the switch when you start a real cook";return`
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
  `}function z(i,e){if(e.temp==null)return`
      <div class="panel">
        <div class="probe">
          <div class="probe-label">Probe ${i}</div>
          <div class="small">not connected</div>
        </div>
      </div>
    `;let t="fitting\u2026",o="fitting";if(e.in_stall)t=`\u{1F6D1} in stall \xB7 \u03C3 ${e.stdev?.toFixed(2)??"\u2014"}\xB0F`,o="stall";else if(e.minutes!=null){let n=Math.max(0,e.minutes);t=n>=60?`ETA ${(n/60).toFixed(1)} h`:`ETA ${n.toFixed(0)} min`,o=""}return`
    <div class="panel">
      <div class="probe">
        <div class="probe-label">Probe ${i}</div>
        <div>
          <div class="probe-temp">${e.temp.toFixed(0)}\xB0F</div>
          <div class="probe-target">\u2192 ${e.target??"\u2014"}\xB0F</div>
          <div class="probe-eta ${o}">${u(t)}</div>
          ${e.source?`<div class="small">prior: ${u(e.source)}</div>`:""}
        </div>
      </div>
    </div>
  `}function q(i){return i?`
    <div class="row">
      ${z(1,i.probe1)}
      ${z(2,i.probe2)}
    </div>
  `:""}function V(i){if(!i)return"";let e=i.setpoint??225,t=i.smokeLevel??0;return`
    <div class="panel">
      <div class="panel-label">Controls</div>
      <div class="stepper-row">
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
          value="${e}">
        <span class="stepper-unit">\xB0F</span>
        <button class="action stepper-btn" data-action="temp-up">+</button>
      </div>
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
        <button class="action ${i.smokeOn?"on":""}" data-action="toggle-smoke">Smoke</button>
        <button class="action ${i.winterOn?"on":""}" data-action="toggle-winter">Winter</button>
        <button class="action alarm ${i.alarmOn?"on":""}" data-action="toggle-alarm">Alarm</button>
        <button class="action ${i.pushOn?"on":""}" data-action="toggle-push">Push</button>
        <button class="action" data-action="power-off">Power off</button>
      </div>
    </div>
  `}function W(i){return i?`
    <div class="panel">
      <div class="panel-label">Session inputs</div>
      <div class="session">
        <label>Protein</label>
        <input type="text" data-input="protein"   value="${u(i.protein)}"   placeholder="brisket / pork / ribs">
        <label>Weight (lb)</label>
        <input type="text" data-input="weight_lb" value="${u(i.weight_lb)}" placeholder="16">
        <label>Notes</label>
        <input type="text" data-input="notes"     value="${u(i.notes)}"     placeholder="oak, low and slow">
        <label>Ambient</label>
        <input type="text" data-input="ambient"   value="${u(i.ambient)}"   placeholder="weather.home or 32">
        <label>Wind</label>
        <input type="text" data-input="wind"      value="${u(i.wind)}"      placeholder="entity_id or m/s">
      </div>
    </div>
  `:""}function j(i){if(!i)return"";let e=i.lastAlarm;return e?`
    <div class="alarm-banner">
      <span><strong>${u(e.title)}</strong> \xB7 ${u(e.body)}</span>
      <span class="small">${u(e.source??"")}</span>
    </div>
  `:'<div class="alarm-banner dim">no alarms</div>'}var R=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._state=null,this._chart=null,this._renderQueued=!1}setConfig(e){this._config={entity_prefix:e?.entity_prefix??E,title:e?.title??null,ambient_entity:e?.ambient_entity??null,...e},this._lastSig=null}set hass(e){this._hass=e,this._config&&(this._state=H(e,this._config.entity_prefix),this._scheduleRender())}getCardSize(){return 8}static getConfigElement(){return null}static getStubConfig(){return{entity_prefix:E}}_scheduleRender(){this._renderQueued||(this._renderQueued=!0,requestAnimationFrame(()=>{this._renderQueued=!1,this._render()}))}_render(){let e=this._state;if(this.shadowRoot.firstElementChild||(this.shadowRoot.innerHTML=`
        <style>${O}</style>
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
      `,this._wireEvents()),this._fill("alarm",j(e)),this._fill("chips",B(e)),this._fill("chamber",N(e)),this._fill("cookHeader",Y(e)),this._fill("probes",q(e)),this._fillPreserveFocus("controls",V(e)),this._fillPreserveFocus("session",W(e)),this._hass&&e){if(!this._chart){let o=this.shadowRoot.querySelector('[data-slot="chart"]');this._chart=new k(o)}let t=[e.entityIds.chamber_temp,e.entityIds.probe_1_temp,e.entityIds.probe_2_temp];this._chart.update(this._hass,t)}}_fill(e,t){let o=this.shadowRoot.querySelector(`[data-slot="${e}"]`);o&&(o.innerHTML=t)}_fillPreserveFocus(e,t){let o=this.shadowRoot.querySelector(`[data-slot="${e}"]`);if(!o)return;let n=this.shadowRoot.activeElement;if(!(n&&n.dataset?.input&&o.contains(n))){o.innerHTML=t;return}let r=n.dataset.input,c=n.value,b=n.selectionStart,_=n.selectionEnd;o.innerHTML=t;let a=o.querySelector(`[data-input="${r}"]`);if(a){a.value=c,a.focus();try{a.setSelectionRange(b,_)}catch{}}}_wireEvents(){this.shadowRoot.addEventListener("click",e=>{let t=e.target.closest("[data-action]");t&&this._dispatchAction(t.dataset.action)}),this.shadowRoot.addEventListener("change",e=>{let t=e.target.closest("[data-input]");if(!t)return;let o=F(this._hass,this._state),n=t.dataset.input;if(n==="setpoint"){let r=parseInt(t.value,10);Number.isFinite(r)&&o.setSetpoint(Math.max(180,Math.min(500,r)));return}if(n==="smoke_level"){let r=parseInt(t.value,10);Number.isFinite(r)&&o.setSmokeLevel(Math.max(0,Math.min(10,r)));return}let l={notes:"notes",protein:"protein",weight_lb:"weight_lb",ambient:"ambient_override",wind:"wind_override"};l[n]&&o.setText(l[n],t.value)}),this.shadowRoot.addEventListener("input",e=>{let t=e.target.closest('[data-input="smoke_level"]');if(!t)return;let o=this.shadowRoot.querySelector('[data-bind="smoke-level-readout"]');o&&(o.textContent=t.value)})}_dispatchAction(e){if(!this._hass||!this._state)return;let t=F(this._hass,this._state),o=this._state.setpoint??225;switch(e){case"toggle-session":t.toggle("cook_session");break;case"toggle-smoke":t.toggle("smoke_mode");break;case"toggle-winter":t.toggle("winter_mode");break;case"toggle-alarm":t.toggle("alarm");break;case"toggle-push":t.toggle("push_alerts");break;case"temp-up":t.setSetpoint(Math.min(500,o+1));break;case"temp-down":t.setSetpoint(Math.max(180,o-1));break;case"power-off":t.powerOff();break}}};customElements.get(v)||customElements.define(v,R);window.customCards=window.customCards||[];window.customCards.some(i=>i.type===v)||window.customCards.push({type:v,name:"Prime Polaris Grill",description:"Live cook dashboard for the Prime Polaris pellet grill integration.",preview:!0});console.info(`%c ${v} %c v${P} `,"color:#fb923c;background:#0d1117;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:600","color:#0d1117;background:#fb923c;padding:2px 6px;border-radius:0 3px 3px 0");
