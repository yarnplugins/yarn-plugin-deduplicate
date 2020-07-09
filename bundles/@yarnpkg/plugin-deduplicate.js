/* eslint-disable */
module.exports = {
name: "@yarnpkg/plugin-deduplicate",
factory: function (require) {
var plugin;plugin=(()=>{"use strict";var e={587:(e,t,o)=>{o.r(t),o.d(t,{default:()=>l});var r=o(594),s=o(966),n=o(42),a=o(513),i=function(e,t,o,r){var s,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,r);else for(var i=e.length-1;i>=0;i--)(s=e[i])&&(a=(n<3?s(a):n>3?s(t,o,a):s(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};class c extends r.BaseCommand{async execute(){const e=await s.Configuration.find(this.context.cwd,this.context.plugins),{project:t}=await s.Project.find(e,this.context.cwd),o=await s.StreamReport.start({configuration:e,stdout:this.context.stdout,includeFooter:!1},async e=>{e.startTimerSync("deduplication step",()=>{!function(e,t){const o=new Map;for(const[t,r]of e.storedResolutions.entries()){const s=r,n=e.storedDescriptors.get(t).identHash,a=o.get(n);void 0===a?o.set(n,new Set([s])):o.set(n,a.add(s))}for(const r of e.storedResolutions.keys()){const n=e.storedDescriptors.get(r),i=o.get(n.identHash),c=n.range.match(/^npm:(.*)$/);if(null!==c&&(void 0!==i&&i.size>1)){const o=Array.from(i).map(t=>{const o=e.storedPackages.get(t);if(void 0===o)return console.warn(`Can't find package for locator hash '${t}'`),null;if(s.structUtils.isVirtualLocator(o)){const t=s.structUtils.devirtualizeLocator(o);return e.storedPackages.get(t.locatorHash)}return o}).filter(e=>null!==e&&(null!==e.version&&a.satisfies(e.version,c[1]))).sort((e,t)=>a.gt(e.version,t.version)?-1:1);if(o.length>1){const a=o[0].locatorHash,i=e.storedResolutions.get(r),c=e.storedPackages.get(a),l=e.storedPackages.get(i);!1===s.structUtils.areLocatorsEqual(l,c)&&(t.reportInfo(s.MessageName.UNNAMED,`${s.structUtils.stringifyDescriptor(n)} can be deduplicated from ${l.name}@${l.version} to ${c.name}@${c.version}`),e.storedResolutions.set(r,a))}}}}(t,e)})});if(o.hasErrors())return o.exitCode();const r=await s.Cache.find(e);return(await s.StreamReport.start({configuration:e,stdout:this.context.stdout,includeLogs:!0},async e=>{await t.install({cache:r,report:e})})).exitCode()}}c.usage=n.Command.Usage({category:"Workspace-related commands",description:"Reduces dependencies with overlapping ranges to a smaller set of packages",details:"https://github.com/atlassian/yarn-deduplicate for yarn v2",examples:[]}),i([n.Command.Path("deduplicate")],c.prototype,"execute",null);const l={commands:[c]}},594:e=>{e.exports=require("@yarnpkg/cli")},966:e=>{e.exports=require("@yarnpkg/core")},42:e=>{e.exports=require("clipanion")},513:e=>{e.exports=require("semver")}},t={};function o(r){if(t[r])return t[r].exports;var s=t[r]={exports:{}};return e[r](s,s.exports,o),s.exports}return o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o(587)})();
return plugin;
}
};