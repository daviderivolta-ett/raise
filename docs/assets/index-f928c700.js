import{f as s}from"./snackbar-6caacc16.js";class n extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.btn=document.createElement("button"),this.btn.innerText="Select all",this.shadow.append(this.btn),this.btn.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("selectAllTags"))});const t=document.createElement("link");t.setAttribute("rel","stylesheet"),t.setAttribute("href","./css/secondary-btn.css"),this.shadow.append(t)}}customElements.define("app-select-all-tags-btn",n);class a extends HTMLElement{constructor(){super(),this.shadow=this.attachShadow({mode:"closed"})}connectedCallback(){this.btn=document.createElement("button"),this.btn.innerText="Reset",this.shadow.append(this.btn),this.btn.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("resetTags"))});const t=document.createElement("link");t.setAttribute("rel","stylesheet"),t.setAttribute("href","./css/secondary-btn.css"),this.shadow.append(t)}}customElements.define("app-reset-tags-btn",a);const c=document.querySelector("main"),o=document.querySelector("app-tag-selection"),r="./json/categories.json";try{let e=document.createElement("app-snackbar");e.setAttribute("type","loader"),c.append(e),s(r).then(t=>{o.setAttribute("input",JSON.stringify(t))})}catch(e){console.error("Errore durante il recupero dei dati JSON",e)}finally{document.querySelector('app-snackbar[type="loader"]').setAttribute("is-active","false")}