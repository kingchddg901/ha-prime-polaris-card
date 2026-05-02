var v="ha-prime-polaris-card",H="0.1.0",E="grill",T={climate:"climate.{prefix}",chamber_temp:"sensor.{prefix}_chamber_temperature",running_status:"sensor.{prefix}_running_status",active_mode:"sensor.{prefix}_active_mode",active_smoke_level:"sensor.{prefix}_active_smoke_level",last_alarm:"sensor.{prefix}_last_alarm",probe_1_temp:"sensor.{prefix}_probe_1_temperature",probe_2_temp:"sensor.{prefix}_probe_2_temperature",probe_1_eta:"sensor.{prefix}_probe_1_eta",probe_2_eta:"sensor.{prefix}_probe_2_eta",setpoint:"number.{prefix}_temperature",smoke_level:"number.{prefix}_smoke_level",probe_1_target:"number.{prefix}_probe_1_target",probe_2_target:"number.{prefix}_probe_2_target",push_dedupe:"number.{prefix}_push_alert_dedupe",smoke_mode:"switch.{prefix}_smoke_mode",winter_mode:"switch.{prefix}_winter_mode",alarm:"switch.{prefix}_temperature_alarm",cook_session:"switch.{prefix}_cook_session",push_alerts:"switch.{prefix}_push_alerts",notes:"text.{prefix}_cook_notes",protein:"text.{prefix}_cook_protein",weight_lb:"text.{prefix}_cook_weight_lb",ambient_override:"text.{prefix}_cook_ambient_override",wind_override:"text.{prefix}_cook_wind_override"},$=4,L=3e4;function O(i,e){if(!i)return null;let t=l=>T[l].replace("{prefix}",e),o=l=>i.states[t(l)]??null,a=l=>{let p=o(l);if(!p)return null;let m=parseFloat(p.state);return Number.isFinite(m)?m:null},n=l=>o(l)?.state==="on",s=l=>{let p=o(l);return p?p.state==="unknown"||p.state==="unavailable"?"":p.state:""},c=l=>{let p=o(l===1?"probe_1_eta":"probe_2_eta");if(!p)return{minutes:null,in_stall:!1,stdev:null,source:null};let m=parseFloat(p.state);return{minutes:Number.isFinite(m)?m:null,in_stall:!!p.attributes?.in_stall,stdev:p.attributes?.stall_stdev??null,source:p.attributes?.prior_source??null,samples:p.attributes?.samples??0}},_=o("climate"),b=a("setpoint")??_?.attributes?.temperature??null;return{prefix:e,entityIds:Object.fromEntries(Object.keys(T).map(l=>[l,t(l)])),chamber:a("chamber_temp")??_?.attributes?.current_temperature??null,setpoint:b,chamberDelta:a("chamber_temp")!=null&&b!=null?a("chamber_temp")-b:null,runningStatus:s("running_status")||null,activeMode:s("active_mode")||"off",smokeLevel:a("active_smoke_level"),smokeOn:n("smoke_mode"),winterOn:n("winter_mode"),alarmOn:n("alarm"),probe1:{temp:a("probe_1_temp"),target:a("probe_1_target"),...c(1)},probe2:{temp:a("probe_2_temp"),target:a("probe_2_target"),...c(2)},cookSession:n("cook_session"),notes:s("notes"),protein:s("protein"),weight_lb:s("weight_lb"),ambient:s("ambient_override"),wind:s("wind_override"),pushOn:n("push_alerts"),pushDedupe:a("push_dedupe"),lastAlarm:(()=>{let l=o("last_alarm");return!l||l.state==="unknown"||l.state==="unavailable"||!l.state?null:{title:l.state,body:l.attributes?.body??"",captured_at:l.attributes?.captured_at??null,source:l.attributes?.source??null}})()}}function C(i,e){if(!i||!e)return{};let t=(o,a,n={})=>i.callService(o,a,n);return{setSetpoint:o=>t("number","set_value",{entity_id:e.entityIds.setpoint,value:o}),setSmokeLevel:o=>t("number","set_value",{entity_id:e.entityIds.smoke_level,value:o}),setProbeTarget:(o,a)=>t("number","set_value",{entity_id:e.entityIds[`probe_${o}_target`],value:a}),toggle:o=>{let a=e.entityIds[o],n=i.states[a]?.state==="on";return t("switch",n?"turn_off":"turn_on",{entity_id:a})},setText:(o,a)=>t("text","set_value",{entity_id:e.entityIds[o],value:a??""}),powerOff:()=>t("climate","set_hvac_mode",{entity_id:e.entityIds.climate,hvac_mode:"off"})}}var r={bg:"#0d1117",panel:"#161b22",panelBorder:"#30363d",text:"#e6edf3",textDim:"#8b949e",accent:"#fb923c",accentDim:"#9a3412",cool:"#3b82f6",hot:"#ef4444",steady:"#22c55e",smoke:"#a78bfa",alarm:"#f87171",stall:"#f59e0b",probe1:"#ef4444",probe2:"#06b6d4",chartChamber:"#fb923c",chartProbe1:"#ef4444",chartProbe2:"#06b6d4"},F=5;var I=`
  :host {
    display: block;
    color: ${r.text};
    font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
  }
  .card {
    background: ${r.bg};
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
    background: ${r.panel};
    border: 1px solid ${r.panelBorder};
    border-radius: 10px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .panel.tall { padding: 16px 14px; }
  .panel-label {
    font-size: 11px;
    color: ${r.textDim};
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
    color: ${r.textDim};
    font-weight: 400;
    margin-left: 4px;
  }
  .big-temp.over   { color: ${r.hot}; }
  .big-temp.under  { color: ${r.cool}; }
  .big-temp.steady { color: ${r.steady}; }
  .delta {
    font-size: 13px;
    color: ${r.textDim};
    margin-top: 2px;
  }
  .chip-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .chip {
    background: ${r.bg};
    border: 1px solid ${r.panelBorder};
    border-radius: 999px;
    padding: 3px 10px;
    font-size: 11px;
    color: ${r.textDim};
  }
  .chip.active   { border-color: ${r.accent}; color: ${r.accent}; }
  .chip.smoke    { border-color: ${r.smoke};  color: ${r.smoke};  }
  .chip.alarm    { border-color: ${r.alarm};  color: ${r.alarm};  }
  .chip.stall    { border-color: ${r.stall};  color: ${r.stall};  }

  .probe {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    align-items: center;
  }
  .probe-label { font-size: 11px; color: ${r.textDim}; text-transform: uppercase; }
  .probe-temp {
    font-size: 28px;
    font-weight: 600;
    line-height: 1;
  }
  .probe-target {
    font-size: 13px;
    color: ${r.textDim};
  }
  .probe-eta {
    font-size: 14px;
    color: ${r.text};
    margin-top: 2px;
  }
  .probe-eta.fitting { color: ${r.textDim}; font-style: italic; }
  .probe-eta.stall   { color: ${r.stall}; font-weight: 500; }

  .controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
  }
  button.action {
    background: ${r.panel};
    color: ${r.text};
    border: 1px solid ${r.panelBorder};
    border-radius: 8px;
    padding: 8px 10px;
    cursor: pointer;
    font-size: 13px;
    transition: border-color 0.15s, background 0.15s;
  }
  button.action:hover { border-color: ${r.accent}; }
  button.action.on    { border-color: ${r.accent}; background: ${r.accentDim}; color: ${r.text}; }
  button.action.alarm.on { border-color: ${r.alarm}; background: #4b1d1d; }

  .session {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    align-items: center;
  }
  .session input[type="text"], .session input[type="number"] {
    background: ${r.bg};
    color: ${r.text};
    border: 1px solid ${r.panelBorder};
    border-radius: 6px;
    padding: 6px 8px;
    width: 100%;
    box-sizing: border-box;
    font-size: 13px;
  }
  .session input:focus { outline: none; border-color: ${r.accent}; }
  .session-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rec-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${r.textDim};
  }
  .rec-dot.live { background: ${r.alarm}; box-shadow: 0 0 8px ${r.alarm}; }

  .chart-host {
    width: 100%;
    min-height: 240px;
    background: ${r.panel};
    border: 1px solid ${r.panelBorder};
    border-radius: 10px;
    overflow: hidden;
  }
  .chart-host canvas { display: block; width: 100%; height: 240px; }

  .alarm-banner {
    background: #4b1d1d;
    border: 1px solid ${r.alarm};
    color: ${r.text};
    padding: 8px 12px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .alarm-banner.dim {
    background: ${r.panel};
    border-color: ${r.panelBorder};
    color: ${r.textDim};
  }
  .small { font-size: 11px; color: ${r.textDim}; }

  @media (max-width: 600px) {
    .row { grid-template-columns: 1fr; }
  }
`;var N="apexcharts-card",y=class{constructor(e){this._host=e,this._mode=null,this._apexEl=null,this._canvas=null,this._series={},this._historyLoaded=!1,this._lastConfig=null}async update(e,t){let o=t.join("|");if(o!==this._lastConfig&&(this._lastConfig=o,this._historyLoaded=!1,this._series={},this._host.innerHTML="",this._mode=customElements.get(N)?"apex":"canvas",this._mode==="apex"?this._mountApex(t):this._mountCanvas()),this._mode==="apex"){this._apexEl.hass=e;return}this._historyLoaded||(this._historyLoaded=!0,await this._loadHistory(e,t)),this._appendLive(e,t),this._draw(t)}_mountApex(e){let t=e.map((a,n)=>({entity:a,name:this._labelFor(a),yaxis_id:"temp",color:[r.chartChamber,r.chartProbe1,r.chartProbe2][n]||"#fff",type:n===0?"area":"line",opacity:n===0?.25:1,stroke_width:2})),o=document.createElement(N);o.setConfig({header:{show:!1},graph_span:`${$}h`,update_interval:`${L/1e3}s`,yaxis:[{id:"temp",decimals:0,apex_config:{title:{text:"\xB0F"},forceNiceScale:!0}}],series:t}),this._apexEl=o,this._host.appendChild(o)}_mountCanvas(){this._canvas=document.createElement("canvas"),this._host.appendChild(this._canvas)}async _loadHistory(e,t){let n=`history/period/${new Date(Date.now()-$*3600*1e3).toISOString()}?filter_entity_id=${t.join(",")}&minimal_response`;try{let s=await e.callApi("GET",n);for(let c=0;c<t.length;c++){let _=t[c],b=(s?.[c]??[]).map(l=>[Date.parse(l.last_changed),parseFloat(l.state)]).filter(([l,p])=>Number.isFinite(l)&&Number.isFinite(p));this._series[_]=b}}catch(s){console.warn("[ha-prime-polaris-card] history fetch failed:",s)}}_appendLive(e,t){let o=Date.now(),a=o-$*3600*1e3;for(let n of t){let s=this._series[n]??(this._series[n]=[]),c=parseFloat(e.states[n]?.state);if(Number.isFinite(c)){let _=s.length?s[s.length-1][0]:0;o-_>=5e3&&s.push([o,c])}for(;s.length&&s[0][0]<a;)s.shift()}}_draw(e){let t=this._canvas;if(!t)return;let o=window.devicePixelRatio||1,a=t.clientWidth||600,n=240;t.width=a*o,t.height=n*o;let s=t.getContext("2d");s.scale(o,o),s.clearRect(0,0,a,n);let c=e.flatMap(d=>this._series[d]??[]);if(c.length<2){s.fillStyle=r.textDim,s.font="12px system-ui",s.fillText("collecting data\u2026",16,24);return}let _=c.map(d=>d[0]),b=c.map(d=>d[1]),l=Math.min(..._),p=Math.max(..._),m=Math.min(...b)-5,M=Math.max(...b)+5,f={l:36,r:12,t:12,b:22},w=d=>f.l+(d-l)/Math.max(1,p-l)*(a-f.l-f.r),x=d=>f.t+(1-(d-m)/Math.max(1,M-m))*(n-f.t-f.b);s.strokeStyle=r.panelBorder,s.fillStyle=r.textDim,s.font="11px system-ui",s.lineWidth=1;let D=4;for(let d=0;d<=D;d++){let g=m+d/D*(M-m),h=x(g);s.beginPath(),s.moveTo(f.l,h),s.lineTo(a-f.r,h),s.stroke(),s.fillText(g.toFixed(0),6,h+4)}let P=[r.chartChamber,r.chartProbe1,r.chartProbe2];e.forEach((d,g)=>{let h=this._series[d]??[];if(!(h.length<2)){if(s.strokeStyle=P[g]||"#fff",s.lineWidth=g===0?1.5:2,g===0){s.fillStyle=P[0]+"40",s.beginPath(),s.moveTo(w(h[0][0]),x(m));for(let[k,S]of h)s.lineTo(w(k),x(S));s.lineTo(w(h[h.length-1][0]),x(m)),s.closePath(),s.fill()}s.beginPath(),s.moveTo(w(h[0][0]),x(h[0][1]));for(let[k,S]of h)s.lineTo(w(k),x(S));s.stroke()}})}_labelFor(e){return e.includes("chamber")?"Chamber":e.includes("probe_1")?"Probe 1":e.includes("probe_2")?"Probe 2":e}};function u(i){return String(i??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function B(i){if(!i)return"";let{chamber:e,setpoint:t,chamberDelta:o}=i,a="steady";o!=null&&(o>F&&(a="over"),o<-F&&(a="under"));let n=o!=null?`\u0394 ${o>0?"+":""}${o.toFixed(0)}\xB0F`:"";return`
    <div class="panel tall">
      <div class="panel-label">Chamber</div>
      <div class="big-temp ${a}">
        ${e!=null?e.toFixed(0):"\u2014"}<span class="unit">\xB0F</span>
      </div>
      <div class="delta">setpoint ${t??"\u2014"}\xB0F \xB7 ${n}</div>
    </div>
  `}function Y(i){if(!i)return"";let e=[];return i.runningStatus&&e.push({cls:"active",txt:i.runningStatus}),e.push({cls:i.activeMode==="smoke"?"smoke":"active",txt:`mode: ${i.activeMode}`}),i.smokeOn&&i.smokeLevel!=null&&e.push({cls:"smoke",txt:`smoke ${i.smokeLevel.toFixed(0)}`}),i.alarmOn&&e.push({cls:"alarm",txt:"alarm armed"}),i.winterOn&&e.push({cls:"active",txt:"winter"}),i.pushOn&&e.push({cls:"active",txt:"push on"}),`
    <div class="chip-row">
      ${e.map(t=>`<span class="chip ${t.cls}">${u(t.txt)}</span>`).join("")}
    </div>
  `}function q(i){if(!i)return"";let e=i.cookSession,t=e?i.protein?`${u(i.protein)}${i.weight_lb?" \xB7 "+u(i.weight_lb)+" lb":""}`:"recording":"no active cook",o=i.notes?u(i.notes):e?"":"flip the switch when you start a real cook";return`
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
    `;let t="fitting\u2026",o="fitting";if(e.in_stall)t=`\u{1F6D1} in stall \xB7 \u03C3 ${e.stdev?.toFixed(2)??"\u2014"}\xB0F`,o="stall";else if(e.minutes!=null){let a=Math.max(0,e.minutes);t=a>=60?`ETA ${(a/60).toFixed(1)} h`:`ETA ${a.toFixed(0)} min`,o=""}return`
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
  `}function W(i){return i?`
    <div class="row">
      ${z(1,i.probe1)}
      ${z(2,i.probe2)}
    </div>
  `:""}function j(i){return i?`
    <div class="panel">
      <div class="panel-label">Controls</div>
      <div class="controls">
        <button class="action" data-action="temp-down">\u2013 5\xB0F</button>
        <button class="action" data-action="temp-up">+ 5\xB0F</button>
        <button class="action ${i.smokeOn?"on":""}" data-action="toggle-smoke">Smoke</button>
        <button class="action ${i.winterOn?"on":""}" data-action="toggle-winter">Winter</button>
        <button class="action alarm ${i.alarmOn?"on":""}" data-action="toggle-alarm">Alarm</button>
        <button class="action ${i.pushOn?"on":""}" data-action="toggle-push">Push</button>
        <button class="action" data-action="power-off">Power off</button>
      </div>
    </div>
  `:""}function A(i){return i?`
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
  `:""}function U(i){if(!i)return"";let e=i.lastAlarm;return e?`
    <div class="alarm-banner">
      <span><strong>${u(e.title)}</strong> \xB7 ${u(e.body)}</span>
      <span class="small">${u(e.source??"")}</span>
    </div>
  `:'<div class="alarm-banner dim">no alarms</div>'}var R=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._hass=null,this._config=null,this._state=null,this._chart=null,this._renderQueued=!1}setConfig(e){this._config={entity_prefix:e?.entity_prefix??E,title:e?.title??null,ambient_entity:e?.ambient_entity??null,...e},this._lastSig=null}set hass(e){this._hass=e,this._config&&(this._state=O(e,this._config.entity_prefix),this._scheduleRender())}getCardSize(){return 8}static getConfigElement(){return null}static getStubConfig(){return{entity_prefix:E}}_scheduleRender(){this._renderQueued||(this._renderQueued=!0,requestAnimationFrame(()=>{this._renderQueued=!1,this._render()}))}_render(){let e=this._state;if(this.shadowRoot.firstElementChild||(this.shadowRoot.innerHTML=`
        <style>${I}</style>
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
      `,this._wireEvents()),this._fill("alarm",U(e)),this._fill("chips",Y(e)),this._fill("chamber",B(e)),this._fill("cookHeader",q(e)),this._fill("probes",W(e)),this._fill("controls",j(e)),this._fillSessionPreserveFocus(e),this._hass&&e){if(!this._chart){let o=this.shadowRoot.querySelector('[data-slot="chart"]');this._chart=new y(o)}let t=[e.entityIds.chamber_temp,e.entityIds.probe_1_temp,e.entityIds.probe_2_temp];this._chart.update(this._hass,t)}}_fill(e,t){let o=this.shadowRoot.querySelector(`[data-slot="${e}"]`);o&&(o.innerHTML=t)}_fillSessionPreserveFocus(e){let t=this.shadowRoot.querySelector('[data-slot="session"]');if(!t)return;let o=this.shadowRoot.activeElement,a=o&&o.dataset?.input;if(!a){t.innerHTML=A(e);return}let n=document.createElement("div");n.innerHTML=A(e),n.querySelectorAll("[data-input]").forEach(s=>{if(s.dataset.input===a)return;let c=t.querySelector(`[data-input="${s.dataset.input}"]`);c&&c.value!==s.value&&(c.value=s.value)})}_wireEvents(){this.shadowRoot.addEventListener("click",e=>{let t=e.target.closest("[data-action]");t&&this._dispatchAction(t.dataset.action)}),this.shadowRoot.addEventListener("change",e=>{let t=e.target.closest("[data-input]");if(!t)return;let o=C(this._hass,this._state),n={notes:"notes",protein:"protein",weight_lb:"weight_lb",ambient:"ambient_override",wind:"wind_override"}[t.dataset.input];n&&o.setText(n,t.value)})}_dispatchAction(e){if(!this._hass||!this._state)return;let t=C(this._hass,this._state),o=this._state.setpoint??225;switch(e){case"toggle-session":t.toggle("cook_session");break;case"toggle-smoke":t.toggle("smoke_mode");break;case"toggle-winter":t.toggle("winter_mode");break;case"toggle-alarm":t.toggle("alarm");break;case"toggle-push":t.toggle("push_alerts");break;case"temp-up":t.setSetpoint(Math.min(500,o+5));break;case"temp-down":t.setSetpoint(Math.max(180,o-5));break;case"power-off":t.powerOff();break}}};customElements.get(v)||customElements.define(v,R);window.customCards=window.customCards||[];window.customCards.some(i=>i.type===v)||window.customCards.push({type:v,name:"Prime Polaris Grill",description:"Live cook dashboard for the Prime Polaris pellet grill integration.",preview:!0});console.info(`%c ${v} %c v${H} `,"color:#fb923c;background:#0d1117;padding:2px 6px;border-radius:3px 0 0 3px;font-weight:600","color:#0d1117;background:#fb923c;padding:2px 6px;border-radius:0 3px 3px 0");
