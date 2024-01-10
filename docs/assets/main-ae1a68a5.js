var Le=Object.defineProperty;var Ae=(o,s,e)=>s in o?Le(o,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[s]=e;var c=(o,s,e)=>(Ae(o,typeof s!="symbol"?s+"":s,e),e);(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&t(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();let xe=class{constructor(){const s=document.querySelector("map-component");Cesium.Ion.defaultAccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MjY2YmYxNy1mNTM2LTRlOWYtYTUyZC01ZmY0NjBhNzllMWEiLCJpZCI6MTY5MDU3LCJpYXQiOjE2OTU4ODQ4NzB9.bN66rOR5h37xuKVsuUSYRSLOGJy-34IhH9S1hr4NOOE",this.viewer=new Cesium.Viewer(s,{baseLayerPicker:!1,geocoder:!1,timeline:!1,animation:!1,homeButton:!1,navigationInstructionsInitiallyVisible:!1,navigationHelpButton:!1,sceneModePicker:!1,fullscreenButton:!1,infoBox:!1})}changeTheme(s){const e=this.viewer.imageryLayers._layers[1];if(this.viewer.imageryLayers.remove(e),Object.keys(s).length!=0){const t=this.getImageryProvider(s.url,s.layer,s.credit);this.viewer.imageryLayers.addImageryProvider(t)}}async fetchThemes(s){return await fetch(s).then(t=>t.json())}getImageryProvider(s,e,t){return new Cesium.WebMapTileServiceImageryProvider({url:s,layer:e,style:"default",format:"image/jpeg",maximumLevel:19,tileMatrixSetID:"default",credit:new Cesium.Credit(t)})}getFeatureCoordinates(s){if(Array.isArray(s.geometry.coordinates)){let e={};switch(s.geometry.coordinates.length){case 1:e.longitude=s.geometry.coordinates[0][0],e.latitude=s.geometry.coordinates[0][1];break;default:e.longitude=s.geometry.coordinates[0],e.latitude=s.geometry.coordinates[1];break}return e}}onClick(s,e){const t=s.position,i=this.viewer.scene.pick(t);if(!i||i==null)return;if(Array.isArray(i.id)){this.viewer.zoomTo(i.id);return}const n=this.getLayerToFind(i.id),a=this.filterLayerByName(e,n);let r,l;i.primitive._position&&(r=i.primitive._position,l=this.cartesianToCartographic(r));const d=i.id.properties,h=a.relevant_properties,m=a.name,y=this.getRelevantProperties(d,h,m);let b={};return b.properties=y,b.layer=a,l&&(b.coordinates=l),b}getLayerToFind(s){if(s==null)return;let e;switch(!0){case s.id.includes("."):e=s.id.split(".")[0];break;case s.id.includes("/"):e=s.id.split("/")[0];break}return e}cartesianToCartographic(s){const e=Cesium.Cartographic.fromCartesian(s);let t=Cesium.Math.toDegrees(e.longitude),i=Cesium.Math.toDegrees(e.latitude);return t=parseFloat(t.toFixed(8)),i=parseFloat(i.toFixed(8)),{longitude:t,latitude:i}}mouseOver(s){const e=s.endPosition,t=this.viewer.scene.pick(e);Cesium.defined(t)&&Cesium.defined(t.id)?document.body.style.cursor="pointer":document.body.style.cursor="default"}createInfobox(s,e,t,i){let n=!1;if(e.forEach(a=>{a.getAttribute("data")===JSON.stringify(t)&&(n=!0)}),!n&&t){const a=document.createElement("app-infobox");a.setAttribute("data",JSON.stringify(t)),s++,a.setAttribute("uuid",s),i.append(a)}}filterLayerByName(s,e){for(const t in s){const i=s[t];if(Array.isArray(i)||typeof i=="object"){const n=this.filterLayerByName(i,e);if(n)return n}else if(typeof i=="string"&&i.includes(e))return s}return null}getRelevantProperties(s,e,t){const i={};if(e){for(const n of e)n.property_name&&s[n.property_name]&&(s[n.property_name]._value?i[n.display_name]=s[n.property_name]._value:i[n.display_name]=s[n.property_name]);return i.Title=t,i}return i}startNavigation(s){const e=this.convertCoordinates(s),t=`https://www.google.com/maps/dir/?api=1&destination=${e.latitude},${e.longitude}`;window.open(t,"_blank")}convertCoordinates(s){const e=this.viewer.scene.pickPosition(s),t=Cesium.Cartographic.fromCartesian(e),i=Cesium.Math.toDegrees(t.longitude),n=Cesium.Math.toDegrees(t.latitude);return{longitude:i,latitude:n}}goto(s){const e=`https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`;window.open(e,"_blank")}async handleCheckbox(s,e){const t=s.map(i=>this.fetchLayerData(i).then(n=>({layer:i,data:n})));await Promise.all(t).then(async i=>{this.viewer.dataSources.removeAll(),await Promise.all(i.map(async r=>{const l=await r.data.layer;this.viewer.dataSources.add(l),await this.styleEntities(l,r.layer.style)}));const n=this.combineDataSource(),a=await this.clusterAllEntities(e,n);this.viewer.dataSources.add(a)})}async checkLayerToRemove(s,e){s.forEach(t=>{const i=e.findIndex(n=>n.layer===t.layer);i!==-1&&e.splice(i,1)})}async fetchLayerData(s){const e=`${s.layer_url_wfs}?service=WFS&typeName=${s.layer}&outputFormat=application/json&request=GetFeature&srsname=EPSG:4326`;return fetch(e).then(t=>t.json()).then(t=>({features:t.features,layer:Cesium.GeoJsonDataSource.load(t)})).catch(t=>{throw console.error(t),t})}async styleEntities(s,e){let t="YELLOW",i="YELLOW",n=.5;e&&e.color&&(t=e.color.toUpperCase(),i=e.color.toUpperCase()),e&&e.opacity&&(n=e.opacity),s.entities.values.forEach(a=>{switch(!0){case Cesium.defined(a.polyline):a.polyline.material=Cesium.Color[t].withAlpha(parseFloat(n)),a.polyline.width=2;break;case Cesium.defined(a.billboard):a.billboard=void 0,a.point=new Cesium.PointGraphics({pixelSize:18,color:Cesium.Color[i].withAlpha(parseFloat(n)),outlineColor:Cesium.Color.WHITE,outlineWidth:2});break;case Cesium.defined(a.polygon):a.polygon.material=Cesium.Color[t].withAlpha(parseFloat(n)),a.polygon.outlineColor=Cesium.Color[t].withAlpha(parseFloat(n));break}})}combineDataSource(){const s=this.viewer.dataSources,e=new Cesium.CustomDataSource;for(let i=0;i<s.length;i++)s.get(i).entities.values.forEach(n=>{e.entities.add(n)});const t=s.indexOf(e);for(let i=s.length-1;i>=0;i--)i!==t&&s.remove(s.get(i));return e}async clusterAllEntities(s,e){const t="WHITE";e.clustering.enabled=!0,e.clustering.pixelRange=25,e.clustering.minimumClusterSize=2;const i=s[0],n=s[1],a=s[2];return e.clustering.clusterEvent.addEventListener(async(r,l)=>{l.label.show=!1,l.billboard.show=!0,l.billboard.color=Cesium.Color.fromCssColorString(t),l.billboard.scale=.38,l.billboard.id=l.label.id;let d=[];switch(l.billboard.id.forEach(h=>{d.push(h.point.color.getValue()),d.length>4&&d.shift()}),!0){case r.length>=4:const h=this.styleClusterIcon(a,d),m=this.createClusterIconUrl(h);l.billboard.image=m;break;case r.length==3:const y=this.styleClusterIcon(n,d),b=this.createClusterIconUrl(y);l.billboard.image=b;break;case r.length==2:const x=this.styleClusterIcon(i,d),ke=this.createClusterIconUrl(x);l.billboard.image=ke;break}}),e}styleClusterIcon(s,e){let t=[];e.forEach(a=>{let r=Math.floor(a.red*255),l=Math.floor(a.green*255),d=Math.floor(a.blue*255),h={red:r,green:l,blue:d};t.push(h)});let i=0;const n=s.querySelectorAll("circle");if(n.length==4)n.forEach(a=>a.setAttribute("fill","#1E233A"));else for(let a=0;a<n.length;a++)n[a].setAttribute("fill",`rgb(${t[i].red}, ${t[i].green}, ${t[i].blue})`),i++;return s}createClusterIconUrl(s){let t=new XMLSerializer().serializeToString(s),i=new Blob([t],{type:"image/svg+xml"});return URL.createObjectURL(i)}removeLayerWFS(s){const e=this.viewer._dataSourceCollection._dataSources,t=e.length;for(let i=0;i<t;i++){const n=e.get(i);if(n._imageryProvider._layers===s){e.remove(n);return}}}removeAllLayers(){this.viewer.imageryLayers.removeAll()}getActiveLayers(){return this.viewer.imageryLayers._layers}removeAllEntities(s){const e=[];for(const t of s.values)t.name!=="user-position"&&e.push(t);for(const t of e)s.remove(t)}startNavigation(s){let e=1;s.forEach(t=>{this.createPathOrderLabels(t.coordinates,e),e++})}createPathOrderLabels(s,e){const t=s.longitude,i=s.latitude;this.viewer.entities.add({position:Cesium.Cartesian3.fromDegrees(t,i,1),label:{text:`${e}`,verticalOrigin:Cesium.VerticalOrigin.BOTTOM,pixelOffset:new Cesium.Cartesian2(0,-20),scale:.5,scaleByDistance:new Cesium.NearFarScalar(150,1.5,8e6,0),fillColor:Cesium.Color.WHITE,outlineWidth:2,outlineColor:Cesium.Color.BLACK,style:Cesium.LabelStyle.FILL_AND_OUTLINE}})}async createRoute(s,e,t){const i=this.viewer.entities;if(this.removeAllEntities(i),t==null)return;let n=[];await Promise.all(t.map(async d=>{(await this.fetchEntitiesData(d)).features.forEach(m=>{(m.geometry.type=="Point"||m.geometry.type=="MultiPoint")&&n.push(m)})}));const a=this.orderFeaturesByProximity(e,n);let r=1;e.coords.longitude,e.coords.latitude,a.forEach(d=>{const h=this.findFeatureCoordinates(d);this.createPointsOrderLabels(h,r),r++}),a.forEach(d=>{const h=this.getLayerToFind(d),m=this.filterLayerByName(s,h);d.layer=m.layer,d.name=m.name,d.relevant_properties=m.relevant_properties}),a.forEach(d=>{d.properties=Object.entries(d.properties).reduce((h,[m,y])=>{const b=d.relevant_properties.find(x=>x.property_name===m);return b&&(h[b.display_name]=y),h},{})});let l=[];return a.forEach(d=>{const h={},m=d.properties;m.Title=d.name,h.properties=m;let y,b;if(Array.isArray(d.geometry.coordinates)){if(d.geometry.coordinates.length==1){y=d.geometry.coordinates[0][0],b=d.geometry.coordinates[0][1];const x={longitude:y,latitude:b};h.coordinates=x}else if(d.geometry.coordinates.length==2){y=d.geometry.coordinates[0],b=d.geometry.coordinates[1];const x={longitude:y,latitude:b};h.coordinates=x}}l.push(h)}),this.viewer.zoomTo(i),l}orderFeaturesByProximity(s,e){let t=[],i=[s.coords.longitude,s.coords.latitude];for(;e.length!=0;){let n=1/0,a=-1;for(let r=0;r<e.length;r++){let l=e[r];const d=this.calculateDistance(i,l);d<n&&(n=d,a=r)}t.push(e[a]),e.splice(a,1)}return t}async fetchEntitiesData(s){const e=`${s.layer_url_wfs}?service=WFS&typeName=${s.layer}&outputFormat=application/json&request=GetFeature&srsname=EPSG:4326`;try{return await(await fetch(e)).json()}catch(t){throw console.error("Errore durante la richiesta fetch:",t),t}}calculateDistance(s,e){const t=this.findFeatureCoordinates(e),i=Cesium.Cartographic.fromDegrees(s[0],s[1]),n=Cesium.Cartographic.fromDegrees(t[0],t[1]);return new Cesium.EllipsoidGeodesic(i,n).surfaceDistance}findFeatureCoordinates(s){let e=[];if(Array.isArray(s.geometry.coordinates)){let t=s.geometry.coordinates;t.length==1?t[0].forEach(i=>e.push(i)):(t.splice(2),t.forEach(i=>e.push(i)))}else e=[s.geometry.coordinates];return e}createPointsOrderLabels(s,e){const t=s[0],i=s[1];this.viewer.entities.add({position:Cesium.Cartesian3.fromDegrees(t,i,1),label:{text:`${e}`,verticalOrigin:Cesium.VerticalOrigin.BOTTOM,pixelOffset:new Cesium.Cartesian2(0,-20),scale:.5,scaleByDistance:new Cesium.NearFarScalar(150,1.5,8e6,0),fillColor:Cesium.Color.WHITE,outlineWidth:2,outlineColor:Cesium.Color.BLACK,style:Cesium.LabelStyle.FILL_AND_OUTLINE}})}setCamera(){const s=Cesium.Cartesian3.fromDegrees(8.909041078781357,44.410209942448475,4e3);this.viewer.camera.flyTo({destination:s,orientation:{heading:Cesium.Math.toRadians(0),pitch:Cesium.Math.toRadians(-90),roll:0},duration:0})}setCameraToPosition(s){const e=Cesium.Cartesian3.fromDegrees(s.longitude,s.latitude,4e3);this.viewer.camera.flyTo({destination:e,duration:.5,orientation:{heading:Cesium.Math.toRadians(0),pitch:Cesium.Math.toRadians(-90),roll:0}})}setCameraToUserPosition(s){const e=Cesium.Cartesian3.fromDegrees(s.coords.longitude,s.coords.latitude,4e3);this.viewer.camera.flyTo({destination:e,orientation:{heading:Cesium.Math.toRadians(0),pitch:Cesium.Math.toRadians(-90),roll:0},duration:0})}createUserPin(s){this.viewer.entities.add({name:"user-position",position:Cesium.Cartesian3.fromDegrees(s.coords.longitude,s.coords.latitude,0),ellipse:{semiMinorAxis:20,semiMajorAxis:20,height:0,material:Cesium.Color.BLUE,outline:!0,outlineColor:Cesium.Color.WHITE,outlineWidth:200}})}async addBuilding(){const s=await Cesium.createOsmBuildingsAsync();this.viewer.scene.primitives.add(s)}};const j=async()=>new Promise((o,s)=>{navigator.geolocation.getCurrentPosition(e=>o(e),e=>s(e))}),Ce=(o,s)=>{const e={categories:[]};return o.categories.forEach(t=>{const i=t.groups.map(n=>{const a=n.layers.filter(r=>r.tags?s.some(l=>r.tags.includes(l)):!1);return{...n,layers:a}}).filter(n=>n.layers.length>0);i.length>0&&e.categories.push({...t,groups:i})}),e};async function Te(o){try{const e=await(await fetch(`./images/cluster/cluster-${o}.svg`)).text();return new DOMParser().parseFromString(e,"image/svg+xml")}catch(s){throw console.error(s),s}}async function Se(o){try{const s=await fetch(o).then(t=>t.json()),e=await Promise.all(s.categories.map(async t=>{const i=await Promise.all(t.groups.map(async n=>{try{const a=await fetch(n);if(a.ok)return a.json();throw new Error(`Errore durante il recupero dei dati da ${n}`)}catch(a){return console.error(a),null}}));return t.groups=i,t}));return{...s,categories:e}}catch(s){throw console.error("Errore durante il recupero dei dati JSON",s),s}}function Me(o,s){const e=o.coordinates,t=s.coordinates,i=e.longitude-t.longitude,n=e.latitude-t.latitude;return Math.sqrt(i*i+n*n)}function P(o){let s=0;for(let e=1;e<o.length;e++)s+=Me(o[e-1],o[e]);return s}function Ie(o,s){const e=[];for(let t=0;t<s;t++){const i=[...o];for(let n=i.length-1;n>0;n--){const a=Math.floor(Math.random()*(n+1));[i[n],i[a]]=[i[a],i[n]]}e.push(i)}return e}function _e(o,s){for(let e=0;e<s;e++){o.sort((n,a)=>P(n)-P(a));const i=[o.slice(0,1)[0]];for(;i.length<o.length;){const n=F(o),a=F(o),r=Pe(n,a);Oe(r),i.push(r)}o=i}return o[0]}function F(o){const s=o.reduce((i,n)=>i+1/P(n),0);let e=Math.random()*s,t=0;for(let i=0;i<o.length;i++)if(t+=1/P(o[i]),t>e)return o[i]}function Pe(o,s){if(!o||!s||o.length===0||s.length===0)return[];const e=Math.floor(Math.random()*o.length),t=[];for(let i=0;i<e;i++)t.push(o[i]);for(let i=0;i<s.length;i++){const n=s[i].coordinates;t.find(a=>a.coordinates.longitude===n.longitude&&a.coordinates.latitude===n.latitude)||t.push(s[i])}return t}function Oe(o){for(let e=0;e<o.length;e++)if(Math.random()<.01){const t=Math.floor(Math.random()*o.length);[o[e],o[t]]=[o[t],o[e]]}}const Re=[self.location.hostname,"fonts.gstatic.com","fonts.googleapis.com","cdn.jsdelivr.net"],qe=o=>{var s=Date.now(),e=new URL(o.url);return e.protocol=self.location.protocol,e.hostname===self.location.hostname&&(e.search+=(e.search?"&":"?")+"cache-bust="+s),e.href};self.addEventListener("activate",o=>{o.waitUntil(self.clients.claim())});self.addEventListener("fetch",o=>{if(Re.indexOf(new URL(o.request.url).hostname)>-1){const s=caches.match(o.request),e=qe(o.request),t=fetch(e,{cache:"no-store"}),i=t.then(n=>n.clone());o.respondWith(Promise.race([t.catch(n=>s),s]).then(n=>n||t).catch(n=>{})),o.waitUntil(Promise.all([i,caches.open("pwa-cache")]).then(([n,a])=>n.ok&&a.put(o.request,n)).catch(n=>{}))}});class He extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"}),this.routes={}}connectedCallback(){console.log("Connected!"),window.addEventListener("hashchange",()=>{this.checkRoute()})}addRoutes(s){this.routes=s,this.checkRoute()}changeRoute(s){if(console.log("Route changed:",s),s)this.shadow.innerHTML=this.routes[s]?this.routes[s].routingFunction():this.sendToNotFound();else{const e=Object.entries(this.routes).find(([t,i])=>i.type==="default");e?window.location.hash="#/"+e[0]:this.sendToNotFound()}}sendToNotFound(){Object.entries(this.routes).find(([e,t])=>t.type==="notFound")&&(window.location.hash="#/"+defaultRoute[0],this.changeRoute(defaultRoute[0]))}checkRoute(){const s=window.location.hash.slice(2);this.changeRoute(s)}}customElements.define("app-router",He);class p{constructor(){if(p._instance)return p._instance;this.listeners=[],p._instance=this}static get instance(){return p._instance||(p._instance=new p),p._instance}subscribe(s,e){this.listeners[s]||(this.listeners[s]=[]),this.listeners[s].push(e)}publish(s,e){this.listeners[s]&&this.listeners[s].forEach(t=>t(e))}}class S{constructor(s,e,t,i=[]){this.properties=s,this.layer=e,this.startingcoordinates=t,this.coordinatesArray=i,this.coordinatesArray.length===0&&this.coordinatesArray.push(t)}get id(){return this.layer.layer+this.startingcoordinates.latitude+this.startingcoordinates.longitude}static fromPoint(s,e,t){return new S(s,e,t)}static fromPolyline(s,e,t){return new S(s,e,t[0],t)}}class v{constructor(){c(this,"_instance");if(v._instance)return v._instance;v._instance=this}static get instance(){return v._instance||(v._instance=new v),v._instance}getFeature(s,e){const t=this.getLayerName(s.id.id),i=this.getLayerByName(e,t),n=this.getRelevantProperties(s.id.properties,i.relevant_properties);let a,r;if(s.id.point){let l=s.id.position._value;r=this.checkCoordinates(l),a=S.fromPoint(n,i,r)}if(s.id.polyline){let l=s.id.polyline.positions._value;r=this.checkCoordinates(l),a=S.fromPolyline(n,i,r)}return a}getLayerName(s){let e;switch(!0){case s.includes("."):e=s.split(".")[0];break;case s.includes("/"):e=s.split("/")[0];break}return e}getLayerByName(s,e){for(const t in s){const i=s[t];if(Array.isArray(i)||typeof i=="object"){const n=this.getLayerByName(i,e);if(n)return n}else if(typeof i=="string"&&i.includes(e))return s}return null}getRelevantProperties(s,e){const t={};if(e){for(const i of e)i.property_name&&s[i.property_name]&&(s[i.property_name]._value?t[i.display_name]=s[i.property_name]._value:t[i.display_name]=s[i.property_name]);return t.raiseName=s.raiseName._value,t}return t}checkCoordinates(s){if(Array.isArray(s)){let e=[];return s.map(t=>{let i=this.cartesianToCartographic(t);e.push(i)}),e}else return this.cartesianToCartographic(s)}cartesianToCartographic(s){const e=Cesium.Cartographic.fromCartesian(s);let t=Cesium.Math.toDegrees(e.longitude),i=Cesium.Math.toDegrees(e.latitude);return t=parseFloat(t.toFixed(8)),i=parseFloat(i.toFixed(8)),{longitude:t,latitude:i}}}class w{constructor(){c(this,"_data");if(w._instance)return w._instance;w._instance=this}static get instance(){return w._instance||(w._instance=new w),w._instance}getData(){if(!this.data){this.data={};let s=localStorage.selectedTags;s=JSON.parse(s),this.data.selectedTags=s}return this.data}}class g{constructor(){c(this,"CATEGORIES_URL","./json/categories.json");c(this,"_data");if(g._instance)return g._instance;g._instance=this}static get instance(){return g._instance||(g._instance=new g),g._instance}get data(){return this._data}set data(s){this._data=s}getData(){return this.data?Promise.resolve(this.data):this.fetchAppData(this.CATEGORIES_URL).then(s=>(this.data=s,s))}async fetchAppData(s){try{const e=await fetch(s).then(i=>i.json()),t=await Promise.all(e.categories.map(async i=>{const n=await Promise.all(i.groups.map(async a=>{try{const r=await fetch(a);if(r.ok)return r.json();throw new Error(`Errore durante il recupero dei dati da ${a}`)}catch(r){return console.error(r),null}}));return i.groups=n,i}));return{...e,categories:t}}catch(e){throw console.error("Errore durante il recupero dei dati JSON",e),e}}}class E{constructor(){c(this,"THEMES_URL","./json/themes.json");c(this,"_themes");if(E._instance)return E._instance;E._instance=this}static get instance(){return E._instance||(E._instance=new E),E._instance}get themes(){return this._themes}set themes(s){this._themes=s}getThemes(){return this.themes?Promise.resolve(this.themes):fetch(this.THEMES_URL).then(s=>s.json()).then(s=>(this.themes=s,s))}}class k{constructor(){if(k._instance)return k._instance;k._instance=this}static get instance(){return k._instance||(k._instance=new k),k._instance}getPosition(){return new Promise((s,e)=>{this.position?s(this.position):navigator.geolocation.getCurrentPosition(t=>{this.position=t,s(t)},t=>{e(t)})})}}class Be extends HTMLElement{constructor(){super();c(this,"_data");c(this,"_position");c(this,"filterLayersByTags",(e,t)=>{let i=[];return e.categories.map(n=>{n.groups.map(a=>{a.layers.map(r=>{r.tags&&t.some(l=>r.tags.includes(l))&&i.push({...r,tags:[...r.tags]})})})}),i});this.shadow=this.attachShadow({mode:"closed"})}get data(){return this._data}set data(e){this._data=e}get position(){return this._position}set position(e){this._position=e}async connectedCallback(){this.data=await g.instance.getData();let e=await k.instance.getPosition();this.position={},this.position.latitude=e.coords.latitude,this.position.longitude=e.coords.longitude,this.shadow.innerHTML=`
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
            <app-path-drawer></app-path-drawer>
            <app-search-result></app-search-result>
            <app-bench></app-bench>
            <app-info></app-info>
            <app-center-position></app-center-position>
            `,this.map=this.shadow.querySelector("app-cesium"),this.tabs=this.shadow.querySelector("app-tabs"),this.searchbar=this.shadow.querySelector("app-searchbar"),this.searchResult=this.shadow.querySelector("app-search-result"),this.autocomplete=this.shadow.querySelector("app-autocomplete"),this.bench=this.shadow.querySelector("app-bench"),this.tabsToggle=this.shadow.querySelector("app-tabs-toggle"),this.benchToggle=this.shadow.querySelector("app-bench-toggle"),this.carousel=this.shadow.querySelector("app-carousel"),this.themeIcon=this.shadow.querySelector("app-theme-icon"),this.path=this.shadow.querySelector("app-path-drawer"),this.info=this.shadow.querySelector("app-info"),this.centerPosition=this.shadow.querySelector("app-center-position"),this.map.setCameraToPosition(this.position),this.map.createUserPin(this.position),this.map.addEventListener("map-click",n=>{this.info.setAttribute("is-open",!1),this.benchToggle.setAttribute("is-open",!1),this.tabsToggle.setAttribute("is-open",!1),this.centerPosition.setAttribute("is-open",!1),this.path.setAttribute("is-open",!1),this.searchbar.setAttribute("value","");const a=this.map.getEntity(n.detail.movement);if(a==null){this.tabs.setAttribute("is-open",!1);return}const r=v.instance.getFeature(a,this.data);this.map.setCameraToPosition(r.startingcoordinates),this.tabs.addFeature(r),this.tabsToggle.setAttribute("is-open",!0),this.centerPosition.setAttribute("is-open",!0),this.tabs.setAttribute("active-tab","info-tab")}),this.tabs.addEventListener("tabs-toggle",n=>{n.detail.isOpen==!0?this.map.classList.add("minimize"):this.map.classList.remove("minimize")}),p.instance.subscribe("tabinfocard-click",n=>{this.map.setCameraToPosition(n.startingcoordinates)}),p.instance.subscribe("customroutecard-click",n=>{this.map.setCameraToPosition(n.startingcoordinates)}),this.searchbar.addEventListener("search",n=>{n.detail.searchValue.length==0?this.searchResult.setAttribute("is-open",!1):this.searchResult.setAttribute("is-open",!0),this.searchResult.layers=n.detail.layers}),this.searchbar.shadowRoot.querySelector("input").addEventListener("click",()=>{this.path.setAttribute("is-open",!1)}),this.tabsToggle.addEventListener("drawer-toggle",n=>{const a=JSON.parse(n.detail.isOpen);this.tabs.setAttribute("is-open",a),this.centerPosition.setAttribute("is-open",a),a===!0&&this.benchToggle.setAttribute("is-open",!1)}),this.benchToggle.addEventListener("bench-toggle",n=>{const a=JSON.parse(n.detail.isOpen);this.bench.setAttribute("is-open",a),a===!0&&this.tabsToggle.setAttribute("is-open",!1)}),this.bench.addEventListener("click",()=>{this.tabsToggle.setAttribute("is-open",!1)}),this.bench.addEventListener("bench-empty",()=>{this.tabsToggle.setAttribute("is-open",!1)}),document.addEventListener("bench-layer",()=>{this.benchToggle.setAttribute("is-open",!0)}),this.carousel.addEventListener("load-layers",n=>{this.map.loadLayers(n.detail.activeLayers)}),this.themeIcon.addEventListener("themechange",n=>{this.map.changeTheme(n.detail.theme)}),this.centerPosition.addEventListener("center-position",n=>{this.map.setCameraToPosition(this.position)});let t=this.filterLayersByTags(this.data,w.instance.getData().selectedTags);this.carousel.layers=t,t.forEach(n=>this.carousel.createChip(n)),this.themeIcon.themes=await E.instance.getThemes();const i=document.createElement("link");i.setAttribute("rel","stylesheet"),i.setAttribute("href","./css/map.page.css"),this.shadow.append(i)}render(){}}customElements.define("app-map",Be);class J extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){this.themes=this.getAttribute("themes"),this.themeBtn.setAttribute("themes",this.themes)}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="rail">
                <div class="menu">
                    <img src="/images/RAISE-pictogram-neg.svg" alt="Logo di RAISE" class="logo">
                    <app-drawer-toggle></app-drawer-toggle>
                    <app-link link="/"></app-link>
                </div>
            <app-theme-icon></app-theme-icon>
            </div>
            `,this.drawerToggle=this.shadow.querySelector("app-drawer-toggle"),this.themeBtn=this.shadow.querySelector("app-theme-icon"),this.drawerToggle.addEventListener("drawerToggled",e=>{this.setAttribute("is-open",e.detail.newValue)}),this.themeBtn.addEventListener("themeChanged",e=>{this.dispatchEvent(new CustomEvent("themeChanged",{detail:{newValue:e.detail.newValue}}))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/rail.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){t!=e&&(s=="themes"&&this.render(),s=="is-open"&&(this.drawerToggle.setAttribute("is-open",t+""),this.dispatchEvent(new CustomEvent("drawerToggled",{detail:{newValue:t}}))))}}c(J,"observedAttributes",["is-open","themes"]);customElements.define("app-rail",J);class U extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="icon">
                <span class="material-symbols-outlined">menu</span>
            </span>
            `,this.shadow.append(this.button),this.setAttribute("is-open","false");let s=this.getAttribute("is-open");this.btn=this.shadow.querySelector("button");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/tabs.toggle.component.css"),this.shadow.append(e),this.btn.addEventListener("click",()=>{s=this.getAttribute("is-open")==="true",this.setAttribute("is-open",!s+"")})}attributeChangedCallback(s,e,t){if(t!=e&&s=="is-open"){const i=new CustomEvent("drawer-toggle",{detail:{isOpen:t}});this.dispatchEvent(i)}}}c(U,"observedAttributes",["is-open"]);customElements.define("app-tabs-toggle",U);class W extends HTMLElement{constructor(){super();c(this,"_themes");c(this,"_theme");this.shadow=this.attachShadow({mode:"closed"}),this.setAttribute("is-active","false")}get themes(){return this._themes}set themes(e){this._themes=e,this.themeIcon.themes=this.themes}get theme(){return this._theme}set theme(e){this._theme=e,this.dispatchEvent(new CustomEvent("themeChanged",{detail:{theme:this.theme}}))}connectedCallback(){this.shadow.innerHTML=`
            <app-link icon='tag' link ="/"></app-link>
            <app-theme-icon></app-theme-icon>
            `,this.themeIcon=this.shadow.querySelector("app-theme-icon");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/settings.css"),this.shadow.append(e),this.themeIcon.addEventListener("themeChanged",t=>{this.theme=t.detail.theme})}attributeChangedCallback(e,t,i){t!=i&&e=="is-active"&&(JSON.parse(this.getAttribute("is-active"))==!0?this.classList.add("visible"):this.classList.remove("visible"))}}c(W,"observedAttributes",["is-active"]);customElements.define("app-settings",W);class De extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.hasAttribute("icon")||this.setAttribute("icon","app"),this.hasAttribute("link")||this.setAttribute("link","/"),this.button=document.createElement("button"),this.button.innerHTML=`
            <a href="${this.getAttribute("link")}">
                <span class="icon">
                    <span class="material-symbols-outlined">${this.getAttribute("icon")}</span>
                </span>
            </a>
            `,this.shadow.append(this.button);const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/icon.css"),this.shadow.append(s)}}customElements.define("app-link",De);class Ne extends HTMLElement{constructor(){super();c(this,"_themes");c(this,"_theme");c(this,"_themeIndex");this.shadow=this.attachShadow({mode:"closed"}),this.themeIndex=0}get themes(){return this._themes}set themes(e){this._themes=e}get theme(){return this._theme}set theme(e){this._theme=e,this.dispatchEvent(new CustomEvent("themechange",{detail:{theme:this.theme}}))}get themeIndex(){return this._themeIndex}set themeIndex(e){this._themeIndex=e}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="icon">
                <span class="material-symbols-outlined">contrast</span>
            </span>
            `,this.shadow.append(this.button),this.button.addEventListener("click",()=>{this.themeIndex=(this.themeIndex+1)%this.themes.length,this.themeIndex==0?this.theme={}:this.theme=this.themes[this.themeIndex]});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/themeIcon.component.css"),this.shadow.append(e)}}customElements.define("app-theme-icon",Ne);class $ extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"open"})}focusInput(){this.input.focus()}render(){this.input.setAttribute("value",this.getAttribute("value")),this.input.value=this.getAttribute("value")}connectedCallback(){this.shadow.innerHTML=`
            <input type="search" name="search" id="search" placeholder="Cerca per livelli..." value="">
            `,this.input=this.shadow.querySelector("input"),this.hasAttribute("value")||this.setAttribute("value",""),this.input.addEventListener("input",e=>{this.setAttribute("value",this.input.value)});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/searchbar.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){if(t!=e&&e!=null&&s=="value"){t=t.toLowerCase();let i=this.filterLayersByNameAndTag(g.instance.data,t);this.dispatchEvent(new CustomEvent("search",{detail:{searchValue:t,layers:i}})),this.render()}}filterLayersByNameAndTag(s,e){let t=[];return s.categories.forEach(i=>{i.groups.forEach(n=>{n.layers.forEach(a=>{(a.name.toLowerCase().includes(e)||a.tags.some(r=>r.includes(e)))&&t.push(a)})})}),t}}c($,"observedAttributes",["value"]);customElements.define("app-searchbar",$);class X extends HTMLElement{constructor(){super();c(this,"_selectedSpan");c(this,"_input");this.shadow=this.attachShadow({mode:"open"}),this.selectedSpan=0,this._input=[]}get input(){return this._input}set input(e){this._input=e,this.render()}get selectedSpan(){return this._selectedSpan}set selectedSpan(e){this._selectedSpan=e}render(){if(this.selectedSpan=0,this.div.innerHTML="",this.input.length!=0){for(let e=0;e<this.input.length;e++)this.span=document.createElement("span"),this.span.textContent=this.input[e].name,this.span.setAttribute("name",this.input[e].name),this.span.setAttribute("tabindex",e+1),this.div.append(this.span);this.spans=this.shadow.querySelectorAll("span"),this.spans.forEach(e=>{e.addEventListener("click",()=>{this.setAttribute("selected",e.getAttribute("name"))}),e.addEventListener("keydown",t=>{this.setAttribute("last-key",t.key)})})}}connectedCallback(){this.shadow.innerHTML="<div></div>",this.div=this.shadow.querySelector("div"),this.setAttribute("selected",""),p.instance.subscribe("search",t=>{t=t.toLowerCase();let i={};if(i.value=t,t.length>2){let n=this.filterLayersByNameAndTag(g.instance.data,t);i.layers=n,p.instance.publish("filterlayers",i),this.input=n}else i.layers=[],p.instance.publish("filterlayers",i),this.input=[]});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/autocomplete.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){if(e=="selected"){const n=new CustomEvent("selectedtag",{detail:{selectedTag:i}});this.dispatchEvent(n),this.div.innerHTML=""}e=="last-key"&&(i=="ArrowDown"&&(this.selectedSpan++,this.selectedSpan==this.spans.length+1&&(this.selectedSpan=1),this.shadow.querySelector(`span[tabIndex="${this.selectedSpan}"]`).focus()),i=="ArrowUp"&&(this.selectedSpan--,this.selectedSpan==0?this.dispatchEvent(new CustomEvent("changeFocus")):this.shadow.querySelector(`span[tabIndex="${this.selectedSpan}"]`).focus()),i=="Enter"&&(this.setAttribute("selected",this.shadow.activeElement.getAttribute("name")),this.div.innerHTML=""))}filterLayersByTagName(e,t){let i=JSON.parse(JSON.stringify(e));return i.categories=i.categories.map(n=>(n.groups=n.groups.map(a=>(a.layers=a.layers.filter(r=>r.tags?r.tags.some(l=>l.includes(t)):!1),a.layers.length>0?a:null)).filter(Boolean),n.groups.length>0?n:null)).filter(Boolean),i}filterTag(e,t){let i=[];return e.categories.map(a=>{a.groups.map(r=>{r.layers.map(l=>{l.tags&&l.tags.map(d=>{d.includes(t)&&i.push(d)})})})}),[...new Set(i)]}filterLayersByNameAndTag(e,t){let i=[];return e.categories.forEach(n=>{n.groups.forEach(a=>{a.layers.forEach(r=>{(r.name.toLowerCase().includes(t)||r.tags.some(l=>l.includes(t)))&&i.push(r)})})}),i}}c(X,"observedAttributes",["selected","last-key"]);customElements.define("app-autocomplete",X);class K extends HTMLElement{constructor(){super();c(this,"_layers");this.shadow=this.attachShadow({mode:"closed"}),this.hasAttribute("is-open")||this.setAttribute("is-open",!1)}get layers(){return this._layers}set layers(e){this._layers=e,this.render()}render(){if(this.div.innerHTML="",this.layers.length==0){let e=document.createElement("p");e.innerText="Nessun livello trovato",this.div.append(e)}else this.layers.forEach(e=>{let t=document.createElement("app-search-result-chip");t.layer=e,this.div.append(t),t.addEventListener("add-layer",i=>{document.dispatchEvent(new CustomEvent("add-layer",{detail:{layers:[i.detail.layer]}}))}),this.div.scrollTop=0})}connectedCallback(){this.shadow.innerHTML="<div></div>",this.div=this.shadow.querySelector("div");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/search-result.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){i!=t&&e=="is-open"&&(i=="true"?this.classList.add("visible"):this.classList.remove("visible"))}}c(K,"observedAttributes",["is-open"]);customElements.define("app-search-result",K);class M{constructor(){c(this,"_hex");c(this,"_rgba");this.hex,this.rgba,this.opacity=1}get hex(){return this._hex}set hex(s){this._hex=s}get rgba(){return this._rgba}set rgba(s){this._rgba=s}convertHexToRgba(s,e=this.opacity){let t=s.replace("#","");t.length===3&&(t=`${t[0]}${t[0]}${t[1]}${t[1]}${t[2]}${t[2]}`);const i=parseInt(t.substring(0,2),16),n=parseInt(t.substring(2,4),16),a=parseInt(t.substring(4,6),16);return e>1&&e<=100&&(e=e/100),this.rgba=`rgba(${i},${n},${a},${e})`,this.rgba}changeOpacity(s,e){const i=s.substring(5,s.length-1).split(","),[n,a,r]=i.map(d=>parseInt(d));return`rgba(${n},${a},${r},${e})`}}class ze extends HTMLElement{constructor(){super();c(this,"_layer");this.shadow=this.attachShadow({mode:"closed"}),this.colorManager=new M}get layer(){return this._layer}set layer(e){this._layer=e}render(){}connectedCallback(){this.shadow.innerHTML=`
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
            `,this.chip=this.shadow.querySelector(".chip"),this.label=this.shadow.querySelector("label"),this.legend=this.shadow.querySelector(".legend"),this.colorManager.hex=this.layer.style.color,this.colorManager.rgba=this.colorManager.convertHexToRgba(this.colorManager.hex),this.legend.style.backgroundColor=this.colorManager.changeOpacity(this.colorManager.rgba,.25),this.legend.style.borderColor=this.colorManager.rgba,this.legend.style.borderWidth="2px",this.legend.style.borderStyle="solid",this.chip.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("add-layer",{detail:{layer:this.layer}}))});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/search-result-chip.css"),this.shadow.append(e)}}customElements.define("app-search-result-chip",ze);class Fe extends HTMLElement{constructor(){super();c(this,"_isGrabbed");c(this,"_startX");c(this,"_scrollLeft");c(this,"_layers");this.shadow=this.attachShadow({mode:"closed"}),this.isGrabbed=!1,this._layers=[]}get layers(){return this._layers}set layers(e){this._layers=e,this.dispatchEvent(new CustomEvent("load-layers",{detail:{activeLayers:this.layers}}))}get isGrabbed(){return this._isGrabbed}set isGrabbed(e){this._isGrabbed=e,this.isGrabbed==!0?this.style.cursor="grabbing":this.style.cursor="pointer"}connectedCallback(){this.shadow.innerHTML="<div></div>",this.div=this.shadow.querySelector("div"),this.addEventListener("mousedown",t=>this.start(t)),this.addEventListener("touchstart",t=>this.start(t)),this.addEventListener("mousemove",t=>this.move(t)),this.addEventListener("touchmove",t=>this.move(t)),this.addEventListener("mouseup",this.end),this.addEventListener("touchend",this.end),this.addEventListener("mouseleave",this.end),document.addEventListener("add-layer",t=>{this.checkLayers(this._layers,t.detail.layers).forEach(n=>this.addLayer(n))});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/carousel.css"),this.shadow.append(e)}start(e){this.isGrabbed=!0,this._startX=e.pageX||e.touches[0].pageX-this.offsetLeft,this._scrollLeft=this.scrollLeft}move(e){if(this.isGrabbed==!1)return;e.preventDefault();const i=((e.pageX||e.touches[0].pageX-this.offsetLeft)-this._startX)*3;this.scrollLeft=this._scrollLeft-i}end(){this.isGrabbed=!1}addLayer(e){this._layers.push(e),this.createChip(e),this.layers=this._layers}removeLayer(e){this._layers=this._layers.filter(t=>e.layer!==t.layer),this.layers=this._layers}createChip(e){let t=document.createElement("app-layer-chip");t.layer=e,this.div.append(t),t.addEventListener("bench-layer",i=>{const n=i.detail.layer;this.removeLayer(n),document.dispatchEvent(new CustomEvent("bench-layer",{detail:{layers:[n]}}))})}checkLayers(e,t){return t.filter(i=>!e.some(n=>i.name==n.name))}}customElements.define("app-carousel",Fe);class Ge extends HTMLElement{constructor(){super();c(this,"_layer");c(this,"_isGrabbed");this.shadow=this.attachShadow({mode:"closed"}),this.colorManager=new M}get layer(){return this._layer}set layer(e){this._layer=e}get isGrabbed(){return this._isGrabbed}set isGrabbed(e){this._isGrabbed=e,this.isGrabbed==!0?this.style.cursor="grabbing":this.style.cursor="pointer"}render(){}connectedCallback(){this.shadow.innerHTML=`
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
            `,this.select=this.shadow.querySelector(".select"),this.legend=this.shadow.querySelector(".legend"),this.label=this.shadow.querySelector("label"),this.icon=this.shadow.querySelector(".icon"),this.colorManager.hex=this.layer.style.color,this.colorManager.rgba=this.colorManager.convertHexToRgba(this.colorManager.hex),this.label.innerText=this.layer.name,this.legend.style.backgroundColor=this.colorManager.changeOpacity(this.colorManager.rgba,.25),this.legend.style.borderColor=this.colorManager.rgba,this.legend.style.borderWidth="2px",this.legend.style.borderStyle="solid",this.addEventListener("mousedown",t=>{this.isGrabbed=!0}),this.addEventListener("mouseup",t=>{this.isGrabbed=!1}),this.icon.addEventListener("click",()=>{this.remove()});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/layer-chip.css"),this.shadow.append(e)}disconnectedCallback(){this.dispatchEvent(new CustomEvent("bench-layer",{detail:{layer:this.layer}}))}}customElements.define("app-layer-chip",Ge);class Y extends HTMLElement{constructor(){super();c(this,"_layers");this.shadow=this.attachShadow({mode:"closed"}),this._layers=[]}get layers(){return this._layers}set layers(e){this._layers=e,this._layers.length==0&&this.dispatchEvent(new CustomEvent("bench-empty"))}connectedCallback(){this.shadow.innerHTML="<div></div>",this.div=this.shadow.querySelector("div"),this.hasAttribute("is-open")||this.setAttribute("is-open","false"),document.addEventListener("bench-layer",t=>{this.checkLayers(this._layers,t.detail.layers).forEach(n=>{this.addLayer(n)})});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/bench.component.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){i!=t&&t!=null&&e=="is-open"&&(i=="true"?this.classList.add("visible"):this.classList.remove("visible"))}addLayer(e){this._layers.push(e),this.createChip(e),this.layers=this._layers}removeLayer(e){this._layers=this._layers.filter(t=>e.layer!==t.layer),this.layers=this._layers}createChip(e){let t=document.createElement("app-bench-layer");t.layer=e,this.div.append(t),t.addEventListener("restore-layer",i=>{this.removeLayer(i.detail.layer),document.dispatchEvent(new CustomEvent("add-layer",{detail:{layers:[i.detail.layer]}}))}),t.addEventListener("delete-layer",i=>{this.removeLayer(i.detail.layer)})}checkLayers(e,t){return t.filter(i=>!e.some(n=>i.name==n.name))}}c(Y,"observedAttributes",["is-open"]);customElements.define("app-bench",Y);class je extends HTMLElement{constructor(){super();c(this,"_layer");this.shadow=this.attachShadow({mode:"closed"})}get layer(){return this._layer}set layer(e){this._layer=e}connectedCallback(){this.shadow.innerHTML=`
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
            `,this.add=this.shadow.querySelector(".add"),this.delete=this.shadow.querySelector(".delete"),this.add.addEventListener("click",t=>{t.stopPropagation(),this.dispatchEvent(new CustomEvent("restore-layer",{detail:{layer:this.layer}})),this.remove()}),this.delete.addEventListener("click",t=>{t.stopPropagation(),this.dispatchEvent(new CustomEvent("delete-layer",{detail:{layer:this.layer}})),this.remove()});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/bench.chip.component.css"),this.shadow.append(e)}}customElements.define("app-bench-layer",je);class Z extends HTMLElement{constructor(){super();c(this,"_data");c(this,"_output");c(this,"_input");this.shadow=this.attachShadow({mode:"open"})}set data(e){this._data=e,this.render()}get data(){return this._data}set output(e){this._output=e,this.dispatchEvent(new CustomEvent("activeLayers",{detail:{activeLayers:this.output}}))}get output(){return this._output}set input(e){this._input=e,this.output=this.input,this.accordions.forEach(t=>{let i=[];for(let n=0;n<this.input.length;n++){const a=this.input[n];for(let r=0;r<t.data.groups.length;r++)t.data.groups[r].layers.forEach(d=>{d.layer==a.layer&&i.push(a)})}t.input=i})}get input(){return this._input}render(){if(this.div.innerHTML="",localStorage.length!=0){let e=JSON.parse(localStorage.selectedTags);if(this.filterLayersBySelectedTags(this.data,e),this.createDrawer(this.data,this.div),this.data.categories.length==0){const t=document.createElement("p");t.innerText="Nessun livello trovato",this.div.append(t)}}else this.createDrawer(this.data,this.div);this.accordions=this.shadow.querySelectorAll("app-accordion"),this.accordions.forEach(e=>{e.addEventListener("accordionToggled",t=>{t.detail.isOpen=="true"&&this.accordions.forEach(n=>{n!==t.target&&n.setAttribute("is-open","false")})})}),this.accordions.forEach(e=>{e.addEventListener("newOutput",t=>{this.output==null&&(this._output=[]);const i=t.detail.layersToAdd,n=t.detail.layersToRemove;i.forEach(r=>this._output.push(r)),this._output=[...new Set(this._output)];let a=this._output.filter(r=>!n.some(l=>l.layer==r.layer));this.output=a})}),this.accordions.forEach(e=>{e.addEventListener("routeToggled",t=>{this.dispatchEvent(new CustomEvent("routeToggled",{detail:{layer:t.detail.layer}}))})})}connectedCallback(){this.shadow.innerHTML=`
            <h3></h3>
            <div id="categories-section"></div>
            `,this.div=this.shadow.querySelector("#categories-section"),this.text=this.shadow.querySelector("h3"),this.hasAttribute("is-active")||this.setAttribute("is-active","false"),this.hasAttribute("title")||this.setAttribute("title","Categorie"),this.text.innerText=this.getAttribute("title");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/drawer.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){t!=i&&t!=null&&(e=="is-active"&&(JSON.parse(i)==!0?this.classList.add("visible"):this.classList.remove("visible")),e=="title"&&(this.text.innerText=this.getAttribute("title")))}filterLayersBySelectedTags(e,t){e.categories.forEach(i=>{i.groups.forEach(n=>{n.layers=n.layers.filter(a=>a.tags?t.some(r=>a.tags.includes(r)):!1),n.layers.length===0&&(i.groups=i.groups.filter(a=>a!==n))}),i.groups.length===0&&(e.categories=e.categories.filter(n=>n!==i))})}createDrawer(e,t){e.categories.forEach(i=>{const n=document.createElement("app-accordion");n.data=i,t.append(n)})}}c(Z,"observedAttributes",["is-active","title"]);customElements.define("app-drawer",Z);class Q extends HTMLElement{constructor(){super();c(this,"_data");c(this,"_output");c(this,"_input");this.shadow=this.attachShadow({mode:"closed"})}set data(e){this._data=e}get data(){return this._data}set output(e){this._output=e,this.dispatchEvent(new CustomEvent("newOutput",{detail:{layersToAdd:this.output.layersToAdd,layersToRemove:this.output.layersToRemove}})),this._output.layersToAdd=[],this._output.layersToRemove=[]}get output(){return this._output}set input(e){this._input=e,this.accordions.forEach(t=>{let i=[];for(let n=0;n<this.input.length;n++){const a=this.input[n];t.data.layers.forEach(r=>{r.layer==a.layer&&i.push(a)})}t.input=i})}get input(){return this._input}render(){this.getAttribute("is-open")=="true"?(this.accordionContent.classList.add("accordion-show"),this.accordionIcon.classList.add("accordion-icon-active")):(this.accordionContent.classList.remove("accordion-show"),this.accordionIcon.classList.remove("accordion-icon-active"))}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="accordion-item">
                <div class="accordion-checkbox">
                    <input type="checkbox">
                    <button type="button" class="accordion-btn">
                        <span class="accordion-title"></span>
                        <span class="accordion-icon">
                            <span class="material-symbols-outlined">keyboard_arrow_down</span>
                        </span>
                    </button>
                </div>
                <div class="accordion-content"></div>
            </div>
            `,this.hasAttribute("is-open")||this.setAttribute("is-open","false"),this.checkbox=this.shadow.querySelector("input"),this.accordionTitle=this.shadow.querySelector(".accordion-title"),this.accordionContent=this.shadow.querySelector(".accordion-content"),this.accordionIcon=this.shadow.querySelector(".accordion-icon"),this.accordionBtn=this.shadow.querySelector(".accordion-btn"),this.accordionTitle.textContent=this.data.name,this.data.groups.forEach(i=>{const n=document.createElement("app-checkbox-list");n.data=i,this.accordionContent.append(n)}),this.accordions=this.shadow.querySelectorAll("app-checkbox-list"),this.accordions[this.accordions.length-1].classList.add("last-accordion"),this.accordionBtn.addEventListener("click",()=>{const i=JSON.parse(this.getAttribute("is-open"));this.setAttribute("is-open",!i+"")}),this.checkbox.addEventListener("click",()=>{let i=JSON.parse(this.getAttribute("all-checked"));i=!i,this.setAttribute("all-checked",i+""),this.input==null&&(this._input=[]),this._output==null&&(this._output={},this._output.layersToAdd=[],this._output.layersToRemove=[]),i==!0?this.data.groups.forEach(n=>{n.layers.forEach(a=>{this._input.push(a),this._output.layersToAdd.push(a)})}):(this._input=[],this.data.groups.forEach(n=>{n.layers.forEach(a=>this._output.layersToRemove.push(a))})),this.input=this._input,this.output=this._output}),this.accordions.forEach(i=>{i.addEventListener("accordionToggled",n=>{n.detail.isOpen=="true"&&this.accordions.forEach(r=>{r!==n.target&&r.setAttribute("is-open","false")})})}),this.accordions.forEach(i=>{i.addEventListener("newOutput",n=>{const a=n.detail.layersToAdd,r=n.detail.layersToRemove;this.output==null&&(this._output={},this._output.layersToAdd=[],this._output.layersToRemove=[]),a.forEach(l=>this._output.layersToAdd.push(l)),r.forEach(l=>this._output.layersToRemove.push(l)),this.output=this._output})}),this.accordions.forEach(i=>{i.addEventListener("routeToggled",n=>{this.dispatchEvent(new CustomEvent("routeToggled",{detail:{layer:n.detail.layer}}))})});const t=document.createElement("link");t.setAttribute("rel","stylesheet"),t.setAttribute("href","./css/accordion.css"),this.shadow.append(t)}attributeChangedCallback(e,t,i){i!=t&&t!=null&&e=="is-open"&&(this.dispatchEvent(new CustomEvent("accordionToggled",{detail:{isOpen:i}})),this.render())}}c(Q,"observedAttributes",["is-open"]);customElements.define("app-accordion",Q);class V extends HTMLElement{constructor(){super();c(this,"_data");c(this,"_output");c(this,"_input");this.shadow=this.attachShadow({mode:"closed"})}set data(e){this._data=e}get data(){return this._data}set output(e){this._output=e,this.dispatchEvent(new CustomEvent("newOutput",{detail:{layersToAdd:this.output.layersToAdd,layersToRemove:this.output.layersToRemove}})),this._output.layersToAdd=[],this._output.layersToRemove=[]}get output(){return this._output}set input(e){this._input=e,this.checkboxes.forEach(t=>{this.input.length!=[]?this.input.forEach(i=>{t.data.layer==i.layer&&t.setAttribute("is-checked","true")}):t.setAttribute("is-checked","false")})}get input(){return this._input}render(){this.getAttribute("is-open")=="true"?(this.accordionContent.classList.add("accordion-show"),this.accordionIcon.classList.add("accordion-icon-active")):(this.accordionContent.classList.remove("accordion-show"),this.accordionIcon.classList.remove("accordion-icon-active"))}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="accordion-item">
                <div class="accordion-checkbox">
                    <input type="checkbox">
                    <button type="button" class="accordion-btn">
                        <span class="accordion-title"></span>
                        <span class="accordion-icon">
                            <span class="material-symbols-outlined">keyboard_arrow_down</span>
                        </span>
                    </button>
                </div>
                <div class="accordion-content"></div>
            </div>
            `,this.hasAttribute("is-open")||this.setAttribute("is-open","false"),this.hasAttribute("all-checked")||this.setAttribute("all-checked","false"),this.checkbox=this.shadow.querySelector("input"),this.accordionTitle=this.shadow.querySelector(".accordion-title"),this.accordionContent=this.shadow.querySelector(".accordion-content"),this.accordionIcon=this.shadow.querySelector(".accordion-icon"),this.accordionBtn=this.shadow.querySelector(".accordion-btn"),this.accordionTitle.textContent=this.data.name,this.data.layers.forEach(t=>{const i=document.createElement("app-checkbox");i.data=t,this.accordionContent.append(i)}),this.checkboxes=this.shadow.querySelectorAll("app-checkbox"),this.accordionBtn.addEventListener("click",()=>{const t=JSON.parse(this.getAttribute("is-open"));this.setAttribute("is-open",!t+"")}),this.checkbox.addEventListener("click",()=>{let t=JSON.parse(this.getAttribute("all-checked"));t=!t,this.setAttribute("all-checked",t+""),t==!0?this.input=this.data.layers:this.input=[],this._output==null&&(this._output={},this._output.layersToAdd=[],this._output.layersToRemove=[]),t==!0?this._output.layersToAdd=this.data.layers:this._output.layersToRemove=this.data.layers,this.output=this._output}),this.checkboxes.forEach(t=>{t.addEventListener("checkboxToggled",i=>{const n=i.detail.layerToAdd,a=i.detail.isChecked;this._output==null&&(this._output={},this._output.layersToAdd=[],this._output.layersToRemove=[]),a==!0?this._output.layersToAdd.push(n):this._output.layersToRemove.push(n),this.output=this._output})}),this.checkboxes.forEach(t=>{t.addEventListener("detailsToggled",i=>{i.detail.isOpen=="true"&&this.checkboxes.forEach(a=>{a!==i.target&&a.setAttribute("is-open","false")})})}),this.checkboxes.forEach(t=>{t.addEventListener("routeToggled",i=>{this.dispatchEvent(new CustomEvent("routeToggled",{detail:{layer:i.detail.layer}}))})});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/accordion.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){i!=t&&t!=null&&e=="is-open"&&(this.dispatchEvent(new CustomEvent("accordionToggled",{detail:{isOpen:i}})),this.render())}}c(V,"observedAttributes",["is-open","all-checked"]);customElements.define("app-checkbox-list",V);class ee extends HTMLElement{constructor(){super();c(this,"_data");c(this,"_output");this.shadow=this.attachShadow({mode:"closed"}),this.opacityComponent,this.navigationComponent}set data(e){this._data=e}get data(){return this._data}set output(e){this._output=e;const t=JSON.parse(this.getAttribute("is-checked"));this.dispatchEvent(new CustomEvent("checkboxToggled",{detail:{layerToAdd:this.output,isChecked:t}}))}get output(){return this._output}render(){this.getAttribute("is-open")=="true"?this.componentsDetails.classList.add("active"):this.componentsDetails.classList.remove("active");const t=JSON.parse(this.getAttribute("is-checked"));this.checkbox.checked=t,this.opacityComponent.setAttribute("is-enabled",t+""),this.navigationComponent!=null&&this.navigationComponent.setAttribute("is-enabled",t+"")}connectedCallback(){if(this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="wrapper">
                <div class="checkbox">
                    <input type="checkbox" id="checkbox">
                    <div class="legend"></div>
                    <label for="checkbox">Label</label>
                </div>
                <div class="tools">
                    <div class="icon">
                        <span class="material-symbols-outlined">keyboard_arrow_down</span>
                    </div>
                </div>
            </div>
            <div class="components"></div>
            `,this.checkbox=this.shadow.querySelector("input"),this.legend=this.shadow.querySelector(".legend"),this.label=this.shadow.querySelector("label"),this.tools=this.shadow.querySelector(".tools"),this.icon=this.shadow.querySelector(".icon"),this.componentsDetails=this.shadow.querySelector(".components"),this.hasAttribute("is-checked")||this.setAttribute("is-checked","false"),this.data&&(this.label.textContent=this.data.name),this.color=this.data.style.color,this.legend.style.backgroundColor=this.color,this.components=this.data.components,this.components!=null&&this.components!=0){for(const t of this.components){if(this.component=document.createElement(`${t}`),t=="app-opacity-slider"&&(this.opacity=this.data.style.opacity,this.opacityComponent=this.component,this.opacityComponent.setAttribute("opacity",this.opacity),this.opacityComponent.setAttribute("is-enabled","false"),this.opacityComponent.addEventListener("opacityChanged",i=>{this._data.style.opacity=i.detail.opacity,this.output=this.data})),t=="app-navigation-btn"){this.navigationComponent=this.component,this.navigationComponent.setAttribute("is-enabled","false"),this.tools.insertBefore(this.navigationComponent,this.icon),this.navigationComponent.addEventListener("routeToggled",()=>{this.dispatchEvent(new CustomEvent("routeToggled",{detail:{layer:this.data}}))});continue}this.componentsDetails.append(this.component)}this.setAttribute("is-open","false")}this.checkbox.addEventListener("change",t=>{const i=t.target.checked;this.setAttribute("is-checked",i),this.output=this.data}),this.icon.addEventListener("click",()=>{const t=JSON.parse(this.getAttribute("is-open"));this.setAttribute("is-open",!t+"")});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/checkbox.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){i!=t&&t!=null&&(e=="is-checked"&&this.render(),e=="is-open"&&(this.dispatchEvent(new CustomEvent("detailsToggled",{detail:{isOpen:i}})),this.render()))}}c(ee,"observedAttributes",["is-checked","is-open"]);customElements.define("app-checkbox",ee);class te extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){this.getAttribute("is-enabled")=="true"?this.input.disabled=!1:this.input.disabled=!0}connectedCallback(){this.shadow.innerHTML=`
            <label>Opacità</label>
            <input type="range">
            `,this.hasAttribute("is-enabled")||this.setAttribute("is-enabled","false"),this.hasAttribute("opacity")||this.setAttribute(1),this.input=this.shadow.querySelector("input"),this.input.setAttribute("min",0),this.input.setAttribute("max",1),this.input.setAttribute("step",.1),this.input.disabled=!0,this.input.value=this.getAttribute("opacity"),this.input.addEventListener("change",()=>{this.setAttribute("opacity",this.input.value)});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/opacity.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){e!=t&&e!=null&&(s=="is-enabled"&&this.render(),s=="opacity"&&this.dispatchEvent(new CustomEvent("opacityChanged",{detail:{opacity:JSON.parse(this.getAttribute("opacity"))}})))}}c(te,"observedAttributes",["is-enabled","opacity"]);customElements.define("app-opacity-slider",te);var q;let Je=(q=class extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){}connectedCallback(){this.button=document.createElement("button"),this.button.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <span class="material-symbols-outlined">add</span>
            `,this.shadow.append(this.button),this.hasAttribute("is-enabled")||this.setAttribute("is-enabled","false"),this.button.addEventListener("click",()=>{this.getAttribute("is-enabled")=="true"&&this.dispatchEvent(new CustomEvent("routeToggled"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/activate-navigation-btn.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){}},c(q,"observedAttributes",["is-enabled"]),q);customElements.define("app-navigation-btn",Je);class se extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){this.getAttribute("is-enable")=="true"?this.input.disabled=!1:this.input.disabled=!0}connectedCallback(){this.shadow.innerHTML=`
            <div>
                <label>Opacità</label>
                <input type="range">
            </div>
            `,this.input=this.shadow.querySelector("input"),this.hasAttribute("is-enable")||(this.setAttribute("is-enable","false"),this.input.disabled=!0),this.input.setAttribute("min",0),this.input.setAttribute("max",1),this.input.setAttribute("step",.1),this.input.value=this.getAttribute("opacity"),this.input.addEventListener("change",()=>{this.setAttribute("opacity",this.input.value)});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/tool.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){if(s=="opacity"&&t!=e){const i=new CustomEvent("opacityChanged",{detail:{name:s,oldValue:e,newValue:t}});this.dispatchEvent(i)}s=="is-enable"&&e!==null&&t!==null&&t!==e&&this.render()}}c(se,"observedAttributes",["is-enable","opacity"]);customElements.define("app-opacity-slider-2",se);class ie extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){this.isNavigation=this.getAttribute("is-navigation"),this.isNavigation=="true"?(this.icon.innerHTML="close",this.label.innerHTML="Chiudi navigazione"):(this.icon.innerHTML="directions",this.label.innerHTML="Avvia percorso")}connectedCallback(){this.hasAttribute("is-active")||this.setAttribute("is-active","false"),this.hasAttribute("is-navigation")||this.setAttribute("is-navigation","false"),this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="material-symbols-outlined">directions</span>
            <span class="label">Avvia percorso</span>
            `,this.shadow.append(this.button),this.icon=this.shadow.querySelector(".material-symbols-outlined"),this.label=this.shadow.querySelector(".label"),this.button.addEventListener("click",()=>{const e=JSON.parse(this.getAttribute("is-navigation"));this.setAttribute("is-navigation",!e+"")});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/navigation-btn.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){t!=e&&e!=null&&t!=null&&(s=="is-active"&&(t=="true"?this.classList.add("visible"):this.classList.remove("visible")),s=="is-navigation"&&(this.dispatchEvent(new CustomEvent("activateNavigation",{detail:{isNavigation:t}})),this.render()))}}c(ie,"observedAttributes",["is-active","is-navigation","features"]);customElements.define("app-navigation",ie);class ne extends HTMLElement{constructor(){super();c(this,"_feature");this.shadow=this.attachShadow({mode:"closed"})}get feature(){return this._feature}set feature(e){this._feature=e,this.render()}render(){this.category.innerText="",this.name.innerText="",this.tools.innerHTML="",this.content.innerHTML="";const e=this.feature.properties;for(const i in e)if(e.hasOwnProperty(i)){const n=e[i];if(i=="Title"){this.category.innerText=n;continue}if(i=="Nome"){this.name.innerText=n;continue}const a=document.createElement("p");a.innerText=n,this.content.append(a)}if(this.playBtn=document.createElement("app-play-info-btn"),this.tools.append(this.playBtn),!this.feature.coordinates||!typeof this.feature.coordinates=="object")return;const t={};t.longitude=this.feature.coordinates.longitude,t.latitude=this.feature.coordinates.latitude,this.goToBtn=document.createElement("app-goto"),this.goToBtn.coordinates=t,this.tools.insertBefore(this.goToBtn,this.playBtn),this.goToBtn.addEventListener("go-to",i=>{this.goTo(i.detail.coordinates)}),this.playBtn.addEventListener("read-info",()=>{const i=new SpeechSynthesisUtterance;i.lang="it";const n=this.shadow.querySelector(".content").innerHTML;i.text=n,window.speechSynthesis.speak(i)}),this.addToRouteBtn=document.createElement("app-add-to-route"),this.tools.append(this.addToRouteBtn),this.addToRouteBtn.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("add-to-route",{detail:{feature:this.feature}}))})}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="wrapper">
                <div class="close-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
                <div class="info">
                    <div class="title">
                        <h4 class="name"></h4>
                        <p class="category"></p>
                    </div>
                    <div class="tools"></div>
                </div>
                <div class="content"></div>
            </div>
            `,this.setAttribute("is-open",!1),this.close=this.shadow.querySelector(".close-icon"),this.info=this.shadow.querySelector(".info"),this.name=this.shadow.querySelector(".name"),this.category=this.shadow.querySelector(".category"),this.tools=this.shadow.querySelector(".tools"),this.content=this.shadow.querySelector(".content"),this.close.addEventListener("click",()=>this.setAttribute("is-open","false"));const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/info-drawer.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){i!=t&&t!=null&&e=="is-open"&&(i=="true"?this.openDrawer():this.closeDrawer())}openDrawer(){this.classList.remove("close"),this.classList.add("open")}closeDrawer(){this.classList.remove("open"),this.classList.add("close")}goTo(e){const t=`https://www.google.com/maps/dir/?api=1&destination=${e.latitude},${e.longitude}`;window.open(t,"_blank")}}c(ne,"observedAttributes",["is-open"]);customElements.define("app-info-drawer",ne);class Ue extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="material-symbols-outlined">play_circle</span>
            <span class="label">Ascolta</span>
            `,this.shadow.append(this.button),this.button.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("read-info"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/play-info-btn.css"),this.shadow.append(s)}}customElements.define("app-play-info-btn",Ue);class We extends HTMLElement{constructor(){super();c(this,"_coordinates");this.shadow=this.attachShadow({mode:"closed"})}get coordinates(){return this._coordinates}set coordinates(e){this._coordinates=e}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="material-symbols-outlined">directions</span>
            <span class="label">Indicazioni</span>
            `,this.shadow.append(this.button),this.button.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("go-to",{detail:{coordinates:this.coordinates}}))});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/goto-btn.css"),this.shadow.append(e)}}customElements.define("app-goto",We);class $e extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="material-symbols-outlined">add</span>
            <span class="label">Aggiungi</span>
            `,this.shadow.append(this.button),this.button.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("add-route"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/add-to-route-btn.css"),this.shadow.append(s)}}customElements.define("app-add-to-route",$e);class oe extends HTMLElement{constructor(){super();c(this,"_features");this.shadow=this.attachShadow({mode:"closed"}),this._features=[]}get features(){return this._features}set features(e){this._features=e,this.render()}render(){this.div.innerHTML="",this._features.length!=0?(this.startNavigationBtn.setAttribute("is-active","true"),this.startNavigationBtn.setAttribute("is-navigation","false"),this.generateInfobox(this.div,this.features),this.allInfoboxes=this.shadow.querySelectorAll("app-path-infobox"),this.pathTools=this.shadow.querySelector("app-path-tools"),this.allInfoboxes.forEach(e=>{e.addEventListener("goto",t=>{this.dispatchEvent(new CustomEvent("goto",{detail:t.detail.coordinates}))})}),this.allInfoboxes.forEach(e=>{e.addEventListener("remove",t=>{let i=t.detail.data;this.features=this.checkFeature(i),this.startNavigationBtn.setAttribute("is-navigation","false")})}),this.allInfoboxes.forEach(e=>{e.addEventListener("selectedFeature",t=>{this.pathTools.setAttribute("is-open","false");let i=t.detail.data;this.dispatchEvent(new CustomEvent("selectedFeature",{detail:{data:i}}))})}),this.drag()):(this.startNavigationBtn.setAttribute("is-active","false"),this.startNavigationBtn.setAttribute("is-navigation","false"),this.emptyMsg=document.createElement("app-empty-msg"),this.div.append(this.emptyMsg),this.emptyMsg.addEventListener("empty",()=>{this.dispatchEvent(new CustomEvent("empty")),this.setAttribute("is-open","false")}))}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="drawer">
                <div class="header">
                    <app-save-route-input></app-save-route-input>
                    <div class="header-tools">
                        <div class="path-tools-icon">
                            <span class="material-symbols-outlined">keyboard_arrow_down</span>
                        </div>
                        <div class="close-icon">
                            <span class="material-symbols-outlined">close</span>
                        </div>
                    </div>
                </div>
                <app-path-tools></app-path-tools>
                <div class="info-container"><app-empty-msg></app-empty-msg></div>
                <app-navigation></app-navigation>
            </div>
            `,this.pathToolsIcon=this.shadow.querySelector(".path-tools-icon"),this.pathTools=this.shadow.querySelector("app-path-tools"),this.closeIcon=this.shadow.querySelector(".close-icon"),this.saveRouteInput=this.shadow.querySelector("app-save-route-input"),this.div=this.shadow.querySelector(".info-container"),this.emptyMsg=this.shadow.querySelector("app-empty-msg"),this.startNavigationBtn=this.shadow.querySelector("app-navigation"),this.hasAttribute("route-name")||this.setAttribute("route-name","Nuovo percorso"),this.hasAttribute("is-navigation")||this.setAttribute("is-navigation","false"),this.setAttribute("is-open","false"),this.pathToolsIcon.addEventListener("click",()=>{const t=JSON.parse(this.pathTools.getAttribute("is-open"));this.pathTools.setAttribute("is-open",!t+"")}),this.pathTools.addEventListener("saveCustomRoute",()=>{const t=this.saveRouteInput.getAttribute("value");let i={};i.name=t,i.features=this.features,this.dispatchEvent(new CustomEvent("saveCustomRoute",{detail:{customRoute:i}}))}),this.pathTools.addEventListener("flush",()=>{this.features=[]}),this.pathTools.addEventListener("sort",t=>{this.dispatchEvent(new CustomEvent("sort",{detail:{features:this.features}}))}),this.closeIcon.addEventListener("click",()=>{this.setAttribute("is-open","false")}),this.startNavigationBtn.addEventListener("activateNavigation",t=>{const i=t.detail.isNavigation;this.setAttribute("is-navigation",i+"")}),this.emptyMsg.addEventListener("empty",()=>{this.dispatchEvent(new CustomEvent("empty")),this.setAttribute("is-open","false")}),this.div.addEventListener("drop",t=>{t.preventDefault();const i=JSON.parse(t.dataTransfer.getData("text/plain")),n=this._features.findIndex(l=>l.coordinates.longitude==i.coordinates.longitude),a=this.getNearestInfobox(t.clientY),r=this._features.findIndex(l=>l.coordinates.longitude==JSON.parse(a.getAttribute("data")).coordinates.longitude);this._features.splice(n,1),r!=-1?this._features.splice(r,0,i):this._features.push(i),this.features=this._features});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/path-drawer.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){if(i!=t&&t!=null){if(e=="is-open"&&(i=="true"?this.classList.add("visible"):this.classList.remove("visible"),this.dispatchEvent(new CustomEvent("pathDrawerStatusChanged",{detail:{newValue:i}}))),e=="is-navigation"){const n=i;this.dispatchEvent(new CustomEvent("activateNavigation",{detail:{features:this.features,isNavigation:n}})),this.startNavigationBtn.setAttribute("is-navigation",n+"")}e=="route-name"&&this.saveRouteInput.setAttribute("value",i)}}generateInfobox(e,t){for(let i=0;i<t.length;i++){const n=t[i],a=document.createElement("app-path-infobox");a.setAttribute("data",JSON.stringify(n)),i==t.length-1&&a.classList.add("last"),e.append(a)}}checkFeature(e){const t=this._features.findIndex(i=>JSON.stringify(i.properties)==JSON.stringify(e.properties));return this._features.splice(t,1),this._features}drag(){this.allInfoboxes.forEach(e=>{e.draggable=!0,e.addEventListener("dragstart",t=>{t.dataTransfer.setData("text/plain",e.getAttribute("data")),this.pathTools.setAttribute("is-open","false"),e.classList.add("dragging")}),this.div.addEventListener("dragover",t=>{t.preventDefault()}),e.addEventListener("dragend",()=>{e.classList.remove("dragging")})})}getNearestInfobox(e){let t=null,i=1/0;return this.allInfoboxes.forEach(n=>{const a=n.getBoundingClientRect(),r=Math.abs(a.top-e);r<i&&(i=r,t=n)}),t}}c(oe,"observedAttributes",["is-open","is-navigation","route-name"]);customElements.define("app-path-drawer",oe);class ae extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){this.getAttribute("is-open")=="true"?this.classList.add("active"):this.classList.remove("active")}connectedCallback(){this.shadow.innerHTML=`
            <app-save-route-btn></app-save-route-btn>
            <app-flush-btn></app-flush-btn>
            <app-sort-features-btn></app-sort-features-btn>
            `,this.hasAttribute("is-open")||this.setAttribute("is-open","false"),this.saveRouteBtn=this.shadow.querySelector("app-save-route-btn"),this.flushBtn=this.shadow.querySelector("app-flush-btn"),this.sortBtn=this.shadow.querySelector("app-sort-features-btn"),this.saveRouteBtn.addEventListener("saveCustomRoute",()=>{this.dispatchEvent(new CustomEvent("saveCustomRoute"))}),this.flushBtn.addEventListener("flush",()=>{this.dispatchEvent(new CustomEvent("flush"))}),this.sortBtn.addEventListener("sort",()=>{this.dispatchEvent(new CustomEvent("sort"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/path-tools.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){t!=e&&e!=null&&s=="is-open"&&this.render()}}c(ae,"observedAttributes",["is-open"]);customElements.define("app-path-tools",ae);class Xe extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.button=document.createElement("button"),this.button.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <span class="material-symbols-outlined">delete</span>
            `,this.shadow.append(this.button),this.button.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("flush"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/save-route-btn.css"),this.shadow.append(s)}}customElements.define("app-flush-btn",Xe);class Ke extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.button=document.createElement("button"),this.button.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <span class="material-symbols-outlined">sort</span>
            `,this.shadow.append(this.button),this.button.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("sort"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/save-route-btn.css"),this.shadow.append(s)}}customElements.define("app-sort-features-btn",Ke);class Ye extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <div>
                <img src="/images/undraw_my_current_location_re_whmt.svg" alt="Nessuna location">
                <h2>Ops!</h2>
                <p>Cerca dei punti di interesse ed aggiungili alla lista per iniziare il tuo percorso personalizzato.</p>
                <button>Aggiungi</button>
            </div>
            `,this.button=this.shadow.querySelector("button"),this.button.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("empty"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/empty-path-drawer-msg.css"),this.shadow.append(s)}}customElements.define("app-empty-msg",Ye);const C=class C extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"}),C.counter++}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="wrapper">
                <div class="info">
                    <div class="order">
                        <div class="drag-icon">
                            <span class="material-symbols-outlined">drag_indicator</span>
                        </div>
                        <p class="index"></p>
                    </div>
                    <div class="title">
                        <h4 class="name"></h4>
                        <p class="category"></p>
                    </div>
                    <app-remove-btn></app-remove-btn>
                </div>
            </div>
            `,this.data=JSON.parse(this.getAttribute("data")),this.info=this.shadow.querySelector(".info"),this.drag=this.shadow.querySelector(".drag-icon"),this.index=this.shadow.querySelector(".index"),this.name=this.shadow.querySelector(".name"),this.category=this.shadow.querySelector(".category"),this.removeBtn=this.shadow.querySelector("app-remove-btn");const s=this.data.properties;for(const t in s)if(s.hasOwnProperty(t)){const i=s[t];if(t=="Title"){this.category.innerText=i;continue}if(t=="Nome"){this.name.innerText=i;continue}}this.index.innerText=C.counter,this.removeBtn.addEventListener("remove",()=>{const t=new CustomEvent("remove",{detail:{data:this.data}});this.dispatchEvent(t)}),this.addEventListener("click",()=>{const t=new CustomEvent("selectedFeature",{detail:{data:this.data}});this.dispatchEvent(t)});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/path-infobox.css"),this.shadow.append(e)}attributeChangedCallback(s,e,t){}disconnectedCallback(){C.counter--}};c(C,"counter",0),c(C,"observedAttributes",[]);let H=C;customElements.define("app-path-infobox",H);class Ze extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.button=document.createElement("button"),this.button.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <span class="material-symbols-outlined">bookmark</span>
            `,this.shadow.append(this.button),this.button.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("saveCustomRoute"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/save-route-btn.css"),this.shadow.append(s)}}customElements.define("app-save-route-btn",Ze);class re extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){this.getAttribute("value")&&(this.input.value=this.getAttribute("value"))}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="container">
                <label for="title">
                    <span class="material-symbols-outlined">edit</span>
                </label>
                <input type="text" id="title">
            </div>
            `,this.input=this.shadow.querySelector("input"),this.getAttribute("value")||this.setAttribute("value","Nuovo percorso"),this.hasAttribute("value")&&(this.input.value=this.getAttribute("value")),this.input.addEventListener("input",()=>{this.setAttribute("value",this.input.value)});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/save-route-input.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){t!=e&&e!=null&&s=="value"&&this.render()}}c(re,"observedAttributes",["value"]);customElements.define("app-save-route-input",re);class Qe extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="material-symbols-outlined">close</span>
            `,this.shadow.append(this.button),this.button.addEventListener("click",e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent("remove"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/remove-btn.css"),this.shadow.append(s)}}customElements.define("app-remove-btn",Qe);class ce extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <div class="wrapper">
                <app-center-position></app-center-position>
                <app-zoom-btn></app-zoom-btn>
            </div>
            `,this.hasAttribute("is-route")||this.setAttribute("is-route","false"),this.positionBtn=this.shadow.querySelector("app-center-position"),this.zoomBtn=this.shadow.querySelector("app-zoom-btn"),this.positionBtn.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("centerPosition"))}),this.zoomBtn.addEventListener("zoomIn",()=>{this.dispatchEvent(new CustomEvent("zoomIn"))}),this.zoomBtn.addEventListener("zoomOut",()=>{this.dispatchEvent(new CustomEvent("zoomOut"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/map-controls.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){t!=e&&t!=null&&e!=null&&s=="is-route"&&(t=="true"?this.classList.add("visible"):this.classList.remove("visible"))}}c(ce,"observedAttributes",["is-route"]);customElements.define("app-map-controls",ce);class le extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="material-symbols-outlined">list</span>
            `,this.getAttribute("is-open")||this.setAttribute("is-open","false"),this.shadow.append(this.button),this.button.addEventListener("click",()=>{let e=JSON.parse(this.getAttribute("is-open"));this.setAttribute("is-open",!e+"")});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/path-drawer-toggle.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){t!=e&&t!=null&&e!=null&&s=="is-open"&&(this.dispatchEvent(new CustomEvent("togglePathDrawer",{detail:{newValue:t}})),t=="true"?this.classList.add("open"):this.classList.remove("open"))}}c(le,"observedAttributes",["is-open"]);customElements.define("app-path-drawer-toggle",le);class de extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.button=document.createElement("button"),this.button.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <span class="icon">
                <span class="material-symbols-outlined">my_location</span>
            </span>
            `,this.shadow.append(this.button),this.hasAttribute("is-open")||this.setAttribute("is-open",!1),this.button.addEventListener("click",()=>this.dispatchEvent(new CustomEvent("center-position")));const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/center-position-btn.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){t!=e&&e!=null&&s=="is-open"&&(t==="true"?this.classList.add("open"):this.classList.remove("open"))}}c(de,"observedAttributes",["is-open"]);customElements.define("app-center-position",de);class he extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="zoom-btns">
                <button class="zoom-in"><span class="material-symbols-outlined">add</span></button>
                <button class="zoom-out"><span class="material-symbols-outlined">remove</span></button>
            </div>
            `,this.zoomIn=this.shadow.querySelector(".zoom-in"),this.zoomOut=this.shadow.querySelector(".zoom-out"),this.zoomIn.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("zoomIn"))}),this.zoomOut.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("zoomOut"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/zoom-button.css"),this.shadow.append(s)}attributeChangedCallback(){}}c(he,"observedAttributes",[]);customElements.define("app-zoom-btn",he);const L=class L extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"}),L.snackbars.push(this)}render(){this.p.innerText=this.getAttribute("text")}connectedCallback(){const s=L.snackbars.indexOf(this);if(this.shadow.innerHTML=`
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
                `,this.content.append(this.button),this.button.addEventListener("click",()=>this.setAttribute("is-active","false"))),this.getAttribute("type")=="temporary"){let t;this.hasAttribute("timeout")?t=this.getAttribute("timeout"):t=3e3,this.getAttribute("text")==""&&this.setAttribute("text","Attendere..."),this.bar=document.createElement("div"),this.bar.classList.add("bar-color"),this.bar.style.setProperty("width","100%"),this.snackbar.append(this.bar);let i=100,n=setInterval(()=>{i==0&&(clearInterval(n),this.setAttribute("is-active","false")),i--,this.bar.style.width=i+"%"},t/100)}this.getAttribute("type")=="loader"&&this.getAttribute("text")==""&&this.setAttribute("text","Caricamento...");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/snackbar.css"),this.shadow.append(e),this.style.setProperty("bottom",`${24+64*s}px`)}attributeChangedCallback(s,e,t){t!=e&&t!=null&&e!=null&&(s=="text"&&this.render(),s=="is-active"&&t=="false"&&this.remove())}disconnectedCallback(){const s=L.snackbars.indexOf(this);s!==-1&&(L.snackbars.splice(s,1),this.updatePosition())}updatePosition(){L.snackbars.forEach((s,e)=>{s.style.setProperty("bottom",`${24+64*e}px`)})}};c(L,"snackbars",[]),c(L,"observedAttributes",["text","is-active"]);let B=L;customElements.define("app-snackbar",B);class ue extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){this.text=document.createElement("h1"),this.text.innerText="Seleziona i tag a cui sei interessato",this.shadow.append(this.text),this.container=document.createElement("div"),this.shadow.append(this.container),this.input=JSON.parse(this.getAttribute("input")),Ve(this.input).forEach(i=>{this.chip=document.createElement("app-chip"),this.chip.setAttribute("tag",i),this.container.append(this.chip)}),this.submit=document.createElement("app-submit-tags-btn"),this.shadow.append(this.submit),this.selectAll=document.createElement("app-select-all-tags-btn"),this.shadow.append(this.selectAll),this.reset=document.createElement("app-reset-tags-btn"),this.shadow.append(this.reset),this.clearLocalStorage=document.createElement("button"),this.clearLocalStorage.innerText="Clear local storage",this.shadow.append(this.clearLocalStorage),this.allChips=this.shadow.querySelectorAll("app-chip");let e=[];this.allChips.forEach(i=>{i.addEventListener("chipChanged",n=>{n.detail.newValue=="true"?e.push(n.detail.tag):e=e.filter(a=>a!==n.detail.tag),this.submit.setAttribute("tags",JSON.stringify(e))})}),localStorage.selectedTags&&JSON.parse(localStorage.selectedTags).forEach(n=>{this.allChips.forEach(a=>{a.getAttribute("tag")==n&&a.setAttribute("is-selected","true")})}),this.selectAll.addEventListener("selectAllTags",()=>{this.allChips.forEach(i=>{i.setAttribute("is-selected","true")})}),this.reset.addEventListener("resetTags",()=>{this.allChips.forEach(i=>{i.setAttribute("is-selected","false")})}),this.clearLocalStorage.addEventListener("click",()=>{localStorage.clear(),console.log(localStorage)});const t=document.createElement("link");t.setAttribute("rel","stylesheet"),t.setAttribute("href","./css/tag-selection.css"),this.shadow.append(t)}async connectedCallback(){const s=await g.instance.getData();this.setAttribute("input",JSON.stringify(s))}attributeChangedCallback(s,e,t){t!=e&&s=="input"&&this.render()}}c(ue,"observedAttributes",["input"]);customElements.define("app-tag-selection",ue);function Ve(o){let s=[];o.categories.forEach(t=>{t.groups.forEach(i=>{i.layers.forEach(n=>{n.tags&&n.tags.forEach(a=>{s.push(a)})})})});const e=[...new Set(s)];return e.sort(),e}class pe extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){this.getAttribute("is-selected")=="true"?(this.chip.classList.add("selected"),this.checkbox.checked=!0):(this.chip.classList.remove("selected"),this.checkbox.checked=!1)}connectedCallback(){this.shadow.innerHTML=`
            <label for="chip">
                <input type="checkbox" id="chip">
                <span class="chip-title"></span>               
            </label>
            `,this.chip=this.shadow.querySelector("label"),this.span=this.shadow.querySelector("span"),this.checkbox=this.shadow.querySelector("input"),this.hasAttribute("tag")&&(this.span.innerText=this.getAttribute("tag"));const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/chip.css"),this.shadow.append(s),this.checkbox.addEventListener("change",e=>{const t=e.target.checked;this.setAttribute("is-selected",t+"")})}attributeChangedCallback(s,e,t){if(s=="is-selected"&&t!=e){const i=new CustomEvent("chipChanged",{detail:{name:s,newValue:t,oldValue:e,tag:this.getAttribute("tag")}});this.dispatchEvent(i),this.render()}}}c(pe,"observedAttributes",["is-selected"]);customElements.define("app-chip",pe);class me extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){JSON.parse(this.getAttribute("tags")).length===0?this.btn.disabled=!0:this.btn.disabled=!1}connectedCallback(){this.shadow.innerHTML=`
            <button type="submit">Submit</button>
            `,this.btn=this.shadow.querySelector("button"),this.hasAttribute("tags")||(this.btn.disabled=!0),this.btn.addEventListener("click",()=>{localStorage.setItem("selectedTags",this.getAttribute("tags")),window.location.href="/#/map"});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/primary-btn.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){s=="tags"&&t!=e&&this.render()}}c(me,"observedAttributes",["tags"]);customElements.define("app-submit-tags-btn",me);class et extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.btn=document.createElement("button"),this.btn.innerText="Select all",this.shadow.append(this.btn),this.btn.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("selectAllTags"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/secondary-btn.css"),this.shadow.append(s)}}customElements.define("app-select-all-tags-btn",et);class tt extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.btn=document.createElement("button"),this.btn.innerText="Reset",this.shadow.append(this.btn),this.btn.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("resetTags"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/secondary-btn.css"),this.shadow.append(s)}}customElements.define("app-reset-tags-btn",tt);const st=`/* packages/widgets/Source/shared.css */
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
`;class it extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.viewer=new Cesium.Viewer(this.shadow,{baseLayerPicker:!1,geocoder:!1,timeline:!1,animation:!1,homeButton:!1,navigationInstructionsInitiallyVisible:!1,navigationHelpButton:!1,sceneModePicker:!1,fullscreenButton:!1,infoBox:!1}),this.viewer.screenSpaceEventHandler.setInputAction(t=>{this.dispatchEvent(new CustomEvent("map-click",{detail:{movement:t}}))},Cesium.ScreenSpaceEventType.LEFT_CLICK),this.viewer.screenSpaceEventHandler.setInputAction(t=>{this.mouseOver(t)},Cesium.ScreenSpaceEventType.MOUSE_MOVE);const s=document.createElement("style");s.innerHTML=st,this.shadow.append(s);const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/cesium.css"),this.shadow.append(e)}getEntity(s){const e=s.position;return this.viewer.scene.pick(e)}setCameraToPosition(s){const e=Cesium.Cartesian3.fromDegrees(s.longitude,s.latitude,2e3);this.viewer.camera.flyTo({destination:e,orientation:{heading:Cesium.Math.toRadians(0),pitch:Cesium.Math.toRadians(-90),roll:0},duration:.5})}createUserPin(s){this.viewer.entities.add({name:"user_pin",position:Cesium.Cartesian3.fromDegrees(s.longitude,s.latitude,0),ellipse:{semiMinorAxis:20,semiMajorAxis:20,height:0,material:Cesium.Color.BLUE,outline:!0,outlineColor:Cesium.Color.WHITE,outlineWidth:200}})}mouseOver(s){const e=s.endPosition,t=this.viewer.scene.pick(e);Cesium.defined(t)&&Cesium.defined(t.id)?document.body.style.cursor="pointer":document.body.style.cursor="default"}changeTheme(s){const e=this.viewer.imageryLayers._layers[1];if(this.viewer.imageryLayers.remove(e),Object.keys(s).length!=0){const t=this.getImageryProvider(s.url,s.layer,s.credit);this.viewer.imageryLayers.addImageryProvider(t)}}getImageryProvider(s,e,t){return new Cesium.WebMapTileServiceImageryProvider({url:s,layer:e,style:"default",format:"image/jpeg",maximumLevel:19,tileMatrixSetID:"default",credit:new Cesium.Credit(t)})}async loadLayers(s){const e=s.map(t=>this.createlayer(t).then(i=>({layer:t,data:i})));await Promise.all(e).then(async t=>{this.viewer.dataSources.removeAll(),await Promise.all(t.map(async i=>{const n=await i.data.layer;this.viewer.dataSources.add(n),this.styleEntities(n,i.layer.style)}))})}async createlayer(s){console.log(s);const e=`${s.layer_url_wfs}?service=WFS&typeName=${s.layer}&outputFormat=application/json&request=GetFeature&srsname=EPSG:4326`;return fetch(e).then(t=>t.json()).then(t=>this.createAdditionalProperties(t,s.name)).then(t=>({features:t.features,layer:Cesium.GeoJsonDataSource.load(t)})).catch(t=>{throw console.error(t),t})}createAdditionalProperties(s,e){return s.features=s.features.map((t,i)=>(t.properties.raiseName=e+" "+i,t)),s}styleEntities(s,e){let t="YELLOW",i="YELLOW",n=.5;e&&e.color&&(t=e.color.toUpperCase(),i=e.color.toUpperCase()),e&&e.opacity&&(n=e.opacity),s.entities.values.forEach(a=>{switch(!0){case Cesium.defined(a.polyline):a.polyline.material=Cesium.Color.fromCssColorString(t).withAlpha(parseFloat(n)),a.polyline.width=2;break;case Cesium.defined(a.billboard):a.billboard=void 0,a.point=new Cesium.PointGraphics({pixelSize:8,color:Cesium.Color.fromCssColorString(i).withAlpha(.5),outlineColor:Cesium.Color.fromCssColorString(i),outlineWidth:1});break;case Cesium.defined(a.polygon):a.polygon.material=Cesium.Color.fromCssColorString(t).withAlpha(parseFloat(n)),a.polygon.outlineColor=Cesium.Color.fromCssColorString(t).withAlpha(parseFloat(n));break}})}}customElements.define("app-cesium",it);class be extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){switch(this.getAttribute("active-tab")){case"info":this.suggestedRouteContent.classList.remove("active"),this.customRouteContent.classList.remove("active"),this.infoContent.classList.add("active"),this.tabs.forEach(e=>{e.id==="info-tab"?e.classList.add("active-tab"):e.classList.remove("active-tab")});break;case"suggested-route":this.suggestedRouteContent.classList.add("active"),this.customRouteContent.classList.remove("active"),this.infoContent.classList.remove("active"),this.tabs.forEach(e=>{e.id==="suggested-route-tab"?e.classList.add("active-tab"):e.classList.remove("active-tab")});break;case"custom-route":this.suggestedRouteContent.classList.remove("active"),this.customRouteContent.classList.add("active"),this.infoContent.classList.remove("active"),this.tabs.forEach(e=>{e.id==="custom-route-tab"?e.classList.add("active-tab"):e.classList.remove("active-tab")});break;default:this.suggestedRouteContent.classList.remove("active"),this.customRouteContent.classList.remove("active"),this.infoContent.classList.add("active"),this.tabs.forEach(e=>{e.id==="info-tab"?e.classList.add("active-tab"):e.classList.remove("active-tab")});break}this.isOpen==!0?this.classList.add("visible"):this.classList.remove("visible")}connectedCallback(){this.shadow.innerHTML=`
            <div class="toggle">
                <div class="close"></div>
            </div>
            <div class="controller">
                <ul class="tabs">
                    <li class="tab" id="info-tab">INFO</li>
                    <li class="tab" id="suggested-route-tab">PERCORSI SUGGERITI</li>
                    <li class="tab" id="custom-route-tab">PERCORSO CUSTOM</li>
                </ul>
            </div>
            <div class="contents">
                <div class="content info-content"><app-tab-info></app-tab-info></div>
                <div class="content suggested-route-content">PERCORSI SUGGERITI</div>
                <div class="content custom-route-content"><app-tab-custom-route></app-tab-custom-route></div>
            </div>
            `,this.hasAttribute("is-open")||this.setAttribute("is-open",!1),this.hasAttribute("active-tab")||this.setAttribute("active-tab","info"),this.isOpen=JSON.parse(this.getAttribute("is-open")),this.toggle=this.shadow.querySelector(".toggle"),this.tabs=this.shadow.querySelectorAll(".tab"),this.infoTab=this.shadow.querySelector("#info-tab"),this.suggestedRouteTab=this.shadow.querySelector("#suggested-route-tab"),this.customRouteTab=this.shadow.querySelector("#custom-route-tab"),this.infoContent=this.shadow.querySelector(".info-content"),this.infoComponent=this.shadow.querySelector("app-tab-info"),this.suggestedRouteContent=this.shadow.querySelector(".suggested-route-content"),this.customRouteContent=this.shadow.querySelector(".custom-route-content"),this.customRouteComponent=this.shadow.querySelector("app-tab-custom-route"),this.infoTab.addEventListener("click",()=>this.setAttribute("active-tab","info")),this.suggestedRouteTab.addEventListener("click",()=>this.setAttribute("active-tab","suggested-route")),this.customRouteTab.addEventListener("click",()=>this.setAttribute("active-tab","custom-route")),this.toggle.addEventListener("click",()=>this.setAttribute("is-open",!this.isOpen)),this.infoList=this.shadow.querySelector("app-tab-info"),p.instance.subscribe("addtoroutebtn-click",e=>{this.setAttribute("active-tab","custom-route")});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/tabs-controller.css"),this.shadow.append(s)}attributeChangedCallback(s,e,t){t!=e&&e!=null&&(s=="is-open"&&(this.isOpen=JSON.parse(t),this.dispatchEvent(new CustomEvent("tabs-toggle",{detail:{isOpen:this.isOpen}})),this.render()),s=="active-tab"&&this.render())}addFeature(s){this.infoList.checkFeature(s)}}c(be,"observedAttributes",["is-open","active-tab"]);customElements.define("app-tabs",be);class nt extends HTMLElement{constructor(){super();c(this,"_isGrabbed");c(this,"_startX");c(this,"_scrollLeft");c(this,"_features");this.shadow=this.attachShadow({mode:"closed"}),this.features=[]}get features(){return this._features}set features(e){this._features=e}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="left-arrow icon">
                <span class="material-symbols-outlined">keyboard_arrow_left</span>
            </div>
            <div class="right-arrow icon">
                <span class="material-symbols-outlined">keyboard_arrow_right</span>
            </div>
            `,this.leftArrow=this.shadow.querySelector(".left-arrow"),this.rightArrow=this.shadow.querySelector(".right-arrow"),this.addEventListener("touchstart",t=>this.start(t)),this.addEventListener("mousedown",t=>this.start(t)),this.addEventListener("mousemove",t=>this.move(t)),this.addEventListener("touchmove",t=>this.move(t)),this.addEventListener("mouseup",this.end),this.addEventListener("touchend",this.end),this.addEventListener("mouseleave",this.end),this.leftArrow.addEventListener("click",()=>{const t=this.scrollLeft-this.clientWidth-24;this.scrollTo({left:t,behavior:"smooth"})}),this.rightArrow.addEventListener("click",()=>{const t=this.scrollLeft+this.clientWidth+24;this.scrollTo({left:t,behavior:"smooth"})});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/tab-info.css"),this.shadow.append(e)}start(e){this.isGrabbed=!0,this._startX=e.pageX||e.touches[0].pageX-this.offsetLeft,this._scrollLeft=this.scrollLeft}move(e){if(this.isGrabbed==!1)return;e.preventDefault();const i=((e.pageX||e.touches[0].pageX-this.offsetLeft)-this._startX)*3;this.scrollLeft=this._scrollLeft-i}end(){this.isGrabbed=!1}checkFeature(e){if(!this.features.some(i=>i.id===e.id))this.createCard(e);else{let i=this.features.findIndex(n=>n.id===e.id);this.removeCard(i),this.createCard(e)}}createCard(e){let t=document.createElement("app-info-card");this.shadow.prepend(t),t.feature=e,this.features.unshift(e),this.scrollLeft=0,t.addEventListener("remove-card",()=>{let i=this.features.findIndex(n=>n.id===e.id);this.removeCard(i)})}removeCard(e){this.shadow.querySelectorAll("app-info-card")[e].remove(),this.features.splice(e,1)}}customElements.define("app-tab-info",nt);class ot extends HTMLElement{constructor(){super();c(this,"_feature");this.shadow=this.attachShadow({mode:"closed"}),this.colorManager=new M}get feature(){return this._feature}set feature(e){this._feature=e,this.render()}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="wrapper">
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
                    <div class="tools"></div>
                    <app-expand-info-btn></app-expand-info-btn>
                </div>
            </div>
            `,this.close=this.shadow.querySelector(".close-icon"),this.info=this.shadow.querySelector(".info"),this.header=this.shadow.querySelector(".header"),this.legend=this.shadow.querySelector(".legend"),this.name=this.shadow.querySelector(".name"),this.category=this.shadow.querySelector(".category"),this.tools=this.shadow.querySelector(".tools"),this.infoBtn=this.shadow.querySelector("app-expand-info-btn"),this.close.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("remove-card"))}),this.infoBtn.addEventListener("expand-info",()=>{document.dispatchEvent(new CustomEvent("expand-info",{detail:{feature:this.feature}}))}),this.header.addEventListener("click",()=>{p.instance.publish("tabinfocard-click",this.feature)});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/tab-info-card.css"),this.shadow.append(e)}render(){const e=this.feature.properties;let t=!1;for(const n in e)if(e.hasOwnProperty(n)){const a=e[n];n=="raiseName"&&(this.name.innerText=e.raiseName),n=="nome"&&(this.category.innerText=a,t=!0),t||(this.category.innerText=e.raiseName)}if(this.colorManager.hex=this.feature.layer.style.color,this.colorManager.rgba=this.colorManager.convertHexToRgba(this.colorManager.hex),this.legend.style.backgroundColor=this.colorManager.changeOpacity(this.colorManager.rgba,.25),this.legend.style.borderColor=this.colorManager.rgba,this.legend.style.borderWidth="2px",this.legend.style.borderStyle="solid",this.feature.coordinatesArray.length>1)return;const i={};i.longitude=this.feature.startingcoordinates.longitude,i.latitude=this.feature.startingcoordinates.latitude,this.goToBtn=document.createElement("app-goto"),this.goToBtn.coordinates=i,this.tools.append(this.goToBtn),this.goToBtn.addEventListener("go-to",n=>{this.goTo(n.detail.coordinates)}),this.addToRouteBtn=document.createElement("app-add-to-route"),this.tools.append(this.addToRouteBtn),this.addToRouteBtn.addEventListener("add-route",()=>{p.instance.publish("addtoroutebtn-click",this.feature)})}goTo(e){const t=`https://www.google.com/maps/dir/?api=1&destination=${e.latitude},${e.longitude}`;window.open(t,"_blank")}}customElements.define("app-info-card",ot);class at extends HTMLElement{constructor(){super();c(this,"_isGrabbed");c(this,"_features");this.shadow=this.attachShadow({mode:"closed"}),this.isGrabbed=!1,this.features=[]}get features(){return this._features}set features(e){this._features=e}get isGrabbed(){return this._isGrabbed}set isGrabbed(e){this._isGrabbed=e}connectedCallback(){p.instance.subscribe("addtoroutebtn-click",t=>{this.checkFeature(t),this.resetOrder()}),this.addEventListener("mousedown",t=>this.start(t)),this.addEventListener("touchstart",t=>this.start(t)),this.addEventListener("mousemove",t=>this.move(t)),this.addEventListener("touchmove",t=>this.move(t)),this.addEventListener("mouseup",this.end),this.addEventListener("touchend",this.end),this.addEventListener("mouseleave",this.end);const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/tab.customroute.component.css"),this.shadow.append(e)}start(e){this.isGrabbed=!0,this._startX=e.pageX||e.touches[0].pageX-this.offsetLeft,this._scrollLeft=this.scrollLeft}move(e){if(this.isGrabbed==!1)return;e.preventDefault();const i=(e.pageX||e.touches[0].pageX-this.offsetLeft)-this._startX;this.scrollLeft=this._scrollLeft-i}end(){this.isGrabbed=!1}checkFeature(e){if(!this.features.some(i=>i.id===e.id))this.createCard(e);else{let i=this.features.findIndex(n=>n.id===e.id);this.removeCard(i),this.createCard(e)}}createCard(e){let t=document.createElement("app-tab-custom-route-card");t.feature=e,this.features.unshift(e),this.shadow.prepend(t),this.scrollLeft=0,t.addEventListener("remove-card",()=>{let i=this.features.findIndex(n=>n.id===e.id);this.removeCard(i)}),t.addEventListener("increase-order",()=>{let i=this.features.findIndex(r=>r.id===e.id),n=i+1;this.features.splice(i,1),this.features.splice(n,0,e);let a=this.shadow.querySelectorAll("app-tab-custom-route-card");a[n]&&(a[n].insertAdjacentElement("afterend",a[i]),this.resetOrder())}),t.addEventListener("decrease-order",()=>{let i=this.features.findIndex(r=>r.id===e.id),n=i-1;this.features.splice(i,1),this.features.splice(n,0,e);let a=this.shadow.querySelectorAll("app-tab-custom-route-card");a[n]&&(this.shadow.insertBefore(a[i],a[n]),this.resetOrder())})}removeCard(e){this.shadow.querySelectorAll("app-tab-custom-route-card")[e].remove(),this.features.splice(e,1)}resetOrder(){this.cards=this.shadow.querySelectorAll("app-tab-custom-route-card");let e=1;this.cards.forEach(t=>{t.setAttribute("order",e),e++})}}customElements.define("app-tab-custom-route",at);class ge extends HTMLElement{constructor(){super();c(this,"_feature");c(this,"_order");this.shadow=this.attachShadow({mode:"closed"}),this.colorManager=new M}get feature(){return this._feature}set feature(e){this._feature=e}get order(){return this._order}set order(e){this._order=e}render(){this.num.innerHTML=this.order}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <div class="component">
                <div class="change-order">
                    <div class="up-arrow icon">
                        <span class="material-symbols-outlined">keyboard_arrow_up</span>
                    </div>
                    <div class="number"></div>
                    <div class="down-arrow icon">
                        <span class="material-symbols-outlined">keyboard_arrow_down</span>
                    </div>
                </div>
                <div class="info">
                    <div class="title">
                        <span class="legend"></span>
                        <h4 class="name"></h4>
                    </div>
                    <p class="category"></p>
                </div>
                <div class="remove-icon">
                    <span class="material-symbols-outlined">close</span>
                </div>
            </div>
            `,this.wrapper=this.shadow.querySelector(".component"),this.upArrow=this.shadow.querySelector(".up-arrow"),this.downArrow=this.shadow.querySelector(".down-arrow"),this.num=this.shadow.querySelector(".number"),this.legend=this.shadow.querySelector(".legend"),this.name=this.shadow.querySelector(".name"),this.category=this.shadow.querySelector(".category"),this.close=this.shadow.querySelector(".remove-icon"),this.upArrow.addEventListener("click",t=>{t.stopImmediatePropagation(),this.dispatchEvent(new CustomEvent("decrease-order"))}),this.downArrow.addEventListener("click",t=>{t.stopImmediatePropagation(),this.dispatchEvent(new CustomEvent("increase-order"))}),this.name.innerHTML=this.feature.properties.raiseName,this.category.innerHTML=this.feature.layer.name,this.colorManager.hex=this.feature.layer.style.color,this.colorManager.rgba=this.colorManager.convertHexToRgba(this.colorManager.hex),this.legend.style.backgroundColor=this.colorManager.changeOpacity(this.colorManager.rgba,.25),this.legend.style.borderColor=this.colorManager.rgba,this.legend.style.borderWidth="2px",this.legend.style.borderStyle="solid",this.wrapper.addEventListener("click",t=>{p.instance.publish("customroutecard-click",this.feature)}),this.close.addEventListener("click",t=>{t.stopPropagation(),this.dispatchEvent(new CustomEvent("remove-card"))});const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/tab.customroute.card.component.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){i!=t&&e=="order"&&(this.order=i,this.render())}}c(ge,"observedAttributes",["order"]);customElements.define("app-tab-custom-route-card",ge);class fe extends HTMLElement{constructor(){super();c(this,"_feature");this.shadow=this.attachShadow({mode:"closed"}),this.colorManager=new M}get feature(){return this._feature}set feature(e){this._feature=e,this.render()}render(){this.category.innerText="",this.name.innerText="",this.content.innerHTML="";const e=this.feature.properties;e.nome?this.category.innerText=e.nome:this.category.innerText=e.raiseName,this.name.innerHTML=e.raiseName;for(const t in e)if(e.hasOwnProperty(t)){const i=e[t];if(t=="raiseName"||t=="nome")continue;const n=document.createElement("div");n.classList.add("argument");const a=document.createElement("h4"),r=t.replace(/([A-Z])/g," $1"),l=r.charAt(0).toUpperCase()+r.slice(1);a.innerHTML=l,n.append(a);const d=document.createElement("p");d.innerText=i,n.append(d),this.content.append(n)}this.colorManager.hex=this.feature.layer.style.color,this.colorManager.rgba=this.colorManager.convertHexToRgba(this.colorManager.hex),this.legend.style.backgroundColor=this.colorManager.changeOpacity(this.colorManager.rgba,.25),this.legend.style.borderColor=this.colorManager.rgba,this.legend.style.borderWidth="2px",this.legend.style.borderStyle="solid",this.playBtn.addEventListener("read-info",()=>{const t=new SpeechSynthesisUtterance;t.lang="it";const i=this.shadow.querySelector(".content").innerHTML;t.text=i,window.speechSynthesis.speak(t)})}connectedCallback(){this.shadow.innerHTML=`
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
            `,this.setAttribute("is-open",!1),this.close=this.shadow.querySelector(".close-icon"),this.info=this.shadow.querySelector(".info"),this.legend=this.shadow.querySelector(".legend"),this.name=this.shadow.querySelector(".name"),this.category=this.shadow.querySelector(".category"),this.tools=this.shadow.querySelector(".tools"),this.content=this.shadow.querySelector(".content"),this.playBtn=this.shadow.querySelector("app-play-info-btn"),document.addEventListener("expand-info",t=>{this.setAttribute("is-open",!0),this.feature=t.detail.feature}),this.close.addEventListener("click",()=>this.setAttribute("is-open",!1));const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/info.drawer.component.css"),this.shadow.append(e)}attributeChangedCallback(e,t,i){i!=t&&t!=null&&e=="is-open"&&(i=="true"?this.openDrawer():this.closeDrawer())}openDrawer(){this.classList.remove("close"),this.classList.add("open")}closeDrawer(){this.classList.remove("open"),this.classList.add("close")}}c(fe,"observedAttributes",["is-open"]);customElements.define("app-info",fe);class rt extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="material-symbols-outlined">info</span>
            <span class="label">Leggi informazioni</span>
            `,this.shadow.append(this.button),this.button.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("expand-info"))});const s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("href","./css/expandInfoBtn.component.css"),this.shadow.append(s)}}customElements.define("app-expand-info-btn",rt);class ye extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}render(){}connectedCallback(){this.shadow.innerHTML=`
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            `,this.button=document.createElement("button"),this.button.innerHTML=`
            <span class="icon">
                <span class="material-symbols-outlined">layers</span>
            </span>
            `,this.shadow.append(this.button),this.setAttribute("is-open","false");let s=this.getAttribute("is-open");this.btn=this.shadow.querySelector("button");const e=document.createElement("link");e.setAttribute("rel","stylesheet"),e.setAttribute("href","./css/bench.toggle.component.css"),this.shadow.append(e),this.btn.addEventListener("click",()=>{s=this.getAttribute("is-open")==="true",this.setAttribute("is-open",!s+"")})}attributeChangedCallback(s,e,t){if(t!=e&&s=="is-open"){const i=new CustomEvent("bench-toggle",{detail:{isOpen:t}});this.dispatchEvent(i)}}}c(ye,"observedAttributes",["is-open"]);customElements.define("app-bench-toggle",ye);const ct="./json/categories.json",lt="./json/themes.json";let dt=()=>"<app-map></app-map>",ht=()=>"<app-tag-selection></app-tag-selection>";const ut=document.querySelector("app-router"),pt={index:{routingFunction:ht,type:"default"},map:{routingFunction:dt,type:"map"}};ut.addRoutes(pt);const D=document.querySelector("main"),I=document.querySelector("app-drawer-toggle"),G=document.querySelector("#drawer"),N=document.querySelector("app-searchbar"),z=document.querySelector("app-autocomplete"),O=document.querySelector("app-carousel"),_=document.querySelector("app-bench"),ve=document.querySelector("app-theme-icon");document.querySelector("app-drawer");const f=document.querySelector("app-path-drawer"),we=document.querySelector("app-path-drawer-toggle"),R=document.querySelector("app-map-controls"),T=document.querySelector("app-rail"),A=document.querySelector("app-info-drawer"),u=new xe;R.addEventListener("zoomIn",()=>u.viewer.camera.zoomIn(1e3));R.addEventListener("zoomOut",()=>u.viewer.camera.zoomOut(1e3));u.fetchThemes(lt).then(o=>{T.setAttribute("themes",JSON.stringify(o)),ve.themes=o});ve.addEventListener("themechange",o=>{u.changeTheme(o.detail.theme)});T.addEventListener("themeChanged",o=>{const s=o.detail.newValue;u.changeTheme(s)});I.addEventListener("drawerToggled",o=>{const s=o.detail.isOpen;_.setAttribute("is-open",s)});T.addEventListener("drawerToggled",o=>{o.detail.newValue=="true"?(A.setAttribute("is-open","false"),G.classList.add("drawer-open")):G.classList.remove("drawer-open")});A.addEventListener("goto",o=>{const s=o.detail;u.goto(s)});A.addEventListener("addToRoute",o=>{let s=f.features,e=o.detail.data;if(!s.some(t=>JSON.stringify(t)===JSON.stringify(e)))s.push(e);else{let t=document.createElement("app-snackbar");t.setAttribute("type","temporary"),t.setAttribute("text","Tappa già presente nel percorso."),D.append(t)}f.features=s,f.setAttribute("is-open","true")});u.viewer.screenSpaceEventHandler.setInputAction(o=>{u.mouseOver(o)},Cesium.ScreenSpaceEventType.MOUSE_MOVE);const Ee=[];for(let o=0;o<=2;o++)Te(o+2).then(s=>Ee.push(s));we.addEventListener("togglePathDrawer",o=>{const s=o.detail.newValue;f.setAttribute("is-open",s+"")});f.addEventListener("goto",o=>{const s=o.detail;u.goto(s)});f.addEventListener("pathDrawerStatusChanged",o=>{const s=o.detail.newValue;R.setAttribute("is-route",s+""),we.setAttribute("is-open",s+"")});f.addEventListener("empty",()=>T.setAttribute("is-open","true"));f.addEventListener("selectedFeature",o=>{const s=o.detail.data;u.setCameraToPosition(s.coordinates),A.setAttribute("data",JSON.stringify(s)),A.setAttribute("is-open","true"),T.setAttribute("is-open","false")});f.addEventListener("saveCustomRoute",o=>{localStorage.setItem("customRoute",JSON.stringify(o.detail.customRoute));let s=document.createElement("app-snackbar");s.setAttribute("type","closable"),s.setAttribute("text",`Salvato percorso "${o.detail.customRoute.name}".`),D.append(s)});f.addEventListener("activateNavigation",o=>{if(o.detail.isNavigation=="true"){const s=o.detail.features;u.startNavigation(s)}else{const s=u.viewer.entities;u.removeAllEntities(s)}});f.addEventListener("sort",o=>{j().then(s=>{let e=o.detail.features,t={};t.longitude=s.coords.longitude,t.latitude=s.coords.latitude;const i=100,n=300,a=Ie(e,i);a.forEach(d=>d.unshift({coordinates:t}));const l=_e(a,n).slice(1);f.features=l})});O.addEventListener("activeLayers",o=>{u.handleCheckbox(o.detail.activeLayers,Ee)});O.addEventListener("benchlayer",o=>{_.addLayer(o.detail.layer),I.setAttribute("is-open",!0)});_.addEventListener("restorelayer",o=>{let s=o.detail.layer;O.addLayer(s)});_.addEventListener("click",()=>{I.setAttribute("is-open",!1)});_.addEventListener("benchempty",()=>{I.setAttribute("is-open",!1)});N.addEventListener("lastKey",o=>{o.detail.lastKey=="ArrowDown"&&z.setAttribute("last-key",o.detail.lastKey)});z.addEventListener("changeFocus",()=>{N.focusInput()});z.addEventListener("selectedtag",o=>{N.selectedTag=o.detail.selectedTag});try{let o=document.createElement("app-snackbar");o.setAttribute("type","loader"),D.append(o),Se(ct).then(s=>{g.instance.data=s;let e=Ce(s,JSON.parse(localStorage.selectedTags)),t=mt(e);O.data=t}),u.viewer.screenSpaceEventHandler.setInputAction(async s=>{T.setAttribute("is-open","false");const e=u.onClick(s,g.instance.data);if(e==null){A.setAttribute("is-open","false"),f.setAttribute("is-open","false"),I.setAttribute("is-open","false");return}A.setAttribute("data",`${JSON.stringify(e)}`),A.setAttribute("is-open","true")},Cesium.ScreenSpaceEventType.LEFT_CLICK)}catch(o){console.error("Errore durante il recupero dei dati JSON",o)}finally{document.querySelector('app-snackbar[type="loader"]').setAttribute("is-active","false")}try{j().then(o=>{u.setCameraToUserPosition(o),u.createUserPin(o),R.addEventListener("centerPosition",()=>u.setCameraToUserPosition(o))})}catch(o){console.error(o),u.setCamera()}function mt(o){let s=[];return o.categories.forEach(e=>{e.groups.forEach(t=>{t.layers.forEach(i=>{s.push(i)})})}),s}
