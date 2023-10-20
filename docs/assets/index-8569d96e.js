var P=Object.defineProperty;var J=(a,e,s)=>e in a?P(a,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):a[e]=s;var u=(a,e,s)=>(J(a,typeof e!="symbol"?e+"":e,s),s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function s(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(i){if(i.ep)return;i.ep=!0;const n=s(i);fetch(i.href,n)}})();class R{constructor(){const e=document.querySelector("app-map");this.viewer=new Cesium.Viewer(e,{baseLayerPicker:!1,geocoder:!1,timeline:!1,animation:!1,homeButton:!1,navigationInstructionsInitiallyVisible:!0,navigationHelpButton:!1,sceneModePicker:!1,fullscreenButton:!1,terrain:Cesium.Terrain.fromWorldTerrain()}),this.toColor=!1,this.viewer.screenSpaceEventHandler.setInputAction(this.onClick.bind(this),Cesium.ScreenSpaceEventType.LEFT_CLICK)}static getImageryProvider(){return new Cesium.WebMapTileServiceImageryProvider({url:"https://c.basemaps.cartocdn.com/rastertiles/voyager/{TileMatrix}/{TileCol}/{TileRow}.png",layer:"carto-light",style:"default",format:"image/jpeg",maximumLevel:19,tileMatrixSetID:"default",credit:new Cesium.Credit('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>')})}async onClick(e){const s=this.viewer.camera.getPickRay(e),t=this.viewer.imageryLayers.pickImageryLayerFeatures(s,this.viewer.scene);if(Cesium.defined(t))try{const i=await Promise.resolve(t);return console.log(`Number of features: ${i.length}`),i.length>0?i[0]:(console.log(null),null)}catch(i){return console.error("Errore nella raccolta delle features:",i),null}else return console.log("No features picked."),null}addLayer(e,s,t){const i=new Cesium.WebMapServiceImageryProvider({url:e,layers:s,parameters:t});this.viewer.imageryLayers.addImageryProvider(i)}removeLayer(e){const s=this.viewer.imageryLayers,t=s.length;for(let i=0;i<t;i++){const n=s.get(i);if(n._imageryProvider._layers===e){s.remove(n);return}}}removeAllLayers(){this.viewer.imageryLayers.removeAll()}getActiveLayers(){return this.viewer.imageryLayers._layers}setCamera(){const e=Cesium.Cartesian3.fromDegrees(8.909041078781357,44.410209942448475,4e3);this.viewer.camera.flyTo({destination:e,orientation:{heading:Cesium.Math.toRadians(0),pitch:Cesium.Math.toRadians(-90),roll:0}})}async addBuilding(){const e=await Cesium.createOsmBuildingsAsync();this.viewer.scene.primitives.add(e)}}const E=(a,e)=>{a.categories.forEach(s=>{const t=document.createElement("app-accordion");e.append(t),t.setAttribute("title",s.name),t.classList.add("category-accordion"),s.groups.forEach((i,n,r)=>{const o=document.createElement("app-accordion");n===r.length-1&&o.classList.add("last-accordion"),t.append(o),o.setAttribute("title",i.name),o.classList.add("layer-accordion");const p=document.createElement("app-checkbox-list");p.setAttribute("input",JSON.stringify(i.layers)),o.append(p)})})},B=(a,e)=>{if(a!=null){let s="";a.data.id.includes(".")&&(s=a.data.id.split(".")[0]);const t=k(e,s);t.name;const i=t.relevant_properties;return _(a.properties,i)}};function k(a,e){for(const s in a){const t=a[s];if(Array.isArray(t)||typeof t=="object"){const i=k(t,e);if(i)return i}else if(typeof t=="string"&&t.includes(e))return a}return null}function _(a,e,s){const t={};if(e){for(const i of e)i.property_name&&a[i.property_name]&&(t[i.display_name]=a[i.property_name]);return t}return t}const D=(a,e)=>{a.categories.forEach(s=>{s.groups.forEach(t=>{t.layers=t.layers.filter(i=>i.tags?i.tags.some(n=>n.includes(e)):!1),t.layers.length===0&&(s.groups=s.groups.filter(i=>i!==t))}),s.groups.length===0&&(a.categories=a.categories.filter(t=>t!==s))})};async function z(a){const e=await fetch(a).then(t=>t.json()),s=e.categories;for(const t of s){const i=[];for(let r=0;r<t.groups.length;r++){let o=t.groups[r];const p=await fetch(o).then(d=>{if(d)return d.json()}).catch(d=>console.log(d));i.push(p)}const n=await Promise.all(i).then(r=>r);t.groups.splice(0,t.groups.length),n.forEach(r=>{t.groups.push(r)})}return e}const L=(a,e,s)=>{const t="https://mappe.comune.genova.it/geoserver/wms",i={format:"image/png",transparent:!0};a.forEach(n=>{n.addEventListener("checkboxListChanged",r=>{r.detail.input.forEach(c=>{const b=e.findIndex(l=>l.layer===c.layer);b!==-1&&e.splice(b,1)}),JSON.parse(r.detail.newValue).forEach(c=>{e.push(c)}),[...s.viewer.imageryLayers._layers].splice(1).forEach(c=>{s.removeLayer(c._imageryProvider._layers)});for(const c of e)c.hasOwnProperty("opacity")&&(i.opacity=c.opacity),s.addLayer(t,c.layer,i);console.log("Active layers:"),console.log(e)})})},C=(a,e)=>{a.forEach(s=>{s.addEventListener("accordionChanged",t=>{a.forEach(i=>{i!=t.target&&i.setAttribute("is-active","false")}),e.forEach(i=>{i.setAttribute("is-active","false")})})}),e.forEach(s=>{s.addEventListener("accordionChanged",t=>{e.forEach(i=>{i!=t.target&&i.setAttribute("is-active","false")})})})},U=(a,e)=>{let s=[];return a.categories.forEach(i=>{i.groups.forEach(n=>{n.layers.forEach(r=>{r.tags&&r.tags.forEach(o=>{o.includes(e)&&s.push(o)})})})}),[...new Set(s)]};let S=0;function $(a,e,s){let t=!1;if(a.forEach(i=>{i.getAttribute("data")===JSON.stringify(e)&&(t=!0)}),!t&&e){const i=document.createElement("app-infobox");i.setAttribute("data",JSON.stringify(e)),S++,i.setAttribute("uuid",S),s.append(i)}}const F=(a,e)=>{a.forEach(s=>{s.addEventListener("positionChanged",t=>{W(s,e,t)})})};function W(a,e,s){const t={uuid:a.getAttribute("uuid"),position:JSON.parse(s.detail.newValue)},i=e.findIndex(n=>n.uuid===t.uuid);i===-1?e.push(t):e[i].position=t.position,console.log(e)}const j=[self.location.hostname,"fonts.gstatic.com","fonts.googleapis.com","cdn.jsdelivr.net"],K=a=>{var e=Date.now(),s=new URL(a.url);return s.protocol=self.location.protocol,s.hostname===self.location.hostname&&(s.search+=(s.search?"&":"?")+"cache-bust="+e),s.href};self.addEventListener("activate",a=>{a.waitUntil(self.clients.claim())});self.addEventListener("fetch",a=>{if(j.indexOf(new URL(a.request.url).hostname)>-1){const e=caches.match(a.request),s=K(a.request),t=fetch(s,{cache:"no-store"}),i=t.then(n=>n.clone());a.respondWith(Promise.race([t.catch(n=>e),e]).then(n=>n||t).catch(n=>{})),a.waitUntil(Promise.all([i,caches.open("pwa-cache")]).then(([n,r])=>n.ok&&r.put(a.request,n)).catch(n=>{}))}});class x extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){}connectedCallback(){this.shadow.innerHTML=`
            <div>
                <input type="checkbox" id="checkbox">
                <label for="checkbox">Label</label>
            </div>                      
            `,this.checkbox=this.shadow.querySelector("input"),this.hasAttribute("is-checked")?this.setAttribute("is-checked",this.getAttribute("is-checked")):this.setAttribute("is-checked","false"),this.label=this.shadow.querySelector("label"),this.hasAttribute("data")&&(this.label.innerHTML=JSON.parse(this.getAttribute("data")).name);const e=JSON.parse(this.getAttribute("data")).components;if(e!=null&&e.length!=0){this.details=document.createElement("details"),this.details.innerHTML=`
                <summary>
                    Opzioni
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                    </svg>                
                </summary>
                `;for(const t of e)this.details.innerHTML+=`<${t}></${t}>`;this.shadow.append(this.details)}this.checkbox.addEventListener("change",t=>{const i=t.target.checked;this.setAttribute("is-checked",i+"")}),this.tool=this.shadow.querySelector("app-opacity-slider"),this.tool&&this.tool.addEventListener("opacityChanged",t=>{this.setAttribute("opacity",t.detail.newValue)});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/checkbox.css"),this.shadow.append(s),this.render()}attributeChangedCallback(e,s,t){if(e=="is-checked"&&s!==null&&t!==null&&t!==s){const i=new CustomEvent("checkboxChanged",{detail:{name:e,oldValue:s,newValue:t}});this.tool.setAttribute("is-enable",t),this.dispatchEvent(i)}if(e=="opacity"&&t!==s){const i=new CustomEvent("opacityChanged",{detail:{name:e,oldValue:s,newValue:t}});this.dispatchEvent(i)}}}u(x,"observedAttributes",["is-checked","opacity"]);customElements.define("app-checkbox",x);class T extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){if(!this.hasAttribute("input"))return;this.input=JSON.parse(this.getAttribute("input")),this.data=[];const e=[];for(let s=0;s<this.input.length;s++)this.checkbox=document.createElement("app-checkbox"),this.checkbox.setAttribute("is-checked","false"),this.checkbox.setAttribute("data",JSON.stringify(this.input[s])),e.push(this.checkbox),this.div.append(this.checkbox);e.forEach(s=>{s.addEventListener("checkboxChanged",()=>{this.itemData=JSON.parse(s.getAttribute("data"));const t=this.data.findIndex(i=>i.layer===this.itemData.layer);t!==-1?this.data.splice(t,1):this.data.push(this.itemData),this.setAttribute("data",JSON.stringify(this.data))})}),e.forEach(s=>{s.addEventListener("opacityChanged",t=>{this.itemData=JSON.parse(s.getAttribute("data")),this.itemData.opacity=t.detail.newValue;const i=this.data.findIndex(n=>n.layer===this.itemData.layer);i!==-1?(this.data.splice(i,1),this.data.push(this.itemData)):this.data.push(this.itemData),this.setAttribute("data",JSON.stringify(this.data))})})}connectedCallback(){this.shadow.innerHTML=`
            <div></div>
            `,this.div=this.shadow.querySelector("div");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/checkbox-list.css"),this.shadow.append(e),this.render()}attributeChangedCallback(e,s,t){const i=new CustomEvent("checkboxListChanged",{detail:{name:"data",oldValue:s,newValue:t,input:this.input}});t!=s&&this.dispatchEvent(i)}}u(T,"observedAttributes",["data"]);customElements.define("app-checkbox-list",T);class q extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"})}render(){}connectedCallback(){this.shadow.innerHTML=`
            <div class="infobox">
                <div class="drag-handler">
                    <svg id="grip-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>

                    <svg id="close-icon" viewPort="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1" y1="11" x2="11" y2="1" stroke="black" stroke-width="2"/>
                        <line x1="1" y1="1" x2="11" y2="11" stroke="black" stroke-width="2"/>
                    </svg>
                </div>

                <div class="info-content"></div>
            </div>
            `;const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/infobox.css"),this.shadow.append(e),this.info=this.shadow.querySelector(".info-content"),this.data=JSON.parse(this.getAttribute("data")),Object.keys(this.data).forEach(t=>{const i=this.data[t];this.text=document.createElement("p"),this.text.innerHTML=`
                <span class="info-key">${t}:</span> <span class="info-value">${i}</span>
                `,this.info.append(this.text)}),this.closeIcon=this.shadow.querySelector("#close-icon"),this.closeIcon.addEventListener("click",()=>{const t=new CustomEvent("infoboxRemoved",{detail:{uuid:this.getAttribute("uuid")}});this.dispatchEvent(t),this.remove()}),this.div=this.shadow.querySelector(".infobox"),this.dragHandler=this.shadow.querySelector(".drag-handler"),(t=>{let i=!1,n,r;this.dragHandler.addEventListener("mousedown",o=>{i=!0,n=o.clientX-t.getBoundingClientRect().left,r=o.clientY-t.getBoundingClientRect().top}),document.addEventListener("mousemove",o=>{i&&(t.style.left=o.clientX-n+"px",t.style.top=o.clientY-r+"px")}),document.addEventListener("mouseup",()=>{i=!1,this.setAttribute("position",JSON.stringify(t.getBoundingClientRect()))})})(this.div)}attributeChangedCallback(e,s,t){if(t!=s){const i=new CustomEvent("positionChanged",{detail:{name:e,oldValue:s,newValue:t}});this.dispatchEvent(i)}}}u(q,"observedAttributes",["position"]);customElements.define("app-infobox",q);class M extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){this.accordionTitle=this.shadow.querySelector(".accordion-title"),this.accordionTitle&&(this.accordionTitle.textContent=this.title),this.accordionContent=this.shadow.querySelector(".accordion-content"),this.accordionIcon=this.shadow.querySelector(".accordion-icon"),this.accordionContent&&(this.getAttribute("is-active")==="true"?(this.accordionContent.classList.add("accordion-show"),this.accordionIcon.classList.add("accordion-icon-active")):(this.accordionContent.classList.remove("accordion-show"),this.accordionIcon.classList.remove("accordion-icon-active")),this.classList.contains("last-accordion")&&this.accordionContent.classList.add("last-accordion"))}connectedCallback(){this.setAttribute("is-active","false"),this.shadow.innerHTML=`
            <div class="accordion-item">
                <button type="button" class="accordion-btn">
                    <span class="accordion-title"></span>
                    <span class="accordion-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                        </svg>
                    </span>
                </button>
                <div class="accordion-content">
                    <slot></slot>
                </div>
            </div>
            `;const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/accordion.css"),this.shadow.append(e),this.accordionBtn=this.shadow.querySelector(".accordion-btn"),this.accordionBtn.addEventListener("click",()=>{this.accordionContent=this.accordionBtn.nextElementSibling,this.getAttribute("is-active")==="true"?this.setAttribute("is-active","false"):this.setAttribute("is-active","true");const s=new CustomEvent("accordionChanged",{detail:{name:"is-active",oldValue:this.getAttribute("is-active"),newValue:this.getAttribute("is-active")}});this.dispatchEvent(s)})}attributeChangedCallback(e,s,t){e=="title"&&t!=s&&this.render(),e=="is-active"&&t!=s&&this.render()}}u(M,"observedAttributes",["title","is-active"]);customElements.define("app-accordion",M);class O extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){this.input&&(this.input.setAttribute("value",this.getAttribute("value")),this.input.value=this.getAttribute("value"))}connectedCallback(){this.shadow.innerHTML=`
            <input type="search" name="search" id="search" placeholder="Cerca per livelli..." value="">
            `,this.input=this.shadow.querySelector("input");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/search.css"),this.shadow.append(e),this.input.addEventListener("input",()=>{this.setAttribute("value",this.input.value)})}attributeChangedCallback(e,s,t){const i=new CustomEvent("searchValueChanged",{detail:{name:e,oldValue:s,newValue:t}});t!=s&&(this.dispatchEvent(i),this.render())}}u(O,"observedAttributes",["value"]);customElements.define("app-searchbar",O);class I extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){}connectedCallback(){this.shadow.innerHTML=`
            <a id="menu-toggle" class="menu-toggle">
                <span class="menu-toggle-bar menu-toggle-bar--top"></span>
                <span class="menu-toggle-bar menu-toggle-bar--middle"></span>
                <span class="menu-toggle-bar menu-toggle-bar--bottom"></span>
            </a>
            `,this.setAttribute("is-open","false");let e=this.getAttribute("is-open");this.a=this.shadow.querySelector("a");const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/drawer-toggle.css"),this.shadow.append(s),this.a.addEventListener("click",()=>{e=this.getAttribute("is-open")==="true",this.setAttribute("is-open",!e+"")})}attributeChangedCallback(e,s,t){if(e==="is-open"){this.a&&(t==="true"?this.a.classList.add("nav-open"):this.a.classList.remove("nav-open"));const i=new CustomEvent("drawerToggled",{detail:{name:e,oldValue:s,newValue:t}});this.dispatchEvent(i)}}}u(I,"observedAttributes",["is-open"]);customElements.define("app-drawer-toggle",I);class H extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){if(this.tags=JSON.parse(this.getAttribute("data")),this.div.innerHTML="",this.tags)for(let e=0;e<this.tags.length;e++)this.span=document.createElement("span"),this.span.textContent=this.tags[e],this.span.setAttribute("name",this.tags[e]),this.span.setAttribute("tabindex",e+1),this.div.append(this.span);this.spans=this.shadow.querySelectorAll("span"),this.spans.forEach(e=>{e.addEventListener("click",()=>{this.setAttribute("selected",e.getAttribute("name"))})})}connectedCallback(){this.shadow.innerHTML=`
            <div></div>
            `,this.selectedSpan=0,this.div=this.shadow.querySelector("div"),this.setAttribute("selected","");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/autocomplete.css"),this.shadow.append(e)}attributeChangedCallback(e,s,t){if(e=="data"&&t!=s&&this.render(),e=="selected"&&t!=s){const i=new CustomEvent("autocompleteSelected",{detail:{name:e,oldValue:s,newValue:t}});this.dispatchEvent(i),this.div.innerHTML=""}e=="last-key-pressed"&&t!="Enter"&&t!="ArrowDown"&&t!="ArrowUp"&&(this.selectedSpan=0,this.render()),(e=="last-key-pressed"&&t=="ArrowUp"||t=="ArrowDown")&&(t=="ArrowDown"&&(this.selectedSpan++,this.selectedSpan==this.spans.length+1&&(this.selectedSpan=1),this.shadow.querySelector(`span[tabindex="${this.selectedSpan}"]`).focus()),t=="ArrowUp"&&(this.selectedSpan++,this.selectedSpan==this.spans.length+1&&(this.selectedSpan=1),this.shadow.querySelector(`span[tabindex="${this.selectedSpan}"]`).focus())),e=="last-key-pressed"&&t=="Enter"&&(this.setAttribute("selected",this.shadow.activeElement.getAttribute("name")),this.div.innerHTML="")}}u(H,"observedAttributes",["data","selected","last-key-pressed"]);customElements.define("app-autocomplete",H);class N extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){this.getAttribute("is-enable")=="true"?this.input.disabled=!1:this.input.disabled=!0}connectedCallback(){this.shadow.innerHTML=`
            <div>
                <label>Opacità</label>
                <input type="range">
            </div>
            `,this.setAttribute("is-enable","false"),this.input=this.shadow.querySelector("input"),this.getAttribute("is-enable")=="false"&&(this.input.disabled=!0),this.input.setAttribute("min",0),this.input.setAttribute("max",1),this.input.setAttribute("step",.1),this.input.value=1,this.input.addEventListener("change",()=>{this.setAttribute("opacity",this.input.value)});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/tool.css"),this.shadow.append(e)}attributeChangedCallback(e,s,t){if(e=="opacity"&&t!=s){const i=new CustomEvent("opacityChanged",{detail:{name:e,oldValue:s,newValue:t}});this.dispatchEvent(i)}e=="is-enable"&&s!==null&&t!==null&&t!==s&&this.render()}}u(N,"observedAttributes",["is-enable","opacity"]);customElements.define("app-opacity-slider",N);const X="./json/categories.json",y=new R;y.setCamera();const g=document.querySelector("#categories-section");z(X).then(a=>(E(a,g),a)).then(a=>{const e=document.querySelector("main"),s=document.querySelector("app-drawer-toggle"),t=document.querySelector("#drawer"),i=document.querySelectorAll("app-checkbox-list"),n=document.querySelectorAll(".category-accordion"),r=document.querySelectorAll(".layer-accordion"),o=document.querySelector("app-searchbar"),p=document.querySelector("#drawer-title"),d=document.querySelector("app-autocomplete");s.addEventListener("drawerToggled",l=>{l.detail.newValue=="true"?t.classList.add("drawer-open"):t.classList.remove("drawer-open")});let c=[];y.viewer.screenSpaceEventHandler.setInputAction(function(l){y.onClick(l.position).then(h=>{const v=B(h,a);let f=document.querySelectorAll("app-infobox");$(f,v,e),f=document.querySelectorAll("app-infobox"),F(f,c),f.forEach(w=>{w.addEventListener("infoboxRemoved",A=>{c=c.filter(m=>A.detail.uuid!==m.uuid),console.log(c)})}),s.setAttribute("is-open","false")})},Cesium.ScreenSpaceEventType.LEFT_CLICK);const b=[];L(i,b,y),C(n,r),o.addEventListener("searchValueChanged",l=>{g.innerHTML="";const h=l.detail.newValue.toLowerCase();p.textContent=`Livelli per: ${h}`;let v=JSON.parse(JSON.stringify(a));if(D(v,h),h=="")E(a,g),p.textContent="Categorie";else if(E(v,g),!g.innerHTML){const m=document.createElement("p");m.innerText=`Nessun livello trovato per ${h}`,g.append(m)}const f=document.querySelectorAll("app-checkbox-list");L(f,b,y);const w=document.querySelectorAll(".category-accordion"),A=document.querySelectorAll(".layer-accordion");if(C(w,A),h.length>=2){const m=U(a,h);d.setAttribute("data",JSON.stringify(m))}else d.setAttribute("data",JSON.stringify(""))}),d.addEventListener("autocompleteSelected",l=>{const h=l.detail.newValue;o.setAttribute("value",h)}),document.addEventListener("keydown",l=>{d.setAttribute("last-key-pressed",l.key)})});