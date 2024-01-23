var G=Object.defineProperty;var J=(r,s,e)=>s in r?G(r,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[s]=e;var c=(r,s,e)=>(J(r,typeof s!="symbol"?s+"":s,e),e);(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();const F=[self.location.hostname,"fonts.gstatic.com","fonts.googleapis.com","cdn.jsdelivr.net"],j=r=>{var s=Date.now(),e=new URL(r.url);return e.protocol=self.location.protocol,e.hostname===self.location.hostname&&(e.search+=(e.search?"&":"?")+"cache-bust="+s),e.href};self.addEventListener("activate",r=>{r.waitUntil(self.clients.claim())});self.addEventListener("fetch",r=>{if(F.indexOf(new URL(r.request.url).hostname)>-1){const s=caches.match(r.request),e=j(r.request),t=fetch(e,{cache:"no-store"}),i=t.then(n=>n.clone());r.respondWith(Promise.race([t.catch(n=>s),s]).then(n=>n||t).catch(n=>{})),r.waitUntil(Promise.all([i,caches.open("pwa-cache")]).then(([n,o])=>n.ok&&o.put(r.request,n)).catch(n=>{}))}});class Z extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"}),this.routes={}}connectedCallback(){window.addEventListener("hashchange",()=>{this.checkRoute()})}addRoutes(s){this.routes=s,this.checkRoute()}changeRoute(s){if(s)this.shadow.innerHTML=this.routes[s]?this.routes[s].routingFunction():this.sendToNotFound();else{const e=Object.entries(this.routes).find(([t,i])=>i.type==="default");e?window.location.hash="#/"+e[0]:this.sendToNotFound()}}sendToNotFound(){Object.entries(this.routes).find(([e,t])=>t.type==="notFound")&&(window.location.hash="#/"+defaultRoute[0],this.changeRoute(defaultRoute[0]))}checkRoute(){const s=window.location.hash.slice(2);this.changeRoute(s)}}customElements.define("app-router",Z);class h{constructor(){if(h._instance)return h._instance;this.listeners=[],h._instance=this}static get instance(){return h._instance||(h._instance=new h),h._instance}subscribe(s,e){this.listeners[s]||(this.listeners[s]=[]),this.listeners[s].push(e)}publish(s,e){this.listeners[s]&&this.listeners[s].forEach(t=>t(e))}}class v{constructor(s,e,t,i=[]){this.properties=s,this.layer=e,this.startingCoordinates=t,this.coordinatesArray=i,this.coordinatesArray.length===0&&this.coordinatesArray.push(t)}get id(){return this.layer.layer+this.startingCoordinates.latitude+this.startingCoordinates.longitude}static fromPoint(s,e,t){return new v(s,e,t)}static fromPolyline(s,e,t){return new v(s,e,t[0],t)}static fromPolygon(s,e,t,i){return new v(s,e,t,i)}}class p{constructor(){c(this,"_instance");if(p._instance)return p._instance;p._instance=this}static get instance(){return p._instance||(p._instance=new p),p._instance}getFeature(s,e){const t=this.getLayerName(s.id),i=this.getLayerByName(e,t),n=this.getRelevantProperties(s.id.properties,i.relevant_properties);let o,l;if(s.id.point){let a=s.id.position._value;l=this.checkCoordinates(a),o=v.fromPoint(n,i,l)}if(s.id.polyline){let a=s.id.polyline.positions._value;l=this.checkCoordinates(a),o=v.fromPolyline(n,i,l)}if(s.id.polygon){let a=s.id.polygon.hierarchy._value.positions;l=this.checkCoordinates(a);let u=this.getPolygonCenter(s.id.polygon);o=v.fromPolygon(n,i,u,l)}return o}getLayerName(s){let e;return e=s.properties.layerName._value,e}getLayerByName(s,e){for(const t in s){const i=s[t];if(Array.isArray(i)||typeof i=="object"){const n=this.getLayerByName(i,e);if(n)return n}else if(typeof i=="string"&&i.includes(e))return s}return null}getRelevantProperties(s,e){const t={};if(e){for(const i of e)if(s[i.property_name]){let n={property_name:i.property_name,display_name:i.display_name,type:i.type};s[i.property_name]._value&&(typeof s[i.property_name]._value=="string"?n.value=s[i.property_name]._value:n.value=s[i.property_name]._value.value),t[i.property_name]=n}return t.raiseName=s.raiseName._value,t.layerName=s.layerName._value,t}}checkCoordinates(s){if(Array.isArray(s)){let e=[];return s.map(t=>{let i=this.cartesianToCartographic(t);e.push(i)}),e}else return this.cartesianToCartographic(s)}cartesianToCartographic(s){const e=Cesium.Cartographic.fromCartesian(s);let t=Cesium.Math.toDegrees(e.longitude),i=Cesium.Math.toDegrees(e.latitude);return t=parseFloat(t.toFixed(8)),i=parseFloat(i.toFixed(8)),{longitude:t,latitude:i}}getPolygonCenter(s){const e=s.hierarchy.getValue().positions;if(e&&e.length==0)return;let t=0,i=0;for(let l=0;l<e.length;l++){let a=Cesium.Cartographic.fromCartesian(e[l]);t+=Cesium.Math.toDegrees(a.longitude),i+=Cesium.Math.toDegrees(a.latitude)}let n=t/e.length;return{latitude:i/e.length,longitude:n}}createGeoJson(s){return{type:"FeatureCollection",features:s.map(i=>({type:"Feature",geometry:{type:"Point",coordinates:[i.startingCoordinates.longitude,i.startingCoordinates.latitude]},properties:i.properties}))}}}class k{constructor(s,e,t,i){this.name=s,this.features=e.map(n=>new v(n.properties,n.layer,n.startingCoordinates,n.coordinatesArray)),this.type=t,this.lastSelected=i}}class d{constructor(){c(this,"_data");if(d._instance)return d._instance;d._instance=this}static get instance(){return d._instance||(d._instance=new d),d._instance}getData(){this.data={};let s=JSON.parse(localStorage.getItem("selectedTags"));s?this.data.selectedTags=s:this.data.selectedTags=[];let e=JSON.parse(localStorage.getItem("routes"));if(e)this.data.routes=e.map(n=>new k(n.name,n.features,n.type,n.lastSelected));else{e=[];let n=new k("Default",[],"default",!0);e.push(n),localStorage.setItem("routes",JSON.stringify(e)),this.data.routes=e}let t=JSON.parse(localStorage.getItem("theme"));t||(t=1),this.data.theme=t;let i=JSON.parse(localStorage.getItem("layers"));if(!i){i={};let n=[],o=[];i.active=n,i.bench=o}return this.data.layers=i,this.data}updateActiveLayers(s){let e=d.instance.getData().layers;e.active=[...s],localStorage.setItem("layers",JSON.stringify(e))}updateBenchLayers(s){let e=d.instance.getData().layers;e.bench=[...s],localStorage.setItem("layers",JSON.stringify(e))}resetLayers(){let s=d.instance.getData().layers;s.bench.length=0,s.active.length=0,localStorage.setItem("layers",JSON.stringify(s))}}class m{constructor(){c(this,"CATEGORIES_URL","./json/categories.json");c(this,"_data");if(m._instance)return m._instance;m._instance=this}static get instance(){return m._instance||(m._instance=new m),m._instance}get data(){return this._data}set data(s){this._data=s}getData(){return this.data?Promise.resolve(this.data):this.fetchAppData(this.CATEGORIES_URL).then(s=>(this.data=s,s))}async fetchAppData(s){try{const e=await fetch(s).then(i=>i.json()),t=await Promise.all(e.categories.map(async i=>{const n=await Promise.all(i.groups.map(async o=>{try{const l=await fetch(o);if(l.ok)return l.json();throw new Error(`Errore durante il recupero dei dati da ${o}`)}catch(l){return console.error(l),null}}));return i.groups=n,i}));return{...e,categories:t}}catch(e){throw console.error("Errore durante il recupero dei dati JSON",e),e}}}class g{constructor(){c(this,"THEMES_URL","./json/themes.json");c(this,"_themes");if(g._instance)return g._instance;g._instance=this}static get instance(){return g._instance||(g._instance=new g),g._instance}get themes(){return this._themes}set themes(s){this._themes=s}getThemes(){return this.themes?Promise.resolve(this.themes):fetch(this.THEMES_URL).then(s=>s.json()).then(s=>(this.themes=s,s))}}class b{constructor(){if(b._instance)return b._instance;b._instance=this}static get instance(){return b._instance||(b._instance=new b),b._instance}getPosition(){return new Promise((s,e)=>{navigator.geolocation.getCurrentPosition(t=>{s(t)},t=>{e(t)})})}}class U extends HTMLElement{constructor(){super();c(this,"_data");c(this,"_position");c(this,"filterLayersByTags",(e,t)=>{let i=[];return e.categories.map(n=>{n.groups.map(o=>{o.layers.map(l=>{l.tags&&t.some(a=>l.tags.includes(a))&&i.push({...l,tags:[...l.tags]})})})}),i});this.shadow=this.attachShadow({mode:"closed"})}get data(){return this._data}set data(e){this._data=e}get position(){return this._position}set position(e){this._position=e}async connectedCallback(){let e=document.createElement("app-splash");this.shadow.append(e),this.data=await m.instance.getData(),this.position={};try{let a=await b.instance.getPosition();this.position.latitude=a.coords.latitude,this.position.longitude=a.coords.longitude}catch(a){console.error("Impossibile recuperare la posizione",a)}this.shadow.innerHTML+=`
            <app-cesium></app-cesium>
            <app-tabs></app-tabs>
            <div class="header">
                <div class="search">    
                    <app-tabs-toggle></app-tabs-toggle>
                    <app-searchbar></app-searchbar>
                    <div class="divider"><span class="vr"></span></div>
                    <app-bench-toggle></app-bench-toggle>
                    <app-theme-icon></app-theme-icon>
                    <app-link icon='apps' link ="/"></app-link>   
                </div>
                <app-carousel></app-carousel>
            </div>
            <app-search-result></app-search-result>
            <app-bench></app-bench>
            <app-map-mode-btn></app-map-mode-btn>
            <app-center-position></app-center-position>
            <app-no-position-dialog></app-no-position-dialog>
            `,this.map=this.shadow.querySelector("app-cesium"),this.tabs=this.shadow.querySelector("app-tabs"),this.searchbar=this.shadow.querySelector("app-searchbar"),this.searchResult=this.shadow.querySelector("app-search-result"),this.autocomplete=this.shadow.querySelector("app-autocomplete"),this.bench=this.shadow.querySelector("app-bench"),this.tabsToggle=this.shadow.querySelector("app-tabs-toggle"),this.benchToggle=this.shadow.querySelector("app-bench-toggle"),this.carousel=this.shadow.querySelector("app-carousel"),this.themeIcon=this.shadow.querySelector("app-theme-icon"),this.changeMapMode=this.shadow.querySelector("app-map-mode-btn"),this.centerPosition=this.shadow.querySelector("app-center-position"),this.noPositionDialog=this.shadow.querySelector("app-no-position-dialog"),this.position.latitude&&this.position.longitude?(this.map.setCameraToPosition(this.position),this.map.checkUserPin(this.position)):this.map.setCameraToPosition({latitude:44.40753207658791,longitude:8.934080815653985}),this.map.addEventListener("map-click",a=>{this.benchToggle.setAttribute("is-open",!1),this.tabsToggle.setAttribute("is-open",!1),this.changeMapMode.setAttribute("is-open",!1),this.centerPosition.setAttribute("is-open",!1),this.searchbar.setAttribute("value","");const u=this.map.getEntity(a.detail.movement);if(u==null||u.id.id==="user-pin"){this.tabs.setAttribute("is-open",!1),this.map.viewer.dataSources.getByName("selected-feature").forEach(N=>this.map.viewer.dataSources.remove(N));return}const x=p.instance.getFeature(u,this.data);h.instance.publish("feature-selected",x),this.map.setCameraToPosition(x.startingCoordinates),this.tabs.addFeature(x),this.tabsToggle.setAttribute("is-open",!0),this.changeMapMode.setAttribute("is-open",!0),this.centerPosition.setAttribute("is-open",!0),this.tabs.setAttribute("active-tab","info-tab")}),this.tabs.addEventListener("tabs-toggle",a=>{a.detail.isOpen==!0?this.map.classList.add("minimize"):(this.map.classList.remove("minimize"),this.tabsToggle.setAttribute("is-open",!1))}),h.instance.subscribe("tab-maximize",a=>{a==!0?(this.tabs.setAttribute("is-maximized",!0),this.centerPosition.setAttribute("is-maximized",!0),this.changeMapMode.setAttribute("is-maximized",!0)):(this.tabs.setAttribute("is-maximized",!1),this.centerPosition.setAttribute("is-maximized",!1),this.changeMapMode.setAttribute("is-maximized",!1))}),h.instance.subscribe("tabinfocard-click",a=>{this.map.setCameraToPosition(a.startingCoordinates)}),h.instance.subscribe("customroutecard-click",a=>{this.map.setCameraToPosition(a.startingCoordinates)}),this.searchbar.addEventListener("search",a=>{a.detail.searchValue.length==0?this.searchResult.setAttribute("is-open",!1):this.searchResult.setAttribute("is-open",!0),this.searchResult.layers=a.detail.layers}),this.searchbar.shadowRoot.querySelector("input").addEventListener("click",()=>{this.tabsToggle.setAttribute("is-open",!1),this.benchToggle.setAttribute("is-open",!1)}),this.tabsToggle.addEventListener("drawer-toggle",a=>{const u=JSON.parse(a.detail.isOpen);this.tabs.setAttribute("is-open",u),this.changeMapMode.setAttribute("is-open",u),this.centerPosition.setAttribute("is-open",u),u===!0&&this.benchToggle.setAttribute("is-open",!1),u===!1&&this.tabs.setAttribute("is-maximized",!1)}),this.benchToggle.addEventListener("bench-toggle",a=>{const u=JSON.parse(a.detail.isOpen);this.bench.setAttribute("is-open",u),u===!0&&this.tabsToggle.setAttribute("is-open",!1)}),this.bench.addEventListener("click",()=>{this.tabsToggle.setAttribute("is-open",!1),this.benchToggle.setAttribute("is-open",!1)}),this.bench.addEventListener("bench-empty",()=>{this.benchToggle.setAttribute("is-open",!1)}),document.addEventListener("bench-layer",()=>{this.benchToggle.setAttribute("is-open",!0)}),this.carousel.addEventListener("load-layers",a=>{this.map.loadLayers(a.detail.activeLayers)}),this.themeIcon.addEventListener("themechange",a=>{this.map.changeTheme(a.detail.themeIndex)}),this.changeMapMode.addEventListener("change-map-mode",()=>{this.map.changeMapMode()}),h.instance.subscribe("no-position-found",()=>{this.noPositionDialog.openDialog()}),this.centerPosition.addEventListener("center-position",async()=>{try{let a=await b.instance.getPosition();this.position.latitude=a.coords.latitude,this.position.longitude=a.coords.longitude,this.map.setCameraToPosition(this.position),this.map.checkUserPin(this.position)}catch(a){console.error("Impossibile recuperare la posizione",a),h.instance.publish("no-position-found")}}),this.themes=await g.instance.getThemes(),this.map.loadImageryProviders(this.themes);let t=d.instance.getData().theme;this.themeIcon.themeIndex=t;const i=document.createElement("link");i.setAttribute("rel","stylesheet"),i.setAttribute("href","./css/map.page.css"),this.shadow.append(i);let n=d.instance.getData(),o=n.selectedTags,l=n.layers;if(l.active.length===0&&l.bench.length===0){let a=this.filterLayersByTags(this.data,o);this.carousel.layers=a,a.forEach(u=>this.carousel.createChip(u))}else this.carousel.layers=l.active,l.active.forEach(a=>this.carousel.createChip(a)),this.bench.layers=l.bench,l.bench.forEach(a=>this.bench.createChip(a));e=this.shadow.querySelector("app-splash"),setTimeout(()=>{e.remove()},3e3)}render(){}}customElements.define("page-map",U);class A extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){this.text=document.createElement("h1"),this.text.innerText="Seleziona i tag a cui sei interessato",this.shadow.append(this.text),this.container=document.createElement("div"),this.shadow.append(this.container),this.input=JSON.parse(this.getAttribute("input")),W(this.input).forEach(i=>{this.chip=document.createElement("app-chip"),this.chip.setAttribute("tag",i),this.container.append(this.chip)}),this.submit=document.createElement("app-submit-tags-btn"),this.shadow.append(this.submit),this.selectAll=document.createElement("app-select-all-tags-btn"),this.shadow.append(this.selectAll),this.reset=document.createElement("app-reset-tags-btn"),this.shadow.append(this.reset),this.clearLocalStorage=document.createElement("button"),this.clearLocalStorage.innerText="Clear local storage",this.shadow.append(this.clearLocalStorage),this.allChips=this.shadow.querySelectorAll("app-chip");let e=[];this.allChips.forEach(i=>{i.addEventListener("chipChanged",n=>{n.detail.newValue=="true"?e.push(n.detail.tag):e=e.filter(o=>o!==n.detail.tag),this.submit.setAttribute("tags",JSON.stringify(e))})}),localStorage.selectedTags&&JSON.parse(localStorage.selectedTags).forEach(n=>{this.allChips.forEach(o=>{o.getAttribute("tag")==n&&o.setAttribute("is-selected","true")})}),this.selectAll.addEventListener("selectAllTags",()=>{this.allChips.forEach(i=>{i.setAttribute("is-selected","true")})}),this.reset.addEventListener("resetTags",()=>{this.allChips.forEach(i=>{i.setAttribute("is-selected","false")})}),this.clearLocalStorage.addEventListener("click",()=>{localStorage.clear(),console.log(localStorage)});const t=document.createElement("link");t.setAttribute("rel","stylesheet"),t.setAttribute("href","./css/tag-selection.css"),this.shadow.append(t)}async connectedCallback(){const s=await m.instance.getData();this.setAttribute("input",JSON.stringify(s))}attributeChangedCallback(s,e,t){t!=e&&s=="input"&&this.render()}}c(A,"observedAttributes",["input"]);customElements.define("app-tag-selection",A);function W(r){let s=[];r.categories.forEach(t=>{t.groups.forEach(i=>{i.layers.forEach(n=>{n.tags&&n.tags.forEach(o=>{s.push(o)})})})});const e=[...new Set(s)];return e.sort(),e}class Y extends HTMLElement{constructor(){super();c(this,"_tags");c(this,"_selected");this.shadow=this.attachShadow({mode:"closed"}),this._selected=[]}get tags(){return this._tags}set tags(e){this._tags=e}get selected(){return this._selected}set selected(e){this._selected=e}render(){this.tags.forEach(e=>{this.chip=document.createElement("app-chip"),this.chip.setAttribute("tag",e),this.list.append(this.chip)}),this.chips=this.shadow.querySelectorAll("app-chip"),this.chips.forEach(e=>{e.addEventListener("chipChanged",t=>{if(t.detail.newValue=="true"){if(this.selected.includes(t.detail.tag))return;this.selected.push(t.detail.tag)}else this.selected=this.selected.filter(i=>i!==t.detail.tag);this.selected.length===0?this.submit.disabled=!0:this.submit.disabled=!1})}),localStorage.selectedTags&&(this.selected=JSON.parse(localStorage.selectedTags),this.selected.forEach(e=>{this.chips.forEach(t=>{t.getAttribute("tag")==e&&t.setAttribute("is-selected","true")})}),this.selected.length===0?this.submit.disabled=!0:this.submit.disabled=!1)}async connectedCallback(){d.instance.resetLayers();const e=await m.instance.getData();this.tags=this.getTags(e),console.log("Tag attualmente salvati:",d.instance.getData().selectedTags),this.shadow.innerHTML=`
            <div class="page">
                <div class="box">
                    <div class="header">
                        <img src="./images/RAISE_pictogram_nobg.svg" alt="Raise logo" class="logo">
                        <h1>Ecco alcuni dati che potrebbero interessarti:</h1>
                        <p class="info">Seleziona almeno una categoria di dati per iniziare. Non preoccuparti, potrai sceglierne altre successivamente.</p>
                    </div>
                    <div class="list"></div>
                    <div class="buttons">
                        <button type="submit" class="skip">Continua senza preferenze</button>
                        <button type="submit" class="submit">Continua</button>
                    </div>
                </div>
            </div>
            `,this.list=this.shadow.querySelector(".list"),this.submit=this.shadow.querySelector(".submit"),this.skip=this.shadow.querySelector(".skip"),this.submit.disabled=!0,this.submit.addEventListener("click",()=>{localStorage.setItem("selectedTags",JSON.stringify(this.selected)),window.location.href="/raise/#/map"}),this.skip.addEventListener("click",()=>{localStorage.setItem("selectedTags",JSON.stringify([])),window.location.href="/raise/#/map"});const t=document.createElement("link");t.setAttribute("rel","stylesheet"),t.setAttribute("href","./css/tags.page.css"),this.shadow.append(t),this.render()}getTags(e){let t=[];e.categories.forEach(n=>{n.groups.forEach(o=>{o.layers.forEach(l=>{l.tags&&l.tags.forEach(a=>{t.push(a)})})})});const i=[...new Set(t)];return i.sort(),i}}customElements.define("page-tags",Y);class L extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="icon">
                <span class="material-symbols-outlined">menu</span>
            </span>
            `,this.shadow.append(this.button),this.setAttribute("is-open","false");let s=this.getAttribute("is-open");this.btn=this.shadow.querySelector("button");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/tabs.toggle.component.css"),this.shadow.append(e),this.btn.addEventListener("click",()=>{s=this.getAttribute("is-open")==="true",this.setAttribute("is-open",!s+"")})}attributeChangedCallback(s,e,t){if(t!=e&&s=="is-open"){const i=new CustomEvent("drawer-toggle",{detail:{isOpen:t}});this.dispatchEvent(i)}}}c(L,"observedAttributes",["is-open"]);customElements.define("app-tabs-toggle",L);class X extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.hasAttribute("icon")||this.setAttribute("icon","app"),this.hasAttribute("link")||this.setAttribute("link","/"),this.button=document.createElement("button"),this.button.innerHTML=`
            <a href="${this.getAttribute("link")}">
                <span class="icon">
                    <span class="material-symbols-outlined">${this.getAttribute("icon")}</span>
                </span>
            </a>
            `,this.shadow.append(this.button);const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/icon.css"),this.shadow.append(s)}}customElements.define("app-link",X);class $ extends HTMLElement{constructor(){super();c(this,"_themeIndex");this.shadow=this.attachShadow({mode:"closed"}),this._themeIndex=1}get themeIndex(){return this._themeIndex}set themeIndex(e){this._themeIndex=e,this.dispatchEvent(new CustomEvent("themechange",{detail:{themeIndex:e}}))}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="icon">
                <span class="material-symbols-outlined">contrast</span>
            </span>
            `,this.shadow.append(this.button),this.button.addEventListener("click",()=>{let t=this._themeIndex;t++,t>2&&(t=0),this.themeIndex=t,localStorage.setItem("theme",JSON.stringify(this._themeIndex))});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/themeIcon.component.css"),this.shadow.append(e)}}customElements.define("app-theme-icon",$);class C extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"})}focusInput(){this.input.focus()}render(){this.input.setAttribute("value",this.getAttribute("value")),this.input.value=this.getAttribute("value")}connectedCallback(){this.shadow.innerHTML=`
            <input type="search" name="search" id="search" placeholder="Cerca per livelli..." value="">
            `,this.input=this.shadow.querySelector("input"),this.hasAttribute("value")||this.setAttribute("value",""),this.input.addEventListener("input",e=>{this.setAttribute("value",this.input.value)}),document.addEventListener("add-layer",()=>this.setAttribute("value",""));const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/searchbar.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){if(t!=e&&e!=null&&s=="value"){t=t.toLowerCase();let i=this.filterLayersByNameAndTag(m.instance.data,t);this.dispatchEvent(new CustomEvent("search",{detail:{searchValue:t,layers:i}})),this.render()}}filterLayersByNameAndTag(s,e){let t=[];return s.categories.forEach(i=>{i.groups.forEach(n=>{n.layers.forEach(o=>{(o.name.toLowerCase().includes(e)||o.tags.some(l=>l.includes(e)))&&t.push(o)})})}),t}}c(C,"observedAttributes",["value"]);customElements.define("app-searchbar",C);class S extends HTMLElement{constructor(){super();c(this,"_layers");this.shadow=this.attachShadow({mode:"closed"}),this.hasAttribute("is-open")||this.setAttribute("is-open",!1)}get layers(){return this._layers}set layers(e){this._layers=e,this.render()}render(){if(this.div.innerHTML="",this.layers.length==0){let e=document.createElement("p");e.innerText="Nessun livello trovato",this.div.append(e)}else this.layers.forEach(e=>{let t=document.createElement("app-search-result-chip");t.layer=e,this.div.append(t),t.addEventListener("add-layer",i=>{document.dispatchEvent(new CustomEvent("add-layer",{detail:{layers:[i.detail.layer]}})),this.setAttribute("is-open",!1)}),this.div.scrollTop=0})}connectedCallback(){this.shadow.innerHTML="<div></div>",this.div=this.shadow.querySelector("div");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/search-result.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){i!=t&&e=="is-open"&&(i=="true"?this.classList.add("visible"):this.classList.remove("visible"))}}c(S,"observedAttributes",["is-open"]);customElements.define("app-search-result",S);class w{constructor(){c(this,"_hex");c(this,"_rgba");this.hex,this.rgba,this.opacity=1}get hex(){return this._hex}set hex(s){this._hex=s}get rgba(){return this._rgba}set rgba(s){this._rgba=s}convertHexToRgba(s,e=this.opacity){let t=s.replace("#","");t.length===3&&(t=`${t[0]}${t[0]}${t[1]}${t[1]}${t[2]}${t[2]}`);const i=parseInt(t.substring(0,2),16),n=parseInt(t.substring(2,4),16),o=parseInt(t.substring(4,6),16);return e>1&&e<=100&&(e=e/100),this.rgba=`rgba(${i},${n},${o},${e})`,this.rgba}changeOpacity(s,e){const i=s.substring(5,s.length-1).split(","),[n,o,l]=i.map(u=>parseInt(u));return`rgba(${n},${o},${l},${e})`}}class K extends HTMLElement{constructor(){super();c(this,"_layer");this.shadow=this.attachShadow({mode:"closed"}),this.colorManager=new w}get layer(){return this._layer}set layer(e){this._layer=e}render(){}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="chip">
                <div class="info">
                    <span class="legend"></span>
                    <label>${this.layer.name}</label>
                </div>
                <span class="icon add-icon">
                    <span class="material-symbols-outlined">add</span>
                </span>
            </div>
            `,this.chip=this.shadow.querySelector(".chip"),this.label=this.shadow.querySelector("label"),this.legend=this.shadow.querySelector(".legend"),this.colorManager.hex=this.layer.style.color,this.colorManager.rgba=this.colorManager.convertHexToRgba(this.colorManager.hex),this.legend.style.backgroundColor=this.colorManager.changeOpacity(this.colorManager.rgba,.25),this.legend.style.borderColor=this.colorManager.rgba,this.legend.style.borderWidth="2px",this.legend.style.borderStyle="solid",this.chip.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("add-layer",{detail:{layer:this.layer}}))});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/search-result-chip.css"),this.shadow.append(e)}}customElements.define("app-search-result-chip",K);class V extends HTMLElement{constructor(){super();c(this,"_isGrabbed");c(this,"_startX");c(this,"_scrollLeft");c(this,"_layers");this.shadow=this.attachShadow({mode:"closed"}),this.isGrabbed=!1,this._layers=[]}get layers(){return this._layers}set layers(e){this._layers=e,this.dispatchEvent(new CustomEvent("load-layers",{detail:{activeLayers:this.layers}})),d.instance.updateActiveLayers(this._layers)}get isGrabbed(){return this._isGrabbed}set isGrabbed(e){this._isGrabbed=e,this.isGrabbed==!0?this.style.cursor="grabbing":this.style.cursor="pointer"}connectedCallback(){this.shadow.innerHTML="<div></div>",this.div=this.shadow.querySelector("div"),this.addEventListener("mousedown",t=>this.start(t)),this.addEventListener("touchstart",t=>this.start(t)),this.addEventListener("mousemove",t=>this.move(t)),this.addEventListener("touchmove",t=>this.move(t)),this.addEventListener("mouseup",this.end),this.addEventListener("touchend",this.end),this.addEventListener("mouseleave",this.end),document.addEventListener("add-layer",t=>{this.checkLayers(this._layers,t.detail.layers).forEach(n=>this.addLayer(n))});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/carousel.css"),this.shadow.append(e)}start(e){this.isGrabbed=!0,this._startX=e.pageX||e.touches[0].pageX-this.offsetLeft,this._scrollLeft=this.scrollLeft}move(e){if(this.isGrabbed==!1)return;e.preventDefault();const i=((e.pageX||e.touches[0].pageX-this.offsetLeft)-this._startX)*3;this.scrollLeft=this._scrollLeft-i}end(){this.isGrabbed=!1}addLayer(e){this._layers.push(e),this.createChip(e),this.layers=this._layers}removeLayer(e){this._layers=this._layers.filter(t=>e.layer!==t.layer),this.layers=this._layers}createChip(e){let t=document.createElement("app-layer-chip");t.layer=e,this.div.append(t),t.addEventListener("bench-layer",i=>{const n=i.detail.layer;this.removeLayer(n),document.dispatchEvent(new CustomEvent("bench-layer",{detail:{layers:[n]}}))})}checkLayers(e,t){return t.filter(i=>!e.some(n=>i.name==n.name))}}customElements.define("app-carousel",V);class Q extends HTMLElement{constructor(){super();c(this,"_layer");c(this,"_isGrabbed");this.shadow=this.attachShadow({mode:"closed"}),this.colorManager=new w}get layer(){return this._layer}set layer(e){this._layer=e}get isGrabbed(){return this._isGrabbed}set isGrabbed(e){this._isGrabbed=e,this.isGrabbed==!0?this.style.cursor="grabbing":this.style.cursor="pointer"}render(){}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="chip">
                <div class="select">
                    <span class="legend"></span>
                    <label></label>
                </div>
                <div class="divider">
                    <span class="vr"></span>
                </div>
                <div class="delete">
                    <span class="icon delete-icon">
                        <span class="material-symbols-outlined">close</span>
                    </span>
                </div>
            </div>
            `,this.select=this.shadow.querySelector(".select"),this.legend=this.shadow.querySelector(".legend"),this.label=this.shadow.querySelector("label"),this.icon=this.shadow.querySelector(".icon"),this.colorManager.hex=this.layer.style.color,this.colorManager.rgba=this.colorManager.convertHexToRgba(this.colorManager.hex),this.label.innerText=this.layer.name,this.legend.style.backgroundColor=this.colorManager.changeOpacity(this.colorManager.rgba,.25),this.legend.style.borderColor=this.colorManager.rgba,this.legend.style.borderWidth="2px",this.legend.style.borderStyle="solid",this.addEventListener("mousedown",t=>{this.isGrabbed=!0}),this.addEventListener("mouseup",t=>{this.isGrabbed=!1}),this.icon.addEventListener("click",()=>{this.remove()});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/layer-chip.css"),this.shadow.append(e)}disconnectedCallback(){this.dispatchEvent(new CustomEvent("bench-layer",{detail:{layer:this.layer}}))}}customElements.define("app-layer-chip",Q);class T extends HTMLElement{constructor(){super();c(this,"_layers");this.shadow=this.attachShadow({mode:"closed"}),this._layers=[]}get layers(){return this._layers}set layers(e){this._layers=e,this._layers.length==0&&this.dispatchEvent(new CustomEvent("bench-empty")),d.instance.updateBenchLayers(this._layers)}connectedCallback(){this.shadow.innerHTML="<div></div>",this.div=this.shadow.querySelector("div"),this.hasAttribute("is-open")||this.setAttribute("is-open","false"),document.addEventListener("bench-layer",t=>{this.checkLayers(this._layers,t.detail.layers).forEach(n=>{this.addLayer(n)})});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/bench.component.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){i!=t&&t!=null&&e=="is-open"&&(i=="true"?(this._layers.length==0&&this.dispatchEvent(new CustomEvent("bench-empty")),this.classList.add("visible")):this.classList.remove("visible"))}addLayer(e){this._layers.push(e),this.createChip(e),this.layers=this._layers}removeLayer(e){this._layers=this._layers.filter(t=>e.layer!==t.layer),this.layers=this._layers}createChip(e){let t=document.createElement("app-bench-layer");t.layer=e,this.div.append(t),t.addEventListener("restore-layer",i=>{this.removeLayer(i.detail.layer),document.dispatchEvent(new CustomEvent("add-layer",{detail:{layers:[i.detail.layer]}}))}),t.addEventListener("delete-layer",i=>{this.removeLayer(i.detail.layer)})}checkLayers(e,t){return t.filter(i=>!e.some(n=>i.name==n.name))}}c(T,"observedAttributes",["is-open"]);customElements.define("app-bench",T);class ee extends HTMLElement{constructor(){super();c(this,"_layer");this.shadow=this.attachShadow({mode:"closed"})}get layer(){return this._layer}set layer(e){this._layer=e}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="chip">
                <div class="add">
                    <span class="icon add-icon">
                        <span class="material-symbols-outlined">add</span>
                    </span>
                    <label>${this.layer.name}</label>
                </div>
                <div class="divider">
                    <span class="vr"></span>
                </div>
                <div class="delete">
                    <span class="icon delete-icon">
                        <span class="material-symbols-outlined">delete</span>
                    </span>
                </div>
            </div>
            `,this.add=this.shadow.querySelector(".add"),this.delete=this.shadow.querySelector(".delete"),this.add.addEventListener("click",t=>{t.stopPropagation(),this.dispatchEvent(new CustomEvent("restore-layer",{detail:{layer:this.layer}})),this.remove()}),this.delete.addEventListener("click",t=>{t.stopPropagation(),this.dispatchEvent(new CustomEvent("delete-layer",{detail:{layer:this.layer}})),this.remove()}),document.addEventListener("add-layer",t=>{t.detail.layers[0].layer===this.layer.layer&&(this.dispatchEvent(new CustomEvent("delete-layer",{detail:{layer:this.layer}})),this.remove())});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/bench.chip.component.css"),this.shadow.append(e)}}customElements.define("app-bench-layer",ee);class te extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="material-symbols-outlined">play_circle</span>
            <span class="label">Ascolta</span>
            `,this.shadow.append(this.button),this.button.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("read-info"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/play-info-btn.css"),this.shadow.append(s)}}customElements.define("app-play-info-btn",te);class se extends HTMLElement{constructor(){super();c(this,"_coordinates");this.shadow=this.attachShadow({mode:"closed"})}get coordinates(){return this._coordinates}set coordinates(e){this._coordinates=e}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="material-symbols-outlined">directions</span>
            <span class="label">Indicazioni</span>
            `,this.shadow.append(this.button),this.button.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("go-to",{detail:{coordinates:this.coordinates}}))});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/goto-btn.css"),this.shadow.append(e)}}customElements.define("app-goto",se);class ie extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="material-symbols-outlined">add</span>
            <span class="label">Aggiungi</span>
            `,this.shadow.append(this.button),this.button.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("add-route"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/add-to-route-btn.css"),this.shadow.append(s)}}customElements.define("app-add-to-route",ie);class M extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <button>
                <div class="icon">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480h80q0 115 72.5 203T418-166l-58-58 56-56L598-98q-29 10-58.5 14T480-80Zm20-280v-240h120q17 0 28.5 11.5T660-560v160q0 17-11.5 28.5T620-360H500Zm-200 0v-60h100v-40h-60v-40h60v-40H300v-60h120q17 0 28.5 11.5T460-560v160q0 17-11.5 28.5T420-360H300Zm260-60h40v-120h-40v120Zm240-60q0-115-72.5-203T542-794l58 58-56 56-182-182q29-10 58.5-14t59.5-4q83 0 156 31.5T763-763q54 54 85.5 127T880-480h-80Z"/></svg>
                    </span>
                </div>
            </button>
            `,this.button=this.shadow.querySelector("button"),this.hasAttribute("is-open")||this.setAttribute("is-open",!1),this.hasAttribute("is-maximized")||this.setAttribute("is-maximized",!1),this.hasAttribute("mode")||this.setAttribute("mode","2d"),this.button.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("change-map-mode")),this.getAttribute("mode")==="2d"?this.setAttribute("mode","3d"):this.setAttribute("mode","2d")});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/map-mode-btn.component.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){t!=e&&e!=null&&(s=="is-open"&&(t==="true"?this.classList.add("open"):this.classList.remove("open")),s=="is-maximized"&&(t==="true"?this.classList.add("maximized"):this.classList.remove("maximized")),s=="mode"&&(t==="3d"?this.classList.add("highlight"):this.classList.remove("highlight")))}}c(M,"observedAttributes",["is-open","is-maximized","mode"]);customElements.define("app-map-mode-btn",M);class P extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.button=document.createElement("button"),this.button.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <span class="icon">
                <span class="material-symbols-outlined">my_location</span>
            </span>
            `,this.shadow.append(this.button),this.hasAttribute("is-open")||this.setAttribute("is-open",!1),this.hasAttribute("is-maximized")||this.setAttribute("is-maximized",!1),this.button.addEventListener("click",()=>this.dispatchEvent(new CustomEvent("center-position")));const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/center-position-btn.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){t!=e&&e!=null&&(s=="is-open"&&(t==="true"?this.classList.add("open"):this.classList.remove("open")),s=="is-maximized"&&(t==="true"?this.classList.add("maximized"):this.classList.remove("maximized")))}}c(P,"observedAttributes",["is-open","is-maximized"]);customElements.define("app-center-position",P);const y=class y extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"}),y.snackbars.push(this)}render(){this.p.innerText=this.getAttribute("text")}connectedCallback(){const s=y.snackbars.indexOf(this);if(this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="snackbar">
                <div class="content">
                    <p></p>
                </div>
            </div>
            `,this.setAttribute("is-active","true"),this.hasAttribute("text")||this.setAttribute("text",""),this.hasAttribute("type")||this.setAttribute("type","closable"),this.snackbar=this.shadow.querySelector(".snackbar"),this.content=this.shadow.querySelector(".content"),this.p=this.shadow.querySelector("p"),this.p.innerText=this.getAttribute("text"),this.getAttribute("type")=="closable"&&(this.getAttribute("text")==""&&this.setAttribute("text","Chiudi"),this.button=document.createElement("button"),this.button.innerHTML=`
                <div class="close-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
                `,this.content.append(this.button),this.button.addEventListener("click",()=>this.setAttribute("is-active","false"))),this.getAttribute("type")=="temporary"){let t;this.hasAttribute("timeout")?t=this.getAttribute("timeout"):t=3e3,this.getAttribute("text")==""&&this.setAttribute("text","Attendere..."),this.bar=document.createElement("div"),this.bar.classList.add("bar-color"),this.bar.style.setProperty("width","100%"),this.snackbar.append(this.bar);let i=100,n=setInterval(()=>{i==0&&(clearInterval(n),this.setAttribute("is-active","false")),i--,this.bar.style.width=i+"%"},t/100)}this.getAttribute("type")=="loader"&&this.getAttribute("text")==""&&this.setAttribute("text","Caricamento...");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/snackbar.component.css"),this.shadow.append(e),this.style.setProperty("bottom",`${56+64*s}px`)}attributeChangedCallback(s,e,t){t!=e&&t!=null&&e!=null&&(s=="text"&&this.render(),s=="is-active"&&t=="false"&&this.remove())}disconnectedCallback(){const s=y.snackbars.indexOf(this);s!==-1&&(y.snackbars.splice(s,1),this.updatePosition())}updatePosition(){y.snackbars.forEach((s,e)=>{s.style.setProperty("bottom",`${56+64*e}px`)})}};c(y,"snackbars",[]),c(y,"observedAttributes",["text","is-active"]);let E=y;customElements.define("app-snackbar",E);class I extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){this.getAttribute("is-selected")=="true"?(this.chip.classList.add("selected"),this.checkbox.checked=!0):(this.chip.classList.remove("selected"),this.checkbox.checked=!1)}connectedCallback(){if(this.shadow.innerHTML=`
            <label for="chip">
                <input type="checkbox" id="chip">
                <span class="chip-title"></span>
            </label>
            `,this.chip=this.shadow.querySelector("label"),this.span=this.shadow.querySelector("span"),this.checkbox=this.shadow.querySelector("input"),this.hasAttribute("tag")){let e=this.getAttribute("tag");e=e.charAt(0).toUpperCase()+e.slice(1),this.span.innerText=e}const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/chip.css"),this.shadow.append(s),this.checkbox.addEventListener("change",e=>{const t=e.target.checked;this.setAttribute("is-selected",t+"")})}attributeChangedCallback(s,e,t){if(s=="is-selected"&&t!=e){const i=new CustomEvent("chipChanged",{detail:{name:s,newValue:t,oldValue:e,tag:this.getAttribute("tag")}});this.dispatchEvent(i),this.render()}}}c(I,"observedAttributes",["is-selected"]);customElements.define("app-chip",I);class D extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){JSON.parse(this.getAttribute("tags")).length===0?this.btn.disabled=!0:this.btn.disabled=!1}connectedCallback(){this.shadow.innerHTML=`
            <button type="submit">Submit</button>
            `,this.btn=this.shadow.querySelector("button"),this.hasAttribute("tags")||(this.btn.disabled=!0),this.btn.addEventListener("click",()=>{localStorage.setItem("selectedTags",this.getAttribute("tags")),window.location.href="/raise/#/map"});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/primary-btn.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){s=="tags"&&t!=e&&this.render()}}c(D,"observedAttributes",["tags"]);customElements.define("app-submit-tags-btn",D);class ne extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.btn=document.createElement("button"),this.btn.innerText="Select all",this.shadow.append(this.btn),this.btn.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("selectAllTags"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/secondary-btn.css"),this.shadow.append(s)}}customElements.define("app-select-all-tags-btn",ne);class oe extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.btn=document.createElement("button"),this.btn.innerText="Reset",this.shadow.append(this.btn),this.btn.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("resetTags"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/secondary-btn.css"),this.shadow.append(s)}}customElements.define("app-reset-tags-btn",oe);const ae=`/* packages/widgets/Source/shared.css */
.cesium-svgPath-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.cesium-button {
  display: inline-block;
  position: relative;
  background: #303336;
  border: 1px solid #444;
  color: #edffff;
  fill: #edffff;
  border-radius: 4px;
  padding: 5px 12px;
  margin: 2px 3px;
  cursor: pointer;
  overflow: hidden;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.cesium-button:focus {
  color: #fff;
  fill: #fff;
  border-color: #ea4;
  outline: none;
}
.cesium-button:hover {
  color: #fff;
  fill: #fff;
  background: #48b;
  border-color: #aef;
  box-shadow: 0 0 8px #fff;
}
.cesium-button:active {
  color: #000;
  fill: #000;
  background: #adf;
  border-color: #fff;
  box-shadow: 0 0 8px #fff;
}
.cesium-button:disabled,
.cesium-button-disabled,
.cesium-button-disabled:focus,
.cesium-button-disabled:hover,
.cesium-button-disabled:active {
  background: #303336;
  border-color: #444;
  color: #646464;
  fill: #646464;
  box-shadow: none;
  cursor: default;
}
.cesium-button option {
  background-color: #000;
  color: #eee;
}
.cesium-button option:disabled {
  color: #777;
}
.cesium-button input,
.cesium-button label {
  cursor: pointer;
}
.cesium-button input {
  vertical-align: sub;
}
.cesium-toolbar-button {
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  border-radius: 14%;
  padding: 0;
  vertical-align: middle;
  z-index: 0;
}
.cesium-performanceDisplay-defaultContainer {
  position: absolute;
  top: 50px;
  right: 10px;
  text-align: right;
}
.cesium-performanceDisplay {
  background-color: rgba(40, 40, 40, 0.7);
  padding: 7px;
  border-radius: 5px;
  border: 1px solid #444;
  font: bold 12px sans-serif;
}
.cesium-performanceDisplay-fps {
  color: #e52;
}
.cesium-performanceDisplay-throttled {
  color: #a42;
}
.cesium-performanceDisplay-ms {
  color: #de3;
}

/* packages/widgets/Source/Animation/Animation.css */
.cesium-animation-theme {
  visibility: hidden;
  display: block;
  position: absolute;
  z-index: -100;
}
.cesium-animation-themeNormal {
  color: #222;
}
.cesium-animation-themeHover {
  color: #4488b0;
}
.cesium-animation-themeSelect {
  color: #242;
}
.cesium-animation-themeDisabled {
  color: #333;
}
.cesium-animation-themeKnob {
  color: #222;
}
.cesium-animation-themePointer {
  color: #2e2;
}
.cesium-animation-themeSwoosh {
  color: #8ac;
}
.cesium-animation-themeSwooshHover {
  color: #aef;
}
.cesium-animation-svgText {
  fill: #edffff;
  font-family: Sans-Serif;
  font-size: 15px;
  text-anchor: middle;
}
.cesium-animation-blank {
  fill: #000;
  fill-opacity: 0.01;
  stroke: none;
}
.cesium-animation-rectButton {
  cursor: pointer;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.cesium-animation-rectButton .cesium-animation-buttonGlow {
  fill: #fff;
  stroke: none;
  display: none;
}
.cesium-animation-rectButton:hover .cesium-animation-buttonGlow {
  display: block;
}
.cesium-animation-rectButton .cesium-animation-buttonPath {
  fill: #edffff;
}
.cesium-animation-rectButton .cesium-animation-buttonMain {
  stroke: #444;
  stroke-width: 1.2;
}
.cesium-animation-rectButton:hover .cesium-animation-buttonMain {
  stroke: #aef;
}
.cesium-animation-rectButton:active .cesium-animation-buttonMain {
  fill: #abd6ff;
}
.cesium-animation-buttonDisabled {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.cesium-animation-buttonDisabled .cesium-animation-buttonMain {
  stroke: #555;
}
.cesium-animation-buttonDisabled .cesium-animation-buttonPath {
  fill: #818181;
}
.cesium-animation-buttonDisabled .cesium-animation-buttonGlow {
  display: none;
}
.cesium-animation-buttonToggled .cesium-animation-buttonGlow {
  display: block;
  fill: #2e2;
}
.cesium-animation-buttonToggled .cesium-animation-buttonMain {
  stroke: #2e2;
}
.cesium-animation-buttonToggled:hover .cesium-animation-buttonGlow {
  fill: #fff;
}
.cesium-animation-buttonToggled:hover .cesium-animation-buttonMain {
  stroke: #2e2;
}
.cesium-animation-shuttleRingG {
  cursor: pointer;
}
.cesium-animation-shuttleRingPointer {
  cursor: pointer;
}
.cesium-animation-shuttleRingPausePointer {
  cursor: pointer;
}
.cesium-animation-shuttleRingBack {
  fill: #181818;
  fill-opacity: 0.8;
  stroke: #333;
  stroke-width: 1.2;
}
.cesium-animation-shuttleRingSwoosh line {
  stroke: #8ac;
  stroke-width: 3;
  stroke-opacity: 0.2;
  stroke-linecap: round;
}
.cesium-animation-knobOuter {
  cursor: pointer;
  stroke: #444;
  stroke-width: 1.2;
}
.cesium-animation-knobInner {
  cursor: pointer;
}

/* packages/widgets/Source/BaseLayerPicker/BaseLayerPicker.css */
.cesium-baseLayerPicker-selected {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
.cesium-baseLayerPicker-dropDown {
  display: block;
  position: absolute;
  box-sizing: content-box;
  top: auto;
  right: 0;
  width: 320px;
  max-height: 500px;
  margin-top: 5px;
  background-color: rgba(38, 38, 38, 0.75);
  border: 1px solid #444;
  padding: 6px;
  overflow: auto;
  border-radius: 10px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transform: translate(0, -20%);
  visibility: hidden;
  opacity: 0;
  transition:
    visibility 0s 0.2s,
    opacity 0.2s ease-in,
    transform 0.2s ease-in;
}
.cesium-baseLayerPicker-dropDown-visible {
  transform: translate(0, 0);
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}
.cesium-baseLayerPicker-sectionTitle {
  display: block;
  font-family: sans-serif;
  font-size: 16pt;
  text-align: left;
  color: #edffff;
  margin-bottom: 4px;
}
.cesium-baseLayerPicker-choices {
  margin-bottom: 5px;
}
.cesium-baseLayerPicker-categoryTitle {
  color: #edffff;
  font-size: 11pt;
}
.cesium-baseLayerPicker-choices {
  display: block;
  border: 1px solid #888;
  border-radius: 5px;
  padding: 5px 0;
}
.cesium-baseLayerPicker-item {
  display: inline-block;
  vertical-align: top;
  margin: 2px 5px;
  width: 64px;
  text-align: center;
  cursor: pointer;
}
.cesium-baseLayerPicker-itemLabel {
  display: block;
  font-family: sans-serif;
  font-size: 8pt;
  text-align: center;
  vertical-align: middle;
  color: #edffff;
  cursor: pointer;
  word-wrap: break-word;
}
.cesium-baseLayerPicker-item:hover .cesium-baseLayerPicker-itemLabel,
.cesium-baseLayerPicker-item:focus .cesium-baseLayerPicker-itemLabel {
  text-decoration: underline;
}
.cesium-baseLayerPicker-itemIcon {
  display: inline-block;
  position: relative;
  width: inherit;
  height: auto;
  background-size: 100% 100%;
  border: solid 1px #444;
  border-radius: 9px;
  color: #edffff;
  margin: 0;
  padding: 0;
  cursor: pointer;
  box-sizing: border-box;
}
.cesium-baseLayerPicker-item:hover .cesium-baseLayerPicker-itemIcon {
  border-color: #fff;
  box-shadow: 0 0 8px #fff, 0 0 8px #fff;
}
.cesium-baseLayerPicker-selectedItem .cesium-baseLayerPicker-itemLabel {
  color: rgb(189, 236, 248);
}
.cesium-baseLayerPicker-selectedItem .cesium-baseLayerPicker-itemIcon {
  border: double 4px rgb(189, 236, 248);
}

/* packages/engine/Source/Widget/CesiumWidget.css */
.cesium-widget {
  font-family: sans-serif;
  font-size: 16px;
  overflow: hidden;
  display: block;
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.cesium-widget,
.cesium-widget canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
}
.cesium-widget-credits {
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  color: #fff;
  font-size: 10px;
  text-shadow: 0px 0px 2px #000000;
  padding-right: 5px;
}
.cesium-widget-credits a,
.cesium-widget-credits a:visited {
  color: #fff;
}
.cesium-widget-errorPanel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99999;
}
.cesium-widget-errorPanel:before {
  display: inline-block;
  vertical-align: middle;
  height: 100%;
  content: "";
}
.cesium-widget-errorPanel-content {
  width: 75%;
  max-width: 500px;
  display: inline-block;
  text-align: left;
  vertical-align: middle;
  border: 1px solid #510c00;
  border-radius: 7px;
  background-color: #f0d9d5;
  font-size: 14px;
  color: #510c00;
}
.cesium-widget-errorPanel-content.expanded {
  max-width: 75%;
}
.cesium-widget-errorPanel-header {
  font-size: 18px;
  font-family:
    "Open Sans",
    Verdana,
    Geneva,
    sans-serif;
  background: #d69d93;
  border-bottom: 2px solid #510c00;
  padding-bottom: 10px;
  border-radius: 3px 3px 0 0;
  padding: 15px;
}
.cesium-widget-errorPanel-scroll {
  overflow: auto;
  font-family:
    "Open Sans",
    Verdana,
    Geneva,
    sans-serif;
  white-space: pre-wrap;
  padding: 0 15px;
  margin: 10px 0 20px 0;
}
.cesium-widget-errorPanel-buttonPanel {
  padding: 0 15px;
  margin: 10px 0 20px 0;
  text-align: right;
}
.cesium-widget-errorPanel-buttonPanel button {
  border-color: #510c00;
  background: #d69d93;
  color: #202020;
  margin: 0;
}
.cesium-widget-errorPanel-buttonPanel button:focus {
  border-color: #510c00;
  background: #f0d9d5;
  color: #510c00;
}
.cesium-widget-errorPanel-buttonPanel button:hover {
  border-color: #510c00;
  background: #f0d9d5;
  color: #510c00;
}
.cesium-widget-errorPanel-buttonPanel button:active {
  border-color: #510c00;
  background: #b17b72;
  color: #510c00;
}
.cesium-widget-errorPanel-more-details {
  text-decoration: underline;
  cursor: pointer;
}
.cesium-widget-errorPanel-more-details:hover {
  color: #2b0700;
}

/* packages/widgets/Source/CesiumInspector/CesiumInspector.css */
.cesium-cesiumInspector {
  border-radius: 5px;
  transition: width ease-in-out 0.25s;
  background: rgba(48, 51, 54, 0.8);
  border: 1px solid #444;
  color: #edffff;
  display: inline-block;
  position: relative;
  padding: 4px 12px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  overflow: hidden;
}
.cesium-cesiumInspector-button {
  text-align: center;
  font-size: 11pt;
}
.cesium-cesiumInspector-visible .cesium-cesiumInspector-button {
  border-bottom: 1px solid #aaa;
  padding-bottom: 3px;
}
.cesium-cesiumInspector input:enabled,
.cesium-cesiumInspector-button {
  cursor: pointer;
}
.cesium-cesiumInspector-visible {
  width: 185px;
  height: auto;
}
.cesium-cesiumInspector-hidden {
  width: 122px;
  height: 17px;
}
.cesium-cesiumInspector-sectionContent {
  max-height: 600px;
}
.cesium-cesiumInspector-section-collapsed .cesium-cesiumInspector-sectionContent {
  max-height: 0;
  padding: 0 !important;
  overflow: hidden;
}
.cesium-cesiumInspector-dropDown {
  margin: 5px 0;
  font-family: sans-serif;
  font-size: 10pt;
  width: 185px;
}
.cesium-cesiumInspector-frustumStatistics {
  padding-left: 10px;
  padding: 5px;
  background-color: rgba(80, 80, 80, 0.75);
}
.cesium-cesiumInspector-pickButton {
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid #444;
  color: #edffff;
  border-radius: 5px;
  padding: 3px 7px;
  cursor: pointer;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  margin: 0 auto;
}
.cesium-cesiumInspector-pickButton:focus {
  outline: none;
}
.cesium-cesiumInspector-pickButton:active,
.cesium-cesiumInspector-pickButtonHighlight {
  color: #000;
  background: #adf;
  border-color: #fff;
  box-shadow: 0 0 8px #fff;
}
.cesium-cesiumInspector-center {
  text-align: center;
}
.cesium-cesiumInspector-sectionHeader {
  font-weight: bold;
  font-size: 10pt;
  margin: 0;
  cursor: pointer;
}
.cesium-cesiumInspector-pickSection {
  border: 1px solid #aaa;
  border-radius: 5px;
  padding: 3px;
  margin-bottom: 5px;
}
.cesium-cesiumInspector-sectionContent {
  margin-bottom: 10px;
  transition: max-height 0.25s;
}
.cesium-cesiumInspector-tileText {
  padding-bottom: 10px;
  border-bottom: 1px solid #aaa;
}
.cesium-cesiumInspector-relativeText {
  padding-top: 10px;
}
.cesium-cesiumInspector-sectionHeader::before {
  margin-right: 5px;
  content: "-";
  width: 1ch;
  display: inline-block;
}
.cesium-cesiumInspector-section-collapsed .cesium-cesiumInspector-sectionHeader::before {
  content: "+";
}

/* packages/widgets/Source/Cesium3DTilesInspector/Cesium3DTilesInspector.css */
ul.cesium-cesiumInspector-statistics {
  margin: 0;
  padding-top: 3px;
  padding-bottom: 3px;
}
ul.cesium-cesiumInspector-statistics + ul.cesium-cesiumInspector-statistics {
  border-top: 1px solid #aaa;
}
.cesium-cesiumInspector-slider {
  margin-top: 5px;
}
.cesium-cesiumInspector-slider input[type=number] {
  text-align: left;
  background-color: #222;
  outline: none;
  border: 1px solid #444;
  color: #edffff;
  width: 100px;
  border-radius: 3px;
  padding: 1px;
  margin-left: 10px;
  cursor: auto;
}
.cesium-cesiumInspector-slider input[type=number]::-webkit-outer-spin-button,
.cesium-cesiumInspector-slider input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.cesium-cesiumInspector-slider input[type=range] {
  margin-left: 5px;
  vertical-align: middle;
}
.cesium-cesiumInspector-hide .cesium-cesiumInspector-styleEditor {
  display: none;
}
.cesium-cesiumInspector-styleEditor {
  padding: 10px;
  border-radius: 5px;
  background: rgba(48, 51, 54, 0.8);
  border: 1px solid #444;
}
.cesium-cesiumInspector-styleEditor textarea {
  width: 100%;
  height: 300px;
  background: transparent;
  color: #edffff;
  border: none;
  padding: 0;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
}
.cesium-3DTilesInspector {
  width: 300px;
  pointer-events: all;
}
.cesium-3DTilesInspector-statistics {
  font-size: 11px;
}
.cesium-3DTilesInspector-disabledElementsInfo {
  margin: 5px 0 0 0;
  padding: 0 0 0 20px;
  color: #eed202;
}
.cesium-3DTilesInspector div,
.cesium-3DTilesInspector input[type=range] {
  width: 100%;
  box-sizing: border-box;
}
.cesium-cesiumInspector-error {
  color: #ff9e9e;
  overflow: auto;
}
.cesium-3DTilesInspector .cesium-cesiumInspector-section {
  margin-top: 3px;
}
.cesium-3DTilesInspector .cesium-cesiumInspector-sectionHeader + .cesium-cesiumInspector-show {
  border-top: 1px solid white;
}
input.cesium-cesiumInspector-url {
  overflow: hidden;
  white-space: nowrap;
  overflow-x: scroll;
  background-color: transparent;
  color: white;
  outline: none;
  border: none;
  height: 1em;
  width: 100%;
}
.cesium-cesiumInspector .field-group {
  display: table;
}
.cesium-cesiumInspector .field-group > label {
  display: table-cell;
  font-weight: bold;
}
.cesium-cesiumInspector .field-group > .field {
  display: table-cell;
  width: 100%;
}

/* packages/widgets/Source/VoxelInspector/VoxelInspector.css */
.cesium-VoxelInspector {
  width: 300px;
  pointer-events: all;
}
.cesium-VoxelInspector div,
.cesium-VoxelInspector input[type=range] {
  width: 100%;
  box-sizing: border-box;
}
.cesium-VoxelInspector .cesium-cesiumInspector-section {
  margin-top: 3px;
}
.cesium-VoxelInspector .cesium-cesiumInspector-sectionHeader + .cesium-cesiumInspector-show {
  border-top: 1px solid white;
}

/* packages/widgets/Source/FullscreenButton/FullscreenButton.css */
.cesium-button.cesium-fullscreenButton {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 0;
}

/* packages/widgets/Source/VRButton/VRButton.css */
.cesium-button.cesium-vrButton {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 0;
}

/* packages/widgets/Source/Geocoder/Geocoder.css */
.cesium-viewer-geocoderContainer .cesium-geocoder-input {
  border: solid 1px #444;
  background-color: rgba(40, 40, 40, 0.7);
  color: white;
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 32px;
  margin: 0;
  padding: 0 32px 0 0;
  border-radius: 0;
  box-sizing: border-box;
  transition: width ease-in-out 0.25s, background-color 0.2s ease-in-out;
  -webkit-appearance: none;
}
.cesium-viewer-geocoderContainer:hover .cesium-geocoder-input {
  border-color: #aef;
  box-shadow: 0 0 8px #fff;
}
.cesium-viewer-geocoderContainer .cesium-geocoder-input:focus {
  border-color: #ea4;
  background-color: rgba(15, 15, 15, 0.9);
  box-shadow: none;
  outline: none;
}
.cesium-viewer-geocoderContainer:hover .cesium-geocoder-input,
.cesium-viewer-geocoderContainer .cesium-geocoder-input:focus,
.cesium-viewer-geocoderContainer .cesium-geocoder-input-wide {
  padding-left: 4px;
  width: 250px;
}
.cesium-viewer-geocoderContainer .search-results {
  position: absolute;
  background-color: #000;
  color: #eee;
  overflow-y: auto;
  opacity: 0.8;
  width: 100%;
}
.cesium-viewer-geocoderContainer .search-results ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.cesium-viewer-geocoderContainer .search-results ul li {
  font-size: 14px;
  padding: 3px 10px;
}
.cesium-viewer-geocoderContainer .search-results ul li:hover {
  cursor: pointer;
}
.cesium-viewer-geocoderContainer .search-results ul li.active {
  background: #48b;
}
.cesium-geocoder-searchButton {
  background-color: #303336;
  display: inline-block;
  position: absolute;
  cursor: pointer;
  width: 32px;
  top: 1px;
  right: 1px;
  height: 30px;
  vertical-align: middle;
  fill: #edffff;
}
.cesium-geocoder-searchButton:hover {
  background-color: #48b;
}

/* packages/widgets/Source/InfoBox/InfoBox.css */
.cesium-infoBox {
  display: block;
  position: absolute;
  top: 50px;
  right: 0;
  width: 40%;
  max-width: 480px;
  background: rgba(38, 38, 38, 0.95);
  color: #edffff;
  border: 1px solid #444;
  border-right: none;
  border-top-left-radius: 7px;
  border-bottom-left-radius: 7px;
  box-shadow: 0 0 10px 1px #000;
  transform: translate(100%, 0);
  visibility: hidden;
  opacity: 0;
  transition:
    visibility 0s 0.2s,
    opacity 0.2s ease-in,
    transform 0.2s ease-in;
}
.cesium-infoBox-visible {
  transform: translate(0, 0);
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}
.cesium-infoBox-title {
  display: block;
  height: 20px;
  padding: 5px 30px 5px 25px;
  background: rgba(84, 84, 84, 1);
  border-top-left-radius: 7px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: content-box;
}
.cesium-infoBox-bodyless .cesium-infoBox-title {
  border-bottom-left-radius: 7px;
}
button.cesium-infoBox-camera {
  display: block;
  position: absolute;
  top: 4px;
  left: 4px;
  width: 22px;
  height: 22px;
  background: transparent;
  border-color: transparent;
  border-radius: 3px;
  padding: 0 5px;
  margin: 0;
}
button.cesium-infoBox-close {
  display: block;
  position: absolute;
  top: 5px;
  right: 5px;
  height: 20px;
  background: transparent;
  border: none;
  border-radius: 2px;
  font-weight: bold;
  font-size: 16px;
  padding: 0 5px;
  margin: 0;
  color: #edffff;
}
button.cesium-infoBox-close:focus {
  background: rgba(238, 136, 0, 0.44);
  outline: none;
}
button.cesium-infoBox-close:hover {
  background: #888;
  color: #000;
}
button.cesium-infoBox-close:active {
  background: #a00;
  color: #000;
}
.cesium-infoBox-bodyless .cesium-infoBox-iframe {
  display: none;
}
.cesium-infoBox-iframe {
  border: none;
  width: 100%;
  width: calc(100% - 2px);
}

/* packages/widgets/Source/SceneModePicker/SceneModePicker.css */
span.cesium-sceneModePicker-wrapper {
  display: inline-block;
  position: relative;
  margin: 0 3px;
}
.cesium-sceneModePicker-visible {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.25s linear;
}
.cesium-sceneModePicker-hidden {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.25s, opacity 0.25s linear;
}
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-none {
  display: none;
}
.cesium-sceneModePicker-slide-svg {
  transition: left 2s;
  top: 0;
  left: 0;
}
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-dropDown-icon {
  box-sizing: border-box;
  padding: 0;
  margin: 3px 0;
}
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-button3D,
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-buttonColumbusView,
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-button2D {
  margin: 0 0 3px 0;
}
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-button3D .cesium-sceneModePicker-icon2D {
  left: 100%;
}
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-button3D .cesium-sceneModePicker-iconColumbusView {
  left: 200%;
}
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-buttonColumbusView .cesium-sceneModePicker-icon3D {
  left: -200%;
}
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-buttonColumbusView .cesium-sceneModePicker-icon2D {
  left: -100%;
}
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-button2D .cesium-sceneModePicker-icon3D {
  left: -100%;
}
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-button2D .cesium-sceneModePicker-iconColumbusView {
  left: 100%;
}
.cesium-sceneModePicker-wrapper .cesium-sceneModePicker-selected {
  border-color: #2e2;
  box-shadow: 0 0 8px #fff, 0 0 8px #fff;
}

/* packages/widgets/Source/ProjectionPicker/ProjectionPicker.css */
span.cesium-projectionPicker-wrapper {
  display: inline-block;
  position: relative;
  margin: 0 3px;
}
.cesium-projectionPicker-visible {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.25s linear;
}
.cesium-projectionPicker-hidden {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.25s, opacity 0.25s linear;
}
.cesium-projectionPicker-wrapper .cesium-projectionPicker-none {
  display: none;
}
.cesium-projectionPicker-wrapper .cesium-projectionPicker-dropDown-icon {
  box-sizing: border-box;
  padding: 0;
  margin: 3px 0;
}
.cesium-projectionPicker-wrapper .cesium-projectionPicker-buttonPerspective,
.cesium-projectionPicker-wrapper .cesium-projectionPicker-buttonOrthographic {
  margin: 0 0 3px 0;
}
.cesium-projectionPicker-wrapper .cesium-projectionPicker-buttonPerspective .cesium-projectionPicker-iconOrthographic {
  left: 100%;
}
.cesium-projectionPicker-wrapper .cesium-projectionPicker-buttonOrthographic .cesium-projectionPicker-iconPerspective {
  left: -100%;
}
.cesium-projectionPicker-wrapper .cesium-projectionPicker-selected {
  border-color: #2e2;
  box-shadow: 0 0 8px #fff, 0 0 8px #fff;
}

/* packages/widgets/Source/PerformanceWatchdog/PerformanceWatchdog.css */
.cesium-performance-watchdog-message-area {
  position: relative;
  background-color: yellow;
  color: black;
  padding: 10px;
}
.cesium-performance-watchdog-message {
  margin-right: 30px;
}
.cesium-performance-watchdog-message-dismiss {
  position: absolute;
  right: 0;
  margin: 0 10px 0 0;
}

/* packages/widgets/Source/NavigationHelpButton/NavigationHelpButton.css */
.cesium-navigationHelpButton-wrapper {
  position: relative;
  display: inline-block;
}
.cesium-navigation-help {
  visibility: hidden;
  position: absolute;
  top: 38px;
  right: 2px;
  width: 250px;
  border-radius: 10px;
  transform: scale(0.01);
  transform-origin: 234px -10px;
  transition: visibility 0s 0.25s, transform 0.25s ease-in;
}
.cesium-navigation-help-visible {
  visibility: visible;
  transform: scale(1);
  transition: transform 0.25s ease-out;
}
.cesium-navigation-help-instructions {
  border: 1px solid #444;
  background-color: rgba(38, 38, 38, 0.75);
  padding-bottom: 5px;
  border-radius: 0 0 10px 10px;
}
.cesium-click-navigation-help {
  display: none;
}
.cesium-touch-navigation-help {
  display: none;
  padding-top: 5px;
}
.cesium-click-navigation-help-visible {
  display: block;
}
.cesium-touch-navigation-help-visible {
  display: block;
}
.cesium-navigation-help-pan {
  color: #66ccff;
  font-weight: bold;
}
.cesium-navigation-help-zoom {
  color: #65fd00;
  font-weight: bold;
}
.cesium-navigation-help-rotate {
  color: #ffd800;
  font-weight: bold;
}
.cesium-navigation-help-tilt {
  color: #d800d8;
  font-weight: bold;
}
.cesium-navigation-help-details {
  color: #ffffff;
}
.cesium-navigation-button {
  color: #fff;
  background-color: transparent;
  border-bottom: none;
  border-top: 1px solid #444;
  border-right: 1px solid #444;
  margin: 0;
  width: 50%;
  cursor: pointer;
}
.cesium-navigation-button-icon {
  vertical-align: middle;
  padding: 5px 1px;
}
.cesium-navigation-button:focus {
  outline: none;
}
.cesium-navigation-button-left {
  border-radius: 10px 0 0 0;
  border-left: 1px solid #444;
}
.cesium-navigation-button-right {
  border-radius: 0 10px 0 0;
  border-left: none;
}
.cesium-navigation-button-selected {
  background-color: rgba(38, 38, 38, 0.75);
}
.cesium-navigation-button-unselected {
  background-color: rgba(0, 0, 0, 0.75);
}
.cesium-navigation-button-unselected:hover {
  background-color: rgba(76, 76, 76, 0.75);
}

/* packages/widgets/Source/SelectionIndicator/SelectionIndicator.css */
.cesium-selection-wrapper {
  position: absolute;
  width: 160px;
  height: 160px;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.2s, opacity 0.2s ease-in;
}
.cesium-selection-wrapper-visible {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s ease-out;
}
.cesium-selection-wrapper svg {
  fill: #2e2;
  stroke: #000;
  stroke-width: 1.1px;
}

/* packages/widgets/Source/Timeline/Timeline.css */
.cesium-timeline-main {
  position: relative;
  left: 0;
  bottom: 0;
  overflow: hidden;
  border: solid 1px #888;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.cesium-timeline-trackContainer {
  width: 100%;
  overflow: auto;
  border-top: solid 1px #888;
  position: relative;
  top: 0;
  left: 0;
}
.cesium-timeline-tracks {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.cesium-timeline-needle {
  position: absolute;
  left: 0;
  top: 1.7em;
  bottom: 0;
  width: 1px;
  background: #f00;
}
.cesium-timeline-bar {
  position: relative;
  left: 0;
  top: 0;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  height: 1.7em;
  background: linear-gradient(to bottom, rgba(116, 117, 119, 0.8) 0%, rgba(58, 68, 82, 0.8) 11%, rgba(46, 50, 56, 0.8) 46%, rgba(53, 53, 53, 0.8) 81%, rgba(53, 53, 53, 0.8) 100%);
}
.cesium-timeline-ruler {
  visibility: hidden;
  white-space: nowrap;
  font-size: 80%;
  z-index: -200;
}
.cesium-timeline-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  background: #08f;
}
.cesium-timeline-ticLabel {
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  font-size: 80%;
  color: #eee;
}
.cesium-timeline-ticMain {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 1px;
  height: 50%;
  background: #eee;
}
.cesium-timeline-ticSub {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 1px;
  height: 33%;
  background: #aaa;
}
.cesium-timeline-ticTiny {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 1px;
  height: 25%;
  background: #888;
}
.cesium-timeline-icon16 {
  display: block;
  position: absolute;
  width: 16px;
  height: 16px;
  background-image: url(data:text/plain;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAYAAAB3AH1ZAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sIDBITKIVzLEMAAAKNSURBVEjHxdXNSxRhHAfw7zzrqhuoWJnSkrippUVSEKsHI9BTUYdAJA/RoYMREV26rAdn6tAfUARi16hQqkOBQRgUEYFWEC3OwczMjdZd92VmdWfmeelgTjO7q7gb0VzmmZnn85vvPPPMM8B/3qTcE2PPpuTZKB1eWuUQACgXYACYwVFbCTTVeZXB/i55o4LFelcAZfStYD4vpAoPGAGo4GBcQEgSOAUMQyAezwK6iQfDPXnhS/FkHZ+/8VLMWxxqWkfH3gbMRNOYi2roavbja0zHQmoFPYf8ED4Ko4aivm9MOG/u9I8mwrafeK7a/tVrNc/bARYN5noadeq7q0342vXw9CIMU6BmW8rVP9cPBPe52uu+v3O/y9sB4gkTWs6Qsk0mj5ExXMelejvA8WafYmkmGPHanTijdtvif8rx5RiCjdWKs2Cp3jWRDl96KhrbqlBeJqBOLyLQXg0IgbkZDS0dO8EZxZfPSTA9jvDDK3mT0OmP1FXh3XwEEAKdTX5MRWLgjCK4pwH3xt/YnjgLHAv4lHTCAKMMu/wV+KZGob6PoKyMQ0+sgBpZVJZn0NterxQaVqef/DRn+/EXYds/mZx2eVeAW9d65dhCEsaKCb7K8HH0gqTevyh9GDkn0VULRiaLzJKGBu9swfdaiie5RVo9ESURN8E8BE0n7ggACJy8KzghSCzp6DmwWxkaCm24EBXr8wI8Hrkq06QBiRC0t24HALS11IBTCyJl4vb1AXmzpbVYTwoVOXN0h7L8Mwtm8bXPybIQ/5FCX3dA2cr6XowvGCA02CvztAnz9+JiZk1AMxG6fEreSoBiPNmoyNnuWiWVzAIAtISO08E6pZi/3N96AIDn4E3h3P8L/wshP+txtEs4JAAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
}

/* packages/widgets/Source/Viewer/Viewer.css */
.cesium-viewer {
  font-family: sans-serif;
  font-size: 16px;
  overflow: hidden;
  display: block;
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.cesium-viewer-cesiumWidgetContainer {
  width: 100%;
  height: 100%;
}
.cesium-viewer-bottom {
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  padding-right: 5px;
}
.cesium-viewer .cesium-widget-credits {
  display: inline;
  position: static;
  bottom: auto;
  left: auto;
  padding-right: 0;
  color: #ffffff;
  font-size: 10px;
  text-shadow: 0 0 2px #000000;
}
.cesium-viewer-timelineContainer {
  position: absolute;
  bottom: 0;
  left: 169px;
  right: 29px;
  height: 27px;
  padding: 0;
  margin: 0;
  overflow: hidden;
  font-size: 14px;
}
.cesium-viewer-animationContainer {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 0;
  width: 169px;
  height: 112px;
}
.cesium-viewer-fullscreenContainer {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0;
  width: 29px;
  height: 29px;
  overflow: hidden;
}
.cesium-viewer-vrContainer {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0;
  width: 29px;
  height: 29px;
  overflow: hidden;
}
.cesium-viewer-toolbar {
  display: block;
  position: absolute;
  top: 5px;
  right: 5px;
}
.cesium-viewer-cesiumInspectorContainer {
  display: block;
  position: absolute;
  top: 50px;
  right: 10px;
}
.cesium-viewer-geocoderContainer {
  position: relative;
  display: inline-block;
  margin: 0 3px;
}
.cesium-viewer-cesium3DTilesInspectorContainer {
  display: block;
  position: absolute;
  top: 50px;
  right: 10px;
  max-height: calc(100% - 120px);
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}
.cesium-viewer-voxelInspectorContainer {
  display: block;
  position: absolute;
  top: 50px;
  right: 10px;
  max-height: calc(100% - 120px);
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}

/* packages/widgets/Source/widgets.css */
`;class re extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"}),this.transitioner=null}connectedCallback(){Cesium.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MjY2YmYxNy1mNTM2LTRlOWYtYTUyZC01ZmY0NjBhNzllMWEiLCJpZCI6MTY5MDU3LCJpYXQiOjE2OTU4ODQ4NzB9.bN66rOR5h37xuKVsuUSYRSLOGJy-34IhH9S1hr4NOOE",this.viewer=new Cesium.Viewer(this.shadow,{baseLayerPicker:!1,geocoder:!1,timeline:!1,animation:!1,homeButton:!1,navigationInstructionsInitiallyVisible:!1,navigationHelpButton:!1,sceneModePicker:!1,fullscreenButton:!1,infoBox:!1,sceneMode:Cesium.SceneMode.SCENE2D,mapMode2D:Cesium.MapMode2D.ROTATE,mapProjection:new Cesium.WebMercatorProjection}),this.viewer.screenSpaceEventHandler.setInputAction(t=>{this.dispatchEvent(new CustomEvent("map-click",{detail:{movement:t}}))},Cesium.ScreenSpaceEventType.LEFT_CLICK),this.viewer.screenSpaceEventHandler.setInputAction(t=>{this.mouseOver(t)},Cesium.ScreenSpaceEventType.MOUSE_MOVE),h.instance.subscribe("customroute-load",t=>{this.loadCustomDataSource(t,"custom-route","#be0f3a")}),h.instance.subscribe("feature-selected",t=>{const i=p.instance.createGeoJson([t]);this.loadCustomDataSource(i,"selected-feature","#01fdc0")}),h.instance.subscribe("customroutecard-click",t=>{const i=p.instance.createGeoJson([t]);this.loadCustomDataSource(i,"selected-feature","#01fdc0")});const s=document.createElement("style");s.innerHTML=ae,this.shadow.append(s);const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/cesium.css"),this.shadow.append(e)}getEntity(s){const e=s.position;return this.viewer.scene.pick(e)}setCameraToPosition(s){let e=this.viewer.camera.positionCartographic;e.height>2e6?e.height=2e3:e.height;const t=Cesium.Cartesian3.fromDegrees(s.longitude,s.latitude,e.height);this.viewer.camera.flyTo({destination:t,orientation:{heading:Cesium.Math.toRadians(0),pitch:Cesium.Math.toRadians(-90),roll:0},duration:.5})}checkUserPin(s){const e=this.viewer.entities.getById("user-pin");e?this.updateUserPin(e,s):this.createUserPin(s)}createUserPin(s){this.viewer.entities.add({name:"user_pin",id:"user-pin",position:Cesium.Cartesian3.fromDegrees(s.longitude,s.latitude,0),point:{pixelSize:8,color:Cesium.Color.BLUE,outlineColor:Cesium.Color.WHITE,outlineWidth:1}})}updateUserPin(s,e){s.position=Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude,0)}mouseOver(s){const e=s.endPosition,t=this.viewer.scene.pick(e);Cesium.defined(t)&&Cesium.defined(t.id)?document.body.style.cursor="pointer":document.body.style.cursor="default"}changeMapMode(){let s=this.viewer.scene.mode;s===Cesium.SceneMode.SCENE3D?this.viewer.scene.morphTo2D(0):s===Cesium.SceneMode.SCENE2D&&this.viewer.scene.morphTo3D(0)}changeTheme(s){for(let e=0;e<=2;e++)e===s?this.viewer.imageryLayers.get(e).show=!0:this.viewer.imageryLayers.get(e).show=!1}getImageryProvider(s,e,t){return new Cesium.WebMapTileServiceImageryProvider({url:s,layer:e,style:"default",format:"image/jpeg",maximumLevel:19,tileMatrixSetID:"default",credit:new Cesium.Credit(t)})}loadImageryProviders(s){s.forEach(e=>{const t=this.getImageryProvider(e.url,e.layer,e.credit);this.viewer.imageryLayers.addImageryProvider(t)})}async loadLayers(s){const e=s.map(t=>this.createlayer(t).then(i=>({layer:t,data:i})));await Promise.all(e).then(async t=>{this.viewer.dataSources._dataSources.map(n=>n.name).forEach(n=>{n!=="custom-route"&&this.viewer.dataSources.getByName(n).forEach(l=>this.viewer.dataSources.remove(l))}),await Promise.all(t.map(async n=>{const o=await n.data.layer;o.name=n.layer.layer,this.viewer.dataSources.add(o),this.styleEntities(o,n.layer.style)}))})}async createlayer(s){const e=`${s.layer_url_wfs}?service=WFS&typeName=${s.layer}&outputFormat=application/json&request=GetFeature&srsname=EPSG:4326`;return fetch(e).then(t=>t.json()).then(t=>this.createAdditionalProperties(t,s)).then(t=>({features:t.features,layer:Cesium.GeoJsonDataSource.load(t)})).catch(t=>{throw console.error(t),t})}createAdditionalProperties(s,e){return s.features=s.features.map((t,i)=>(t.properties.raiseName=e.name+" "+i,t.properties.layerName=e.layer,t)),s}async loadCustomDataSource(s,e,t){this.viewer.dataSources.getByName(e).forEach(o=>{this.viewer.dataSources.remove(o)});let n=await Cesium.GeoJsonDataSource.load(s);n.name=e,await this.viewer.dataSources.add(n),this.styleCustomDataSource(n,t)}styleCustomDataSource(s,e){s.entities.values.forEach(t=>{t.billboard=void 0,t.point=new Cesium.PointGraphics({pixelSize:16,color:Cesium.Color.fromCssColorString(e).withAlpha(.01),outlineColor:Cesium.Color.fromCssColorString(e),outlineWidth:3})})}styleEntities(s,e){let t="YELLOW",i="YELLOW",n=.5;e&&e.color&&(t=e.color.toUpperCase(),i=e.color.toUpperCase()),e&&e.opacity&&(n=e.opacity),s.entities.values.forEach(o=>{switch(!0){case Cesium.defined(o.polyline):o.polyline.material=Cesium.Color.fromCssColorString(t).withAlpha(parseFloat(n)),o.polyline.width=2;break;case Cesium.defined(o.billboard):o.billboard=void 0,o.point=new Cesium.PointGraphics({pixelSize:8,color:Cesium.Color.fromCssColorString(i).withAlpha(.5),outlineColor:Cesium.Color.fromCssColorString(i),outlineWidth:1});break;case Cesium.defined(o.polygon):o.polygon.material=Cesium.Color.fromCssColorString(t).withAlpha(parseFloat(n)),o.polygon.outlineColor=Cesium.Color.fromCssColorString(t).withAlpha(parseFloat(n));break}})}}customElements.define("app-cesium",re);class q extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){switch(this.getAttribute("active-tab")){case"suggested-route":this.suggestedRouteContent.classList.add("active"),this.customRouteContent.classList.remove("active"),this.infoContent.classList.remove("active"),this.tabs.forEach(e=>{e.id==="suggested-route-tab"?e.classList.add("active-tab"):e.classList.remove("active-tab")});break;case"custom-route":this.suggestedRouteContent.classList.remove("active"),this.customRouteContent.classList.add("active"),this.infoContent.classList.remove("active"),this.tabs.forEach(e=>{e.id==="custom-route-tab"?e.classList.add("active-tab"):e.classList.remove("active-tab")});break;default:this.suggestedRouteContent.classList.remove("active"),this.customRouteContent.classList.remove("active"),this.infoContent.classList.add("active"),this.tabs.forEach(e=>{e.id==="info-tab"?e.classList.add("active-tab"):e.classList.remove("active-tab")});break}}connectedCallback(){this.shadow.innerHTML=`
            <div class="toggle">
                <div class="close"></div>
            </div>
            <div class="controller">
                <ul class="tabs">
                    <li class="tab" id="info-tab">Informazioni</li>
                    <li class="tab" id="suggested-route-tab">Percorsi suggeriti</li>
                    <li class="tab" id="custom-route-tab">Percorso custom</li>
                </ul>
            </div>
            <div class="contents">
                <div class="content info-content"><app-tab-info></app-tab-info></div>
                <div class="content suggested-route-content"></div>
                <div class="content custom-route-content"><app-tab-custom-route></app-tab-custom-route></div>
            </div>
            `,this.hasAttribute("is-open")||this.setAttribute("is-open",!1),this.hasAttribute("is-maximized")||this.setAttribute("is-maximized",!1),this.isOpen=JSON.parse(this.getAttribute("is-open")),this.isMaximized=JSON.parse(this.getAttribute("is-maximized")),this.toggle=this.shadow.querySelector(".toggle"),this.tabs=this.shadow.querySelectorAll(".tab"),this.infoTab=this.shadow.querySelector("#info-tab"),this.suggestedRouteTab=this.shadow.querySelector("#suggested-route-tab"),this.customRouteTab=this.shadow.querySelector("#custom-route-tab"),this.infoContent=this.shadow.querySelector(".info-content"),this.infoComponent=this.shadow.querySelector("app-tab-info"),this.suggestedRouteContent=this.shadow.querySelector(".suggested-route-content"),this.customRouteContent=this.shadow.querySelector(".custom-route-content"),this.customRouteComponent=this.shadow.querySelector("app-tab-custom-route"),this.infoTab.addEventListener("click",()=>this.setAttribute("active-tab","info")),this.suggestedRouteTab.addEventListener("click",()=>this.setAttribute("active-tab","suggested-route")),this.customRouteTab.addEventListener("click",()=>this.setAttribute("active-tab","custom-route")),this.toggle.addEventListener("click",()=>this.setAttribute("is-open",!this.isOpen)),this.infoList=this.shadow.querySelector("app-tab-info"),h.instance.subscribe("addtocustomroutebtn-click",i=>{this.setAttribute("active-tab","custom-route")}),h.instance.subscribe("customroutecard-click",i=>{this.infoList.feature=i,this.setAttribute("active-tab","info"),this.setAttribute("is-maximized",!1)}),this.toggle.addEventListener("wheel",i=>{i.deltaY>0?this.setAttribute("is-maximized",!0):this.setAttribute("is-maximized",!1)});let s,e=25;this.toggle.addEventListener("touchstart",i=>{s=i.touches[0].clientY}),this.toggle.addEventListener("touchmove",i=>{let n=i.touches[0].clientY,o=n-s;Math.abs(o)>e&&(o>0?(console.log("verso basso"),this.getAttribute("is-maximized")=="false"?this.setAttribute("is-open",!1):this.setAttribute("is-maximized",!1)):(console.log("verso alto"),this.setAttribute("is-maximized",!0)),s=n)}),this.infoContent.addEventListener("wheel",i=>{i.deltaY>0&&this.setAttribute("is-maximized",!0)}),this.customRouteComponent.addEventListener("wheel",i=>{i.deltaY>0&&this.setAttribute("is-maximized",!0)});const t=document.createElement("link");t.setAttribute("rel","stylesheet"),t.setAttribute("href","./css/tab.controller.component.css"),this.shadow.append(t),this.hasAttribute("active-tab")||this.setAttribute("active-tab","info")}attributeChangedCallback(s,e,t){t!=e&&(s=="active-tab"&&this.render(),s=="is-open"&&(this.isOpen=JSON.parse(t),this.isOpen==!0?this.classList.add("visible"):(this.classList.remove("visible"),this.setAttribute("is-maximized",this.isOpen)),this.dispatchEvent(new CustomEvent("tabs-toggle",{detail:{isOpen:this.isOpen}}))),s=="is-maximized"&&(this.isMaximized=JSON.parse(t),this.isMaximized==!0?this.classList.add("maximized"):this.classList.remove("maximized"),h.instance.publish("tab-maximize",this.isMaximized)))}addFeature(s){this.infoList.feature=s}}c(q,"observedAttributes",["is-open","active-tab","is-maximized"]);customElements.define("app-tabs",q);class ce extends HTMLElement{constructor(){super();c(this,"_feature");this.shadow=this.attachShadow({mode:"closed"}),this.colorManager=new w}get feature(){return this._feature}set feature(e){this._feature=e,this.render()}render(){this.legend.innerHTML="",this.name.innerHTML="",this.category.innerHTML="";const e=this.feature.properties;let t=!1;for(const n in e)if(e.hasOwnProperty(n)){const o=e[n];n=="raiseName"&&(this.name.innerHTML=e.raiseName),o.display_name=="Nome"&&(this.category.innerHTML=o.value,t=!0),t||(this.category.innerHTML=e.raiseName)}if(this.colorManager.hex=this.feature.layer.style.color,this.colorManager.rgba=this.colorManager.convertHexToRgba(this.colorManager.hex),this.legend.style.backgroundColor=this.colorManager.changeOpacity(this.colorManager.rgba,.25),this.legend.style.borderColor=this.colorManager.rgba,this.legend.style.borderWidth="2px",this.legend.style.borderStyle="solid",this.info.feature=this.feature,this.feature.coordinatesArray.length>1){this.tools.style.display="none";return}else this.tools.style.display="flex";const i={};i.longitude=this.feature.startingCoordinates.longitude,i.latitude=this.feature.startingCoordinates.latitude,this.goToBtn.coordinates=i}connectedCallback(){this.shadow.innerHTML=`
            <div class="component">
                <div class="header">
                    <div class="title">
                        <span class="legend"></span>
                        <h4 class="name"></h4>
                    </div>
                    <p class="category"></p>
                </div>
                <div class="tools" style="display:none;">
                    <app-goto></app-goto>
                    <app-add-to-route></app-add-to-route>
                </div>
                <app-info-panel style="display:none;"></app-info-panel>
            </div>
            `,this.component=this.shadow.querySelector(".component"),this.header=this.shadow.querySelector(".header"),this.legend=this.shadow.querySelector(".legend"),this.name=this.shadow.querySelector(".name"),this.category=this.shadow.querySelector(".category"),this.tools=this.shadow.querySelector(".tools"),this.goToBtn=this.shadow.querySelector("app-goto"),this.addToRouteBtn=this.shadow.querySelector("app-add-to-route"),this.info=this.shadow.querySelector("app-info-panel"),this.goToBtn.addEventListener("go-to",t=>this.goTo(t.detail.coordinates)),this.addToRouteBtn.addEventListener("add-route",()=>{h.instance.publish("addtocustomroutebtn-click",this.feature)});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/tab.info.component.css"),this.shadow.append(e)}goTo(e){const t=`https://www.google.com/maps/dir/?api=1&destination=${e.latitude},${e.longitude}`;window.open(t,"_blank")}}customElements.define("app-tab-info",ce);class f{constructor(){c(this,"_instance");if(f._instance)return f._instance;f._instance=this}static get instance(){return f._instance||(f._instance=new f),f._instance}calculateDistance(s,e){const t=s.longitude-e.longitude,i=s.latitude-e.latitude;return Math.sqrt(t*t+i*i)}nearestInsertion(s,e){const t=[...s];let i=0,n=this.calculateDistance(e,t[0].startingCoordinates);for(let l=1;l<t.length;l++){const a=this.calculateDistance(e,t[l].startingCoordinates);a<n&&(n=a,i=l)}const o=[t.splice(i,1)[0]];for(;t.length>0;){n=Number.MAX_VALUE;let l;for(let a=0;a<t.length;a++){const u=this.calculateDistance(o[o.length-1].startingCoordinates,t[a].startingCoordinates);u<n&&(n=u,l=a)}o.push(t.splice(l,1)[0])}return o}}class le extends HTMLElement{constructor(){super();c(this,"_route");c(this,"_features");this.shadow=this.attachShadow({mode:"closed"}),this.features=[],this.shadow.innerHTML=`
            <div class="route-title"><h4 class="title">Percorso selezionato: <span class="route-name"></span></h4></div>
            <div class="list"></div>
            <div class="tools">
                <button type="button" class="sort">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z"/></svg>
                </button>
                <button type="button" class="edit">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/></svg>
                </button>
                <button type="button" class="new">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                </button>
                <button type="button" class="save">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>
                </button>
                <button type="button" class="manage">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/></svg>
                </button>
            </div>
            <app-sort-route-dialog></app-sort-route-dialog>
            <app-edit-route-dialog></app-edit-route-dialog>
            <app-new-route-dialog></app-new-route-dialog>
            <app-save-route-dialog></app-save-route-dialog>
            <app-manage-routes-dialog></app-manage-routes-dialog>
            `,this.routeTitle=this.shadow.querySelector(".route-name"),this.list=this.shadow.querySelector(".list"),this.sortBtn=this.shadow.querySelector(".sort"),this.sortDialog=this.shadow.querySelector("app-sort-route-dialog"),this.editBtn=this.shadow.querySelector(".edit"),this.editDialog=this.shadow.querySelector("app-edit-route-dialog"),this.newBtn=this.shadow.querySelector(".new"),this.newDialog=this.shadow.querySelector("app-new-route-dialog"),this.saveBtn=this.shadow.querySelector(".save"),this.saveDialog=this.shadow.querySelector("app-save-route-dialog"),this.manageBtn=this.shadow.querySelector(".manage"),this.manageDialog=this.shadow.querySelector("app-manage-routes-dialog");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/tab.customroute.component.css"),this.shadow.append(e)}get features(){return this._features}set features(e){this._features=e}get route(){return this._route}set route(e){this._route=e}connectedCallback(){d.instance.getData().routes&&d.instance.getData().routes.forEach(t=>{t.lastSelected===!0&&(this.route=t,this.render())}),this.route.type==="default"&&(this.editBtn.disabled=!0),h.instance.subscribe("addtocustomroutebtn-click",e=>{if(!this.checkFeature(e))this.createCard(e);else{let i=this.features.findIndex(o=>o.id===e.id);this.removeCard(i),this.createCard(e);let n=document.createElement("app-snackbar");n.setAttribute("type","temporary"),n.setAttribute("text","Tappa già presente nel percorso"),document.body.append(n)}this.resetOrder()}),this.sortBtn.addEventListener("click",async()=>{let e;try{e=await b.instance.getPosition(),this.sortDialog.route=this.route,this.sortDialog.openDialog()}catch(t){console.error("Impossibile recuperare la posizione",t),h.instance.publish("no-position-found")}}),this.sortDialog.addEventListener("sort-route",async()=>{const e=await b.instance.getPosition(),t={longitude:e.coords.longitude,latitude:e.coords.latitude},i=f.instance.nearestInsertion(this.features,t);this.list.innerHTML="",i.reverse(),this._features=[],this.route.features=[],this.route.features=[...i],i.forEach(n=>this.createCard(n)),this.resetOrder()}),this.editBtn.addEventListener("click",()=>{this.editDialog.route=this.route,this.editDialog.openDialog()}),this.editDialog.addEventListener("edit-name",e=>{let t=d.instance.getData().routes,i;for(let n=0;n<t.length;n++)t[n].name===e.detail.oldName&&(t[n].name=e.detail.newName,i=t[n]);this.route=i,localStorage.setItem("routes",JSON.stringify(t)),console.log("Percorsi salvati",d.instance.getData().routes),this.render()}),this.editDialog.addEventListener("delete-route",e=>{let t=d.instance.getData().routes,i=[];i=t.filter(o=>o.name!==e.detail.name);let n;i.forEach(o=>{o.type==="default"&&(o.lastSelected=!0,n=o)}),localStorage.setItem("routes",JSON.stringify(i)),console.log("Percorsi salvati",d.instance.getData().routes),this.route=n,this.render()}),this.newBtn.addEventListener("click",()=>{this.newDialog.routes=d.instance.getData().routes,this.newDialog.openDialog()}),this.newDialog.addEventListener("create-route",e=>{let t=new k(e.detail.name,[],"user-route",!0),i=d.instance.getData().routes;i.push(t);for(let n=0;n<i.length;n++)i[n].name!==t.name&&(i[n].lastSelected=!1);this.route=t,localStorage.setItem("routes",JSON.stringify(i)),console.log("Percorsi salvati",d.instance.getData().routes),this.render()}),this.saveBtn.addEventListener("click",()=>{this.saveDialog.route=this.route,this.saveDialog.openDialog()}),this.saveDialog.addEventListener("save-route",()=>{this.route.features=this.features.reverse();let e=d.instance.getData().routes;for(let i=0;i<e.length;i++)e[i].name===this.route.name&&(e[i]=this.route);localStorage.setItem("routes",JSON.stringify(e)),console.log("Percorso salvato",d.instance.getData().routes);let t=document.createElement("app-snackbar");t.setAttribute("type","closable"),t.setAttribute("text","Percorso salvato con successo"),document.body.append(t)}),this.manageBtn.addEventListener("click",()=>{this.manageDialog.routes=d.instance.getData().routes,this.manageDialog.openDialog()}),this.manageDialog.addEventListener("load-route",e=>{let t=d.instance.getData().routes,i=e.detail.route;for(let n=0;n<t.length;n++)t[n].lastSelected=!1,t[n].name===i.name&&(t[n].lastSelected=!0,this.route=t[n]);localStorage.setItem("routes",JSON.stringify(t)),console.log("Percorso caricato",d.instance.getData().routes),this.render()})}checkFeature(e){return this.features.some(i=>i.id===e.id)}createCard(e){let t=document.createElement("app-tab-custom-route-card");t.feature=e,this.features.unshift(e),this.list.prepend(t),this.scrollLeft=0,t.addEventListener("remove-card",()=>{let i=this.features.findIndex(n=>n.id===e.id);this.removeCard(i),this.resetOrder()}),t.addEventListener("increase-order",()=>{let i=this._features.findIndex(l=>l.id===e.id),n=i-1,o=this.list.querySelectorAll("app-tab-custom-route-card");o[n]&&(this._features.splice(i,1),this._features.splice(n,0,e),this.list.insertBefore(o[i],o[n]),this.resetOrder(),console.log("Features",this._features))}),t.addEventListener("decrease-order",()=>{let i=this._features.findIndex(l=>l.id===e.id),n=i+1,o=this.list.querySelectorAll("app-tab-custom-route-card");o[n]&&(this._features.splice(i,1),this._features.splice(n,0,e),o[n].insertAdjacentElement("afterend",o[i]),this.resetOrder(),console.log("Features",this._features))})}removeCard(e){this.list.querySelectorAll("app-tab-custom-route-card")[e].remove(),this.features.splice(e,1)}resetOrder(){this.cards=this.list.querySelectorAll("app-tab-custom-route-card");let e=1;this.cards.forEach(i=>{i.setAttribute("order",e),e++});let t=p.instance.createGeoJson(this.features);h.instance.publish("customroute-load",t)}render(){this.list.innerHTML="",this._features=[],this.routeTitle.innerHTML=this.route.name,this.route.features.length>0&&this.route.features.forEach(e=>{this.createCard(e)}),this.resetOrder(),this.route.type==="default"?this.editBtn.disabled=!0:this.editBtn.disabled=!1}}customElements.define("app-tab-custom-route",le);class H extends HTMLElement{constructor(){super();c(this,"_feature");c(this,"_order");this.shadow=this.attachShadow({mode:"closed"}),this.colorManager=new w}get feature(){return this._feature}set feature(e){this._feature=e}get order(){return this._order}set order(e){this._order=e}render(){this.num.innerHTML=this.order}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="component">
                <div class="change-order">
                    <div class="up-arrow icon">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/></svg>     
                    </div>
                    <div class="number"></div>
                    <div class="down-arrow icon">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
                    </div>
                </div>
                <div class="info">
                    <div class="title">
                        <span class="legend"></span>
                        <h4 class="name"></h4>
                    </div>
                    <p class="category"></p>
                </div>
                <div class="remove icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </div>
            </div>
            `,this.wrapper=this.shadow.querySelector(".component"),this.upArrow=this.shadow.querySelector(".up-arrow"),this.downArrow=this.shadow.querySelector(".down-arrow"),this.num=this.shadow.querySelector(".number"),this.legend=this.shadow.querySelector(".legend"),this.name=this.shadow.querySelector(".name"),this.category=this.shadow.querySelector(".category"),this.close=this.shadow.querySelector(".remove"),this.downArrow.addEventListener("click",t=>{t.stopImmediatePropagation(),this.dispatchEvent(new CustomEvent("decrease-order"))}),this.upArrow.addEventListener("click",t=>{t.stopImmediatePropagation(),this.dispatchEvent(new CustomEvent("increase-order"))}),this.name.innerHTML=this.feature.properties.raiseName,this.category.innerHTML=this.feature.layer.name,this.colorManager.hex=this.feature.layer.style.color,this.colorManager.rgba=this.colorManager.convertHexToRgba(this.colorManager.hex),this.legend.style.backgroundColor=this.colorManager.changeOpacity(this.colorManager.rgba,.25),this.legend.style.borderColor=this.colorManager.rgba,this.legend.style.borderWidth="2px",this.legend.style.borderStyle="solid",this.wrapper.addEventListener("click",t=>{h.instance.publish("customroutecard-click",this.feature)}),this.close.addEventListener("click",t=>{t.stopPropagation(),this.dispatchEvent(new CustomEvent("remove-card"))});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/tab.customroute.card.component.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){i!=t&&e=="order"&&(this.order=i,this.render())}}c(H,"observedAttributes",["order"]);customElements.define("app-tab-custom-route-card",H);class B extends HTMLElement{constructor(){super();c(this,"_feature");this.shadow=this.attachShadow({mode:"closed"}),this.colorManager=new w}get feature(){return this._feature}set feature(e){this._feature=e,this.render()}render(){this.category.innerText="",this.name.innerText="",this.content.innerHTML="";const e=this.feature.properties;e.nome?this.category.innerText=e.nome:this.category.innerText=e.raiseName,this.name.innerHTML=e.raiseName;for(const t in e)if(e.hasOwnProperty(t)){const i=e[t];if(t=="raiseName"||t=="nome")continue;const n=document.createElement("div");n.classList.add("argument");const o=document.createElement("h4"),l=t.replace(/([A-Z])/g," $1"),a=l.charAt(0).toUpperCase()+l.slice(1);o.innerHTML=a,n.append(o);const u=document.createElement("p");u.innerText=i,n.append(u),this.content.append(n)}this.colorManager.hex=this.feature.layer.style.color,this.colorManager.rgba=this.colorManager.convertHexToRgba(this.colorManager.hex),this.legend.style.backgroundColor=this.colorManager.changeOpacity(this.colorManager.rgba,.25),this.legend.style.borderColor=this.colorManager.rgba,this.legend.style.borderWidth="2px",this.legend.style.borderStyle="solid",this.playBtn.addEventListener("read-info",()=>{const t=new SpeechSynthesisUtterance;t.lang="it";const i=this.shadow.querySelector(".content").innerHTML;t.text=i,window.speechSynthesis.speak(t)})}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="component">
                <div class="close-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
                <div class="info">
                    <div class="header">
                        <div class="title">
                            <span class="legend"></span>
                            <h4 class="name"></h4>
                        </div>
                        <p class="category"></p>
                    </div>
                    <div class="tools">
                        <app-play-info-btn></app-play-info-btn>
                    </div>
                </div>
                <div class="content"></div>
            </div>
            `,this.setAttribute("is-open",!1),this.close=this.shadow.querySelector(".close-icon"),this.info=this.shadow.querySelector(".info"),this.legend=this.shadow.querySelector(".legend"),this.name=this.shadow.querySelector(".name"),this.category=this.shadow.querySelector(".category"),this.tools=this.shadow.querySelector(".tools"),this.content=this.shadow.querySelector(".content"),this.playBtn=this.shadow.querySelector("app-play-info-btn"),document.addEventListener("expand-info",t=>{this.setAttribute("is-open",!0),this.feature=t.detail.feature}),this.close.addEventListener("click",()=>this.setAttribute("is-open",!1));const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/info.drawer.component.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){i!=t&&t!=null&&e=="is-open"&&(i=="true"?this.openDrawer():this.closeDrawer())}openDrawer(){this.classList.remove("close"),this.classList.add("open")}closeDrawer(){this.classList.remove("open"),this.classList.add("close")}}c(B,"observedAttributes",["is-open"]);customElements.define("app-info",B);class _ extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="icon">
                <span class="material-symbols-outlined">layers</span>
            </span>
            `,this.shadow.append(this.button),this.setAttribute("is-open","false");let s=this.getAttribute("is-open");this.btn=this.shadow.querySelector("button");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/bench.toggle.component.css"),this.shadow.append(e),this.btn.addEventListener("click",()=>{s=this.getAttribute("is-open")==="true",this.setAttribute("is-open",!s+"")})}attributeChangedCallback(s,e,t){if(t!=e&&s=="is-open"){const i=new CustomEvent("bench-toggle",{detail:{isOpen:t}});this.dispatchEvent(i)}}}c(_,"observedAttributes",["is-open"]);customElements.define("app-bench-toggle",_);class z extends HTMLElement{constructor(){super();c(this,"_feature");c(this,"_isOpen");this.shadow=this.attachShadow({mode:"closed"}),this._isOpen=!1}get feature(){return this._feature}set feature(e){this._feature=e,this.render()}get isOpen(){return this._isOpen}set isOpen(e){this._isOpen=e}render(){this.content.innerHTML="";const e=this.feature.properties;let t=[];for(const i in e)if(e.hasOwnProperty(i)){const n=e[i];if(i=="raiseName"||i=="layerName")continue;if(n.value){const o=document.createElement("div");o.classList.add("topic");const l=document.createElement("h4");l.innerHTML=n.display_name,o.append(l);const a=document.createElement("p");a.innerText=n.value,o.append(a),this.content.append(o),t.push(i)}}if(t.length===0){this.style.display="none";return}else this.style.display="block";this.playBtn.addEventListener("read-info",()=>{const i=new SpeechSynthesisUtterance;i.lang="it";const n=this.shadow.querySelector(".content").innerHTML;i.text=n,window.speechSynthesis.speak(i)})}connectedCallback(){this.shadow.innerHTML=`
            <button>Leggi info</button>
            <div class="info">
                <app-play-info-btn></app-play-info-btn>
                <div class="content"></div>
            </div>
            `,this.setAttribute("is-open",this.isOpen),this.button=this.shadow.querySelector("button"),this.info=this.shadow.querySelector(".info"),this.playBtn=this.shadow.querySelector("app-play-info-btn"),this.content=this.shadow.querySelector(".content"),this.button.addEventListener("click",()=>{const t=JSON.parse(this.getAttribute("is-open"));this.setAttribute("is-open",!t+"")}),h.instance.subscribe("tab-maximize",t=>{this.setAttribute("is-open",t+"")});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/tab.info.panel.component.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){i!=t&&t!=null&&e=="is-open"&&(this.isOpen=JSON.parse(i),this.isOpen==!0?this.classList.add("open"):this.classList.remove("open"),this.isOpen==!0?this.button.innerHTML="Mostra meno":this.button.innerHTML="Leggi info",h.instance.publish("tab-maximize",this.isOpen))}}c(z,"observedAttributes",["is-open"]);customElements.define("app-info-panel",z);class de extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <div class="component">
                <img src="./images/RAISE_pictogram_nobg.svg">
                <div class="loader"></div>
            </div>
            `;const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/splash.component.css"),this.shadow.append(s)}}customElements.define("app-splash",de);class O extends HTMLElement{constructor(){super();c(this,"_route");this.shadow=this.attachShadow({mode:"closed"}),this.shadow.innerHTML=`
            <dialog>
                <div class="content">
                    <input type="text" placeholder="Nome percorso">
                    <div class="buttons">
                        <button class="close" type="button">Annulla</button>
                        <button class="submit" type="submit">Salva</button>
                    </div>
                    <div class="other-actions">
                        <button class="delete" type="button">Elimina percorso</button>
                    </div>
                </div>
            </dialog>
            `,this.dialog=this.shadow.querySelector("dialog"),this.input=this.shadow.querySelector("input"),this.closeBtn=this.shadow.querySelector(".close"),this.saveBtn=this.shadow.querySelector(".submit"),this.deleteBtn=this.shadow.querySelector(".delete");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/dialog.edit-route.component.css"),this.shadow.append(e)}get route(){return this._route}set route(e){this._route=e,this.render()}render(){this.input.value=this.route.name,this.input.value.length===0?this.saveBtn.disabled=!0:this.saveBtn.disabled=!1}connectedCallback(){this.input.addEventListener("input",()=>{this.setAttribute("value",this.input.value)}),this.closeBtn.addEventListener("click",()=>{this.closeDialog()}),this.saveBtn.addEventListener("click",()=>{this.closeDialog(),this.dispatchEvent(new CustomEvent("edit-name",{detail:{oldName:this.route.name,newName:this.input.value}}))}),this.deleteBtn.addEventListener("click",()=>{this.closeDialog(),this.dispatchEvent(new CustomEvent("delete-route",{detail:{name:this.route.name}}))})}attributeChangedCallback(e,t,i){i!=t&&e=="value"&&(i.length==0?this.saveBtn.disabled=!0:this.saveBtn.disabled=!1)}openDialog(){this.dialog.showModal?this.dialog.showModal():this.dialog.setAttribute("open","")}closeDialog(){this.dialog.close?this.dialog.close():this.dialog.removeAttribute("open")}}c(O,"observedAttributes",["value"]);customElements.define("app-edit-route-dialog",O);class he extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"}),this.shadow.innerHTML=`
            <dialog>
                <div class="content">
                    <div class="message">
                        <p>Sicuro di voler eliminare tutte le tappe?</p>
                        <p>Questo non eliminerà il percorso salvato in memoria.</p>
                    </div>
                    <div class="buttons">
                        <button class="cancel" type="button">Annulla</button>
                        <button class="delete" type="submit">Elimina</button>
                    </div>
                </div>
            </dialog>
            `,this.dialog=this.shadow.querySelector("dialog"),this.closeBtn=this.shadow.querySelector(".cancel"),this.deleteBtn=this.shadow.querySelector(".delete");const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/dialog.empty-route.component.css"),this.shadow.append(s)}connectedCallback(){this.closeBtn.addEventListener("click",()=>this.closeDialog()),this.deleteBtn.addEventListener("click",()=>{this.closeDialog(),this.dispatchEvent(new CustomEvent("empty-route"))})}openDialog(){this.dialog.showModal?this.dialog.showModal():this.dialog.setAttribute("open","")}closeDialog(){this.dialog.close?this.dialog.close():this.dialog.removeAttribute("open")}}customElements.define("app-empty-route",he);class ue extends HTMLElement{constructor(){super();c(this,"_route");this.shadow=this.attachShadow({mode:"closed"}),this.shadow.innerHTML=`
            <dialog>
                <div class="content">
                    <div class="message">
                        <h3 class="title">Salva</h3>
                        <p>Questa sovrascriverà i dati relativi al percorso <span class="route-name"></span>. Procedere?</p>
                    </div>
                    <div class="buttons">
                        <button class="cancel" type="button">Annulla</button>
                        <button class="save" type="submit">Salva</button>
                    </div>
                </div>
            </dialog>
            `,this.dialog=this.shadow.querySelector("dialog"),this.routeName=this.shadow.querySelector(".route-name"),this.closeBtn=this.shadow.querySelector(".cancel"),this.saveBtn=this.shadow.querySelector(".save");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/dialog.save-route.component.css"),this.shadow.append(e)}get route(){return this._route}set route(e){this._route=e,this.render()}render(){this.routeName.innerHTML=this.route.name}connectedCallback(){this.closeBtn.addEventListener("click",()=>this.closeDialog()),this.saveBtn.addEventListener("click",()=>{this.closeDialog(),this.dispatchEvent(new CustomEvent("save-route"))})}openDialog(){this.dialog.showModal?this.dialog.showModal():this.dialog.setAttribute("open","")}closeDialog(){this.dialog.close?this.dialog.close():this.dialog.removeAttribute("open")}}customElements.define("app-save-route-dialog",ue);class pe extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"}),this.shadow.innerHTML=`
            <dialog>
                <div class="content">
                    <div class="message">
                        <h3 class="title">Riordina</h3>
                        <p>Riordinare i punti di interesse del percorso <span class="route-name"></span>?</p>
                    </div>
                    <div class="buttons">
                        <button class="cancel" type="button">Annulla</button>
                        <button class="sort" type="submit">Riordina</button>
                    </div>
                </div>
            </dialog>
            `,this.dialog=this.shadow.querySelector("dialog"),this.routeName=this.shadow.querySelector(".route-name"),this.closeBtn=this.shadow.querySelector(".cancel"),this.sortBtn=this.shadow.querySelector(".sort");const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/dialog.sort-route.component.css"),this.shadow.append(s)}get route(){return this._route}set route(s){this._route=s,this.render()}render(){this.routeName.innerHTML=this.route.name}connectedCallback(){this.closeBtn.addEventListener("click",()=>this.closeDialog()),this.sortBtn.addEventListener("click",()=>{this.closeDialog(),this.dispatchEvent(new CustomEvent("sort-route"))})}openDialog(){this.dialog.showModal?this.dialog.showModal():this.dialog.setAttribute("open","")}closeDialog(){this.dialog.close?this.dialog.close():this.dialog.removeAttribute("open")}}customElements.define("app-sort-route-dialog",pe);class R extends HTMLElement{constructor(){super();c(this,"_routes");this.shadow=this.attachShadow({mode:"closed"}),this.shadow.innerHTML=`
            <dialog>
                <div class="content">
                    <div class="message">
                        <h3 class="title">Nuovo percorso</h3>
                        <p>Scegliere il nome per il nuovo percorso.</p>
                        <input type="text" placeholder="Nome percorso">
                        <span class="validation">Esiste già un percorso con questo nome</span>
                        <p>Attenzione: questa azione eliminerà i dati non salvati sul percorso attualmente selezionato.</p>
                    </div>
                    <div class="buttons">
                        <button class="cancel" type="button">Annulla</button>
                        <button class="save" type="submit">Salva</button>
                    </div>
                </div>
            </dialog>
            `,this.hasAttribute("is-name-available")||this.setAttribute("is-name-available",!0),this.dialog=this.shadow.querySelector("dialog"),this.input=this.shadow.querySelector("input"),this.validation=this.shadow.querySelector(".validation"),this.closeBtn=this.shadow.querySelector(".cancel"),this.saveBtn=this.shadow.querySelector(".save"),this.saveBtn.disabled=!0;const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/dialog.new-route.component.css"),this.shadow.append(e)}get routes(){return this._routes}set routes(e){this._routes=e}render(){this.input.value.length===0?this.saveBtn.disabled=!0:this.saveBtn.disabled=!1}connectedCallback(){this.input.addEventListener("input",()=>{if(this.input.value.length===0)this.saveBtn.disabled=!0;else{this.setAttribute("is-name-available",!0),this.routes.forEach(t=>{if(t.name.toLowerCase()===this.input.value.toLowerCase()){this.setAttribute("is-name-available",!1);return}});let e=JSON.parse(this.getAttribute("is-name-available"));this.saveBtn.disabled=!e}}),this.closeBtn.addEventListener("click",()=>this.closeDialog()),this.saveBtn.addEventListener("click",()=>{this.closeDialog(),this.dispatchEvent(new CustomEvent("create-route",{detail:{name:this.input.value}})),this.input.value=""})}attributeChangedCallback(e,t,i){i!=t&&e=="is-name-available"&&(i=="false"?this.validation.classList.add("not-available"):this.validation.classList.remove("not-available"))}openDialog(){this.dialog.showModal?(this.dialog.showModal(),this.render()):this.dialog.setAttribute("open","")}closeDialog(){this.dialog.close?this.dialog.close():this.dialog.removeAttribute("open")}}c(R,"observedAttributes",["is-name-available"]);customElements.define("app-new-route-dialog",R);class me extends HTMLElement{constructor(){super();c(this,"_routes");this.shadow=this.attachShadow({mode:"closed"}),this.shadow.innerHTML=`
            <dialog>
                <div class="content">                
                    <div class="message">
                        <h3 class="title">Carica</h3>
                    </div>
                    <form>
                        <div class="list"></div>
                        <div class="buttons">
                            <button class="cancel" type="button">Annulla</button>
                            <button class="load" type="submit" disabled>Carica</button>
                        </div>
                    </form>
                </div>
            </dialog>
            `,this.dialog=this.shadow.querySelector("dialog"),this.form=this.shadow.querySelector("form"),this.list=this.shadow.querySelector(".list"),this.cancelBtn=this.shadow.querySelector(".cancel"),this.loadBtn=this.shadow.querySelector(".load");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/dialog.manage-route.component.css"),this.shadow.append(e)}get routes(){return this._routes}set routes(e){this._routes=e,this.render()}render(){this.list.innerHTML="",this.routes.forEach(t=>{let i=document.createElement("div");i.classList.add("selection"),i.innerHTML=`
                <input type="radio" id="${t.name}" name="route" value="${t.name}">
                <label for="${t.name}">${t.name}</label>
                `,this.list.append(i)});let e=this.shadow.querySelectorAll('input[type="radio"]');e.forEach(t=>{t.addEventListener("change",()=>{let i=Array.from(e).some(n=>n.checked);this.loadBtn.disabled=!i})})}connectedCallback(){this.loadBtn.disabled=!0,this.form.addEventListener("submit",e=>{e.preventDefault(),this.closeDialog(),this.loadBtn.disabled=!0;let t=this.shadow.querySelector('input[name="route"]:checked').value;this._routes.forEach(i=>{if(i.name==t){this.dispatchEvent(new CustomEvent("load-route",{detail:{route:i}}));return}})}),this.cancelBtn.addEventListener("click",()=>this.closeDialog())}openDialog(){this.dialog.showModal?this.dialog.showModal():this.dialog.setAttribute("open","")}closeDialog(){this.dialog.close?(this.dialog.close(),this.loadBtn.disabled=!0):this.dialog.removeAttribute("open")}}customElements.define("app-manage-routes-dialog",me);class be extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <dialog>
                <div class="content">
                    <div class="message">
                        <h3 class="title">Posizione non trovata</h3>
                        <p>Per utilizzare questa funzione l'applicazione necessita di avere accesso alla posizione del dispositivo.</p>
                        <p>Attivare la geolocalizzazione e ricaricare l'applicazione per utilizzare la funzione.</p>
                    </div>
                    <div class="buttons">
                        <button class="close" type="button">Va bene</button>
                    </div>
                </div>
            </dialog>
            `,this.dialog=this.shadow.querySelector("dialog"),this.closeBtn=this.shadow.querySelector(".close"),this.closeBtn.addEventListener("click",()=>this.closeDialog());const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/dialog.no-position-error.component.css"),this.shadow.append(s)}openDialog(){this.dialog.showModal?this.dialog.showModal():this.dialog.setAttribute("open","")}closeDialog(){this.dialog.close?this.dialog.close():this.dialog.removeAttribute("open")}}customElements.define("app-no-position-dialog",be);let ge=()=>"<page-map></page-map>",fe=()=>"<page-tags></page-tags>";const ye=document.querySelector("app-router"),ve={index:{routingFunction:fe,type:"default"},map:{routingFunction:ge,type:"map"}};ye.addRoutes(ve);
